'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Square, Mic, RefreshCw, Layers } from 'lucide-react';
import styles from './WaveVisualizer.module.css';
import { useAudioRecorder } from './useAudioRecorder';
import { useWaveformRenderer } from './useWaveformRenderer';
import { detectClickSpike, scoreClickRecording } from '@/utils/spikeDetection';
import { ClickScore, ClickQuality } from './types';

interface WaveVisualizerProps {
  nativeAudioUrl: string;
  lessonId: string;
  expectedClickSymbol?: string;
  onScoreUpdate?: (score: ClickScore) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onProgress?: (progress: number) => void;
}

const FEEDBACK: Record<ClickQuality, (score: ClickScore) => string> = {
  good: (s) =>
    `Strong click spike at ${Math.round(s.spikePosition * 100)}% — native was at ${Math.round(s.nativeSpikePosition * 100)}%. Timing offset: ${Math.round(s.timingOffset * 100)}%. Clear transient detected. Excellent dental click!`,
  weak: (s) =>
    `Click spike present at ${Math.round(s.spikePosition * 100)}% but the transient is weak — compare how flat your waveform looks at the click point versus the native. Try pressing your tongue tip firmer to the gum line before releasing.`,
  miss: () =>
    `No clear click spike detected. Your waveform is smooth where it should spike sharply. Watch the mouth animation again and focus on firm tongue-tip contact before the release. The spike should look like the sharp gold peak on the native waveform.`,
};

const CHIPS: Record<ClickQuality, Array<{ label: string; type: 'good' | 'warn' | 'bad' }>> = {
  good: [
    { label: 'Spike detected ✓', type: 'good' },
    { label: 'Timing accurate ✓', type: 'good' },
    { label: 'Amplitude strong ✓', type: 'good' },
  ],
  weak: [
    { label: 'Spike present ✓', type: 'good' },
    { label: 'Low amplitude ⚠', type: 'warn' },
    { label: 'Increase tongue pressure', type: 'warn' },
  ],
  miss: [
    { label: 'No spike detected ✗', type: 'bad' },
    { label: 'Tongue contact missing', type: 'bad' },
    { label: 'Try 3 more times', type: 'warn' },
  ],
};

