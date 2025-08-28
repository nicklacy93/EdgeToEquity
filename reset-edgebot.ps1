# reset-edgebot.ps1
param (
    [string]$ComponentPath = "src/components/EdgeBot.tsx"
)

$component = @"
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const EdgeBot: React.FC = () => {
  const { user } = useAuth();
  const greeting = user?.name ? \`Hello, \${user.name}! Ready to dominate today?\` : "Welcome to EdgeBot!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300 rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold mb-4">{greeting}</h2>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <motion.button whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white font-semibold shadow">
          📊 Show My Most Traded Setup
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-semibold shadow">
          🧘 Start Mindset Reset
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white font-semibold shadow">
          🧪 Run Quick Backtest
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white font-semibold shadow">
          📈 Performance Timeline Review
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EdgeBot;
"@

Set-Content -Path $ComponentPath -Value $component -Encoding UTF8
Write-Host "✅ EdgeBot.tsx has been rebuilt with glass morphism, greeting, and animated buttons"
