'use client';

import { getEdgeBotGreeting } from "@/lib/utils/getEdgeBotGreeting";
import { getContextualPrompts } from "@/lib/utils/contextualPrompts";

export default function EdgeBotGreetingCard() {
  // Static mock data — replace with real user stats from props or context
  const name = "Nick";
  const winRate = 0.68;
  const edgeScore = 0.78;

  const greeting = getEdgeBotGreeting({ name, winRate, edgeScore });
  const suggestions = getContextualPrompts(winRate);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-md p-8 shadow-[0_0_32px_8px_rgba(59,130,246,0.15)] rounded-2xl border bg-white/60 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl p-6 space-y-4 text-zinc-800 dark:text-white transition-all">
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-md p-8 shadow-[0_0_32px_8px_rgba(59,130,246,0.15)] text-xl font-bold tracking-tight">{greeting.greeting}</div>
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-md p-8 shadow-[0_0_32px_8px_rgba(59,130,246,0.15)] text-sm text-zinc-500 dark:text-zinc-400">{greeting.context}</div>
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-md p-8 shadow-[0_0_32px_8px_rgba(59,130,246,0.15)] text-xs text-purple-500 font-medium">{greeting.summary}</div>

      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-md p-8 shadow-[0_0_32px_8px_rgba(59,130,246,0.15)] mt-4 space-y-2">
        {suggestions.map((prompt, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-md p-8 shadow-[0_0_32px_8px_rgba(59,130,246,0.15)] text-sm bg-zinc-100 dark:bg-zinc-800/60 rounded-lg px-3 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-700/70 transition"
          >
            {prompt}
          </div>
        ))}
      </div>
    </div>
  );
}

// ? Add animated background gradient inside EdgeBot card
// ? Add motion.button to suggestion buttons for interactivity
