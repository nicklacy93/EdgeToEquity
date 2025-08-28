"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Gauge, Target, ShieldCheck } from "lucide-react";
import KPIGrid from "@/components/dashboard/KPIGrid";
import SessionStats from "@/components/dashboard/SessionStats";
import SessionTools from "@/components/dashboard/SessionTools";

export default function PerformanceTab() {
  const [open, setOpen] = useState({
    kpis: true,
    stats: false,
    tools: false,
  });

  const toggleSection = (key: keyof typeof open) => {
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-800/40 backdrop-blur-sm">
        <button
          onClick={() => toggleSection("kpis")}
          className="w-full px-6 py-5 text-left flex items-center justify-between group hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-4">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">📊 Key Metrics</h3>
              <p className="text-sm text-slate-400">
                Track your performance and trading consistency over time
              </p>
            </div>
          </div>
          <div className="text-slate-400 group-hover:text-white text-xl">
            {open.kpis ? "−" : "+"}
          </div>
        </button>
        <AnimatePresence initial={false}>
          {open.kpis && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              <KPIGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Session Stats */}
      <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-800/40 backdrop-blur-sm">
        <button
          onClick={() => toggleSection("stats")}
          className="w-full px-6 py-5 text-left flex items-center justify-between group hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-4">
            <Gauge className="w-6 h-6 text-orange-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">🧠 Session Breakdown</h3>
              <p className="text-sm text-slate-400">
                Reflect on your recent trades and refine your edge
              </p>
            </div>
          </div>
          <div className="text-slate-400 group-hover:text-white text-xl">
            {open.stats ? "−" : "+"}
          </div>
        </button>
        <AnimatePresence initial={false}>
          {open.stats && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              <SessionStats />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Session Tools */}
      <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-800/40 backdrop-blur-sm">
        <button
          onClick={() => toggleSection("tools")}
          className="w-full px-6 py-5 text-left flex items-center justify-between group hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">⚙️ Risk & Tools</h3>
              <p className="text-sm text-slate-400">
                Monitor your risk levels and trading readiness
              </p>
            </div>
          </div>
          <div className="text-slate-400 group-hover:text-white text-xl">
            {open.tools ? "−" : "+"}
          </div>
        </button>
        <AnimatePresence initial={false}>
          {open.tools && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              <SessionTools />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
