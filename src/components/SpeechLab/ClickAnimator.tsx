'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ClickAnimator.module.css';

export type ClickSymbol = '|' | '!' | '║' | '╪';

interface ClickAnimatorProps {
  clickSymbol: ClickSymbol;
  isPlaying: boolean;
  nativeSpikePosition: number | null; // 0–1
  audioProgress: number;              // 0–1, from WaveSurfer audioprocess
  onReplay?: () => void;
  onClickChange?: (symbol: ClickSymbol) => void;
}

type AnimPhase = 'rest' | 'contact' | 'release';

// --- Click anatomy data -------------------------------------------------------
const CLICK_LABELS: Record<ClickSymbol, { name: string; tip: string }> = {
  '|':  { name: 'Dental',   tip: '"Tut" — tongue tip behind upper front teeth' },
  '!':  { name: 'Palatal',  tip: '"Snap" — whole tongue to the roof, jaw drops' },
  '║':  { name: 'Lateral',  tip: '"Clop" — tongue sides seal to cheeks' },
  '╪':  { name: 'Alveolar', tip: '"Pop" — tongue tip between front teeth, pull back' },
};

const ALL_CLICKS: ClickSymbol[] = ['|', '!', '║', '╪'];

// SVG path data for each click × each phase
// Paths describe the tongue shape in a 200×120 viewBox mouth cross-section
// Anatomy: upper teeth at y≈20, roof of mouth arc y 20→55, lower jaw y≈100
const TONGUE_PATHS: Record<ClickSymbol, Record<AnimPhase, string>> = {
  // Dental |: tongue tip rests just behind upper front teeth (x≈85, y≈22)
  '|': {
    rest:    'M 40 85 Q 80 75 120 80 Q 150 82 170 90',
    contact: 'M 40 85 Q 80 60 100 28 Q 102 22 106 22 Q 110 22 112 28 Q 120 55 170 90',
    release: 'M 40 85 Q 80 68 110 45 Q 130 65 170 88',
  },
  // Palatal !: full tongue humps up to palate, jaw drops
  '!': {
    rest:    'M 40 85 Q 80 75 120 80 Q 150 82 170 90',
    contact: 'M 40 90 Q 70 50 105 28 Q 125 18 145 28 Q 160 40 170 65',
    release: 'M 40 98 Q 80 82 120 88 Q 150 92 170 98',
  },
  // Lateral ║: tongue body stays mid, sides seal — shown as wide flat hump
  '║': {
    rest:    'M 40 85 Q 80 75 120 80 Q 150 82 170 90',
    contact: 'M 40 85 Q 70 62 105 58 Q 135 58 165 65 Q 175 70 170 90',
    release: 'M 40 85 Q 80 72 120 78 Q 150 80 172 88',
  },
  // Alveolar ╪: tongue tip between teeth then snaps back
  '╪': {
    rest:    'M 40 85 Q 80 75 120 80 Q 150 82 170 90',
    contact: 'M 40 85 Q 75 65 95 28 Q 97 18 100 18 Q 103 18 107 28 Q 125 60 170 90',
    release: 'M 40 85 Q 85 72 115 60 Q 140 68 170 88',
  },
};

// Lower jaw Y-offset — only palatal drops the jaw
const JAW_DROP: Record<ClickSymbol, Record<AnimPhase, number>> = {
  '|': { rest: 0, contact: 0, release: 0 },
  '!': { rest: 0, contact: 0, release: 10 },
  '║': { rest: 0, contact: 0, release: 0 },
  '╪': { rest: 0, contact: 0, release: 0 },
};

export default function ClickAnimator({
  clickSymbol,
  isPlaying,
  nativeSpikePosition,
  audioProgress,
  onReplay,
  onClickChange,
}: ClickAnimatorProps) {
  const [phase, setPhase] = useState<AnimPhase>('rest');
  const [activeSymbol, setActiveSymbol] = useState<ClickSymbol>(clickSymbol);
  const prevPlayingRef = useRef(false);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep internal symbol in sync with prop
  useEffect(() => {
    setActiveSymbol(clickSymbol);
    setPhase('rest');
  }, [clickSymbol]);

  // Animate rest → contact → release when audio starts playing
  useEffect(() => {
    if (isPlaying && !prevPlayingRef.current) {
      // Playback just started — move to contact immediately
      setPhase('contact');
    }

    if (!isPlaying && prevPlayingRef.current) {
      // Playback just ended — snap to rest after short delay
      phaseTimerRef.current = setTimeout(() => setPhase('rest'), 600);
    }

    prevPlayingRef.current = isPlaying;
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [isPlaying]);

  // Fire 'release' phase at the spike position during playback
  useEffect(() => {
    if (!isPlaying || nativeSpikePosition === null) return;
    // Within ±3% of spike position → trigger release
    if (audioProgress >= nativeSpikePosition - 0.03 && audioProgress < nativeSpikePosition + 0.03) {
      setPhase('release');
    }
  }, [audioProgress, isPlaying, nativeSpikePosition]);

  const handleSymbolClick = (symbol: ClickSymbol) => {
    setActiveSymbol(symbol);
    setPhase('rest');
    onClickChange?.(symbol);
  };

  const tonguePath = TONGUE_PATHS[activeSymbol][phase];
  const jawDrop = JAW_DROP[activeSymbol][phase];
  const info = CLICK_LABELS[activeSymbol];

  return (
    <div className={styles.root}>
      {/* Click selector tabs */}
      <div className={styles.tabs}>
        {ALL_CLICKS.map((sym) => (
          <button
            key={sym}
            className={`${styles.tab} ${activeSymbol === sym ? styles.tabActive : ''}`}
            onClick={() => handleSymbolClick(sym)}
            title={CLICK_LABELS[sym].name}
          >
            <span className={styles.tabSymbol}>{sym}</span>
            <span className={styles.tabName}>{CLICK_LABELS[sym].name}</span>
          </button>
        ))}
      </div>

      {/* TODO: SVG mouth anatomy illustration — to be built with Gemini
           Props available for the illustration:
             activeSymbol  — '|' | '!' | '║' | '╪'
             phase         — 'rest' | 'contact' | 'release'
             tonguePath    — current SVG path string from TONGUE_PATHS
             jawDrop       — px offset for lower jaw (palatal only)
      */}
      <div className={styles.svgPlaceholder}>
        <span className={styles.svgPlaceholderSymbol}>{activeSymbol}</span>
        <span className={styles.svgPlaceholderPhase}>{phase}</span>
      </div>

      {/* Tip text */}
      <p className={styles.tip}>
        <span className={styles.tipSymbol}>{activeSymbol}</span>
        {info.tip}
      </p>
    </div>
  );
}
