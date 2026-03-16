'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Play, Pause, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  filename: string;
}

export default function FirebaseAudioPlayer({ filename }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchUrl() {
      try {
        let decoded = decodeURIComponent(filename);
        // Normalize common click character discrepancies (Gemini 2.5 favors ║ over ||)
        decoded = decoded.replace(/║/g, '||');
        
        const path = decoded.startsWith('training_audio/') 
          ? decoded 
          : `training_audio/${decoded}`;

        const audioRef = ref(storage, path);
        
        const downloadUrl = await getDownloadURL(audioRef);
        if (isMounted) {
          setUrl(downloadUrl);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Error fetching audio URL:", err);
        if (isMounted) {
          setError(err.message || 'Failed to load audio');
          setIsLoading(false);
        }
      }
    }

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [filename]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading {filename}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-3 bg-red-900/20 rounded-xl border border-red-500/50 text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm">Failed to load {decodeURIComponent(filename).split('/').pop()}</span>
      </div>
    );
  }

  return (
    <div className="my-2 p-3 bg-[#1a1a1a] hover:bg-[#222222] transition-colors rounded-xl border border-[#3a3a3a] flex flex-col gap-2">
      <span className="text-sm font-semibold text-secondary flex items-center gap-2">
        <Play className="w-4 h-4" />
        {decodeURIComponent(filename).replace(/\.(mp3|m4a)$/i, '').replace('training_audio/', '')}
      </span>
      <audio controls src={url!} className="w-full h-10 outline-none" data-filename={filename} />
    </div>
  );
}
