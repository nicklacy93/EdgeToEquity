'use client';

import * as React from 'react';

// Minimal, dependency-free toggle that just flips the 'dark' class on <html>.
// Safe placeholder: no external contexts, no dynamic imports.
// Replace later with your full-featured toggle.

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  const toggle = React.useCallback(() => {
    const el = document.documentElement;
    const next = !el.classList.contains('dark');
    el.classList.toggle('dark', next);
    setIsDark(next);
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-sm hover:bg-black/[.03] dark:hover:bg-white/10"
    >
      <span className="mr-2">{isDark ? '🌙' : '☀️'}</span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}

export default ThemeToggle;