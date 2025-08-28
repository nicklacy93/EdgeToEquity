'use client';

import { motion } from "framer-motion";
import { useEdgeBotMood } from "@/context/EdgeBotMoodContext";
import { EdgeBotMoodIndicator } from "@/components/EdgeBot/EdgeBotMoodIndicator";
import { Brain, TrendingUp, Shield, AlertTriangle, Compass, Sparkles, MessageCircle } from "lucide-react";

export default function EdgeBotGreetingCard() {
  const { mood, contextMessage, theme } = useEdgeBotMood();

  const moodConfig: Record<string, any> = {
    confident: {
      gradient: "from-emerald-500/30 via-emerald-400/20 to-emerald-300/10",
      glowColor: "shadow-emerald-500/25",
      borderGlow: "group-hover:shadow-emerald-400/30",
      icon: TrendingUp,
      greeting: "🚀 Ready to dominate the markets?",
      subtext: "Your confidence is showing in the charts",
      encouragement: "Trust your edge today—you've got this!",
      actionHint: "Your winning streak starts with clear execution"
    },
    focused: {
      gradient: "from-blue-500/25 via-blue-400/15 to-blue-300/10",
      glowColor: "shadow-blue-500/25",
      borderGlow: "group-hover:shadow-blue-400/30",
      icon: Brain,
      greeting: "🎯 Your focus is razor-sharp today",
      subtext: "Perfect mindset for precision trading",
      encouragement: "This is your zone—execute with intention",
      actionHint: "Channel this clarity into disciplined setups"
    },
    supportive: {
      gradient: "from-amber-400/25 via-amber-300/15 to-amber-200/10",
      glowColor: "shadow-amber-500/25",
      borderGlow: "group-hover:shadow-amber-400/30",
      icon: Shield,
      greeting: "🤝 I'm here to support your journey",
      subtext: "Every great trader needs a trusted ally",
      encouragement: "We'll navigate this together, step by step",
      actionHint: "Building confidence through smart decisions"
    },
    alert: {
      gradient: "from-red-500/25 via-red-400/15 to-red-300/10",
      glowColor: "shadow-red-500/25",
      borderGlow: "group-hover:shadow-red-400/30",
      icon: AlertTriangle,
      greeting: "⚠️ Stay sharp—markets are volatile",
      subtext: "Your awareness is your greatest asset",
      encouragement: "Heightened awareness keeps you protected",
      actionHint: "Trust your risk management protocols"
    },
    neutral: {
      gradient: "from-slate-500/20 via-slate-400/15 to-slate-300/10",
      glowColor: "shadow-slate-500/25",
      borderGlow: "group-hover:shadow-slate-400/30",
      icon: Compass,
      greeting: "🧭 Welcome back, Nick",
      subtext: "Ready to navigate today's opportunities",
      encouragement: "Let's explore what the markets have to offer",
      actionHint: "Every session is a chance to grow your edge"
    }
  };

  const config = moodConfig[mood];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`
        group relative p-6 rounded-2xl 
        bg-gradient-to-br ${config.gradient}
        border border-white/15 
        shadow-xl ${config.glowColor} ${config.borderGlow}
        backdrop-blur-sm
        hover:border-white/30
        transition-all duration-500
        cursor-pointer overflow-hidden
      `}
    >
      {/* Premium animated background effects */}
      <div className="absolute inset-0 rounded-2xl">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-60" />
        
        {/* Animated sparkle effect */}
        <motion.div
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </div>

      <div className="relative z-10">
        {/* Enhanced header with better visual hierarchy */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-4 flex-1">
            {/* Enhanced icon with better animation */}
            <motion.div
              initial={{ rotate: 0, scale: 1 }}
              animate={{ 
                rotate: mood === 'confident' ? [0, 5, -5, 0] : 0,
                scale: mood === 'alert' ? [1, 1.05, 1] : 1
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.1, rotate: 15 }}
              className="p-3 rounded-xl bg-white/15 backdrop-blur-sm shadow-lg group-hover:bg-white/20 transition-all duration-300"
            >
              <IconComponent className="w-6 h-6 text-white drop-shadow-sm" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white tracking-tight mb-1 leading-tight"
              >
                {config.greeting}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-white/80 font-medium leading-relaxed"
              >
                {config.subtext}
              </motion.p>
              
              {/* New: Emotional encouragement line */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-xs text-white/70 mt-2 italic leading-relaxed"
              >
                {config.encouragement}
              </motion.p>
            </div>
          </div>
          
          {/* Enhanced mood indicator positioning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-shrink-0"
          >
            <EdgeBotMoodIndicator mood={mood} />
          </motion.div>
        </div>

        {/* Enhanced context message with better visual treatment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative mb-4"
        >
          {/* Message container with enhanced styling */}
          <div className="p-4 rounded-xl bg-white/8 backdrop-blur-sm border border-white/15 shadow-inner">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="flex-shrink-0 mt-0.5"
              >
                <Sparkles className="w-4 h-4 text-white/60" />
              </motion.div>
              <p className="text-sm text-white/95 leading-relaxed flex-1">
                {contextMessage}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced action hint with better visual design */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-xs text-white/70">
            <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
            <span className="group-hover:text-white/90 transition-colors duration-300">
              {config.actionHint}
            </span>
          </div>
          
          {/* New: Interactive chat hint */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-all duration-200 cursor-pointer"
          >
            <MessageCircle className="w-3 h-3 text-white/80" />
            <span className="text-xs text-white/80 font-medium">Chat with me</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced glow effect with better performance */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.gradient.split(' ')[1].replace('/30', '/8')}, transparent 60%)`
        }}
      />

      {/* New: Subtle border accent that follows the mood */}
      <div className={`
        absolute inset-x-0 bottom-0 h-0.5 
        bg-gradient-to-r ${config.gradient.replace(/\/\d+/g, '/40')}
        transform scale-x-0 group-hover:scale-x-100
        transition-transform duration-500 origin-left
      `} />
    </motion.div>
  );
}
