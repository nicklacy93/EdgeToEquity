'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Zap, 
  Brain, 
  Target,
  TrendingUp,
  Clock,
  Lightbulb,
  Shield,
  Play,
  PlusCircle,
  Sparkles,
  Heart,
  Coffee,
  Award,
  ChevronDown,
  ChevronUp,
  Star,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Search,
  BookMarked,
  TrendingDown
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: 'blue' | 'emerald' | 'purple' | 'amber' | 'red' | 'cyan' | 'pink';
  category: 'recommended' | 'strategy' | 'psychology' | 'learning';
  priority: 'high' | 'medium' | 'low';
  badge?: string;
  isNew?: boolean;
  psychologyNote?: string;
  timeEstimate?: string;
  sessionMode?: string[];
  moodContext?: string;
  action: () => void;
}

interface CommandCenterProps {
  sessionMode?: 'plan' | 'live' | 'review';
  currentMood?: 'confident' | 'cautious' | 'excited' | 'stressed';
}

export default function EnhancedQuickActionsPanel({ 
  sessionMode = 'plan',
  currentMood = 'confident' 
}: CommandCenterProps) {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['recommended']));
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const quickActions: QuickAction[] = [
    // Recommended Now - Context-aware
    {
      id: 'mindset-check',
      title: 'Mindset Check-in',
      description: '🧠 Rate your current emotional state & readiness',
      icon: Brain,
      color: 'blue',
      category: 'recommended',
      priority: 'high',
      badge: 'Priority',
      psychologyNote: 'Self-awareness prevents emotional trading decisions',
      timeEstimate: '1 min',
      sessionMode: ['plan', 'live'],
      moodContext: 'Always recommended before trading',
      action: () => console.log('Open mindset assessment')
    },
    {
      id: 'market-pulse',
      title: 'Market Pulse Check',
      description: '📊 Get EdgeBot\'s current market sentiment reading',
      icon: Activity,
      color: 'emerald',
      category: 'recommended',
      priority: 'high',
      badge: 'Live',
      isNew: true,
      psychologyNote: 'Objective market view counters personal bias',
      timeEstimate: '30 sec',
      sessionMode: ['plan', 'live'],
      action: () => console.log('Get market sentiment')
    },
    {
      id: 'daily-target',
      title: 'Set Daily Intention',
      description: '🎯 Define your risk tolerance and profit goals',
      icon: Target,
      color: 'purple',
      category: 'recommended',
      priority: 'high',
      psychologyNote: 'Clear intentions prevent overtrading',
      timeEstimate: '2 min',
      sessionMode: ['plan'],
      action: () => console.log('Set daily targets')
    },
    {
      id: 'journal-trade',
      title: 'Journal Last Trade',
      description: '📝 Capture emotions and lessons while fresh',
      icon: BookOpen,
      color: 'amber',
      category: 'recommended',
      priority: 'high',
      badge: 'Hot',
      psychologyNote: 'Immediate reflection builds self-awareness',
      timeEstimate: '3 min',
      sessionMode: ['live', 'review'],
      action: () => console.log('Open trade journal')
    },

    // Strategy Tools
    {
      id: 'setup-scanner',
      title: 'Setup Scanner',
      description: '⚡ Find high-probability trade setups',
      icon: Search,
      color: 'cyan',
      category: 'strategy',
      priority: 'medium',
      badge: 'Fast',
      timeEstimate: '30 sec',
      sessionMode: ['plan', 'live'],
      action: () => console.log('Run setup scanner')
    },
    {
      id: 'risk-calculator',
      title: 'Risk Calculator',
      description: '🛡️ Calculate position sizing and risk levels',
      icon: Shield,
      color: 'red',
      category: 'strategy',
      priority: 'medium',
      timeEstimate: '1 min',
      sessionMode: ['plan', 'live'],
      action: () => console.log('Open risk calculator')
    },
    {
      id: 'strategy-backtest',
      title: 'Quick Backtest',
      description: '📈 Test strategy on recent market data',
      icon: TrendingUp,
      color: 'purple',
      category: 'strategy',
      priority: 'low',
      timeEstimate: '5 min',
      sessionMode: ['plan', 'review'],
      action: () => console.log('Run backtest')
    },
    {
      id: 'market-analysis',
      title: 'Deep Market Analysis',
      description: '🔍 Comprehensive market structure analysis',
      icon: BarChart3,
      color: 'blue',
      category: 'strategy',
      priority: 'low',
      timeEstimate: '10 min',
      sessionMode: ['plan'],
      action: () => console.log('Open market analysis')
    },

    // Psychology & Journal
    {
      id: 'emotion-tracker',
      title: 'Emotion Tracker',
      description: '❤️ Log your emotional state during trades',
      icon: Heart,
      color: 'pink',
      category: 'psychology',
      priority: 'medium',
      timeEstimate: '2 min',
      sessionMode: ['live', 'review'],
      action: () => console.log('Open emotion tracker')
    },
    {
      id: 'breathing-exercise',
      title: 'Calming Breath',
      description: '🌬️ 2-minute breathing exercise for focus',
      icon: Coffee,
      color: 'cyan',
      category: 'psychology',
      priority: 'medium',
      badge: 'Quick',
      timeEstimate: '2 min',
      sessionMode: ['plan', 'live'],
      action: () => console.log('Start breathing exercise')
    },
    {
      id: 'session-reflection',
      title: 'Session Reflection',
      description: '🪞 Deep dive into today\'s performance',
      icon: Brain,
      color: 'blue',
      category: 'psychology',
      priority: 'high',
      timeEstimate: '10 min',
      sessionMode: ['review'],
      action: () => console.log('Open session reflection')
    },

    // Learning & Insights
    {
      id: 'lesson-library',
      title: 'Lesson Library',
      description: '📚 Browse personalized trading insights',
      icon: BookMarked,
      color: 'emerald',
      category: 'learning',
      priority: 'low',
      timeEstimate: '5-15 min',
      sessionMode: ['plan', 'review'],
      action: () => console.log('Open lesson library')
    },
    {
      id: 'pattern-study',
      title: 'Pattern Study',
      description: '🎯 Review successful pattern recognition',
      icon: Star,
      color: 'amber',
      category: 'learning',
      priority: 'medium',
      timeEstimate: '7 min',
      sessionMode: ['review'],
      action: () => console.log('Open pattern study')
    },
    {
      id: 'mistake-analysis',
      title: 'Mistake Analysis',
      description: '🔍 Learn from recent trading mistakes',
      icon: AlertTriangle,
      color: 'red',
      category: 'learning',
      priority: 'medium',
      timeEstimate: '5 min',
      sessionMode: ['review'],
      action: () => console.log('Open mistake analysis')
    },
    {
      id: 'ask-edgebot',
      title: 'Ask EdgeBot',
      description: '🤖 Get personalized coaching insights',
      icon: MessageSquare,
      color: 'emerald',
      category: 'learning',
      priority: 'low',
      isNew: true,
      timeEstimate: 'Instant',
      sessionMode: ['plan', 'live', 'review'],
      action: () => console.log('Open EdgeBot chat')
    }
  ];

  const colorConfigs = {
    blue: {
      gradient: 'from-blue-500/25 to-blue-400/12',
      border: 'border-blue-500/40',
      hoverBorder: 'hover:border-blue-400/70',
      shadow: 'hover:shadow-blue-500/30',
      glowShadow: 'hover:shadow-2xl hover:shadow-blue-500/20',
      iconBg: 'bg-blue-500/25',
      iconColor: 'text-blue-400',
      badgeBg: 'bg-blue-500/25',
      badgeText: 'text-blue-300',
      accent: 'from-blue-500/60 to-blue-400/40'
    },
    emerald: {
      gradient: 'from-emerald-500/25 to-emerald-400/12',
      border: 'border-emerald-500/40',
      hoverBorder: 'hover:border-emerald-400/70',
      shadow: 'hover:shadow-emerald-500/30',
      glowShadow: 'hover:shadow-2xl hover:shadow-emerald-500/20',
      iconBg: 'bg-emerald-500/25',
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/25',
      badgeText: 'text-emerald-300',
      accent: 'from-emerald-500/60 to-emerald-400/40'
    },
    purple: {
      gradient: 'from-purple-500/25 to-purple-400/12',
      border: 'border-purple-500/40',
      hoverBorder: 'hover:border-purple-400/70',
      shadow: 'hover:shadow-purple-500/30',
      glowShadow: 'hover:shadow-2xl hover:shadow-purple-500/20',
      iconBg: 'bg-purple-500/25',
      iconColor: 'text-purple-400',
      badgeBg: 'bg-purple-500/25',
      badgeText: 'text-purple-300',
      accent: 'from-purple-500/60 to-purple-400/40'
    },
    amber: {
      gradient: 'from-amber-500/25 to-amber-400/12',
      border: 'border-amber-500/40',
      hoverBorder: 'hover:border-amber-400/70',
      shadow: 'hover:shadow-amber-500/30',
      glowShadow: 'hover:shadow-2xl hover:shadow-amber-500/20',
      iconBg: 'bg-amber-500/25',
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/25',
      badgeText: 'text-amber-300',
      accent: 'from-amber-500/60 to-amber-400/40'
    },
    red: {
      gradient: 'from-red-500/25 to-red-400/12',
      border: 'border-red-500/40',
      hoverBorder: 'hover:border-red-400/70',
      shadow: 'hover:shadow-red-500/30',
      glowShadow: 'hover:shadow-2xl hover:shadow-red-500/20',
      iconBg: 'bg-red-500/25',
      iconColor: 'text-red-400',
      badgeBg: 'bg-red-500/25',
      badgeText: 'text-red-300',
      accent: 'from-red-500/60 to-red-400/40'
    },
    cyan: {
      gradient: 'from-cyan-500/25 to-cyan-400/12',
      border: 'border-cyan-500/40',
      hoverBorder: 'hover:border-cyan-400/70',
      shadow: 'hover:shadow-cyan-500/30',
      glowShadow: 'hover:shadow-2xl hover:shadow-cyan-500/20',
      iconBg: 'bg-cyan-500/25',
      iconColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/25',
      badgeText: 'text-cyan-300',
      accent: 'from-cyan-500/60 to-cyan-400/40'
    },
    pink: {
      gradient: 'from-pink-500/25 to-pink-400/12',
      border: 'border-pink-500/40',
      hoverBorder: 'hover:border-pink-400/70',
      shadow: 'hover:shadow-pink-500/30',
      glowShadow: 'hover:shadow-2xl hover:shadow-pink-500/20',
      iconBg: 'bg-pink-500/25',
      iconColor: 'text-pink-400',
      badgeBg: 'bg-pink-500/25',
      badgeText: 'text-pink-300',
      accent: 'from-pink-500/60 to-pink-400/40'
    }
  };

  // Filter actions based on session mode and get recommendations
  const getFilteredActions = (category: string) => {
    return quickActions
      .filter(action => action.category === category)
      .filter(action => !action.sessionMode || action.sessionMode.includes(sessionMode))
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  };

  const getRecommendedActions = () => {
    const baseRecommended = getFilteredActions('recommended');
    
    // Add contextual recommendations based on mood/session
    const contextualActions = quickActions.filter(action => {
      if (currentMood === 'stressed' && action.id === 'breathing-exercise') return true;
      if (sessionMode === 'review' && action.id === 'session-reflection') return true;
      return false;
    });

    return [...baseRecommended, ...contextualActions].slice(0, 4);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleActionComplete = (actionId: string) => {
    setCompletedActions(prev => new Set([...prev, actionId]));
  };

  const sections = [
    {
      id: 'recommended',
      title: 'Recommended Now',
      subtitle: `Smart actions for ${sessionMode} mode`,
      icon: Flame,
      color: 'emerald',
      actions: getRecommendedActions(),
      alwaysShow: true
    },
    {
      id: 'strategy',
      title: 'Strategy Tools',
      subtitle: 'Market analysis & planning',
      icon: Target,
      color: 'purple',
      actions: getFilteredActions('strategy')
    },
    {
      id: 'psychology',
      title: 'Psychology & Journal',
      subtitle: 'Mindset & emotional tracking',
      icon: Brain,
      color: 'blue',
      actions: getFilteredActions('psychology')
    },
    {
      id: 'learning',
      title: 'Learning Insights',
      subtitle: 'Knowledge & improvement',
      icon: Lightbulb,
      color: 'amber',
      actions: getFilteredActions('learning')
    }
  ];

  const renderActionCard = (action: QuickAction, index: number, isCompact = false) => {
    const config = colorConfigs[action.color];
    const IconComponent = action.icon;
    const isHovered = hoveredAction === action.id;
    const isCompleted = completedActions.has(action.id);

    return (
      <motion.button
        key={action.id}
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: index * 0.1,
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{ 
          scale: isCompact ? 1.02 : 1.03, 
          y: -2,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setHoveredAction(action.id)}
        onHoverEnd={() => setHoveredAction(null)}
        onClick={() => {
          action.action();
          handleActionComplete(action.id);
        }}
        className={`
          group relative ${isCompact ? 'p-4' : 'p-5'} rounded-2xl text-left overflow-hidden
          bg-gradient-to-br ${config.gradient}
          border ${config.border} ${config.hoverBorder}
          transition-all duration-300
          ${config.glowShadow}
          ${isCompleted ? 'opacity-75' : ''}
        `}
      >
        {/* Completion indicator */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-6 h-6 bg-emerald-500/90 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* New/Special badges */}
        {action.isNew && !isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-emerald-500/90 rounded-full shadow-lg"
          >
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-bold">NEW</span>
          </motion.div>
        )}

        <div className="relative z-10">
          <div className={`flex items-start gap-${isCompact ? '3' : '4'} ${isCompact ? 'mb-2' : 'mb-4'}`}>
            {/* Enhanced icon */}
            <motion.div 
              whileHover={{ scale: 1.15, rotate: 8 }}
              className={`
                ${isCompact ? 'p-2' : 'p-3'} rounded-xl ${config.iconBg} backdrop-blur-sm shadow-lg
                group-hover:shadow-xl border border-white/10
                transition-all duration-300
              `}
            >
              <IconComponent className={`${isCompact ? 'w-5 h-5' : 'w-6 h-6'} ${config.iconColor} drop-shadow-sm`} />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h5 className={`${isCompact ? 'text-base' : 'text-lg'} font-bold text-white group-hover:text-blue-300 transition-colors`}>
                  {action.title}
                </h5>
                {action.badge && (
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold
                    ${config.badgeBg} ${config.badgeText} border border-white/20
                  `}>
                    {action.badge}
                  </span>
                )}
              </div>
              
              <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-slate-300 leading-relaxed mb-2`}>
                {action.description}
              </p>
              
              {/* Time estimate */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{action.timeEstimate}</span>
              </div>
            </div>
          </div>

          {/* Psychology insight on hover - only for non-compact cards */}
          {!isCompact && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                height: isHovered ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {action.psychologyNote && (
                <div className="pt-3 border-t border-white/15">
                  <div className="flex items-start gap-2">
                    <Heart className="w-3 h-3 text-pink-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-pink-300 leading-relaxed italic">
                      💡 {action.psychologyNote}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Enhanced animated border accent */}
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
      </motion.button>
    );
  };

  const renderSection = (section: any) => {
    const isExpanded = expandedSections.has(section.id);
    const SectionIcon = section.icon;
    const completedCount = section.actions.filter((action: QuickAction) => completedActions.has(action.id)).length;

    return (
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Section Header */}
        <motion.button
          onClick={() => !section.alwaysShow && toggleSection(section.id)}
          disabled={section.alwaysShow}
          className={`
            w-full flex items-center justify-between p-4 rounded-xl
            ${section.alwaysShow 
              ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-500/30' 
              : 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50'
            }
            transition-all duration-200
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${section.alwaysShow ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
              <SectionIcon className={`w-5 h-5 ${section.alwaysShow ? 'text-emerald-400' : `text-${section.color}-400`}`} />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                {section.title}
                {completedCount > 0 && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                    {completedCount}/{section.actions.length} done
                  </span>
                )}
              </h4>
              <p className="text-sm text-slate-400">{section.subtitle}</p>
            </div>
          </div>
          
          {!section.alwaysShow && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          )}
        </motion.button>

        {/* Section Content */}
        <AnimatePresence>
          {(section.alwaysShow || isExpanded) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`grid gap-4 ${
                section.id === 'recommended' 
                  ? 'grid-cols-1 lg:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {section.actions.map((action: QuickAction, index: number) => 
                  renderActionCard(action, index, section.id !== 'recommended')
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            Command Center
          </h3>
          <p className="text-slate-400 flex items-center gap-2">
            <span>Smart actions for better trading decisions</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">{sessionMode.toUpperCase()} mode</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold text-white">{completedActions.size}</div>
            <div className="text-xs text-slate-400">completed today</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 border border-blue-500/30 hover:border-blue-400/50 shadow-lg hover:shadow-blue-500/25"
          >
            <PlusCircle className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map(section => renderSection(section))}
      </div>

      {/* Daily Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-gradient-to-r from-slate-800/60 to-slate-700/40 rounded-xl border border-slate-600/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-500/30">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h5 className="text-lg font-bold text-white">
                Daily Progress
              </h5>
              <p className="text-sm text-slate-300">
                You're building great trading habits
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{completedActions.size}</div>
              <div className="text-xs text-slate-400">actions completed</div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-slate-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - completedActions.size / 10)}`}
                  className="text-emerald-400 transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{Math.round(completedActions.size / 10 * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
