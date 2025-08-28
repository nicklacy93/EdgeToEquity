// src/hooks/coachingTriggers.ts

import { ChatMessage } from "@/components/EdgeBot/EdgeBotChat";

export function checkForNudge(messages: ChatMessage[], mood: string): string | null {
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.sender !== "user") return null;

  const msg = lastMessage.content.toLowerCase();

  // 🔄 Simple examples (customize later)
  if (msg.includes("nervous") || mood === "drawdown") {
    return "💡 It's okay to feel uncertain. Breathe and refocus — you've done the work.";
  }

  if (msg.includes("trigger") || msg.includes("pull the trigger")) {
    return "⚠️ Remember: execution should follow a valid setup, not emotions.";
  }

  if (msg.includes("off") || msg.includes("something feels off")) {
    return "🧠 Trust your instincts. Step back and reassess — clarity matters more than speed.";
  }

  return null;
}
