"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Brain,
  TrendingUp,
  Heart,
  Target,
  Award,
  BookOpen,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Download,
  Star,
  Sparkles
} from "lucide-react";

interface SessionInsight {
  category: "strategy" | "emotional" | "learning" | "achievement";
  title: string;
  description: string;
  sentiment: "positive" | "neutral" | "growth";
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
}

interface SessionSummaryProps {
  sessionData?: {
    duration: number;
    focusAreas: string[];
    emotionalJourney: {
      start: string;
      end: string;
      peaks: string[];
      valleys: string[];
    };
    keyInsights: SessionInsight[];
    nextSteps: string[];
  };
  onClose?: () => void;
  trigger?: "manual" | "milestone" | "auto";
}

// Design System Constants
const DESIGN_SYSTEM = {
  zIndex: {
    modal: 50,
    overlay: 45
  },
  transitions: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6
  }
};

export default function SessionSummary({ sessionData, onClose, trigger = "manual" }: SessionSummaryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [personalizedMessage, setPersonalizedMessage] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mock data for demonstration - in real app, this would come from EdgeBot memory hooks
  const mockSessionData = {
    duration: 45,
    focusAreas: [
      "Moving average crossover strategy",
      "Risk management principles",
      "Market psychology insights",
      "Backtesting optimization"
    ],
    emotionalJourney: {
      start: "Curious and eager to learn",
      end: "Confident and strategically focused",
      peaks: ["Breakthrough moment with RSI signals", "Successful backtest validation"],
      valleys: ["Initial confusion about position sizing", "Temporary doubt about strategy effectiveness"]
    },
    keyInsights: [
      {
        category: "strategy" as const,
        title: "Strategic Clarity Emerged",
        description: "You've developed a clear understanding of how moving averages can signal trend changes, especially when combined with volume confirmation.",
        sentiment: "positive" as const
      },
      {
        category: "emotional" as const,
        title: "Emotional Resilience Built",
        description: "You worked through initial uncertainty and transformed doubt into strategic confidence—exactly what professional traders do.",
        sentiment: "growth" as const
      },
      {
        category: "learning" as const,
        title: "Risk Management Mastery",
        description: "Your grasp of position sizing and stop-loss placement shows you're thinking like a disciplined trader, not a gambler.",
        sentiment: "positive" as const
      },
      {
        category: "achievement" as const,
        title: "Backtest Validation Success",
        description: "Your strategy showed promising results in historical testing—you're building on solid foundations.",
        sentiment: "positive" as const
      }
    ],
    nextSteps: [
      "Test your refined strategy with smaller position sizes",
      "Continue journaling emotional responses to market movements",
      "Explore additional confirmation indicators for your signals",
      "Set up alerts for your key technical setups"
    ]
  };

  const data = sessionData || mockSessionData;

  // Calculate session quality and set personalized message
  useEffect(() => {
    const sessionQuality = calculateSessionQuality(data);
    const messages = {
      excellent: "Outstanding session! You've shown real growth as a trader today.",
      good: "Solid work today! You're building the habits of successful traders.",
      learning: "Every challenge you faced today made you stronger. Great resilience!",
      challenging: "Today tested your discipline, and you showed up. That's what matters."
    };

    setPersonalizedMessage(messages[sessionQuality]);

    // Trigger celebration for milestone sessions
    if (sessionQuality === "excellent" || trigger === "milestone") {
      setTimeout(() => setShowCelebration(true), 1000);
    }
  }, [data, trigger]);

  const calculateSessionQuality = (sessionData: typeof data): "excellent" | "good" | "learning" | "challenging" => {
    const insightCount = sessionData.keyInsights.length;
    const focusAreaCount = sessionData.focusAreas.length;
    const duration = sessionData.duration;

    if (insightCount >= 4 && focusAreaCount >= 4 && duration >= 30) return "excellent";
    if (insightCount >= 3 && focusAreaCount >= 3) return "good";
    if (insightCount >= 2) return "learning";
    return "challenging";
  };

  const calculateSessionAchievements = (sessionData: typeof data): Achievement[] => {
    const achievements: Achievement[] = [];

    if (sessionData.focusAreas.length >= 4) {
      achievements.push({ id: "multitasker", title: "Multitasker", icon: "🎯" });
    }
    if (sessionData.duration >= 60) {
      achievements.push({ id: "focused", title: "Deep Focus", icon: "🧠" });
    }
    if (sessionData.keyInsights.length >= 4) {
      achievements.push({ id: "insights", title: "Insight Hunter", icon: "💡" });
    }
    if (sessionData.emotionalJourney.peaks.length >= 2) {
      achievements.push({ id: "resilient", title: "Emotionally Resilient", icon: "💪" });
    }

    return achievements;
  };

  const exportSessionSummary = (data: typeof mockSessionData) => {
    // This would export the session summary
    console.log("Exporting session summary:", data);
  };

  const getInsightIcon = (category: SessionInsight["category"]) => {
    switch (category) {
      case "strategy": return Target;
      case "emotional": return Heart;
      case "learning": return Brain;
      case "achievement": return Award;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (sentiment: SessionInsight["sentiment"]) => {
    switch (sentiment) {
      case "positive": return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
      case "growth": return "text-amber-400 border-amber-400/30 bg-amber-400/10";
      default: return "text-blue-400 border-blue-400/30 bg-blue-400/10";
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Enhanced Emotional Journey Visualization
  const renderEmotionalJourney = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-amber-400 font-medium">
        <Heart className="w-5 h-5" />
        <span>Your Emotional Evolution</span>
        <div className="flex-1 h-px bg-amber-500/20 ml-3" />
      </div>

      <div className="relative p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl border border-slate-700/50">
        {/* Emotional Arc Visualization */}
        <div className="relative h-16 mb-4">
          <svg className="w-full h-full" viewBox="0 0 400 60">
            {/* Baseline */}
            <line x1="0" y1="50" x2="400" y2="50" stroke="rgb(71 85 105)" strokeWidth="1" strokeDasharray="2,2" />

            {/* Emotional Journey Path */}
            <motion.path
              d="M0,50 Q100,30 200,45 T400,25"
              fill="none"
              stroke="rgb(34 197 94)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Key Emotional Points */}
            {[
              { x: 50, y: 45, label: "Start", color: "rgb(148 163 184)" },
              { x: 150, y: 35, label: "Peak", color: "rgb(34 197 94)" },
              { x: 250, y: 55, label: "Valley", color: "rgb(251 191 36)" },
              { x: 350, y: 25, label: "End", color: "rgb(34 197 94)" }
            ].map((point, index) => (
              <motion.circle
                key={point.label}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={point.color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
              />
            ))}
          </svg>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-sm">Journey Start:</div>
            <div className="text-slate-300 italic px-3 py-1 bg-slate-700/50 rounded-full">
              "{data.emotionalJourney.start}"
            </div>
          </div>
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-slate-400 text-sm">Final State:</div>
            <div className="text-emerald-400 italic font-medium px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/30">
              "{data.emotionalJourney.end}"
            </div>
          </motion.div>
        </div>

        {/* Emotional Insights */}
        <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <div className="text-sm font-medium text-amber-300 mb-1">Emotional Growth</div>
          <div className="text-xs text-slate-400">
            You transformed initial {data.emotionalJourney.start.toLowerCase()} into {data.emotionalJourney.end.toLowerCase()}—exactly the kind of mindset evolution that creates consistent traders.
          </div>
        </div>
      </div>
    </div>
  );

  // Dynamic Achievement Recognition
  const renderAchievements = () => {
    const achievements = calculateSessionAchievements(data);

    return achievements.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-4 bg-gradient-to-r from-blue-500/10 to-amber-500/10 rounded-xl border border-blue-500/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-amber-300 font-medium">Session Achievements</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + index * 0.1, type: "spring" }}
              className="p-2 bg-slate-800/50 rounded-lg text-center"
            >
              <div className="text-lg">{achievement.icon}</div>
              <div className="text-xs text-white font-medium">{achievement.title}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Personalized Next Steps with Confidence Building
  const renderPersonalizedNextSteps = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-400 font-medium">
        <TrendingUp className="w-5 h-5" />
        <span>Your Personalized Path Forward</span>
        <div className="flex-1 h-px bg-blue-500/20 ml-3" />
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/10 rounded-xl border border-blue-500/20 mb-4">
        <div className="text-sm text-blue-300 font-medium mb-2">
          Based on today's session, here's what will accelerate your growth:
        </div>
      </div>

      <div className="space-y-3">
        {data.nextSteps.map((step, index) => {
          const priority = index === 0 ? "high" : index === 1 ? "medium" : "low";
          const colors = {
            high: "from-emerald-500/20 to-blue-500/20 border-emerald-500/30",
            medium: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
            low: "from-blue-500/20 to-green-500/20 border-blue-500/30"
          };

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`p-4 rounded-xl bg-gradient-to-r ${colors[priority]} border backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium mb-1">{step}</div>
                  <div className="text-xs text-slate-400">
                    {priority === "high" && "Start with this—it'll have the biggest impact"}
                    {priority === "medium" && "Important for continued development"}
                    {priority === "low" && "Consider when you're ready to expand"}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${priority === "high" ? "bg-emerald-500/20 text-emerald-300" :
                    priority === "medium" ? "bg-amber-500/20 text-amber-300" :
                      "bg-blue-500/20 text-blue-300"
                  }`}>
                  {priority}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Celebration Animation for Milestones
  const renderCelebration = () => (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti effect */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              initial={{
                x: "50%",
                y: "50%",
                scale: 0
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                scale: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: DESIGN_SYSTEM.zIndex.modal }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DESIGN_SYSTEM.transitions.normal }}
    >
      <motion.div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: DESIGN_SYSTEM.transitions.normal, ease: "easeOut" }}
      >
        {renderCelebration()}

        {/* Enhanced Header with Personalization */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-amber-500/10 rounded-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <BookOpen className="w-6 h-6 text-amber-400" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white">Your Trading Journey Today</h2>
                <motion.p
                  className="text-sm text-emerald-400 font-medium"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {personalizedMessage}
                </motion.p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Session Duration</div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDuration(data.duration)}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content with Better Spacing */}
        <div className="p-6 space-y-8 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Focus Areas with Progress Indicators */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <Target className="w-5 h-5" />
              <span>What You Accomplished</span>
              <div className="flex-1 h-px bg-emerald-500/20 ml-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.focusAreas.map((area, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800/70 transition-all"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </motion.div>
                    <div>
                      <div className="text-slate-300 text-sm font-medium">{area}</div>
                      <div className="text-xs text-slate-500">Completed</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Emotional Journey */}
          {renderEmotionalJourney()}

          {/* Session Achievements */}
          {renderAchievements()}

          {/* Enhanced Key Insights with Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-medium">
              <Brain className="w-5 h-5" />
              <span>Key Breakthroughs & Insights</span>
              <div className="flex-1 h-px bg-blue-500/20 ml-3" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {data.keyInsights.map((insight, index) => {
                const Icon = getInsightIcon(insight.category);
                return (
                  <motion.div
                    key={index}
                    className={`p-5 rounded-xl border ${getInsightColor(insight.sentiment)} hover:scale-[1.01] transition-all`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="p-2 bg-white/10 rounded-lg"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="font-medium text-white mb-2 flex items-center gap-2">
                          {insight.title}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${insight.category === "strategy" ? "bg-blue-500/20 text-blue-300" :
                              insight.category === "emotional" ? "bg-pink-500/20 text-pink-300" :
                                insight.category === "learning" ? "bg-blue-500/20 text-blue-300" :
                                  "bg-emerald-500/20 text-emerald-300"
                            }`}>
                            {insight.category}
                          </span>
                        </div>
                        <div className="text-sm text-slate-300 leading-relaxed">{insight.description}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Personalized Next Steps */}
          {renderPersonalizedNextSteps()}
        </div>

        {/* Enhanced Footer with Action Options */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-emerald-400 rounded-full"
              />
              <div className="text-sm text-slate-400 italic">
                Every session builds your edge. You're becoming the trader you envision.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => exportSessionSummary(data)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              <motion.button
                onClick={onClose}
                className="px-8 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Growing
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
