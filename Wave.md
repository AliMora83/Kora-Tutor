# 🌊 Wave.md — Speech Wave Visualizer
### *Technical Implementation Spec for AG*
### *Sprint 2 · Kora Language Tutor · Target: Apr 12, 2026*

---

## Overview

Implement the **Speech Wave Visualizer** inside the Speech Lab. This feature renders two side-by-side audio waveforms — one from a native Nama speaker (Firebase `.m4a`), one from the user's microphone recording — so learners can visually compare where their click spike occurs versus the native speaker's.

The prototype has been built and demonstrated. This document is the spec to integrate it into the real Next.js app.

---

## Acceptance Criteria

- [ ] Native speaker waveform renders from Firebase `.m4a` file on lesson load
- [ ] User can record audio via microphone — live waveform animates during recording
- [ ] After recording, user waveform renders alongside native waveform
- [ ] Click spike is detected and annotated with a vertical marker on both waveforms
- [ ] Kora's feedback text updates based on spike quality (good / weak / miss)
- [ ] Overlay mode toggles native waveform semi-transparently over user waveform
- [ ] Per-click accuracy chips render below feedback (e.g. "Spike detected ✓", "Timing accurate ✓")
- [ ] Works on iOS Safari and Android Chrome (touch events, no flash of unstyled content)
- [ ] Graceful fallback if microphone access is denied

---

## File Locations

```
src/
  components/
    SpeechLab/
      WaveVisualizer.tsx        ← Main component (create)
      WaveVisualizer.module.css ← Styles (create)
      useAudioRecorder.ts       ← Recording hook (create)
      useWaveformRenderer.ts    ← Canvas drawing hook (create)
      types.ts                  ← Shared types (create)
  utils/
    spikeDetection.ts           ← Click spike analysis (create)
```

---

## Dependencies

```bash
npm install wavesurfer.js
```

