'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Clock, Heart, Sparkles, Award, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface PsychologyDataPoint {
  time: string;
  mood: 'confident' | 'focused' | 'neutral' | 'anxious' | 'frustrated' | 'excited';
  score: number; // 1-10 scale
  event: string;
  tradeOutcome?: 'win' | 'loss' | 'breakeven';
  notes?: string;
}

export default function TradingPsychologyTimeline() {
  const [selectedPoint, setSelectedPoint] = useState<PsychologyDataPoint | null>(null);
  const [compactMode, setCompactMode] = useState(false);
  
  // Enhanced mock data with richer emotional context
  const psychologyData: PsychologyDataPoint[] = [
    {
      time: '09:30',
      mood: 'focused',
      score: 8,
      event: '🌅 Market open - feeling sharp and ready',
      notes: 'Great sleep last night, clear mindset for execution'
    },
    {
      time: '10:15',
      mood: 'confident',
      score: 9,
      event: '🎯 Perfect TSLA scalp execution',
      tradeOutcome: 'win',
      notes: 'Flawless entry, trusted the plan completely'
    },
    {
      time: '11:30',
      mood: 'neutral',
      score: 7,
      event: '⏳ Patiently waiting for quality setup',
      notes: 'Discipline over impulse - no FOMO today'
    },
    {
      time: '12:45',
      mood: 'frustrated',
      score: 4,
      event: '😤 Missed NVDA breakout opportunity',
      notes: 'Hesitation cost me - need to trust the system more'
    },
    {
      time: '14:20',
      mood: 'anxious',
      score: 3,
      event: '📉 AAPL position hit stop loss (-2R)',
      tradeOutcome: 'loss',
      notes: 'Proper risk management saved me from bigger loss'
    },
    {
      time: '15:15',
      mood: 'focused',
      score: 7,
      event: '🧘 Mindful reset and refocus',
      notes: 'Short meditation break helped regain composure'
    },
    {
      time: '15:55',
      mood: 'excited',
      score: 8,
      event: '🚀 Strong SPY finish - day saved!',
      tradeOutcome: 'win',
      notes: 'Resilience paid off - ended green despite setbacks'
    }
  ];

  const moodConfig = {
    confident: { 
      color: 'bg-emerald-500', 
      glowColor: 'shadow-emerald-500/50',
      borderColor: 'border-emerald-400/50',
      icon: TrendingUp, 
      label: 'Confident',
      bgGradient: 'from-emerald-500/20 to-emerald-400/10'
    },
    focused: { 
      color: 'bg-blue-500', 
      glowColor: 'shadow-blue-500/50',
      borderColor: 'border-blue-400/50',
      icon: Brain, 
      label: 'Focused',
      bgGradient: 'from-blue-500/20 to-blue-400/10'
    },
    neutral: { 
      color: 'bg-slate-500', 
      glowColor: 'shadow-slate-500/50',
      borderColor: 'border-slate-400/50',
      icon: Minus, 
      label: 'Neutral',
      bgGradient: 'from-slate-500/20 to-slate-400/10'
    },
    anxious: { 
      color: 'bg-amber-500', 
      glowColor: 'shadow-amber-500/50',
      borderColor: 'border-amber-400/50',
      icon: AlertCircle, 
      label: 'Anxious',
      bgGradient: 'from-amber-500/20 to-amber-400/10'
    },
    frustrated: { 
      color: 'bg-red-500', 
      glowColor: 'shadow-red-500/50',
      borderColor: 'border-red-400/50',
      icon: TrendingDown, 
      label: 'Frustrated',
      bgGradient: 'from-red-500/20 to-red-400/10'
    },
    excited: { 
      color: 'bg-purple-500', 
      glowColor: 'shadow-purple-500/50',
      borderColor: 'border-purple-400/50',
      icon: CheckCircle, 
      label: 'Excited',
      bgGradient: 'from-purple-500/20 to-purple-400/10'
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-blue-400';
    if (score >= 4) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-emerald-500 to-emerald-400';
    if (score >= 6) return 'from-blue-500 to-blue-400';
    if (score >= 4) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  const avgScore = Math.round(psychologyData.reduce((acc, p) => acc + p.score, 0) / psychologyData.length * 10) / 10;
  const peakScore = Math.max(...psychologyData.map(p => p.score));
  const strongPeriods = psychologyData.filter(p => p.score >= 7).length;

  return (
    <div className="space-y-4">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            Psychology Journey
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Your emotional flow throughout today's trading session
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Compact Mode Toggle */}
          <motion.button
            onClick={() => setCompactMode(!compactMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
          >
            {compactMode ? <Eye className="w-4 h-4 text-slate-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              {compactMode ? 'Expand' : 'Compact'}
            </span>
          </motion.button>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300 font-medium">Live</span>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" 
            />
          </div>
        </div>
      </motion.div>

      {/* Main Timeline Container */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-900/60 to-slate-800/40 rounded-2xl border border-slate-700/60 backdrop-blur-sm shadow-2xl">
        {/* Timeline */}
        <div className="relative">
          {/* Enhanced timeline line with gradient */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 rounded-full" />
          
          {/* Timeline points */}
          <div className="space-y-4 sm:space-y-6">
            {psychologyData.map((point, index) => {
              const config = moodConfig[point.mood];
              const IconComponent = config.icon;
              const isSelected = selectedPoint?.time === point.time;
              const shouldShowInsight = !compactMode || isSelected;
              
              return (
                <motion.div
                  key={point.time}
                  initial={{ opacity: 0, x: -24, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="relative flex items-start gap-3 sm:gap-6 group cursor-pointer"
                  onClick={() => setSelectedPoint(isSelected ? null : point)}
                >
                  {/* Streamlined timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        w-10 h-10 sm:w-12 sm:h-12 rounded-full ${config.color} 
                        flex items-center justify-center
                        shadow-lg ${config.glowColor} border-2 ${config.borderColor}
                        transition-all duration-300
                        ${isSelected ? 'ring-2 ring-white/30 ring-offset-1 ring-offset-slate-900' : ''}
                      `}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                    </motion.div>
                    
                    {/* Streamlined score badge */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                      className={`
                        absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full
                        bg-gradient-to-r ${getScoreGradient(point.score)}
                        border-2 border-slate-800 shadow-lg
                        flex items-center justify-center
                        text-xs font-bold text-white
                      `}
                    >
                      {point.score}
                    </motion.div>

                    {/* Winning trade indicator */}
                    {point.tradeOutcome === 'win' && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
                        className="absolute -bottom-0.5 -left-0.5"
                      >
                        <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 drop-shadow-sm" />
                      </motion.div>
                    )}
                  </div>

                  {/* Streamlined content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <span className="text-base sm:text-lg font-bold text-slate-200">
                        {point.time}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-bold
                          ${config.color.replace('bg-', 'bg-')} bg-opacity-20 
                          text-white border border-white/20
                        `}>
                          {config.label}
                        </span>
                        {point.tradeOutcome && (
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-bold border
                            ${point.tradeOutcome === 'win' ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40' :
                              point.tradeOutcome === 'loss' ? 'bg-red-500/25 text-red-300 border-red-500/40' :
                              'bg-slate-500/25 text-slate-300 border-slate-500/40'}
                          `}>
                            {point.tradeOutcome.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors leading-tight">
                      {point.event}
                    </h4>
                    
                    {point.notes && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                        {point.notes}
                      </p>
                    )}

                    {/* Conditional EdgeBot insights */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: shouldShowInsight ? 'auto' : 0,
                        opacity: shouldShowInsight ? 1 : 0
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className={`
                        mt-3 p-3 sm:p-4 rounded-xl border backdrop-blur-sm
                        bg-gradient-to-br ${config.bgGradient}
                        ${config.borderColor}
                        shadow-lg
                      `}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs sm:text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                            <span className="text-slate-300">Score:</span>
                            <span className={`font-bold ${getScoreColor(point.score)}`}>
                              {point.score}/10
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                            <span className="text-slate-300">State:</span>
                            <span className="font-bold text-white">
                              {config.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1.5 bg-blue-500/20 rounded-lg flex-shrink-0">
                              <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm font-bold text-white mb-1">EdgeBot Insight</h5>
                              <p className="text-xs text-slate-300 leading-relaxed italic">
                                {point.score >= 8 ? "🚀 Peak performance zone! You're trading with exceptional clarity and confidence." :
                                 point.score >= 6 ? "✅ Solid emotional balance. Your mindset is well-aligned with your strategy." :
                                 point.score >= 4 ? "⚠️ Heightened emotions detected. Consider taking a brief pause to recenter." :
                                 "🛑 High stress levels. Step away from markets temporarily and return when composed."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Optimized summary stats - horizontal cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-r from-slate-800/60 to-slate-700/40 rounded-xl border border-slate-600/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">Today's Summary</h4>
          </div>
          
          {/* Horizontal stat cards */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 flex-1"
            >
              <div>
                <div className="text-xs text-slate-400 font-medium">Average Score</div>
                <div className="text-lg sm:text-xl font-black text-emerald-400">
                  {avgScore}
                </div>
              </div>
              <div className="text-xs text-emerald-300">
                {avgScore >= 7 ? "Excellent!" : avgScore >= 5 ? "Good balance" : "Room to improve"}
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 flex-1"
            >
              <div>
                <div className="text-xs text-slate-400 font-medium">Peak State</div>
                <div className="text-lg sm:text-xl font-black text-blue-400">
                  {peakScore}
                </div>
              </div>
              <div className="text-xs text-blue-300">
                {peakScore >= 8 ? "Peak flow!" : "Good highs"}
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 flex-1"
            >
              <div>
                <div className="text-xs text-slate-400 font-medium">Strong Periods</div>
                <div className="text-lg sm:text-xl font-black text-amber-400">
                  {strongPeriods}
                </div>
              </div>
              <div className="text-xs text-amber-300">
                {strongPeriods >= 4 ? "Consistent!" : "Building consistency"}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
