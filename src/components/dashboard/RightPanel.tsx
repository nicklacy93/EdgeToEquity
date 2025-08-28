"use client";

import { motion, AnimatePresence } from "framer-motion";
import SessionStats from "./SessionStats";
import SessionTools from "./SessionTools";
import TradeAnalysis from "./TradeAnalysis";
import InsightLibrary from "./InsightLibrary";
import {
  BarChart3,
  Target,
  Zap,
  Activity,
  Brain,
  TrendingUp,
  Clock,
  BugPlay,
  BookOpenText,
  FileBarChart2,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  viewType:
    | "live"
    | "review"
    | "strategy"
    | "generator"
    | "explainer"
    | "debugger"
    | "backtest";
}

export default function RightPanel({ viewType }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const viewConfig = {
    live: {
      title: "Live Trading Assistant",
      description: "Real-time tools and insights for active trading",
      icon: Zap,
      color: "emerald",
      gradient: "from-emerald-500/20 to-emerald-400/10",
      glowColor: "shadow-emerald-500/20",
      borderGlow: "hover:border-emerald-400/50",
      psychologyNote: "Stay focused and trust your plan",
      statusText: "Live Session Active",
      actionHint: "Monitor your emotional state and execution"
    },
    review: {
      title: "Performance Analysis",
      description: "Deep dive into your trading psychology and metrics",
      icon: BarChart3,
      color: "blue",
      gradient: "from-blue-500/20 to-blue-400/10",
      glowColor: "shadow-blue-500/20",
      borderGlow: "hover:border-blue-400/50",
      psychologyNote: "Learn from patterns to improve future performance",
      statusText: "Analysis Mode",
      actionHint: "Reflect on decisions and emotional patterns"
    },
    strategy: {
      title: "Strategy Optimization",
      description: "Market opportunities and strategic planning tools",
      icon: Target,
      color: "purple",
      gradient: "from-purple-500/20 to-purple-400/10",
      glowColor: "shadow-purple-500/20",
      borderGlow: "hover:border-purple-400/50",
      psychologyNote: "Plan with confidence, execute with discipline",
      statusText: "Strategy Planning",
      actionHint: "Prepare setups and manage risk proactively"
    },
    generator: {
      title: "Strategy Generator",
      description: "Create and customize a trading strategy with AI help",
      icon: BookOpenText,
      color: "purple",
      gradient: "from-purple-500/20 to-purple-400/10",
      glowColor: "shadow-purple-500/20",
      borderGlow: "hover:border-purple-400/50",
      psychologyNote: "Innovation starts with intention",
      statusText: "Generating Strategy",
      actionHint: "Describe your idea and let EdgeBot draft it"
    },
    explainer: {
      title: "Strategy Explainer",
      description: "Understand the logic behind your trading code",
      icon: Brain,
      color: "blue",
      gradient: "from-blue-500/20 to-blue-400/10",
      glowColor: "shadow-blue-500/20",
      borderGlow: "hover:border-blue-400/50",
      psychologyNote: "Clarity breeds confidence",
      statusText: "Explaining Code",
      actionHint: "Explore how your strategy behaves"
    },
    debugger: {
      title: "Strategy Debugger",
      description: "Detect logic errors and clean up strategy code",
      icon: BugPlay,
      color: "amber",
      gradient: "from-amber-500/20 to-amber-400/10",
      glowColor: "shadow-amber-500/20",
      borderGlow: "hover:border-amber-400/50",
      psychologyNote: "Bugs are lessons in disguise",
      statusText: "Debugging Active",
      actionHint: "Let EdgeBot optimize and fix issues"
    },
    backtest: {
      title: "Backtest Results",
      description: "Visual performance metrics and equity curve",
      icon: FileBarChart2,
      color: "emerald",
      gradient: "from-emerald-500/20 to-emerald-400/10",
      glowColor: "shadow-emerald-500/20",
      borderGlow: "hover:border-emerald-400/50",
      psychologyNote: "Data tells the story of your edge",
      statusText: "Results Loaded",
      actionHint: "Evaluate effectiveness over time"
    }
  };

  const config = viewConfig[viewType];

  if (!config) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        ⚠️ Invalid view type: <code>{viewType}</code>
      </div>
    );
  }

  const IconComponent = config.icon;

  const colorClasses = {
    emerald: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    blue: "text-blue-400 bg-blue-500/15 border-blue-500/30",
    purple: "text-purple-400 bg-purple-500/15 border-purple-500/30",
    amber: "text-amber-400 bg-amber-500/15 border-amber-500/30"
  };

  const progressClasses = {
    emerald: "bg-emerald-400 shadow-lg shadow-emerald-400/50",
    blue: "bg-blue-400 shadow-lg shadow-blue-400/50",
    purple: "bg-purple-400 shadow-lg shadow-purple-400/50",
    amber: "bg-amber-400 shadow-lg shadow-amber-400/50"
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        className={`
          relative p-6 rounded-2xl backdrop-blur-sm overflow-hidden
          bg-gradient-to-br ${config.gradient}
          border border-slate-700/60 ${config.borderGlow}
          shadow-xl ${config.glowColor}
          transition-all duration-500 cursor-pointer
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 rounded-2xl">
          <motion.div
            animate={{
              background: [
                `radial-gradient(circle at 20% 30%, ${config.gradient.split(' ')[1].replace('/20', '/8')}, transparent 50%)`,
                `radial-gradient(circle at 80% 70%, ${config.gradient.split(' ')[1].replace('/20', '/8')}, transparent 50%)`,
                `radial-gradient(circle at 20% 30%, ${config.gradient.split(' ')[1].replace('/20', '/8')}, transparent 50%)`
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl opacity-60"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-3 rounded-xl border backdrop-blur-sm shadow-lg ${colorClasses[config.color]} group-hover:shadow-xl transition-all duration-300`}
            >
              <IconComponent className="w-6 h-6 drop-shadow-sm" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1 tracking-tight">{config.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{config.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Clock className="w-3 h-3" />
                <span>Session Time</span>
              </div>
              <div className="text-lg font-bold text-white">{formatTime(sessionTime)}</div>
            </div>
          </div>

          {/* Expanded Notes */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t border-white/15">
              <div className="flex items-start gap-3 mb-2">
                <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-300 leading-relaxed italic">💡 {config.psychologyNote}</p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-emerald-300 leading-relaxed">🎯 {config.actionHint}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 overflow-y-auto scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-slate-600/80 hover:scrollbar-thumb-slate-500">
        <AnimatePresence mode="wait">
          {viewType === "review" && (
            <>
              <motion.div
                key="trade-analysis"
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-2xl -z-10" />
                <TradeAnalysis />
              </motion.div>
              <motion.div
                key="insight-library"
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent rounded-2xl -z-10" />
                <InsightLibrary />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="relative group">
            <motion.div whileHover={{ scale: 1.01, y: -2 }} className="relative z-10">
              <SessionTools />
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.01, y: -2 }} className="relative">
            <SessionStats />
          </motion.div>
        </motion.div>

        <div className="h-6" />
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden"
      >
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 10% 50%, rgba(59, 130, 246, 0.05), transparent 50%)",
              "radial-gradient(circle at 90% 50%, rgba(59, 130, 246, 0.05), transparent 50%)",
              "radial-gradient(circle at 10% 50%, rgba(59, 130, 246, 0.05), transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-xl"
        />
        <div className="relative z-10 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 font-medium">{config.statusText}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-2.5 h-2.5 rounded-full shadow-lg ${
                  config.color === "blue"
                    ? "bg-blue-400 shadow-blue-400/50"
                    : config.color === "purple"
                    ? "bg-purple-400 shadow-purple-400/50"
                    : config.color === "amber"
                    ? "bg-amber-400 shadow-amber-400/50"
                    : "bg-emerald-400 shadow-emerald-400/50"
                }`}
              />
              <span className="text-slate-400 font-medium">EdgeBot Active</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <Brain className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-300 font-medium">AI Ready</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
