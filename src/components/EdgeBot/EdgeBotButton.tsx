'use client';

import { useState } from 'react';
import { motion } from 'framer-motion/client';
import { Bot } from 'lucide-react';

import EdgeBotGreetingCard from '@/components/EdgeBot/EdgeBotGreetingCard';
import HeroSection from '@/components/dashboard/HeroSection';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import KPIGrid from '@/components/dashboard/KPIGrid';
import TradingViewChart from '@/components/TradingView/TradingViewChart';
import EdgeBotModal from '@/components/EdgeBot/EdgeBotModal';

export default function DashboardPage() {
  const [isBotOpen, setIsBotOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-black via-[#0e0e0e] to-[#111111] text-white px-4 py-6 md:px-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-black to-transparent blur-3xl" />

      <div className="max-w-6xl mx-auto space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <EdgeBotGreetingCard />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <HeroSection />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <RecentActivityCard />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <KPIGrid />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="rounded-2xl border border-purple-500/40 bg-black/30 backdrop-blur-md shadow-[0_0_12px_1px_rgba(139,92,246,0.2)] overflow-hidden">
          <TradingViewChart symbol="SPY" height={400} />
        </motion.div>
      </div>

      {/* Floating EdgeBot Toggle */}
      <motion.button
        onClick={() => setIsBotOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-700 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl hover:shadow-purple-500/50 transition-all z-50"
        aria-label="Open EdgeBot"
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      <EdgeBotModal isOpen={isBotOpen} onClose={() => setIsBotOpen(false)} />
    </div>
  );
}
