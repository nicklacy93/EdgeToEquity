"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    ChevronRight,
    ChevronLeft,
    PlusCircle,
    Stethoscope,
    BarChart3,
    Brain,
    TrendingUp,
    Target,
    Sparkles,
    Clock,
    ArrowRight,
    MessageSquare,
    CheckCircle2,
    Rocket
} from "lucide-react";
import ThemeToggle from '@/components/ui/ThemeToggle';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import LeftSidebar from './LeftSidebar';
import { useUserStore } from '@/store/useUserStore';
import { EdgeBotWelcome } from '@/components/EdgeBot';

import StrategyWorkspace from '@/components/strategy/StrategyWorkspace';
import { useRouter } from "next/navigation";
import { AuthProvider } from '@/context/AuthContext';

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

interface SessionContext extends UserMetrics {
    strategiesActive: number;
    strategiesCompleted: number;
    strategiesDraft: number;
}

type LearningPhase = 'create' | 'heal' | 'learn' | 'reflect' | 'grow' | 'validate';

interface PhaseContent {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    backgroundGradient: string;
    borderColor: string;
}

interface EdgeBotGuidance {
    greeting: string;
    suggestion: string;
    action: string;
    priority: string;
    color: string;
    phase: LearningPhase;
    nextPhase: string;
}

interface LeftSidebarWithThemeProps {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    sessionContext: SessionContext;
    currentTab: string;
    onNavigateToStrategy?: () => void;
    onNavigateToDoctor?: () => void;
    onNavigateToDashboard?: () => void;
    onNavigateToAnalytics?: () => void;
}

interface DashboardOverviewProps {
    sessionContext: SessionContext;
    userProfile: UserProfile;
    onNavigateToStrategy: () => void;
    onNavigateToDoctor: () => void;
    onShowEdgeBotWelcome?: () => void;
}

interface EnhancedPhaseInterfaceProps {
    sessionContext: SessionContext;
    user: UserProfile;
    getEdgeBotGuidance: (context: SessionContext) => EdgeBotGuidance;
    getLearningPhase: (context: SessionContext) => { phase: LearningPhase; progress: number };
    onNavigateToStrategy: () => void;
    onNavigateToDoctor: () => void;
}

type WorkspaceMode = "learn" | "create" | "test";

interface Props {
    initialMode?: WorkspaceMode;
}

// Create a separate component that uses useTheme
const LeftSidebarWithTheme = ({
    sidebarCollapsed,
    setSidebarCollapsed,
    sessionContext,
    currentTab,
    onNavigateToStrategy,
    onNavigateToDoctor,
    onNavigateToDashboard,
    onNavigateToAnalytics
}: LeftSidebarWithThemeProps) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    return (
        <LeftSidebar
            isDarkMode={isDarkMode}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            sessionContext={sessionContext}
            currentTab={currentTab}
            onNavigateToStrategy={onNavigateToStrategy}
            onNavigateToDoctor={onNavigateToDoctor}
            onNavigateToDashboard={onNavigateToDashboard}
            onNavigateToAnalytics={onNavigateToAnalytics}
        />
    );
};

