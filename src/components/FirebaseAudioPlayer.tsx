'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AudioWaveformPlayer from './AudioWaveformPlayer';
import { getAudioLibrary, normalizeAudioKey, AudioEntry } from '@/lib/audioLibrary';

interface Props {
    filename: string;
}

/**
 * Resolves a chat-message audio reference (a real Storage filename, or a bare
 * Nama phrase scanned out of the message — see audioLibrary.ts) against the
 * session-cached audio library, then hands off to AudioWaveformPlayer to render.
 * Renders nothing if the reference doesn't match a real file — no error card.
 */
export default function FirebaseAudioPlayer({ filename }: Props) {
    const [entry, setEntry] = useState<AudioEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [suppressed, setSuppressed] = useState(false);

    useEffect(() => {
        let isMounted = true;

        getAudioLibrary().then((library) => {
            if (!isMounted) return;
            const found = library.get(normalizeAudioKey(filename));
            if (found) {
                setEntry(found);
            } else {
                setSuppressed(true);
            }
            setIsLoading(false);
        });

        return () => {
            isMounted = false;
        };
    }, [filename]);

    if (suppressed) return null;

    if (isLoading || !entry) {
        return (
            <div className="my-2 p-3 h-[124px] overflow-hidden rounded-xl border bg-[#1a1a1a] border-[#3a3a3a] flex items-center gap-3 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading {filename}...</span>
            </div>
        );
    }

    const label = decodeURIComponent(entry.filename).replace(/\.(mp3|m4a)$/i, '').replace('training_audio/', '');
    return <AudioWaveformPlayer url={entry.url} label={label} />;
}
