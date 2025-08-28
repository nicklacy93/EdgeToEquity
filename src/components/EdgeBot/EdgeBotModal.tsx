"use client";

import { useState } from "react";

export default function EdgeBotModal() {
  const [open, setOpen] = useState(false);

  const prompts = {
    mindset: [
      "🧘 Mindset Reset — Process today's emotions and refocus",
      "🔁 Reframe your last loss into a learning opportunity",
    ],
    performance: [
      "📊 Deep Dive — Analyze your win/loss patterns",
      "📈 Trend Check — What changed in your metrics this week?",
    ],
    strategy: [
      "🚀 Optimize — Improve R:R based on recent trades",
      "🧠 Logic Debug — Did your strategy follow your rules?",
    ],
    psychology: [
      "🧪 Bias Detector — Were you overtrading or revenge trading?",
      "😰 Stress Signal — Was today an emotional decision or strategic one?",
    ],
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full p-4 text-white bg-gradient-to-tr from-purple-600 to-emerald-500 shadow-lg hover:scale-110 transition-all"
      >
        🤖
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-3xl transition-all space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">🧠 EdgeBot Assistant</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-red-500 hover:underline"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(prompts).map(([category, examples]) => (
                <div key={category} className="space-y-2">
                  <h3 className="font-semibold capitalize">{category}</h3>
                  <ul className="space-y-1">
                    {examples.map((text, i) => (
                      <li
                        key={i}
                        className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                      >
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
