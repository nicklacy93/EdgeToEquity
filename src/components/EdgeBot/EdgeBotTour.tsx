"use client";

import React, { useState, useEffect } from 'react';
import {
    X,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Sparkles,
    Brain,
    Zap,
    Target,
    BookOpen,
    BarChart3
} from 'lucide-react';

interface EdgeBotTourProps {
    isOpen: boolean;
    onClose: () => void;
}

const tourSteps = [
    {
        id: 'welcome',
        title: 'Welcome to EdgeToEquity!',
        description: 'Your AI-powered trading strategy platform. Let me show you around.',
        icon: Sparkles,
        position: 'center'
    },
    {
        id: 'dashboard',
        title: 'Dashboard Overview',
        description: 'Track your trading performance, strategies, and learning progress all in one place.',
        icon: BarChart3,
        position: 'top-left'
    },
    {
        id: 'strategy-builder',
        title: 'Strategy Architect',
        description: 'Build and optimize trading strategies with AI assistance. Describe what you want, and I\'ll help you code it.',
        icon: Brain,
        position: 'top-center'
    },
    {
        id: 'strategy-doctor',
        title: 'Strategy Doctor',
        description: 'Debug and improve your existing strategies. Upload your code and I\'ll analyze it for issues.',
        icon: Zap,
        position: 'top-right'
    },
    {
        id: 'learning',
        title: 'Learning Center',
        description: 'Access tutorials, explanations, and educational content to improve your trading knowledge.',
        icon: BookOpen,
        position: 'bottom-left'
    },
    {
        id: 'complete',
        title: 'You\'re All Set!',
        description: 'Ready to start building and improving your trading strategies. I\'m here to help whenever you need me.',
        icon: CheckCircle,
        position: 'center'
    }
];

export default function EdgeBotTour({ isOpen, onClose }: EdgeBotTourProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setCurrentStep(0);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const nextStep = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const skipTour = () => {
        onClose();
    };

    if (!isVisible) return null;

    const step = tourSteps[currentStep];
    const Icon = step.icon;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                {step.title}
                            </h2>
                            <p className="text-sm text-slate-400">
                                Step {currentStep + 1} of {tourSteps.length}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={skipTour}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-slate-300 leading-relaxed mb-6">
                        {step.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>Progress</span>
                            <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex justify-center gap-2 mb-6">
                        {tourSteps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentStep
                                        ? 'bg-green-500'
                                        : index < currentStep
                                            ? 'bg-blue-500'
                                            : 'bg-slate-600'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-slate-700">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentStep === 0
                                ? 'text-slate-500 cursor-not-allowed'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <ArrowLeft size={16} />
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={skipTour}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Skip Tour
                        </button>
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                            {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                            {currentStep < tourSteps.length - 1 && <ArrowRight size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}