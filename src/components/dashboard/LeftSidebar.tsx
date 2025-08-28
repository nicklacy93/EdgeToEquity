'use client';

import React, { useState } from 'react';
import {
    Clock,
    Star,
    Sparkles,
    CheckCircle2,
    Target,
    TrendingUp,
    Settings,
    Library,
    Brain,
    BarChart,
    ChevronLeft,
    ChevronRight,
    Stethoscope,
    BookOpen,
    Code,
    Save,
    Download,
    Copy,
    Eye,
    Zap,
    Lightbulb,
    MessageSquare,
    HelpCircle,
    FileText,
    History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';

// TypeScript Interfaces
interface UserMetrics {
    conceptsLearned: number;
    strategiesBuilt: number;
    journalEntries: number;
    learningStreak: number;
    todayTimeSpent: string;
    weeklyGoal: string;
    completionRate: number;
    lastActiveDate: string;
    totalFocusTime: number;
    strategiesCompleted: number;
    strategiesDraft: number;
    strategiesActive: number;
}

interface UserProfile {
    tradingExperience: string;
    primaryGoal: string;
    marketFocus: string;
    name: string;
}

interface SessionContext {
    todayTimeSpent?: string;
    learningStreak?: number;
    conceptsLearned?: number;
    strategiesBuilt?: number;
    journalEntries?: number;
    completionRate?: number;
    weeklyProgress?: string;
    activeStrategies?: string;
    streakDays?: string;
    strategiesActive?: number;
    strategiesCompleted?: number;
    strategiesDraft?: number;
}

interface NavigationItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
    isActive?: boolean;
}

interface SimplifiedContent {
    navigationItems: NavigationItem[];
    tips: string[];
}

interface LeftSidebarProps {
    sessionContext?: SessionContext;
    sidebarCollapsed?: boolean;
    setSidebarCollapsed?: (collapsed: boolean) => void;
    currentMode?: string;
    handleModeSwitch?: (mode: string) => void;
    isTransitioning?: boolean;
    isDarkMode?: boolean;
    currentTab?: string;
    onNavigateToStrategy?: () => void;
    onNavigateToDoctor?: () => void;
    onNavigateToDashboard?: () => void;
    onNavigateToAnalytics?: () => void;
}

