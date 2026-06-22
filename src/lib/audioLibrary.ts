/**
 * Dynamic Firebase Storage audio lookup for chat playback (MVP scope).
 *
 * Naming convention for every file under `training_audio/`:
 *
 *     {number}-{slug}-{Nama phrase}.m4a
 *
 * - `number` — section number (e.g. "1", "7")
 * - `slug`   — lowercase, hyphenated section name (e.g. "greetings-and-hospitality").
 *              Optional: the 4 click files have no slug, e.g. "1-The Dental click.m4a".
 * - `Nama phrase` — the actual phrase/word this audio is for, used as the lookup key.
 *
 * The exported functions build a singleton, session-cached `{phrase -> {filename,
 * url}}` map from that convention (`getAudioLibrary`), and use the same parsing
 * (`normalizeAudioKey`) on text scanned out of chat messages so the two sides agree.
 */
import { storage } from './firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

export interface AudioEntry {
    filename: string;
    url: string;
}

const AUDIO_FOLDER = 'training_audio';
const EXTENSION_RE = /\.(m4a|mp3|wav)$/i;

/**
 * Normalizes a raw filename, audio-link token, or scanned chat phrase into a
 * consistent lookup key — strips extension, leading "{number}-" and any
 * lowercase-ascii "{slug}-" segments, normalizes Unicode form and the Lateral
 * click glyph, and lowercases. Applying this the same way to both Storage
 * filenames and text scanned out of chat messages is what makes the two sides
 * of the lookup actually match.
 */
export function normalizeAudioKey(raw: string): string {
    let s = decodeURIComponent(raw).normalize('NFC').trim();
    s = s.replace(EXTENSION_RE, '');
    s = s.replace(/^\d+-/, '');

    // Strip leading lowercase-ascii "slug-" segments (e.g. "greetings-and-hospitality-")
    // to get to the actual Nama phrase. Click files have no slug ("The Dental click"
    // starts uppercase) so this is a no-op for them.
    const slugMatch = s.match(/^(?:[a-z0-9]+-)+(.+)$/);
    if (slugMatch && slugMatch[1].length > 0) {
        s = slugMatch[1];
    }

    // The Lateral click ("||") shows up in the wild as several different glyphs —
    // literal ASCII "||" (the real Storage naming convention), the IPA letter ǁ
    // (U+01C1), or the double-vertical-line look-alikes ‖ (U+2016) and ║ (U+2551)
    // that Gemini sometimes substitutes. Collapse all of them to the literal "||"
    // Storage files actually use, so a phrase rendered in any of these forms still
    // matches the library key built from the real filename.
    s = s.replace(/ǁ|‖|║/g, '||');
    return s.toLowerCase();
}

let cachedLibrary: Promise<Map<string, AudioEntry>> | null = null;

/**
 * Lists every file in training_audio/ once per session and resolves a download
 * URL for each, keyed by normalized Nama phrase. Cached after the first call —
 * subsequent calls (e.g. one per rendered audio card) reuse the same promise
 * instead of re-listing Storage.
 */
export function getAudioLibrary(): Promise<Map<string, AudioEntry>> {
    if (!cachedLibrary) {
        cachedLibrary = (async () => {
            const map = new Map<string, AudioEntry>();
            try {
                const folderRef = ref(storage, AUDIO_FOLDER);
                const result = await listAll(folderRef);

                await Promise.all(
                    result.items.map(async (item) => {
                        try {
                            const url = await getDownloadURL(item);
                            map.set(normalizeAudioKey(item.name), { filename: item.name, url });
                        } catch (err) {
                            console.error(`Failed to resolve download URL for ${item.name}:`, err);
                        }
                    })
                );
            } catch (err) {
                // Most likely an unauthenticated user hitting storage.rules (read requires auth).
                // Fail soft — no audio cards render, chat itself is unaffected.
                console.error('Failed to list training_audio/ from Firebase Storage:', err);
            }
            return map;
        })();
    }
    return cachedLibrary;
}

const AUDIO_LINK_RE = /\[([^\]]+)\]\(audio:(.+?)\)/g;
const BOLD_OR_CODE_RE = /\*\*([^*]+)\*\*|`([^`]+)`/g;

/**
 * Scans message text for bold or code-formatted spans (Kora's convention for
 * highlighting a Nama phrase) and, for any that match a file in the audio
 * library, appends the existing `[Play <phrase>](audio:<filename>)` markdown
 * link syntax right after it — so the rest of ChatInterface's existing
 * audio-link rendering picks it up with no further changes. Phrases that
 * already have an explicit link (e.g. one Gemini added itself) are skipped to
 * avoid rendering two players for the same audio.
 */
export function injectAudioLinks(content: string, library: Map<string, AudioEntry>): string {
    if (library.size === 0) return content;

    const alreadyLinked = new Set<string>();
    for (const match of content.matchAll(AUDIO_LINK_RE)) {
        alreadyLinked.add(normalizeAudioKey(match[2]));
    }

    return content.replace(BOLD_OR_CODE_RE, (match, boldText?: string, codeText?: string) => {
        const phrase = (boldText ?? codeText ?? '').trim();
        if (!phrase) return match;

        const key = normalizeAudioKey(phrase);
        if (!key || alreadyLinked.has(key)) return match;

        const entry = library.get(key);
        if (!entry) return match;

        alreadyLinked.add(key);
        return `${match} [Play ${phrase}](audio:${entry.filename})`;
    });
}
