import { ClickQuality, ClickScore } from '../components/SpeechLab/types';

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
