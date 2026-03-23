import { useRef, useCallback } from 'react';

export function useWaveformRenderer(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const animRef = useRef<number | null>(null);

  const startLive = useCallback((analyser: AnalyserNode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set display size
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const W = canvas.width;
    const H = canvas.height;
    const MID = H / 2;
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
      ctx.lineWidth = 2 * dpr;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    frame();
  }, [canvasRef]);

  const stopLive = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = null;
  }, []);

  const setCanvasSize = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    }
  }, []);

  const drawResult = useCallback((pcmData: Float32Array, spikePos: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCanvasSize(canvas);
    
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width;
    const H = canvas.height;
    const MID = H / 2;

    ctx.clearRect(0, 0, W, H);
    
    // Draw Waveform fill
    ctx.beginPath();
    ctx.moveTo(0, MID);
    for (let i = 0; i < W; i++) {
        const sampleIdx = Math.floor(i * (pcmData.length / W));
        const amp = pcmData[sampleIdx] || 0;
        ctx.lineTo(i, MID - Math.abs(amp) * (H * 0.44));
    }
    for (let i = W - 1; i >= 0; i--) {
        const sampleIdx = Math.floor(i * (pcmData.length / W));
        const amp = pcmData[sampleIdx] || 0;
        ctx.lineTo(i, MID + Math.abs(amp) * (H * 0.44));
    }
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#5b9bd5cc');
    grad.addColorStop(0.5, '#5b9bd588');
    grad.addColorStop(1, '#5b9bd5cc');
    ctx.fillStyle = grad;
    ctx.fill();

    // Spike annotation line
    if (spikePos >= 0 && spikePos <= 1) {
        ctx.beginPath();
        ctx.moveTo(spikePos * W, 0);
        ctx.lineTo(spikePos * W, H);
        ctx.strokeStyle = '#5b9bd5';
        ctx.lineWidth = 1.5 * dpr;
        ctx.setLineDash([4 * dpr, 3 * dpr]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
  }, [canvasRef, setCanvasSize]);

  const drawOverlayWaveform = useCallback((pcmData: Float32Array, spikePos: number, color: string = 'rgba(245, 166, 35, 0.7)', shouldClear: boolean = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCanvasSize(canvas);

    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width;
    const H = canvas.height;
    const MID = H / 2;

    if (shouldClear) ctx.clearRect(0, 0, W, H);
    
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, MID);
    for (let i = 0; i < W; i++) {
        const sampleIdx = Math.floor(i * (pcmData.length / W));
        const amp = pcmData[sampleIdx] || 0;
        ctx.lineTo(i, MID - Math.abs(amp) * (H * 0.44));
    }
    for (let i = W - 1; i >= 0; i--) {
        const sampleIdx = Math.floor(i * (pcmData.length / W));
        const amp = pcmData[sampleIdx] || 0;
        ctx.lineTo(i, MID + Math.abs(amp) * (H * 0.44));
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Spike line for overlay
    if (spikePos >= 0 && spikePos <= 1) {
        ctx.beginPath();
        ctx.moveTo(spikePos * W, 0);
        ctx.lineTo(spikePos * W, H);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5 * dpr;
        ctx.setLineDash([4 * dpr, 3 * dpr]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    ctx.restore();
  }, [canvasRef, setCanvasSize]);

  return { startLive, stopLive, drawResult, drawOverlayWaveform };
}
