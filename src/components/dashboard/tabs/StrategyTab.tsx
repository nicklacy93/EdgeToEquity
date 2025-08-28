"use client";

import { useState } from "react";
import { Sparkles, BugPlay, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStrategyStore } from "@/store/strategyStore";
import SectionHeader from "@/components/shared/SectionHeader";
import StrategyGenerator from "@/components/strategy/StrategyGenerator";
import StrategyDebugger from "@/components/strategy/StrategyDebugger";
import StrategyExplainer from "@/components/strategy/StrategyExplainer";
import TradingViewChart from "@/components/dashboard/TradingViewChart";

export default function StrategyTab() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    generator: true,
    debugger: false,
    explainer: false
  });

  const selectedStrategy = useStrategyStore((state) => state.selectedStrategy);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Generator */}
      <SectionHeader
        icon={Sparkles}
        title="Build Your Edge"
        description="Describe your trading idea and watch it come to life"
        isOpen={openSections.generator}
        onToggle={() => toggleSection("generator")}
      />
      <AnimatePresence>
        {openSections.generator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700"
          >
            <StrategyGenerator />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strategy Chart Preview */}
      {selectedStrategy && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700"
        >
          <div className="mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h4 className="text-md font-semibold text-white">📈 Strategy Chart Preview</h4>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            See how your strategy idea might look on a live chart. This is a visual approximation.
          </p>
          <TradingViewChart />
        </motion.div>
      )}

      {/* Debugger */}
      <SectionHeader
        icon={BugPlay}
        title="Perfect Your Logic"
        description="Let EdgeBot spot issues and optimize your approach"
        isOpen={openSections.debugger}
        onToggle={() => toggleSection("debugger")}
      />
      <AnimatePresence>
        {openSections.debugger && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700"
          >
            <StrategyDebugger />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explainer */}
      <SectionHeader
        icon={Lightbulb}
        title="Understand Your Strategy"
        description="Get a clear breakdown of your code in plain English"
        isOpen={openSections.explainer}
        onToggle={() => toggleSection("explainer")}
      />
      <AnimatePresence>
        {openSections.explainer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700"
          >
            <StrategyExplainer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
