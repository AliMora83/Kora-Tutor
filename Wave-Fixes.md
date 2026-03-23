# 🐛 Wave-Fixes.md — Speech Wave Visualizer Bug Fixes
### *For AG · Sprint 2 · Based on screenshot review Mar 17, 2026*

---

## Status

UI structure is correct. 4 functional bugs to fix. No visual/layout changes needed.

---

## Bug 1 — Native waveform is blank (not rendering on load)

**What's happening:**
The native speaker panel shows an empty black canvas. It should render a dim waveform immediately on load, then animate a playhead across it when the user taps "Hear Native".

**Expected behaviour:**
- On component mount → fetch the `.m4a` from Firebase → decode via WaveSurfer → render waveform at **40% opacity**
- On "Hear Native" press → play audio AND animate playhead. Waveform behind the playhead brightens to **100% opacity** as it passes

**Fix:**

WaveSurfer needs to be initialised with `interact: false` so the waveform renders passively without requiring a user gesture on the canvas itself. The `ready` event fires once decoded — that's when you draw.

```ts
wsRef.current = WaveSurfer.create({
  container: nativeContainerRef.current,
  waveColor: 'rgba(245, 166, 35, 0.4)',       // dim amber at rest
  progressColor: 'rgba(245, 166, 35, 1.0)',   // full amber as playhead passes
  cursorColor: '#F5A623',
  cursorWidth: 2,
  height: 88,
  barWidth: 2,
  barGap: 1,
  barRadius: 2,
  normalize: true,
  interact: false,    // ← critical: don't wait for user click on canvas
  backend: 'WebAudio',
});

wsRef.current.load(nativeAudioUrl);

// Waveform renders automatically once 'ready' fires
wsRef.current.on('ready', () => {
  // Now run spike detection
  const buffer = wsRef.current?.getDecodedData();
  if (buffer) {
    const { position } = detectClickSpike(buffer.getChannelData(0));
    setNativeSpikePosition(position);
  }
});
```

**Why `waveColor` vs `progressColor` does the dim/bright effect:**
WaveSurfer renders the unplayed portion in `waveColor` (dim) and the played portion in `progressColor` (bright). Setting them as above gives the "lights up as it plays" effect for free — no extra canvas code needed.

---

## Bug 2 — "Hear Native" button does not play audio

**What's happening:**
Button tap does nothing audible. WaveSurfer is initialised but `.play()` is not being called, OR `AudioContext` is suspended because it was created before a user gesture.

**Two likely causes — check both:**

### Cause A: AudioContext suspended (most common on mobile + Chrome)

Browsers suspend `AudioContext` until the user interacts. If WaveSurfer's internal `AudioContext` was created on mount (before any tap), it will be suspended when `.play()` is called.

**Fix:** Resume the context inside the button handler:

```ts
async function handleHearNative() {
  if (!wsRef.current) return;

  // Resume AudioContext — required on iOS Safari and Chrome after policy change
  // @ts-ignore — WaveSurfer exposes backend internally
  const backend = wsRef.current.backend;
  if (backend?.ac?.state === 'suspended') {
    await backend.ac.resume();
  }

  wsRef.current.play();
}
```

### Cause B: Firebase Storage URL requires authentication

If the `.m4a` URL is a Firebase Storage path (not a public download URL), WaveSurfer's `load()` will silently fail with a 403.

**Fix:** Always use `getDownloadURL()` from the Firebase SDK before passing to WaveSurfer:

```ts
import { getDownloadURL, ref } from 'firebase/storage';

const storageRef = ref(storage, `training_audio/${filename}`);
const url = await getDownloadURL(storageRef);   // authenticated URL
wsRef.current.load(url);
```

Check the browser Network tab — if the `.m4a` request returns 403, this is the cause.

---

## Bug 3 — User recording waveform disappears after recording stops

**What's happening:**
Live waveform animates correctly during recording (good — Web Audio API is working). After `MediaRecorder.stop()` fires, the canvas goes blank.

**What's missing:**
The `onstop` handler decodes the recorded audio blob into an `AudioBuffer`, but `drawResult()` is not being called with the decoded PCM data afterward.

**Fix — wire `drawResult()` into the `onstop` callback:**

```ts
mediaRecorder.onstop = async () => {
  // 1. Decode the blob
  const blob = new Blob(chunks, { type: mimeType });
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new AudioContext();
  const buffer = await audioCtx.decodeAudioData(arrayBuffer);

  // 2. Get PCM data
  const pcmData = buffer.getChannelData(0);

  // 3. Detect spike
  const { position: spikePos, amplitude } = detectClickSpike(pcmData, buffer.sampleRate);

  // 4. ← THIS IS WHAT'S MISSING — draw the result onto the canvas
  waveformRenderer.drawResult(pcmData, spikePos);

  // 5. Score and show feedback
  const score = scoreClickRecording(pcmData, nativeSpikePosition, buffer.sampleRate);
  onScoreUpdate(score);
  setClickScore(score);

  // 6. Update spike marker position
  setUserSpikePosition(spikePos);
};
```

