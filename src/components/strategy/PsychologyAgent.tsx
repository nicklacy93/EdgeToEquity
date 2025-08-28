"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion/client";
import {
  Brain,
  Heart,
  Sparkles,
  Send,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Shield,
  Star,
  Clock,
  MessageCircle,
  AlertTriangle,
  Target,
  Award
} from "lucide-react";
import { fetchStrategyAgent } from "@/utils/fetchStrategyAgent";
import { useMindStore } from "@/store/useMindStore";

interface AnalysisResult {
  content: string;
  insights: string[];
  emotionalScore?: number;
  patterns?: string[];
  recommendations?: string[];
}

export default function PsychologyAgent() {
  const {
    mood,
    journalEntry,
    moodHistory,
    setMood,
    setJournalEntry,
    logMood,
    resetMind,
  } = useMindStore();
  const [report, setReport] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const motivationalQuotes = [
    "Analyzing your mindset — every trader's edge starts within 🧠",
    "Understanding your emotions is the first step to mastering them 💪",
    "Great traders are made through self-awareness, not just market knowledge 🎯",
    "Your psychological patterns hold the key to consistent profits 🔑",
    "Building emotional intelligence, one insight at a time ✨"
  ];

  const [currentQuote, setCurrentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const handleAnalyze = async () => {
    if (!journalEntry.trim()) {
      setError("Please share your thoughts first — every insight starts with honest reflection 💭");
      return;
    }

    setLoading(true);
    setError("");
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

    try {
      const result = await fetchStrategyAgent({
        endpoint: "/api/psychology",
        payload: { journal: journalEntry },
      });

      // Parse the response to extract insights (mock structure - adapt to your API)
      const analysisResult: AnalysisResult = {
        content: result.content,
        insights: [], // Extract from API response
        emotionalScore: Math.floor(Math.random() * 30) + 70, // Mock score
        patterns: [], // Extract from API response
        recommendations: [] // Extract from API response
      };

      setReport(analysisResult);
      setIsExpanded(true);
    } catch (err) {
      setError("I couldn't process that right now, but your self-reflection is already a win 🌟 Let's try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setJournalEntry("");
    setReport(null);
    setError("");
    setIsExpanded(false);
  };

  const getEmotionalScoreColor = (score: number) => {
    if (score >= 80) return { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Excellent' };
    if (score >= 65) return { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Good' };
    if (score >= 50) return { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Developing' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Needs Focus' };
  };

  const suggestionPrompts = [
    "I felt overwhelmed during my last trade...",
    "I'm struggling with overconfidence after recent wins...",
    "I keep hesitating at good entry points...",
    "I find myself revenge trading after losses...",
    "My emotions seem to drive my decisions more than my plan...",
    "I'm having trouble sticking to my risk management rules..."
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-500/20 rounded-2xl border border-blue-500/30"
          >
            <Brain className="w-8 h-8 text-blue-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">Psychology Coach</h2>
            <p className="text-sm text-slate-400">Your emotional intelligence partner</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gradient-to-r from-blue-500/10 to-blue-500/10 rounded-2xl border border-blue-500/30 backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <Heart className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-lg font-bold text-white mb-2">Welcome to Your Safe Space 🤗</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                Share your trading thoughts, emotions, and experiences. I'm here to help you understand patterns,
                build confidence, and develop the mental edge that separates great traders from the rest.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Share Your Experience</h3>
          </div>

          {/* Suggestion Pills */}
          <div className="mb-4">
            <p className="text-sm text-slate-400 mb-3">💡 Not sure where to start? Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionPrompts.slice(0, 3).map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setJournalEntry(prompt)}
                  className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600 text-xs text-slate-300 hover:text-white transition-all"
                >
                  "{prompt.substring(0, 30)}..."
                </motion.button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              rows={6}
              value={journalEntry}
              onChange={(e) => {
                setJournalEntry(e.target.value);
                setError("");
              }}
              placeholder="How are you feeling about your trading today? Share your thoughts, emotions, wins, struggles, or patterns you've noticed... Remember, awareness is the first step to growth 💭"
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-500">
              {journalEntry.length}/2000
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-amber-300 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleAnalyze}
              disabled={loading || !journalEntry.trim()}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                transition-all duration-300 flex-1
                ${loading || !journalEntry.trim()
                  ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-400 hover:to-blue-400 text-white shadow-lg hover:shadow-blue-500/25'
                }
              `}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Analyzing Your Mindset...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Analyze My Psychology
                </>
              )}
            </motion.button>

            {(journalEntry || report) && (
              <motion.button
                onClick={resetMind}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-xl border border-slate-600 transition-all"
              >
                Start Fresh
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Loading Animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 bg-gradient-to-r from-blue-500/10 to-blue-500/10 rounded-2xl border border-blue-500/30 backdrop-blur-sm text-center"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl mb-4"
            >
              🧠
            </motion.div>
            <motion.h3
              className="text-lg font-bold text-white mb-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Deep Psychological Analysis in Progress
            </motion.h3>
            <p className="text-blue-300 text-sm italic mb-4">{currentQuote}</p>
            <div className="flex items-center justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {report && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Success Header */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="p-3 bg-emerald-500/20 rounded-xl"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Analysis Complete! 🎉
                  </h3>
                  <p className="text-emerald-300 text-sm">
                    You've taken another step toward emotional mastery. Here's what I discovered about your trading mindset:
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Emotional Score Card */}
            {report.emotionalScore && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <h4 className="text-lg font-bold text-white">Emotional Intelligence Score</h4>
                  </div>
                  {report.emotionalScore >= 80 && (
                    <Award className="w-6 h-6 text-yellow-400" />
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-400">Current Level</span>
                      <span className={`text-sm font-bold ${getEmotionalScoreColor(report.emotionalScore).color}`}>
                        {getEmotionalScoreColor(report.emotionalScore).label}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${report.emotionalScore}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className={`h-full rounded-full ${getEmotionalScoreColor(report.emotionalScore).bg.replace('/20', '')}`}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-black ${getEmotionalScoreColor(report.emotionalScore).color}`}>
                      {report.emotionalScore}
                    </div>
                    <div className="text-xs text-slate-400">out of 100</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {report.emotionalScore >= 80 ?
                      "🌟 Outstanding emotional control! You're trading with the mindset of a seasoned professional." :
                      report.emotionalScore >= 65 ?
                        "💪 Solid emotional foundation with room for growth. You're on the right track!" :
                        report.emotionalScore >= 50 ?
                          "🌱 Building emotional awareness is a journey. Each reflection makes you stronger." :
                          "🎯 This is where growth begins. Recognizing emotions is the first step to mastering them."
                    }
                  </p>
                </div>
              </motion.div>
            )}

            {/* Main Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h4 className="text-lg font-bold text-white">Your Psychological Analysis</h4>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-600/50">
                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                    {report.content}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* EdgeBot Coaching Message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-gradient-to-r from-blue-500/10 to-pink-500/10 rounded-2xl border border-blue-500/30 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="p-3 bg-purple-500/20 rounded-xl flex-shrink-0"
                >
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </motion.div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    EdgeBot's Encouragement
                    <Heart className="w-4 h-4 text-pink-400" />
                  </h4>
                  <p className="text-blue-200 leading-relaxed mb-3">
                    {report.emotionalScore && report.emotionalScore >= 75 ?
                      "🚀 Your emotional intelligence is becoming a real competitive edge! Keep building on this self-awareness." :
                      "💪 Every moment of reflection is an investment in your trading future. You're developing skills that separate pros from amateurs."
                    }
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <TrendingUp className="w-4 h-4" />
                    <span>Your next breakthrough is just one insight away</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-5 h-5 text-amber-400" />
                <h4 className="text-lg font-bold text-white">Recommended Next Steps</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Brain, title: "Reflect Daily", desc: "5-min check-ins build awareness", color: "blue" },
                  { icon: Shield, title: "Practice Discipline", desc: "Stick to your rules when emotions run high", color: "emerald" },
                  { icon: Heart, title: "Celebrate Growth", desc: "Acknowledge every step forward", color: "pink" }
                ].map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all
                      ${suggestion.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20' :
                        suggestion.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20' :
                          'bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20'
                      }`}
                  >
                    <suggestion.icon className={`w-5 h-5 mb-2 ${suggestion.color === 'blue' ? 'text-blue-400' :
                      suggestion.color === 'emerald' ? 'text-emerald-400' :
                        'text-pink-400'
                      }`} />
                    <h5 className="font-bold text-white text-sm mb-1">{suggestion.title}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">{suggestion.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="mt-4 text-sm">
        {moodHistory.map((entry, i) => (
          <li key={i}>
            {entry.timestamp}: {entry.mood}
          </li>
        ))}
      </ul>
    </div>
  );
}
