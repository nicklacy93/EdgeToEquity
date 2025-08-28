"use client";

import { motion } from "framer-motion";
import { Brain, Clock, TrendingUp, Target, BarChart3, Activity } from "lucide-react";

interface EdgeInsight {
  label: string;
  value: string;
  icon: JSX.Element;
  color: string;
}

const insights: EdgeInsight[] = [
  {
    label: "Top Time Window",
    value: "9:35am – 10:10am",
    icon: <Clock className="w-5 h-5 text-emerald-400" />,
    color: "from-emerald-500/20 to-emerald-500/5"
  },
  {
    label: "Best Setup",
    value: "EMA Pullback (72% Win Rate)",
    icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    label: "Emotional Drop Zone",
    value: "After 11:30am — concentration dips",
    icon: <Activity className="w-5 h-5 text-pink-400" />,
    color: "from-pink-500/20 to-pink-500/5"
  },
  {
    label: "Behavioral Nudge",
    value: "Avoid re-entry after loss — 3 of 4 were unprofitable",
    icon: <Target className="w-5 h-5 text-amber-300" />,
    color: "from-amber-500/20 to-amber-500/5"
  },
  {
    label: "Strategy Archetype",
    value: "Momentum Scalper",
    icon: <BarChart3 className="w-5 h-5 text-indigo-400" />,
    color: "from-indigo-500/20 to-indigo-500/5"
  }
];

export default function EdgeProfilePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-slate-800/40 p-6 border border-slate-700/50 backdrop-blur-sm space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-bold text-white">Your Edge Profile</h2>
      </div>
      <p className="text-slate-400 text-sm mb-4">
        Personalized insights based on your historical trade behavior and emotional patterns.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 border border-slate-600 bg-gradient-to-br ${insight.color} transition duration-300 hover:shadow-md`}
          >
            <div className="flex items-center gap-2 text-slate-300 text-sm mb-1">
              {insight.icon}
              <span className="font-medium">{insight.label}</span>
            </div>
            <div className="text-white font-semibold text-sm">{insight.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
