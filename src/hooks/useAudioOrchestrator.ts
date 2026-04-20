import { useState, useRef, useCallback } from 'react';

type Segment = { type: 'text', content: string } | { type: 'audio', filename: string };

export function useAudioOrchestrator() {
    const [playingMessageId, setPlayingMessageId] = useState<number | null>(null);
    const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);
    const stopRef = useRef(false);

    const stop = useCallback(() => {
        setPlayingMessageId(null);
        setActiveSegmentIndex(null);
        stopRef.current = true;
        
        // Cancel speech synthesis
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        // Pause all HTML5 audios
        document.querySelectorAll('audio').forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
    }, []);

    const playMessage = useCallback(async (messageId: number, markdownMessage: string) => {
        stop(); // stop any current playback
        
        // slight delay to ensure 'stop' propagates state
        await new Promise(res => setTimeout(res, 50)); 
        
        stopRef.current = false;
        setPlayingMessageId(messageId);

        // Sanitize the content similarly to the ReactMarkdown pre-pass so regex matches
        const sanitizedContent = markdownMessage.replace(/\[([^\]]+)\]\(audio:(.+?)\)/g, (match, title, filename) => {
            const encodedFilename = filename.split(' ').join('%20');
            return `[${title}](audio:${encodedFilename})`;
        });

        const regex = /\[([^\]]+)\]\(audio:(.+?)\)/g;
        
        const segments: Segment[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(sanitizedContent)) !== null) {
            const textBefore = sanitizedContent.substring(lastIndex, match.index);
            if (textBefore.trim()) {
                segments.push({ type: 'text', content: textBefore });
            }
            const filename = match[2];
            segments.push({ type: 'audio', filename });
            lastIndex = match.index + match[0].length;
        }
        
        const textAfter = sanitizedContent.substring(lastIndex);
        if (textAfter.trim()) {
            segments.push({ type: 'text', content: textAfter });
        }

        for (let i = 0; i < segments.length; i++) {
            if (stopRef.current) break;
            
            setActiveSegmentIndex(i);
            const segment = segments[i];

            if (segment.type === 'text') {
                await new Promise<void>(async (resolve) => {
                    if (stopRef.current) return resolve();
                    
                    // strip basic markdown for better TTS
                    const cleanText = segment.content.replace(/[*_#`~]+/g, '');
                    
                    try {
                        const response = await fetch('/api/tts', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: cleanText })
                        });

                        if (!response.ok) throw new Error("TTS API call failed");
                        
                        const data = await response.json();
                        const audioBlob = new Blob(
                            [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
                            { type: 'audio/mp3' }
                        );
                        const audioUrl = URL.createObjectURL(audioBlob);
                        const audio = new Audio(audioUrl);

                        if (stopRef.current) return resolve();

                        audio.onended = () => {
                            URL.revokeObjectURL(audioUrl);
                            resolve();
                        };
                        audio.onerror = () => {
                            URL.revokeObjectURL(audioUrl);
                            resolve();
                        };
                        
                        audio.play().catch(e => {
                            console.error("Cloud TTS playback blocked", e);
                            resolve();
                        });
                    } catch (err) {
                        console.error("Failed to fetch Cloud TTS:", err);
                        // Fallback to browser TTS if Cloud TTS fails
                        if (typeof window !== 'undefined' && window.speechSynthesis) {
                            const utterance = new SpeechSynthesisUtterance(cleanText);
                            utterance.onend = () => resolve();
                            utterance.onerror = () => resolve();
                            window.speechSynthesis.speak(utterance);
                        } else {
                            resolve();
                        }
                    }
                });
            } else if (segment.type === 'audio') {
                await new Promise<void>((resolve) => {
                    if (stopRef.current) return resolve();
                    
                    // Query the specific audio element by filename attribute
                    const audios = document.querySelectorAll(`audio[data-filename="${segment.filename}"]`);
                    if (audios.length > 0) {
                        const audioElement = audios[0] as HTMLAudioElement;
                        // fast forward to 0 just in case
                        audioElement.currentTime = 0; 
                        
                        const handleEnded = () => {
                            audioElement.removeEventListener('ended', handleEnded);
                            resolve();
                        };
                        audioElement.addEventListener('ended', handleEnded);
                        
                        audioElement.play().catch((e) => {
                            console.error("Audio playback blocked", e);
                            resolve(); 
                        });
                    } else {
                        console.warn("Audio element not found for", segment.filename);
                        resolve();
                    }
                });
            }
        }

        setPlayingMessageId(null);
        setActiveSegmentIndex(null);
    }, [stop]);

    return { 
        playMessage, 
        stop, 
        playingMessageId,
        activeSegmentIndex
    };
}
