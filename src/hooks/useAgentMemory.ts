import { useEffect, useState } from 'react';

export interface AgentMemory {
  id: string;
  content: string;
  timestamp: string;
}

export function useAgentMemory(agent: string) {
  const key = \gent_memory_\\;
  const [memories, setMemories] = useState<AgentMemory[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      setMemories(JSON.parse(stored));
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(memories));
  }, [memories, key]);

  const addMemory = (content: string) => {
    const newMemory: AgentMemory = {
      id: \mem-\\,
      content,
      timestamp: new Date().toISOString(),
    };
    setMemories((prev) => [newMemory, ...prev]);
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((mem) => mem.id !== id));
  };

  return { memories, addMemory, deleteMemory };
}
