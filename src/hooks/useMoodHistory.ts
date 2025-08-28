import { useEffect, useState } from "react";

export function useMoodHistory(sessionKey = "edgebot-mood-history") {
  const [moodHistory, setMoodHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(sessionKey);
    if (stored) {
      setMoodHistory(JSON.parse(stored));
    }
  }, []);

  const addMood = (mood: string) => {
    const updated = [...moodHistory, mood].slice(-10);
    setMoodHistory(updated);
    localStorage.setItem(sessionKey, JSON.stringify(updated));
  };

  return { moodHistory, addMood };
}
