'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp,
} from 'firebase/firestore';
import { PanelLeftClose, PanelLeftOpen, Pencil, Trash2 } from 'lucide-react';

interface ChatSession {
    id: string;
    title?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

interface ChatHistoryPanelProps {
    userId: string | null;
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onDeleteActive: () => void;
}

function formatDate(ts?: Timestamp): string {
    if (!ts) return '';
    return ts.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ChatHistoryPanel({ userId, activeChatId, onSelectChat, onDeleteActive }: ChatHistoryPanelProps) {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    // Hydration-safe default: collapsed on mobile, expanded on desktop
    useEffect(() => {
        setMounted(true);
        setIsOpen(window.matchMedia('(min-width: 768px)').matches);
    }, []);

    useEffect(() => {
        if (!userId) {
            setChats([]);
            return;
        }
        const q = query(collection(db, 'users', userId, 'chats'), orderBy('updatedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            const sessions = snap.docs
                .map((d) => ({ id: d.id, ...d.data() } as ChatSession & { messages?: unknown[] }))
                .filter((c) => Array.isArray(c.messages) && c.messages.length > 0);
            setChats(sessions);
        });
        return () => unsubscribe();
    }, [userId]);

    if (!userId) return null;

    const startRename = (chat: ChatSession) => {
        setEditingId(chat.id);
        setEditingTitle(chat.title || '');
    };

    const saveRename = async (chatId: string) => {
        const title = editingTitle.trim();
        setEditingId(null);
        if (!userId) return;
        await updateDoc(doc(db, 'users', userId, 'chats', chatId), { title: title || null });
    };

    const handleDelete = async (chatId: string) => {
        if (!userId) return;
        if (!window.confirm('Delete this chat? This cannot be undone.')) return;
        await deleteDoc(doc(db, 'users', userId, 'chats', chatId));
        if (chatId === activeChatId) onDeleteActive();
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {mounted && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Persistent reopen button — needed on mobile since the collapsed panel is width:0 and unclickable */}
            {mounted && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    title="Show chat history"
                    className="md:hidden fixed top-3 left-3 z-30 bg-[#1a1a1a] border border-white/10 text-gray-300 hover:text-secondary p-2 rounded-lg shadow-lg transition-colors"
                >
                    <PanelLeftOpen size={18} />
                </button>
            )}

            <div
                className={`
                    bg-[#141414] border-r border-white/5 flex flex-col overflow-hidden
                    transition-[width] duration-300 ease-in-out
                    md:relative md:h-full
                    fixed md:static inset-y-0 left-0 z-40
                    ${isOpen ? 'w-64' : 'w-0 md:w-12'}
                `}
            >
                {/* Toggle */}
                <div className="flex items-center justify-end p-2 border-b border-white/5 shrink-0">
                    <button
                        onClick={() => setIsOpen((v) => !v)}
                        title={isOpen ? 'Collapse chat history' : 'Expand chat history'}
                        className="text-gray-400 hover:text-secondary hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                        {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                    </button>
                </div>

                {isOpen && (
                    <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                        {chats.length === 0 && (
                            <p className="text-xs text-gray-500 text-center py-6 px-2">No previous chats yet.</p>
                        )}
                        {chats.map((chat) => {
                            const isActive = chat.id === activeChatId;
                            const isEditing = editingId === chat.id;
                            const displayTitle = chat.title || `Chat — ${formatDate(chat.createdAt || chat.updatedAt)}`;
                            return (
                                <div
                                    key={chat.id}
                                    className={`group rounded-xl border px-3 py-2 cursor-pointer transition-colors ${
                                        isActive
                                            ? 'bg-secondary/15 border-secondary/30 text-secondary'
                                            : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-white/10 text-gray-300'
                                    }`}
                                    onClick={() => !isEditing && onSelectChat(chat.id)}
                                >
                                    {isEditing ? (
                                        <input
                                            autoFocus
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            onBlur={() => saveRename(chat.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveRename(chat.id);
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                            className="w-full bg-transparent text-sm font-medium outline-none border-b border-secondary/40"
                                        />
                                    ) : (
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{displayTitle}</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5">{formatDate(chat.updatedAt)}</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); startRename(chat); }}
                                                    title="Rename"
                                                    className="p-1 text-gray-400 hover:text-secondary"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(chat.id); }}
                                                    title="Delete"
                                                    className="p-1 text-gray-400 hover:text-red-400"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
