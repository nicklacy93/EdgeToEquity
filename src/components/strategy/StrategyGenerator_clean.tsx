"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion/client';
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
    Calculator
} from 'lucide-react';
import { useStrategyStore } from "@/store/useStrategyStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useTheme } from '@/context/ThemeContext';

const StrategyGenerator = () => {
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
    const [hoveredIndicator, setHoveredIndicator] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
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

    const {
        generatedCode,
        setGeneratedCode,
        selectedPlatform,
        setSelectedPlatform,
    } = useStrategyStore();

    const { setActiveTab: setWorkspaceTab } = useWorkspaceStore();

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
            color: 'amber'
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
        }
    };

    const removeIndicator = (indicatorId) => {
        setSelectedIndicators(selectedIndicators.filter(i => i.id !== indicatorId));
    };

    const addEntryRule = () => {
        setEntryRules([...entryRules, {
            id: Date.now(),
            indicator: '',
            condition: '',
            value: '',
            enabled: true
        }]);
    };

    const addExitRule = () => {
        setExitRules([...exitRules, {
            id: Date.now(),
            indicator: '',
            condition: '',
            value: '',
            enabled: true
        }]);
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
        return `// 🎯 Custom Strategy - Built with EdgeToEquity Strategy Architect
// Generated from visual strategy builder

//@version=5
strategy("Custom Strategy", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity, default_qty_value=${riskSettings.positionSize.value})

// === INDICATORS ===
${selectedIndicators.map(ind => {
            switch (ind.name) {
                case 'RSI':
                    return `rsi_${ind.id} = ta.rsi(close, ${ind.params.period})`;
                case 'MACD':
                    return `[macd_${ind.id}, signal_${ind.id}, _] = ta.macd(close, ${ind.params.fast}, ${ind.params.slow}, ${ind.params.signal})`;
                case 'SMA':
                    return `sma_${ind.id} = ta.sma(close, ${ind.params.period})`;
                case 'EMA':
                    return `ema_${ind.id} = ta.ema(close, ${ind.params.period})`;
                default:
                    return `// ${ind.name} indicator`;
            }
        }).join('\n')}

// === ENTRY CONDITIONS ===
long_condition = ${entryRules.map(rule => {
            if (rule.indicator && rule.condition && rule.value) {
                return `${rule.indicator} ${rule.condition} ${rule.value}`;
            }
            return 'true';
        }).join(' and ') || 'true'}

short_condition = false // Define short conditions here

// === RISK MANAGEMENT ===
${riskSettings.stopLoss.enabled ? `stop_loss_pct = ${riskSettings.stopLoss.value} / 100` : '// Stop loss disabled'}
${riskSettings.takeProfit.enabled ? `take_profit_ratio = ${riskSettings.takeProfit.value}` : '// Take profit disabled'}

// === STRATEGY EXECUTION ===
if long_condition and strategy.position_size == 0
    strategy.entry("Long", strategy.long)
    ${riskSettings.stopLoss.enabled ? 'strategy.exit("Stop Loss", "Long", stop=close * (1 - stop_loss_pct))' : ''}

