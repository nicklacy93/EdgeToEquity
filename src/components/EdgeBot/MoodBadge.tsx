"use client";

import React from "react";
import { useEmotionalState } from "@/hooks/useEmotionalState";

const moodStyles: Record<string, string> = {
  neutral: "bg-gray-600",
  focused: "bg-blue-600",
  drawdown: "bg-red-600",
  streak: "bg-green-600",
  anxious: "bg-yellow-500",
};

const moodEmojis: Record<string, string> = {
  neutral: "😐",
  focused: "🎯",
  drawdown: "📉",
  streak: "🔥",
  anxious: "😰",
};

export default function MoodBadge() {
  const { mood } = useEmotionalState();

  const style = moodStyles[mood] || "bg-gray-700";
  const emoji = moodEmojis[mood] || "💬";

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${style}`}
      title={`Current mood: ${mood}`}
    >
      <span className="mr-1">{emoji}</span>
      {mood.charAt(0).toUpperCase() + mood.slice(1)}
    </div>
  );
}
