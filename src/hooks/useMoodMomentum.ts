'use client';

import { useEffect, useState } from 'react';

export type Mood = 'neutral' | 'streak' | 'drawdown' | 'optimistic' | 'frustrated';

const MOOD_KEY = 'moodHistory';

export function useMoodMomentum(currentMood: Mood) {
  const [moodHistory, setMoodHistory] = useState<Mood[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(MOOD_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    setMoodHistory(parsed);
  }, []);

  useEffect(() => {
    if (!currentMood) return;
    const updated = [...moodHistory.slice(-4), currentMood]; // keep last 5
    setMoodHistory(updated);
    localStorage.setItem(MOOD_KEY, JSON.stringify(updated));
  }, [currentMood]);

  const getTrend = (): 'up' | 'down' | 'steady' => {
    const streaks = moodHistory.filter(m => m === 'streak').length;
    const drawdowns = moodHistory.filter(m => m === 'drawdown').length;
    if (streaks > drawdowns) return 'up';
    if (drawdowns > streaks) return 'down';
    return 'steady';
  };

  return { moodHistory, trend: getTrend() };
}
