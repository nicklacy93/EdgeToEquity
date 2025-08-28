"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Code,
    Copy,
    Download,
    Send,
    Brain,
    Lightbulb,
    CheckCircle,
    TrendingUp,
    Target,
    Zap,
    Eye,
    RefreshCw,
    Heart,
    X,
    BookOpen,
    Users,
    Info,
    Wand2,
    Rocket,
    Gift,
    HelpCircle,
    Settings,
    Shield,
    BarChart3,
    Plus,
    Minus,
    LineChart,
    Stethoscope,
    MessageSquare,
    Minimize2,
    Maximize2,
    ChevronDown,
    ChevronUp,
    Calculator,
    AlertTriangle,
    RotateCcw,
    ArrowRight
} from 'lucide-react';
// Strategy store is no longer needed since we're using props
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useTheme } from '@/context/ThemeContext';
import { useUserStore } from '@/store/useUserStore';

interface StrategyGeneratorProps {
    generatedCode?: string;
    setGeneratedCode?: (code: string) => void;
    selectedPlatform?: 'NinjaScript' | 'PineScript';
    setSelectedPlatform?: (platform: 'NinjaScript' | 'PineScript') => void;
    onNavigateToTab?: (tab: string) => void;
}

const StrategyGenerator = ({
    generatedCode: externalGeneratedCode,
    setGeneratedCode: setExternalGeneratedCode,
    selectedPlatform: externalSelectedPlatform,
    setSelectedPlatform: setExternalSelectedPlatform,
    onNavigateToTab
}: StrategyGeneratorProps = {}) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';
    const [userInput, setUserInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [codeLanguage, setCodeLanguage] = useState('pinescript');
    const [strategyType, setStrategyType] = useState('');
    const [confidence, setConfidence] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('builder'); // builder, advanced, code
    const [selectedIndicators, setSelectedIndicators] = useState([]);
    const [entryRules, setEntryRules] = useState([]);
    const [exitRules, setExitRules] = useState([]);
    const [templateTab, setTemplateTab] = useState('quick'); // quick, custom
    const [configuredIndicators, setConfiguredIndicators] = useState(new Set()); // Track which indicators have templates applied
    const [riskSettings, setRiskSettings] = useState({
        stopLoss: { enabled: false, type: 'percentage', value: 2 },
        takeProfit: { enabled: false, type: 'ratio', value: 3 },
        positionSize: { type: 'percentage', value: 10 },
        maxRisk: { enabled: true, value: 1 },
        instrument: { type: 'futures', symbol: 'ES' }, // futures, forex
        accountSize: 100000, // Default account size
        lotSize: 'standard', // standard, mini, micro (for forex)
        stopLossPoints: 10 // Default stop loss in points/pips
    });
    const textareaRef = useRef(null);

    // Use external state if provided, otherwise use internal state
    const generatedCode = externalGeneratedCode || '';
    const setGeneratedCode = setExternalGeneratedCode || (() => { });
    const selectedPlatform = externalSelectedPlatform || 'NinjaScript';
    const setSelectedPlatform = setExternalSelectedPlatform || (() => { });

    // Advanced Risk Management: Instrument Data
    const instrumentData = {
        futures: {
            ES: { name: 'E-mini S&P 500', tickValue: 50, tickSize: 0.25, category: 'Index' },
            MES: { name: 'Micro E-mini S&P 500', tickValue: 5, tickSize: 0.25, category: 'Index' },
            NQ: { name: 'E-mini NASDAQ', tickValue: 20, tickSize: 0.25, category: 'Index' },
            MNQ: { name: 'Micro E-mini NASDAQ', tickValue: 2, tickSize: 0.25, category: 'Index' },
            RTY: { name: 'E-mini Russell 2000', tickValue: 50, tickSize: 0.1, category: 'Index' },
            M2K: { name: 'Micro E-mini Russell 2000', tickValue: 5, tickSize: 0.1, category: 'Index' },
            CL: { name: 'Crude Oil', tickValue: 1000, tickSize: 0.01, category: 'Energy' },
            MCL: { name: 'Micro Crude Oil', tickValue: 100, tickSize: 0.01, category: 'Energy' },
            GC: { name: 'Gold', tickValue: 100, tickSize: 0.1, category: 'Metals' },
            MGC: { name: 'Micro Gold', tickValue: 10, tickSize: 0.1, category: 'Metals' }
        },
        forex: {
            'EUR/USD': { name: 'Euro/US Dollar', pipValue: { standard: 10, mini: 1, micro: 0.1 }, category: 'Major' },
            'GBP/USD': { name: 'British Pound/US Dollar', pipValue: { standard: 10, mini: 1, micro: 0.1 }, category: 'Major' },
            'USD/JPY': { name: 'US Dollar/Japanese Yen', pipValue: { standard: 10, mini: 1, micro: 0.1 }, category: 'Major' },
            'USD/CHF': { name: 'US Dollar/Swiss Franc', pipValue: { standard: 10, mini: 1, micro: 0.1 }, category: 'Major' },
            'AUD/USD': { name: 'Australian Dollar/US Dollar', pipValue: { standard: 10, mini: 1, micro: 0.1 }, category: 'Major' },
            'USD/CAD': { name: 'US Dollar/Canadian Dollar', pipValue: { standard: 10, mini: 1, micro: 0.1 }, category: 'Major' }
        }
    };

    // Advanced Position Sizing Calculator
    const calculatePositionSize = (accountSize, riskPercentage, stopLossPoints, instrumentType, symbol, lotSize = 'standard') => {
        const dollarRisk = accountSize * (riskPercentage / 100);

        if (instrumentType === 'futures') {
            const contract = instrumentData.futures[symbol];
            if (!contract) return { contracts: 0, dollarRisk: 0, error: 'Invalid futures symbol' };

            const riskPerContract = stopLossPoints * contract.tickValue;
            const contracts = Math.floor(dollarRisk / riskPerContract);

            return {
                contracts,
                dollarRisk: contracts * riskPerContract,
                riskPerContract,
                maxContracts: Math.floor(accountSize * 0.1 / riskPerContract) // Max 10% of account per trade
            };
        } else if (instrumentType === 'forex') {
            const pair = instrumentData.forex[symbol];
            if (!pair) return { lots: 0, dollarRisk: 0, error: 'Invalid forex pair' };

            const pipValue = pair.pipValue[lotSize];
            const riskPerLot = stopLossPoints * pipValue;
            const lots = Math.floor(dollarRisk / riskPerLot);

            return {
                lots,
                dollarRisk: lots * riskPerLot,
                riskPerLot,
                maxLots: Math.floor(accountSize * 0.1 / riskPerLot) // Max 10% of account per trade
            };
        }

        return { error: 'Invalid instrument type' };
    };

    // Sprint 3: Advanced Intelligence Features
    const [userBehavior, setUserBehavior] = useState({
        timeSpent: 0,
        indicatorsUsed: [],
        strategiesGenerated: 0,
        preferredRiskLevel: 'conservative',
        learningStyle: 'visual',
        lastSession: new Date()
    });

    const [showHelpPanel, setShowHelpPanel] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState('intent'); // 'intent', 'building', 'complete'
    const [strategyIntent, setStrategyIntent] = useState(''); // 'momentum', 'trend', 'mean-reversion', 'breakout'

    const [strategyInsights, setStrategyInsights] = useState([]);

    // Task 1: EdgeBot Chat Functionality
    const [showEdgeBotChat, setShowEdgeBotChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            type: 'bot',
            message: "Hi! I'm EdgeBot, your AI trading assistant. I can help you understand your strategy, explain indicators, suggest improvements, or answer any trading questions. What would you like to know?",
            timestamp: new Date()
        }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // User Store Integration
    const {
        incrementStrategiesBuilt,
        incrementConceptsLearned,
        addFocusTime,
        updateLearningStreak,
        markStrategyComplete,
        markStrategyDraft
    } = useUserStore();

    // Navigation function - use prop if provided, otherwise use workspace store as fallback
    const navigateToTab = onNavigateToTab || ((tab: string) => {
        const { setActiveTab } = useWorkspaceStore();
        setActiveTab(tab);
    });

    // Available indicators for selection
    const availableIndicators = [
        {
            id: 'rsi',
            name: 'RSI',
            description: 'Relative Strength Index',
            category: 'Momentum',
            params: { period: 14, oversold: 30, overbought: 70 },
            icon: TrendingUp,
            color: 'emerald'
        },
        {
            id: 'macd',
            name: 'MACD',
            description: 'Moving Average Convergence Divergence',
            category: 'Momentum',
            params: { fast: 12, slow: 26, signal: 9 },
            icon: LineChart,
            color: 'blue'
        },
        {
            id: 'sma',
            name: 'SMA',
            description: 'Simple Moving Average',
            category: 'Trend',
            params: { period: 20 },
            icon: Target,
            color: 'brand'
        },
        {
            id: 'ema',
            name: 'EMA',
            description: 'Exponential Moving Average',
            category: 'Trend',
            params: { period: 21 },
            icon: Target,
            color: 'blue'
        },
        {
            id: 'bollinger',
            name: 'Bollinger Bands',
            description: 'Volatility indicator',
            category: 'Volatility',
            params: { period: 20, deviation: 2 },
            icon: BarChart3,
            color: 'cyan'
        },
        {
            id: 'atr',
            name: 'ATR',
            description: 'Average True Range',
            category: 'Volatility',
            params: { period: 14 },
            icon: Zap,
            color: 'red'
        },
        {
            id: 'vwap',
            name: 'VWAP',
            description: 'Volume Weighted Average Price',
            category: 'Trend',
            params: { period: 1 },
            icon: BarChart3,
            color: 'indigo'
        }
    ];

    // Entry/Exit condition templates
    const conditionTemplates = [
        { id: 'cross_above', name: 'Crosses Above', description: 'When indicator crosses above value' },
        { id: 'cross_below', name: 'Crosses Below', description: 'When indicator crosses below value' },
        { id: 'greater_than', name: 'Greater Than', description: 'When indicator is above value' },
        { id: 'less_than', name: 'Less Than', description: 'When indicator is below value' },
        { id: 'between', name: 'Between Values', description: 'When indicator is between two values' }
    ];

    // Enhanced Intelligent Recommendation System with Progressive Guidance
    const getPersonalizedRecommendations = () => {
        const recommendations: Array<{
            type: string;
            message: string;
            priority: string;
            icon: any;
            actionable?: boolean;
            action?: () => void;
        }> = [];

        // Phase 1: Welcome guidance for new users
        if (selectedIndicators.length === 0) {
            recommendations.push({
                type: 'onboarding',
                message: '🎯 Welcome to EdgeToEquity! Start by selecting your first technical indicator. RSI is perfect for identifying overbought/oversold conditions.',
                priority: 'high',
                icon: Target,
                actionable: true,
                action: () => {
                    const rsiIndicator = availableIndicators.find(i => i.name === 'RSI');
                    if (rsiIndicator) addIndicator(rsiIndicator);
                }
            });
            return recommendations;
        }

        // Phase 2: After first indicator, suggest complementary indicators
        if (selectedIndicators.length > 0) {
            const hasMomentum = selectedIndicators.some(i => i.category === 'Momentum');
            const hasTrend = selectedIndicators.some(i => i.category === 'Trend');
            const hasVolatility = selectedIndicators.some(i => i.category === 'Volatility');

            // Smart complementary recommendations with enhanced context
            if (hasMomentum && !hasTrend) {
                recommendations.push({
                    type: 'indicator',
                    message: '📈 Perfect momentum setup! Add a trend indicator like EMA to confirm market direction and filter out false signals in choppy markets.',
                    priority: 'high',
                    icon: Target,
                    actionable: true,
                    action: () => {
                        const emaIndicator = availableIndicators.find(i => i.name === 'EMA');
                        if (emaIndicator) addIndicator(emaIndicator);
                    }
                });

                // Add pro tip
                recommendations.push({
                    type: 'tip',
                    message: '💡 Pro tip: Use EMA crossovers with momentum indicators for higher probability setups',
                    priority: 'medium',
                    icon: Lightbulb,
                    actionable: false
                });
            }

            if (hasTrend && !hasMomentum) {
                recommendations.push({
                    type: 'indicator',
                    message: '📊 Great trend setup! Add RSI or MACD to time your entries when the trend is strong and avoid entering at exhaustion points.',
                    priority: 'high',
                    icon: TrendingUp,
                    actionable: true,
                    action: () => {
                        const rsiIndicator = availableIndicators.find(i => i.name === 'RSI');
                        if (rsiIndicator) addIndicator(rsiIndicator);
                    }
                });

                // Add pro tip
                recommendations.push({
                    type: 'tip',
                    message: '💡 Pro tip: RSI divergences with trend indicators often signal major reversals',
                    priority: 'medium',
                    icon: Lightbulb,
                    actionable: false
                });
            }

            if ((hasMomentum || hasTrend) && !hasVolatility) {
                recommendations.push({
                    type: 'indicator',
                    message: '⚡ Add ATR for dynamic stop-loss placement - it automatically adapts to market volatility, giving you tighter stops in calm markets and wider stops in volatile conditions.',
                    priority: 'medium',
                    icon: Zap,
                    actionable: true,
                    action: () => {
                        const atrIndicator = availableIndicators.find(i => i.name === 'ATR');
                        if (atrIndicator) addIndicator(atrIndicator);
                    }
                });

                // Add pro tip
                recommendations.push({
                    type: 'tip',
                    message: '💡 Pro tip: ATR-based stops prevent premature exits during normal market noise',
                    priority: 'medium',
                    icon: Lightbulb,
                    actionable: false
                });
            }

            // Phase 3: Entry/Exit Rules Guidance
            if (selectedIndicators.length >= 2 && entryRules.length === 0) {
                recommendations.push({
                    type: 'rules',
                    message: '🎯 Define your entry conditions to specify exactly when to enter trades',
                    priority: 'high',
                    icon: Target,
                    actionable: false
                });
            }

            // Phase 4: After 2+ indicators, guide toward risk management
            if (selectedIndicators.length >= 2 && !riskSettings.stopLoss.enabled && !riskSettings.takeProfit.enabled) {
                recommendations.push({
                    type: 'risk',
                    message: '🛡️ Excellent indicator combo! Now protect your capital with Advanced Risk Management. Set your account size and risk per trade for precise position sizing.',
                    priority: 'high',
                    icon: Shield,
                    actionable: true,
                    action: () => {
                        setRiskSettings(prev => ({
                            ...prev,
                            stopLoss: { ...prev.stopLoss, enabled: true },
                            takeProfit: { ...prev.takeProfit, enabled: true }
                        }));
                    }
                });

                // Add pro tip
                recommendations.push({
                    type: 'tip',
                    message: '💡 Pro tip: 1-2% risk per trade ensures you can survive 20+ consecutive losses',
                    priority: 'medium',
                    icon: Lightbulb,
                    actionable: false
                });
            }

            // Phase 4: Advanced Risk Management Configuration
            if (selectedIndicators.length >= 2 && riskSettings.stopLoss.enabled) {
                if (riskSettings.instrument.type === 'futures') {
                    recommendations.push({
                        type: 'risk',
                        message: '📊 Configure your Futures instrument (ES, NQ, CL, etc.) and account size for precise contract calculations. Mini/Micro contracts available for smaller accounts.',
                        priority: 'medium',
                        icon: Calculator,
                        actionable: false
                    });

                    // Add pro tip for futures
                    recommendations.push({
                        type: 'tip',
                        message: '💡 Pro tip: Start with Micro contracts to test strategies with minimal capital risk',
                        priority: 'medium',
                        icon: Lightbulb,
                        actionable: false
                    });
                } else if (riskSettings.instrument.type === 'forex') {
                    recommendations.push({
                        type: 'risk',
                        message: '💱 Set your Forex pair (EUR/USD, GBP/USD, etc.) and lot size for accurate pip-based calculations. Standard/Mini/Micro lots available.',
                        priority: 'medium',
                        icon: Calculator,
                        actionable: false
                    });

                    // Add pro tip for forex
                    recommendations.push({
                        type: 'tip',
                        message: '💡 Pro tip: Use Mini lots (0.1) for precise position sizing with smaller accounts',
                        priority: 'medium',
                        icon: Lightbulb,
                        actionable: false
                    });
                }
            }

            // Phase 5: Strategy Optimization
            if (selectedIndicators.length >= 3 && riskSettings.stopLoss.enabled && riskSettings.accountSize > 0) {
                recommendations.push({
                    type: 'optimization',
                    message: '🎯 Your strategy is well-configured! Consider adding ATR for dynamic stop-loss placement',
                    priority: 'low',
                    icon: TrendingUp,
                    actionable: true,
                    action: () => {
                        const atrIndicator = availableIndicators.find(i => i.name === 'ATR');
                        if (atrIndicator) addIndicator(atrIndicator);
                    }
                });
            }

            // Phase 6: Strategy Completion
            if (selectedIndicators.length >= 2 && entryRules.length > 0 && riskSettings.stopLoss.enabled) {
                recommendations.push({
                    type: 'completion',
                    message: '🚀 Your strategy is ready! Click "Generate Strategy" to create your professional trading code with risk management built-in.',
                    priority: 'high',
                    icon: Rocket,
                    actionable: false
                });

                // Add confidence boost
                recommendations.push({
                    type: 'tip',
                    message: '💪 You\'ve built a complete strategy with indicators, rules, and risk management - you\'re ready to trade!',
                    priority: 'medium',
                    icon: Heart,
                    actionable: false
                });
            }
        }

        // Risk management validation
        if (riskSettings.maxRisk.value > 2) {
            recommendations.push({
                type: 'risk',
                message: 'Risk warning: 2%+ per trade is aggressive. Consider 1-1.5% for sustainable growth',
                priority: 'high',
                icon: Shield
            });
        }

        // Advanced user recommendations
        if (userBehavior.strategiesGenerated > 3) {
            recommendations.push({
                type: 'advanced',
                message: 'You\'re becoming a pro! Try multi-timeframe analysis for institutional-grade strategies',
                priority: 'medium',
                icon: Brain
            });
        }

        return recommendations;
    };

    const getEducationalTip = () => {
        const tips = [
            {
                id: 'rsi_basics',
                title: 'Understanding RSI',
                content: 'RSI measures momentum on a scale of 0-100. Values above 70 indicate overbought conditions, while values below 30 suggest oversold conditions. Consider using RSI divergences for stronger signals.',
                category: 'momentum',
                icon: TrendingUp
            },
            {
                id: 'risk_management',
                title: 'Risk Management Fundamentals',
                content: 'Never risk more than 1-2% of your capital per trade. Use stop-losses to limit downside and position sizing to control exposure. Remember: capital preservation is more important than maximizing returns.',
                category: 'risk',
                icon: Shield
            },
            {
                id: 'trend_following',
                title: 'Trend Following Strategies',
                content: 'Trend following works best in trending markets. Use moving averages to identify trend direction and momentum indicators to time entries. Combine with volume analysis for confirmation.',
                category: 'strategy',
                icon: Target
            },
            {
                id: 'volatility_importance',
                title: 'Why Volatility Matters',
                content: 'Volatility indicators like ATR help adapt your strategy to market conditions. Higher volatility requires wider stops, while lower volatility allows tighter risk management.',
                category: 'volatility',
                icon: Zap
            }
        ];

        // Return tip based on current context
        if (selectedIndicators.some(i => i.name === 'RSI')) {
            return tips.find(t => t.id === 'rsi_basics');
        }
        if (riskSettings.maxRisk.value > 2) {
            return tips.find(t => t.id === 'risk_management');
        }
        if (selectedIndicators.some(i => i.category === 'Trend')) {
            return tips.find(t => t.id === 'trend_following');
        }
        if (selectedIndicators.some(i => i.category === 'Volatility')) {
            return tips.find(t => t.id === 'volatility_importance');
        }

        return tips[0]; // Default tip
    };

    const generateStrategyInsights = () => {
        const insights: Array<{
            type: string;
            title: string;
            message: string;
            confidence: string;
            icon: any;
        }> = [];

        // Analyze indicator combinations
        if (selectedIndicators.length >= 2) {
            const hasMomentum = selectedIndicators.some(i => i.category === 'Momentum');
            const hasTrend = selectedIndicators.some(i => i.category === 'Trend');

            if (hasMomentum && hasTrend) {
                insights.push({
                    type: 'combination',
                    title: 'Strong Indicator Combination',
                    message: 'You\'ve combined momentum and trend indicators - this is a powerful approach for trend-following strategies.',
                    confidence: 'high',
                    icon: TrendingUp
                });
            }
        }

        // Analyze risk management
        if (riskSettings.stopLoss.enabled && riskSettings.takeProfit.enabled) {
            insights.push({
                type: 'risk',
                title: 'Complete Risk Management',
                message: 'Excellent! You have both stop-loss and take-profit configured. This provides clear exit points for your strategy.',
                confidence: 'high',
                icon: Shield
            });
        }

        // Analyze strategy complexity
        if (entryRules.length >= 2 || exitRules.length >= 2) {
            insights.push({
                type: 'complexity',
                title: 'Multi-Condition Strategy',
                message: 'Your strategy uses multiple conditions - this can reduce false signals but may also reduce trade frequency.',
                confidence: 'medium',
                icon: Brain
            });
        }

        return insights;
    };

    // Improved Strategy Confidence Calculation
    const calculateStrategyConfidence = () => {
        let confidence = 0;

        // Base confidence for having indicators (30%)
        if (selectedIndicators.length > 0) {
            confidence += 30;

            // Bonus for indicator diversity (20%)
            const categories = [...new Set(selectedIndicators.map(i => i.category))];
            if (categories.length >= 2) confidence += 10;
            if (categories.length >= 3) confidence += 10;
        }

        // Risk management completeness (25%)
        if (riskSettings.stopLoss.enabled) confidence += 10;
        if (riskSettings.takeProfit.enabled) confidence += 10;
        if (riskSettings.maxRisk.value <= 2) confidence += 5; // Conservative risk

        // Entry/Exit rules (25%)
        if (entryRules.length > 0) confidence += 15;
        if (exitRules.length > 0) confidence += 10;

        // Strategy complexity bonus (20%)
        if (entryRules.length >= 2 || exitRules.length >= 2) confidence += 10;
        if (selectedIndicators.length >= 3) confidence += 10;

        return Math.min(confidence, 95); // Cap at 95% - never 100% to encourage testing
    };

    // Task 1: EdgeBot Chat Functions
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const generateEdgeBotResponse = async (userMessage) => {
        // Simulate AI response generation
        setIsTyping(true);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        let response = '';

        // Context-aware responses based on user message and current strategy state
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('rsi') || lowerMessage.includes('relative strength')) {
            response = "RSI (Relative Strength Index) measures momentum on a scale of 0-100. Values above 70 indicate overbought conditions, while values below 30 suggest oversold conditions. In your strategy, RSI can help identify potential reversal points. Consider using RSI divergences for stronger signals!";
        } else if (lowerMessage.includes('risk') || lowerMessage.includes('stop loss')) {
            response = `Your current risk management setup looks ${riskSettings.stopLoss.enabled ? 'good' : 'incomplete'}. I recommend always using stop-losses to protect your capital. Your max risk per trade of ${riskSettings.maxRisk.value}% is ${riskSettings.maxRisk.value <= 2 ? 'conservative and good' : 'a bit high - consider reducing to 1-2%'}.`;
        } else if (lowerMessage.includes('confidence') || lowerMessage.includes('score')) {
            response = `Your strategy confidence is ${confidence}%. This score is based on indicator diversity, risk management completeness, and rule complexity. To improve it, consider adding more indicators from different categories or refining your entry/exit conditions.`;
        } else if (lowerMessage.includes('improve') || lowerMessage.includes('optimize')) {
            const recommendations = getPersonalizedRecommendations();
            if (recommendations.length > 0) {
                response = `Here are some ways to improve your strategy:\n\n${recommendations.map(rec => `• ${rec.message}`).join('\n')}\n\nWould you like me to explain any of these in detail?`;
            } else {
                response = "Your strategy looks well-balanced! Consider backtesting it to see how it performs in different market conditions.";
            }
        } else if (lowerMessage.includes('doctor') || lowerMessage.includes('debug')) {
            response = "The Strategy Doctor is perfect for catching issues and adding optimizations! It analyzes your code for common problems and suggests improvements. I highly recommend running it to make your strategy bulletproof.";
        } else if (lowerMessage.includes('indicator') || lowerMessage.includes('signal')) {
            response = `You've selected ${selectedIndicators.length} indicator${selectedIndicators.length !== 1 ? 's' : ''}: ${selectedIndicators.map(i => i.name).join(', ')}. Each indicator serves a specific purpose - would you like me to explain how they work together or suggest additional ones?`;
        } else {
            response = "I'm here to help with any aspect of your trading strategy! I can explain indicators, suggest improvements, help with risk management, or answer general trading questions. What specific area would you like to explore?";
        }

        setIsTyping(false);
        return response;
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;

        const userMessage = chatInput.trim();
        const newMessage = {
            id: Date.now(),
            type: 'user',
            message: userMessage,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, newMessage]);
        setChatInput('');

        // User Store Integration: Track EdgeBot interactions
        incrementConceptsLearned(); // Learning from EdgeBot
        addFocusTime(1); // Add 1 minute of focus time
        updateLearningStreak(); // Update learning streak

        // Generate bot response
        const botResponse = await generateEdgeBotResponse(userMessage);
        const botMessage = {
            id: Date.now() + 1,
            type: 'bot',
            message: botResponse,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, botMessage]);
    };

    const handleChatKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    const addIndicator = (indicator) => {
        if (!selectedIndicators.find(i => i.id === indicator.id)) {
            setSelectedIndicators([...selectedIndicators, { ...indicator, id: `${indicator.id}_${Date.now()}` }]);

            // Sprint 3: Track user behavior
            setUserBehavior(prev => ({
                ...prev,
                indicatorsUsed: [...prev.indicatorsUsed, indicator.name],
                timeSpent: prev.timeSpent + 1
            }));

            // Enhanced user behavior tracking for contextual guidance
            setUserBehavior(prev => ({
                ...prev,
                lastAction: 'indicator_added',
                lastIndicator: indicator.name
            }));

            // User Store Integration: Track indicator usage and focus time
            addFocusTime(1); // Add 1 minute of focus time
            updateLearningStreak(); // Update learning streak
        }
    };

    const removeIndicator = (indicatorId) => {
        const indicatorToRemove = selectedIndicators.find(ind => ind.id === indicatorId);
        setSelectedIndicators(selectedIndicators.filter(i => i.id !== indicatorId));

        // Remove rules for this indicator
        setEntryRules(prev => prev.filter(rule => rule.indicator !== indicatorToRemove.name));
        setExitRules(prev => prev.filter(rule => rule.indicator !== indicatorToRemove.name));

        // Remove from configured indicators
        setConfiguredIndicators(prev => {
            const newSet = new Set(prev);
            newSet.delete(indicatorToRemove.name);
            return newSet;
        });
    };

    const handleStrategyIntent = (intent) => {
        setStrategyIntent(intent);
        setOnboardingStep('building');

        // Clear any existing indicators, entry rules, and exit rules
        setSelectedIndicators([]);
        setEntryRules([]);
        setExitRules([]);

        // Reset risk settings to defaults
        setRiskSettings({
            stopLoss: { enabled: false, type: 'percentage', value: 2 },
            takeProfit: { enabled: false, type: 'ratio', value: 3 },
            positionSize: { type: 'percentage', value: 10 },
            maxRisk: { enabled: true, value: 1 },
            instrument: { type: 'futures', symbol: 'ES' },
            accountSize: 100000,
            lotSize: 'standard',
            stopLossPoints: 10
        });

        // User Store Integration: Track strategy intent selection
        incrementConceptsLearned(); // Learning about strategy types
        addFocusTime(2); // Add 2 minutes of focus time
        updateLearningStreak(); // Update learning streak

        // Add appropriate indicators based on intent
        switch (intent) {
            case 'momentum':
                const rsi = availableIndicators.find(i => i.name === 'RSI');
                if (rsi) {
                    setSelectedIndicators([{ ...rsi, id: `${rsi.id}_${Date.now()}` }]);
                }
                break;
            case 'trend':
                const ema = availableIndicators.find(i => i.name === 'EMA');
                if (ema) {
                    setSelectedIndicators([{ ...ema, id: `${ema.id}_${Date.now()}` }]);
                }
                break;
            case 'mean-reversion':
                const bb = availableIndicators.find(i => i.name === 'Bollinger Bands');
                if (bb) {
                    setSelectedIndicators([{ ...bb, id: `${bb.id}_${Date.now()}` }]);
                }
                break;
            case 'breakout':
                const atr = availableIndicators.find(i => i.name === 'ATR');
                if (atr) {
                    setSelectedIndicators([{ ...atr, id: `${atr.id}_${Date.now()}` }]);
                }
                break;
        }

        // Keep the strategy intent section visible - don't hide it
        // The section will show the selected strategy highlighted
    };

    const addEntryRule = () => {
        setEntryRules([...entryRules, {
            id: Date.now(),
            indicator: '',
            condition: '',
            value: '',
            enabled: true
        }]);

        // User Store Integration: Track rule creation
        incrementConceptsLearned(); // Learning about entry rules
        addFocusTime(1); // Add 1 minute of focus time
    };

    const addExitRule = () => {
        setExitRules([...exitRules, {
            id: Date.now(),
            indicator: '',
            condition: '',
            value: '',
            enabled: true
        }]);

        // User Store Integration: Track rule creation
        incrementConceptsLearned(); // Learning about exit rules
        addFocusTime(1); // Add 1 minute of focus time
    };

    const removeEntryRule = (ruleId) => {
        setEntryRules(entryRules.filter(rule => rule.id !== ruleId));
    };

    const removeExitRule = (ruleId) => {
        setExitRules(exitRules.filter(rule => rule.id !== ruleId));
    };

    const canGenerateStrategy = () => {
        if (activeTab === 'builder') {
            // Enable if user has selected indicators OR has configured risk management
            // This allows generation even with just indicators (rules can be added later)
            return selectedIndicators.length > 0;
        }
        if (activeTab === 'advanced') {
            return userInput.trim().length > 20;
        }
        return false;
    };

    const generateStrategy = async () => {
        setIsGenerating(true);
        setConfidence(0);

        // Build strategy description from visual builder
        const strategyDescription = buildStrategyDescription();

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock generated code
            const mockCode = generateMockCode(strategyDescription);
            setGeneratedCode(mockCode);

            // Calculate dynamic confidence based on strategy completeness
            const dynamicConfidence = calculateStrategyConfidence();
            setConfidence(dynamicConfidence);

            // Auto-transition to Generated Code tab
            setActiveTab('code');

            // Sprint 3: Track strategy generation and generate insights
            setUserBehavior(prev => ({
                ...prev,
                strategiesGenerated: prev.strategiesGenerated + 1,
                timeSpent: prev.timeSpent + 5
            }));

            // Generate strategy insights
            const insights = generateStrategyInsights();
            setStrategyInsights(insights);

            // User Store Integration: Track strategy generation
            incrementStrategiesBuilt(); // Increment strategies built counter
            addFocusTime(5); // Add 5 minutes of focus time for strategy generation
            updateLearningStreak(); // Update learning streak
            markStrategyDraft(); // Mark as draft strategy

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const buildStrategyDescription = () => {
        let desc = "Create a trading strategy with the following specifications:\n\n";

        desc += "**Indicators:**\n";
        selectedIndicators.forEach(ind => {
            desc += `- ${ind.name} (${ind.description})\n`;
        });

        desc += "\n**Entry Rules:**\n";
        entryRules.forEach(rule => {
            if (rule.indicator && rule.condition) {
                desc += `- Enter when ${rule.indicator} ${rule.condition} ${rule.value}\n`;
            }
        });

        desc += "\n**Exit Rules:**\n";
        exitRules.forEach(rule => {
            if (rule.indicator && rule.condition) {
                desc += `- Exit when ${rule.indicator} ${rule.condition} ${rule.value}\n`;
            }
        });

        desc += "\n**Risk Management:**\n";
        if (riskSettings.stopLoss.enabled) {
            desc += `- Stop Loss: ${riskSettings.stopLoss.value}% of entry price\n`;
        }
        if (riskSettings.takeProfit.enabled) {
            desc += `- Take Profit: ${riskSettings.takeProfit.value}:1 risk-reward ratio\n`;
        }
        desc += `- Position Size: ${riskSettings.positionSize.value}% of capital\n`;
        desc += `- Maximum Risk: ${riskSettings.maxRisk.value}% per trade\n`;

        return desc;
    };

    const generateMockCode = (description) => {
        // Enhanced code generation with educational comments
        const indicatorComments = {
            'RSI': '// RSI (Relative Strength Index) - Momentum Oscillator That Measures Speed And Magnitude Of Price Changes\n// Values below 30 indicate oversold conditions, above 70 indicate overbought',
            'EMA': '// EMA (Exponential Moving Average) - Trend-following indicator that gives more weight to recent prices\n// Price above EMA suggests uptrend, below suggests downtrend',
            'SMA': '// SMA (Simple Moving Average) - Basic trend indicator that averages prices over a period\n// Used to identify trend direction and support/resistance levels',
            'MACD': '// MACD (Moving Average Convergence Divergence) - Momentum and trend indicator\n// Signal line crossover indicates potential trend changes',
            'Bollinger Bands': '// Bollinger Bands - Volatility indicator showing price channels\n// Price touching upper/lower bands may indicate overbought/oversold conditions',
            'ATR': '// ATR (Average True Range) - Volatility indicator for dynamic stop losses\n// Higher ATR = more volatile market, wider stops needed',
            'VWAP': '// VWAP (Volume Weighted Average Price) - Institutional reference level\n// Price above VWAP suggests bullish momentum, below suggests bearish'
        };

        const strategyTips = {
            'momentum': '// MOMENTUM STRATEGY TIPS:\n// - Best in trending markets with clear directional moves\n// - Use volume confirmation for stronger signals\n// - Consider time-based filters to avoid low-liquidity periods',
            'trend': '// TREND STRATEGY TIPS:\n// - Works best in sustained directional markets\n// - Avoid choppy or sideways markets\n// - Use multiple timeframes for trend confirmation',
            'mean-reversion': '// MEAN REVERSION STRATEGY TIPS:\n// - Thrives in ranging markets with clear support/resistance\n// - Use volatility indicators for dynamic stops\n// - Avoid strong trending markets',
            'breakout': '// BREAKOUT STRATEGY TIPS:\n// - Needs volatility and volume for significant moves\n// - Focus on key support/resistance levels\n// - Use ATR for dynamic position sizing'
        };

        const riskManagementTips = `// RISK MANAGEMENT BEST PRACTICES:
// - Never risk more than 1-2% of account per trade
// - Use stop losses to limit downside risk
// - Consider position sizing based on volatility
// - Monitor correlation between multiple strategies`;

        let code = '';

        if (selectedPlatform === 'PineScript') {
            code = `// ===== EDGETOEQUITY STRATEGY GENERATOR =====
// Strategy: ${description}
// Generated: ${new Date().toLocaleDateString()}
// Platform: TradingView Pine Script v5

// === STRATEGY SETTINGS ===
strategy("EdgeToEquity Strategy", overlay=true, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

// === INDICATOR CALCULATIONS ===
${selectedIndicators.map(indicator => {
                const comment = indicatorComments[indicator.name] || `// ${indicator.name} indicator`;
                switch (indicator.name) {
                    case 'RSI':
                        return `${comment}\nrsi_value = ta.rsi(close, ${indicator.params.period || 14})`;
                    case 'EMA':
                        return `${comment}\nema_value = ta.ema(close, ${indicator.params.period || 20})`;
                    case 'SMA':
                        return `${comment}\nsma_value = ta.sma(close, ${indicator.params.period || 20})`;
                    case 'MACD':
                        return `${comment}\n[macd_line, signal_line, hist] = ta.macd(close, 12, 26, 9)`;
                    case 'Bollinger Bands':
                        return `${comment}\n[bb_upper, bb_middle, bb_lower] = ta.bb(close, ${indicator.params.period || 20}, 2)`;
                    case 'ATR':
                        return `${comment}\natr_value = ta.atr(${indicator.params.period || 14})`;
                    case 'VWAP':
                        return `${comment}\nvwap_value = ta.vwap(hlc3)`;
                    default:
                        return `// ${indicator.name} calculation\n${indicator.name.toLowerCase()}_value = close`;
                }
            }).join('\n')}

