'use client';
import { useState } from 'react';
import { motion } from 'framer-motion/client';
import KPICard from './KPIGrid';

export default function MobileLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const kpiCards = [
    { label: 'Win Rate', value: '68%' },
    { label: 'Edge Score', value: '2.4' },
    { label: 'Avg R:R', value: '3.0' },
    { label: 'Execution Accuracy', value: '87%' }
  ];

  return (
    <div className='lg:hidden space-y-6'>
      <motion.div initial={false} animate={{ height: isExpanded ? 'auto' : '60px' }} className='overflow-hidden'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-full p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-between'
        >
          <span className='font-semibold'>AI Summary</span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            ?
          </motion.div>
        </button>
      </motion.div>
      <div className='overflow-x-auto pb-4'>
        <div className='flex gap-4 min-w-max'>
          {kpiCards.map((card, i) => <KPICard key={i} {...card} />)}
        </div>
      </div>
    </div>
  );
}
