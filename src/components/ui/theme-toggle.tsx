'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const isDark =
      root.classList.contains('dark') ||
      root.getAttribute('data-theme') === 'dark' ||
      window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setDark(!!isDark);
  }, []);

  if (!mounted) return null;

  const toggle = () => {
    const root = document.documentElement;
    const next = !dark;
    setDark(next);
    root.classList.toggle('dark', next);
    root.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border hover:bg-[hsl(var(--card-bg-hsl))] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      <span className="text-sm">{dark ? 'Dark' : 'Light'}</span>
    </button>
  );
}