// === ENTRY CONDITIONS ===
${entryRules.length > 0 ? entryRules.map((rule, index) => {
                return `// Entry Rule ${index + 1}: ${rule.description || 'Custom condition'}\nentry_condition_${index + 1} = ${rule.condition || 'true'}`;
            }).join('\n') : '// No entry rules defined - add conditions in Visual Builder'}

// Combine entry conditions
long_condition = ${entryRules.length > 0 ? entryRules.map((_, index) => `entry_condition_${index + 1}`).join(' and ') : 'false'}

// === EXIT CONDITIONS ===
${exitRules.length > 0 ? exitRules.map((rule, index) => {
                return `// Exit Rule ${index + 1}: ${rule.description || 'Custom condition'}\nexit_condition_${index + 1} = ${rule.condition || 'false'}`;
            }).join('\n') : '// No exit rules defined - add conditions in Visual Builder'}

// Combine exit conditions
exit_condition = ${exitRules.length > 0 ? exitRules.map((_, index) => `exit_condition_${index + 1}`).join(' or ') : 'false'}

// === RISK MANAGEMENT ===
${riskManagementTips}

// Position sizing based on risk settings
risk_per_trade = ${riskSettings.riskPerTrade || 1} / 100
${riskSettings.stopLoss.enabled ? `stop_loss_pct = ${riskSettings.stopLoss.value} / 100` : '// Stop loss disabled - consider enabling for risk management'}
${riskSettings.takeProfit.enabled ? `take_profit_pct = ${riskSettings.takeProfit.value} / 100` : '// Take profit disabled - consider setting profit targets'}