// === VISUALIZATION ===
plot(${selectedIndicators.find(i => i.name === 'SMA') ? `sma_${selectedIndicators.find(i => i.name === 'SMA').id}` : 'na'}, "SMA", color.blue)
plot(${selectedIndicators.find(i => i.name === 'EMA') ? `ema_${selectedIndicators.find(i => i.name === 'EMA').id}` : 'na'}, "EMA", color.orange)`;
    };

    return (
        <div className="w-full h-full">
            {/* Strategy Builder Interface */}
            <div className="flex flex-col h-full space-y-6">



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
                                        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
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

                {/* Contextual Tooltip */}
                <AnimatePresence>
                    {showTooltip && hoveredIndicator && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed z-50 pointer-events-none"
                            style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
                        >
                            <div className={`p-3 rounded-lg shadow-lg max-w-xs ${isDarkMode ? 'bg-slate-800 border border-slate-600' : 'bg-white border border-gray-200'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <hoveredIndicator.icon className={`w-4 h-4 ${hoveredIndicator.color === 'emerald' ? 'text-emerald-500' : 'text-blue-500'}`} />
                                    <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {hoveredIndicator.name}
                                    </span>
                                </div>
                                <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                    {hoveredIndicator.description}
                                </p>
                                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                                        onClick={() => {
                                            addIndicator(hoveredIndicator);
                                            setShowTooltip(false);
                                        }}
                                    >
                                        + Add to Strategy
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Action Button for Quick Help */}
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
                                ? 'bg-gradient-to-r from-[#2563eb] to-[#22c55e] hover:from-[#2563eb] hover:to-[#22c55e]'
                                : 'bg-gradient-to-r from-[#2563eb] to-[#22c55e] hover:from-[#2563eb] hover:to-[#22c55e]'} text-white`}
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
                            setHoveredIndicator={setHoveredIndicator}
                            setShowTooltip={setShowTooltip}
                            setTooltipPosition={setTooltipPosition}
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
    setHoveredIndicator,
    setShowTooltip,
    setTooltipPosition
}) => {
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
                            onMouseEnter={(e) => {
                                setHoveredIndicator(indicator);
                                setShowTooltip(true);
                                setTooltipPosition({
                                    x: e.clientX + 10,
                                    y: e.clientY - 10
                                });
                            }}
                            onMouseLeave={() => {
                                setShowTooltip(false);
                                setHoveredIndicator(null);
                            }}
                            disabled={selectedIndicators.find(i => i.name === indicator.name)}
                            className={`w-full p-3 rounded-lg border text-left transition-all ${selectedIndicators.find(i => i.name === indicator.name)
                                ? isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed' : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                                : isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700' : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <indicator.icon className={`w-4 h-4 ${indicator.color === 'emerald' ? 'text-emerald-500' :
                                        indicator.color === 'blue' ? 'text-blue-500' :
                                            indicator.color === 'purple' ? 'text-purple-500' :
                                                indicator.color === 'amber' ? 'text-amber-500' :
                                                    indicator.color === 'cyan' ? 'text-cyan-500' :
                                                        'text-red-500'
                                        }`} />
                                    <Info className="w-3 h-3 text-slate-400 opacity-60" />
                                </div>
                                <div>
                                    <div className="font-medium">{indicator.name}</div>
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
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

                {/* Entry Rules */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Entry Conditions</h4>
                        <button
                            onClick={addEntryRule}
                            className={`p-1 hover:bg-emerald-500/20 rounded ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {entryRules.map((rule, index) => (
                            <div key={rule.id} className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <select
                                        value={rule.indicator}
                                        onChange={(e) => {
                                            const newRules = [...entryRules];
                                            newRules[index].indicator = e.target.value;
                                            setEntryRules(newRules);
                                        }}
                                        className={`p-1 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="">Indicator</option>
                                        {selectedIndicators.map(ind => (
                                            <option key={ind.id} value={ind.name}>{ind.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={rule.condition}
                                        onChange={(e) => {
                                            const newRules = [...entryRules];
                                            newRules[index].condition = e.target.value;
                                            setEntryRules(newRules);
                                        }}
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
                                        onChange={(e) => {
                                            const newRules = [...entryRules];
                                            newRules[index].value = e.target.value;
                                            setEntryRules(newRules);
                                        }}
                                        className={`p-1 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                    />
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => removeEntryRule(rule.id)}
                                        className={`p-1 hover:bg-red-500/20 rounded ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Exit Rules */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Exit Conditions</h4>
                        <button
                            onClick={addExitRule}
                            className={`p-1 hover:bg-blue-500/20 rounded ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {exitRules.map((rule, index) => (
                            <div key={rule.id} className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <select
                                        value={rule.indicator}
                                        onChange={(e) => {
                                            const newRules = [...exitRules];
                                            newRules[index].indicator = e.target.value;
                                            setExitRules(newRules);
                                        }}
                                        className={`p-1 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="">Indicator</option>
                                        {selectedIndicators.map(ind => (
                                            <option key={ind.id} value={ind.name}>{ind.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={rule.condition}
                                        onChange={(e) => {
                                            const newRules = [...exitRules];
                                            newRules[index].condition = e.target.value;
                                            setExitRules(newRules);
                                        }}
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
                                        onChange={(e) => {
                                            const newRules = [...exitRules];
                                            newRules[index].value = e.target.value;
                                            setExitRules(newRules);
                                        }}
                                        className={`p-1 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                    />
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => removeExitRule(rule.id)}
                                        className={`p-1 hover:bg-red-500/20 rounded ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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
                        <div className="flex gap-2">
                            <span className={`p-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>$</span>
                            <input
                                type="number"
                                value={riskSettings.accountSize}
                                onChange={(e) => setRiskSettings(prev => ({
                                    ...prev,
                                    accountSize: parseFloat(e.target.value)
                                }))}
                                className={`flex-1 p-2 rounded border ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
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
                                        className="flex justify-between items-center p-2 rounded bg-purple-500/10"
                                    >
                                        <span className={isDarkMode ? 'text-purple-200' : 'text-purple-700'}>
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
const CodeOutput = ({ generatedCode, confidence, isGenerating, selectedPlatform, isDarkMode, strategyInsights = [], showEdgeBotChat, setShowEdgeBotChat, chatMessages, chatInput, setChatInput, isTyping, sendChatMessage, handleChatKeyPress, chatEndRef }: {
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

            {/* Sprint 3: Strategy Insights Panel */}
            {generatedCode && strategyInsights.length > 0 && (
                <div className={`mb-4 p-4 rounded-xl border ${isDarkMode
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-emerald-50 border-emerald-300'}`}>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                            Strategy Insights
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {strategyInsights.map((insight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-3 rounded-lg ${isDarkMode
                                    ? 'bg-emerald-800/30 border border-emerald-700/50'
                                    : 'bg-emerald-100 border border-emerald-300'}`}
                            >
                                <div className="flex items-start gap-3">
                                    <insight.icon className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                    <div className="flex-1">
                                        <div className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                            {insight.title}
                                        </div>
                                        <div className={`text-sm mt-1 ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                                            {insight.message}
                                        </div>
                                        <div className={`text-xs mt-2 ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-600/70'}`}>
                                            Confidence: {insight.confidence}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
            />
        </div>
    );
};
                        { / *   F l o a t i n g   E d g e B o t   A s s i s t a n t   * /  } 
 
                         < F l o a t i n g E d g e B o t   / > 
 
                 < / d i v > 
 
 
