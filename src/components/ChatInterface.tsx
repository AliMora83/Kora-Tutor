import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';

export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

interface ChatInterfaceProps {
    messages: Message[];
    input: string;
    setInput: (value: string) => void;
    handleSend: () => void;
    isLoading: boolean;
}

export function ChatInterface({ messages, input, setInput, handleSend, isLoading }: ChatInterfaceProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="h-[calc(100dvh-4rem)] md:h-screen flex flex-col relative">
            {/* Header - Minimal */}
            <header className="p-4 flex justify-between items-center text-gray-500 text-sm border-b border-white/5">
                <span>Kora 2.0 Flash</span>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Online</span>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-800">
                <div className="max-w-3xl mx-auto space-y-8">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[90%] ${msg.role === 'user' ? 'bg-[#2a2a2a] text-gray-200' : 'text-gray-200'} p-4 rounded-2xl`}>
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center mb-2">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/30">
                                            <Image
                                                src="/logo.png"
                                                alt="Kora Logo"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                <p className="leading-normal whitespace-pre-wrap text-base">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="p-4 rounded-2xl">
                                <div className="flex items-center gap-3 text-gray-500 animate-pulse">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden opacity-50 border border-gray-600">
                                        <Image
                                            src="/logo.png"
                                            alt="Kora Logo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    Thinking...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Bottom Input */}
            <div className="p-4 md:p-6 mx-auto w-full max-w-4xl">
                <div className="relative bg-[#2a2a2a] rounded-3xl border border-white/5 focus-within:border-secondary/50 transition-colors">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Message Kora..."
                        className="w-full bg-transparent text-white p-4 pr-14 outline-none placeholder-gray-500 text-lg"
                        disabled={isLoading}
                        autoFocus
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 disabled:opacity-50 disabled:bg-gray-700 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-center text-gray-600 text-xs mt-3">
                    Kora can make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
}