// === STRATEGY EXECUTION ===
if long_condition and strategy.position_size == 0
    strategy.entry("Long", strategy.long)
    ${riskSettings.stopLoss.enabled ? 'strategy.exit("Stop Loss", "Long", stop=close * (1 - stop_loss_pct))' : '// No stop loss - high risk!'}
    ${riskSettings.takeProfit.enabled ? 'strategy.exit("Take Profit", "Long", limit=close * (1 + take_profit_pct))' : '// No take profit - consider setting targets'}

if exit_condition and strategy.position_size > 0
    strategy.close("Long", comment="Exit Signal")

// === VISUALIZATION ===
// Plot indicators for visual reference
${selectedIndicators.map(indicator => {
                switch (indicator.name) {
                    case 'RSI':
                        return 'plot(rsi_value, "RSI", color=color.blue)';
                    case 'EMA':
                        return 'plot(ema_value, "EMA", color=color.orange)';
                    case 'SMA':
                        return 'plot(sma_value, "SMA", color=color.green)';
                    case 'MACD':
                        return 'plot(macd_line, "MACD", color=color.blue)\nplot(signal_line, "Signal", color=color.red)';
                    case 'Bollinger Bands':
                        return 'plot(bb_upper, "BB Upper", color=color.gray)\nplot(bb_lower, "BB Lower", color=color.gray)';
                    case 'VWAP':
                        return 'plot(vwap_value, "VWAP", color=color.green)';
                    default:
                        return `// plot(${indicator.name.toLowerCase()}_value, "${indicator.name}", color=color.blue)`;
                }
            }).join('\n')}

// === STRATEGY TIPS ===
${strategyIntent ? strategyTips[strategyIntent].replace(/\n/g, '\n            ') : '// Custom strategy - test thoroughly before live trading'}

