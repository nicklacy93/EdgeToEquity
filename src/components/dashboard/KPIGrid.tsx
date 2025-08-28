// ? Enhanced KPIGrid.tsx with motion & glow
'use client';

import { motion } from 'framer-motion';

export default function KPIGrid() {
  const metrics = [
    { label: 'Win Rate', value: '68%' },
    { label: 'Edge Score', value: '2.4' },
    { label: 'Avg R:R', value: '3.0' },
    { label: 'Execution Accuracy', value: '87%' }
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05, y: -4 }}
          className='group relative overflow-hidden rounded-xl border border-slate-700
                     bg-slate-800/50 p-8 transition-all duration-500
                     hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20'
        >
          {/* Hover gradient */}
          <div className='absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

          <div className='relative z-10'>
            <div className='text-4xl font-bold text-white mb-2'>{metric.value}</div>
            <div className='text-sm font-medium text-slate-400'>{metric.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
