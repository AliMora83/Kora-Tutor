"use client";

import React, { useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ChatInterface, Message } from '@/components/ChatInterface';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setHasStarted(true);
    setInput('');
    setIsLoading(true);

    try {
      // We include the initial system prompt context implicitly via the backend
      // But for the API call, we just send history.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        throw new Error(data.content || 'API Error');
      }
    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${error.message || "Connection Error."}`
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
    <ChatInterface
      messages={messages}
      input={input}
      setInput={setInput}
      handleSend={handleSend}
      isLoading={isLoading}
    />
  );
}
