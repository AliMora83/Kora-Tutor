import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import AuthButton from './AuthButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import FirebaseAudioPlayer from './FirebaseAudioPlayer';
import { Send, Plus, Trash2 } from 'lucide-react';

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
    onNewChat: () => void;
    onDeleteChat: () => void;
}

export function ChatInterface({ messages, input, setInput, handleSend, isLoading, onNewChat, onDeleteChat }: ChatInterfaceProps) {
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
            <header className="p-4 flex gap-4 justify-between items-center text-gray-500 text-sm border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Kora 2.0 Flash</span>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse my-auto"></span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onNewChat} className="flex items-center gap-1.5 hover:text-white transition-colors bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-white/5">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Chat</span>
                    </button>
                    <button onClick={onDeleteChat} className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <AuthButton />
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-800">
                <div className="max-w-3xl mx-auto space-y-8">
                    {messages.map((msg, idx) => {
                        // Ensure any unencoded spaces in the audio: URL are replaced with %20 so markdown parses it correctly
                        const sanitizedContent = msg.content.replace(/\[([^\]]+)\]\(audio:(.+?)\)/g, (match, title, filename) => {
                            const encodedFilename = filename.split(' ').join('%20');
                            return `[${title}](audio:${encodedFilename})`;
                        });

                        return (
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
                                <div className="leading-normal text-base">
                                    <ReactMarkdown
                                        urlTransform={(value: string) => value}
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            table: ({node, ...props}) => (
                                                <div className="overflow-x-auto my-4 rounded-xl border border-[#3a3a3a]">
                                                    <table className="w-full text-sm text-left border-collapse" {...props} />
                                                </div>
                                            ),
                                            thead: ({node, ...props}) => <thead className="bg-[#2a2a2a] text-xs uppercase text-gray-400" {...props} />,
                                            th: ({node, ...props}) => <th className="px-6 py-4 font-semibold border-b border-[#3a3a3a]" {...props} />,
                                            td: ({node, ...props}) => <td className="px-6 py-4 border-b border-[#3a3a3a] whitespace-nowrap" {...props} />,
                                            tr: ({node, ...props}) => <tr className="hover:bg-[#333333] transition-colors" {...props} />,
                                            p: ({node, ...props}) => <p className="mb-4 last:mb-0 whitespace-pre-wrap" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                                            a: ({node, href, children, ...props}) => {
                                                if (href?.startsWith('audio:')) {
                                                    const filename = href.replace('audio:', '');
                                                    return <FirebaseAudioPlayer filename={filename} />;
                                                }
                                                return <a href={href} className="text-secondary hover:underline" {...props}>{children}</a>;
                                            },
                                            code: (props) => {
                                                const { className, children, node, ...rest } = props;
                                                const match = /language-(\w+)/.exec(className || '');
                                                return match ? (
                                                    <div className="overflow-x-auto bg-[#1a1a1a] p-4 rounded-xl my-4 text-sm max-w-full">
                                                        <code className={className} {...rest}>{children}</code>
                                                    </div>
                                                ) : (
                                                    <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#e0e0e0] font-mono text-sm" {...rest}>{children}</code>
                                                );
                                            }
                                        }}
                                    >
                                        {sanitizedContent}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                        );
                    })}

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
