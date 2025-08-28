'use client';

import { Star, StarOff } from 'lucide-react';

interface Props {
  isBookmarked: boolean;
  onToggle: () => void;
}

export default function BookmarkIcon({ isBookmarked, onToggle }: Props) {
  const Icon = isBookmarked ? Star : StarOff;

  return (
    <button onClick={onToggle} className="ml-2 text-yellow-500 hover:opacity-80">
      <Icon size={16} />
    </button>
  );
}
