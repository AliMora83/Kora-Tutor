"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function AITutorPage() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Mî ǁguiba! (Hello!) I am your AI Kora Tutor. I can help you translate english to Nama, explain grammar, or generate scripts. What would you like to learn today?' }
    ]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Add User Message
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            } else {
                // Throw specific error from backend
                throw new Error(data.content || 'API Error');
            }
        } catch (error: any) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `⚠️ ${error.message || "Connection Error. Please check console."}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('/bg-pattern.svg')] bg-cover relative flex flex-col">
            <div className="absolute inset-0 bg-background/90 z-0"></div>

            {/* Header */}
            <header className="relative z-10 border-b border-gray-800 p-4 flex items-center justify-between glass-card rounded-none border-x-0 border-t-0 bg-background/80">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                        ← Back
                    </Link>
                    <h1 className="text-xl font-bold text-white">AI <span className="text-secondary">Kora</span> Tutor</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-500 font-mono">ONLINE</span>
                </div>
            </header>

            {/* Chat Area */}
            <main className="relative z-10 flex-1 container mx-auto p-4 max-w-4xl flex flex-col overflow-hidden h-[calc(100vh-80px)]">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-700">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                ? 'bg-primary/20 text-white rounded-br-none border border-primary/30'
                                : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                                }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800 text-gray-400 rounded-2xl p-4 rounded-bl-none border border-gray-700 italic">
                                Consulting the ancestors...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="glass-card p-2 flex gap-2 items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about Nama clicks or vocabulary..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 px-4 py-3"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-secondary hover:bg-secondary/90 text-white rounded-xl px-6 py-3 font-bold transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Thinking...' : 'Send'}
                    </button>
                </div>
            </main>
        </div>
    );
}
