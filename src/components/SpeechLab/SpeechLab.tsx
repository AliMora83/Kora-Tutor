'use client';

import React, { useState, useEffect } from 'react';
import WaveVisualizer from './WaveVisualizer';
import ClickAnimator, { ClickSymbol } from './ClickAnimator';
import { ClickScore } from './types';
import { storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { X, Mic, Info } from 'lucide-react';

interface SpeechLabProps {
  nativeFilename: string | null;
  onClose: () => void;
}

export default function SpeechLab({ nativeFilename, onClose }: SpeechLabProps) {
  const [nativeUrl, setNativeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ClickAnimator state — lifted from WaveVisualizer callbacks
  const [isNativePlaying, setIsNativePlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [nativeSpikePos, setNativeSpikePos] = useState<number | null>(null);
  const [activeClickSymbol, setActiveClickSymbol] = useState<ClickSymbol>('|');

  // Derive click symbol from filename (e.g. "1-The Palatal click.m4a" → '!')
  useEffect(() => {
    if (!nativeFilename) return;
    const lower = nativeFilename.toLowerCase();
    if (lower.includes('palatal'))   setActiveClickSymbol('!');
    else if (lower.includes('lateral'))  setActiveClickSymbol('║');
    else if (lower.includes('alveolar')) setActiveClickSymbol('╪');
    else                                  setActiveClickSymbol('|'); // dental or default
  }, [nativeFilename]);

  const handleScoreUpdate = (score: ClickScore) => {
    setNativeSpikePos(score.nativeSpikePosition);
  };

  useEffect(() => {
    if (!nativeFilename) return;

    async function fetchUrl() {
      setIsLoading(true);
      try {
        const decoded = decodeURIComponent(nativeFilename!);
        const path = decoded.startsWith('training_audio/') 
          ? decoded 
          : `training_audio/${decoded}`;

        const audioRef = ref(storage, path);
        const url = await getDownloadURL(audioRef);
        setNativeUrl(url);
        setError(null);
      } catch (err: any) {
        console.error("SpeechLab: Error fetching audio URL:", err);
        setError("Failed to load native audio sample.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUrl();
  }, [nativeFilename]);

  return (
    <div className="bg-[#1a1a1a]/95 backdrop-blur-2xl border border-secondary/30 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
            <Mic size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-none">Speech Lab</h3>
            <p className="text-xs text-secondary/70 font-medium uppercase tracking-wider mt-1">Syllable Alignment & Spike Analysis</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {!nativeFilename ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-6 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
           <Info className="text-secondary/40 mb-4" size={32} />
           <p className="text-gray-300 font-medium">No native audio sample selected.</p>
           <p className="text-gray-500 text-sm mt-1">Play an audio clip from the chat to analyze it here.</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm animate-pulse">Initializing Waveform Analyser...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      ) : nativeUrl && (
        <>
          <ClickAnimator
            clickSymbol={activeClickSymbol}
            isPlaying={isNativePlaying}
            nativeSpikePosition={nativeSpikePos}
            audioProgress={audioProgress}
            onReplay={() => {
              // Reset progress so animation replays with next play action
              setAudioProgress(0);
              setIsNativePlaying(false);
            }}
            onClickChange={setActiveClickSymbol}
          />
          <WaveVisualizer
            nativeAudioUrl={nativeUrl}
            lessonId="default"
            expectedClickSymbol={activeClickSymbol}
            onScoreUpdate={handleScoreUpdate}
            onPlayStateChange={setIsNativePlaying}
            onProgress={setAudioProgress}
          />
        </>
      )}

      <div className="mt-6 flex items-start gap-3 p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
        <div className="mt-1">
            <Info size={16} className="text-secondary" />
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-secondary font-bold">Pro Tip:</span> Use <strong>Overlay Mode</strong> to see exactly where your click timing matches the native speaker. Look for the sharp vertical spikes!
        </p>
      </div>
    </div>
  );
}
