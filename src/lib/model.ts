/**
 * The Gemini model Kora talks to.
 *
 * Kept in one place because the model ID is a moving target: Google retired
 * `gemini-2.5-flash` for new users (404 NOT_FOUND) in Nov 2026, which took the
 * live chat down until this string was changed. Import this rather than
 * hardcoding a model name, so the next rename is a one-line edit.
 *
 * Gemini 3.x note: do NOT add temperature / topP / topK / candidateCount to
 * the request config — they are not supported from Gemini 3 onward.
 */
export const GEMINI_MODEL = "gemini-3.8-flash";
