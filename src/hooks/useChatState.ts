'use client';

import { useState, useEffect } from 'react';
import type { ChatMessage } from '@/types/ChatTypes';

const STORAGE_KEY = 'edgebot_chat_history';

export default function useChatState() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    addMessage,
    clearMessages,
  };
}