// Add Dashboard Overview Component
const DashboardOverview = ({
    sessionContext,
    userProfile,
    onNavigateToStrategy,
    onNavigateToDoctor,
    onShowEdgeBotWelcome
}: DashboardOverviewProps) => {
    const { strategiesBuilt, conceptsLearned, todayTimeSpent, learningStreak, completionRate, totalFocusTime, strategiesCompleted, strategiesDraft, strategiesActive } = sessionContext;

    // Performance Metrics Calculations
    const calculateProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);
    const getAchievementLevel = (streak: number) => {
        if (streak >= 30) return { level: 'Master', color: 'text-[#22c55e]', icon: '👑' };
        if (streak >= 14) return { level: 'Expert', color: 'text-[#22c55e]', icon: '🏆' };
        if (streak >= 7) return { level: 'Advanced', color: 'text-[#2563eb]', icon: '⭐' };
        if (streak >= 3) return { level: 'Intermediate', color: 'text-amber-400', icon: '🔥' };
        return { level: 'Beginner', color: 'text-slate-400', icon: '🌱' };
    };

    const getNextMilestone = (current: number, type: 'strategies' | 'concepts' | 'streak') => {
        const milestones = {
            strategies: [1, 3, 5, 10, 25],
            concepts: [5, 10, 20, 50, 100],
            streak: [3, 7, 14, 30, 60]
        };
        const next = milestones[type].find(m => m > current) || current;
        return { current, next, progress: calculateProgress(current, next) };
    };

    const achievementLevel = getAchievementLevel(learningStreak);
    const strategyMilestone = getNextMilestone(strategiesBuilt, 'strategies');
    const conceptMilestone = getNextMilestone(conceptsLearned, 'concepts');
    const streakMilestone = getNextMilestone(learningStreak, 'streak');

    return (
        <div className="space-y-8">
            {/* Welcome Section with Achievement Level */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/20 rounded-2xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <Brain className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[hsl(var(--text-main))]">
                                Welcome Back, {userProfile.name || (userProfile.tradingExperience === 'beginner' ? 'Trader' : 'Expert')}! 🚀
                            </h1>
                            <p className="text-slate-400">
                                Ready To Build, Analyze, And Optimize Your Trading Strategies
                            </p>
                            {onShowEdgeBotWelcome && (
                                <button
                                    onClick={onShowEdgeBotWelcome}
                                    className="mt-2 px-3 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                                >
                                    Test EdgeBot Welcome
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-lg font-bold ${achievementLevel.color}`}>
                            {achievementLevel.icon} {achievementLevel.level}
                        </div>
                        <div className="text-sm text-slate-400">
                            {learningStreak} Day Streak
                        </div>
                    </div>
                </div>

                {/* Enhanced Quick Stats with Progress */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-tour-id="progress-metrics">
                    <div className="bg-white/5 rounded-xl p-4 border border-slate-700/50">
                        <div className="text-2xl font-bold text-emerald-400">{strategiesBuilt}</div>
                        <div className="text-sm text-slate-400 mb-2">Strategies Built</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${strategyMilestone.progress}%` }}
                            />
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {strategyMilestone.next - strategyMilestone.current} To Next Milestone
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-slate-700/50">
                        <div className="text-2xl font-bold text-blue-400">{conceptsLearned}</div>
                        <div className="text-sm text-slate-400 mb-2">Concepts Learned</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${conceptMilestone.progress}%` }}
                            />
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {conceptMilestone.next - conceptMilestone.current} To Next Milestone
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-slate-700/50">
                        <div className="text-2xl font-bold text-[#22c55e]">{todayTimeSpent}</div>
                        <div className="text-sm text-slate-400 mb-2">Focus Time</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-[#22c55e] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((totalFocusTime / 60) * 10, 100)}%` }}
                            />
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m Total
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-slate-700/50">
                        <div className="text-2xl font-bold text-amber-400">{learningStreak}</div>
                        <div className="text-sm text-slate-400 mb-2">Day Streak</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${streakMilestone.progress}%` }}
                            />
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {streakMilestone.next - streakMilestone.current} Days To Next Milestone
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Performance Insights */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <h2 className="text-xl font-semibold text-[hsl(var(--text-main))]">Performance Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="font-semibold text-[hsl(var(--text-main))]">Completion Rate</h3>
                        </div>
                        <div className="text-2xl font-bold text-green-400">{completionRate}%</div>
                        <div className="text-sm text-slate-400 mb-2">
                            {strategiesCompleted} Of {strategiesBuilt} Strategies Completed
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Target className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-[hsl(var(--text-main))]">Learning Efficiency</h3>
                        </div>
                        <div className="text-2xl font-bold text-blue-400">
                            {Math.round((conceptsLearned / Math.max(totalFocusTime / 60, 1)) * 10) / 10}
                        </div>
                        <div className="text-sm text-slate-400">
                            Concepts Per Hour Of Focus Time
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Smart Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <h2 className="text-xl font-semibold text-[hsl(var(--text-main))]">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strategy Architect - Always Available */}
                    <button
                        data-tour-id="strategy-architect"
                        onClick={onNavigateToStrategy}
                        className="group relative bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border border-emerald-400/30 rounded-2xl p-6 hover:from-emerald-500/30 hover:to-emerald-400/20 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
                                <Sparkles className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-semibold text-[hsl(var(--text-main))]">Strategy Architect</h3>
                                <p className="text-slate-400">Build New Trading Strategies With AI Guidance</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-emerald-400 ml-auto group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Conditional Strategy Doctor or Get Started */}
                    {strategiesBuilt > 0 ? (
                        <button
                            data-tour-id="strategy-doctor"
                            onClick={onNavigateToDoctor}
                            className="group relative bg-gradient-to-r from-blue-500/20 to-blue-400/10 border border-blue-400/30 rounded-2xl p-6 hover:from-blue-500/30 hover:to-blue-400/20 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                                    <Stethoscope className="w-8 h-8 text-blue-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-[hsl(var(--text-main))]">Strategy Doctor</h3>
                                    <p className="text-slate-400">Analyze And Optimize Existing Strategies</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-blue-400 ml-auto group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ) : (
                        <button
                            data-tour-id="get-started"
                            onClick={onNavigateToStrategy}
                            className="group relative bg-gradient-to-r from-[#22c55e]/20 to-[#22c55e]/10 border border-[#22c55e]/30 rounded-2xl p-6 hover:from-[#22c55e]/30 hover:to-[#22c55e]/20 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#22c55e]/20 rounded-xl group-hover:bg-[#22c55e]/30 transition-colors">
                                    <Rocket className="w-8 h-8 text-[#22c55e]" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-[hsl(var(--text-main))]">Get Started</h3>
                                    <p className="text-slate-400">Create Your First Trading Strategy</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-[#22c55e] ml-auto group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Strategy Overview with Enhanced Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <h2 className="text-xl font-semibold text-[hsl(var(--text-main))]">Your Strategies</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="font-semibold text-[hsl(var(--text-main))]">Active</h3>
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">{strategiesActive || 0}</div>
                        <div className="text-sm text-slate-400 mb-2">Currently Running</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(((strategiesActive || 0) / Math.max(strategiesBuilt, 1)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-[hsl(var(--text-main))]">Completed</h3>
                        </div>
                        <div className="text-2xl font-bold text-blue-400">{strategiesCompleted || 0}</div>
                        <div className="text-sm text-slate-400 mb-2">Ready For Testing</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(((strategiesCompleted || 0) / Math.max(strategiesBuilt, 1)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-400" />
                            </div>
                            <h3 className="font-semibold text-[hsl(var(--text-main))]">Draft</h3>
                        </div>
                        <div className="text-2xl font-bold text-amber-400">{strategiesDraft || 0}</div>
                        <div className="text-sm text-slate-400 mb-2">In Progress</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(((strategiesDraft || 0) / Math.max(strategiesBuilt, 1)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Enhanced Phase Interface - Consolidated tools in one area
const EnhancedPhaseInterface = ({
    sessionContext,
    user,
    getEdgeBotGuidance,
    getLearningPhase,
    onNavigateToStrategy,
    onNavigateToDoctor
}: EnhancedPhaseInterfaceProps) => {
    const [activeModal, setActiveModal] = useState<'generator' | 'chat' | 'doctor' | null>(null);
    const guidance = getEdgeBotGuidance(sessionContext);
    const { phase, progress } = getLearningPhase(sessionContext);

    // Define phase-specific content
    const getPhaseContent = (): PhaseContent => {
        switch (phase) {
            case 'learn':
                return {
                    icon: BookOpen,
                    title: "Master the Fundamentals",
                    description: "Build your foundation with proven trading concepts",
                    backgroundGradient: "from-blue-500/20 to-blue-400/10",
                    borderColor: "border-blue-400/30"
                };
            case 'create':
                return {
                    icon: PlusCircle,
                    title: "Build Your First Strategy",
                    description: "Time to apply what you've learned - I'll guide you step by step",
                    backgroundGradient: "from-emerald-500/20 to-emerald-400/10",
                    borderColor: "border-emerald-400/30"
                };
            case 'heal':
                return {
                    icon: Stethoscope,
                    title: "Health Check Time",
                    description: "Let's diagnose and fix any issues in your strategies",
                    backgroundGradient: "from-amber-500/20 to-amber-400/10",
                    borderColor: "border-amber-400/30"
                };
            case 'validate':
                return {
                    icon: BarChart3,
                    title: "Validate Your Strategies",
                    description: "Test your strategies with historical data",
                    backgroundGradient: "from-blue-500/20 to-blue-400/10",
                    borderColor: "border-blue-400/30"
                };
            case 'reflect':
                return {
                    icon: Brain,
                    title: "Analyze Your Journey",
                    description: "Extract insights from your wins, losses, and patterns",
                    backgroundGradient: "from-[#22c55e]/20 to-[#22c55e]/10",
                    borderColor: "border-[#22c55e]/30"
                };
            case 'grow':
                return {
                    icon: TrendingUp,
                    title: "Advanced Mastery",
                    description: "Portfolio optimization, advanced techniques, and mentoring others",
                    backgroundGradient: "from-emerald-500/20 to-emerald-400/10",
                    borderColor: "border-emerald-400/30"
                };
            default:
                return {
                    icon: Target,
                    title: "Start Your Trading Journey",
                    description: "Every expert started with a single step - let's begin yours",
                    backgroundGradient: "from-blue-500/20 to-emerald-500/10",
                    borderColor: "border-blue-400/30"
                };
        }
    };

    const phaseContent = getPhaseContent();

    return (
        <div
            className="rounded-2xl border p-6"
            style={{
                background: "hsl(var(--card-bg-hsl))",
                color: "hsl(var(--text-main))",
                borderColor: "hsl(var(--border-hsl))",
                boxShadow: '0 2px 12px 0 hsl(var(--border-hsl), 0.08)'
            }}
        >
            {/* EdgeBot-Controlled Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 bg-gradient-to-r ${phaseContent.backgroundGradient} rounded-2xl border ${phaseContent.borderColor}`}>
                    <phaseContent.icon className="w-8 h-8 text-current" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-[hsl(var(--text-main))]">{phaseContent.title}</h3>
                    <p className="text-sm text-[hsl(var(--text-muted))]">{phaseContent.description}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-[hsl(var(--text-muted))] uppercase tracking-wider">
                        Phase: {phase}
                    </div>
                    <div className="text-sm font-medium text-[hsl(var(--text-main))]">
                        {Math.round(progress)}% Complete
                    </div>
                </div>
            </div>

            {/* Single Focus Action Area - EdgeBot Controlled */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-2xl bg-gradient-to-br ${phaseContent.backgroundGradient} border ${phaseContent.borderColor} relative overflow-hidden`}
            >
                {/* EdgeBot Avatar in Action Area */}
                <div className="absolute top-4 right-4">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                    >
                        <Brain className="w-5 h-5 text-white" />
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="mb-6">
                    <h4 className="text-2xl font-bold text-white mb-2">
                        {guidance.greeting.replace(/\*\*/g, '')}
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                        {guidance.suggestion}
                    </p>
                </div>

                {/* Progress Visualization */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/70">Your Progress</span>
                        <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                        <motion.div
                            className="h-full bg-white/60 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                        />
                    </div>
                </div>

                {/* Consolidated Action Buttons */}
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNavigateToStrategy}
                        className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-4 px-6 rounded-xl border border-white/20 backdrop-blur-sm transition-all"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Open Strategy Architect
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveModal(activeModal === 'chat' ? null : 'chat')}
                        className="bg-white/10 hover:bg-white/20 text-white/80 font-medium py-4 px-6 rounded-xl border border-white/10 backdrop-blur-sm transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Ask EdgeBot
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNavigateToDoctor}
                        className="bg-white/10 hover:bg-white/20 text-white/80 font-medium py-4 px-6 rounded-xl border border-white/10 backdrop-blur-sm transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" />
                            Strategy Doctor
                        </div>
                    </motion.button>
                </div>

                {/* Next Phase Hint */}
                {guidance.nextPhase && (
                    <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                            <Clock className="w-4 h-4" />
                            Coming next: <span className="capitalize font-medium text-white">{guidance.nextPhase}</span>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const DashboardContent = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<string | null>(null);
    const [showDashboard, setShowDashboard] = useState(true); // Add this state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Add this state

    // EdgeBot Welcome State
    const [showEdgeBotWelcome, setShowEdgeBotWelcome] = useState(false);
    const [hasSeenWelcome, setHasSeenWelcome] = useState(false); // Temporarily reset for testing

    // Use real user store instead of mock data
    const {
        userProfile,
        metrics,
        updateLearningStreak,
        setUserProfile,
        updateCompletionRate
    } = useUserStore();

    // Progressive Onboarding State
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [onboardingComplete, setOnboardingComplete] = useState(false);

    // Create session context from real metrics
    const sessionContext: SessionContext = {
        ...metrics,
        strategiesActive: metrics.strategiesActive,
        strategiesCompleted: metrics.strategiesCompleted,
        strategiesDraft: metrics.strategiesDraft
    };

    // Real-time metrics updates
    useEffect(() => {
        setIsLoaded(true);
        // Update learning streak when user visits dashboard
        updateLearningStreak();
        // Update completion rate based on current metrics
        updateCompletionRate();

        // Show EdgeBot welcome for new users
        if (sessionContext.strategiesBuilt === 0) {
            setTimeout(() => {
                setShowEdgeBotWelcome(true);
            }, 2000); // Show after 2 seconds
        }
    }, [updateLearningStreak, updateCompletionRate, hasSeenWelcome, sessionContext.strategiesBuilt]);

    // Auto-refresh metrics every 30 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            updateLearningStreak();
            updateCompletionRate();
        }, 30000);

        return () => clearInterval(interval);
    }, [updateLearningStreak, updateCompletionRate]);

    // Navigation handlers
    const handleNavigateToStrategy = () => {
        setShowDashboard(false);
        setActiveWorkspaceTab('generator');
    };

    const handleNavigateToDoctor = () => {
        setShowDashboard(false);
        setActiveWorkspaceTab('debugger');
    };

    const handleBackToDashboard = () => {
        setShowDashboard(true);
    };

    // Learning Center Phase System - Enhanced with Performance Metrics
    const getLearningPhase = (sessionContext: SessionContext): { phase: LearningPhase; progress: number } => {
        const { strategiesBuilt, learningStreak, conceptsLearned, completionRate, totalFocusTime } = sessionContext;

        // Calculate learning efficiency (concepts per hour)
        const learningEfficiency = conceptsLearned / Math.max(totalFocusTime / 60, 1);

        // Calculate strategy quality (completion rate)
        const strategyQuality = completionRate / 100;

        // Calculate consistency (streak-based)
        const consistency = Math.min(learningStreak / 30, 1);

        // Enhanced phase determination with multiple factors
        if (strategiesBuilt === 0 && conceptsLearned < 5) {
            // Learning phase - focus on concept absorption
            const progress = Math.min((conceptsLearned / 5) * 100, 100);
            return { phase: 'learn', progress };
        }

        if (strategiesBuilt === 0 && conceptsLearned >= 5) {
            // Ready to create - transition phase
            return { phase: 'create', progress: 0 };
        }

        if (strategiesBuilt > 0 && strategiesBuilt < 3) {
            // Creation phase - building first strategies
            const progress = Math.min((strategiesBuilt / 3) * 100, 100);
            return { phase: 'create', progress };
        }

        if (strategiesBuilt >= 3 && learningStreak < 7) {
            // Healing phase - optimizing and debugging
            const progress = Math.min((learningStreak / 7) * 100, 100);
            return { phase: 'heal', progress };
        }

        if (learningStreak >= 7 && learningStreak < 14) {
            // Reflection phase - analyzing patterns
            const progress = Math.min(((learningStreak - 7) / 7) * 100, 100);
            return { phase: 'reflect', progress };
        }

        // Growth phase - advanced optimization
        const growthProgress = Math.min(
            ((learningEfficiency * 0.4) + (strategyQuality * 0.4) + (consistency * 0.2)) * 100,
            100
        );
        return { phase: 'grow', progress: growthProgress };
    };

    const getEdgeBotGuidance = (sessionContext: SessionContext): EdgeBotGuidance => {
        const { strategiesBuilt, learningStreak, conceptsLearned } = sessionContext;
        const userName = "Trader";

        const { phase, progress } = getLearningPhase(sessionContext);

        const getPersonalizedGreeting = () => {
            if (userProfile.tradingExperience === 'beginner') {
                return `Welcome to your trading journey${userName}! 🌱 I'm excited to guide you through your first steps.`;
            } else if (userProfile.tradingExperience === 'novice') {
                return `Great to see you back${userName}! 🚀 Let's build on what you know.`;
            } else if (userProfile.tradingExperience === 'intermediate') {
                return `Excellent progress${userName}! 💪 Time to take your skills to the next level.`;
            } else {
                return `Welcome back, expert${userName}! 🎯 Let's refine and optimize your strategies.`;
            }
        };

        const getGoalBasedSuggestion = () => {
            switch (userProfile.primaryGoal) {
                case 'learn':
                    return "I'll break down complex trading concepts into simple, understandable pieces. Every explanation will build your foundation.";
                case 'build':
                    return "I'll guide you through creating profitable strategies step by step, explaining the logic behind each decision.";
                case 'improve':
                    return "I'll analyze your existing strategies, identify areas for improvement, and show you exactly how to enhance them.";
                case 'automate':
                    return "I'll help you transform your manual strategies into automated systems, explaining the automation process.";
                default:
                    return "I'm here to guide you through building, debugging, and understanding trading strategies.";
            }
        };

        switch (phase) {
            case 'learn':
                return {
                    greeting: getPersonalizedGreeting(),
                    suggestion: `You've absorbed ${conceptsLearned} concepts so far. ${progress < 60 ? getGoalBasedSuggestion() : 'You\'re almost ready to start creating!'}`,
                    action: progress < 100 ? "Continue Learning" : "Ready to Create?",
                    priority: "high",
                    color: "blue",
                    phase: 'learn',
                    nextPhase: 'create'
                };
            case 'create':
                return {
                    greeting: getPersonalizedGreeting(),
                    suggestion: `You've built ${strategiesBuilt} strategies. ${strategiesBuilt === 0 ? getGoalBasedSuggestion() : 'Let\'s refine and optimize your strategies!'}`,
                    action: strategiesBuilt === 0 ? "Start Building" : "Continue Building",
                    priority: "high",
                    color: "emerald",
                    phase: 'create',
                    nextPhase: 'heal'
                };
            case 'heal':
                return {
                    greeting: getPersonalizedGreeting(),
                    suggestion: `You have ${strategiesBuilt} strategies ready for analysis. Let's diagnose and optimize them for better performance.`,
                    action: "Analyze Strategies",
                    priority: "medium",
                    color: "amber",
                    phase: 'heal',
                    nextPhase: 'reflect'
                };
            case 'reflect':
                return {
                    greeting: getPersonalizedGreeting(),
                    suggestion: `You've been consistent for ${learningStreak} days. Let's analyze your patterns and extract insights.`,
                    action: "Review Progress",
                    priority: "medium",
                    color: "brand",
                    phase: 'reflect',
                    nextPhase: 'grow'
                };
            case 'grow':
                return {
                    greeting: getPersonalizedGreeting(),
                    suggestion: "You're in the advanced phase. Let's explore advanced strategies and optimization techniques.",
                    action: "Advanced Features",
                    priority: "low",
                    color: "emerald",
                    phase: 'grow',
                    nextPhase: 'grow'
                };
            default:
                return {
                    greeting: getPersonalizedGreeting(),
                    suggestion: getGoalBasedSuggestion(),
                    action: "Get Started",
                    priority: "high",
                    color: "blue",
                    phase: 'learn',
                    nextPhase: 'create'
                };
        }
    };

    return (
        <AnimatePresence>
            {isLoaded && (
                <div className="h-screen flex overflow-hidden" style={{ backgroundColor: "hsl(var(--background-hsl))" }}>
                    <style jsx global>{`
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
              .dashboard-header h1, .dashboard-header h2, .dashboard-header h3, .dashboard-header p, .dashboard-header span {
                color: hsl(var(--text-main));
              }
              .typing-dot {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: hsl(var(--text-muted));
                animation: typing 1.4s infinite ease-in-out;
              }
              @keyframes typing {
                0%, 60%, 100% {
                  transform: translateY(0);
                  opacity: 0.4;
                }
                30% {
                  transform: translateY(-10px);
                  opacity: 1;
                }
              }
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
              .dashboard-header h1, .dashboard-header h2, .dashboard-header h3, .dashboard-header p, .dashboard-header span {
                color: hsl(var(--text-main));
              }
            `}</style>

                    {/* LEFT SIDEBAR */}
                    <LeftSidebarWithTheme
                        sidebarCollapsed={sidebarCollapsed}
                        setSidebarCollapsed={setSidebarCollapsed}
                        sessionContext={sessionContext}
                        currentTab={showDashboard ? 'dashboard' : activeWorkspaceTab || 'generator'}
                        onNavigateToStrategy={handleNavigateToStrategy}
                        onNavigateToDoctor={handleNavigateToDoctor}
                        onNavigateToDashboard={handleBackToDashboard}
                        onNavigateToAnalytics={() => {
                            setShowDashboard(true);
                            // TODO: Add analytics tab when implemented
                        }}
                    />

                    {/* MAIN CONTENT */}
                    <div className="flex-1 flex flex-col">
                        {/* Header */}
                        <div
                            className="p-6 flex-shrink-0 dashboard-header"
                            style={{
                                background: 'hsl(var(--background-hsl))',
                                color: 'hsl(var(--text-main))',
                                borderBottom: '1.5px solid hsl(var(--border-hsl))',
                                boxShadow: '0 2px 12px 0 hsl(var(--border-hsl), 0.08)'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1"
                            >
                                {/* Breadcrumb Navigation */}
                                <div className="flex items-center gap-2 mb-3 text-sm text-slate-400 breadcrumb-nav">
                                    <span className="hover:text-slate-300 cursor-pointer transition-colors">EdgeToEquity</span>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-slate-300 font-medium">
                                        {showDashboard ? "Dashboard" : "Strategy Architect"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-4 justify-between">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                                        >
                                            {sidebarCollapsed ? (
                                                <ChevronRight className="w-5 h-5" />
                                            ) : (
                                                <ChevronLeft className="w-5 h-5" />
                                            )}
                                        </button>
                                        <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/10 border-emerald-400/30 rounded-2xl border">
                                            <Brain className="w-8 h-8 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-[hsl(var(--text-main))]">
                                                {showDashboard ? "Dashboard" : "Strategy Architect"}
                                            </h1>
                                            <p className="text-lg text-slate-400">
                                                {showDashboard ? "Your Trading Strategy Command Center" : "AI-Powered Strategy Development"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {!showDashboard && (
                                            <button
                                                data-tour-id="dashboard"
                                                onClick={handleBackToDashboard}
                                                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-sm"
                                            >
                                                ← Back to Dashboard
                                            </button>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {/* Save Progress Indicator */}
                                            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg save-progress-indicator">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-emerald-400 font-medium">Auto-Saved</span>
                                            </div>
                                            <ThemeToggle />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
                            <div className="space-y-6 max-w-7xl mx-auto">
                                {showDashboard ? (
                                    <DashboardOverview
                                        sessionContext={sessionContext}
                                        userProfile={userProfile}
                                        onNavigateToStrategy={handleNavigateToStrategy}
                                        onNavigateToDoctor={handleNavigateToDoctor}
                                        onShowEdgeBotWelcome={() => setShowEdgeBotWelcome(true)}
                                    />
                                ) : (
                                    <StrategyWorkspace
                                        initialActiveTab={activeWorkspaceTab}
                                        onTabChange={setActiveWorkspaceTab}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Floating EdgeBot */}
                        {/* Removed FloatingEdgeBot */}

                        {/* EdgeBot Welcome Modal */}
                        <EdgeBotWelcome
                            key="edgebot-welcome-modal"
                            isVisible={showEdgeBotWelcome}
                            onClose={() => {
                                setShowEdgeBotWelcome(false);
                                setHasSeenWelcome(true);
                            }}
                            onComplete={() => {
                                setShowEdgeBotWelcome(false);
                                setHasSeenWelcome(true);
                            }}
                            onNavigateToStrategy={handleNavigateToStrategy}
                            onNavigateToDoctor={handleNavigateToDoctor}
                            userProgress={{
                                strategiesBuilt: sessionContext.strategiesBuilt,
                                conceptsLearned: sessionContext.conceptsLearned,
                                learningStreak: sessionContext.learningStreak
                            }}
                        />

                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default function EdgeToEquityDevelopmentDashboard({ initialMode = "learn" }: Props) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <DashboardContent />
            </AuthProvider>
        </ThemeProvider>
    );
}
