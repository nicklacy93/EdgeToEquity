"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useEmotionalState } from "@/hooks/useEmotionalState";
import { sendToAI } from "@/utils/sendToAI";
import { coachingTriggers } from "@/data/coachingTriggers";
import ContextSidebar from "./ContextSidebar";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  content: string;
  provider?: "Claude" | "OpenAI";
}

export default function EdgeBotChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("strategy");
  const [nudgeCount, setNudgeCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { mood } = useEmotionalState();

  const messageCount = useMemo(() => messages.length, [messages]);
  const botMessages = useMemo(() => messages.filter(m => m.sender === "bot").length, [messages]);
  const bookmarkedMessages = useMemo(() => messages.filter(m => isBookmarked(m.id)).length, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: input,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const nudges = coachingTriggers[mood as keyof typeof coachingTriggers];
    if (nudges?.length) {
      const nudge = nudges[nudgeCount % nudges.length];
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", content: nudge }]);
      setNudgeCount(prev => prev + 1);
    }

    try {
      const response = await sendToAI(input, selectedAgent);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", content: response }]);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-black rounded-xl shadow-xl">
      <hr className="mb-4" />

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <p>?? Mood: <span className="font-medium">{mood}</span></p>
        <p>?? Agent: <span className="font-medium">{selectedAgent}</span></p>
        <p>?? Messages Sent: {messageCount} / {botMessages}</p>
        <p>?? Bookmarked: {bookmarkedMessages}</p>
        <p>?? Nudges: {nudgeCount}</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          className="w-full rounded px-3 py-2 bg-gray-900 text-white focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
