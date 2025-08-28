'use client';

import { motion } from 'framer-motion/client';
import { Activity, TrendingUp, TrendingDown, Minus, BarChart3, DollarSign, Bitcoin, Zap } from 'lucide-react';
import { useState } from 'react';

type SignalType = 'buy' | 'sell' | 'neutral';
type MarketCategory = 'futures' | 'forex' | 'crypto' | 'stocks';

interface MarketSignal {
  name: string;
  symbol: string;
  signal: SignalType;
  confidence: number;
  price?: string;
  change?: string;
}

interface CategoryData {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  signals: MarketSignal[];
}

export default function MarketSentiment() {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('futures');

  const categories: Record<MarketCategory, CategoryData> = {
    futures: {
      name: 'Futures',
      icon: BarChart3,
      color: 'emerald',
      signals: [
        { name: 'ES Mini', symbol: 'ES', signal: 'buy', confidence: 85, price: '4,425', change: '+0.8%' },
        { name: 'NQ Mini', symbol: 'NQ', signal: 'buy', confidence: 78, price: '15,120', change: '+1.2%' },
        { name: 'Oil WTI', symbol: 'CL', signal: 'sell', confidence: 72, price: '78.45', change: '-1.5%' },
        { name: 'Gold', symbol: 'GC', signal: 'neutral', confidence: 45, price: '1,985', change: '+0.1%' },
        { name: 'Silver', symbol: 'SI', signal: 'buy', confidence: 68, price: '24.15', change: '+0.9%' },
        { name: 'Copper', symbol: 'HG', signal: 'neutral', confidence: 52, price: '3.75', change: '-0.3%' }
      ]
    },
    forex: {
      name: 'Forex',
      icon: DollarSign,
      color: 'blue',
      signals: [
        { name: 'EUR/USD', symbol: 'EURUSD', signal: 'sell', confidence: 76, price: '1.0845', change: '-0.2%' },
        { name: 'GBP/USD', symbol: 'GBPUSD', signal: 'buy', confidence: 82, price: '1.2634', change: '+0.5%' },
        { name: 'USD/JPY', symbol: 'USDJPY', signal: 'buy', confidence: 71, price: '149.85', change: '+0.3%' },
        { name: 'AUD/USD', symbol: 'AUDUSD', signal: 'neutral', confidence: 48, price: '0.6523', change: '+0.1%' },
        { name: 'USD/CAD', symbol: 'USDCAD', signal: 'sell', confidence: 65, price: '1.3542', change: '-0.4%' },
        { name: 'EUR/GBP', symbol: 'EURGBP', signal: 'neutral', confidence: 55, price: '0.8587', change: '0.0%' }
      ]
    },
    crypto: {
      name: 'Crypto',
      icon: Bitcoin,
      color: 'purple',
      signals: [
        { name: 'Bitcoin', symbol: 'BTC/USDT', signal: 'buy', confidence: 89, price: '43,250', change: '+2.1%' },
        { name: 'Ethereum', symbol: 'ETH/USDT', signal: 'buy', confidence: 84, price: '2,650', change: '+1.8%' },
        { name: 'Solana', symbol: 'SOL/USDT', signal: 'neutral', confidence: 62, price: '98.45', change: '+0.5%' },
        { name: 'Cardano', symbol: 'ADA/USDT', signal: 'sell', confidence: 73, price: '0.485', change: '-1.2%' },
        { name: 'Polkadot', symbol: 'DOT/USDT', signal: 'buy', confidence: 67, price: '6.85', change: '+0.9%' },
        { name: 'Chainlink', symbol: 'LINK/USDT', signal: 'neutral', confidence: 58, price: '14.25', change: '+0.2%' }
      ]
    },
    stocks: {
      name: 'Stocks',
      icon: TrendingUp,
      color: 'amber',
      signals: [
        { name: 'Apple', symbol: 'AAPL', signal: 'buy', confidence: 79, price: '192.45', change: '+1.1%' },
        { name: 'Microsoft', symbol: 'MSFT', signal: 'buy', confidence: 86, price: '378.25', change: '+0.9%' },
        { name: 'Tesla', symbol: 'TSLA', signal: 'sell', confidence: 74, price: '245.60', change: '-2.3%' },
        { name: 'NVIDIA', symbol: 'NVDA', signal: 'buy', confidence: 91, price: '495.80', change: '+3.2%' },
        { name: 'Amazon', symbol: 'AMZN', signal: 'neutral', confidence: 56, price: '145.30', change: '+0.4%' },
        { name: 'Google', symbol: 'GOOGL', signal: 'buy', confidence: 77, price: '138.75', change: '+0.7%' }
      ]
    }
  };

  const getSignalColor = (signal: SignalType) => {
    switch (signal) {
      case 'buy':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          icon: TrendingUp
        };
      case 'sell':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          icon: TrendingDown
        };
      case 'neutral':
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-400',
          icon: Minus
        };
    }
  };

  const getSignalLabel = (signal: SignalType) => {
    switch (signal) {
      case 'buy': return 'BUY';
      case 'sell': return 'SELL';
      case 'neutral': return 'HOLD';
    }
  };

  const getCategoryColor = (category: MarketCategory) => {
    const color = categories[category].color;
    return {
      active: {
        bg: `bg-${color}-500/20`,
        border: `border-${color}-500/50`,
        text: `text-${color}-400`
      },
      inactive: {
        bg: 'bg-slate-800/40',
        border: 'border-slate-600/50',
        text: 'text-slate-400'
      }
    };
  };

  const currentCategory = categories[selectedCategory];
  const signalCounts = {
    buy: currentCategory.signals.filter(s => s.signal === 'buy').length,
    sell: currentCategory.signals.filter(s => s.signal === 'sell').length,
    neutral: currentCategory.signals.filter(s => s.signal === 'neutral').length
  };

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
            <Activity className="w-5 h-5 text-blue-400" />
            Market Signals
          </h3>
          <p className="text-sm text-slate-400">
            Real-time trading signals across markets
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-sm text-slate-300 font-medium">Live Signals</span>
        </div>
      </motion.div>

      {/* Main Container */}
      <div className="p-6 bg-gradient-to-br from-slate-900/60 to-slate-800/40 rounded-2xl border border-slate-700/60 backdrop-blur-sm shadow-2xl">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-6">
          {Object.entries(categories).map(([key, category]) => {
            const categoryKey = key as MarketCategory;
            const isActive = selectedCategory === categoryKey;
            const IconComponent = category.icon;
            
            return (
              <motion.button
                key={categoryKey}
                onClick={() => setSelectedCategory(categoryKey)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm
                  border backdrop-blur-sm transition-all duration-300
                  ${isActive 
                    ? `bg-${category.color}-500/20 border-${category.color}-500/50 text-${category.color}-400 shadow-lg` 
                    : 'bg-slate-800/40 border-slate-600/50 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  }
                `}
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
              </motion.button>
            );
          })}
        </div>

        {/* Signal Summary */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-600/30"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-sm text-slate-300">
              <span className="font-bold text-emerald-400">{signalCounts.buy}</span> Buy
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm text-slate-300">
              <span className="font-bold text-red-400">{signalCounts.sell}</span> Sell
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-500 rounded-full" />
            <span className="text-sm text-slate-300">
              <span className="font-bold text-slate-400">{signalCounts.neutral}</span> Hold
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-slate-300">
              Avg Confidence: <span className="font-bold text-white">
                {Math.round(currentCategory.signals.reduce((acc, s) => acc + s.confidence, 0) / currentCategory.signals.length)}%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Signal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCategory.signals.map((signal, index) => {
            const signalColor = getSignalColor(signal.signal);
            const SignalIcon = signalColor.icon;
            
            return (
              <motion.div
                key={signal.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`
                  p-4 rounded-xl border backdrop-blur-sm cursor-pointer
                  transition-all duration-300
                  ${signalColor.bg} ${signalColor.border}
                  hover:shadow-lg
                `}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{signal.name}</h4>
                    <p className="text-xs text-slate-400">{signal.symbol}</p>
                  </div>
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1
                    ${signalColor.bg} ${signalColor.text} border ${signalColor.border}
                  `}>
                    <SignalIcon className="w-3 h-3" />
                    {getSignalLabel(signal.signal)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-sm">{signal.price}</p>
                    <p className={`text-xs ${
                      signal.change?.startsWith('+') ? 'text-emerald-400' : 
                      signal.change?.startsWith('-') ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {signal.change}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Confidence</p>
                    <p className={`text-sm font-bold ${signalColor.text}`}>{signal.confidence}%</p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${signal.confidence}%` }}
                    transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
                    className={`h-full rounded-full ${signalColor.text.replace('text-', 'bg-')}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-600/50"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span>Signals update every 30 seconds</span>
          </div>
          <div>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
