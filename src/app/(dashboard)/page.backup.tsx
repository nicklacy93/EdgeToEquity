"use client";

import HeroSection from "@/components/dashboard/HeroSection";
import KPIGrid from "@/components/dashboard/KPIGrid";
import TradingViewChart from "@/components/TradingView/TradingViewChart";
import EdgeBotGreetingCard from "@/components/EdgeBot/EdgeBotGreetingCard";

export default function DashboardPage() {
  return (
    <div className="px-6 py-10 max-w-screen-xl mx-auto space-y-10">
      {/* Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Left Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white/10 dark:bg-zinc-900/50 shadow-lg p-6 backdrop-blur-sm border border-zinc-800">
            <EdgeBotGreetingCard />
          </div>

          <div className="rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg p-6 font-bold text-center text-xl tracking-tight">
            🔥 HeroSection is Active
          </div>

          <div className="rounded-2xl bg-black/40 p-6 backdrop-blur border border-zinc-800 shadow-xl">
            <KPIGrid />
          </div>
        </div>

        {/* Right AI Summary Card */}
        <div className="rounded-2xl bg-black/30 backdrop-blur p-6 border border-zinc-800 shadow-xl text-sm space-y-3 text-white">
          <h2 className="text-lg font-bold text-white">📊 AI Summary</h2>
          <p className="text-zinc-400">Last 3 trades reviewed</p>
          <p className="text-emerald-400">EdgeScore: 78%</p>
          <p className="text-purple-400">Bot Confidence: High</p>
          <hr className="border-zinc-700" />
          <p className="text-pink-400">🚩 Trade #3 flagged</p>
          <p className="text-yellow-300">📍 FVG setup detected</p>
          <p className="text-blue-300">📝 3 new trades journaled</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-black/30 backdrop-blur p-4 border border-zinc-800 shadow-lg">
        <TradingViewChart symbol="SPY" height={400} />
      </div>
    </div>
  );
}
