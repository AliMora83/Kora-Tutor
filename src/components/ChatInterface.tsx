import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import AuthButton from './AuthButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import FirebaseAudioPlayer from './FirebaseAudioPlayer';
import { Send, Plus, Trash2, Volume2, Square, Mic, X, Check, RefreshCw } from 'lucide-react';
import { useAudioOrchestrator } from '@/hooks/useAudioOrchestrator';
import { useAudioRecorder as useBasicAudioRecorder } from '@/hooks/useAudioRecorder';
import SpeechLab from './SpeechLab/SpeechLab';

export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

interface ChatInterfaceProps {
    messages: Message[];
    input: string;
    setInput: (value: string) => void;
    handleSend: () => void;
    isLoading: boolean;
    onNewChat: () => void;
    onDeleteChat: () => void;
}

export function ChatInterface({ messages, input, setInput, handleSend, isLoading, onNewChat, onDeleteChat }: ChatInterfaceProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { playMessage, stop, playingMessageId, activeSegmentIndex } = useAudioOrchestrator();
    const { isRecording: isBasicRecording, audioBlob, startRecording: startBasicRecording, stopRecording: stopBasicRecording, clearRecording } = useBasicAudioRecorder();
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [showSpeechLab, setShowSpeechLab] = useState(false);
    const [selectedNativeAudio, setSelectedNativeAudio] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleEvaluate = async () => {
        if (!audioBlob) return;
        setIsEvaluating(true);
        try {
            const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
            
            // Auto-detect last audio if not selected
            if (!selectedNativeAudio && lastAssistantMsg) {
                const match = lastAssistantMsg.content.match(/\[([^\]]+)\]\(audio:(.+?)\)/);
                if (match) setSelectedNativeAudio(match[2]);
            }

            const formData = new FormData();
            formData.append('audio', audioBlob, 'speech.webm');
            formData.append('expectedText', lastAssistantMsg?.content || "Nama phrase");

            const res = await fetch('/api/evaluate-speech', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            setEvaluation(data);
        } catch (err) {
            console.error("Evaluation failed", err);
        } finally {
            setIsEvaluating(false);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Helper to render segmented content with highlighting
    const renderContent = (msg: Message, msgIdx: number) => {
        const sanitizedContent = msg.content.replace(/\[([^\]]+)\]\(audio:(.+?)\)/g, (match, title, filename) => {
            // Robust encoding for Nama characters and clicks
            const encoded = filename.split('/').map((part: string) => 
                encodeURIComponent(decodeURIComponent(part))
            ).join('/');
            return `[${title}](audio:${encoded})`;
        });

        if (playingMessageId !== msgIdx) {
            return (
                <div className="leading-normal text-base">
                    <ReactMarkdown
                        urlTransform={(value: string) => value}
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {sanitizedContent}
                    </ReactMarkdown>
                </div>
            );
        }

        // If playing, we split manually to apply highlights
        const regex = /\[([^\]]+)\]\(audio:(.+?)\)/g;
        let segments: { type: 'text' | 'audio', content: string, filename?: string }[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(sanitizedContent)) !== null) {
            const textBefore = sanitizedContent.substring(lastIndex, match.index);
            if (textBefore.trim()) segments.push({ type: 'text', content: textBefore });
            segments.push({ type: 'audio', content: match[1], filename: match[2] });
            lastIndex = match.index + match[0].length;
        }
        const textAfter = sanitizedContent.substring(lastIndex);
        if (textAfter.trim()) segments.push({ type: 'text', content: textAfter });

        return (
            <div className="leading-normal text-base space-y-2">
                {segments.map((seg, sIdx) => {
                    const isActive = activeSegmentIndex === sIdx;
                    if (seg.type === 'text') {
                        return (
                            <div 
                                key={sIdx} 
                                className={`inline-block transition-all duration-300 rounded px-1 ${isActive ? 'bg-secondary/20 text-secondary shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'text-gray-200'}`}
                            >
                                <ReactMarkdown
                                    urlTransform={(value: string) => value}
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        ...markdownComponents,
                                        p: ({node, ...props}: any) => <span {...props} />
                                    }}
                                >
                                    {seg.content}
                                </ReactMarkdown>
                            </div>
                        );
                    } else {
                        return (
                            <div key={sIdx} className={`inline-block transition-all duration-300 rounded p-1 ${isActive ? 'ring-2 ring-secondary shadow-[0_0_20px_rgba(52,211,153,0.4)]' : ''}`}>
                                <FirebaseAudioPlayer filename={seg.filename!} />
                            </div>
                        );
                    }
                })}
            </div>
        );
    };

    const markdownComponents = {
        table: ({node, ...props}: any) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-[#3a3a3a]">
                <table className="w-full text-sm text-left border-collapse" {...props} />
            </div>
        ),
        thead: ({node, ...props}: any) => <thead className="bg-[#2a2a2a] text-xs uppercase text-gray-400" {...props} />,
        th: ({node, ...props}: any) => <th className="px-6 py-4 font-semibold border-b border-[#3a3a3a]" {...props} />,
        td: ({node, ...props}: any) => <td className="px-6 py-4 border-b border-[#3a3a3a] whitespace-nowrap" {...props} />,
        tr: ({node, ...props}: any) => <tr className="hover:bg-[#333333] transition-colors" {...props} />,
        p: ({node, ...props}: any) => <div className="mb-4 last:mb-0 whitespace-pre-wrap" {...props} />,
        ul: ({node, ...props}: any) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
        ol: ({node, ...props}: any) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
        a: ({node, href, children, ...props}: any) => {
            if (href?.startsWith('audio:')) {
                const filename = href.replace('audio:', '');
                return <FirebaseAudioPlayer filename={filename} />;
            }
            return <a href={href} className="text-secondary hover:underline" {...props}>{children}</a>;
        },
        code: (props: any) => {
            const { className, children, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
                <div className="overflow-x-auto bg-[#1a1a1a] p-4 rounded-xl my-4 text-sm max-w-full">
                    <code className={className} {...rest}>{children}</code>
                </div>
            ) : (
                <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#e0e0e0] font-mono text-sm" {...rest}>{children}</code>
            );
        }
    };

    return (
        <div className="h-[calc(100dvh-4rem)] md:h-screen flex flex-col relative">
            {/* Header - Minimal */}
            <header className="p-4 flex gap-4 justify-between items-center text-gray-500 text-sm border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Kora 2.5 Flash</span>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse my-auto"></span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onNewChat} className="flex items-center gap-1.5 hover:text-white transition-colors bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-white/5">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Chat</span>
                    </button>
                    <button onClick={onDeleteChat} className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <AuthButton />
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-800">
                <div className="max-w-3xl mx-auto space-y-8">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[90%] ${msg.role === 'user' ? 'bg-[#2a2a2a] text-gray-200' : 'text-gray-200'} p-4 rounded-2xl`}>
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/30">
                                            <Image
                                                src="/logo.png"
                                                alt="Kora Logo"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            onClick={() => playingMessageId === idx ? stop() : playMessage(idx, msg.content)}
                                            title={playingMessageId === idx ? "Stop Read Aloud" : "Read Aloud"}
                                            className="text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-colors p-2 rounded-full"
                                        >
                                            {playingMessageId === idx ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                )}
                                {renderContent(msg, idx)}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="p-4 rounded-2xl">
                                <div className="flex items-center gap-3 text-gray-500 animate-pulse">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden opacity-50 border border-gray-600">
                                        <Image
                                            src="/logo.png"
                                            alt="Kora Logo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    Thinking...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Bottom Input Area */}
            <div className={`p-4 md:p-6 mx-auto w-full max-w-4xl space-y-4 ${showSpeechLab ? 'relative z-50' : ''}`}>
                
                {/* Speech Lab Toggle */}
                {!showSpeechLab && (
                    <div className="flex justify-center">
                         <button 
                            onClick={() => {
                                // Find last audio to analyze if none selected
                                if (!selectedNativeAudio) {
                                    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
                                    const match = lastAssistantMsg?.content.match(/\[([^\]]+)\]\(audio:(.+?)\)/);
                                    if (match) setSelectedNativeAudio(match[2]);
                                }
                                setShowSpeechLab(true);
                            }}
                            className="text-xs bg-secondary/10 hover:bg-secondary/20 text-secondary px-4 py-1.5 rounded-full border border-secondary/20 transition-all flex items-center gap-2 group"
                         >
                            <Mic size={14} className="group-hover:scale-110 transition-transform" />
                            Open Visual Speech Lab
                         </button>
                    </div>
                )}

                {/* New Visual Speech Lab Component */}
                {showSpeechLab && (
                    <SpeechLab 
                        nativeFilename={selectedNativeAudio} 
                        onClose={() => setShowSpeechLab(false)} 
                    />
                )}

                {/* Old Speech Lab Overlay (Kept for basic evaluation if needed, but could be merged) */}
                {!showSpeechLab && (audioBlob || isBasicRecording || evaluation) && (
                    <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-secondary/20 rounded-3xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${isBasicRecording ? 'bg-red-500 animate-pulse' : 'bg-secondary'}`}></div>
                                <span className="text-sm font-medium text-gray-300">
                                    {isBasicRecording ? 'Listening to your Nama...' : audioBlob ? 'Recording captured!' : 'Speech Lab'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {audioBlob && !isEvaluating && !evaluation && (
                                    <button 
                                        onClick={handleEvaluate}
                                        className="bg-secondary text-white px-4 py-1.5 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-all flex items-center gap-2"
                                    >
                                        <Check size={16} /> Evaluate Pronunciation
                                    </button>
                                )}
                                {(audioBlob || evaluation) && (
                                    <button 
                                        onClick={() => { clearRecording(); setEvaluation(null); }}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {isEvaluating && (
                            <div className="mt-4 flex items-center gap-3 text-secondary animate-pulse text-sm">
                                <RefreshCw className="animate-spin" size={16} />
                                Kora is analyzing your clicks and vowels...
                            </div>
                        )}

                        {evaluation && (
                            <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-secondary">{evaluation.score}%</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Evaluation Result</span>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">{evaluation.feedback}</p>
                                <div className="pt-2 flex items-start gap-2 text-secondary/80 text-xs italic">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                    {evaluation.tips}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onMouseDown={startBasicRecording}
                        onMouseUp={stopBasicRecording}
                        onMouseLeave={stopBasicRecording}
                        onTouchStart={(e) => { e.preventDefault(); startBasicRecording(); }}
                        onTouchEnd={(e) => { e.preventDefault(); stopBasicRecording(); }}
                        className={`p-4 rounded-3xl transition-all ${isBasicRecording ? 'bg-red-500 text-white scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-[#2a2a2a] text-gray-400 hover:text-secondary hover:border-secondary/30 border border-white/5'}`}
                        title="Hold to Record your Nama"
                    >
                        <Mic size={24} className={isBasicRecording ? 'animate-pulse' : ''} />
                    </button>

                    <div className="relative flex-1 bg-[#2a2a2a] rounded-3xl border border-white/5 focus-within:border-secondary/50 transition-colors">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Message Kora or hold mic to practice..."
                            className="w-full bg-transparent text-white p-4 pr-14 outline-none placeholder-gray-500 text-lg"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 disabled:opacity-50 disabled:bg-gray-700 transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
                <p className="text-center text-gray-600 text-xs">
                    Hold the mic 🎙️ to practice your pronunciation with Kora!
                </p>
            </div>
        </div>
    );
}
