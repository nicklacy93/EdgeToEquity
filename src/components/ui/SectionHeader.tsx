"use client";

import { motion } from "framer-motion/client";
import { cn } from "@/lib/utils"; // optional utility for merging classNames

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  icon,
  className
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("mb-6", className)}
    >
      <div className="flex items-center gap-3 mb-1">
        {icon && (
          <div className="w-9 h-9 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-slate-700/50">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-slate-400 text-sm leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}
