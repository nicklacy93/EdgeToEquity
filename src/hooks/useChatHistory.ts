import { useEffect, useState } from 'react';

export function useChatHistory(agent: string) {
  const storageKey = \chat_history_\\;
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  return [messages, setMessages] as const;
}
