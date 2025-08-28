"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion/client';
import {
    BarChart,
    Code,
    Stethoscope,
    Brain,
    BookOpen,
    TrendingUp
} from "lucide-react";

interface NavigationItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    color: 'emerald' | 'blue' | 'amber';
}

interface AppNavigationProps {
    className?: string;
    orientation?: 'horizontal' | 'vertical';
}

export default function AppNavigation({
    className = '',
    orientation = 'horizontal'
}: AppNavigationProps) {
    const pathname = usePathname();

    const navigationItems: NavigationItem[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: BarChart,
            href: '/dashboard',
            color: 'emerald'
        },
        {
            id: 'strategy-architect',
            label: 'Strategy Architect',
            icon: Code,
            href: '/strategy/architect',
            color: 'blue'
        },
        {
            id: 'strategy-doctor',
            label: 'Strategy Doctor',
            icon: Stethoscope,
            href: '/strategy/doctor',
            color: 'amber'
        },
        {
            id: 'psychology',
            label: 'Psychology Coach',
            icon: Brain,
            href: '/psychology',
            color: 'blue'
        },
        {
            id: 'journal',
            label: 'Trade Journal',
            icon: BookOpen,
            href: '/journal',
            color: 'emerald'
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: TrendingUp,
            href: '/analytics',
            color: 'blue'
        }
    ];

    // Get color classes for navigation items
    const getNavItemColors = (color: string, isActive: boolean) => {
        const baseClasses = isActive
            ? 'bg-slate-800/60 border-slate-600/50'
            : 'hover:bg-slate-800/30 border-transparent';

        const colorClasses = {
            emerald: isActive
                ? 'text-emerald-400 border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-400',
            blue: isActive
                ? 'text-blue-400 border-blue-500/30'
                : 'text-slate-400 hover:text-blue-400',
            amber: isActive
                ? 'text-amber-400 border-amber-500/30'
                : 'text-slate-400 hover:text-amber-400'
        };

        return `${baseClasses} ${colorClasses[color as keyof typeof colorClasses]}`;
    };

    // Check if a navigation item is active
    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    const containerClasses = orientation === 'horizontal'
        ? 'flex items-center space-x-2'
        : 'flex flex-col space-y-2';

    return (
        <nav className={`${containerClasses} ${className}`}>
            {navigationItems.map((item) => {
                const active = isActive(item.href);
                const IconComponent = item.icon;

                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${getNavItemColors(item.color, active)}`}
                    >
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium truncate">
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
