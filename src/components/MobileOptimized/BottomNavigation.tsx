'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  PieChart 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomNavItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/strategies', label: 'Strategies', icon: TrendingUp },
  { href: '/dashboard/psychology', label: 'Psychology', icon: Brain },
  { href: '/dashboard/analytics', label: 'Analytics', icon: PieChart },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden">
      <nav className="flex justify-around items-center py-2 px-4 safe-area-inset-bottom">
        {bottomNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                "min-h-[48px] min-w-[48px] px-2 py-1",
                "rounded-lg transition-all duration-200",
                "touch-manipulation", // Optimize for touch
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <item.icon 
                  className={cn(
                    "h-5 w-5 mb-1",
                    isActive && "text-primary"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs font-medium",
                    isActive && "text-primary"
                  )}
                >
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="bottomActiveIndicator"
                    className="absolute top-0 left-1/2 w-8 h-1 bg-primary rounded-full"
                    style={{ translateX: '-50%' }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function MobileHeader({ title, rightElement }: { 
  title: string; 
  rightElement?: React.ReactNode; 
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-semibold truncate">{title}</h1>
        {rightElement}
      </div>
    </header>
  );
}

export default BottomNavigation;
