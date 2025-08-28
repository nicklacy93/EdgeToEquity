'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BottomNavigation, MobileHeader } from './BottomNavigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { pageTransitions, staggerChildren } from '@/utils/animations';

interface MobileDashboardProps {
  children: React.ReactNode;
  title: string;
}

export function MobileDashboard({ children, title }: MobileDashboardProps) {
  return (
    <div className="min-h-screen bg-background md:hidden">
      <MobileHeader 
        title={title}
        rightElement={<ThemeToggle />}
      />
      
      <motion.main
        initial="initial"
        animate="animate"
        variants={pageTransitions}
        className="pb-20"
      >
        <div className="h-[calc(100vh-3.5rem-5rem)] overflow-auto">
          <motion.div
            variants={staggerChildren}
            className="p-4 space-y-6"
          >
            {children}
          </motion.div>
        </div>
      </motion.main>

      <BottomNavigation />
    </div>
  );
}

export default MobileDashboard;
