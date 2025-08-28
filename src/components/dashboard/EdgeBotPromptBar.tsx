'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEdgeBot } from '@/hooks/useEdgeBot';

const suggestions = [
  'What was my biggest mistake today?',
  'Summarize my trade logic',
  'Which rules did I break?',
];

export default function EdgeBotPromptBar() {
  const [input, setInput] = useState('');
  const { loading, response, askEdgeBot } = useEdgeBot();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    await askEdgeBot(input.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-gradient p-6 rounded-2xl shadow-xl mb-6"
    >
      <h2 className="text-lg font-semibold text-white mb-2">🤖 Ask EdgeBot Anything</h2>
      <input
        className="w-full p-3 futuristic-input"
        placeholder="e.g. What did I do wrong on Trade #3?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <div className="mt-3 flex flex-wrap gap-3">
        {suggestions.map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(prompt);
              askEdgeBot(prompt);
            }}
            className="text-sm bg-white/10 text-white px-4 py-2 rounded-full hover:bg-emerald-500/30 transition glow-hover"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-[50px] text-white">
        {loading ? (
          <span className="animate-pulse text-emerald-300">EdgeBot is thinking...</span>
        ) : (
          response && <p className="whitespace-pre-line text-sm text-white/90">{response}</p>
        )}
      </div>
    </motion.div>
  );
}
