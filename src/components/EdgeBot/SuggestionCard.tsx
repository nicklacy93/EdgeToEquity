'use client';
import { motion } from 'framer-motion/client';

export default function SuggestionCard({
  title,
  description,
  confidence
}: {
  title: string;
  description: string;
  confidence: number;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, rotateY: 2 }}
      whileTap={{ scale: 0.98 }}
      className='group relative p-4 rounded-xl border border-slate-600 bg-slate-700/50 hover:border-blue-500/50 text-left transition-all duration-300'
    >
      <div className='absolute top-2 right-2'>
        <div
          className={w-2 h-2 rounded-full }
        />
      </div>
      <motion.div initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}>
        <div className='font-semibold text-white mb-1'>{title}</div>
        <div className='text-slate-400 text-xs'>{description}</div>
      </motion.div>
    </motion.button>
  );
}