export default function WaveVisualizer({
  nativeAudioUrl,
  lessonId,
  expectedClickSymbol = '|',
  onScoreUpdate,
  onPlayStateChange,
  onProgress,
}: WaveVisualizerProps) {
  const nativeContainerRef = useRef<HTMLDivElement>(null);
  const userCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  
  const [nativeSpikePosition, setNativeSpikePosition] = useState<number | null>(null);
  const [nativeBuffer, setNativeBuffer] = useState<AudioBuffer | null>(null);
  const [isPlayingNative, setIsPlayingNative] = useState(false);
  const [score, setScore] = useState<ClickScore | null>(null);
  const [overlayOn, setOverlayOn] = useState(false);
  const [userBuffer, setUserBuffer] = useState<AudioBuffer | null>(null);

  const { isRecording, error, startRecording, stopRecording } = useAudioRecorder();
  const { startLive, stopLive, drawResult } = useWaveformRenderer(userCanvasRef);
  const { drawOverlayWaveform } = useWaveformRenderer(overlayCanvasRef);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!nativeContainerRef.current) return;

    const ws = WaveSurfer.create({
      container: nativeContainerRef.current,
      waveColor: 'rgba(245, 166, 35, 0.4)', // Dim amber at rest
      progressColor: 'rgba(245, 166, 35, 1.0)', // Bright amber as playhead passes
      cursorColor: '#F5A623',
      cursorWidth: 2,
      height: 88,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      interact: false, // Don't wait for user gesture on canvas
    });

    wsRef.current = ws;

    ws.load(nativeAudioUrl);

    ws.on('ready', () => {
      const buffer = ws.getDecodedData();
      if (buffer) {
        setNativeBuffer(buffer);
        const { position } = detectClickSpike(buffer.getChannelData(0), buffer.sampleRate);
        setNativeSpikePosition(position);
        
        // Annotate native spike visually
        const marker = document.createElement('div');
        marker.style.position = 'absolute';
        marker.style.left = `${position * 100}%`;
        marker.style.top = '0';
        marker.style.height = '100%';
        marker.style.width = '1.5px';
        marker.style.backgroundColor = '#F5A623';
        marker.style.zIndex = '10';
        marker.style.borderLeft = '1px dashed rgba(255,255,255,0.5)';
        nativeContainerRef.current?.appendChild(marker);
      }
    });

    ws.on('play', () => { setIsPlayingNative(true); onPlayStateChange?.(true); });
    ws.on('pause', () => { setIsPlayingNative(false); onPlayStateChange?.(false); });
    ws.on('finish', () => { setIsPlayingNative(false); onPlayStateChange?.(false); });
    ws.on('audioprocess', (currentTime: number) => {
      const duration = ws.getDuration();
      if (duration > 0) onProgress?.(currentTime / duration);
    });

    return () => ws.destroy();
  }, [nativeAudioUrl]);

  const handlePlayNative = async () => {
    if (wsRef.current) {
      // Resume AudioContext for browsers that block auto-start
      // @ts-ignore - access internal backend for AudioContext
      const ac = wsRef.current.options.audioContext || (wsRef.current as any).backend?.ac;
      if (ac?.state === 'suspended') {
        await ac.resume();
      }

      if (wsRef.current.isPlaying()) {
        wsRef.current.pause();
      } else {
        wsRef.current.play();
      }
    }
  };

  const handleStartRecording = async () => {
    setScore(null);
    setUserBuffer(null);
    const analyser = await startRecording();
    if (analyser) {
      startLive(analyser);
    }
  };

  const handleStopRecording = async () => {
    // 1. Stop animation loop first
    stopLive();
    
    // 2. Clear canvases to ensure clean draw
    const userCtx = userCanvasRef.current?.getContext('2d');
    userCtx?.clearRect(0, 0, userCanvasRef.current?.width || 0, userCanvasRef.current?.height || 0);

    const buffer = await stopRecording();
    if (buffer && nativeSpikePosition !== null) {
      setUserBuffer(buffer);
      const pcmData = buffer.getChannelData(0);
      const clickScore = scoreClickRecording(pcmData, nativeSpikePosition, buffer.sampleRate);
      setScore(clickScore);
      
      // 3. Draw static result
      drawResult(pcmData, clickScore.spikePosition);
      
      if (onScoreUpdate) onScoreUpdate(clickScore);
    }
  };

  useEffect(() => {
    if (overlayOn && nativeBuffer && nativeSpikePosition !== null) {
        // Use the separate overlay canvas to draw the native reference
        drawOverlayWaveform(nativeBuffer.getChannelData(0), nativeSpikePosition);
    } else if (!overlayOn && overlayCanvasRef.current) {
        // Clear overlay canvas when toggled off
        const ctx = overlayCanvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }
  }, [overlayOn, nativeBuffer, nativeSpikePosition, drawOverlayWaveform]);

  return (
    <div className={styles.container}>
      <div className={styles.visualizers}>
        {/* Native Speaker Panel */}
        <div className={styles.pannel}>
          <div className={styles.pannelTitle}>Native Speaker (Nama)</div>
          <div className={styles.waveContainer} ref={nativeContainerRef} />
          <div className={styles.controls}>
            <button className={`${styles.button} ${styles.playButton}`} onClick={handlePlayNative}>
              {isPlayingNative ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {isPlayingNative ? 'Stop' : 'Hear Native'}
            </button>
          </div>
        </div>

        {/* User Recording Panel */}
        <div className={styles.pannel}>
          <div className="flex justify-between items-center mb-2">
            <div className={styles.pannelTitle}>Your Pronunciation</div>
            <label className={styles.overlayToggle}>
              <Layers size={14} />
              <span>Overlay</span>
              <div className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={overlayOn} 
                  disabled={!userBuffer}
                  onChange={(e) => setOverlayOn(e.target.checked)} 
                />
                <span className={styles.slider}></span>
              </div>
            </label>
          </div>
          <div className={styles.waveContainer}>
            <canvas ref={userCanvasRef} className={styles.userCanvas} />
            <canvas ref={overlayCanvasRef} className={`${styles.overlayCanvas} ${overlayOn ? styles.overlayVisible : ''}`} />
          </div>
          <div className={styles.controls}>
            {!isRecording ? (
              <button className={`${styles.button} ${styles.recordButton}`} onClick={handleStartRecording}>
                <Mic size={16} />
                {userBuffer ? 'Try Again' : 'Record'}
              </button>
            ) : (
              <button className={`${styles.button} ${styles.recordButton} ${styles.recording}`} onClick={handleStopRecording}>
                <Square size={16} fill="currentColor" />
                Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      {/* Feedback Section */}
      {score && (
        <div className={styles.feedbackContainer}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-secondary">{score.overallScore}% Accuracy</div>
            <div className={styles.chips}>
              {CHIPS[score.quality].map((chip, idx) => (
                <span key={idx} className={`${styles.chip} ${styles[`chip_${chip.type}`]}`}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
          <p className={styles.feedbackText}>{FEEDBACK[score.quality](score)}</p>
        </div>
      )}
    </div>
  );
}
