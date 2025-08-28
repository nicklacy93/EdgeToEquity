'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Quick Mock Components for Social Media Demo
export function QuickJournalEntry() {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');

  const handleSave = () => {
    // Mock save functionality
    alert(`Journal entry saved! Mood: ${mood}, Entry: ${entry.substring(0, 50)}...`);
    setEntry('');
    setMood('');
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">📝 Quick Journal Entry</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            How are you feeling?
          </label>
          <select 
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option value="">Select mood...</option>
            <option value="confident">😎 Confident</option>
            <option value="excited">🚀 Excited</option>
            <option value="neutral">😐 Neutral</option>
            <option value="anxious">😰 Anxious</option>
            <option value="frustrated">😤 Frustrated</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Journal Entry
          </label>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="What happened in your trading today? Any insights or lessons learned?"
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white h-32 resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!mood || !entry.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          Save Entry
        </button>
      </div>
    </div>
  );
}

export function StrategyLanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('pinescript');
  
  const languages = [
    { id: 'pinescript', name: 'Pine Script', description: 'TradingView (Most Popular)', icon: '📊' },
    { id: 'python', name: 'Python', description: 'Custom/Jupyter Notebooks', icon: '🐍' },
    { id: 'ninjascript', name: 'NinjaScript', description: 'NinjaTrader Platform', icon: '🥷' },
    { id: 'mql', name: 'MQL4/5', description: 'MetaTrader Platform', icon: '📈' },
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">⚙️ Code Language</h3>
      
      <div className="space-y-3">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setSelectedLanguage(lang.id)}
            className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
              selectedLanguage === lang.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lang.icon}</span>
              <div>
                <h4 className="text-white font-semibold">{lang.name}</h4>
                <p className="text-slate-400 text-sm">{lang.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function MobileSyncExplanation() {
  const router = useRouter();
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">📱 Cross-Device Sync</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white">💻</span>
          </div>
          <div>
            <h4 className="text-white font-semibold">Desktop Trading</h4>
            <p className="text-slate-400 text-sm">Full-featured platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white">📱</span>
          </div>
          <div>
            <h4 className="text-white font-semibold">Mobile Alerts</h4>
            <p className="text-slate-400 text-sm">Real-time notifications</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white">☁️</span>
          </div>
          <div>
            <h4 className="text-white font-semibold">Cloud Backup</h4>
            <p className="text-slate-400 text-sm">Strategies & settings synced</p>
          </div>
        </div>
        
        <button
          onClick={() => alert('Mobile app coming soon! Join our waitlist.')}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg transition-all hover:scale-105"
        >
          Join Mobile Waitlist
        </button>
      </div>
    </div>
  );
}

export function BacktestingPreview() {
  const [isRunning, setIsRunning] = useState(false);
  
  const runBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      alert('Backtest completed! Win Rate: 73.2%, Profit Factor: 2.34, Max Drawdown: -4.1%');
    }, 3000);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">📊 Quick Backtest</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Start Date
            </label>
            <input
              type="date"
              defaultValue="2024-01-01"
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              End Date
            </label>
            <input
              type="date"
              defaultValue="2024-12-31"
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            />
          </div>
        </div>
        
        <button
          onClick={runBacktest}
          disabled={isRunning}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
        >
          {isRunning ? '⏳ Running Backtest...' : '▶️ Run Backtest'}
        </button>
        
        {isRunning && (
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-slate-300">Analyzing 12 months of data...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}