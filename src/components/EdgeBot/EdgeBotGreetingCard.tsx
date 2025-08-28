'use client';

import { motion } from "framer-motion";

interface EdgeBotGreetingCardProps {
  userName?: string;
  message?: string;
  mood?: 'confident' | 'focused' | 'supportive' | 'alert' | 'neutral';
}

export default function EdgeBotGreetingCard({
  userName = "Trader",
  message = "Ready to build your next winning strategy!",
  mood = 'confident'
}: EdgeBotGreetingCardProps) {
  const moodStyles = {
    confident: "from-emerald-500/30 to-emerald-400/20",
    focused: "from-blue-500/20 to-blue-400/10",
    supportive: "from-amber-400/20 to-amber-300/10",
    alert: "from-red-500/20 to-red-400/10",
    neutral: "from-gray-500/20 to-gray-400/10"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`p-5 rounded-2xl bg-gradient-to-br ${moodStyles[mood]} border border-white/10 shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Welcome back, {userName}</h2>
        <div className="w-3 h-3 rounded-full bg-white/20"></div>
      </div>

      <p className="text-sm text-white/90 mt-2">{message}</p>
    </motion.div>
  );
}


