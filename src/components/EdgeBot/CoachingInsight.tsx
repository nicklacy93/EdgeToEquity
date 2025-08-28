'use client';

import { motion } from 'framer-motion/client';

export default function CoachingInsight({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className='bg-yellow-900/70 text-yellow-100 px-3 py-2 rounded-lg text-sm border border-yellow-600'
    >
      💡 {text}
    </motion.div>
  );
}
