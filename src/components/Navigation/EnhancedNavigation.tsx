'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  PieChart, 
  Settings,
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/chat', label: 'AI Coach', icon: MessageSquare },
  { href: '/dashboard/strategies', label: 'Strategies', icon: TrendingUp },
  { href: '/dashboard/psychology', label: 'Psychology', icon: Brain },
  { href: '/dashboard/analytics', label: 'Analytics', icon: PieChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface EnhancedNavigationProps {
  className?: string;
  isMobile?: boolean;
}

export function EnhancedNavigation({ className, isMobile = false }: EnhancedNavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-xl z-50 md:hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">EdgeToEquity</h2>
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <MobileNavItem
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <nav className={cn("space-y-2", className)}>
      {navigationItems.map((item) => (
        <NavItem key={item.href} item={item} pathname={pathname} />
      ))}
    </nav>
  );
}

function NavItem({ item, pathname }: { item: typeof navigationItems[0], pathname: string }) {
  const isActive = pathname === item.href;

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Link
        href={item.href}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive && "bg-primary text-primary-foreground shadow-lg"
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span className="font-medium">{item.label}</span>
        
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute right-0 w-1 h-8 bg-primary-foreground rounded-l-full"
          />
        )}
      </Link>
    </motion.div>
  );
}

function MobileNavItem({ 
  item, 
  pathname, 
  onClick 
}: { 
  item: typeof navigationItems[0], 
  pathname: string,
  onClick: () => void 
}) {
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 px-4 py-4 rounded-lg transition-all",
        "hover:bg-accent hover:text-accent-foreground",
        "touch-manipulation", // Optimize for touch
        isActive && "bg-primary text-primary-foreground"
      )}
    >
      <item.icon className="h-6 w-6" />
      <span className="text-lg font-medium">{item.label}</span>
    </Link>
  );
}

export default EnhancedNavigation;
