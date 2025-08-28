"use client";

import { useEdgeMemory } from "@/hooks/useEdgeMemory";

export default function MoodCalendar() {
  const { memory } = useEdgeMemory();

  return (
    <div className="space-y-2 text-sm">
      <h3 className="font-semibold text-purple-400">?? Mood Calendar</h3>
      {memory.map((entry) => (
        <div key={entry.id} className="flex justify-between border-b py-1">
          <div>{entry.date}</div>
          <div>{entry.mood} | {entry.tags.join(", ")}</div>
        </div>
      ))}
    </div>
  );
}
