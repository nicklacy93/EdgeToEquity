'use client';

import { useEffect, useState } from 'react';
import { rewriteMemory } from '@/utils/sendToAI';

interface MemoryItem {
  id: string;
  original: string;
  rewritten?: string;
  timestamp?: string;
  tags?: string[];
}

export default function AgentMemorySidebar({ agent }: { agent: string }) {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [filter, setFilter] = useState('');
  const [personality, setPersonality] = useState({ preferredTone: 'encouraging' });

  useEffect(() => {
    const stored = localStorage.getItem(`memories_${agent}`);
    if (stored) {
      setMemories(JSON.parse(stored));
    }

    const p = localStorage.getItem('edgebot_personality');
    if (p) {
      setPersonality(JSON.parse(p));
    }
  }, [agent]);

  const filteredMemories = memories.filter((m) =>
    m.original.toLowerCase().includes(filter.toLowerCase()) ||
    m.rewritten?.toLowerCase().includes(filter.toLowerCase()) ||
    m.tags?.some((t) => t.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleRewrite = async (id: string) => {
    const mem = memories.find((m) => m.id === id);
    if (!mem) return;

    const rewritten = await rewriteMemory(mem.original, personality.preferredTone);
    if (!rewritten) return;

    const updated = memories.map((m) =>
      m.id === id ? { ...m, rewritten } : m
    );
    setMemories(updated);
    localStorage.setItem(`memories_${agent}`, JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    localStorage.setItem(`memories_${agent}`, JSON.stringify(updated));
  };

  const handleTagChange = (id: string, newTags: string) => {
    const updated = memories.map((m) =>
      m.id === id ? { ...m, tags: newTags.split(',').map((t) => t.trim()) } : m
    );
    setMemories(updated);
    localStorage.setItem(`memories_${agent}`, JSON.stringify(updated));
  };

  return (
    <div className="p-4 h-full overflow-y-auto bg-background space-y-4">
      <h3 className="text-md font-bold mb-2">Memory for {agent}</h3>

      <div className="p-2">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-1 border rounded text-sm"
          placeholder="Search by keyword or tag..."
        />
      </div>

      {filteredMemories.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No saved memories found.</p>
      ) : (
        filteredMemories.map((mem) => (
          <div key={mem.id} className="border rounded-lg p-3 space-y-2 text-sm bg-muted/30">
            <div>
              <strong>Original:</strong> {mem.original}
            </div>
            {mem.rewritten && (
              <div className="text-purple-600">
                <strong>Rewritten:</strong> {mem.rewritten}
              </div>
            )}

            {mem.tags && mem.tags.length > 0 && (
              <div className="text-xs text-gray-500">
                Tags:{' '}
                {mem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="mr-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-1">
              <input
                type="text"
                defaultValue={mem.tags?.join(', ') || ''}
                onBlur={(e) => handleTagChange(mem.id, e.target.value)}
                className="text-xs border px-2 py-1 rounded w-full"
                placeholder="Add tags (comma-separated)"
              />
            </div>

            <div className="flex gap-2 text-xs mt-2">
              <button
                onClick={() => handleRewrite(mem.id)}
                className="underline text-blue-600 hover:text-blue-800"
              >
                {mem.rewritten ? '✍️ Rewrite Again' : '✍️ Rewrite with Claude'}
              </button>
              <button
                onClick={() => handleDelete(mem.id)}
                className="underline text-red-500 hover:text-red-700"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
