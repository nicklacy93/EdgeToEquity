'use client';

import { motion } from 'framer-motion/client';
import { useEffect, useState } from 'react';
import { useChatMemory } from '@/hooks/useChatMemory';

export default function MemoryCard() {
  const { summary } = useChatMemory();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (summary) {
      setVisible(true);
    }
  }, [summary]);

  if (!visible || !summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-purple-800 to-violet-600 text-white rounded-lg p-4 shadow-md border border-purple-400"
    >
      <div className="text-sm uppercase text-purple-200 mb-1 tracking-wider">Session Memory</div>
      <div className="text-sm whitespace-pre-line text-white font-medium">
        {summary}
      </div>
    </motion.div>
  );
}
