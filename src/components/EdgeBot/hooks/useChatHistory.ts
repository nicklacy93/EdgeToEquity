import { useState, useEffect } from 'react';
import { ChatMessageWithMeta } from '@/types/ChatTypes';

export function useChatHistory(agent: string) {
  const storageKey = \chat_history_\\;
  const [history, setHistory] = useState<ChatMessageWithMeta[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, [agent]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(history));
  }, [history, storageKey]);

  return { history, setHistory };
}
