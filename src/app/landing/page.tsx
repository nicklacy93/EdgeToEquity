'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import FloatingChat from '@/components/FloatingChat';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext'; // Add this line
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  return (
    <AuthProvider>
      <LandingPageContent />
    </AuthProvider>
  );
}

function LandingPageContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();


  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signup');
    }
  };

  const handleLogin = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  const handleNavigation = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      localStorage.setItem('redirectAfterLogin', path);
      router.push('/auth/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background-hsl))] flex items-center justify-center">
        <div className="text-[hsl(var(--text-main))] text-xl">
          <div className="inline-flex items-center gap-2">
            <div className="typing-dot"></div>
            <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
            <span className="ml-2">Loading EdgeToEquity...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[hsl(var(--background-hsl))] overflow-x-hidden">
        {/* Navigation */}
        <nav className="border-b border-[hsl(var(--border-hsl))] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <motion.div
                className="text-2xl font-bold gradient-text cursor-pointer hover:scale-105 transition-transform"
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                EdgeToEquity
              </motion.div>

              <div className="flex items-center gap-6">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[hsl(var(--text-main),_0.6)]">
                      Welcome, {user.name}
                    </span>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="px-4 py-2 bg-gradient-to-r from-[hsl(var(--primary-hsl))] to-[hsl(var(--secondary-hsl))] text-white font-medium rounded-lg hover:opacity-90 transition-all"
                    >
                      Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLogin}
                      className="text-[hsl(var(--text-main),_0.7)] hover:text-[hsl(var(--text-main))] transition-all duration-200 hover:scale-105"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={handleGetStarted}
                      className="btn-primary"
                    >
                      Get Started
                    </button>
                  </div>
                )}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 py-16 relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--primary-hsl),_0.05)] rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div
              className="absolute top-40 right-20 w-96 h-96 bg-[hsl(var(--secondary-hsl),_0.05)] rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            ></motion.div>
            <motion.div
              className="absolute bottom-20 left-1/2 w-80 h-80 bg-[hsl(var(--accent-hsl),_0.05)] rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            ></motion.div>
          </div>



          {/* Hero Content */}
          <div className="text-center relative z-10">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight pb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="gradient-text">Transform Trading Uncertainty</span>
              <br />
              <span className="gradient-text">Into Your Strategic Edge</span>
            </motion.h1>

            <motion.p
              className="text-2xl mb-6 italic font-medium text-[hsl(var(--secondary-hsl))]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              AI-Powered Insights That Know Your Strategy, Your Mindset, And Your Edge
            </motion.p>

            <motion.p
              className="text-lg mb-16 max-w-5xl mx-auto leading-relaxed text-[hsl(var(--text-main),_0.8)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              EdgeToEquity Is Your Personal AI Trading Coach — Analyzing Your Strategies, Performance, And Edge In Real Time To Help You Trade Smarter, Build Better Strategies, And Grow Consistently. From Uncertainty To Confidence, We Guide Your Complete Strategic Trading Journey.
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div
              className="flex gap-6 justify-center flex-wrap mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <button
                onClick={handleGetStarted}
                className="group px-10 py-4 bg-gradient-to-r from-[hsl(var(--primary-hsl))] to-[hsl(var(--secondary-hsl))] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-[hsl(var(--primary-hsl),_0.4)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">🎯 {user ? 'Enter Platform' : 'Master Your Edge Now'}</span>
              </button>
              <button
                onClick={() => handleNavigation('/dashboard/demo')}
                className="btn-secondary px-10 py-4 font-semibold relative overflow-hidden"
              >
                <span className="relative z-10">📺 {user ? 'Watch Demo' : 'See Demo Video'}</span>
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex justify-center items-center gap-8 flex-wrap text-sm text-[hsl(var(--text-main),_0.6)] mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="flex items-center gap-2 hover:text-[hsl(var(--primary-hsl))] transition-colors">
                <span className="w-2 h-2 bg-[hsl(var(--success-hsl))] rounded-full animate-pulse"></span>
                🎯 Strategy Intelligence
              </div>
              <div className="text-[hsl(var(--border-hsl))]">•</div>
              <div className="flex items-center gap-2 hover:text-[hsl(var(--secondary-hsl))] transition-colors">
                <span className="w-2 h-2 bg-[hsl(var(--secondary-hsl))] rounded-full animate-pulse delay-500"></span>
                ⚡ Multi-Platform Export
              </div>
              <div className="text-[hsl(var(--border-hsl))]">•</div>
              <div className="flex items-center gap-2 hover:text-[hsl(var(--accent-hsl))] transition-colors">
                <span className="w-2 h-2 bg-[hsl(var(--accent-hsl))] rounded-full animate-pulse delay-1000"></span>
                🤖 Dual AI System
              </div>
            </motion.div>
          </div>

          {/* Master the Market Section */}
          <motion.section
            className="mb-32 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className="text-5xl font-bold mb-6 gradient-text">
              Master the Market — Master Yourself
            </h2>
            <p className="text-xl text-[hsl(var(--text-main),_0.8)] max-w-4xl mx-auto leading-relaxed mb-12">
              EdgeToEquity Isn't Just About Price Action And Indicators — It's About Strategy, Analysis, And Systematic Trading. Our AI Learns Your Patterns, Identifies Strategy Weaknesses, And Helps You Trade With Precision And Consistency.
            </p>

            {/* Journey Steps with Better Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div
                className="group text-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-[hsl(var(--danger-hsl),_0.3)] to-[hsl(var(--warning-hsl),_0.3)] border-2 border-[hsl(var(--danger-hsl),_0.4)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--danger-hsl),_0.2)] to-[hsl(var(--warning-hsl),_0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="text-3xl relative z-10">📉</div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[hsl(var(--danger-hsl))]">Uncertainty</h3>
                <p className="text-[hsl(var(--text-main),_0.6)]">Poor Strategy Design, Inconsistent Results, Manual Errors</p>
              </motion.div>

              <motion.div
                className="group text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-[hsl(var(--secondary-hsl),_0.3)] to-[hsl(var(--accent-hsl),_0.3)] border-2 border-[hsl(var(--secondary-hsl),_0.4)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--secondary-hsl),_0.2)] to-[hsl(var(--accent-hsl),_0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="text-3xl relative z-10">🎯</div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[hsl(var(--secondary-hsl))]">AI Coaching</h3>
                <p className="text-[hsl(var(--text-main),_0.6)]">Strategy Analysis, Code Optimization, Performance Insights</p>
              </motion.div>

              <motion.div
                className="group text-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-[hsl(var(--success-hsl),_0.3)] to-[hsl(var(--primary-hsl),_0.3)] border-2 border-[hsl(var(--success-hsl),_0.4)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--success-hsl),_0.2)] to-[hsl(var(--primary-hsl),_0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="text-3xl relative z-10">📈</div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[hsl(var(--success-hsl))]">Mastery</h3>
                <p className="text-[hsl(var(--text-main),_0.6)]">Consistent Profits, Disciplined Execution</p>
              </motion.div>
            </div>
          </motion.section>

          {/* Enhanced 6-Card Feature Grid */}
          <motion.section
            className="mb-32"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
              AI That Understands You — Not Just The Market
            </h2>
            <p className="text-xl text-center text-[hsl(var(--text-main),_0.8)] mb-16 max-w-3xl mx-auto">
              Your Trading Strategies, Performance Patterns, And Optimization Opportunities Are All Part Of Your Edge. EdgeToEquity AI Learns Them To Help You Improve — Automatically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Dual AI System */}
              <motion.div
                className="p-6 rounded-2xl border border-[hsl(var(--border-hsl))] bg-[hsl(var(--card-bg-hsl))] transition-all duration-300 hover:border-[hsl(var(--secondary-hsl),_0.3)] hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 }}
              >
                <div className="relative z-10">
                  <div className="icon-container bg-gradient-to-br from-[hsl(var(--secondary-hsl),_0.4)] to-[hsl(var(--secondary-hsl),_0.5)]">
                    <div className="text-2xl relative z-10">🤖</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[hsl(var(--text-main))]">Dual AI System</h3>
                  <p className="mb-4 leading-relaxed text-[hsl(var(--text-main),_0.7)]">
                    Claude + OpenAI Working Together For Superior Strategy Generation And Advanced Performance Analysis.
                  </p>
                  <div className="text-[hsl(var(--secondary-hsl))] font-semibold text-sm group-hover:text-[hsl(var(--secondary-hsl),_0.8)] transition-colors">
                    The Smartest Trading Partner →
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Strategy Builder */}
              <motion.div
                className="p-6 rounded-2xl border border-[hsl(var(--border-hsl))] bg-[hsl(var(--card-bg-hsl))] transition-all duration-300 hover:border-[hsl(var(--warning-hsl),_0.3)] hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.4 }}
              >
                <div className="relative z-10">
                  <div className="icon-container bg-gradient-to-br from-[hsl(var(--warning-hsl),_0.4)] to-[hsl(var(--warning-hsl),_0.5)]">
                    <div className="text-2xl relative z-10">⚡</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[hsl(var(--text-main))]">Strategy Builder</h3>
                  <p className="mb-4 leading-relaxed text-[hsl(var(--text-main),_0.7)]">
                    AI-Guided Strategy Creation For TradingView PineScript And NinjaTrader NinjaScript. Build Professional Strategies With Interactive Learning That Explains Every Line.
                  </p>
                  <div className="text-[hsl(var(--warning-hsl))] font-semibold text-sm group-hover:text-[hsl(var(--warning-hsl),_0.8)] transition-colors">
                    Build Smarter Strategies →
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Learning Hub */}
              <motion.div
                className="p-6 rounded-2xl border border-[hsl(var(--border-hsl))] bg-[hsl(var(--card-bg-hsl))] transition-all duration-300 hover:border-[hsl(var(--primary-hsl),_0.3)] hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.6 }}
              >
                <div className="relative z-10">
                  <div className="icon-container bg-gradient-to-br from-[hsl(var(--primary-hsl),_0.4)] to-[hsl(var(--accent-hsl),_0.4)]">
                    <div className="text-2xl relative z-10">📚</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[hsl(var(--text-main))]">Learning Hub</h3>
                  <p className="mb-4 leading-relaxed text-[hsl(var(--text-main),_0.7)]">
                    Interactive Trading Education Where AI Explains Every Concept, Code Line, And Strategy Decision. Comprehensive Tutorials, Strategy Workshops, And Community Insights To Accelerate Your Growth.
                  </p>
                  <div className="text-[hsl(var(--primary-hsl))] font-semibold text-sm group-hover:text-[hsl(var(--primary-hsl),_0.8)] transition-colors">
                    Accelerate Your Growth →
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>



          {/* Final CTA Section */}
          <motion.div
            className="glass-effect rounded-2xl p-16 text-center relative overflow-hidden group hover:border-[hsl(var(--primary-hsl),_0.6)] transition-all duration-500"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary-hsl),_0.1)] to-[hsl(var(--secondary-hsl),_0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 gradient-text">
                Ready To Transform Your Trading?
              </h2>
              <p className="text-xl mb-10 text-[hsl(var(--text-main),_0.8)] max-w-2xl mx-auto">
                Join The Beta And Discover Your Edge With AI-Powered Insights, Advanced Strategy Analysis, And Personalized Strategy Development.
              </p>
              <motion.button
                onClick={handleGetStarted}
                className="group px-12 py-5 bg-gradient-to-r from-[hsl(var(--primary-hsl))] to-[hsl(var(--secondary-hsl))] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-[hsl(var(--primary-hsl),_0.4)] text-lg relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">🚀 {user ? 'Enter Platform' : 'Start Your Edge Journey'}</span>
              </motion.button>
            </div>
          </motion.div>
        </main>


      </div>
    </ThemeProvider>
  );
}
