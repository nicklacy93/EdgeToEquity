'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  Brain,
  Award,
  AlertTriangle,
  CheckCircle,
  Eye,
  BarChart3,
  Sparkles,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';

interface Trade {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  entryTime: string;
  exitTime: string;
  pnl: number;
  rMultiple: number;
  outcome: 'win' | 'loss' | 'breakeven';
  emotionalTone: 'calm' | 'confident' | 'frustrated' | 'anxious' | 'excited';
  notes: string;
  tags: string[];
  discipline: 'excellent' | 'good' | 'poor';
  setup: string;
}

type FilterType = 'all' | 'winners' | 'losers' | 'emotional' | 'disciplined' | 'recent';

export default function TradeAnalysis() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);

  // Mock trade data
  const trades: Trade[] = [
    {
      id: '1',
      symbol: 'AAPL',
      side: 'long',
      entryPrice: 185.50,
      exitPrice: 192.30,
      quantity: 100,
      entryTime: '09:45',
      exitTime: '11:20',
      pnl: 680,
      rMultiple: 2.4,
      outcome: 'win',
      emotionalTone: 'confident',
      notes: 'Perfect breakout setup, followed plan exactly. Entry was textbook and exit hit target.',
      tags: ['breakout', 'plan-execution', 'momentum'],
      discipline: 'excellent',
      setup: 'Bull Flag Breakout'
    },
    {
      id: '2',
      symbol: 'TSLA',
      side: 'short',
      entryPrice: 245.80,
      exitPrice: 251.20,
      quantity: 50,
      entryTime: '13:15',
      exitTime: '14:45',
      pnl: -270,
      rMultiple: -1.8,
      outcome: 'loss',
      emotionalTone: 'frustrated',
      notes: 'Got stubborn and held too long. Should have cut losses at -1R. Let emotions override plan.',
      tags: ['stubborn', 'risk-management', 'emotional'],
      discipline: 'poor',
      setup: 'Failed Support Break'
    },
    {
      id: '3',
      symbol: 'NVDA',
      side: 'long',
      entryPrice: 428.60,
      exitPrice: 435.90,
      quantity: 25,
      entryTime: '10:30',
      exitTime: '15:45',
      pnl: 182.50,
      rMultiple: 1.2,
      outcome: 'win',
      emotionalTone: 'calm',
      notes: 'Small winner, took profits early due to market uncertainty. Conservative but smart.',
      tags: ['conservative', 'profit-taking', 'disciplined'],
      discipline: 'good',
      setup: 'Support Bounce'
    },
    {
      id: '4',
      symbol: 'SPY',
      side: 'long',
      entryPrice: 445.20,
      exitPrice: 449.80,
      quantity: 200,
      entryTime: '14:00',
      exitTime: '15:30',
      pnl: 920,
      rMultiple: 3.1,
      outcome: 'win',
      emotionalTone: 'excited',
      notes: 'Huge momentum play! Caught the afternoon pump perfectly. Scaled out beautifully.',
      tags: ['momentum', 'scaling', 'timing'],
      discipline: 'excellent',
      setup: 'Momentum Continuation'
    },
    {
      id: '5',
      symbol: 'META',
      side: 'short',
      entryPrice: 310.40,
      exitPrice: 308.90,
      quantity: 75,
      entryTime: '11:00',
      exitTime: '12:15',
      pnl: 112.50,
      rMultiple: 0.8,
      outcome: 'win',
      emotionalTone: 'anxious',
      notes: 'Quick scalp but was nervous the whole time. Market felt choppy, took small profit.',
      tags: ['scalp', 'nervous', 'quick-profit'],
      discipline: 'good',
      setup: 'Resistance Rejection'
    },
    {
      id: '6',
      symbol: 'AMZN',
      side: 'long',
      entryPrice: 142.80,
      exitPrice: 141.95,
      quantity: 150,
      entryTime: '09:30',
      exitTime: '10:45',
      pnl: -127.50,
      rMultiple: -1.0,
      outcome: 'loss',
      emotionalTone: 'calm',
      notes: 'Clean stop loss hit. Market opened weak, stuck to plan and cut losses quickly.',
      tags: ['disciplined', 'stop-loss', 'market-open'],
      discipline: 'excellent',
      setup: 'Gap Fill Play'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Trades', icon: BarChart3, count: trades.length },
    { id: 'winners', label: 'Winners', icon: TrendingUp, count: trades.filter(t => t.outcome === 'win').length },
    { id: 'losers', label: 'Losses', icon: TrendingDown, count: trades.filter(t => t.outcome === 'loss').length },
    { id: 'emotional', label: 'Emotional Mistakes', icon: AlertTriangle, count: trades.filter(t => t.emotionalTone === 'frustrated' || t.emotionalTone === 'anxious').length },
    { id: 'disciplined', label: 'Most Disciplined', icon: Award, count: trades.filter(t => t.discipline === 'excellent').length },
    { id: 'recent', label: 'Recent', icon: Clock, count: trades.slice(0, 3).length }
  ];

  const getFilteredTrades = () => {
    switch (selectedFilter) {
      case 'winners': return trades.filter(t => t.outcome === 'win');
      case 'losers': return trades.filter(t => t.outcome === 'loss');
      case 'emotional': return trades.filter(t => t.emotionalTone === 'frustrated' || t.emotionalTone === 'anxious');
      case 'disciplined': return trades.filter(t => t.discipline === 'excellent');
      case 'recent': return trades.slice(0, 3);
      default: return trades;
    }
  };

  const getEmotionalEmoji = (tone: string) => {
    switch (tone) {
      case 'confident': return '🚀';
      case 'excited': return '🎯';
      case 'calm': return '😌';
      case 'frustrated': return '😓';
      case 'anxious': return '😰';
      default: return '📊';
    }
  };

  const getOutcomeEmoji = (outcome: string) => {
    switch (outcome) {
      case 'win': return '✅';
      case 'loss': return '❌';
      default: return '➖';
    }
  };

  const getEmotionalColor = (tone: string) => {
    switch (tone) {
      case 'confident': return 'from-emerald-500/20 to-emerald-400/10 border-emerald-500/30';
      case 'excited': return 'from-purple-500/20 to-purple-400/10 border-purple-500/30';
      case 'calm': return 'from-blue-500/20 to-blue-400/10 border-blue-500/30';
      case 'frustrated': return 'from-red-500/20 to-red-400/10 border-red-500/30';
      case 'anxious': return 'from-amber-500/20 to-amber-400/10 border-amber-500/30';
      default: return 'from-slate-500/20 to-slate-400/10 border-slate-500/30';
    }
  };

  const getDisciplineColor = (discipline: string) => {
    switch (discipline) {
      case 'excellent': return 'text-emerald-400 bg-emerald-500/20';
      case 'good': return 'text-blue-400 bg-blue-500/20';
      case 'poor': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const filteredTrades = getFilteredTrades();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Trade Analysis
          </h3>
          <p className="text-sm text-slate-400">
            Review your trades with emotional intelligence
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300 font-medium">Today</span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600"
      >
        {filters.map((filter, index) => {
          const IconComponent = filter.icon;
          const isSelected = selectedFilter === filter.id;
          
          return (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedFilter(filter.id as FilterType)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap
                ${isSelected 
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                  : 'bg-slate-800/50 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }
              `}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{filter.label}</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${isSelected ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-600/50 text-slate-300'}
              `}>
                {filter.count}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Trades List */}
      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 pr-2">
        <AnimatePresence mode="wait">
          {filteredTrades.map((trade, index) => {
            const isSelected = selectedTrade === trade.id;
            const isPositivePnL = trade.pnl > 0;
            
            return (
              <motion.div
                key={trade.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.01, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                onClick={() => setSelectedTrade(isSelected ? null : trade.id)}
                className={`
                  group relative p-5 rounded-2xl cursor-pointer overflow-hidden
                  bg-gradient-to-r ${getEmotionalColor(trade.emotionalTone)}
                  border backdrop-blur-sm
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-black/20
                `}
              >
                {/* Background effects */}
                <div className="absolute inset-0 rounded-2xl">
                  <motion.div
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05), transparent 50%)",
                        "radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05), transparent 50%)",
                        "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05), transparent 50%)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>

                <div className="relative z-10">
                  {/* Trade Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getEmotionalEmoji(trade.emotionalTone)}</span>
                        <span className="text-lg">{getOutcomeEmoji(trade.outcome)}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-white">{trade.symbol}</h4>
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-bold
                            ${trade.side === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
                          `}>
                            {trade.side.toUpperCase()}
                          </span>
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-medium border
                            ${getDisciplineColor(trade.discipline)}
                          `}>
                            {trade.discipline}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{trade.setup}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`
                        text-xl font-black mb-1
                        ${isPositivePnL ? 'text-emerald-400' : 'text-red-400'}
                      `}>
                        {isPositivePnL ? '+' : ''}${trade.pnl.toFixed(0)}
                      </div>
                      <div className={`
                        text-sm font-bold
                        ${trade.rMultiple > 0 ? 'text-emerald-400' : 'text-red-400'}
                      `}>
                        {trade.rMultiple > 0 ? '+' : ''}{trade.rMultiple}R
                      </div>
                    </div>
                  </div>

                  {/* Trade Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-400">Entry:</span>
                      <span className="ml-2 text-white font-medium">${trade.entryPrice} @ {trade.entryTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Exit:</span>
                      <span className="ml-2 text-white font-medium">${trade.exitPrice} @ {trade.exitTime}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trade.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      "{trade.notes}"
                    </p>
                  </div>

                  {/* Expanded Analysis */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: isSelected ? 'auto' : 0,
                      opacity: isSelected ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-white/15">
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-slate-400">Quantity:</span>
                          <span className="ml-2 text-white font-medium">{trade.quantity} shares</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Duration:</span>
                          <span className="ml-2 text-white font-medium">
                            {Math.round((new Date(`2024-01-01 ${trade.exitTime}`).getTime() - new Date(`2024-01-01 ${trade.entryTime}`).getTime()) / (1000 * 60))} min
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
                        <div className="flex items-start gap-3">
                          <Brain className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h5 className="text-sm font-bold text-white mb-2">EdgeBot Analysis</h5>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {trade.discipline === 'excellent' ? 
                                "🎯 Exceptional execution! This trade demonstrates strong emotional control and plan adherence. Use this as a template for future setups." :
                                trade.discipline === 'good' ?
                                "✅ Solid trade with minor areas for improvement. Your risk management and timing were appropriate for the market conditions." :
                                "⚠️ Learning opportunity here. Consider what emotional factors influenced this decision and how to improve discipline in similar situations."
                              }
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
        </AnimatePresence>

        {filteredTrades.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-lg font-bold text-white mb-2">No trades found</h4>
            <p className="text-sm text-slate-400">
              Try adjusting your filter or check back after making some trades.
            </p>
          </motion.div>
        )}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 bg-gradient-to-r from-slate-800/60 to-slate-700/40 rounded-xl border border-slate-600/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-bold text-white">
              {selectedFilter === 'all' ? 'All Trades' : filters.find(f => f.id === selectedFilter)?.label} Summary
            </h4>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400">
                {Math.round(filteredTrades.filter(t => t.outcome === 'win').length / filteredTrades.length * 100) || 0}%
              </div>
              <div className="text-xs text-slate-400">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {filteredTrades.reduce((sum, t) => sum + t.rMultiple, 0).toFixed(1)}R
              </div>
              <div className="text-xs text-slate-400">Total R</div>
            </div>
            <div className="text-center">
              <div className={`
                text-lg font-bold
                ${filteredTrades.reduce((sum, t) => sum + t.pnl, 0) > 0 ? 'text-emerald-400' : 'text-red-400'}
              `}>
                ${filteredTrades.reduce((sum, t) => sum + t.pnl, 0).toFixed(0)}
              </div>
              <div className="text-xs text-slate-400">Total P&L</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
