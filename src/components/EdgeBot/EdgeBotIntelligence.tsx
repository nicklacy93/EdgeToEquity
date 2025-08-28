import React from 'react';
import { motion } from 'framer-motion/client';
import { Brain, Zap, TrendingUp, AlertTriangle, CheckCircle, Code, Lightbulb, Sparkles, Clock, BarChart3, Target, Shield, Globe } from 'lucide-react';

interface StrategyAnalysis {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    riskLevel: 'low' | 'medium' | 'high';
    complexity: 'simple' | 'moderate' | 'complex';
    expectedPerformance: 'poor' | 'good' | 'excellent';
}

interface CodeSuggestion {
    type: 'optimization' | 'signal' | 'confirmation' | 'risk' | 'performance';
    title: string;
    description: string;
    code: string;
    priority: 'low' | 'medium' | 'high';
    impact: 'minor' | 'moderate' | 'major';
}

interface PerformanceInsight {
    type: 'positive' | 'warning' | 'info' | 'critical';
    title: string;
    description: string;
    confidence: string;
    action?: string;
}

interface MarketCondition {
    condition: 'bullish' | 'bearish' | 'sideways' | 'volatile';
    description: string;
    recommendation: string;
    timeframe: string;
    confidence: string;
}

interface BacktestRecommendation {
    timeframe: string;
    period: string;
    instruments: string[];
    parameters: string[];
    expectedWinRate: string;
    expectedProfitFactor: string;
    riskLevel: string;
}

interface RiskManagement {
    positionSize: string;
    stopLoss: string;
    takeProfit: string;
    maxDrawdown: string;
    portfolioAllocation: string;
    correlation: string;
}

interface EdgeBotIntelligenceProps {
    isDarkMode: boolean;
    selectedIndicators: any[];
    entryRules: any[];
    exitRules: any[];
    riskSettings: any;
    strategyIntent?: string;
    generatedCode?: string;
    activeTab: string;
    userInput?: string;
}

