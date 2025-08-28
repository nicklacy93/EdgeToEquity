'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Shield, 
  Zap, 
  DollarSign, 
  Activity, 
  Clock, 
  Brain,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SessionStat {
  id: string;
  label: string;
  value: string;
  change: string;
  changeDirection: 'up' | 'down' | 'neutral';
  icon: any;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'red' | 'cyan';
  target?: string;
  description: string;
  aiNudge: string;
  performance: 'excellent' | 'good' | 'warning' | 'poor';
}

export default function SessionStats() {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);

  // Mock real-time session data
  const [stats, setStats] = useState<SessionStat[]>([
    {
      id: 'trades',
      label: 'Trades Today',
      value: '12',
      change: '+3',
      changeDirection: 'up',
      icon: Activity,
      color: 'blue',
      target: '8-15',
      description: 'Total number of trades executed in this session',
      aiNudge: 'Good trade frequency - staying active without overtrading',
      performance: 'good'
    },
    {
      id: 'winrate',
      label: 'Win Rate',
      value: '75%',
      change: '+5%',
      changeDirection: 'up',
      icon: TrendingUp,
      color: 'emerald',
      target: '65%+',
      description: 'Percentage of profitable trades',
      aiNudge: 'Excellent win rate! Your edge is working consistently',
      performance: 'excellent'
    },
    {
      id: 'avgr',
      label: 'Avg R Multiple',
      value: '2.8R',
      change: '+0.3R',
      changeDirection: 'up',
      icon: Target,
      color: 'purple',
      target: '2.0R+',
      description: 'Average risk-to-reward ratio per trade',
      aiNudge: 'Strong R:R ratio - you\'re maximizing winning trades',
      performance: 'excellent'
    },
    {
      id: 'pnl',
      label: 'Session P&L',
      value: '+$2,840',
      change: '+$420',
      changeDirection: 'up',
      icon: DollarSign,
      color: 'emerald',
      description: 'Total profit/loss for current session',
      aiNudge: 'Solid profit day - remember to protect gains',
      performance: 'excellent'
    },
    {
      id: 'maxrisk',
      label: 'Max Risk/Trade',
      value: '1.8%',
      change: '+0.2%',
      changeDirection: 'up',
      icon: Shield,
      color: 'amber',
      target: '<2%',
      description: 'Largest risk taken on a single trade',
      aiNudge: 'Risk is creeping up - stick to your 1.5% rule',
      performance: 'warning'
    },
    {
      id: 'execution',
      label: 'Execution Score',
      value: '92%',
      change: '-3%',
      changeDirection: 'down',
      icon: Zap,
      color: 'cyan',
      target: '90%+',
      description: 'How well you followed your trading plan',
      aiNudge: 'Great discipline - minor slip but still excellent',
      performance: 'good'
    }
  ]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          // Randomly update some stats
          if (Math.random() > 0.7) {
            const randomChange = (Math.random() - 0.5) * 0.1;
            return {
              ...stat,
              // Update values slightly for demo
              change: stat.changeDirection === 'up' ? `+${Math.abs(randomChange).toFixed(1)}${stat.id === 'pnl' ? '$' : stat.id === 'winrate' || stat.id === 'execution' || stat.id === 'maxrisk' ? '%' : stat.id === 'avgr' ? 'R' : ''}` : 
                     stat.changeDirection === 'down' ? `-${Math.abs(randomChange).toFixed(1)}${stat.id === 'pnl' ? '$' : stat.id === 'winrate' || stat.id === 'execution' || stat.id === 'maxrisk' ? '%' : stat.id === 'avgr' ? 'R' : ''}` : '0'
            };
          }
          return stat;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const colorConfigs = {
    emerald: {
      gradient: 'from-emerald-500/20 to-emerald-400/10',
      border: 'border-emerald-500/40',
      hoverBorder: 'hover:border-emerald-400/70',
      shadow: 'hover:shadow-emerald-500/25',
      glowShadow: 'hover:shadow-2xl hover:shadow-emerald-500/20',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      accent: 'from-emerald-500/50 to-emerald-400/30'
    },
    blue: {
      gradient: 'from-blue-500/20 to-blue-400/10',
      border: 'border-blue-500/40',
      hoverBorder: 'hover:border-blue-400/70',
      shadow: 'hover:shadow-blue-500/25',
      glowShadow: 'hover:shadow-2xl hover:shadow-blue-500/20',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      text: 'text-blue-400',
      accent: 'from-blue-500/50 to-blue-400/30'
    },
    purple: {
      gradient: 'from-purple-500/20 to-purple-400/10',
      border: 'border-purple-500/40',
      hoverBorder: 'hover:border-purple-400/70',
      shadow: 'hover:shadow-purple-500/25',
      glowShadow: 'hover:shadow-2xl hover:shadow-purple-500/20',
      icon: 'text-purple-400',
      iconBg: 'bg-purple-500/20',
      text: 'text-purple-400',
      accent: 'from-purple-500/50 to-purple-400/30'
    },
    amber: {
      gradient: 'from-amber-500/20 to-amber-400/10',
      border: 'border-amber-500/40',
      hoverBorder: 'hover:border-amber-400/70',
      shadow: 'hover:shadow-amber-500/25',
      glowShadow: 'hover:shadow-2xl hover:shadow-amber-500/20',
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      text: 'text-amber-400',
      accent: 'from-amber-500/50 to-amber-400/30'
    },
    red: {
      gradient: 'from-red-500/20 to-red-400/10',
      border: 'border-red-500/40',
      hoverBorder: 'hover:border-red-400/70',
      shadow: 'hover:shadow-red-500/25',
      glowShadow: 'hover:shadow-2xl hover:shadow-red-500/20',
      icon: 'text-red-400',
      iconBg: 'bg-red-500/20',
      text: 'text-red-400',
      accent: 'from-red-500/50 to-red-400/30'
    },
    cyan: {
      gradient: 'from-cyan-500/20 to-cyan-400/10',
      border: 'border-cyan-500/40',
      hoverBorder: 'hover:border-cyan-400/70',
      shadow: 'hover:shadow-cyan-500/25',
      glowShadow: 'hover:shadow-2xl hover:shadow-cyan-500/20',
      icon: 'text-cyan-400',
      iconBg: 'bg-cyan-500/20',
      text: 'text-cyan-400',
      accent: 'from-cyan-500/50 to-cyan-400/30'
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return CheckCircle;
      case 'good': return Award;
      case 'warning': return AlertTriangle;
      case 'poor': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-emerald-400 bg-emerald-500/20';
      case 'good': return 'text-blue-400 bg-blue-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/20';
      case 'poor': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}:${mins.toString().padStart(2, '0')}`;
  };

  const getOverallAINudge = () => {
    const excellentCount = stats.filter(s => s.performance === 'excellent').length;
    const warningCount = stats.filter(s => s.performance === 'warning').length;
    
    if (excellentCount >= 4) {
      return "🔥 Outstanding session! You're trading with exceptional discipline and skill.";
    } else if (warningCount >= 2) {
      return "⚠️ Some areas need attention. Focus on risk management and plan adherence.";
    } else {
      return "✅ Solid performance overall. Stay consistent with your proven approach.";
    }
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
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Session Performance
          </h3>
          <p className="text-sm text-slate-400">
            Live tracking of your trading metrics and discipline
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300 font-medium">
            {formatTime(sessionTime)}
          </span>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" 
          />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const config = colorConfigs[stat.color];
          const IconComponent = stat.icon;
          const PerformanceIcon = getPerformanceIcon(stat.performance);
          const isSelected = selectedStat === stat.id;
          
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                scale: 1.02, 
                y: -3,
                transition: { duration: 0.2 }
              }}
              onClick={() => setSelectedStat(isSelected ? null : stat.id)}
              className={`
                group relative p-5 rounded-2xl cursor-pointer overflow-hidden
                bg-gradient-to-br ${config.gradient}
                border ${config.border} ${config.hoverBorder}
                transition-all duration-300
                ${config.glowShadow}
              `}
            >
              {/* Background effects */}
              <div className="absolute inset-0 rounded-2xl">
                <motion.div
                  animate={{
                    background: [
                      `radial-gradient(circle at 20% 30%, ${config.gradient.split(' ')[1].replace('/20', '/8')}, transparent 50%)`,
                      `radial-gradient(circle at 80% 70%, ${config.gradient.split(' ')[1].replace('/20', '/8')}, transparent 50%)`,
                      `radial-gradient(circle at 20% 30%, ${config.gradient.split(' ')[1].replace('/20', '/8')}, transparent 50%)`
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>

              {/* Performance indicator */}
              <div className="absolute top-3 right-3">
                <div className={`
                  p-1.5 rounded-full ${getPerformanceColor(stat.performance)}
                  border border-white/20
                `}>
                  <PerformanceIcon className="w-3 h-3" />
                </div>
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`
                      p-2.5 rounded-xl ${config.iconBg} backdrop-blur-sm shadow-lg
                      group-hover:shadow-xl border border-white/10
                      transition-all duration-300
                    `}
                  >
                    <IconComponent className={`w-5 h-5 ${config.icon} drop-shadow-sm`} />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                      {stat.label}
                    </h4>
                    {stat.target && (
                      <p className="text-xs text-slate-500">
                        Target: {stat.target}
                      </p>
                    )}
                  </div>
                </div>

                {/* Value and Change */}
                <div className="mb-3">
                  <div className="text-2xl font-black text-white mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`
                      text-sm font-bold px-2 py-0.5 rounded-full
                      ${stat.changeDirection === 'up' ? 'text-emerald-400 bg-emerald-500/20' :
                        stat.changeDirection === 'down' ? 'text-red-400 bg-red-500/20' :
                        'text-slate-400 bg-slate-500/20'}
                    `}>
                      {stat.change}
                    </span>
                    {stat.changeDirection === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                    {stat.changeDirection === 'down' && <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />}
                  </div>
                </div>

                {/* Expanded Details */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: isSelected ? 'auto' : 0,
                    opacity: isSelected ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 border-t border-white/15">
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {stat.description}
                    </p>
                    
                    <div className="flex items-start gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-600/50">
                      <Sparkles className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-300 leading-relaxed italic">
                        💡 {stat.aiNudge}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom accent */}
              <motion.div 
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`
                  absolute inset-x-0 bottom-0 h-1 
                  bg-gradient-to-r ${config.accent}
                  origin-left rounded-b-2xl
                `} 
              />
            </motion.div>
          );
        })}
      </div>

      {/* Overall AI Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 backdrop-blur-sm shadow-xl"
      >
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30 flex-shrink-0"
          >
            <Brain className="w-6 h-6 text-blue-400" />
          </motion.div>
          
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              EdgeBot Session Assessment
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </h4>
            
            <motion.p
              key={stats.length} // Re-trigger when stats update
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-sm text-slate-300 leading-relaxed mb-3"
            >
              {getOverallAINudge()}
            </motion.p>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Excellent: {stats.filter(s => s.performance === 'excellent').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-blue-400" />
                <span>Good: {stats.filter(s => s.performance === 'good').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Watch: {stats.filter(s => s.performance === 'warning').length}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
