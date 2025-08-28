'use client';

import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-slate-700 rounded-full animate-pulse" />
    );
  }

  return <ThemeToggleInner />;
}

function ThemeToggleInner() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        isDark 
          ? 'bg-slate-700 hover:bg-slate-600 focus:ring-blue-500' 
          : 'bg-amber-400 hover:bg-amber-300 focus:ring-amber-500'
      }`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Toggle ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Track Gradient Overlay */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-800 to-slate-600 opacity-100' 
          : 'bg-gradient-to-r from-amber-300 to-yellow-400 opacity-100'
      }`} />
      
      {/* Sliding Toggle */}
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform flex items-center justify-center ${
          isDark
            ? 'translate-x-0.5 bg-slate-900 shadow-slate-900/50'
            : 'translate-x-7 bg-white shadow-amber-500/30'
        }`}
      >
        {/* Icon Container */}
        <div className={`transition-all duration-300 transform ${
          isDark ? 'rotate-0 scale-100' : 'rotate-180 scale-110'
        }`}>
          {isDark ? (
            // Moon Icon
            <svg 
              className="w-3.5 h-3.5 text-blue-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" 
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // Sun Icon
            <svg 
              className="w-3.5 h-3.5 text-amber-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      
      {/* Optional: Small stars/sparkles for dark mode */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1 right-2 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse"></div>
          <div className="absolute top-3 right-1 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-pulse delay-500"></div>
        </div>
      )}
    </button>
  );
}