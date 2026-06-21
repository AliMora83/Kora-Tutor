// V2 features are built but out of scope for MVP testing round 1 (see Master.md).
// Each flag defaults to off; flip the env var to re-enable a surface without touching code.
export const FEATURE_FLAGS = {
    SPEECH_LAB: process.env.NEXT_PUBLIC_FEATURE_SPEECH_LAB === 'true',
    PROGRESS_DASHBOARD: process.env.NEXT_PUBLIC_FEATURE_PROGRESS === 'true',
    XP_SYSTEM: process.env.NEXT_PUBLIC_FEATURE_XP === 'true',
};
