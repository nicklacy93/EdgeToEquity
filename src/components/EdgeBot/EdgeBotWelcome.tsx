'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, ArrowRight, Sparkles, Stethoscope, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EdgeBotWelcomeProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
  onNavigateToStrategy?: () => void;
  onNavigateToDoctor?: () => void;
  userProgress?: {
    strategiesBuilt: number;
    conceptsLearned: number;
    learningStreak: number;
  };
}

export default function EdgeBotWelcome({
  isVisible,
  onClose,
  onComplete,
  onNavigateToStrategy,
  onNavigateToDoctor,
  userProgress = { strategiesBuilt: 0, conceptsLearned: 0, learningStreak: 0 }
}: EdgeBotWelcomeProps) {
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isVisible) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleGetStarted = () => {
    if (onNavigateToStrategy) {
      onNavigateToStrategy();
    }
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence key="edgebot-welcome-animate-presence">
      {/* Background Overlay */}
      <motion.div
        key="background-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
      />

      {/* Centered EdgeBot Modal */}
      <motion.div
        key="modal-container"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          key="modal-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="relative max-w-2xl w-full bg-[hsl(var(--card-bg-hsl))] border border-[hsl(var(--border-hsl))] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border-hsl))]">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-400/30"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(52, 211, 153, 0.4)",
                    "0 0 0 10px rgba(52, 211, 153, 0)",
                    "0 0 0 0 rgba(52, 211, 153, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              >
                <Brain className="w-6 h-6 text-emerald-400" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-[hsl(var(--text-main))]">EdgeBot</h3>
                <p className="text-xs text-[hsl(var(--text-muted))]">Your AI trading coach</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[hsl(var(--hover-hsl))] rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-[hsl(var(--text-muted))]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[hsl(var(--text-main))] mb-2">
                Welcome to EdgeToEquity! 🚀
              </h2>
              <p className="text-sm text-[hsl(var(--text-muted))] mb-6">
                Your AI-powered trading strategy platform
              </p>

              <div className="bg-[hsl(var(--background-hsl))] rounded-xl p-4 border border-[hsl(var(--border-hsl))] mb-6">
                {isTyping ? (
                  <div className="flex items-center gap-2">
                    <div className="typing-dot"></div>
                    <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <p className="text-[hsl(var(--text-main))] leading-relaxed text-lg">
                    Hi {user?.name || 'Demo User'}! 👋 I'm EdgeBot, your AI trading coach. Let me show you how easy it is to build and analyze professional trading strategies!
                  </p>
                )}
              </div>

              {/* Three Key Benefits */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--text-main))] mb-1">Build Strategies</h3>
                    <p className="text-sm text-[hsl(var(--text-muted))]">Create professional trading strategies with AI guidance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Stethoscope className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--text-main))] mb-1">Analyze & Optimize</h3>
                    <p className="text-sm text-[hsl(var(--text-muted))]">Get AI-powered analysis and optimization suggestions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--text-main))] mb-1">Track Progress</h3>
                    <p className="text-sm text-[hsl(var(--text-muted))]">Monitor your learning and strategy development</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-[hsl(var(--background-hsl))] hover:bg-[hsl(var(--hover-hsl))] border border-[hsl(var(--border-hsl))] rounded-xl transition-colors text-[hsl(var(--text-main))] font-medium"
                >
                  Skip Tour
                </button>
                <button
                  onClick={handleGetStarted}
                  className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 