export const EdgeBotIntelligence: React.FC<EdgeBotIntelligenceProps> = ({
    isDarkMode,
    selectedIndicators,
    entryRules,
    exitRules,
    riskSettings,
    strategyIntent,
    generatedCode,
    activeTab,
    userInput
}) => {

    // Real-time strategy analysis
    const analyzeStrategyInRealTime = (): StrategyAnalysis => {
        const analysis: StrategyAnalysis = {
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

        return analysis;
    };

    // Market condition analysis
    const analyzeMarketConditions = (): MarketCondition[] => {
        const conditions: MarketCondition[] = [];

        if (strategyIntent) {
            switch (strategyIntent) {
                case 'momentum':
                    conditions.push({
                        condition: 'volatile',
                        description: 'Momentum strategies perform best in volatile markets with clear directional moves',
                        recommendation: 'Focus on high-volume periods and avoid ranging markets',
                        timeframe: '15m - 1h',
                        confidence: '85%'
                    });
                    conditions.push({
                        condition: 'bullish',
                        description: 'Momentum strategies excel in trending bull markets',
                        recommendation: 'Increase position size during strong uptrends',
                        timeframe: '4h - 1d',
                        confidence: '90%'
                    });
                    break;

                case 'trend':
                    conditions.push({
                        condition: 'bullish',
                        description: 'Trend strategies require sustained directional movement',
                        recommendation: 'Avoid choppy markets and focus on clear trends',
                        timeframe: '1h - 4h',
                        confidence: '88%'
                    });
                    conditions.push({
                        condition: 'sideways',
                        description: 'Trend strategies struggle in sideways markets',
                        recommendation: 'Reduce position size or switch to mean reversion',
                        timeframe: '4h - 1d',
                        confidence: '75%'
                    });
                    break;

                case 'mean-reversion':
                    conditions.push({
                        condition: 'sideways',
                        description: 'Mean reversion thrives in ranging markets',
                        recommendation: 'Focus on support/resistance levels',
                        timeframe: '1h - 4h',
                        confidence: '92%'
                    });
                    conditions.push({
                        condition: 'volatile',
                        description: 'Mean reversion works well in volatile but ranging markets',
                        recommendation: 'Use wider stops and smaller position sizes',
                        timeframe: '15m - 1h',
                        confidence: '80%'
                    });
                    break;

                case 'breakout':
                    conditions.push({
                        condition: 'volatile',
                        description: 'Breakout strategies need volatility for significant moves',
                        recommendation: 'Focus on high-impact news events and volume spikes',
                        timeframe: '5m - 15m',
                        confidence: '87%'
                    });
                    conditions.push({
                        condition: 'bullish',
                        description: 'Breakouts are more reliable in trending markets',
                        recommendation: 'Trade breakouts in the direction of the larger trend',
                        timeframe: '1h - 4h',
                        confidence: '85%'
                    });
                    break;
            }
        }

        return conditions;
    };

    // Backtesting recommendations
    const generateBacktestRecommendations = (): BacktestRecommendation[] => {
        const recommendations: BacktestRecommendation[] = [];

        if (strategyIntent) {
            switch (strategyIntent) {
                case 'momentum':
                    recommendations.push({
                        timeframe: '15m',
                        period: '6 months',
                        instruments: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
                        parameters: ['RSI(14)', 'EMA(20)', 'Volume > SMA(20)'],
                        expectedWinRate: '45-55%',
                        expectedProfitFactor: '1.8-2.2',
                        riskLevel: 'Medium'
                    });
                    recommendations.push({
                        timeframe: '1h',
                        period: '1 year',
                        instruments: ['ES', 'NQ', 'YM'],
                        parameters: ['RSI(21)', 'EMA(50)', 'ATR(14)'],
                        expectedWinRate: '50-60%',
                        expectedProfitFactor: '2.0-2.5',
                        riskLevel: 'Medium'
                    });
                    break;

                case 'trend':
                    recommendations.push({
                        timeframe: '4h',
                        period: '2 years',
                        instruments: ['EUR/USD', 'GBP/USD', 'Gold'],
                        parameters: ['EMA(20)', 'EMA(50)', 'VWAP'],
                        expectedWinRate: '40-50%',
                        expectedProfitFactor: '2.5-3.0',
                        riskLevel: 'Low'
                    });
                    break;

                case 'mean-reversion':
                    recommendations.push({
                        timeframe: '1h',
                        period: '1 year',
                        instruments: ['EUR/USD', 'USD/JPY', 'Gold'],
                        parameters: ['Bollinger Bands(20,2)', 'RSI(14)', 'VWAP'],
                        expectedWinRate: '55-65%',
                        expectedProfitFactor: '1.5-2.0',
                        riskLevel: 'Medium'
                    });
                    break;

                case 'breakout':
                    recommendations.push({
                        timeframe: '5m',
                        period: '3 months',
                        instruments: ['ES', 'NQ', 'EUR/USD'],
                        parameters: ['ATR(14)', 'Volume > 1.5x Avg', 'Price > Resistance'],
                        expectedWinRate: '35-45%',
                        expectedProfitFactor: '2.5-3.5',
                        riskLevel: 'High'
                    });
                    break;
            }
        }

        return recommendations;
    };

    // Advanced risk management
    const generateRiskManagement = (): RiskManagement => {
        const analysis = analyzeStrategyInRealTime();
        const hasVolatility = selectedIndicators.some(i => i.name === 'ATR');

        let positionSize = '1-2% per trade';
        let stopLoss = 'Fixed 2%';
        let takeProfit = '4% (2:1 ratio)';
        let maxDrawdown = '15-20%';
        let portfolioAllocation = '20-30% to this strategy';
        let correlation = 'Medium correlation with trend strategies';

        if (analysis.riskLevel === 'high') {
            positionSize = '0.5-1% per trade';
            stopLoss = '1.5% with ATR-based adjustment';
            maxDrawdown = '10-15%';
            portfolioAllocation = '10-15% to this strategy';
        }

        if (hasVolatility) {
            stopLoss = 'ATR-based dynamic stops';
            takeProfit = 'ATR-based dynamic targets';
        }

        if (strategyIntent === 'breakout') {
            positionSize = '0.5-1% per trade';
            stopLoss = 'ATR-based with wider stops';
            takeProfit = '3:1 or 4:1 reward ratio';
            maxDrawdown = '20-25%';
            correlation = 'Low correlation with other strategies';
        }

        if (strategyIntent === 'mean-reversion') {
            positionSize = '1-2% per trade';
            stopLoss = 'Bollinger Band-based stops';
            takeProfit = '1.5:1 or 2:1 ratio';
            maxDrawdown = '10-15%';
            correlation = 'Negative correlation with trend strategies';
        }

        return {
            positionSize,
            stopLoss,
            takeProfit,
            maxDrawdown,
            portfolioAllocation,
            correlation
        };
    };

    // Live code suggestions
    const generateCodeSuggestions = (): CodeSuggestion[] => {
        const suggestions: CodeSuggestion[] = [];

        // Analyze generated code for improvements
        if (generatedCode) {
            // Risk management suggestions
            if (generatedCode.includes('strategy.risk') && !generatedCode.includes('atr')) {
                suggestions.push({
                    type: 'risk',
                    title: 'Dynamic Risk Management',
                    description: 'Replace fixed stop loss with ATR-based dynamic stops for better risk management',
                    code: `// Replace fixed stop loss with ATR-based
atr_value = ta.atr(14)
stop_loss = close * (1 - atr_value * 2)
strategy.exit("Dynamic Stop", "Long", stop=stop_loss)`,
                    priority: 'high',
                    impact: 'major'
                });
            }

            // RSI optimization suggestions
            if (selectedIndicators.some(i => i.name === 'RSI') && !generatedCode.includes('rsi < 30')) {
                suggestions.push({
                    type: 'signal',
                    title: 'RSI Oversold Signal',
                    description: 'Add oversold condition for better entry timing and reduced false signals',
                    code: `// Add oversold condition for better entries
rsi_oversold = rsi < 30
rsi_overbought = rsi > 70
long_condition = rsi_oversold and price > ema`,
                    priority: 'medium',
                    impact: 'moderate'
                });
            }

            // Volume confirmation for VWAP
            if (selectedIndicators.some(i => i.name === 'VWAP') && !generatedCode.includes('volume')) {
                suggestions.push({
                    type: 'confirmation',
                    title: 'Volume Confirmation',
                    description: 'Add volume confirmation to validate VWAP signals and improve accuracy',
                    code: `// Add volume confirmation for VWAP signals
volume_sma = ta.sma(volume, 20)
volume_confirm = volume > volume_sma * 1.5
vwap_signal = close > vwap and volume_confirm`,
                    priority: 'medium',
                    impact: 'moderate'
                });
            }

            // Performance optimization
            if (generatedCode.includes('strategy.entry') && !generatedCode.includes('time_filter')) {
                suggestions.push({
                    type: 'performance',
                    title: 'Trading Hours Filter',
                    description: 'Add time-based filters to avoid trading during low-liquidity periods',
                    code: `// Add trading hours filter
is_trading_hours = (hour >= 9 and hour <= 16) or (hour >= 20 and hour <= 23)
long_condition = long_condition and is_trading_hours`,
                    priority: 'low',
                    impact: 'minor'
                });
            }
        }

        // Analyze user input in Advanced Setup
        if (userInput && activeTab === 'advanced') {
            const input = userInput.toLowerCase();

            if (input.includes('rsi') && !input.includes('oversold')) {
                suggestions.push({
                    type: 'signal',
                    title: 'RSI Signal Enhancement',
                    description: 'Consider adding oversold/overbought conditions to your RSI strategy',
                    code: `// Add RSI conditions
rsi_oversold = rsi < 30
rsi_overbought = rsi > 70
// Use in your entry conditions`,
                    priority: 'medium',
                    impact: 'moderate'
                });
            }

            if (input.includes('stop') && !input.includes('atr')) {
                suggestions.push({
                    type: 'risk',
                    title: 'Dynamic Stop Loss',
                    description: 'Consider using ATR for dynamic stop losses instead of fixed percentages',
                    code: `// Dynamic stop loss using ATR
atr_value = ta.atr(14)
stop_distance = atr_value * 2
stop_price = close - stop_distance`,
                    priority: 'high',
                    impact: 'major'
                });
            }

            if (input.includes('entry') && !input.includes('volume')) {
                suggestions.push({
                    type: 'confirmation',
                    title: 'Volume Confirmation',
                    description: 'Add volume confirmation to validate your entry signals',
                    code: `// Volume confirmation
volume_avg = ta.sma(volume, 20)
volume_confirm = volume > volume_avg * 1.2
// Add to your entry condition`,
                    priority: 'medium',
                    impact: 'moderate'
                });
            }
        }

        return suggestions;
    };

    // Strategy performance insights
    const generatePerformanceInsights = (): PerformanceInsight[] => {
        const analysis = analyzeStrategyInRealTime();
        const insights: PerformanceInsight[] = [];

        if (analysis.expectedPerformance === 'excellent') {
            insights.push({
                type: 'positive',
                title: 'High Performance Potential',
                description: 'Your strategy combination shows excellent potential for consistent returns. The momentum + trend confirmation is a proven approach.',
                confidence: '85%',
                action: 'Consider backtesting on multiple timeframes'
            });
        }

        if (analysis.riskLevel === 'high') {
            insights.push({
                type: 'critical',
                title: 'Risk Management Critical',
                description: 'Your strategy lacks proper risk management. Implement stop losses and position sizing immediately.',
                confidence: '95%',
                action: 'Add stop loss and reduce position size'
            });
        }

        if (analysis.complexity === 'complex') {
            insights.push({
                type: 'warning',
                title: 'Complexity Alert',
                description: 'Your strategy may be too complex, leading to signal conflicts and reduced performance.',
                confidence: '80%',
                action: 'Simplify by removing 1-2 indicators'
            });
        }

        if (selectedIndicators.some(i => i.name === 'VWAP')) {
            insights.push({
                type: 'positive',
                title: 'Institutional Edge',
                description: 'VWAP inclusion gives you access to institutional reference levels, improving entry timing.',
                confidence: '75%',
                action: 'Focus on VWAP-based entries during market hours'
            });
        }

        if (selectedIndicators.some(i => i.name === 'ATR')) {
            insights.push({
                type: 'positive',
                title: 'Adaptive Risk Management',
                description: 'ATR enables dynamic position sizing and stop losses based on market volatility.',
                confidence: '90%',
                action: 'Use ATR for dynamic stops and position sizing'
            });
        }

        return insights;
    };

    const analysis = analyzeStrategyInRealTime();
    const codeSuggestions = generateCodeSuggestions();
    const performanceInsights = generatePerformanceInsights();
    const marketConditions = analyzeMarketConditions();
    const backtestRecommendations = generateBacktestRecommendations();
    const riskManagement = generateRiskManagement();

    return (
        <div className="space-y-6 p-4">
            {/* Real-time Analysis Summary */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border-2 shadow-lg ${isDarkMode ? 'bg-slate-800/60 border-slate-600' : 'bg-white/80 border-slate-200'}`}
            >
                <div className="flex items-center gap-2 mb-3">
                    <Brain className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        AI Strategy Analysis
                    </h3>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`text-center p-4 rounded-xl border ${isDarkMode ? 'bg-slate-700/60 border-slate-600' : 'bg-gray-50/80 border-gray-200'}`}>
                        <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            Risk Level
                        </div>
                        <div className={`text-lg font-bold ${analysis.riskLevel === 'high' ? 'text-red-500' :
                            analysis.riskLevel === 'medium' ? 'text-yellow-500' : 'text-emerald-500'
                            }`}>
                            {analysis.riskLevel.toUpperCase()}
                        </div>
                    </div>

                    <div className={`text-center p-4 rounded-xl border ${isDarkMode ? 'bg-slate-700/60 border-slate-600' : 'bg-gray-50/80 border-gray-200'}`}>
                        <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            Complexity
                        </div>
                        <div className={`text-lg font-bold ${analysis.complexity === 'complex' ? 'text-red-500' :
                            analysis.complexity === 'moderate' ? 'text-yellow-500' : 'text-emerald-500'
                            }`}>
                            {analysis.complexity.toUpperCase()}
                        </div>
                    </div>

                    <div className={`text-center p-4 rounded-xl border ${isDarkMode ? 'bg-slate-700/60 border-slate-600' : 'bg-gray-50/80 border-gray-200'}`}>
                        <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            Performance
                        </div>
                        <div className={`text-lg font-bold ${analysis.expectedPerformance === 'excellent' ? 'text-emerald-500' :
                            analysis.expectedPerformance === 'good' ? 'text-blue-500' : 'text-red-500'
                            }`}>
                            {analysis.expectedPerformance.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Strengths & Weaknesses */}
                {analysis.strengths.length > 0 && (
                    <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                Strengths
                            </span>
                        </div>
                        <div className="space-y-1">
                            {analysis.strengths.map((strength, index) => (
                                <div key={index} className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    • {strength}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {analysis.weaknesses.length > 0 && (
                    <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                                Areas for Improvement
                            </span>
                        </div>
                        <div className="space-y-1">
                            {analysis.weaknesses.map((weakness, index) => (
                                <div key={index} className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    • {weakness}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Market Conditions Analysis */}
            {marketConditions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl border-2 shadow-lg ${isDarkMode ? 'bg-slate-800/60 border-slate-600' : 'bg-white/80 border-slate-200'}`}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Globe className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Market Conditions Analysis
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {marketConditions.map((condition, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-3 rounded-lg border ${condition.condition === 'bullish'
                                    ? isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                                    : condition.condition === 'bearish'
                                        ? isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                                        : condition.condition === 'volatile'
                                            ? isDarkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
                                            : isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium capitalize ${condition.condition === 'bullish'
                                        ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                        : condition.condition === 'bearish'
                                            ? isDarkMode ? 'text-red-400' : 'text-red-600'
                                            : condition.condition === 'volatile'
                                                ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                                                : isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                        }`}>
                                        {condition.condition} Market
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-400">{condition.timeframe}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {condition.confidence}
                                        </span>
                                    </div>
                                </div>
                                <p className={`text-sm mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    {condition.description}
                                </p>
                                <div className={`text-xs p-2 rounded ${isDarkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    💡 <strong>Recommendation:</strong> {condition.recommendation}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Backtesting Recommendations */}
            {backtestRecommendations.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl border-2 shadow-lg ${isDarkMode ? 'bg-slate-800/60 border-slate-600' : 'bg-white/80 border-slate-200'}`}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Backtesting Recommendations
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {backtestRecommendations.map((rec, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-3 rounded-lg border ${rec.riskLevel === 'Low'
                                    ? isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                                    : rec.riskLevel === 'High'
                                        ? isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                                        : isDarkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${rec.riskLevel === 'Low'
                                        ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                        : rec.riskLevel === 'High'
                                            ? isDarkMode ? 'text-red-400' : 'text-red-600'
                                            : isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                                        }`}>
                                        {rec.timeframe} - {rec.period}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${rec.riskLevel === 'Low'
                                        ? isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                        : rec.riskLevel === 'High'
                                            ? isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                                            : isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {rec.riskLevel} Risk
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <div>
                                        <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                            Expected Win Rate
                                        </div>
                                        <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                            {rec.expectedWinRate}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                            Profit Factor
                                        </div>
                                        <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                            {rec.expectedProfitFactor}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                        Recommended Instruments
                                    </div>
                                    <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                        {rec.instruments.join(', ')}
                                    </div>
                                </div>

                                <div>
                                    <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                        Key Parameters
                                    </div>
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                        {rec.parameters.join(', ')}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Advanced Risk Management */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border-2 shadow-lg ${isDarkMode ? 'bg-slate-800/60 border-slate-600' : 'bg-white/80 border-slate-200'}`}
            >
                <div className="flex items-center gap-2 mb-3">
                    <Shield className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Advanced Risk Management
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div>
                            <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                Position Size
                            </div>
                            <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                {riskManagement.positionSize}
                            </div>
                        </div>

                        <div>
                            <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                Stop Loss
                            </div>
                            <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                {riskManagement.stopLoss}
                            </div>
                        </div>

                        <div>
                            <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                Take Profit
                            </div>
                            <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                {riskManagement.takeProfit}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                Max Drawdown
                            </div>
                            <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                {riskManagement.maxDrawdown}
                            </div>
                        </div>

                        <div>
                            <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                Portfolio Allocation
                            </div>
                            <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                                {riskManagement.portfolioAllocation}
                            </div>
                        </div>

                        <div>
                            <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                Correlation
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                {riskManagement.correlation}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Live Code Suggestions */}
            {codeSuggestions.length > 0 && (activeTab === 'code' || activeTab === 'advanced') && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl border-2 shadow-lg ${isDarkMode ? 'bg-slate-800/60 border-slate-600' : 'bg-white/80 border-slate-200'}`}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Code className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Live Code Suggestions
                        </h3>
                        <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>

                    <div className="space-y-3">
                        {codeSuggestions.map((suggestion, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-3 rounded-lg border ${suggestion.priority === 'high'
                                    ? isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                                    : suggestion.priority === 'medium'
                                        ? isDarkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
                                        : isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className={`w-4 h-4 ${suggestion.priority === 'high' ? 'text-red-500' :
                                        suggestion.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                        }`} />
                                    <span className={`text-sm font-medium ${suggestion.priority === 'high'
                                        ? isDarkMode ? 'text-red-400' : 'text-red-600'
                                        : suggestion.priority === 'medium'
                                            ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                                            : isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                        }`}>
                                        {suggestion.title}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${suggestion.impact === 'major'
                                        ? isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                                        : suggestion.impact === 'moderate'
                                            ? isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                                            : isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {suggestion.impact} impact
                                    </span>
                                </div>
                                <p className={`text-sm mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    {suggestion.description}
                                </p>
                                <div className={`p-2 rounded text-xs font-mono ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {suggestion.code}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Performance Insights */}
            {performanceInsights.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl border-2 shadow-lg ${isDarkMode ? 'bg-slate-800/60 border-slate-600' : 'bg-white/80 border-slate-200'}`}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Performance Insights
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {performanceInsights.map((insight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-3 rounded-lg border ${insight.type === 'positive'
                                    ? isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                                    : insight.type === 'critical'
                                        ? isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                                        : insight.type === 'warning'
                                            ? isDarkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
                                            : isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${insight.type === 'positive'
                                        ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                        : insight.type === 'critical'
                                            ? isDarkMode ? 'text-red-400' : 'text-red-600'
                                            : insight.type === 'warning'
                                                ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                                                : isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                        }`}>
                                        {insight.title}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                        {insight.confidence} confidence
                                    </span>
                                </div>
                                <p className={`text-sm mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    {insight.description}
                                </p>
                                {insight.action && (
                                    <div className={`text-xs p-2 rounded ${isDarkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        💡 <strong>Action:</strong> {insight.action}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default EdgeBotIntelligence; 
