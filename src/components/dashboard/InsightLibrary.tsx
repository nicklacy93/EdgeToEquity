"use client";

import { useState } from "react";
import {
  Brain,
  Heart,
  Microscope,
  BookOpen,
  Compass,
  Sparkles,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

interface Insight {
  id: string;
  title: string;
  category: "strategy" | "psychology" | "analysis" | "reflection";
  scenario: string;
  context: string;
  learningPoints: string[];
  emotionalThemes: string[];
}

const mockInsights: Insight[] = [
  {
    id: "1",
    title: "The Winning Streak Trap: When Success Breeds Overreach",
    category: "psychology",
    scenario: "After five consecutive profitable trades, you find yourself doubling position sizes and dismissing risk management rules.",
    context: "Success can create emotional blind spots, leading to gradual increases in risk-taking without conscious awareness.",
    learningPoints: [
      "Winning streaks often trigger unconscious confidence escalation",
      "Daily emotional check-ins help catch overconfidence before it impacts decisions",
      "True mastery means maintaining discipline especially when things go well",
    ],
    emotionalThemes: ["overconfidence", "euphoria", "risk creep"],
  },
  {
    id: "2",
    title: "Finding Courage After the Fall: Support Level Psychology",
    category: "analysis",
    scenario: "A key support level holds firm after multiple tests, but your recent loss makes you hesitate to re-enter.",
    context: "Technical patterns can rebuild emotional confidence, but past pain often clouds our ability to see fresh opportunities.",
    learningPoints: [
      "Valid technical setups deserve consideration regardless of recent history",
      "Separating past trades from present opportunities is a crucial skill",
      "Sometimes the market offers second chances to rebuild confidence",
    ],
    emotionalThemes: ["hesitation", "rebuilding trust", "fear override"],
  },
  {
    id: "3",
    title: "The Breakout That Got Away: Learning from Paralysis",
    category: "reflection",
    scenario: "You watched a textbook breakout unfold perfectly but couldn't pull the trigger due to memories of false breakouts.",
    context: "Previous disappointments created an emotional anchor that prevented action on a genuinely valid setup.",
    learningPoints: [
      "Past false signals shouldn't overshadow present valid opportunities",
      "Documenting both wins and misses helps identify emotional patterns",
      "Awareness of decision paralysis is the first step toward breaking free",
    ],
    emotionalThemes: ["analysis paralysis", "fear of loss", "opportunity cost"],
  },
  {
    id: "4",
    title: "The Late-Night Trade: Fatigue and Decision Quality",
    category: "psychology",
    scenario: "After a long day, you spot what seems like an opportunity but your usual analytical sharpness feels dulled.",
    context: "Mental fatigue compromises judgment, yet the desire to 'not miss out' can override our better instincts.",
    learningPoints: [
      "Decision quality deteriorates significantly when mentally exhausted",
      "Setting trading hour boundaries protects against fatigue-driven mistakes",
      "Sometimes the best trade is the one you don't take",
    ],
    emotionalThemes: ["mental fatigue", "FOMO", "self-discipline"],
  },
  {
    id: "5",
    title: "Recovery Mode: Bouncing Back from a String of Losses",
    category: "reflection",
    scenario: "Three losing trades in a row have you questioning your strategy, leading to smaller positions and second-guessing every decision.",
    context: "Loss sequences create emotional scarring that can persist long after the actual financial impact has faded.",
    learningPoints: [
      "Drawdowns test psychological resilience more than account balance",
      "Gradual position sizing during recovery helps rebuild confidence",
      "Distinguishing between strategy flaws and normal variance is crucial",
    ],
    emotionalThemes: ["confidence erosion", "self-doubt", "rebuilding resilience"],
  },
  {
    id: "6",
    title: "Market Mood Shifts: Adapting When Conditions Change",
    category: "strategy",
    scenario: "Your trend-following approach worked beautifully for weeks, but suddenly markets turn choppy and every signal whipsaws.",
    context: "Emotional attachment to recently successful strategies can blind us to changing market conditions.",
    learningPoints: [
      "Market regimes change faster than our emotional adaptation",
      "Strategy flexibility requires emotional flexibility first",
      "Recognizing when to step aside is as important as knowing when to engage",
    ],
    emotionalThemes: ["strategy attachment", "adaptation resistance", "market humility"],
  },
];

const categories = [
  { id: "all", label: "All Learning Moments", icon: Brain },
  { id: "strategy", label: "Strategy Insights", icon: Compass },
  { id: "psychology", label: "Emotional Patterns", icon: Heart },
  { id: "analysis", label: "Decision Analysis", icon: Microscope },
  { id: "reflection", label: "Personal Reflection", icon: BookOpen },
];

export default function InsightLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = selectedCategory === "all"
    ? mockInsights
    : mockInsights.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Insight Library
          </h3>
          <p className="text-sm text-slate-400">
            Reflective case studies to deepen self-awareness and emotional intelligence in trading
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="w-4 h-4 text-purple-400" />
          {filtered.length} learning moments
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedCategory(id)}
            className={`p-3 rounded-xl border transition-all duration-200 ${
              selectedCategory === id
                ? "bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/20"
                : "bg-slate-800/60 border-slate-600 text-slate-400 hover:bg-slate-700/80 hover:border-slate-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span className="font-semibold text-sm">{label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/60 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-white font-bold text-base leading-tight pr-2">{insight.title}</h4>
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0
                ${insight.category === 'psychology' ? 'bg-pink-500/10 text-pink-300 border-pink-500/30' :
                  insight.category === 'strategy' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' :
                  insight.category === 'analysis' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' :
                  'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'}
              `}>
                {categories.find(c => c.id === insight.category)?.label.split(' ')[0]}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-slate-300 text-sm mb-3 leading-relaxed italic">
                "{insight.scenario}"
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {insight.context}
              </p>
            </div>

            <div className="mb-4">
              <h5 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Key Insights
              </h5>
              <ul className="space-y-2">
                {insight.learningPoints.map((point, i) => (
                  <li key={i} className="text-sm text-emerald-300 leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-600/50 pt-3">
              <h6 className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Emotional Themes
              </h6>
              <div className="flex flex-wrap gap-1.5">
                {insight.emotionalThemes.map((theme, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full border border-slate-600/50 hover:bg-slate-600/50 transition-colors"
                  >
                    #{theme}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-4xl mb-4">🧠</div>
          <h4 className="text-lg font-bold text-white mb-2">No insights found</h4>
          <p className="text-sm text-slate-400">
            Try exploring a different category to discover new learning moments.
          </p>
        </motion.div>
      )}
    </div>
  );
}
