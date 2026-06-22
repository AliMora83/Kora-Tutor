"use client";

import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ChatInterface, Message } from '@/components/ChatInterface';
import ChatHistoryPanel from '@/components/ChatHistoryPanel';
import { checkAndIncrementProgress } from '@/lib/progress';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, arrayUnion, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

interface Toast {
  message: string;
  type: 'success' | 'info';
}

export default function HomePage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // 1. Auth Listener — resumes the most recently active chat, if any
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const chatsRef = collection(db, 'users', currentUser.uid, 'chats');
        const recentQuery = query(chatsRef, orderBy('updatedAt', 'desc'), limit(1));
        const snap = await getDocs(recentQuery);

        if (!snap.empty) {
          const mostRecent = snap.docs[0];
          const history = mostRecent.data().messages || [];
          if (history.length > 0) {
            setMessages(history);
            setHasStarted(true);
            setActiveChatId(mostRecent.id);
          }
        }
      } else {
        setMessages([]);
        setHasStarted(false);
        setActiveChatId(null);
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToast({ message: msg, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const saveMessageToFirestore = async (msg: Message, chatId: string, isFirstMessage: boolean) => {
    if (!user) return;
    try {
      const chatRef = doc(db, 'users', user.uid, 'chats', chatId);
      await setDoc(chatRef, {
        messages: arrayUnion(msg),
        updatedAt: new Date(),
        ...(isFirstMessage && msg.role === 'user'
          ? { title: msg.content.trim().slice(0, 40) }
          : {}),
      }, { merge: true });
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  };

  const loadChat = async (chatId: string) => {
    if (!user) return;
    const chatSnap = await getDoc(doc(db, 'users', user.uid, 'chats', chatId));
    if (chatSnap.exists()) {
      setMessages(chatSnap.data().messages || []);
      setHasStarted(true);
      setActiveChatId(chatId);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: userText };

    // Lazily create a new chat session on first message, rather than on "New Chat" click —
    // avoids littering the history panel with empty chats nobody ever sent a message in.
    const chatId = activeChatId ?? crypto.randomUUID();
    const isFirstMessage = !activeChatId;
    if (!activeChatId) setActiveChatId(chatId);

    // UI Updates
    setMessages(prev => [...prev, userMsg]);
    setHasStarted(true);
    setInput('');
    setIsLoading(true);

    // Persist User Message
    await saveMessageToFirestore(userMsg, chatId, isFirstMessage);

    // Progress Check — V2, gated
    if (FEATURE_FLAGS.XP_SYSTEM) {
      const updatedLesson = checkAndIncrementProgress(userText);
      if (updatedLesson) {
        showToast(`${updatedLesson.title} +1 XP`);
      }
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: data.content };
        setMessages(prev => [...prev, botMsg]);
        // Persist Bot Message
        await saveMessageToFirestore(botMsg, chatId, false);
      } else {
        throw new Error(data.content || 'API Error');
      }
    } catch (error: unknown) {
      const err = error as Error;
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `⚠️ ${err.message || "Connection Error."}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (assistantMsgIndex: number) => {
    if (!activeChatId || isLoading) return;
    const priorMessages = messages.slice(0, assistantMsgIndex);
    if (priorMessages.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: priorMessages }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: data.content };
        setMessages(prev => [...prev, botMsg]);
        await saveMessageToFirestore(botMsg, activeChatId, false);
      } else {
        throw new Error(data.content || 'API Error');
      }
    } catch (error: unknown) {
      const err = error as Error;
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `⚠️ ${err.message || "Connection Error."}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setHasStarted(false);
  };

  const handleDeleteChat = async () => {
    if (user && activeChatId) {
      await deleteDoc(doc(db, 'users', user.uid, 'chats', activeChatId));
    }
    setActiveChatId(null);
    setMessages([]);
    setHasStarted(false);
    showToast("Chat history deleted");
  };

  if (isAuthChecking) {
    return <div className="h-screen w-full bg-[#1b1b1b]" />;
  }

  // --- EMPTY STATE (Claude/Gemini Welcome) ---
  if (!hasStarted) {
    return (
      <div className="flex h-screen overflow-hidden">
        <ChatHistoryPanel
          userId={user?.uid ?? null}
          activeChatId={activeChatId}
          onSelectChat={loadChat}
          onDeleteActive={handleNewChat}
        />
        <div className="flex-1 min-w-0">
          <WelcomeScreen
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  // --- CHAT STATE (Scrollable History) ---
  return (
    <div className="flex h-screen overflow-hidden">
      <ChatHistoryPanel
        userId={user?.uid ?? null}
        activeChatId={activeChatId}
        onSelectChat={loadChat}
        onDeleteActive={handleNewChat}
      />
      <div className="flex-1 min-w-0">
        <ChatInterface
          messages={messages}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isLoading={isLoading}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRegenerate={handleRegenerate}
          userId={user?.uid ?? null}
        />
      </div>

      {/* Success Toast */}
      {
        toast && (
          <div className="fixed top-20 right-4 md:right-8 bg-[#2a2a2a] border border-green-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in-up z-50">
            <div className="p-2 bg-green-500/20 rounded-full text-green-500">
              ✨
            </div>
            <div>
              <p className="font-bold text-sm">Level Up!</p>
              <p className="text-gray-300 text-xs">{toast.message}</p>
            </div>
          </div>
        )
      }
    </div>
  );
}
