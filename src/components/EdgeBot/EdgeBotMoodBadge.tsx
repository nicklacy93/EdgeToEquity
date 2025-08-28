'use client';

import { motion } from 'framer-motion/client';

interface Props {
  mood: string;
}

const moodMap: Record<string, string> = {
  positive: '??',
  neutral: '??',
  negative: '??',
  focused: '??',
  anxious: '??',
  angry: '??',
  curious: '??',
};

export default function EdgeBotMoodBadge({ mood }: Props) {
  const emoji = moodMap[mood] || '??';

  return (
    <motion.div
      className='w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 shadow-inner bg-white dark:bg-black'
      whileHover={{ scale: 1.2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className='text-xl'>{emoji}</span>
    </motion.div>
  );
}
