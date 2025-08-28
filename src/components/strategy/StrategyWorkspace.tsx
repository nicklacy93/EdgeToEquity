"use client";

/**
 * StrategyWorkspace - Enhanced version following EdgeToEquity design standards
 * Provides emotionally intelligent interface for strategy development
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Stethoscope, BookOpen, TrendingUp, Brain, BookMarked, BarChart3, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from "next/navigation";
import BacktestModule from "@/components/strategy/BacktestModule";
import StrategyGenerator from "@/components/strategy/StrategyGenerator";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import StrategyDebugger from "@/components/strategy/StrategyDebugger";
import { useTheme } from '@/context/ThemeContext';
import { useUserStore } from '@/store/useUserStore';


// Mock component imports - replace with actual components
const StrategyExplainer = () => (
    <div className="p-6 text-blue-400">📚 Strategy Teacher - Breaking down complexity into clarity</div>
);
const PsychologyAgent = () => (
    <div className="p-6 text-pink-400">💭 Psychology Coach - Understanding your trading mindset</div>
);
const JournalAgent = () => (
    <div className="p-6 text-cyan-400">📔 Trading Journal - Capturing your growth story</div>
);

// Tab aliasing for URL params
const tabAlias = (tab: string | null): string => {
    if (tab === "validate") return "backtest";
    if (tab === "create") return "generator";
    return tab || "generator";
};

interface StrategyWorkspaceProps {
    initialActiveTab?: string | null;
    onTabChange?: (tab: string | null) => void;
}

const StrategyWorkspace = ({ initialActiveTab, onTabChange }: StrategyWorkspaceProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = tabAlias(searchParams?.get("tab") || null);
    const { activeTab, setActiveTab } = useWorkspaceStore();
    const [hasInitialized, setHasInitialized] = useState(false);
    const [userEmotion, setUserEmotion] = useState<'confident' | 'cautious' | 'excited' | 'focused'>('confident');
    const [generatedCode, setGeneratedCode] = useState<string>("");
    const [selectedPlatform, setSelectedPlatform] = useState<'NinjaScript' | 'PineScript'>('NinjaScript');

    const { resolvedTheme } = useTheme();
    const isDarkModeTheme = resolvedTheme === 'dark';

    // User Store Integration
    const { addFocusTime, updateLearningStreak } = useUserStore();

    // Auto-populate handler for onboarding


    // Session time tracking
    useEffect(() => {
        const sessionInterval = setInterval(() => {
            // Add 1 minute of focus time every 5 minutes of active session
            addFocusTime(1);
            updateLearningStreak();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(sessionInterval);
    }, [addFocusTime, updateLearningStreak]);

    // Sync activeTab with URL and external control on initial load
    useEffect(() => {
        if (!hasInitialized) {
            if (initialActiveTab) {
                setActiveTab(initialActiveTab);
            } else if (tabParam) {
                setActiveTab(tabParam);
            }
            setHasInitialized(true);
        }
    }, [tabParam, hasInitialized, setActiveTab, initialActiveTab]);

    // Listen for Strategy Doctor navigation from Generated Code
    useEffect(() => {
        const handleSwitchToDebugger = () => {
            handleTabClick('debugger');
        };

        window.addEventListener('switchToDebugger', handleSwitchToDebugger);

        return () => {
            window.removeEventListener('switchToDebugger', handleSwitchToDebugger);
        };
    }, []);

    // Handle external tab changes
    useEffect(() => {
        if (initialActiveTab && initialActiveTab !== activeTab) {
            console.log('Setting active tab from external:', initialActiveTab);
            setActiveTab(initialActiveTab);
        }
    }, [initialActiveTab, setActiveTab]);

    // When user clicks a tab, update the URL and store
    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        let urlTab = tabId;
        if (tabId === "backtest") urlTab = "validate";
        if (tabId === "generator") urlTab = "create";
        router.push(`?tab=${urlTab}`);

        // User Store Integration: Track tab changes
        addFocusTime(1); // Add 1 minute of focus time for tab exploration
        updateLearningStreak(); // Update learning streak

        // Notify parent component of tab change
        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    // Emotionally intelligent tab configuration
    const tabs = [
        {
            id: 'generator',
            name: 'Create',
            icon: Sparkles,
            description: 'Build Your Trading Edge From Ideas',
            encouragement: 'Every Great Strategy Starts With Inspiration',
            color: 'emerald' as const
        },
        {
            id: 'debugger',
            name: 'Heal',
            icon: Stethoscope,
            description: 'Diagnose And Fix Strategy Issues',
            encouragement: 'Every Bug Fixed Makes You Stronger',
            color: 'blue' as const
        },
        {
            id: 'explainer',
            name: 'Learn',
            icon: BookOpen,
            description: 'Understand Your Strategy Deeply',
            encouragement: 'Knowledge Is Your Trading Superpower',
            color: 'blue' as const
        },
        {
            id: 'backtest',
            name: 'Validate',
            icon: TrendingUp,
            description: 'Test Your Edge Against History',
            encouragement: 'Data Reveals Your True Potential',
            color: 'purple' as const
        },
        {
            id: 'psychology',
            name: 'Reflect',
            icon: Brain,
            description: 'Build Emotional Resilience',
            encouragement: 'Master Your Mind, Master The Markets',
            color: 'pink' as const
        },
        {
            id: 'journal',
            name: 'Grow',
            icon: BookMarked,
            description: 'Document Your Trading Journey',
            encouragement: 'Every Reflection Creates Wisdom',
            color: 'cyan' as const
        }
    ];

    const getTabColors = (color: string, isActive: boolean) => {
        const colorMap: Record<string, string> = {
            emerald: isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'text-emerald-400/70',
            amber: isActive ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'text-amber-400/70',
            blue: isActive ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'text-blue-400/70',
            purple: isActive ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'text-blue-400/70',
            pink: isActive ? 'bg-pink-500/20 text-pink-400 border-pink-500/40' : 'text-pink-400/70',
            cyan: isActive ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'text-cyan-400/70'
        };
        return colorMap[color] || colorMap.emerald;
    };

    const getEmotionalContext = () => {
        const contexts: Record<string, string> = {
            confident: "You're Radiating Confidence Today! 💪 Perfect Energy For Bold Strategy Development.",
            cautious: "Thoughtful And Careful - Exactly The Mindset For Refined Analysis. 🎯",
            excited: "Your Enthusiasm Is Contagious! ⚡ Channel That Energy Into Creative Strategies.",
            focused: "Laser-Focused And Ready. 🧠 This Is Your Zone For Deep Work."
        };
        return contexts[userEmotion] || contexts.confident;
    };

    const renderActiveComponent = () => {
        const components = {
            generator: <StrategyGenerator
                generatedCode={generatedCode}
                setGeneratedCode={setGeneratedCode}
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                onNavigateToTab={handleTabClick}
            />,
            debugger: <StrategyDebugger
                generatedCode={generatedCode}
                selectedPlatform={selectedPlatform}
            />,
            explainer: <StrategyExplainer />,
            backtest: <BacktestModule code={generatedCode} platform={selectedPlatform} onNext={() => { }} />,
            psychology: <PsychologyAgent />,
            journal: <JournalAgent />
        };
        return components[activeTab || 'generator'] || components.generator;
    };

    const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

    // Phase 3: Navigation & Progress Enhancement
    const getBreadcrumbPath = () => {
        const breadcrumbs = [
            { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
            { name: 'Strategy Builder', path: null, icon: Sparkles }
        ];

        if (activeTab === 'debugger') {
            breadcrumbs.push({ name: 'Strategy Doctor', path: null, icon: Stethoscope });
        } else if (activeTab === 'backtest') {
            breadcrumbs.push({ name: 'Backtesting', path: null, icon: TrendingUp });
        } else if (activeTab === 'explainer') {
            breadcrumbs.push({ name: 'Strategy Learning', path: null, icon: BookOpen });
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbPath();

    return (
        <div className="w-full h-full flex flex-col">

            {/* Enhanced Navigation with Breadcrumbs */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-4 rounded-xl border ${isDarkModeTheme
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-[hsl(var(--background-hsl))] border-[hsl(var(--border-hsl))]'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={`${crumb.name}-${index}`}>
                                <div className="flex items-center gap-2">
                                    <crumb.icon className={`w-4 h-4 ${isDarkModeTheme ? 'text-slate-400' : 'text-gray-600'
                                        }`} />
                                    <span className={`text-sm ${isDarkModeTheme ? 'text-slate-300' : 'text-black'
                                        }`}>{crumb.name}</span>
                                </div>
                                {index < breadcrumbs.length - 1 && (
                                    <ArrowLeft className={`w-3 h-3 rotate-180 ${isDarkModeTheme ? 'text-slate-500' : 'text-gray-400'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30 ${isDarkModeTheme
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-emerald-500/20 text-emerald-600'
                            }`}>
                            Progress Saved
                        </div>
                        <div className={`text-xs ${isDarkModeTheme ? 'text-slate-400' : 'text-black'
                            }`}>
                            {activeTabData?.encouragement}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content Area with Enhanced Animation */}
            <motion.div
                className={`rounded-2xl border overflow-visible flex-1 flex flex-col bg-[hsl(var(--background-hsl))] border-[hsl(var(--border-hsl))]`}
                layout
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab || 'selection'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="w-full h-full flex flex-col bg-[hsl(var(--background-hsl))]"
                    >
                        {activeTab ? (
                            <motion.div className="w-full h-full flex flex-col p-6">
                                {/* Active Component */}
                                {renderActiveComponent()}
                            </motion.div>
                        ) : (
                            /* Default to Strategy Generator when no tab is selected */
                            <motion.div className="w-full h-full flex flex-col p-6">
                                {renderActiveComponent()}
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default StrategyWorkspace;
