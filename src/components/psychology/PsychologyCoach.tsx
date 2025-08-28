'use client';

import { useState, useEffect } from 'react';

interface MoodEntry {
  timestamp: number;
  mood: string;
  confidence: number;
  notes: string;
}

export default function PsychologyCoach() {
  const [currentMood, setCurrentMood] = useState<string>('');
  const [mentalEdgeScore, setMentalEdgeScore] = useState(87);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);

  const moods = [
    { emoji: '😎', name: 'Confident', color: 'from-blue-500 to-blue-600' },
    { emoji: '🚀', name: 'Excited', color: 'from-purple-500 to-pink-500' },
    { emoji: '😐', name: 'Neutral', color: 'from-gray-500 to-gray-600' },
    { emoji: '😰', name: 'Anxious', color: 'from-yellow-500 to-orange-500' },
    { emoji: '😤', name: 'Frustrated', color: 'from-red-500 to-red-600' },
    { emoji: '😨', name: 'Fearful', color: 'from-red-600 to-red-700' }
  ];

  const handleMoodSelection = (mood: string) => {
    setCurrentMood(mood);
    const newEntry: MoodEntry = {
      timestamp: Date.now(),
      mood,
      confidence: Math.floor(Math.random() * 30) + 70, // Simulate confidence score
      notes: ''
    };
    setMoodHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">🧠</span>
          Psychology Coach
        </h1>
        <p className="text-slate-400">Master your trading mindset with AI-powered psychological insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Tracker */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">How are you feeling about trading today?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {moods.map((mood) => (
              <button
                key={mood.name}
                onClick={() => handleMoodSelection(mood.name)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  currentMood === mood.name
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <div className="text-white font-medium">{mood.name}</div>
              </button>
            ))}
          </div>

          {/* Assessment Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-xs">📝</span>
                Quick Psychology Assessment
              </h3>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                🧠
              </div>
              <p className="text-slate-300 mb-6">
                Take a 2-minute assessment to get personalized trading psychology insights
              </p>
              <button 
                onClick={() => setShowAssessment(true)}
                className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Mental Edge Score & Insights */}
        <div className="space-y-6">
          {/* Mental Edge Score */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Mental Edge Score</h3>
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full"></div>
                <div className="absolute inset-3 bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-400">{mentalEdgeScore}</span>
                </div>
              </div>
              <div className="text-green-400 font-bold mb-1">Optimal Zone</div>
              <div className="text-sm text-slate-400 mb-4">+5 from yesterday</div>
            </div>
          </div>

          {/* Pattern Detection */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-xs">🔍</span>
              Pattern Detection
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-500">⚠️</span>
                  <span className="text-yellow-500 font-medium">FOMO Risk</span>
                </div>
                <p className="text-sm text-slate-300">You tend to overtrade on green days</p>
              </div>
              
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-500">✅</span>
                  <span className="text-green-500 font-medium">Good Discipline</span>
                </div>
                <p className="text-sm text-slate-300">95% stop loss adherence this week</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-xs">⚡</span>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2">
                <span>🧘</span>
                <span>Mindfulness Break</span>
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2">
                <span>📊</span>
                <span>View Mood History</span>
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2">
                <span>📝</span>
                <span>Trading Journal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Modal */}
      {showAssessment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Psychology Assessment</h3>
              <button
                onClick={() => setShowAssessment(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🧠</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Assessment Coming Soon</h4>
              <p className="text-slate-300 mb-6">
                Our AI-powered psychology assessment will analyze your trading patterns, 
                emotional triggers, and provide personalized insights to improve your mental edge.
              </p>
              <button
                onClick={() => setShowAssessment(false)}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}