"use client";

import { useState } from "react";
import { motion } from "framer-motion/client";
import { BookOpen, Sparkles, Brain, TrendingUp, CheckCircle } from "lucide-react";
import { fetchStrategyAgent } from "@/utils/fetchStrategyAgent";
import { useMindStore } from "@/store/useMindStore";

export default function JournalAgent() {
  const {
    mood,
    journalEntry,
    moodHistory,
    setMood,
    setJournalEntry,
    logMood,
    resetMind,
  } = useMindStore();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [justSummarized, setJustSummarized] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setJustSummarized(false);
    const result = await fetchStrategyAgent({
      endpoint: "/api/journal",
      payload: { trades: journalEntry },
    });
    setSummary(result.content);
    setLoading(false);
    setJustSummarized(true);
    // Reset celebration state after 3 seconds
    setTimeout(() => setJustSummarized(false), 3000);
  };

  const getPlaceholderText = () => {
    const placeholders = [
      "What did the market teach you today? Share your wins, lessons, and observations...",
      "Reflect on today's trades—what worked, what didn't, and what you learned...",
      "Document your trading journey: decisions made, emotions felt, insights gained...",
      "Capture your market observations, trade setups, and psychological notes...",
      "Your trading story matters—record the patterns, feelings, and breakthroughs..."
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  const [placeholder] = useState(getPlaceholderText());

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <BookOpen className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-amber-400">Trading Journal Insights</h2>
          <p className="text-sm text-slate-400">Transform your experiences into trading wisdom</p>
        </div>
      </div>

      {/* Journal Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Sparkles className="w-4 h-4" />
          <span>Share your trading journey</span>
        </div>

        <motion.div
          className="relative"
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <textarea
            className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all duration-200 resize-none"
            rows={8}
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder={placeholder}
          />

          {/* Character indicator */}
          <div className="absolute bottom-3 right-3 text-xs text-slate-500">
            {journalEntry.length > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1"
              >
                <Brain className="w-3 h-3" />
                {journalEntry.length} characters of wisdom
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={handleSummarize}
          disabled={loading || !journalEntry.trim()}
          className={`
            px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 min-w-[200px] justify-center
            ${loading
              ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
              : journalEntry.trim()
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }
          `}
          whileHover={journalEntry.trim() && !loading ? { scale: 1.02 } : {}}
          whileTap={journalEntry.trim() && !loading ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Analyzing your journey...</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              <span>Unlock Your Insights</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="text-center py-6 space-y-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-slate-400 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Your AI trading coach is reviewing your experiences...
          </motion.div>
          <p className="text-xs text-slate-500">
            Identifying patterns, extracting wisdom, and crafting actionable insights
          </p>
        </motion.div>
      )}

      {/* Success Celebration */}
      {justSummarized && (
        <motion.div
          className="text-center py-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
            <CheckCircle className="w-5 h-5" />
            <span>Insights extracted! Your growth continues.</span>
          </div>
        </motion.div>
      )}

      {/* Summary Results */}
      {summary && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <Brain className="w-5 h-5" />
            <span>Your Trading Insights</span>
          </div>

          <motion.div
            className="p-6 bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-slate-700/50 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="prose prose-slate prose-sm max-w-none">
              <div className="text-slate-100 leading-relaxed whitespace-pre-wrap">
                {summary}
              </div>
            </div>
          </motion.div>

          {/* Encouragement Footer */}
          <motion.div
            className="text-center text-sm text-slate-400 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Every reflection strengthens your edge. Keep documenting your journey.
          </motion.div>
        </motion.div>
      )}

      <ul className="mt-4 text-sm">
        {moodHistory.map((entry, i) => (
          <li key={i}>
            {entry.timestamp}: {entry.mood}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
