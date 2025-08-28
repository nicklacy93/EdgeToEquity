"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Smile, Frown, Meh, Zap } from 'lucide-react';

interface EdgeBotMoodRingProps {
    mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'focused';
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
}

const moodConfig = {
    happy: {
        color: 'from-yellow-400 to-orange-500',
        icon: Smile,
        label: 'Happy'
    },
    neutral: {
        color: 'from-blue-400 to-blue-600',
        icon: Meh,
        label: 'Neutral'
    },
    sad: {
        color: 'from-gray-400 to-gray-600',
        icon: Frown,
        label: 'Sad'
    },
    excited: {
        color: 'from-pink-400 to-purple-500',
        icon: Zap,
        label: 'Excited'
    },
    focused: {
        color: 'from-green-400 to-green-600',
        icon: Heart,
        label: 'Focused'
    }
};

export default function EdgeBotMoodRing({ 
    mood, 
    size = 'md', 
    animated = true 
}: EdgeBotMoodRingProps) {
    const [isVisible, setIsVisible] = useState(false);
    const config = moodConfig[mood];
    const Icon = config.icon;

    useEffect(() => {
        setIsVisible(true);
    }, [mood]);

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const iconSizes = {
        sm: 16,
        md: 24,
        lg: 32
    };

    return (
        <div className={`${sizeClasses[size]} relative`}>
            {/* Mood Ring */}
            <div className={`w-full h-full rounded-full bg-gradient-to-r ${config.color} ${
                animated ? 'animate-pulse' : ''
            } flex items-center justify-center shadow-lg`}>
                <Icon 
                    size={iconSizes[size]} 
                    className="text-white drop-shadow-sm" 
                />
            </div>
            
            {/* Mood Label */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    {config.label}
                </span>
            </div>
        </div>
    );
}