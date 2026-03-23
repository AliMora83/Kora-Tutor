export type ClickQuality = 'good' | 'weak' | 'miss';

export interface ClickScore {
  quality: ClickQuality;
  spikeAmplitude: number;      // 0–1 normalised peak RMS
  spikePosition: number;       // 0–1 relative position in recording
  nativeSpikePosition: number; // 0–1 from native audio analysis
  timingOffset: number;        // absolute diff between spike positions
  overallScore: number;        // 0–100 integer for XP calculation
}
