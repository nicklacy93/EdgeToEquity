'use client';

import { useOnboarding } from '@/context/OnboardingContext';
import { useAuth } from '@/context/AuthContext';

export default function WelcomeModal() {
  const { showWelcomeModal, dismissWelcomeModal, skipOnboarding } = useOnboarding();
  const { user } = useAuth();

  if (!showWelcomeModal) return null;

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-transparent" />
        
        <div className="relative">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {getTimeBasedGreeting()}, {user?.name}!
            </h1>
            
            <p className="text-slate-300 text-lg">
              Welcome to your personal AI trading cockpit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="text-white font-semibold mb-1">Psychology AI</h3>
              <p className="text-slate-400 text-sm">Master your mindset</p>
            </div>
            
            <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-white font-semibold mb-1">Strategy Builder</h3>
              <p className="text-slate-400 text-sm">AI-powered strategies</p>
            </div>
            
            <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-white font-semibold mb-1">Performance Tracking</h3>
              <p className="text-slate-400 text-sm">Track your edge</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={dismissWelcomeModal}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105"
            >
              🎯 Start Your Journey
            </button>
            
            <button
              onClick={skipOnboarding}
              className="px-8 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-all"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
