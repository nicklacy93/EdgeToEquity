"use client";

import React from 'react';
import { Brain, Lightbulb, Target, TrendingUp, Heart, Zap } from 'lucide-react';

interface EdgeBotCoachMessageProps {
    message: string;
    type?: 'tip' | 'encouragement' | 'warning' | 'celebration' | 'insight';
    timestamp?: string;
    isUser?: boolean;
}

const messageTypes = {
    tip: {
        icon: Lightbulb,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        iconColor: 'text-blue-400',
        label: 'Pro Tip'
    },
    encouragement: {
        icon: Heart,
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        iconColor: 'text-green-400',
        label: 'Encouragement'
    },
    warning: {
        icon: Target,
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        iconColor: 'text-yellow-400',
        label: 'Heads Up'
    },
    celebration: {
        icon: Zap,
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        iconColor: 'text-purple-400',
        label: 'Celebration'
    },
    insight: {
        icon: Brain,
        bgColor: 'bg-indigo-500/10',
        borderColor: 'border-indigo-500/30',
        iconColor: 'text-indigo-400',
        label: 'Insight'
    }
};

export default function EdgeBotCoachMessage({
    message,
    type = 'tip',
    timestamp,
    isUser = false
}: EdgeBotCoachMessageProps) {
    const config = messageTypes[type];
    const Icon = config.icon;

    if (isUser) {
        return (
            <div className="flex justify-end mb-4">
                <div className="max-w-xs lg:max-w-md">
                    <div className="bg-green-500 text-white p-3 rounded-lg rounded-br-sm">
                        <p className="text-sm">{message}</p>
                    </div>
                    {timestamp && (
                        <p className="text-xs text-slate-400 mt-1 text-right">
                            {timestamp}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start mb-4">
            <div className="max-w-xs lg:max-w-md">
                <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3`}>
                    <div className="flex items-start gap-2">
                        <div className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`}>
                            <Icon size={16} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium ${config.iconColor}`}>
                                    {config.label}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                {timestamp && (
                    <p className="text-xs text-slate-400 mt-1">
                        {timestamp}
                    </p>
                )}
            </div>
        </div>
    );
}