**Also cancel the live animation loop before drawing the result:**

```ts
// Stop the requestAnimationFrame loop first
waveformRenderer.stopLive();

// Then draw the static result
waveformRenderer.drawResult(pcmData, spikePos);
```

If `stopLive()` isn't called before `drawResult()`, the animation loop's `clearRect` on the next frame will wipe the result canvas immediately after it's drawn.

---

## Bug 4 — Overlay toggle has no visible effect

**What's happening:**
The overlay toggle switches to ON state visually but the user canvas doesn't change. The overlay `<canvas>` is either not being drawn to, or it's not positioned over the user canvas.

**Two likely causes:**

### Cause A: Overlay canvas not absolutely positioned over user canvas

The overlay `<canvas>` must sit on top of the user canvas using `position: absolute`. If both canvases are in normal flow, they'll render side by side (invisible overlap).

**Fix — CSS:**

```css
/* WaveVisualizer.module.css */

.canvasWrapper {
  position: relative;   /* ← parent must be relative */
  height: 88px;
}

.userCanvas {
  display: block;
  width: 100%;
  height: 88px;
}

.overlayCanvas {
  position: absolute;   /* ← sits on top of userCanvas */
  top: 0;
  left: 0;
  width: 100%;
  height: 88px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlayCanvas.visible {
  opacity: 1;
}
```

```tsx
{/* JSX structure */}
<div className={styles.canvasWrapper}>
  <canvas ref={userCanvasRef} className={styles.userCanvas} />
  <canvas ref={overlayCanvasRef} className={`${styles.overlayCanvas} ${overlayOn ? styles.visible : ''}`} />
</div>
```

### Cause B: Overlay canvas not being drawn to when toggled ON

The overlay canvas needs to render the **native waveform in amber** at reduced opacity when toggled on. This should fire inside a `useEffect` watching `overlayOn`.

```ts
useEffect(() => {
  if (!overlayOn) return;
  if (!nativeBuffer || !overlayCanvasRef.current) return;

  const canvas = overlayCanvasRef.current;
  // Match canvas internal resolution to display size
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;

  const ctx = canvas.getContext('2d')!;
  const pcm = nativeBuffer.getChannelData(0);
  const W = canvas.width, H = canvas.height, MID = H / 2;
  const step = Math.ceil(pcm.length / W);

  ctx.clearRect(0, 0, W, H);
  ctx.beginPath();
  ctx.moveTo(0, MID);

  for (let i = 0; i < W; i++) {
    const amp = pcm[i * step] || 0;
    ctx.lineTo(i, MID - amp * (H * 0.44));
  }
  for (let i = W - 1; i >= 0; i--) {
    const amp = pcm[i * step] || 0;
    ctx.lineTo(i, MID + amp * (H * 0.44));
  }
  ctx.closePath();

  // Native waveform in amber at 55% opacity on top of user's blue
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(245, 166, 35, 0.55)');
  grad.addColorStop(0.5, 'rgba(245, 166, 35, 0.35)');
  grad.addColorStop(1, 'rgba(245, 166, 35, 0.55)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Spike position line on overlay
  ctx.beginPath();
  ctx.moveTo(nativeSpikePosition * W, 0);
  ctx.lineTo(nativeSpikePosition * W, H);
  ctx.strokeStyle = 'rgba(245, 166, 35, 0.9)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

}, [overlayOn, nativeBuffer, nativeSpikePosition]);
```

**Note:** The overlay only makes visual sense after the user has recorded. Add a guard:

```ts
function handleOverlayToggle() {
  if (!userRecordingDone) {
    // Show a small hint: "Record first to compare"
    return;
  }
  setOverlayOn(prev => !prev);
}
```

---

## Fix Order

| Priority | Bug | Likely time |
| :--- | :--- | :--- |
| 1 | Bug 2 — audio not playing (AudioContext suspend or 403) | 15 min |
| 2 | Bug 1 — native waveform blank on load | 20 min |
| 3 | Bug 3 — user waveform disappears after recording | 20 min |
| 4 | Bug 4 — overlay has no effect | 30 min |

Fix Bug 2 first — it's the most likely root cause of Bug 1 as well (if WaveSurfer never gets a valid URL, `ready` never fires, nothing renders).

---

## Quick Debug Checklist

Before writing any code, check these in the browser:

```
Network tab:
  □ Does the .m4a request return 200 or 403?
  □ Is the .m4a request being made at all?

Console:
  □ Any WaveSurfer errors? ("Unable to decode audio data" = wrong URL or CORS)
  □ Any "AudioContext was not allowed to start" warnings? → Bug 2 Cause A
  □ Any canvas errors?

Elements tab:
  □ Is the overlay <canvas> positioned absolute over the user canvas?
  □ Does it have opacity > 0 when toggle is ON?
```

---

*Bug report: Mar 17, 2026 · Kora · Assigned to AG*
