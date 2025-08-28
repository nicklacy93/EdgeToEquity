'use client';

import { useEffect, useRef, useState } from 'react';
import { Mood } from './useMoodMomentum';

export function useSessionMetadata(currentMood: Mood, coachingNudges: number, messageCount: number) {
  const [startTime] = useState(Date.now());
  const [startMood] = useState<Mood>(currentMood);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000)); // in seconds
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return \\m \s\;
  };

  return {
    durationText: formatTime(duration),
    startMood,
    endMood: currentMood,
    coachingNudges,
    messageCount
  };
}
