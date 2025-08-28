"use client";

import { motion } from "framer-motion";
import { Brain, BarChart3, Target } from "lucide-react";

interface Props {
  activeTab: "strategy" | "performance" | "psychology";
  setActiveTab: (tab: "strategy" | "performance" | "psychology") => void;
}

export default function WorkspaceTabs({ activeTab, setActiveTab }: Props) {
  const tabs = [
    { id: "strategy", label: "Strategy", icon: Target },
    { id: "performance", label: "Performance", icon: BarChart3 },
    { id: "psychology", label: "Psychology", icon: Brain },
  ];

  return (
    <div className="flex items-center gap-4 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const TabIcon = tab.icon;

        return (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`relative px-5 py-2 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2
              ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-400 text-white"
                  : "bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }
            `}
          >
            <TabIcon className="w-4 h-4" />
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 rounded-full"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
