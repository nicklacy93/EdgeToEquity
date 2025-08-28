'use client';

import { useState } from "react";
import { useEmotionalState } from "@/hooks/useEmotionalState";

export function useEdgeBotAI() {
  const [loading, setLoading] = useState(false);
  const { mood, confidence } = useEmotionalState();

  const getBotResponse = async (message: string, messages: any[]) => {
    setLoading(true);

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: message,
          messages: [
            { role: "user", content: message },
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.content,
            })),
          ],
        }),
      });

      const data = await res.json();

      return data.reply ?? "No response from Claude.";
    } catch (error) {
      console.error("EdgeBot Claude error:", error);
      return "?? Something went wrong while talking to Claude.";
    } finally {
      setLoading(false);
    }
  };

  return { getBotResponse, loading, mood, confidence };
}
