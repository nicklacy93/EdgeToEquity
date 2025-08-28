"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, BookOpen, MessageSquare } from "lucide-react";
import TradingPsychologyTimeline from "@/components/dashboard/TradingPsychologyTimeline";
import TradeAnalysis from "@/components/dashboard/TradeAnalysis";
import InsightLibrary from "@/components/dashboard/InsightLibrary";

export default function PsychologyTab() {
  const [open, setOpen] = useState({
    timeline: true,
    analysis: false,
    insights: false,
  });

  const toggleSection = (key: keyof typeof open) => {
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Emotional Journey Timeline */}
      <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-800/40 backdrop-blur-sm">
        <button
          onClick={() => toggleSection("timeline")}
          className="w-full px-6 py-5 text-left flex items-center justify-between group hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-4">
            <Brain className="w-6 h-6 text-pink-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">🧠 Your Emotional Journey</h3>
              <p className="text-sm text-slate-400">
                See how your mindset shapes your trading decisions—awareness is your edge
              </p>
            </div>
          </div>
          <div className="text-slate-400 group-hover:text-white text-xl">
            {open.timeline ? "−" : "+"}
          </div>
        </button>
        <AnimatePresence initial={false}>
          {open.timeline && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              <TradingPsychologyTimeline />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trade Behavior Analysis */}
      <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-800/40 backdrop-blur-sm">
        <button
          onClick={() => toggleSection("analysis")}
          className="w-full px-6 py-5 text-left flex items-center justify-between group hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-4">
            <MessageSquare className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">🔍 Behavior Detective</h3>
              <p className="text-sm text-slate-400">
                Uncover your hidden habits and emotional triggers
              </p>
            </div>
          </div>
          <div className="text-slate-400 group-hover:text-white text-xl">
            {open.analysis ? "−" : "+"}
          </div>
        </button>
        <AnimatePresence initial={false}>
          {open.analysis && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              <TradeAnalysis />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Insight Vault */}
      <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-800/40 backdrop-blur-sm">
        <button
          onClick={() => toggleSection("insights")}
          className="w-full px-6 py-5 text-left flex items-center justify-between group hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-4">
            <BookOpen className="w-6 h-6 text-violet-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">📚 Wisdom Vault</h3>
              <p className="text-sm text-slate-400">
                Reflect on journal entries and moments of clarity—this is your personal edge
              </p>
            </div>
          </div>
          <div className="text-slate-400 group-hover:text-white text-xl">
            {open.insights ? "−" : "+"}
          </div>
        </button>
        <AnimatePresence initial={false}>
          {open.insights && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              <InsightLibrary />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
