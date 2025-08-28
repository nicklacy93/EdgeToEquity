import { useState, useEffect } from "react";
import { EmotionalContext, EdgeBotMood } from "@/types/edgebot";
import { calculateMood, getContextualMessage, getMoodTheme } from "@/utils/edgeBotLogic";

export const useEdgeBotState = () => {
  const [mood, setMood] = useState<EdgeBotMood>("focused");
  const [confidence, setConfidence] = useState(0.6);
  const [winRate, setWinRate] = useState(0.5);
  const [pnlTrend, setPnlTrend] = useState<"up" | "flat" | "down">("flat");
  const [contextMessage, setContextMessage] = useState("");
  const [theme, setTheme] = useState(getMoodTheme("focused"));

  useEffect(() => {
    const saved = localStorage.getItem("edgeBotContext");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMood(parsed.mood);
      setConfidence(parsed.confidence);
      setContextMessage(getContextualMessage(parsed.mood, "morning", "Nick"));
      setTheme(getMoodTheme(parsed.mood));
    }
  }, []);

  useEffect(() => {
    const calculatedMood = calculateMood(winRate, pnlTrend);
    setMood(calculatedMood);
    setConfidence(calculatedMood === "confident" ? 0.9 : calculatedMood === "supportive" ? 0.4 : 0.6);
    setContextMessage(getContextualMessage(calculatedMood, "morning", "Nick"));
    setTheme(getMoodTheme(calculatedMood));

    localStorage.setItem("edgeBotContext", JSON.stringify({
      mood: calculatedMood,
      confidence,
      winRate,
      pnlTrend,
      lastInteraction: new Date().toISOString()
    }));
  }, [winRate, pnlTrend]);

  return {
    mood,
    confidence,
    theme,
    contextMessage,
    updateWinRate: setWinRate,
    updatePnlTrend: setPnlTrend
  };
};
