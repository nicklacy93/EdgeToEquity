"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Sparkles,
    Stethoscope,
    Menu,
    X,
    User
} from 'lucide-react';

interface ShellNavigationProps {
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
}

const ShellNavigation: React.FC<ShellNavigationProps> = ({
    sidebarCollapsed,
    toggleSidebar
}) => {
    const pathname = usePathname();

    const navItems = [
        {
            href: '/dashboard',
            icon: BarChart3,
            label: 'Dashboard',
            isActive: pathname === '/dashboard'
        },
        {
            href: '/strategy/architect',
            icon: Sparkles,
            label: 'Strategy Architect',
            isActive: pathname === '/strategy/architect'
        },
        {
            href: '/strategy/doctor',
            icon: Stethoscope,
            label: 'Strategy Doctor',
            isActive: pathname === '/strategy/doctor'
        }
    ];

    return (
        <div className={`bg-slate-900 border-r border-slate-700 transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
                {!sidebarCollapsed && (
                    <h2 className="text-lg font-semibold text-white">
                        EdgeToEquity
                    </h2>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                item.isActive
                                    ? 'bg-green-500 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <Icon size={20} />
                            {!sidebarCollapsed && (
                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                Demo User
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                Intermediate Trader
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShellNavigation;