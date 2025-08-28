'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pause, 
  Play, 
  RotateCcw, 
  Award, 
  Eye, 
  Brain,
  Settings,
  Zap,
  Shield,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SessionTool {
  id: string;
  label: string;
  icon: any;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'red' | 'cyan';
  status: 'active' | 'inactive' | 'warning' | 'success';
  description: string;
  aiInsight: string;
  shortcut?: string;
  action: () => void;
  isToggleable?: boolean;
  currentState?: boolean;
}

export default function SessionTools() {
  const [tools, setTools] = useState<SessionTool[]>([
    {
      id: 'trading-status',
      label: 'Trading Status',
      icon: Play,
      color: 'emerald',
      status: 'active',
      description: 'Pause or resume trading activity',
      aiInsight: 'Active trading mode - stay focused and execute your plan',
      shortcut: 'Space',
      isToggleable: true,
      currentState: true,
      action: () => toggleTradingStatus()
    },
    {
      id: 'mindset-reset',
      label: 'Reset Mindset',
      icon: RotateCcw,
      color: 'blue',
      status: 'inactive',
      description: 'Clear emotional state and refocus',
      aiInsight: 'Take a moment to breathe and center your thoughts',
      shortcut: 'Ctrl+R',
      action: () => resetMindset()
    },
    {
      id: 'mark-trade',
      label: 'Mark Trade of Day',
      icon: Award,
      color: 'amber',
      status: 'inactive',
      description: 'Highlight your best trade for review',
      aiInsight: 'Celebrate excellence - this builds positive trading patterns',
      action: () => markTradeOfDay()
    },
    {
      id: 'review-last',
      label: 'Review Last Trade',
      icon: Eye,
      color: 'purple',
      status: 'warning',
      description: 'Analyze your most recent trade',
      aiInsight: 'Quick review while emotions are fresh improves learning',
      shortcut: 'Ctrl+L',
      action: () => reviewLastTrade()
    },
    {
      id: 'risk-check',
      label: 'Risk Monitor',
      icon: Shield,
      color: 'red',
      status: 'success',
      description: 'Monitor position sizing and exposure',
      aiInsight: 'Risk levels healthy - maintain current discipline',
      action: () => checkRisk()
    },
    {
      id: 'session-focus',
      label: 'Focus Mode',
      icon: Target,
      color: 'cyan',
      status: 'inactive',
      description: 'Minimize distractions and enhance concentration',
      aiInsight: 'Focus mode can improve decision quality during volatile periods',
      shortcut: 'F',
      isToggleable: true,
      currentState: false,
      action: () => toggleFocusMode()
    }
  ]);

  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const colorConfigs = {
    emerald: {
      gradient: 'from-emerald-500/25 to-emerald-400/15',
      border: 'border-emerald-500/40',
      hoverBorder: 'hover:border-emerald-400/70',
      shadow: 'hover:shadow-emerald-500/30',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      accent: 'from-emerald-500/60 to-emerald-400/40',
      pulse: 'bg-emerald-400'
    },
    blue: {
      gradient: 'from-blue-500/25 to-blue-400/15',
      border: 'border-blue-500/40',
      hoverBorder: 'hover:border-blue-400/70',
      shadow: 'hover:shadow-blue-500/30',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      accent: 'from-blue-500/60 to-blue-400/40',
      pulse: 'bg-blue-400'
    },
    purple: {
      gradient: 'from-purple-500/25 to-purple-400/15',
      border: 'border-purple-500/40',
      hoverBorder: 'hover:border-purple-400/70',
      shadow: 'hover:shadow-purple-500/30',
      icon: 'text-purple-400',
      iconBg: 'bg-purple-500/20',
      accent: 'from-purple-500/60 to-purple-400/40',
      pulse: 'bg-purple-400'
    },
    amber: {
      gradient: 'from-amber-500/25 to-amber-400/15',
      border: 'border-amber-500/40',
      hoverBorder: 'hover:border-amber-400/70',
      shadow: 'hover:shadow-amber-500/30',
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      accent: 'from-amber-500/60 to-amber-400/40',
      pulse: 'bg-amber-400'
    },
    red: {
      gradient: 'from-red-500/25 to-red-400/15',
      border: 'border-red-500/40',
      hoverBorder: 'hover:border-red-400/70',
      shadow: 'hover:shadow-red-500/30',
      icon: 'text-red-400',
      iconBg: 'bg-red-500/20',
      accent: 'from-red-500/60 to-red-400/40',
      pulse: 'bg-red-400'
    },
    cyan: {
      gradient: 'from-cyan-500/25 to-cyan-400/15',
      border: 'border-cyan-500/40',
      hoverBorder: 'hover:border-cyan-400/70',
      shadow: 'hover:shadow-cyan-500/30',
      icon: 'text-cyan-400',
      iconBg: 'bg-cyan-500/20',
      accent: 'from-cyan-500/60 to-cyan-400/40',
      pulse: 'bg-cyan-400'
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/20';
      case 'success': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  // Tool action functions
  const toggleTradingStatus = () => {
    setTools(prev => prev.map(tool => 
      tool.id === 'trading-status' 
        ? { 
            ...tool, 
            currentState: !tool.currentState,
            status: !tool.currentState ? 'active' : 'inactive',
            icon: !tool.currentState ? Play : Pause,
            aiInsight: !tool.currentState 
              ? 'Active trading mode - stay focused and execute your plan'
              : 'Trading paused - take time to review and plan your next moves'
          }
        : tool
    ));
    setLastAction('Trading status toggled');
  };

  const resetMindset = () => {
    setTools(prev => prev.map(tool => 
      tool.id === 'mindset-reset' 
        ? { ...tool, status: 'success', aiInsight: 'Mindset reset complete - you\'re centered and ready' }
        : tool
    ));
    setLastAction('Mindset reset activated');
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setTools(prev => prev.map(tool => 
        tool.id === 'mindset-reset' 
          ? { ...tool, status: 'inactive', aiInsight: 'Take a moment to breathe and center your thoughts' }
          : tool
      ));
    }, 3000);
  };

  const markTradeOfDay = () => {
    setTools(prev => prev.map(tool => 
      tool.id === 'mark-trade' 
        ? { ...tool, status: 'success', aiInsight: 'Trade marked! Reviewing winning patterns builds confidence' }
        : tool
    ));
    setLastAction('Trade of the day marked');
  };

  const reviewLastTrade = () => {
    setTools(prev => prev.map(tool => 
      tool.id === 'review-last' 
        ? { ...tool, status: 'active', aiInsight: 'Analyzing trade execution and emotional state...' }
        : tool
    ));
    setLastAction('Last trade review started');
  };

  const checkRisk = () => {
    setTools(prev => prev.map(tool => 
      tool.id === 'risk-check' 
        ? { ...tool, status: 'active', aiInsight: 'Running risk analysis across all positions...' }
        : tool
    ));
    setLastAction('Risk check initiated');
  };

  const toggleFocusMode = () => {
    setTools(prev => prev.map(tool => 
      tool.id === 'session-focus' 
        ? { 
            ...tool, 
            currentState: !tool.currentState,
            status: !tool.currentState ? 'active' : 'inactive',
            aiInsight: !tool.currentState 
              ? 'Focus mode activated - distractions minimized for peak performance'
              : 'Focus mode disabled - full interface restored'
          }
        : tool
    ));
    setLastAction('Focus mode toggled');
  };

  // Auto-update some statuses
  useEffect(() => {
    const interval = setInterval(() => {
      setTools(prev => prev.map(tool => {
        if (tool.id === 'review-last' && tool.status === 'active') {
          return { ...tool, status: 'warning', aiInsight: 'Quick review while emotions are fresh improves learning' };
        }
        if (tool.id === 'risk-check' && tool.status === 'active') {
          return { ...tool, status: 'success', aiInsight: 'Risk levels healthy - maintain current discipline' };
        }
        return tool;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
            <Settings className="w-5 h-5 text-blue-400" />
            Session Control
          </h3>
          <p className="text-sm text-slate-400">
            Trading cockpit for focus and discipline
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-slate-300 font-medium">Ready</span>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="p-6 bg-gradient-to-br from-slate-900/60 to-slate-800/40 rounded-2xl border border-slate-700/60 backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => {
            const config = colorConfigs[tool.color];
            const IconComponent = tool.icon;
            const StatusIcon = getStatusIcon(tool.status);
            const isHovered = hoveredTool === tool.id;
            
            return (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredTool(tool.id)}
                onHoverEnd={() => setHoveredTool(null)}
                onClick={tool.action}
                className={`
                  group relative p-4 rounded-xl text-left overflow-hidden
                  bg-gradient-to-br ${config.gradient}
                  border ${config.border} ${config.hoverBorder}
                  transition-all duration-300
                  hover:shadow-xl ${config.shadow}
                  ${tool.currentState === true ? 'ring-2 ring-white/20' : ''}
                `}
              >
                {/* Background effects */}
                <div className="absolute inset-0 rounded-xl">
                  <motion.div
                    animate={{
                      background: [
                        `radial-gradient(circle at 30% 40%, ${config.gradient.split(' ')[1].replace('/25', '/8')}, transparent 50%)`,
                        `radial-gradient(circle at 70% 60%, ${config.gradient.split(' ')[1].replace('/25', '/8')}, transparent 50%)`,
                        `radial-gradient(circle at 30% 40%, ${config.gradient.split(' ')[1].replace('/25', '/8')}, transparent 50%)`
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>

                {/* Status indicator */}
                <div className="absolute top-2 right-2">
                  <div className={`
                    p-1 rounded-full ${getStatusColor(tool.status)}
                    border border-white/20
                  `}>
                    <StatusIcon className="w-3 h-3" />
                  </div>
                </div>

                <div className="relative z-10">
                  {/* Main content */}
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`
                        p-2.5 rounded-lg ${config.iconBg} backdrop-blur-sm shadow-lg
                        group-hover:shadow-xl border border-white/10
                        transition-all duration-300
                        ${tool.currentState === true ? config.pulse + ' animate-pulse' : ''}
                      `}
                    >
                      <IconComponent className={`w-5 h-5 ${config.icon} drop-shadow-sm`} />
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        {tool.label}
                      </h4>
                      {tool.shortcut && (
                        <div className="flex items-center gap-1 mt-1">
                          <kbd className="px-1.5 py-0.5 text-xs bg-slate-700/50 rounded border border-slate-600">
                            {tool.shortcut}
                          </kbd>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {tool.description}
                  </p>

                  {/* AI Insight on hover */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: isHovered ? 'auto' : 0,
                      opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 border-t border-white/15">
                      <div className="flex items-start gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-600/50">
                        <Brain className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-300 leading-relaxed italic">
                          💡 {tool.aiInsight}
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
                    origin-left rounded-b-xl
                  `} 
                />
              </motion.button>
            );
          })}
        </div>

        {/* Action Feedback */}
        <AnimatePresence>
          {lastAction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">
                  {lastAction}
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-600/50"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Active: {tools.filter(t => t.status === 'active').length}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Alerts: {tools.filter(t => t.status === 'warning').length}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-blue-400" />
            <span>All systems operational</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
