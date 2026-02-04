import React from 'react';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';

interface WelcomeScreenProps {
    input: string;
    setInput: (value: string) => void;
    handleSend: () => void;
    isLoading: boolean;
}

export function WelcomeScreen({ input, setInput, handleSend, isLoading }: WelcomeScreenProps) {
    return (
        <div className="h-[calc(100dvh-4rem)] md:h-screen flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
            {/* Greeting */}
            <div className="text-center mb-12 animate-fade-in-up">
                <div className="flex justify-center mb-6">
                    <div className="relative w-24 h-24 rounded-full border-4 border-secondary/20 shadow-2xl shadow-secondary/10 overflow-hidden">
                        <Image
                            src="/logo.png"
                            alt="Kora Icon"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 tracking-tight">
                    !Gâi tsēs, Ali
                </h1>
                <p className="text-gray-400 text-lg md:text-xl font-light">
                    How can I help you learn Nama today?
                </p>
            </div>

            {/* Input Box (Centered) */}
            <div className="w-full relative shadow-2xl shadow-black/50 rounded-3xl bg-[#2a2a2a] border border-white/5 transition-all hover:border-white/10 focus-within:border-secondary/50 focus-within:ring-1 focus-within:ring-secondary/50">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Ask Kora about clicks, grammar, or translation..."
                    className="w-full bg-transparent text-white text-lg placeholder-gray-500 p-6 pr-16 outline-none resize-none min-h-[80px] rounded-3xl"
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 bottom-3 p-3 bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:bg-gray-700 text-white rounded-2xl transition-all"
                >
                    <MoveRight size={20} />
                </button>
            </div>

            {/* Quick Prompts */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <SuggestionCard
                    label="Translate phrase"
                    text="How do I say 'Good Morning'?"
                    onClick={(t) => { setInput(t); /* auto focus handled by state binding */ }}
                />
                <SuggestionCard
                    label="Explain Grammar"
                    text="Explain the 4 clicks in Nama"
                    onClick={(t) => setInput(t)}
                />
                <SuggestionCard
                    label="Practice Script"
                    text="Write a dialogue for buying food"
                    onClick={(t) => setInput(t)}
                />
            </div>
        </div>
    );
}

function SuggestionCard({ label, text, onClick }: { label: string, text: string, onClick: (t: string) => void }) {
    return (
        <button
            onClick={() => onClick(text)}
            className="text-left p-4 rounded-2xl bg-[#2a2a2a]/50 border border-white/5 hover:bg-[#2a2a2a] hover:border-secondary/30 transition-all group"
        >
            <span className="block text-xs text-gray-500 mb-1 group-hover:text-secondary uppercase tracking-wider font-bold">{label}</span>
            <span className="block text-gray-300 font-medium">{text}</span>
        </button>
    );
}
