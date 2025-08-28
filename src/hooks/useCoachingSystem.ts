'use client';

import { useEffect, useState } from 'react';
import { ChatMessage, MoodType } from '@/types/ChatTypes';
import coachingTriggers from '@/lib/coachingTriggers';

interface CoachingNudge {
  message: string;
  trigger: string;
  timestamp: string;
}

export default function useCoachingSystem({
  mood,
  moodScore,
  lastUpdated,
  onNudge,
}: {
  mood: MoodType;
  moodScore: number;
  lastUpdated: string;
  onNudge: (nudge: CoachingNudge) => void;
}) {
  const [lastMoodScore, setLastMoodScore] = useState(moodScore);

  useEffect(() => {
    const delta = moodScore - lastMoodScore;

    // Trigger on sharp negative drop
    if (delta < -25) {
      const nudge = coachingTriggers['mood_drop'];
      onNudge({
        message: nudge,
        trigger: 'mood_drop',
        timestamp: new Date().toISOString(),
      });
    }

    // Trigger on specific mood states
    if (mood === 'anxious' || mood === 'angry') {
      const nudge = coachingTriggers[mood];
      onNudge({
        message: nudge,
        trigger: mood,
        timestamp: new Date().toISOString(),
      });
    }

    setLastMoodScore(moodScore);
  }, [moodScore, mood, lastUpdated, onNudge]);
}
