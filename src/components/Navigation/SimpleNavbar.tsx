'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import {
  Home,
  MessageSquare,
  TrendingUp,
  Brain,
  PieChart,
  Zap,
  Sun,
  Moon
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'AI Coach', href: '/chat', icon: MessageSquare },
  { name: 'Strategies', href: '/strategies', icon: TrendingUp },
  { name: 'Psychology', href: '/psychology', icon: Brain },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
];

export function SimpleNavbar() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b bg-background/70">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center space-x-2 text-xl font-bold text-primary">
          <Zap className="h-8 w-8 text-blue-500" />
          <span>EdgeToEquity</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 text-sm hover:underline transition-colors ${
                  isActive ? 'text-blue-500 font-medium' : 'text-foreground/80'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border hover:bg-muted transition-colors"
            aria-label="Toggle Theme"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default SimpleNavbar;
