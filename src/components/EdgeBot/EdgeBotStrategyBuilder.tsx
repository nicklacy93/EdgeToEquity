"use client";

import React, { useState } from 'react';
import { 
    X, 
    Send, 
    Sparkles, 
    Code, 
    Lightbulb, 
    Target,
    TrendingUp,
    Brain,
    Zap
} from 'lucide-react';

interface EdgeBotStrategyBuilderProps {
    isOpen: boolean;
    onClose: () => void;
}

const strategyTemplates = [
    {
        id: 'moving-average',
        name: 'Moving Average Crossover',
        description: 'Buy when short MA crosses above long MA, sell when it crosses below',
        icon: TrendingUp,
        difficulty: 'Beginner'
    },
    {
        id: 'rsi-oversold',
        name: 'RSI Oversold Strategy',
        description: 'Buy when RSI is oversold (< 30), sell when overbought (> 70)',
        icon: Target,
        difficulty: 'Intermediate'
    },
    {
        id: 'breakout',
        name: 'Breakout Strategy',
        description: 'Buy when price breaks above resistance, sell when it breaks below support',
        icon: Zap,
        difficulty: 'Advanced'
    }
];

export default function EdgeBotStrategyBuilder({ isOpen, onClose }: EdgeBotStrategyBuilderProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [customDescription, setCustomDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false);
            // Handle strategy generation
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Strategy Builder
                            </h2>
                            <p className="text-sm text-slate-400">
                                Let me help you build a trading strategy
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Strategy Templates */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                            Choose a Template
                        </h3>
                        <div className="grid gap-3">
                            {strategyTemplates.map((template) => {
                                const Icon = template.icon;
                                return (
                                    <div
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                            selectedTemplate === template.id
                                                ? 'border-green-500 bg-green-500/10'
                                                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                selectedTemplate === template.id
                                                    ? 'bg-green-500'
                                                    : 'bg-slate-700'
                                            }`}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-white font-medium">
                                                        {template.name}
                                                    </h4>
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        template.difficulty === 'Beginner'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : template.difficulty === 'Intermediate'
                                                            ? 'bg-yellow-500/20 text-yellow-400'
                                                            : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                        {template.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Strategy */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-blue-400" />
                            Or Describe Your Own Strategy
                        </h3>
                        <textarea
                            value={customDescription}
                            onChange={(e) => setCustomDescription(e.target.value)}
                            placeholder="Describe your trading strategy idea... (e.g., 'Buy when the 20-period moving average crosses above the 50-period moving average, and sell when it crosses below')"
                            className="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Strategy Details */}
                    {(selectedTemplate || customDescription) && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5 text-green-400" />
                                Strategy Details
                            </h3>
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <p className="text-sm text-slate-300">
                                    {selectedTemplate 
                                        ? strategyTemplates.find(t => t.id === selectedTemplate)?.description
                                        : customDescription
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-slate-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={!selectedTemplate && !customDescription.trim()}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                            (!selectedTemplate && !customDescription.trim()) || isGenerating
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Generate Strategy
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}