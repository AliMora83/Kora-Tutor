import { useRef, useState, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startRecording = useCallback(async (): Promise<AnalyserNode | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';
        
      const rec = new MediaRecorder(stream, { mimeType });
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mediaRecRef.current = rec;
      rec.start();
      setIsRecording(true);
      setError(null);
      return analyser;
    } catch (err) {
      console.error('Recording error:', err);
      setError('Microphone access denied. Please allow microphone in browser settings.');
      return null;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<AudioBuffer | null> => {
    return new Promise((resolve) => {
      const rec = mediaRecRef.current;
      if (!rec || rec.state === 'inactive') {
        resolve(null);
        return;
      }

      rec.onstop = async () => {
        const mimeType = rec.mimeType;
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const arrayBuffer = await blob.arrayBuffer();
        
        // Use a new AudioContext or the existing one to decode
        const decodeCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        try {
          const buffer = await decodeCtx.decodeAudioData(arrayBuffer);
          resolve(buffer);
        } catch (err) {
          console.error('Decoding error:', err);
          resolve(null);
        } finally {
          decodeCtx.close();
        }

        streamRef.current?.getTracks().forEach((t) => t.stop());
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
        }
        setIsRecording(false);
      };

      rec.stop();
    });
  }, []);

  return { isRecording, error, startRecording, stopRecording, analyserRef };
}
