"use client";

import { useState } from "react";
import { useChatMemory } from "@/hooks/useChatMemory";
import MoodTrendBadge from "./MoodTrendBadge";
import MoodTrendChart from "./MoodTrendChart";
import { summarizeMemory } from "@/utils/summarizeMemory";
import type { ChatMessage } from "@/types/ChatTypes";

interface ContextSidebarProps {
  messages: ChatMessage[];
}

export default function ContextSidebar({ messages }: ContextSidebarProps) {
  const { memory, bookmarkedMessages, moodTrend } = useChatMemory(messages);

  const hasBookmarks = Array.isArray(bookmarkedMessages) && bookmarkedMessages.length > 0;
  const hasMemory = Array.isArray(memory) && memory.length > 0;

  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const result = await summarizeMemory(messages, moodTrend, bookmarkedMessages);
      setSummary(result);
    } catch (err) {
      console.error("Summary generation error:", err);
      setSummary("⚠️ Something went wrong generating the summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 w-72 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white shadow-2xl space-y-6 z-50">
      {/* Mood Overview */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-1">Mood Overview</h3>
        <MoodTrendBadge />
        <MoodTrendChart />
      </div>

      {/* Bookmarked Messages */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-1">Bookmarked Messages</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {hasBookmarks ? (
            bookmarkedMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-gray-800 p-2 rounded text-xs whitespace-pre-wrap"
              >
                {msg.content}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-xs">No bookmarks yet.</p>
          )}
        </div>
      </div>

      {/* Memory Summary */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-1">Memory Summary</h3>
        <div className="bg-gray-800 p-3 rounded text-xs whitespace-pre-wrap space-y-2">
          {hasMemory ? (
            memory.map((item, idx) => <div key={idx}>• {item}</div>)
          ) : (
            <p className="text-gray-500">No memory data yet.</p>
          )}
        </div>
      </div>

      {/* Summary Generator */}
      <div>
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 px-4 rounded transition-all"
        >
          {loading ? "Generating Summary..." : "📋 Generate Session Summary"}
        </button>

        {summary && (
          <div className="mt-3 bg-gray-800 p-3 rounded text-xs whitespace-pre-wrap">
            {summary}
          </div>
        )}
      </div>
    </div>
  );
}