export default function LeftSidebar({
    sessionContext: providedContext,
    sidebarCollapsed = false,
    setSidebarCollapsed,
    currentMode,
    handleModeSwitch,
    isTransitioning,
    isDarkMode = true,
    currentTab = 'generator',
    onNavigateToStrategy,
    onNavigateToDoctor,
    onNavigateToDashboard,
    onNavigateToAnalytics
}: LeftSidebarProps) {
    // Use real user store data
    const { metrics, userProfile, incrementStrategiesBuilt, incrementConceptsLearned } = useUserStore();
    const router = useRouter();

    // Use provided context or fall back to real user data
    const sessionContext = providedContext || {
        todayTimeSpent: metrics.todayTimeSpent,
        learningStreak: metrics.learningStreak,
        conceptsLearned: metrics.conceptsLearned,
        strategiesBuilt: metrics.strategiesBuilt,
        journalEntries: metrics.journalEntries,
        completionRate: metrics.completionRate,
        weeklyProgress: "+0 this week",
        activeStrategies: `${metrics.strategiesActive} active`,
        streakDays: `${metrics.learningStreak} day streak`,
        strategiesActive: metrics.strategiesActive,
        strategiesCompleted: metrics.strategiesCompleted,
        strategiesDraft: metrics.strategiesDraft
    };

    // Quick Tools Actions
    const handleNewStrategy = () => {
        incrementStrategiesBuilt();
        router.push('/strategy-workspace?tab=generator');
    };

    const handleAnalyzeStrategy = () => {
        router.push('/strategy-workspace?tab=debugger');
    };

    const handleViewProgress = () => {
        router.push('/dashboard');
    };

    const handleSaveStrategy = () => {
        // This would typically save to localStorage or backend
        console.log('Strategy saved successfully!');
        // Could show a toast notification here
    };

    const handleExportCode = () => {
        // This would export the current strategy code
        const strategyCode = `// Sample Trading Strategy
strategy("Sample Strategy", overlay=true)
rsi = ta.rsi(close, 14)
plot(rsi, "RSI", color=color.blue)`;

        const blob = new Blob([strategyCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trading-strategy.pine';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopyToClipboard = async () => {
        const strategyCode = `// Sample Trading Strategy
strategy("Sample Strategy", overlay=true)
rsi = ta.rsi(close, 14)
plot(rsi, "RSI", color=color.blue)`;

        try {
            await navigator.clipboard.writeText(strategyCode);
            console.log('Strategy code copied to clipboard!');
            // Could show a toast notification here
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const handlePreviewStrategy = () => {
        // This would open a preview modal or navigate to preview page
        console.log('Opening strategy preview...');
        // Could show a modal with strategy preview
    };

    const handleRunAnalysis = () => {
        incrementConceptsLearned();
        console.log('Running strategy analysis...');
        // This would trigger the analysis process
    };

    const handleAutoOptimize = () => {
        console.log('Auto-optimizing strategy...');
        // This would run optimization algorithms
    };

    const handleExportFixedCode = () => {
        const fixedCode = `// Optimized Trading Strategy
strategy("Optimized Strategy", overlay=true)
rsi = ta.rsi(close, 14)
ema = ta.ema(close, 20)
plot(rsi, "RSI", color=color.blue)
plot(ema, "EMA", color=color.red)`;

        const blob = new Blob([fixedCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimized-strategy.pine';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAnalysisHistory = () => {
        console.log('Opening analysis history...');
        // This would show a modal or navigate to history page
    };

    const handleGetHelp = () => {
        console.log('Opening help documentation...');
        // This would open help docs or chat
    };

    const handleOpenDocs = () => {
        console.log('Opening documentation...');
        // This would open documentation
    };

    // Simplified navigation content
    const getSimplifiedContent = (): SimplifiedContent => {
        const navigationItems: NavigationItem[] = [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: BarChart,
                action: onNavigateToDashboard || (() => { }),
                isActive: currentTab === 'dashboard'
            },
            {
                id: 'strategy-architect',
                label: 'Strategy Architect',
                icon: Sparkles,
                action: onNavigateToStrategy || (() => { }),
                isActive: currentTab === 'generator'
            },
            {
                id: 'strategy-doctor',
                label: 'Strategy Doctor',
                icon: Stethoscope,
                action: onNavigateToDoctor || (() => { }),
                isActive: currentTab === 'debugger'
            },

        ];

        const tips = [
            "Start with simple indicators like RSI or Moving Averages",
            "Always set stop-loss and take-profit levels",
            "Test your strategy with historical data before live trading"
        ];

        return {
            navigationItems,
            tips
        };
    };

    const simplifiedContent = getSimplifiedContent();

    const getCardStyle = (type: 'blue' | 'emerald' | 'purple' | 'amber'): string => {
        if (isDarkMode) {
            switch (type) {
                case 'blue':
                    return 'bg-blue-500/15 border-blue-400/30 text-blue-300';
                case 'emerald':
                    return 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300';
                case 'purple':
                    return 'bg-purple-500/15 border-purple-400/30 text-purple-300';
                case 'amber':
                    return 'bg-amber-500/15 border-amber-400/30 text-amber-300';
                default:
                    return 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300';
            }
        } else {
            switch (type) {
                case 'blue':
                    return 'bg-blue-100 border-blue-300 text-blue-800 shadow-sm';
                case 'emerald':
                    return 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-sm';
                case 'purple':
                    return 'bg-purple-100 border-purple-300 text-purple-800 shadow-sm';
                case 'amber':
                    return 'bg-amber-100 border-amber-300 text-amber-800 shadow-sm';
                default:
                    return 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-sm';
            }
        }
    };

    return (
        <div className="relative h-full">
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    scroll-behavior: smooth;
                }
            `}</style>
            <AnimatePresence>
                {!sidebarCollapsed && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`h-full bg-[hsl(var(--sidebar-bg-hsl))] border-r border-[hsl(var(--border-hsl))] overflow-y-auto scrollbar-hide`}
                        style={{
                            backgroundColor: "hsl(var(--sidebar-bg-hsl))",
                            color: "hsl(var(--text-main))",
                            borderColor: "hsl(var(--border-hsl))"
                        }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[hsl(var(--border-hsl))]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/10 rounded-xl border border-emerald-400/30">
                                    <Brain className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[hsl(var(--text-main))]">EdgeToEquity</h2>
                                    <p className="text-sm text-[hsl(var(--text-muted))]">AI-Powered Trading Strategy Platform</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[hsl(var(--text-main))] uppercase tracking-wider">Navigation</h3>
                                <div className="space-y-3">
                                    {simplifiedContent.navigationItems.map((item, index) => (
                                        <motion.button
                                            key={item.id}
                                            data-tour-id={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={item.action}
                                            className={`w-full p-4 rounded-xl border transition-all hover:scale-105 ${item.isActive
                                                ? item.id === 'dashboard'
                                                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-400/30 text-emerald-300'
                                                    : item.id === 'strategy-architect'
                                                        ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
                                                        : 'bg-blue-500/15 border-blue-400/30 text-blue-300'
                                                : item.id === 'dashboard'
                                                    ? 'bg-[hsl(var(--card-bg-hsl))] border-[hsl(var(--border-hsl))] text-[hsl(var(--text-main))] hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-blue-500/10 hover:border-emerald-400/20'
                                                    : item.id === 'strategy-architect'
                                                        ? 'bg-[hsl(var(--card-bg-hsl))] border-[hsl(var(--border-hsl))] text-[hsl(var(--text-main))] hover:bg-emerald-500/10 hover:border-emerald-400/20'
                                                        : 'bg-[hsl(var(--card-bg-hsl))] border-[hsl(var(--border-hsl))] text-[hsl(var(--text-main))] hover:bg-blue-500/10 hover:border-blue-400/20'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${item.isActive
                                                    ? item.id === 'dashboard'
                                                        ? 'bg-gradient-to-r from-emerald-500/30 to-blue-500/30'
                                                        : item.id === 'strategy-architect'
                                                            ? 'bg-emerald-500/20'
                                                            : 'bg-blue-500/20'
                                                    : 'bg-white/10'
                                                    }`}>
                                                    <item.icon className={`w-4 h-4 ${item.isActive
                                                        ? item.id === 'dashboard'
                                                            ? 'text-emerald-400'
                                                            : item.id === 'strategy-architect'
                                                                ? 'text-emerald-400'
                                                                : 'text-blue-400'
                                                        : ''
                                                        }`} />
                                                </div>
                                                <span className="font-medium text-[hsl(var(--text-main))]">{item.label}</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Smart Tips */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[hsl(var(--text-main))] uppercase tracking-wider">Smart Tips</h3>
                                <div className="space-y-3">
                                    {simplifiedContent.tips.map((tip, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-4 rounded-xl border border-[hsl(var(--border-hsl))] bg-[hsl(var(--card-bg-hsl))]"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-1 rounded-full bg-amber-500/20 mt-0.5">
                                                    <Lightbulb className="w-3 h-3 text-amber-400" />
                                                </div>
                                                <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed">{tip}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Session Stats */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[hsl(var(--text-main))] uppercase tracking-wider">Session</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl border bg-emerald-500/15 border-emerald-400/30">
                                        <div className="text-lg font-bold text-emerald-300">{sessionContext.todayTimeSpent}</div>
                                        <div className="text-xs opacity-80 text-[hsl(var(--text-main))]">Focus Time</div>
                                    </div>
                                    <div className="p-3 rounded-xl border bg-blue-500/15 border-blue-400/30">
                                        <div className="text-lg font-bold text-blue-300">{sessionContext.strategiesBuilt}</div>
                                        <div className="text-xs opacity-80 text-[hsl(var(--text-main))]">Total Built</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="p-6 border-t border-[hsl(var(--border-hsl))]">
                            <div className="space-y-2">
                                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[hsl(var(--hover-hsl))] transition-colors text-[hsl(var(--text-main))]">
                                    <MessageSquare className="w-4 h-4 text-[hsl(var(--text-main))]" />
                                    <span className="text-sm text-[hsl(var(--text-main))]">Ask EdgeBot</span>
                                </button>
                                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[hsl(var(--hover-hsl))] transition-colors text-[hsl(var(--text-main))]">
                                    <Settings className="w-4 h-4 text-[hsl(var(--text-main))]" />
                                    <span className="text-sm text-[hsl(var(--text-main))]">Settings</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapse Button - REMOVED */}
        </div>
    );
} 