// === IMPORTANT NOTES ===
// This is a generated strategy - always test thoroughly before live trading
// Consider market conditions and adjust parameters as needed
// Monitor performance and adjust risk management settings
// Never risk more than you can afford to lose`;
        } else {
            // NinjaScript code
            code = `// ===== EDGETOEQUITY STRATEGY GENERATOR =====
// Strategy: ${description}
// Generated: ${new Date().toLocaleDateString()}
// Platform: NinjaTrader 8 NinjaScript

#region Using declarations
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Xml.Serialization;
using NinjaTrader.Cbi;
using NinjaTrader.Gui;
using NinjaTrader.Gui.Chart;
using NinjaTrader.Gui.SuperDom;
using NinjaTrader.Gui.Tools;
using NinjaTrader.Data;
using NinjaTrader.NinjaScript;
using NinjaTrader.Core.FloatingPoint;
using NinjaTrader.NinjaScript.DrawingTools;
#endregion

namespace NinjaTrader.NinjaScript.Strategies
{
    public class EdgeToEquityStrategy : Strategy
    {
        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Description = "EdgeToEquity Generated Strategy";
                Name = "EdgeToEquityStrategy";
                Calculate = Calculate.OnBarClose;
                EntriesPerDirection = 1;
                EntryHandling = EntryHandling.AllEntries;
                IsExitOnSessionCloseStrategy = true;
                ExitOnSessionCloseSeconds = 30;
                IsFillLimitOnTouch = false;
                MaximumBarsLookBack = MaximumBarsLookBack.TwoHundredFiftySix;
                OrderFillResolution = OrderFillResolution.Standard;
                Slippage = 0;
                StartBehavior = StartBehavior.WaitUntilFlat;
                TimeInForce = TimeInForce.Gtc;
                TraceOrders = false;
                RealtimeErrorHandling = RealtimeErrorHandling.StopCancelClose;
                StopTargetHandling = StopTargetHandling.PerEntryExecution;
                BarsRequiredToTrade = 20;
            }
        }

        protected override void OnBarUpdate()
        {
            // === INDICATOR CALCULATIONS ===
            ${selectedIndicators.map(indicator => {
                const comment = indicatorComments[indicator.name] || `// ${indicator.name} indicator`;
                switch (indicator.name) {
                    case 'RSI':
                        return `${comment}\ndouble rsi = RSI(${indicator.params.period || 14}, 1)[0];`;
                    case 'EMA':
                        return `${comment}\ndouble ema = EMA(${indicator.params.period || 20})[0];`;
                    case 'SMA':
                        return `${comment}\ndouble sma = SMA(${indicator.params.period || 20})[0];`;
                    case 'MACD':
                        return `${comment}\ndouble macd = MACD(12, 26, 9)[0];\ndouble signal = MACD(12, 26, 9)[1];`;
                    case 'ATR':
                        return `${comment}\ndouble atr = ATR(${indicator.params.period || 14})[0];`;
                    default:
                        return `// ${indicator.name} calculation\ndouble ${indicator.name.toLowerCase()} = Close[0];`;
                }
            }).join('\n            ')}

            // === ENTRY CONDITIONS ===
            ${entryRules.length > 0 ? entryRules.map((rule, index) => {
                return `// Entry Rule ${index + 1}: ${rule.description || 'Custom condition'}\n            bool entry${index + 1} = ${rule.condition || 'true'};`;
            }).join('\n            ') : '// No entry rules defined - add conditions in Visual Builder'}

            // Combine entry conditions
            bool longCondition = ${entryRules.length > 0 ? entryRules.map((_, index) => `entry${index + 1}`).join(' && ') : 'false'};

            // === STRATEGY EXECUTION ===
            if (longCondition && Position.MarketPosition == MarketPosition.Flat)
            {
                EnterLong();
            }

            // === RISK MANAGEMENT ===
            ${riskManagementTips.replace(/\n/g, '\n            ')}

            // === STRATEGY TIPS ===
            ${strategyIntent ? strategyTips[strategyIntent].replace(/\n/g, '\n            ') : '// Custom strategy - test thoroughly before live trading'}

            // === IMPORTANT NOTES ===
            // This is a generated strategy - always test thoroughly before live trading
            // Consider market conditions and adjust parameters as needed
            // Monitor performance and adjust risk management settings
            // Never risk more than you can afford to lose
        }
    }
}`;
        }

        return code;
    };

    // Simple strategy validation for V1 MVP
    const validateStrategy = () => {
        const issues = [];
        const warnings = [];
        const suggestions = [];

        // Check for basic requirements
        if (selectedIndicators.length === 0) {
            issues.push('No indicators selected - add at least one indicator');
        }

        if (entryRules.length === 0) {
            issues.push('No entry rules defined - add entry conditions');
        }

        if (exitRules.length === 0) {
            warnings.push('No exit rules defined - consider adding exit conditions');
        }

        if (!riskSettings.stopLoss.enabled) {
            warnings.push('Stop loss disabled - consider enabling for risk management');
        }

        if (!riskSettings.takeProfit.enabled) {
            suggestions.push('Take profit not set - consider adding profit targets');
        }

        // Check indicator combinations
        if (selectedIndicators.length > 4) {
            warnings.push('Many indicators selected - consider simplifying for cleaner signals');
        }

        if (selectedIndicators.length === 1) {
            suggestions.push('Single indicator - consider adding confirmation indicators');
        }

        // Check for complementary indicators
        const hasMomentum = selectedIndicators.some(i => i.name === 'RSI' || i.name === 'MACD');
        const hasTrend = selectedIndicators.some(i => i.name === 'EMA' || i.name === 'SMA');
        const hasVolatility = selectedIndicators.some(i => i.name === 'ATR' || i.name === 'Bollinger Bands');

        if (hasMomentum && !hasTrend) {
            suggestions.push('Momentum indicators work well with trend confirmation (EMA/SMA)');
        }

        if (hasTrend && !hasVolatility) {
            suggestions.push('Consider adding volatility indicator (ATR) for dynamic stops');
        }

        // Check risk settings
        if (riskSettings.riskPerTrade > 2) {
            warnings.push('High risk per trade (>2%) - consider reducing to 1-2%');
        }

        return {
            issues,
            warnings,
            suggestions,
            isValid: issues.length === 0,
            hasWarnings: warnings.length > 0
        };
    };

    return (
        <div className="w-full h-full">
            {/* Strategy Builder Interface */}
            <div className="flex flex-col h-full space-y-6">

                {/* Strategy Intent Onboarding */}
                {!generatedCode && (onboardingStep === 'intent' || strategyIntent) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-2xl border ${isDarkMode
                            ? 'bg-slate-800/50 border-slate-700'
                            : 'bg-white border-slate-200'}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                <Lightbulb className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                            <div>
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    What Type of Strategy Interests You?
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Let me help you build the perfect strategy for your trading style.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                {
                                    id: 'momentum',
                                    title: 'Momentum Strategy',
                                    description: 'Capture price momentum with RSI and trend confirmation',
                                    icon: TrendingUp,
                                    color: 'emerald'
                                },
                                {
                                    id: 'trend',
                                    title: 'Trend Following',
                                    description: 'Follow established trends with moving averages',
                                    icon: BarChart3,
                                    color: 'blue'
                                },
                                {
                                    id: 'mean-reversion',
                                    title: 'Mean Reversion',
                                    description: 'Trade price reversals with Bollinger Bands',
                                    icon: RotateCcw,
                                    color: 'amber'
                                },
                                {
                                    id: 'breakout',
                                    title: 'Breakout Strategy',
                                    description: 'Trade breakouts with volume and ATR',
                                    icon: Rocket,
                                    color: 'brand'
                                }
                            ].map((strategy) => {
                                const IconComponent = strategy.icon;
                                const isSelected = strategyIntent === strategy.id;

                                return (
                                    <motion.button
                                        key={strategy.id}
                                        onClick={() => handleStrategyIntent(strategy.id)}
                                        className={`p-4 rounded-xl border transition-all relative ${isSelected
                                            ? `${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'}`
                                            : `${isDarkMode ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'
                                                    }`}
                                            >
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </motion.div>
                                        )}

                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`p-2 rounded-lg ${isSelected
                                                ? isDarkMode ? 'bg-emerald-500/30' : 'bg-emerald-100'
                                                : isDarkMode ? 'bg-slate-600/50' : 'bg-gray-100'
                                                }`}>
                                                <IconComponent className={`w-5 h-5 ${isSelected
                                                    ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                                    : isDarkMode ? 'text-slate-400' : 'text-gray-600'
                                                    }`} />
                                            </div>
                                        </div>

                                        <h4 className={`font-semibold mb-2 text-left ${isSelected
                                            ? isDarkMode ? 'text-emerald-300' : 'text-emerald-800'
                                            : isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {strategy.title}
                                        </h4>

                                        <p className={`text-sm text-left ${isSelected
                                            ? isDarkMode ? 'text-emerald-200' : 'text-emerald-700'
                                            : isDarkMode ? 'text-slate-400' : 'text-gray-600'
                                            }`}>
                                            {strategy.description}
                                        </p>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Header with Platform Selection */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="p-3 rounded-xl bg-emerald-500/20"
                            >
                                <Sparkles className="w-8 h-8 text-emerald-500" />
                            </motion.div>
                            <div>
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Strategy Architect
                                </h2>
                                <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Build Professional Trading Strategies Visually
                                </p>
                            </div>
                        </div>

                        {/* Platform Selection & Help */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Platform:</span>
                                <div className="relative">
                                    <select
                                        value={selectedPlatform}
                                        onChange={(e) => setSelectedPlatform(e.target.value)}
                                        className={`px-3 py-2 pr-8 rounded-lg border appearance-none bg-none ${isDarkMode
                                            ? 'bg-slate-700 border-slate-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'}`}
                                        style={{
                                            backgroundImage: 'none',
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'none'
                                        }}
                                    >
                                        <option value="PineScript">TradingView (PineScript)</option>
                                        <option value="NinjaScript">NinjaTrader (NinjaScript)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <svg
                                            className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400/60' : 'text-emerald-600/60'}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Help Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowHelpPanel(!showHelpPanel)}
                                className={`p-2 rounded-lg transition-all ${isDarkMode
                                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30'
                                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300'}`}
                                title="Strategy Guide"
                            >
                                <HelpCircle className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2">
                        {[
                            { id: 'builder', name: 'Visual Builder', icon: Settings },
                            { id: 'advanced', name: 'Advanced Setup', icon: Brain },
                            { id: 'code', name: 'Generated Code', icon: Code }
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? isDarkMode
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    : isDarkMode
                                        ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.name}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Strategy Development Progress
                        </h3>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            {(() => {
                                if (activeTab === 'builder') {
                                    if (selectedIndicators.length > 0 && (entryRules.length > 0 || exitRules.length > 0)) return '75%';
                                    if (selectedIndicators.length > 0) return '40%';
                                    return '0%';
                                }
                                if (activeTab === 'advanced') {
                                    if (userInput.trim().length > 20) return '75%';
                                    return '0%';
                                }
                                if (activeTab === 'code') {
                                    if (generatedCode && generatedCode.trim().length > 0) return '100%';
                                    return '0%';
                                }
                                return '0%';
                            })()} Complete
                        </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                                width: (() => {
                                    if (activeTab === 'builder') {
                                        if (selectedIndicators.length > 0 && (entryRules.length > 0 || exitRules.length > 0)) return '75%';
                                        if (selectedIndicators.length > 0) return '40%';
                                        return '0%';
                                    }
                                    if (activeTab === 'advanced') {
                                        if (userInput.trim().length > 20) return '75%';
                                        return '0%';
                                    }
                                    if (activeTab === 'code') {
                                        if (generatedCode && generatedCode.trim().length > 0) return '100%';
                                        return '0%';
                                    }
                                    return '0%';
                                })()
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>Strategy Setup</span>
                        <span>Code Generation</span>
                        <span>Ready For Testing</span>
                    </div>
                </div>



                {/* Phase 1: Intelligent Help System */}
                <AnimatePresence>
                    {showHelpPanel && (
                        <motion.div
                            initial={{ opacity: 0, x: -300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            className={`fixed left-4 top-20 w-80 h-96 z-40 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl border shadow-2xl ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
                        >
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        📚 Strategy Guide
                                    </h3>
                                    <button
                                        onClick={() => setShowHelpPanel(false)}
                                        className={`p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 overflow-y-auto h-80">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                            📊 Indicators
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                                <div className="font-medium">RSI (Relative Strength Index)</div>
                                                <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                                    Measures momentum on a scale of 0-100. Above 70 = overbought, below 30 = oversold.
                                                </div>
                                            </div>
                                            <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                                <div className="font-medium">EMA (Exponential Moving Average)</div>
                                                <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                                    Trend indicator that gives more weight to recent prices. Shows market direction.
                                                </div>
                                            </div>
                                            <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                                <div className="font-medium">ATR (Average True Range)</div>
                                                <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                                    Volatility indicator. Helps set dynamic stop-losses based on market conditions.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                            🎯 Entry & Exit Rules
                                        </h4>
                                        <div className={`p-2 rounded text-sm ${isDarkMode ? 'bg-slate-700/50 text-slate-300' : 'bg-gray-50 text-gray-700'}`}>
                                            Define when to enter and exit trades. Combine indicators for stronger signals. Use multiple conditions to reduce false signals.
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                            🛡️ Risk Management
                                        </h4>
                                        <div className={`p-2 rounded text-sm ${isDarkMode ? 'bg-slate-700/50 text-slate-300' : 'bg-gray-50 text-gray-700'}`}>
                                            Set stop-losses to limit losses, position sizing to control exposure, and risk percentage per trade (1-2% recommended).
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>



                {/* Floating Action Button for Quick Help */}
                {/*
                <AnimatePresence>
                    {!showHelpPanel && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowHelpPanel(true)}
                            className={`fixed bottom-6 right-6 z-30 p-4 rounded-full shadow-lg transition-all ${isDarkMode
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} text-white`}
                            title="Quick Help"
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <HelpCircle className="w-6 h-6" />
                            </motion.div>
                        </motion.button>
                    )}
                </AnimatePresence>
                */}

                {/* Success Notification */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -50, scale: 0.8 }}
                            className="fixed top-6 right-6 z-50"
                        >
                            <div className={`p-4 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-emerald-900/90 border border-emerald-700' : 'bg-emerald-50 border border-emerald-200'}`}>
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="p-2 rounded-full bg-emerald-500"
                                    >
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </motion.div>
                                    <div>
                                        <h4 className={`font-semibold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                            Strategy Generated!
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                                            Your trading strategy is ready for testing
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>



                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === 'builder' && (
                        <VisualBuilder
                            selectedIndicators={selectedIndicators}
                            availableIndicators={availableIndicators}
                            addIndicator={addIndicator}
                            removeIndicator={removeIndicator}
                            entryRules={entryRules}
                            exitRules={exitRules}
                            addEntryRule={addEntryRule}
                            addExitRule={addExitRule}
                            removeEntryRule={removeEntryRule}
                            removeExitRule={removeExitRule}
                            setEntryRules={setEntryRules}
                            setExitRules={setExitRules}
                            riskSettings={riskSettings}
                            setRiskSettings={setRiskSettings}
                            conditionTemplates={conditionTemplates}
                            isDarkMode={isDarkMode}
                            calculatePositionSize={calculatePositionSize}
                            instrumentData={instrumentData}
                            onboardingStep={onboardingStep}
                            strategyIntent={strategyIntent}
                            handleStrategyIntent={handleStrategyIntent}
                            templateTab={templateTab}
                            setTemplateTab={setTemplateTab}
                            configuredIndicators={configuredIndicators}
                            setConfiguredIndicators={setConfiguredIndicators}
                        />
                    )}

                    {activeTab === 'advanced' && (
                        <AdvancedSetup
                            userInput={userInput}
                            setUserInput={setUserInput}
                            textareaRef={textareaRef}
                            isDarkMode={isDarkMode}
                        />
                    )}

                    {activeTab === 'code' && (
                        <CodeOutput
                            generatedCode={generatedCode}
                            confidence={confidence}
                            isGenerating={isGenerating}
                            selectedPlatform={selectedPlatform}
                            isDarkMode={isDarkMode}
                            strategyInsights={strategyInsights}
                            showEdgeBotChat={showEdgeBotChat}
                            setShowEdgeBotChat={setShowEdgeBotChat}
                            chatMessages={chatMessages}
                            chatInput={chatInput}
                            setChatInput={setChatInput}
                            isTyping={isTyping}
                            sendChatMessage={sendChatMessage}
                            handleChatKeyPress={handleChatKeyPress}
                            chatEndRef={chatEndRef}
                            selectedIndicators={selectedIndicators}
                            entryRules={entryRules}
                            exitRules={exitRules}
                            riskSettings={riskSettings}
                            activeTab={activeTab}
                            onboardingStep={onboardingStep}
                            strategyIntent={strategyIntent}
                            addIndicator={addIndicator}
                            availableIndicators={availableIndicators}
                            setActiveTab={setActiveTab}
                            generateStrategy={generateStrategy}
                            handleStrategyIntent={handleStrategyIntent}
                            validateStrategy={validateStrategy}
                            setWorkspaceTab={navigateToTab}
                        />
                    )}
                </div>

                {/* Generate Button */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${confidence >= 80
                                ? isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                : confidence >= 60
                                    ? isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                                    : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {confidence > 0 ? `${confidence}% Ready` :
                                    activeTab === 'builder' ? 'Select indicators & rules' :
                                        'Describe your strategy'}
                            </div>
                            {confidence > 0 && (
                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Strategy analysis complete
                                </span>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={generateStrategy}
                            disabled={isGenerating || !canGenerateStrategy()}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${isGenerating || !canGenerateStrategy()
                                ? isDarkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : isDarkMode ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-4 h-4" />
                                    {activeTab === 'builder' ? 'Generate Strategy' : 'Generate Code'}
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Enhanced Success Animation */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            className={`p-8 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} text-center shadow-2xl`}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 0.5, repeat: 2 }}
                            >
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            </motion.div>
                            <motion.h3
                                className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Strategy Generated! 🚀
                            </motion.h3>
                            <motion.p
                                className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Your professional trading strategy is ready for testing
                            </motion.p>
                            <motion.div
                                className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Confidence: {confidence}%</span>
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced EdgeBot Intelligence Panel */}
            {/* Removed - Analysis panels moved to Strategy Doctor and BacktestModule */}

            {/* Enhanced EdgeBot Intelligence Panel for Code Tab */}
            {/* Removed - Analysis panels moved to Strategy Doctor and BacktestModule */}
        </div>
    );
};

// Visual Builder Component
const VisualBuilder = ({
    selectedIndicators,
    availableIndicators,
    addIndicator,
    removeIndicator,
    entryRules,
    exitRules,
    addEntryRule,
    addExitRule,
    removeEntryRule,
    removeExitRule,
    setEntryRules,
    setExitRules,
    riskSettings,
    setRiskSettings,
    conditionTemplates,
    isDarkMode,
    calculatePositionSize,
    instrumentData,
    onboardingStep,
    strategyIntent,
    handleStrategyIntent,
    templateTab,
    setTemplateTab,
    configuredIndicators,
    setConfiguredIndicators
}) => {
    // Generate rule templates based on selected indicators
    const getRuleTemplates = () => {
        const templates = [];

        // RSI-based templates
        if (selectedIndicators.some(i => i.name === 'RSI')) {
            templates.push({
                name: 'RSI Mean Reversion',
                description: 'Buy when RSI is oversold (below 30), Sell when RSI is overbought (above 70)',
                entryRules: [
                    { id: Date.now(), indicator: 'RSI', condition: 'Less Than', value: '30' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'RSI', condition: 'Greater Than', value: '70' }
                ]
            });

            templates.push({
                name: 'RSI Momentum Strategy',
                description: 'Buy when RSI crosses above 50 (bullish momentum), Sell when RSI crosses below 50 (bearish momentum)',
                entryRules: [
                    { id: Date.now(), indicator: 'RSI', condition: 'Crosses Above', value: '50' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'RSI', condition: 'Crosses Below', value: '50' }
                ]
            });

            templates.push({
                name: 'Conservative RSI',
                description: 'Buy at RSI 25 (deeper oversold), Sell at RSI 75 (higher overbought) - Lower frequency, higher quality signals',
                entryRules: [
                    { id: Date.now(), indicator: 'RSI', condition: 'Less Than', value: '25' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'RSI', condition: 'Greater Than', value: '75' }
                ]
            });
        }

        // MACD-based templates
        if (selectedIndicators.some(i => i.name === 'MACD')) {
            templates.push({
                name: 'MACD Crossover Strategy',
                description: 'Buy when MACD line crosses above signal line (bullish), Sell when MACD crosses below signal line (bearish)',
                entryRules: [
                    { id: Date.now(), indicator: 'MACD', condition: 'Crosses Above', value: 'signal' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'MACD', condition: 'Crosses Below', value: 'signal' }
                ]
            });

            templates.push({
                name: 'MACD Zero Line Strategy',
                description: 'Buy when MACD crosses above zero line (bullish momentum), Sell when MACD crosses below zero line (bearish momentum)',
                entryRules: [
                    { id: Date.now(), indicator: 'MACD', condition: 'Crosses Above', value: '0' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'MACD', condition: 'Crosses Below', value: '0' }
                ]
            });
        }

        // SMA-based templates
        if (selectedIndicators.some(i => i.name === 'SMA')) {
            templates.push({
                name: 'SMA Trend Following',
                description: 'Buy when price is above SMA (uptrend), Sell when price crosses below SMA (trend reversal)',
                entryRules: [
                    { id: Date.now(), indicator: 'SMA', condition: 'Greater Than', value: 'price' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'SMA', condition: 'Crosses Below', value: 'price' }
                ]
            });

            templates.push({
                name: 'SMA Pullback Strategy',
                description: 'Buy when price pulls back to SMA support, Sell when price breaks below SMA support',
                entryRules: [
                    { id: Date.now(), indicator: 'SMA', condition: 'Crosses Above', value: 'price' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'SMA', condition: 'Crosses Below', value: 'price' }
                ]
            });
        }

        // EMA-based templates
        if (selectedIndicators.some(i => i.name === 'EMA')) {
            templates.push({
                name: 'EMA Trend Following',
                description: 'Buy when price is above EMA (uptrend), Sell when price crosses below EMA (trend reversal)',
                entryRules: [
                    { id: Date.now(), indicator: 'EMA', condition: 'Greater Than', value: 'price' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'EMA', condition: 'Crosses Below', value: 'price' }
                ]
            });

            templates.push({
                name: 'EMA Momentum Strategy',
                description: 'Buy when price bounces off EMA support, Sell when price breaks below EMA support',
                entryRules: [
                    { id: Date.now(), indicator: 'EMA', condition: 'Crosses Above', value: 'price' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'EMA', condition: 'Crosses Below', value: 'price' }
                ]
            });
        }

        // Bollinger Bands-based templates
        if (selectedIndicators.some(i => i.name === 'Bollinger Bands')) {
            templates.push({
                name: 'Bollinger Bands Mean Reversion',
                description: 'Buy when price touches lower band (oversold), Sell when price reaches upper band (overbought)',
                entryRules: [
                    { id: Date.now(), indicator: 'Bollinger Bands', condition: 'Less Than', value: 'lower' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'Bollinger Bands', condition: 'Greater Than', value: 'upper' }
                ]
            });

            templates.push({
                name: 'Bollinger Bands Breakout',
                description: 'Buy when price breaks above upper band (bullish breakout), Sell when price breaks below lower band (bearish breakout)',
                entryRules: [
                    { id: Date.now(), indicator: 'Bollinger Bands', condition: 'Greater Than', value: 'upper' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'Bollinger Bands', condition: 'Less Than', value: 'lower' }
                ]
            });
        }

        // VWAP-based templates
        if (selectedIndicators.some(i => i.name === 'VWAP')) {
            templates.push({
                name: 'VWAP Institutional Entry',
                description: 'Buy when price pulls back to VWAP support, Sell when price breaks below VWAP support',
                entryRules: [
                    { id: Date.now(), indicator: 'VWAP', condition: 'Crosses Above', value: 'price' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'VWAP', condition: 'Crosses Below', value: 'price' }
                ]
            });

            templates.push({
                name: 'VWAP Trend Following',
                description: 'Buy when price is above VWAP (bullish), Sell when price crosses below VWAP (bearish)',
                entryRules: [
                    { id: Date.now(), indicator: 'VWAP', condition: 'Greater Than', value: 'price' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'VWAP', condition: 'Crosses Below', value: 'price' }
                ]
            });
        }

        // ATR-based templates
        if (selectedIndicators.some(i => i.name === 'ATR')) {
            templates.push({
                name: 'ATR Breakout Strategy',
                description: 'Buy when volatility increases (ATR > 1.5), Sell when volatility decreases (ATR < 0.5)',
                entryRules: [
                    { id: Date.now(), indicator: 'ATR', condition: 'Greater Than', value: '1.5' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'ATR', condition: 'Less Than', value: '0.5' }
                ]
            });

            templates.push({
                name: 'ATR Volatility Filter',
                description: 'Buy when ATR is high (volatile market), Sell when ATR is low (low volatility)',
                entryRules: [
                    { id: Date.now(), indicator: 'ATR', condition: 'Greater Than', value: '2.0' }
                ],
                exitRules: [
                    { id: Date.now() + 1, indicator: 'ATR', condition: 'Less Than', value: '1.0' }
                ]
            });
        }

        // Multi-indicator templates
        if (selectedIndicators.length >= 2) {
            const hasRSI = selectedIndicators.some(i => i.name === 'RSI');
            const hasEMA = selectedIndicators.some(i => i.name === 'EMA');
            const hasVWAP = selectedIndicators.some(i => i.name === 'VWAP');
            const hasATR = selectedIndicators.some(i => i.name === 'ATR');
            const hasMACD = selectedIndicators.some(i => i.name === 'MACD');
            const hasBollinger = selectedIndicators.some(i => i.name === 'Bollinger Bands');

            if (hasRSI && hasEMA) {
                templates.push({
                    name: 'RSI + EMA Momentum',
                    description: 'RSI finds oversold entry points, EMA confirms trend direction - Buy when RSI < 30 and price > EMA',
                    entryRules: [
                        { id: Date.now(), indicator: 'RSI', condition: 'Less Than', value: '30' },
                        { id: Date.now() + 1, indicator: 'EMA', condition: 'Greater Than', value: 'price' }
                    ],
                    exitRules: [
                        { id: Date.now() + 2, indicator: 'RSI', condition: 'Greater Than', value: '70' }
                    ]
                });
            }

            if (hasRSI && hasMACD) {
                templates.push({
                    name: 'RSI + MACD Confirmation',
                    description: 'RSI identifies oversold conditions, MACD confirms momentum - Buy when RSI < 30 and MACD crosses above signal',
                    entryRules: [
                        { id: Date.now(), indicator: 'RSI', condition: 'Less Than', value: '30' },
                        { id: Date.now() + 1, indicator: 'MACD', condition: 'Crosses Above', value: 'signal' }
                    ],
                    exitRules: [
                        { id: Date.now() + 2, indicator: 'RSI', condition: 'Greater Than', value: '70' }
                    ]
                });
            }

            if (hasVWAP && hasATR) {
                templates.push({
                    name: 'VWAP + ATR Professional',
                    description: 'VWAP for entry timing, ATR for dynamic stops - Buy at VWAP support, exit on high volatility',
                    entryRules: [
                        { id: Date.now(), indicator: 'VWAP', condition: 'Crosses Above', value: 'price' }
                    ],
                    exitRules: [
                        { id: Date.now() + 1, indicator: 'ATR', condition: 'Greater Than', value: '2.0' }
                    ]
                });
            }

            if (hasBollinger && hasRSI) {
                templates.push({
                    name: 'Bollinger + RSI Mean Reversion',
                    description: 'Bollinger Bands identify extremes, RSI confirms reversal - Buy at lower band with RSI < 30',
                    entryRules: [
                        { id: Date.now(), indicator: 'Bollinger Bands', condition: 'Less Than', value: 'lower' },
                        { id: Date.now() + 1, indicator: 'RSI', condition: 'Less Than', value: '30' }
                    ],
                    exitRules: [
                        { id: Date.now() + 2, indicator: 'Bollinger Bands', condition: 'Greater Than', value: 'upper' }
                    ]
                });
            }
        }

        return templates;
    };

    // Get custom strategies (user's own strategies)
    const getCustomStrategies = () => {
        return [
            {
                name: 'Custom Strategy 1',
                description: 'Your first custom strategy - Buy when RSI < 30 and MACD bullish, Sell when RSI > 70',
                entryRules: [
                    { id: Date.now(), indicator: 'RSI', condition: 'Less Than', value: '30' },
                    { id: Date.now() + 1, indicator: 'MACD', condition: 'Crosses Above', value: 'signal' }
                ],
                exitRules: [
                    { id: Date.now() + 2, indicator: 'RSI', condition: 'Greater Than', value: '70' }
                ],
                requiredIndicators: ['RSI', 'MACD'],
                marketCondition: 'Mean Reversion',
                riskLevel: 'Moderate'
            },
            {
                name: 'Custom Strategy 2',
                description: 'Your second custom strategy - Buy on VWAP support with ATR confirmation, Sell on VWAP resistance',
                entryRules: [
                    { id: Date.now(), indicator: 'VWAP', condition: 'Crosses Above', value: 'price' },
                    { id: Date.now() + 1, indicator: 'ATR', condition: 'Greater Than', value: '1.5' }
                ],
                exitRules: [
                    { id: Date.now() + 2, indicator: 'VWAP', condition: 'Crosses Below', value: 'price' }
                ],
                requiredIndicators: ['VWAP', 'ATR'],
                marketCondition: 'Trend Following',
                riskLevel: 'Conservative'
            }
        ];
    };

    // Apply rule template
    const applyRuleTemplate = (template) => {
        // Start with the template's rules
        let newEntryRules = [...template.entryRules];
        let newExitRules = [...template.exitRules];

        // Get indicators used in the template
        const templateIndicators = new Set([
            ...template.entryRules.map(rule => rule.indicator),
            ...template.exitRules.map(rule => rule.indicator)
        ]);

        // Generate default rules for other selected indicators
        selectedIndicators.forEach(indicator => {
            if (!templateIndicators.has(indicator.name)) {
                // Generate default entry rule for this indicator
                const defaultEntryRule = generateDefaultRule(indicator.name, 'entry');
                if (defaultEntryRule) {
                    newEntryRules.push(defaultEntryRule);
                }

                // Generate default exit rule for this indicator
                const defaultExitRule = generateDefaultRule(indicator.name, 'exit');
                if (defaultExitRule) {
                    newExitRules.push(defaultExitRule);
                }
            }
        });

        setEntryRules(newEntryRules);
        setExitRules(newExitRules);

        // Add the template indicators to the configured set
        setConfiguredIndicators(prev => new Set([...prev, ...templateIndicators]));
    };

    // Generate default rules for indicators not used in templates
    const generateDefaultRule = (indicatorName, ruleType) => {
        const ruleId = Date.now() + Math.random();

        // Default rules based on indicator type
        const defaultRules = {
            'RSI': {
                entry: { condition: 'Less Than', value: '30' },
                exit: { condition: 'Greater Than', value: '70' }
            },
            'MACD': {
                entry: { condition: 'Crosses Above', value: 'signal' },
                exit: { condition: 'Crosses Below', value: 'signal' }
            },
            'SMA': {
                entry: { condition: 'Crosses Above', value: 'price' },
                exit: { condition: 'Crosses Below', value: 'price' }
            },
            'EMA': {
                entry: { condition: 'Crosses Above', value: '20' },
                exit: { condition: 'Crosses Below', value: '20' }
            },
            'Bollinger Bands': {
                entry: { condition: 'Less Than', value: 'lower' },
                exit: { condition: 'Greater Than', value: 'upper' }
            },
            'ATR': {
                entry: { condition: 'Greater Than', value: '1.5' },
                exit: { condition: 'Less Than', value: '0.5' }
            },
            'VWAP': {
                entry: { condition: 'Crosses Above', value: '1' },
                exit: { condition: 'Crosses Below', value: '1' }
            }
        };

        const indicatorRules = defaultRules[indicatorName];
        if (indicatorRules && indicatorRules[ruleType]) {
            return {
                id: ruleId,
                indicator: indicatorName,
                condition: indicatorRules[ruleType].condition,
                value: indicatorRules[ruleType].value
            };
        }

        // Fallback for unknown indicators
        return {
            id: ruleId,
            indicator: indicatorName,
            condition: ruleType === 'entry' ? 'Greater Than' : 'Less Than',
            value: ruleType === 'entry' ? '0' : '0'
        };
    };

    // Helper functions for indicator-specific rules
    const getRulesByIndicator = (rules, indicatorName) => {
        return rules.filter(rule => rule.indicator === indicatorName);
    };

    const addEntryRuleForIndicator = (indicatorName) => {
        const newRule = {
            id: Date.now() + Math.random(),
            indicator: indicatorName,
            condition: '',
            value: ''
        };
        setEntryRules(prev => [...prev, newRule]);
    };

    const addExitRuleForIndicator = (indicatorName) => {
        const newRule = {
            id: Date.now() + Math.random(),
            indicator: indicatorName,
            condition: '',
            value: ''
        };
        setExitRules(prev => [...prev, newRule]);
    };

    const removeEntryRuleForIndicator = (ruleId) => {
        setEntryRules(prev => prev.filter(rule => rule.id !== ruleId));
    };

    const removeExitRuleForIndicator = (ruleId) => {
        setExitRules(prev => prev.filter(rule => rule.id !== ruleId));
    };

    const updateEntryRuleForIndicator = (ruleId, field, value) => {
        setEntryRules(prev => prev.map(rule =>
            rule.id === ruleId ? { ...rule, [field]: value } : rule
        ));
    };

    const updateExitRuleForIndicator = (ruleId, field, value) => {
        setExitRules(prev => prev.map(rule =>
            rule.id === ruleId ? { ...rule, [field]: value } : rule
        ));
    };

    // Filter templates for unconfigured indicators
    const getTemplatesForUnconfiguredIndicators = () => {
        const unconfiguredIndicators = selectedIndicators.filter(ind => !configuredIndicators.has(ind.name));

        if (unconfiguredIndicators.length === 0) return [];

        // Get all templates that are relevant to unconfigured indicators
        const allTemplates = getRuleTemplates();
        const customTemplates = getCustomStrategies();

        // Filter templates to only show those for unconfigured indicators
        const filteredTemplates = allTemplates.filter(template => {
            const templateIndicators = new Set([
                ...template.entryRules.map(rule => rule.indicator),
                ...template.exitRules.map(rule => rule.indicator)
            ]);

            // Show template if it's for any unconfigured indicator
            return unconfiguredIndicators.some(ind => templateIndicators.has(ind.name));
        });

        const filteredCustomTemplates = customTemplates.filter(template => {
            return unconfiguredIndicators.some(ind => template.requiredIndicators.includes(ind.name));
        });

        return templateTab === 'quick' ? filteredTemplates : filteredCustomTemplates;
    };

    // Check if templates should be shown
    const shouldShowTemplates = () => {
        return selectedIndicators.length > 0 && configuredIndicators.size < selectedIndicators.length;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Indicators Panel */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    📊 Select Indicators
                </h3>

                {/* Selected Indicators */}
                {selectedIndicators.length > 0 && (
                    <div className="mb-4">
                        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Selected:</h4>
                        <div className="space-y-2">
                            {selectedIndicators.map((indicator, index) => (
                                <motion.div
                                    key={indicator.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <indicator.icon className={`w-4 h-4 ${indicator.color === 'emerald' ? 'text-emerald-500' : 'text-blue-500'}`} />
                                        <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                            {indicator.name}
                                        </span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => removeIndicator(indicator.id)}
                                        className={`p-1 hover:bg-red-500/20 rounded ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                                    >
                                        <X className="w-3 h-3" />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Available Indicators */}
                <div className="space-y-2">
                    {availableIndicators.map((indicator) => (
                        <motion.button
                            key={indicator.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addIndicator(indicator)}
                            disabled={selectedIndicators.find(i => i.name === indicator.name)}
                            className={`w-full p-3 rounded-lg border text-left transition-all ${selectedIndicators.find(i => i.name === indicator.name)
                                ? isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed' : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                                : isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700' : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <indicator.icon className={`w-4 h-4 ${indicator.color === 'brand' ? 'text-[#22c55e]' :
                                        indicator.color === 'blue' ? 'text-[#2563eb]' :
                                            indicator.color === 'amber' ? 'text-amber-500' :
                                                indicator.color === 'cyan' ? 'text-cyan-500' :
                                                    'text-red-500'
                                        }`} />
                                    <Info className="w-3 h-3 text-slate-400 opacity-60" />
                                </div>
                                <div>
                                    <div className="font-medium">{indicator.name}</div>
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                        {indicator.description}
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Entry/Exit Rules Panel */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    🎯 Entry & Exit Rules
                </h3>

                {/* Template-Based Rules (New User Friendly) */}
                {shouldShowTemplates() && (
                    <div className="mb-6">
                        {/* Template Tabs */}
                        <div className="template-tab-container flex space-x-1 mb-4 p-1 rounded-lg bg-slate-100 dark:bg-slate-900">
                            <button
                                onClick={() => setTemplateTab('quick')}
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${templateTab === 'quick'
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'text-white hover:text-slate-200'
                                    }`}
                            >
                                💡 Quick Setup
                            </button>
                            <button
                                onClick={() => setTemplateTab('custom')}
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${templateTab === 'custom'
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'text-white hover:text-slate-200'
                                    }`}
                            >
                                ⭐ Custom Strategies
                            </button>
                        </div>

                        {/* Template Content */}
                        <div className="space-y-2">
                            {templateTab === 'quick' ? (
                                // Quick Setup Templates
                                getTemplatesForUnconfiguredIndicators().map((template, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => applyRuleTemplate(template)}
                                        className={`w-full p-3 rounded-lg border text-left transition-all ${isDarkMode
                                            ? 'bg-slate-700/50 border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700'
                                            : 'bg-gray-50 border-gray-200 hover:border-emerald-500/50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {template.name}
                                                </div>
                                                <div className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                                    {template.description}
                                                </div>
                                            </div>
                                            <div className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                Apply
                                            </div>
                                        </div>
                                    </motion.button>
                                ))
                            ) : (
                                // Custom Strategies
                                getTemplatesForUnconfiguredIndicators().map((strategy, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => applyRuleTemplate(strategy)}
                                        className={`w-full p-3 rounded-lg border text-left transition-all ${isDarkMode
                                            ? 'bg-slate-700/50 border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700'
                                            : 'bg-gray-50 border-gray-200 hover:border-emerald-500/50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {strategy.name}
                                                </div>
                                                <div className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                                    {strategy.description}
                                                </div>
                                                <div className="flex gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                                                        {strategy.marketCondition}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {strategy.riskLevel}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                Apply
                                            </div>
                                        </div>
                                    </motion.button>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Advanced Rules Builder (For experienced users) */}
                {entryRules.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Advanced Rule Builder
                            </h4>
                            <button
                                onClick={() => {
                                    setEntryRules([]);
                                    setExitRules([]);
                                    setConfiguredIndicators(new Set());
                                }}
                                className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Reset to Templates
                            </button>
                        </div>
                    </div>
                )}

                {/* Indicator-Specific Rules */}
                {selectedIndicators.length > 0 && (
                    <div className="space-y-6">
                        {selectedIndicators.map((indicator) => {
                            const indicatorEntryRules = getRulesByIndicator(entryRules, indicator.name);
                            const indicatorExitRules = getRulesByIndicator(exitRules, indicator.name);

                            return (
                                <div key={indicator.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                    {/* Indicator Header */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <indicator.icon className={`w-5 h-5 ${indicator.color === 'brand' ? 'text-[#22c55e]' :
                                            indicator.color === 'blue' ? 'text-[#2563eb]' :
                                                indicator.color === 'amber' ? 'text-amber-500' :
                                                    indicator.color === 'cyan' ? 'text-cyan-500' :
                                                        'text-red-500'
                                            }`} />
                                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {indicator.name} Rules
                                        </h3>
                                    </div>

                                    {/* Entry Rules for this indicator */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                                Entry Conditions
                                            </h4>
                                            <button
                                                onClick={() => addEntryRuleForIndicator(indicator.name)}
                                                className={`p-1 hover:bg-emerald-500/20 rounded ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {indicatorEntryRules.map((rule, index) => (
                                                <div key={rule.id} className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <select
                                                            value={rule.condition}
                                                            onChange={(e) => updateEntryRuleForIndicator(rule.id, 'condition', e.target.value)}
                                                            className={`p-1 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                                        >
                                                            <option value="">Condition</option>
                                                            {conditionTemplates.map(template => (
                                                                <option key={template.id} value={template.name}>{template.name}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="text"
                                                            placeholder="Value"
                                                            value={rule.value}
                                                            onChange={(e) => updateEntryRuleForIndicator(rule.id, 'value', e.target.value)}
                                                            className={`p-1 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                                        />
                                                    </div>
                                                    <div className="flex justify-end mt-2">
                                                        <button
                                                            onClick={() => removeEntryRuleForIndicator(rule.id)}
                                                            className={`p-1 hover:bg-red-500/20 rounded ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {indicatorEntryRules.length === 0 && (
                                                <div className={`text-xs text-center py-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                                                    No entry conditions set for {indicator.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Exit Rules for this indicator */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                                Exit Conditions
                                            </h4>
                                            <button
                                                onClick={() => addExitRuleForIndicator(indicator.name)}
                                                className={`p-1 hover:bg-blue-500/20 rounded ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {indicatorExitRules.map((rule, index) => (
                                                <div key={rule.id} className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <select
                                                            value={rule.condition}
                                                            onChange={(e) => updateExitRuleForIndicator(rule.id, 'condition', e.target.value)}
                                                            className={`p-1 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                                        >
                                                            <option value="">Condition</option>
                                                            {conditionTemplates.map(template => (
                                                                <option key={template.id} value={template.name}>{template.name}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="text"
                                                            placeholder="Value"
                                                            value={rule.value}
                                                            onChange={(e) => updateExitRuleForIndicator(rule.id, 'value', e.target.value)}
                                                            className={`p-1 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                                        />
                                                    </div>
                                                    <div className="flex justify-end mt-2">
                                                        <button
                                                            onClick={() => removeExitRuleForIndicator(rule.id)}
                                                            className={`p-1 hover:bg-red-500/20 rounded ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {indicatorExitRules.length === 0 && (
                                                <div className={`text-xs text-center py-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                                                    No exit conditions set for {indicator.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Enhanced Risk Management Panel */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    🛡️ Advanced Risk Management
                </h3>

                <div className="space-y-4">
                    {/* Instrument Selection */}
                    <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Instrument Type
                        </label>
                        <select
                            value={riskSettings.instrument.type}
                            onChange={(e) => setRiskSettings(prev => ({
                                ...prev,
                                instrument: { ...prev.instrument, type: e.target.value, symbol: e.target.value === 'futures' ? 'ES' : 'EUR/USD' }
                            }))}
                            className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        >
                            <option value="futures">Futures</option>
                            <option value="forex">Forex</option>
                        </select>
                    </div>

                    {/* Symbol Selection */}
                    <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Symbol
                        </label>
                        <select
                            value={riskSettings.instrument.symbol}
                            onChange={(e) => setRiskSettings(prev => ({
                                ...prev,
                                instrument: { ...prev.instrument, symbol: e.target.value }
                            }))}
                            className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        >
                            {riskSettings.instrument.type === 'futures' ? (
                                <>
                                    <optgroup label="Index Futures">
                                        <option value="ES">ES - E-mini S&P 500</option>
                                        <option value="MES">MES - Micro E-mini S&P 500</option>
                                        <option value="NQ">NQ - E-mini NASDAQ</option>
                                        <option value="MNQ">MNQ - Micro E-mini NASDAQ</option>
                                        <option value="RTY">RTY - E-mini Russell 2000</option>
                                        <option value="M2K">M2K - Micro E-mini Russell 2000</option>
                                    </optgroup>
                                    <optgroup label="Commodity Futures">
                                        <option value="CL">CL - Crude Oil</option>
                                        <option value="MCL">MCL - Micro Crude Oil</option>
                                        <option value="GC">GC - Gold</option>
                                        <option value="MGC">MGC - Micro Gold</option>
                                    </optgroup>
                                </>
                            ) : (
                                <>
                                    <option value="EUR/USD">EUR/USD - Euro/US Dollar</option>
                                    <option value="GBP/USD">GBP/USD - British Pound/US Dollar</option>
                                    <option value="USD/JPY">USD/JPY - US Dollar/Japanese Yen</option>
                                    <option value="USD/CHF">USD/CHF - US Dollar/Swiss Franc</option>
                                    <option value="AUD/USD">AUD/USD - Australian Dollar/US Dollar</option>
                                    <option value="USD/CAD">USD/CAD - US Dollar/Canadian Dollar</option>
                                </>
                            )}
                        </select>
                    </div>

                    {/* Lot Size (Forex Only) */}
                    {riskSettings.instrument.type === 'forex' && (
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                            <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Lot Size
                            </label>
                            <select
                                value={riskSettings.lotSize}
                                onChange={(e) => setRiskSettings(prev => ({
                                    ...prev,
                                    lotSize: e.target.value
                                }))}
                                className={`w-full p-2 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                            >
                                <option value="standard">Standard (100,000 units)</option>
                                <option value="mini">Mini (10,000 units)</option>
                                <option value="micro">Micro (1,000 units)</option>
                            </select>
                        </div>
                    )}

                    {/* Account Size */}
                    <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Account Size
                        </label>
                        <div className="relative">
                            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>$</span>
                            <input
                                type="number"
                                value={riskSettings.accountSize}
                                onChange={(e) => setRiskSettings(prev => ({
                                    ...prev,
                                    accountSize: parseFloat(e.target.value)
                                }))}
                                className={`w-full p-2 pl-6 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                placeholder="100000"
                            />
                        </div>
                    </div>

                    {/* Risk Percentage */}
                    <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Risk Per Trade
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={riskSettings.maxRisk.value}
                                onChange={(e) => setRiskSettings(prev => ({
                                    ...prev,
                                    maxRisk: { ...prev.maxRisk, value: parseFloat(e.target.value) }
                                }))}
                                className={`flex-1 p-2 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                placeholder="1.0"
                                step="0.1"
                                min="0.1"
                                max="5"
                            />
                            <span className={`p-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>%</span>
                        </div>
                    </div>

                    {/* Stop Loss Points/Pips */}
                    <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Stop Loss ({riskSettings.instrument.type === 'futures' ? 'Points' : 'Pips'})
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={riskSettings.stopLossPoints}
                                onChange={(e) => setRiskSettings(prev => ({
                                    ...prev,
                                    stopLossPoints: parseFloat(e.target.value)
                                }))}
                                className={`flex-1 p-2 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                placeholder="10"
                                step="0.1"
                                min="0.1"
                            />
                            <span className={`p-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                {riskSettings.instrument.type === 'futures' ? 'pts' : 'pips'}
                            </span>
                        </div>
                    </div>

                    {/* Position Size Calculator Results */}
                    {(() => {
                        const result = calculatePositionSize(
                            riskSettings.accountSize,
                            riskSettings.maxRisk.value,
                            riskSettings.stopLossPoints,
                            riskSettings.instrument.type,
                            riskSettings.instrument.symbol,
                            riskSettings.lotSize
                        );

                        if (result.error) return null;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`p-4 rounded-lg border ${isDarkMode ? 'bg-emerald-900/20 border-emerald-700/30' : 'bg-emerald-50 border-emerald-200'}`}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className="text-emerald-500"
                                    >
                                        📊
                                    </motion.div>
                                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                        Position Size Calculator
                                    </h4>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex justify-between items-center p-2 rounded bg-emerald-500/10"
                                    >
                                        <span className={isDarkMode ? 'text-emerald-200' : 'text-emerald-700'}>
                                            Dollar Risk:
                                        </span>
                                        <motion.span
                                            key={result.dollarRisk}
                                            initial={{ scale: 1.2, color: '#10b981' }}
                                            animate={{ scale: 1, color: isDarkMode ? '#6ee7b7' : '#047857' }}
                                            transition={{ duration: 0.3 }}
                                            className="font-bold text-lg"
                                        >
                                            ${result.dollarRisk.toFixed(2)}
                                        </motion.span>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex justify-between items-center p-2 rounded bg-blue-500/10"
                                    >
                                        <span className={isDarkMode ? 'text-blue-200' : 'text-blue-700'}>
                                            {riskSettings.instrument.type === 'futures' ? 'Contracts:' : 'Lots:'}
                                        </span>
                                        <motion.span
                                            key={riskSettings.instrument.type === 'futures' ? result.contracts : result.lots}
                                            initial={{ scale: 1.2, color: '#3b82f6' }}
                                            animate={{ scale: 1, color: isDarkMode ? '#93c5fd' : '#1d4ed8' }}
                                            transition={{ duration: 0.3 }}
                                            className="font-bold text-lg"
                                        >
                                            {riskSettings.instrument.type === 'futures' ? result.contracts : result.lots}
                                        </motion.span>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex justify-between items-center p-2 rounded bg-blue-500/10"
                                    >
                                        <span className={isDarkMode ? 'text-blue-200' : 'text-blue-700'}>
                                            Max {riskSettings.instrument.type === 'futures' ? 'Contracts' : 'Lots'}:
                                        </span>
                                        <motion.span
                                            key={riskSettings.instrument.type === 'futures' ? result.maxContracts : result.maxLots}
                                            initial={{ scale: 1.2, color: '#8b5cf6' }}
                                            animate={{ scale: 1, color: isDarkMode ? '#c4b5fd' : '#5b21b6' }}
                                            transition={{ duration: 0.3 }}
                                            className="font-bold text-lg"
                                        >
                                            {riskSettings.instrument.type === 'futures' ? result.maxContracts : result.maxLots}
                                        </motion.span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

// Advanced Setup Component (for text input)
const AdvancedSetup = ({ userInput, setUserInput, textareaRef, isDarkMode }) => {
    return (
        <div className={`p-6 rounded-2xl border h-full ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                📝 Advanced Strategy Description
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Describe your strategy in detail. The more specific you are, the better the generated code will be.
            </p>

            <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Example: Create a momentum strategy that buys when RSI is above 60 and price breaks above the 20-day EMA with volume 2x higher than average. Use a 2% stop loss and take profits at 1.5x the risk..."
                className={`w-full h-64 p-4 rounded-lg border resize-none ${isDarkMode
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
            />

            <div className={`mt-4 text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                💡 Try including: indicators, entry/exit conditions, risk management, timeframes, and any special rules
            </div>
        </div>
    );
};

// Code Output Component
const CodeOutput = ({ generatedCode, confidence, isGenerating, selectedPlatform, isDarkMode, strategyInsights = [], showEdgeBotChat, setShowEdgeBotChat, chatMessages, chatInput, setChatInput, isTyping, sendChatMessage, handleChatKeyPress, chatEndRef, selectedIndicators, entryRules, exitRules, riskSettings, activeTab, onboardingStep, strategyIntent, addIndicator, availableIndicators, setActiveTab, generateStrategy, handleStrategyIntent, validateStrategy, setWorkspaceTab }: {
    generatedCode: string;
    confidence: number;
    isGenerating: boolean;
    selectedPlatform: string;
    isDarkMode: boolean;
    strategyInsights: Array<{
        type: string;
        title: string;
        message: string;
        confidence: string;
        icon: any;
    }>;
    showEdgeBotChat: boolean;
    setShowEdgeBotChat: React.Dispatch<React.SetStateAction<boolean>>;
    chatMessages: Array<{
        id: number;
        type: string;
        message: string;
        timestamp: Date;
    }>;
    chatInput: string;
    setChatInput: React.Dispatch<React.SetStateAction<string>>;
    isTyping: boolean;
    sendChatMessage: () => Promise<void>;
    handleChatKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    chatEndRef: React.RefObject<HTMLDivElement>;
    selectedIndicators: any[];
    entryRules: any[];
    exitRules: any[];
    riskSettings: any;
    activeTab: string;
    onboardingStep: string;
    strategyIntent: string;
    addIndicator: (indicator: any) => void;
    availableIndicators: any[];
    setActiveTab: (tab: string) => void;
    generateStrategy: () => void;
    handleStrategyIntent: (intent: string) => void;
    validateStrategy: () => any;
    setWorkspaceTab: (tab: string) => void;
}) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
    };

    return (
        <div className={`p-6 rounded-2xl border h-full flex flex-col ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    💻 Generated {selectedPlatform} Code
                </h3>
                {generatedCode && (
                    <div className="flex gap-2">
                        <button
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                            <Copy className="w-4 h-4" />
                            Copy
                        </button>
                        <button
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'}`}
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                    </div>
                )}
            </div>

            {/* Analyze Strategy CTA */}
            {generatedCode && (
                <div className={`mb-4 p-4 rounded-xl border ${isDarkMode
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-blue-50 border-blue-300'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                <Stethoscope className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                            <div>
                                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                    Ready to Analyze Your Strategy?
                                </h4>
                                <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                                    Get AI-powered analysis, code optimization, and performance insights
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setWorkspaceTab('debugger')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isDarkMode
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        >
                            <Stethoscope className="w-4 h-4" />
                            Analyze Strategy
                        </motion.button>
                    </div>
                </div>
            )}





            <div className="flex-1 min-h-0">
                {isGenerating ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <RefreshCw className={`w-12 h-12 animate-spin mx-auto mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                            <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Generating your strategy...
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                This may take a few moments
                            </p>
                        </div>
                    </div>
                ) : generatedCode ? (
                    <pre className={`h-full overflow-auto p-4 rounded-lg text-sm font-mono whitespace-pre-wrap ${isDarkMode
                        ? 'bg-slate-900/50 text-slate-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}>
                        {generatedCode}
                    </pre>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <Code className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
                            <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                Configure your strategy and click Generate
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {confidence > 0 && (
                <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100 border border-gray-300'}`}>
                    <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-700'}>
                            Strategy Confidence
                        </span>
                        <span className={`font-medium ${confidence >= 80
                            ? isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                            : confidence >= 60
                                ? isDarkMode ? 'text-amber-400' : 'text-amber-700'
                                : isDarkMode ? 'text-red-400' : 'text-red-700'
                            }`}>
                            {confidence}%
                        </span>
                    </div>
                    <div className={`w-full rounded-full h-2 mt-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`}>
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${confidence >= 80 ? 'bg-emerald-500' :
                                confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${confidence}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Floating EdgeBot Assistant */}
            <FloatingEdgeBot
                isDarkMode={isDarkMode}
                selectedIndicators={selectedIndicators}
                entryRules={entryRules}
                exitRules={exitRules}
                riskSettings={riskSettings}
                activeTab={activeTab}
                generatedCode={generatedCode}
                confidence={confidence}
                onboardingStep={onboardingStep}
                strategyIntent={strategyIntent}
                addIndicator={addIndicator}
                availableIndicators={availableIndicators}
                setActiveTab={setActiveTab}
                generateStrategy={generateStrategy}
                handleStrategyIntent={handleStrategyIntent}
                validateStrategy={validateStrategy}
            />
        </div>
    );
};

// Floating EdgeBot Assistant Component
const FloatingEdgeBot = ({
    isDarkMode,
    selectedIndicators,
    entryRules,
    exitRules,
    riskSettings,
    activeTab,
    generatedCode,
    confidence,
    onboardingStep,
    strategyIntent,
    addIndicator,
    availableIndicators,
    setActiveTab,
    generateStrategy,
    handleStrategyIntent,
    validateStrategy
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasNewSuggestion, setHasNewSuggestion] = useState(false);
    const chatEndRef = useRef(null);

    // Real-time strategy analysis for EdgeBot intelligence
    const analyzeStrategyInRealTime = () => {
        const analysis = {
            strengths: [],
            weaknesses: [],
            suggestions: [],
            riskLevel: 'low',
            complexity: 'simple',
            expectedPerformance: 'good'
        };

        // Analyze indicator combinations
        if (selectedIndicators.length > 0) {
            const hasMomentum = selectedIndicators.some(i => i.name === 'RSI' || i.name === 'MACD');
            const hasTrend = selectedIndicators.some(i => i.name === 'EMA' || i.name === 'SMA');
            const hasVolatility = selectedIndicators.some(i => i.name === 'ATR' || i.name === 'Bollinger Bands');
            const hasVWAP = selectedIndicators.some(i => i.name === 'VWAP');

            // Strength analysis
            if (hasMomentum && hasTrend) {
                analysis.strengths.push('Strong momentum + trend confirmation');
                analysis.expectedPerformance = 'excellent';
            }
            if (hasVWAP) {
                analysis.strengths.push('Institutional reference level included');
            }
            if (hasVolatility) {
                analysis.strengths.push('Dynamic risk management possible');
            }

            // Weakness analysis
            if (selectedIndicators.length > 4) {
                analysis.weaknesses.push('Too many indicators may cause signal conflicts');
                analysis.complexity = 'complex';
                analysis.suggestions.push('Consider removing 1-2 indicators for cleaner signals');
            }
            if (selectedIndicators.length === 1) {
                analysis.weaknesses.push('Single indicator strategies lack confirmation');
                analysis.suggestions.push('Add a complementary indicator for confirmation');
            }
            if (!hasVolatility && strategyIntent !== 'mean-reversion') {
                analysis.weaknesses.push('No volatility indicator for dynamic stops');
                analysis.suggestions.push('Consider adding ATR for adaptive risk management');
            }
        }

        // Analyze entry/exit rules
        if (entryRules.length > 0) {
            if (entryRules.length >= 3) {
                analysis.complexity = 'complex';
                analysis.suggestions.push('Multiple entry conditions may reduce signal frequency');
            }
            if (exitRules.length === 0) {
                analysis.weaknesses.push('No exit rules defined');
                analysis.riskLevel = 'high';
                analysis.suggestions.push('Add exit conditions to protect profits');
            }
        }

        // Analyze risk management
        if (riskSettings.stopLoss.enabled) {
            if (riskSettings.riskPerTrade > 2) {
                analysis.riskLevel = 'high';
                analysis.suggestions.push('Consider reducing risk per trade to 1-2%');
            }
        } else {
            analysis.riskLevel = 'high';
            analysis.weaknesses.push('No stop loss protection');
            analysis.suggestions.push('Enable stop loss to limit downside risk');
        }

        // Strategy-specific analysis
        if (strategyIntent) {
            switch (strategyIntent) {
                case 'momentum':
                    if (!selectedIndicators.some(i => i.name === 'RSI')) {
                        analysis.suggestions.push('RSI is essential for momentum strategies');
                    }
                    break;
                case 'trend':
                    if (!selectedIndicators.some(i => i.name === 'EMA' || i.name === 'SMA')) {
                        analysis.suggestions.push('Moving averages are core to trend strategies');
                    }
                    break;
                case 'mean-reversion':
                    if (!selectedIndicators.some(i => i.name === 'Bollinger Bands')) {
                        analysis.suggestions.push('Bollinger Bands work well for mean reversion');
                    }
                    break;
                case 'breakout':
                    if (!selectedIndicators.some(i => i.name === 'ATR')) {
                        analysis.suggestions.push('ATR helps identify breakout strength');
                    }
                    break;
            }
        }

        return analysis;
    };

    // Enhanced contextual guidance based on current state
    const getContextualGuidance = () => {
        // Enhanced "Cursor AI for Trading" guidance
        const validation = validateStrategy();

        // Strategy validation feedback
        if (!validation.isValid) {
            return {
                type: 'validation',
                title: 'Strategy Issues Detected',
                message: `I found ${validation.issues.length} issue(s) that need attention:`,
                suggestions: validation.issues.map(issue => ({
                    text: issue,
                    action: 'fix',
                    priority: 'high'
                })),
                actions: [
                    {
                        text: 'Add Entry Rules',
                        action: () => setActiveTab('visual'),
                        icon: 'Plus',
                        show: validation.issues.includes('No entry rules defined - add entry conditions')
                    },
                    {
                        text: 'Add Indicators',
                        action: () => setActiveTab('visual'),
                        icon: 'BarChart3',
                        show: validation.issues.includes('No indicators selected - add at least one indicator')
                    }
                ]
            };
        }

        // Real-time strategy analysis and suggestions
        if (selectedIndicators.length > 0) {
            const analysis = analyzeStrategyInRealTime();

            return {
                type: 'analysis',
                title: 'Strategy Analysis',
                message: `Your ${strategyIntent || 'custom'} strategy looks ${analysis.complexity === 'low' ? 'clean' : 'complex'}. ${analysis.strengths.length > 0 ? `Strengths: ${analysis.strengths[0]}` : ''}`,
                suggestions: [
                    ...validation.warnings.map(warning => ({
                        text: warning,
                        action: 'warning',
                        priority: 'medium'
                    })),
                    ...validation.suggestions.map(suggestion => ({
                        text: suggestion,
                        action: 'suggestion',
                        priority: 'low'
                    })),
                    ...analysis.suggestions.slice(0, 2).map(suggestion => ({
                        text: suggestion,
                        action: 'enhance',
                        priority: 'medium'
                    }))
                ],
                actions: [
                    {
                        text: 'Generate Code',
                        action: generateStrategy,
                        icon: 'Code',
                        show: validation.isValid
                    },
                    {
                        text: 'Add Complementary Indicators',
                        action: () => setActiveTab('visual'),
                        icon: 'Plus',
                        show: selectedIndicators.length === 1
                    }
                ]
            };
        }

        // Onboarding guidance
        if (onboardingStep === 'intent' || !strategyIntent) {
            return {
                type: 'onboarding',
                title: 'Choose Your Strategy Type',
                message: 'Select a strategy type to get started. I\'ll help you build it step by step!',
                suggestions: [
                    {
                        text: 'Momentum Strategy - Great for trending markets',
                        action: 'select',
                        data: 'momentum',
                        priority: 'high'
                    },
                    {
                        text: 'Trend Following - Follow established trends',
                        action: 'select',
                        data: 'trend',
                        priority: 'high'
                    },
                    {
                        text: 'Mean Reversion - Trade price reversals',
                        action: 'select',
                        data: 'mean-reversion',
                        priority: 'high'
                    },
                    {
                        text: 'Breakout Strategy - Trade breakouts with volume',
                        action: 'select',
                        data: 'breakout',
                        priority: 'high'
                    }
                ]
            };
        }

        // Default guidance
        return {
            type: 'general',
            title: 'EdgeBot Coach',
            message: 'I\'m here to help you build professional trading strategies. Ask me anything about indicators, risk management, or strategy development!',
            suggestions: [
                {
                    text: 'What indicators work well together?',
                    action: 'question',
                    priority: 'medium'
                },
                {
                    text: 'How do I set proper risk management?',
                    action: 'question',
                    priority: 'medium'
                },
                {
                    text: 'Explain my current strategy',
                    action: 'analyze',
                    priority: 'low'
                }
            ]
        };
    };

    // Enhanced complementary indicators with educational context
    const getComplementaryIndicators = (indicatorName) => {
        const combinations = {
            'RSI': [
                { name: 'EMA', reason: 'RSI finds oversold/overbought conditions, EMA confirms trend direction for better entry timing' },
                { name: 'ATR', reason: 'RSI signals entry points, ATR sets dynamic stop losses based on market volatility' },
                { name: 'VWAP', reason: 'RSI identifies momentum, VWAP provides institutional reference level for precise entries' }
            ],
            'MACD': [
                { name: 'RSI', reason: 'MACD shows momentum direction, RSI filters out overbought/oversold conditions' },
                { name: 'EMA', reason: 'MACD crossovers work best when price is above/below EMA for trend confirmation' },
                { name: 'ATR', reason: 'MACD signals entries, ATR helps set appropriate stop losses based on volatility' }
            ],
            'EMA': [
                { name: 'RSI', reason: 'EMA defines trend direction, RSI finds optimal entry points within the trend' },
                { name: 'ATR', reason: 'EMA shows trend, ATR sets dynamic stops that adapt to market volatility' },
                { name: 'VWAP', reason: 'EMA confirms trend, VWAP provides institutional reference for entry timing' }
            ],
            'SMA': [
                { name: 'RSI', reason: 'SMA shows trend direction, RSI finds momentum entry points within the trend' },
                { name: 'Bollinger Bands', reason: 'SMA defines trend, Bollinger Bands show volatility and potential reversals' },
                { name: 'ATR', reason: 'SMA confirms trend, ATR sets adaptive stop losses based on market conditions' }
            ],
            'Bollinger Bands': [
                { name: 'RSI', reason: 'Bollinger Bands show volatility, RSI confirms momentum for breakout trades' },
                { name: 'EMA', reason: 'Bollinger Bands identify reversals, EMA confirms overall trend direction' },
                { name: 'ATR', reason: 'Bollinger Bands show volatility, ATR sets stops based on actual market volatility' }
            ],
            'ATR': [
                { name: 'RSI', reason: 'ATR sets dynamic stops, RSI finds optimal entry points for better risk/reward' },
                { name: 'EMA', reason: 'ATR adapts to volatility, EMA confirms trend direction for better trade selection' },
                { name: 'VWAP', reason: 'ATR sets stops, VWAP provides institutional reference for entry timing' }
            ],
            'VWAP': [
                { name: 'RSI', reason: 'VWAP provides entry reference, RSI confirms momentum for better timing' },
                { name: 'EMA', reason: 'VWAP shows institutional levels, EMA confirms overall trend direction' },
                { name: 'ATR', reason: 'VWAP sets entry levels, ATR adapts stop losses to current volatility' }
            ]
        };
        return combinations[indicatorName] || [];
    };

    const currentGuidance = getContextualGuidance();

    // Send chat message
    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: chatInput,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                message: generateAIResponse(chatInput, { selectedIndicators, entryRules, activeTab }),
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    // Generate contextual AI responses
    const generateAIResponse = (userInput, context) => {
        const input = userInput.toLowerCase();

        if (input.includes('indicator') || input.includes('rsi') || input.includes('macd')) {
            return "Great question! Based on your current setup, I'd recommend adding complementary indicators. For example, if you're using RSI, MACD works well to confirm momentum signals. Would you like me to suggest specific combinations?";
        } else if (input.includes('risk') || input.includes('stop loss')) {
            return "Risk management is crucial! I recommend setting a stop loss at 1-3% below your entry and a take profit at 1.5-2x your risk. This gives you a positive risk-reward ratio. Would you like help setting this up?";
        } else if (input.includes('strategy') || input.includes('help')) {
            return "I'm here to help you build a profitable strategy! What specific aspect would you like guidance on? I can help with indicator selection, entry/exit rules, risk management, or strategy optimization.";
        } else {
            return "That's an interesting question! Based on your current progress, I'd suggest focusing on completing your indicator selection first, then we can dive deeper into the specifics. What would you like to work on next?";
        }
    };

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    // Check for new suggestions
    useEffect(() => {
        if (currentGuidance.priority === 'high') {
            setHasNewSuggestion(true);
            setTimeout(() => setHasNewSuggestion(false), 3000);
        }
    }, [selectedIndicators.length, entryRules.length, riskSettings, activeTab]);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {(isExpanded || showChat) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`mb-4 w-80 max-h-96 rounded-2xl border shadow-2xl ${isDarkMode
                            ? 'bg-slate-800/95 border-slate-700 backdrop-blur-lg'
                            : 'bg-white/95 border-gray-200 backdrop-blur-lg'
                            }`}
                    >
                        {!showChat ? (
                            // Guidance Panel
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                                            <Brain className="w-4 h-4 text-white" />
                                        </div>
                                        <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            EdgeBot Assistant
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setShowChat(true)}
                                            className={`p-1.5 rounded-lg transition-colors ${isDarkMode
                                                ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                                                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                                }`}
                                            title="Open Chat"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setIsExpanded(false)}
                                            className={`p-1.5 rounded-lg transition-colors ${isDarkMode
                                                ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                                                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            <Minimize2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className={`text-sm leading-relaxed mb-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'
                                    }`}>
                                    {currentGuidance.message}
                                </p>

                                {currentGuidance.suggestions.length > 0 && (
                                    <div className="space-y-2">
                                        {currentGuidance.suggestions.map((suggestion, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => {
                                                    if (suggestion.action === 'select' && suggestion.data) {
                                                        handleStrategyIntent(suggestion.data);
                                                    } else if (suggestion.action === 'fix') {
                                                        setActiveTab('visual');
                                                    } else if (suggestion.action === 'enhance') {
                                                        setActiveTab('visual');
                                                    } else if (suggestion.action === 'navigation') {
                                                        if (suggestion.target === 'code') {
                                                            setActiveTab('code');
                                                            generateStrategy();
                                                        } else if (suggestion.target === 'builder') {
                                                            setActiveTab('builder');
                                                        } else if (suggestion.target === 'advanced') {
                                                            setActiveTab('advanced');
                                                        }
                                                    }
                                                }}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-all ${isDarkMode
                                                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{suggestion.text}</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                                {suggestion.reason && (
                                                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-emerald-300/70' : 'text-emerald-600/70'
                                                        }`}>
                                                        {suggestion.reason}
                                                    </div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Chat Panel
                            <div className="flex flex-col h-96">
                                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                                            <Brain className="w-4 h-4 text-white" />
                                        </div>
                                        <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Chat with EdgeBot
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setShowChat(false)}
                                        className={`p-1.5 rounded-lg transition-colors ${isDarkMode
                                            ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {chatMessages.length === 0 && (
                                        <div className={`text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                            Ask me anything about your strategy!
                                        </div>
                                    )}

                                    {chatMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-lg text-sm ${message.type === 'user'
                                                    ? 'bg-emerald-500 text-white'
                                                    : isDarkMode
                                                        ? 'bg-slate-700 text-slate-200'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {message.message}
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                                                }`}>
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                            placeholder="Ask about indicators, risk management, etc..."
                                            className={`flex-1 px-3 py-2 rounded-lg border text-sm ${isDarkMode
                                                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                                        />
                                        <button
                                            onClick={sendChatMessage}
                                            disabled={!chatInput.trim()}
                                            className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Avatar Button */}
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Brain className="w-6 h-6 text-white" />

                {/* Pulsing animation for new suggestions */}
                {hasNewSuggestion && (
                    <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
                )}

                {/* Notification badge */}
                {currentGuidance.priority === 'high' && !isExpanded && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">!</span>
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default StrategyGenerator;
