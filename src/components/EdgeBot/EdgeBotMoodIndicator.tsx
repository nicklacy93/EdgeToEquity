'use client';
import { motion } from "framer-motion/client";
import { Tooltip } from "@/components/ui/tooltip";

interface EdgeBotMoodIndicatorProps {
  mood: "confident" | "focused" | "supportive" | "alert" | "neutral";
}

const moodColors: Record<string, string> = {
  confident: "bg-emerald-500",
  focused: "bg-blue-400",
  supportive: "bg-amber-400",
  alert: "bg-red-500",
  neutral: "bg-gray-400",
};

const pulseVariants = {
  confident: {
    animate: {
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity },
    },
  },
  focused: {
    animate: {
      scale: 1,
      transition: { duration: 0 },
    },
  },
  supportive: {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  },
  alert: {
    animate: {
      scale: [1, 1.15, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
  },
  neutral: {
    animate: {
      scale: 1,
      transition: { duration: 0 },
    },
  },
};

export function EdgeBotMoodIndicator({ mood }: EdgeBotMoodIndicatorProps) {
  return (
    <Tooltip content={`EdgeBot is currently ${mood}`}>
      <motion.div
        className={`w-4 h-4 rounded-full shadow-md ${moodColors[mood]}`}
        variants={pulseVariants}
        animate="animate"
        initial={false}
      />
    </Tooltip>
  );
}

