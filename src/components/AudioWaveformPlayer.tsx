'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

interface AudioWaveformPlayerProps {
    url: string;
    label: string;
}

/**
 * The single reusable WaveSurfer playback widget for chat audio (MVP scope —
 * pronunciation playback only, not recording/scoring). Renders a fixed-size,
 * clipped card so the waveform can never visually overflow it, with a pulsing
 * placeholder line until WaveSurfer reports 'ready'.
 *
 * Callers resolve `url`/`label` themselves (see FirebaseAudioPlayer) — this
 * component does no Storage/network lookups of its own.
 */
export default function AudioWaveformPlayer({ url, label }: AudioWaveformPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const wsRef = useRef<WaveSurfer | null>(null);

    // Callback ref (backed by state, not a plain useRef) so the mount effect below
    // reliably re-fires exactly when this DOM node appears. A plain ref object's
    // mutation doesn't retrigger effects, which previously caused some cards to
    // call WaveSurfer.create() before their container existed in the DOM.
    const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
    const containerRefCallback = useCallback((node: HTMLDivElement | null) => {
        setContainerEl(node);
    }, []);

    useEffect(() => {
        if (!containerEl) return;

        const ws = WaveSurfer.create({
            container: containerEl,
            waveColor: 'rgba(245, 158, 11, 0.35)', // dim amber/gold at rest
            progressColor: 'rgba(245, 158, 11, 0.9)', // bright amber/gold as playhead passes
            cursorColor: 'rgba(245, 158, 11, 0.9)',
            cursorWidth: 1,
            height: 64,
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            normalize: true,
        });

        wsRef.current = ws;
        ws.load(url);

        ws.on('ready', () => setIsReady(true));
        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));
        ws.on('finish', () => setIsPlaying(false));

        return () => {
            ws.destroy();
            wsRef.current = null;
            setIsReady(false);
        };
    }, [url, containerEl]);

    const togglePlay = () => {
        wsRef.current?.playPause();
    };

    return (
        // Fixed height + overflow-hidden so the waveform can never bleed past the card,
        // and the card never resizes between the loading and ready states.
        <div className="my-2 p-3 h-[124px] overflow-hidden rounded-xl border bg-[#1a1a1a] hover:bg-[#222222] transition-colors border-[#3a3a3a] flex flex-col gap-2">
            <span className="text-sm font-semibold text-secondary shrink-0">{label}</span>
            <div className="flex items-center gap-3 flex-1 min-h-0">
                <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary/20 hover:bg-secondary/30 text-secondary flex items-center justify-center transition-colors"
                >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <div className="relative flex-1 min-w-0 h-16 overflow-hidden">
                    {!isReady && (
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-0.5 bg-secondary/40 rounded-full animate-pulse" />
                        </div>
                    )}
                    <div
                        ref={containerRefCallback}
                        className={`h-full transition-opacity duration-200 ${isReady ? 'opacity-100' : 'opacity-0'}`}
                    />
                </div>
            </div>
        </div>
    );
}
