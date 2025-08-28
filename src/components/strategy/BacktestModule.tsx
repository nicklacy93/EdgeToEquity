"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Play,
  BookOpen,
  Globe,
  Clock,
  Zap,
  Brain,
  Rocket,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { runBacktest } from "@/services/backtestService";
import { useStrategyStore } from "@/store/useStrategyStore";
import TradingViewChart from "../TradingView/TradingViewChart";
import SectionHeader from "../shared/SectionHeader";
import EquityCurveChart from "./EquityCurveChart";

export default function BacktestModule({ onNext }) {
  const { selectedStrategy } = useStrategyStore();
  const [results, setResults] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [activeSection, setActiveSection] = useState<'backtest' | 'market' | 'tutorials'>('backtest');

  // V2 Placeholder: Market Intelligence Data
  const marketIntelligence = {
    currentConditions: {
      volatility: 'Medium',
      trend: 'Sideways',
      volume: 'Above Average',
      recommendation: 'Wait for clear breakout signals'
    },
    timeframeAnalysis: {
      '15min': 'Good for scalping',
      '1hour': 'Optimal for swing trading',
      '4hour': 'Best for trend following',
      'daily': 'Long-term position building'
    },
    riskAssessment: {
      level: 'Moderate',
      factors: ['Market volatility', 'Economic events', 'Liquidity concerns'],
      suggestions: ['Use smaller position sizes', 'Tighten stop losses', 'Monitor news events']
    }
  };

  // V2 Placeholder: Video Tutorials
  const videoTutorials = [
    {
      id: 1,
      title: 'NinjaTrader Strategy Import',
      description: 'Step-by-step guide to importing your strategy into NinjaTrader',
      duration: '8:45',
      platform: 'NinjaTrader',
      thumbnail: '🎯',
      status: 'coming-soon'
    },
    {
      id: 2,
      title: 'TradingView Pine Script Setup',
      description: 'How to convert and deploy your strategy in TradingView',
      duration: '12:30',
      platform: 'TradingView',
      thumbnail: '📊',
      status: 'coming-soon'
    },
    {
      id: 3,
      title: 'Risk Management Best Practices',
      description: 'Essential risk management techniques for live trading',
      duration: '15:20',
      platform: 'Universal',
      thumbnail: '🛡️',
      status: 'coming-soon'
    }
  ];

  const handleBacktest = async () => {
    if (!selectedStrategy) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await runBacktest(selectedStrategy);
      setResults(result);
    } catch (err) {
      console.error("Backtest error:", err);
      setError("Every great trader faces setbacks. Let's refine your approach and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getResultsMessage = () => {
    if (!results?.performanceSummary?.returnPct) return null;

    const returnPct = parseFloat(results.performanceSummary.returnPct);
    const tradeCount = results.trades.length;

    if (returnPct > 0) {
      return {
        icon: "🎯",
        title: "Your Strategy Shows Promise",
        message: `Excellent work! Your approach generated ${tradeCount} strategic moves with a ${returnPct}% return. This is exactly how professional traders validate their edge.`,
        tone: "positive"
      };
    } else {
      return {
        icon: "🔄",
        title: "Valuable Learning Opportunity",
        message: `Great discipline in testing! While this approach showed a ${returnPct}% result across ${tradeCount} trades, you've just gained invaluable market insight. Every drawdown teaches us something crucial.`,
        tone: "learning"
      };
    }
  };

  const resultsData = getResultsMessage();

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
        <motion.button
          onClick={() => setActiveSection('backtest')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeSection === 'backtest'
            ? 'bg-blue-500 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <BarChart3 className="w-4 h-4" />
          Backtesting
        </motion.button>
        <motion.button
          onClick={() => setActiveSection('market')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeSection === 'market'
            ? 'bg-blue-500 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Globe className="w-4 h-4" />
          Market Intelligence
        </motion.button>
        <motion.button
          onClick={() => setActiveSection('tutorials')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeSection === 'tutorials'
            ? 'bg-blue-500 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-4 h-4" />
          Video Tutorials
        </motion.button>
      </div>

      {/* Backtesting Section */}
      {activeSection === 'backtest' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl border bg-slate-800/50 border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Strategy Backtesting</h3>
                <p className="text-sm text-slate-400">Test your strategy against historical data</p>
              </div>
            </div>

            {!selectedStrategy ? (
              <motion.div
                className="text-center py-8 space-y-3"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-slate-400 italic flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Your breakthrough strategy awaits above</span>
                </div>
                <p className="text-xs text-slate-500">
                  Describe your trading approach to reveal its historical performance
                </p>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-center">
                  <motion.button
                    onClick={handleBacktest}
                    disabled={isLoading}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Target className="w-4 h-4" />
                    {isLoading ? "Analyzing..." : "Discover Your Edge"}
                  </motion.button>
                </div>

                {isLoading && (
                  <motion.div
                    className="text-center mt-8 space-y-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="text-slate-400 font-medium flex items-center justify-center gap-2"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Crunching years of market data...</span>
                    </motion.div>
                    <p className="text-xs text-slate-500">
                      Every pattern, every signal, every opportunity—we're finding them all
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    className="text-center mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-red-400 font-medium mb-1">💪 Resilience Check</div>
                    <div className="text-red-300 text-sm">{error}</div>
                  </motion.div>
                )}

                {results && resultsData && (
                  <motion.div
                    className="mt-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-6 rounded-xl space-y-4 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="text-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        {resultsData.icon}
                      </motion.div>
                      <div>
                        <div className="text-lg font-bold text-white mb-1">
                          {resultsData.title}
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {resultsData.message}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-600/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Performance Summary</span>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-slate-500">Total Return</div>
                            <div className={`font-semibold ${parseFloat(results.performanceSummary?.returnPct || '0') >= 0
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                              }`}>
                              {results.performanceSummary?.returnPct ?? "N/A"}%
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500">Trades</div>
                            <div className="text-slate-300 font-semibold">
                              {results.trades.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {results?.equityCurve && results.equityCurve.length > 0 && (
                      <div className="mt-6">
                        <EquityCurveChart data={results.equityCurve} />
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Market Intelligence Section */}
      {activeSection === 'market' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl border bg-slate-800/50 border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Market Intelligence</h3>
                <p className="text-sm text-slate-400">Current market conditions and recommendations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Market Conditions */}
              <div className="p-4 rounded-xl border bg-slate-700/30 border-slate-600">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <h4 className="font-semibold text-white">Current Conditions</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Volatility:</span>
                    <span className="text-amber-400">{marketIntelligence.currentConditions.volatility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trend:</span>
                    <span className="text-blue-400">{marketIntelligence.currentConditions.trend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Volume:</span>
                    <span className="text-green-400">{marketIntelligence.currentConditions.volume}</span>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-300">{marketIntelligence.currentConditions.recommendation}</p>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="p-4 rounded-xl border bg-slate-700/30 border-slate-600">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="font-semibold text-white">Risk Assessment</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Level:</span>
                    <span className="text-amber-400">{marketIntelligence.riskAssessment.level}</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-slate-400 mb-1">Key Factors:</div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {marketIntelligence.riskAssessment.factors.map((factor, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeframe Analysis */}
            <div className="mt-6 p-4 rounded-xl border bg-slate-700/30 border-slate-600">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <h4 className="font-semibold text-white">Timeframe Recommendations</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(marketIntelligence.timeframeAnalysis).map(([timeframe, recommendation]) => (
                  <div key={timeframe} className="p-2 rounded-lg bg-slate-600/30 border border-slate-500/30">
                    <div className="text-xs font-medium text-blue-400 mb-1">{timeframe}</div>
                    <div className="text-xs text-slate-300">{recommendation}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Video Tutorials Section */}
      {activeSection === 'tutorials' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl border bg-slate-800/50 border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Play className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Video Tutorials</h3>
                <p className="text-sm text-slate-400">Learn how to deploy your strategy in real trading platforms</p>
              </div>
            </div>

            <div className="space-y-4">
              {videoTutorials.map((tutorial) => (
                <motion.div
                  key={tutorial.id}
                  className="p-4 rounded-xl border bg-slate-700/30 border-slate-600 hover:border-slate-500 transition-all"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{tutorial.thumbnail}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white">{tutorial.title}</h4>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {tutorial.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{tutorial.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tutorial.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {tutorial.platform}
                        </div>
                      </div>
                    </div>
                    <motion.button
                      className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-6 p-4 rounded-xl border bg-blue-500/10 border-blue-500/30">
              <div className="flex items-center gap-3">
                <Rocket className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-blue-300">Coming in V2!</h4>
                  <p className="text-sm text-blue-200">
                    These video tutorials will be available soon. For now, focus on perfecting your strategy in the Strategy Doctor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
