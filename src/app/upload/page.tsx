"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloud, FileAudio, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function AudioUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsCheckingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.includes('audio')) {
                setFile(droppedFile);
                setStatus('idle');
                setMessage('');
            } else {
                setStatus('error');
                setMessage('Please drop a valid audio file (.mp3, .wav)');
            }
        }
    }, []);

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        if (!user) {
            setStatus('error');
            setMessage('You must be signed in to upload audio.');
            return;
        }

        setStatus('uploading');
        setProgress(0);

        // Sanitize file name
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storageRef = ref(storage, `training_audio/${Date.now()}_${cleanFileName}`);
        
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progressPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(Math.round(progressPercentage));
            },
            (error) => {
                console.error("Upload error:", error);
                setStatus('error');
                setMessage(`Upload failed: ${error.message}`);
            },
            async () => {
                setStatus('success');
                setMessage('Audio successfully uploaded! Kora is getting smarter.');
                // const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                // console.log("File available at", downloadURL);
                setTimeout(() => {
                    setFile(null);
                    setStatus('idle');
                    setProgress(0);
                }, 4000);
            }
        );
    };

    if (isCheckingAuth) {
        return (
            <div className="flex h-screen items-center justify-center p-8 bg-[#0a0a0a]">
                <Loader2 className="animate-spin text-secondary mb-4 mx-auto" size={48} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center p-8 bg-[#0a0a0a]">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-3xl max-w-md text-center shadow-2xl">
                    <AlertCircle className="text-secondary/80 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-white mb-2">Secure Portal</h2>
                    <p className="text-gray-400 mb-6">You must be signed in as an administrator to upload core training audio to Kora's database.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-y-auto p-4 md:p-8 bg-[#0a0a0a]">
            <div className="max-w-3xl mx-auto w-full mt-4 md:mt-12 mb-24">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-orange-400 mb-4 tracking-tight">
                        Audio Training Portal
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Upload long, clean Khoekhoegowab audio files to teach Kora precise pronunciation.
                    </p>
                </header>

                <div 
                    className={`bg-[#1a1a1a] border-2 border-dashed rounded-3xl p-10 md:p-16 text-center transition-all duration-300 relative overflow-hidden shadow-xl
                        ${status === 'uploading' ? 'border-secondary/50 bg-[#1a1a1a]/80' : 
                          status === 'success' ? 'border-green-500/50 bg-green-500/5' : 
                          status === 'error' ? 'border-red-500/50 bg-red-500/5' : 
                          file ? 'border-secondary/50 bg-secondary/5' : 'border-[#3a3a3a] hover:border-secondary/30 hover:bg-[#2a2a2a]'
                        }
                    `}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    {status === 'uploading' && (
                        <div 
                            className="absolute bottom-0 left-0 h-1 bg-secondary transition-all duration-300 ease-out rounded-b-3xl"
                            style={{ width: `${progress}%` }}
                        />
                    )}

                    {!file ? (
                        <>
                            <UploadCloud className="text-secondary/60 mx-auto mb-6 transition-transform hover:scale-110" size={64} />
                            <h3 className="text-2xl font-semibold text-white mb-3">Drag & Drop Audio</h3>
                            <p className="text-gray-400 mb-6">Supports .mp3, .wav, or .m4a</p>
                            
                            <label className="cursor-pointer bg-[#2a2a2a] hover:bg-[#333333] text-white px-6 py-3 rounded-xl font-medium transition-colors border border-[#4a4a4a] shadow-md inline-block">
                                Browse Files
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="audio/*" 
                                    onChange={handleFileChange}
                                />
                            </label>
                        </>
                    ) : (
                        <div className="space-y-6 relative z-10">
                            <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-secondary/20 shadow-lg">
                                <FileAudio className="text-secondary" size={40} />
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-1 truncate px-4">{file.name}</h3>
                                <p className="text-gray-400 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>

                            {status === 'idle' && (
                                <div className="flex justify-center gap-4 mt-8">
                                    <button 
                                        onClick={() => setFile(null)}
                                        className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors font-medium border border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleUpload}
                                        className="px-6 py-2.5 rounded-xl bg-secondary text-white font-medium hover:bg-secondary/90 transition-all shadow-lg hover:shadow-secondary/20 active:scale-95 flex items-center gap-2"
                                    >
                                        <UploadCloud size={18} />
                                        Upload to Kora
                                    </button>
                                </div>
                            )}

                            {status === 'uploading' && (
                                <div className="space-y-3 max-w-xs mx-auto mt-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-secondary font-medium animate-pulse">Uploading...</span>
                                        <span className="text-gray-400 font-mono">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-[#3a3a3a] h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-secondary transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {status === 'success' && (
                                <div className="flex flex-col items-center text-green-400 mt-6 animate-in slide-in-from-bottom-2 fade-in">
                                    <CheckCircle size={32} className="mb-2" />
                                    <p className="font-medium text-lg">{message}</p>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="flex flex-col items-center text-red-400 mt-6 animate-in py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <AlertCircle size={24} className="mb-2" />
                                    <p className="text-sm font-medium">{message}</p>
                                    <button 
                                        onClick={() => setStatus('idle')}
                                        className="mt-4 text-xs underline hover:text-red-300"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Educational / Helper Info */}
                <div className="mt-12 bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
                    <h3 className="text-lg font-semibold text-white mb-4">How Training Works</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex gap-3">
                            <span className="text-secondary">•</span>
                            <span>Files uploaded here land directly in <b>Firebase Storage (training_audio/)</b>.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-secondary">•</span>
                            <span>When users ask for pronunciations, the system fetches these files as <b>In-Context Voice Examples</b>.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-secondary">•</span>
                            <span>For best results, upload clean audio with minimal background noise. Kora will use this to master Khoekhoegowab clicks (!, |, ||, ‡).</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