WaveSurfer.js handles `.m4a` decoding and waveform rendering. We use it for the **native audio panel** only. The **user recording panel** uses the raw Web Audio API for real-time capture and canvas rendering (WaveSurfer doesn't support live microphone input natively).

```json
"wavesurfer.js": "^7.x"
```

---

## Component API

```tsx
<WaveVisualizer
  nativeAudioUrl={string}        // Firebase Storage URL for the .m4a file
  lessonId={string}              // e.g. "level1_dental_click"
  expectedClickSymbol={string}   // e.g. "|"
  onScoreUpdate={(score: ClickScore) => void}  // fires after recording analysed
/>
```

### ClickScore type

```ts
// src/components/SpeechLab/types.ts

export type ClickQuality = 'good' | 'weak' | 'miss';

export interface ClickScore {
  quality: ClickQuality;
  spikeAmplitude: number;      // 0–1 normalised peak RMS
  spikePosition: number;       // 0–1 relative position in recording
  nativeSpikePosition: number; // 0–1 from native audio analysis
  timingOffset: number;        // absolute diff between spike positions
  overallScore: number;        // 0–100 integer for XP calculation
}
```

---

## Implementation

### 1. Native Waveform — WaveSurfer.js

Use WaveSurfer to load the Firebase `.m4a` URL and render into a `<div>` container.

```tsx
// WaveVisualizer.tsx (native panel)

import WaveSurfer from 'wavesurfer.js';
import { useEffect, useRef } from 'react';

const nativeRef = useRef<HTMLDivElement>(null);
const wsRef = useRef<WaveSurfer | null>(null);

useEffect(() => {
  if (!nativeRef.current) return;

  wsRef.current = WaveSurfer.create({
    container: nativeRef.current,
    waveColor: '#F5A623',        // Kora amber — matches brand
    progressColor: '#F5A62355',
    cursorColor: '#F5A623',
    cursorWidth: 1.5,
    height: 88,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    normalize: true,
    backend: 'WebAudio',
  });

  wsRef.current.load(nativeAudioUrl);

  wsRef.current.on('ready', () => {
    analyseNativeSpike();   // detect spike position after decode
  });

  return () => wsRef.current?.destroy();
}, [nativeAudioUrl]);

function playNative() {
  wsRef.current?.play();
}
```

**After WaveSurfer decodes the audio**, extract the raw PCM buffer to find the spike position:

```ts
// After 'ready' fires
const buffer = wsRef.current?.getDecodedData();
if (buffer) {
  const nativeSpikePos = detectClickSpike(buffer.getChannelData(0));
  setNativeSpikePosition(nativeSpikePos);
}
```

---

### 2. Spike Detection

```ts
// src/utils/spikeDetection.ts

/**
 * Finds the position of the click transient in a PCM buffer.
 * Uses a short-window RMS scan — clicks produce a sharp local energy peak.
 * Returns a value 0–1 representing position in the buffer.
 */
export function detectClickSpike(
  pcmData: Float32Array,
  sampleRate: number = 44100
): { position: number; amplitude: number } {
  const windowMs = 5;
  const windowSamples = Math.floor(sampleRate * (windowMs / 1000));

  let peakRMS = 0;
  let peakIndex = 0;

  for (let i = windowSamples; i < pcmData.length - windowSamples; i++) {
    let sumSq = 0;
    for (let j = i - windowSamples; j < i + windowSamples; j++) {
      sumSq += pcmData[j] * pcmData[j];
    }
    const rms = Math.sqrt(sumSq / (windowSamples * 2));
    if (rms > peakRMS) {
      peakRMS = rms;
      peakIndex = i;
    }
  }

  // Normalise amplitude against signal max
  const maxAmp = pcmData.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const normAmplitude = maxAmp > 0 ? peakRMS / maxAmp : 0;

  return {
    position: peakIndex / pcmData.length,   // 0–1
    amplitude: normAmplitude,               // 0–1
  };
}

/**
 * Scores the user recording against the native spike reference.
 */
export function scoreClickRecording(
  userPCM: Float32Array,
  nativeSpikePosition: number,
  sampleRate: number = 44100
): ClickScore {
  const { position, amplitude } = detectClickSpike(userPCM, sampleRate);
  const timingOffset = Math.abs(position - nativeSpikePosition);

  let quality: ClickQuality;
  let overallScore: number;

  if (amplitude >= 0.45 && timingOffset <= 0.12) {
    quality = 'good';
    overallScore = Math.round(70 + amplitude * 20 + (0.12 - timingOffset) * 50);
  } else if (amplitude >= 0.15) {
    quality = 'weak';
    overallScore = Math.round(35 + amplitude * 30);
  } else {
    quality = 'miss';
    overallScore = Math.round(amplitude * 20);
  }

  return {
    quality,
    spikeAmplitude: amplitude,
    spikePosition: position,
    nativeSpikePosition,
    timingOffset,
    overallScore: Math.min(100, overallScore),
  };
}
```

---

### 3. User Recording — Web Audio API Hook

```ts
// src/components/SpeechLab/useAudioRecorder.ts

import { useRef, useState } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);

  async function startRecording(): Promise<AnalyserNode | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      chunksRef.current = [];
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecRef.current = rec;
      rec.start();
      setIsRecording(true);
      setError(null);
      return analyser;
    } catch (err) {
      setError('Microphone access denied. Please allow microphone in browser settings.');
      return null;
    }
  }

  async function stopRecording(): Promise<AudioBuffer | null> {
    return new Promise((resolve) => {
      const rec = mediaRecRef.current;
      if (!rec || rec.state === 'inactive') { resolve(null); return; }

      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const audioCtx = new AudioContext();
        try {
          const buffer = await audioCtx.decodeAudioData(arrayBuffer);
          resolve(buffer);
        } catch {
          resolve(null);
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
      };

      rec.stop();
    });
  }

  return { isRecording, error, startRecording, stopRecording, analyserRef };
}
```

---

### 4. Live Waveform Canvas (During Recording)

Draw the live microphone signal onto the user canvas during recording. This runs as a `requestAnimationFrame` loop while `isRecording` is true.

```ts
// src/components/SpeechLab/useWaveformRenderer.ts

import { useRef } from 'react';

export function useLiveWaveformRenderer(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const animRef = useRef<number | null>(null);

  function startLive(analyser: AnalyserNode) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height, MID = H / 2;
    const buf = new Uint8Array(analyser.frequencyBinCount);

    function frame() {
      animRef.current = requestAnimationFrame(frame);
      analyser.getByteTimeDomainData(buf);
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      const sliceW = W / buf.length;
      let x = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] / 128) - 1;
        const y = MID + v * (H * 0.44);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceW;
      }
      ctx.strokeStyle = '#5b9bd5';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    frame();
  }

  function stopLive() {
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }

  function drawResult(pcmData: Float32Array, spikePos: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height, MID = H / 2;
    const step = Math.ceil(pcmData.length / W);

    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    ctx.moveTo(0, MID);
    for (let i = 0; i < W; i++) {
      const amp = pcmData[i * step] || 0;
      ctx.lineTo(i, MID - amp * (H * 0.44));
    }
    for (let i = W - 1; i >= 0; i--) {
      const amp = pcmData[i * step] || 0;
      ctx.lineTo(i, MID + amp * (H * 0.44));
    }
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#5b9bd5cc');
    grad.addColorStop(0.5, '#5b9bd588');
    grad.addColorStop(1, '#5b9bd5cc');
    ctx.fillStyle = grad;
    ctx.fill();

    // Spike annotation line
    ctx.beginPath();
    ctx.moveTo(spikePos * W, 0);
    ctx.lineTo(spikePos * W, H);
    ctx.strokeStyle = '#5b9bd5';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  return { startLive, stopLive, drawResult };
}
```

---

### 5. Kora Feedback Messages

```ts
// inside WaveVisualizer.tsx

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
```

---

### 6. Overlay Mode

When overlay is toggled ON, render the native waveform onto the user canvas at reduced opacity so learners can visually align their spike to the native speaker's.

```tsx
// Overlay toggle handler
function handleOverlay() {
  setOverlayOn((prev) => !prev);
}

// Overlay canvas render (fires when overlayOn changes to true)
useEffect(() => {
  if (!overlayOn || !nativeBuffer || !overlayCanvasRef.current) return;
  const ctx = overlayCanvasRef.current.getContext('2d')!;
  drawOverlayWaveform(ctx, nativeBuffer.getChannelData(0), nativeSpikePos);
}, [overlayOn]);
```

The overlay `<canvas>` sits absolutely positioned over the user canvas with `opacity: 0.35` and pointer-events disabled.

---

## Firestore Audio Tag Schema

Each `.m4a` file in Firebase maps to a Firestore document. The `WaveVisualizer` reads this to know which file to load.

```ts
// Firestore: training_audio/{fileId}
interface AudioTag {
  file: string;             // "1-The Dental click.m4a"
  concept: string;          // "dental_click"
  lesson: string;           // "level1_4clicks"
  speaker: string;          // "ali" | "female_1" | "child_1"
  gender: 'male' | 'female' | 'child';
  age_group: 'adult' | 'child';
  verified: boolean;
  storageUrl: string;       // full Firebase Storage download URL
}
```

Query for the native audio URL in the component:

```ts
const audioDoc = await getDoc(
  doc(db, 'training_audio', `${lessonId}_${speakerPreference}`)
);
const nativeAudioUrl = audioDoc.data()?.storageUrl;
```

---

## Mobile Considerations

| Issue | Fix |
| :--- | :--- |
| iOS Safari blocks `AudioContext` until user gesture | Initialise `AudioContext` inside the `startRecording()` button handler, not on mount |
| iOS doesn't support `audio/webm` MediaRecorder | Detect and use `audio/mp4` on Safari: `MediaRecorder.isTypeSupported('audio/mp4')` |
| Canvas DPI blur on retina | Set `canvas.width = container.offsetWidth * window.devicePixelRatio` on mount and resize |
| Touch scroll interfering with record button | Add `touch-action: manipulation` to the record button |

```ts
// iOS audio format detection
const mimeType = MediaRecorder.isTypeSupported('audio/webm')
  ? 'audio/webm'
  : MediaRecorder.isTypeSupported('audio/mp4')
  ? 'audio/mp4'
  : '';

const rec = new MediaRecorder(stream, { mimeType });
```

---

## Colours

| Element | Hex | Token |
| :--- | :--- | :--- |
| Native waveform | `#F5A623` | Kora amber |
| User waveform | `#5b9bd5` | Kora blue |
| Good chip bg | `#1a3a0a` | — |
| Good chip border | `#3d6a25` | — |
| Warn chip bg | `#221400` | — |
| Warn chip border | `#7a5010` | — |
| Bad chip bg | `#1a0800` | — |
| Bad chip border | `#6a2010` | — |
| Panel bg | `#05030100` | transparent on dark |
| Panel border | `#1e0d03` | — |

---

## What NOT to Build (Out of Scope for Sprint 2)

- Gemini pronunciation scoring (Sprint 5) — the spike detection is local only for now
- Multi-voice toggle (Phase 4)
- Upload a file instead of recording (removed in Sprint 1 audit)
- Score persisted to Firestore (Sprint 5 wires this up)

---

## Questions for AG

1. **Canvas sizing** — what's the actual rendered width of the Speech Lab container on mobile? Need exact px to set `canvas.width` correctly for retina.
2. **Firebase rules** — are training_audio files publicly readable via Storage URL, or do we need an authenticated download URL? If auth required, use `getDownloadURL()` from Firebase SDK before passing to WaveSurfer.
3. **Existing Speech Lab structure** — does `SpeechLab.tsx` already have a recording state machine, or does `useAudioRecorder.ts` need to replace existing recording logic?

---

## Done = Sprint 2 Closes

When this ticket is complete, the following Sprint 2 acceptance criteria are met:

- ✅ Native speaker waveform renders in Speech Lab from Firebase `.m4a`
- ✅ User records → live waveform → result waveform with spike marker
- ✅ Kora feedback text and chips respond to click quality
- ✅ Overlay mode available
- ✅ Works on iOS + Android

This unblocks: **Lesson 1.1 full integration** (SVG animation + waveform in the same screen), which is the Sprint 2 exit milestone.

---

*Spec authored: March 16, 2026*
*Prototype: Kora session — Claude Sonnet 4.6*
*Assigned to: AG · Target: April 12, 2026*
