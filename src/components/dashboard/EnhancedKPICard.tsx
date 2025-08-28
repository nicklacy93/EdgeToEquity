'use client';
"use client";

import { motion } from "framer-motion";
import { useEdgeBotMood } from "@/context/EdgeBotMoodContext";

interface EnhancedKPICardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}

export default function EnhancedKPICard({
  title,
  value,
  change,
  positive = true
}: EnhancedKPICardProps) {
  const { mood, theme } = useEdgeBotMood();

  const colorMap = {
    confident: "from-emerald-400/20 to-emerald-500/10",
    focused: "from-blue-400/15 to-blue-500/10",
    supportive: "from-amber-400/20 to-amber-500/10",
    alert: "from-red-500/20 to-red-600/10"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[mood]} border border-white/10 shadow-md transition-all duration-300`}
    >
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm text-white/80 font-medium">{title}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${positive ? "text-green-400 bg-green-900/30" : "text-red-400 bg-red-900/30"}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
    </motion.div >
  );
}

