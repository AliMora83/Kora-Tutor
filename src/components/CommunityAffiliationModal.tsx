'use client';

import React, { useState } from 'react';

interface CommunityAffiliationModalProps {
    onSave: (affiliation: string) => void;
    onSkip: () => void;
}

export default function CommunityAffiliationModal({ onSave, onSkip }: CommunityAffiliationModalProps) {
    const [value, setValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        const trimmed = value.trim();
        if (!trimmed || isSaving) return;
        setIsSaving(true);
        await onSave(trimmed);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
            <div className="w-full max-w-md bg-[#1a1a1a] border border-secondary/20 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-white mb-1">
                    Which Khoi-San community or nation do you belong to?
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                    Optional — helps us build for our people.
                </p>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    placeholder="e.g. Nama, ǁKhomani, Damara..."
                    autoFocus
                    className="w-full bg-[#2a2a2a] text-white p-3 rounded-xl outline-none border border-white/5 focus:border-secondary/50 placeholder-gray-500 mb-5 transition-colors"
                />

                <div className="flex items-center justify-between">
                    <button
                        onClick={onSkip}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Skip for now
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!value.trim() || isSaving}
                        className="px-5 py-2 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
