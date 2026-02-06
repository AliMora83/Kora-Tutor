"use client";

import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ChatInterface, Message } from '@/components/ChatInterface';
import { checkAndIncrementProgress } from '@/lib/progress';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';

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

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load Chat History
        const chatRef = doc(db, 'users', currentUser.uid, 'chats', 'default');
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
          const history = chatSnap.data().messages || [];
          if (history.length > 0) {
            setMessages(history);
            setHasStarted(true);
          }
        }
      } else {
        // Clear or Keep local? Choosing to clear for privacy on logout.
        setMessages([]);
        setHasStarted(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToast({ message: msg, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const saveMessageToFirestore = async (msg: Message) => {
    if (!user) return;
    try {
      const chatRef = doc(db, 'users', user.uid, 'chats', 'default');
      // Simple set with merge or update
      // We use check validity implicitly by blindly writing or creating
      await setDoc(chatRef, {
        messages: arrayUnion(msg),
        updatedAt: new Date()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    const userMsg: Message = { role: 'user', content: userText };

    // UI Updates
    setMessages(prev => [...prev, userMsg]);
    setHasStarted(true);
    setInput('');
    setIsLoading(true);

    // Persist User Message
    await saveMessageToFirestore(userMsg);

    // Progress Check
    const updatedLesson = checkAndIncrementProgress(userText);
    if (updatedLesson) {
      showToast(`${updatedLesson.title} +1 XP`);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMsg: Message = { role: 'assistant', content: data.content };
        setMessages(prev => [...prev, botMsg]);
        // Persist Bot Message
        await saveMessageToFirestore(botMsg);
      } else {
        throw new Error(data.content || 'API Error');
      }
    } catch (error: unknown) {
      const err = error as Error;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${err.message || "Connection Error."}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- EMPTY STATE (Claude/Gemini Welcome) ---
  if (!hasStarted) {
    return (
      <WelcomeScreen
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isLoading={isLoading}
      />
    );
  }

  // --- CHAT STATE (Scrollable History) ---
  return (
    <>
      <ChatInterface
        messages={messages}
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isLoading={isLoading}
      />

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
    </>
  );
}
