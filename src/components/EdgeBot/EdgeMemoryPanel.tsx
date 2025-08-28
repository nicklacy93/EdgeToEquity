"use client";

import { useEdgeMemory } from "@/hooks/useEdgeMemory";

export default function EdgeMemoryPanel() {
  const { memory } = useEdgeMemory();

  if (memory.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-background border shadow-inner space-y-3 max-h-96 overflow-y-auto text-sm">
      <h3 className="font-semibold text-purple-400">?? Past Sessions</h3>
      {memory.map((entry) => (
        <div key={entry.id} className="border-b pb-2 mb-2">
          <div className="text-muted-foreground text-xs">{entry.date}</div>
          <div className="mt-1">?? Mood: <strong>{entry.mood}</strong></div>
          <div>?? Confidence: <strong>{entry.confidence}</strong></div>
          <div>??? Tags: {entry.tags.map(tag => <span key={tag} className="mr-1 text-muted">`{tag}`</span>)}</div>
          {entry.summary && <p className="mt-1 text-muted-foreground italic">“{entry.summary}”</p>}
        </div>
      ))}
    </div>
  );
}
