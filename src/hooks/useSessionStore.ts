'use client';

"use client";

import { useEffect, useState } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  content: string;
}

export function useSessionStore(sessionKey = "edgebot-chat") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(sessionKey);
    if (stored) setMessages(JSON.parse(stored));
  }, [sessionKey]);

  const addMessage = (msg: ChatMessage) => {
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(sessionKey, JSON.stringify(updated));
  };

  const clearSession = () => {
    setMessages([]);
    localStorage.removeItem(sessionKey);
  };

  return { messages, setMessages, addMessage, clearSession };
}

