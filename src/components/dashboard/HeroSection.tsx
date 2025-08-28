// ? Enhanced HeroSection.tsx
'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='group relative overflow-hidden rounded-2xl border border-blue-500/30
                 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-cyan-950/40
                 p-8 transition-all duration-500 hover:border-blue-600/60'
    >
      {/* Pulse animation background */}
      <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

      {/* Hero Icon + Title */}
      <div className='relative z-10 flex items-center gap-4 mb-4'>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className='text-4xl'
        >
          ??
        </motion.div>
        <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400
                       bg-clip-text text-transparent'>
          HeroSection is Active
        </h2>
      </div>

      {/* Subtitle */}
      <p className='text-slate-300 text-lg leading-relaxed'>
        Your AI trading edge is analyzing market conditions and your recent performance
        to surface the most valuable insights for today's session.
      </p>
    </motion.div>
  );
}
