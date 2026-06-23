'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

interface AudioWaveformPlayerProps {
    url: string;
    label: string;
}

const BAR_WIDTH = 2;
const BAR_GAP = 1;
const BAR_RADIUS = 2;
// Most training clips are short, sharp clicks (~0.1–0.3s of sound inside a ~1s
// recording) — peak-normalizing alone still leaves the silent stretch around
// the click looking like a flat line. This floor guarantees every bar shows a
// visible nub (8% of half-height) even where amplitude is ~0, so the waveform
// reads as "audio with a peak," not "broken."
const MIN_BAR_HEIGHT_RATIO = 0.08;

// WaveSurfer's built-in `normalize`/`barWidth`/`barGap`/`barRadius` options
// only scale uniformly to the file's peak — they can't apply a per-bar floor.
// This custom renderFunction draws the bars manually so quiet recordings still
// look like a waveform rather than empty space. WaveSurfer calls this once per
// color pass (waveColor, then progressColor) with `ctx.fillStyle` already set,
// so it only needs to draw shapes, not pick colors.
function renderBarsWithFloor(channelData: Array<Float32Array | number[]>, ctx: CanvasRenderingContext2D) {
    const channel = channelData[0];
    const { width, height } = ctx.canvas;
    const step = BAR_WIDTH + BAR_GAP;
    const numBars = Math.floor(width / step);
    if (!channel || channel.length === 0 || numBars === 0) return;
    const samplesPerBar = Math.max(1, Math.floor(channel.length / numBars));

    let maxPeak = 0;
    for (let i = 0; i < channel.length; i++) {
        const abs = Math.abs(channel[i]);
        if (abs > maxPeak) maxPeak = abs;
    }
    if (maxPeak === 0) maxPeak = 1;

    const halfHeight = height / 2;

    for (let i = 0; i < numBars; i++) {
        const start = i * samplesPerBar;
        const end = Math.min(start + samplesPerBar, channel.length);
        let peak = 0;
        for (let j = start; j < end; j++) {
            const abs = Math.abs(channel[j]);
            if (abs > peak) peak = abs;
        }
        const barHeight = Math.max(peak / maxPeak, MIN_BAR_HEIGHT_RATIO) * halfHeight;
        const x = i * step;
        const y = halfHeight - barHeight;
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, BAR_WIDTH, barHeight * 2, BAR_RADIUS);
            ctx.fill();
        } else {
            ctx.fillRect(x, y, BAR_WIDTH, barHeight * 2);
        }
    }
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
            // renderFunction takes over all bar drawing (see renderBarsWithFloor) —
            // barWidth/barGap/barRadius/normalize are not read once it's set.
            renderFunction: renderBarsWithFloor,
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
