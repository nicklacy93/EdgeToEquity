'use client';

import { useMoodMomentum } from '@/hooks/useMoodMomentum';

interface Props {
  currentMood: 'neutral' | 'streak' | 'drawdown' | 'optimistic' | 'frustrated';
}

export default function MoodTrendBadge({ currentMood }: Props) {
  const { trend } = useMoodMomentum(currentMood);

  const trendEmoji = {
    up: '??',
    down: '??',
    steady: '??'
  };

  const label = {
    up: 'Improving',
    down: 'Worsening',
    steady: 'Stable'
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground border border-border w-fit">
      <span>{trendEmoji[trend]}</span>
      <span className="font-medium">{label[trend]}</span>
    </div>
  );
}
