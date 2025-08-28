'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Helper: robust dark detection that works with:
 * - class="dark" on <html> or <body>
 * - data-theme="dark" on <html> or <body>
 * - system preference when no explicit theme set
 */
function detectDark(): boolean {
  if (typeof document === 'undefined') return false;
  const root = document.documentElement;
  const body = document.body;

  // Check for explicit dark mode indicators
  const hasDarkClass = root.classList.contains('dark') || body.classList.contains('dark');
  const hasDarkAttr = root.getAttribute('data-theme') === 'dark' || body.getAttribute('data-theme') === 'dark';

  // Check for explicit light mode indicators
  const hasLightClass = root.classList.contains('light') || body.classList.contains('light');
  const hasLightAttr = root.getAttribute('data-theme') === 'light' || body.getAttribute('data-theme') === 'light';

  // If explicitly dark, return true
  if (hasDarkClass || hasDarkAttr) {
    return true;
  }

  // If explicitly light, return false
  if (hasLightClass || hasLightAttr) {
    return false;
  }

  // Fall back to system preference
  const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  return systemPrefersDark;
}

/** Apply theme to DOM + persist */
function applyTheme(nextDark: boolean) {
  const root = document.documentElement;
  const body = document.body;

  // Remove existing theme classes
  root.classList.remove('dark', 'light');
  body.classList.remove('dark', 'light');

  // Add new theme classes
  root.classList.add(nextDark ? 'dark' : 'light');
  body.classList.add(nextDark ? 'dark' : 'light');

  // Set data attributes
  root.setAttribute('data-theme', nextDark ? 'dark' : 'light');
  body.setAttribute('data-theme', nextDark ? 'dark' : 'light');

  // Persist to localStorage
  try {
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
  } catch { }
}

/**
 * Try to load ./theme-toggle (your custom implementation) if present.
 * If it fails or exports nothing usable, we use a robust fallback button below.
 */
const DynamicThemeToggle = dynamic(async () => {
  try {
    const mod = await import('./theme-toggle');
    const Impl = (mod as any).ThemeToggle ?? (mod as any).default;
    if (Impl) return Impl;
  } catch {
    /* fall through to fallback */
  }

  function FallbackToggle() {
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Track OS changes and DOM mutations (class/data-theme)
    const mediaRef = useRef<MediaQueryList | null>(null);
    const observerRef = useRef<MutationObserver | null>(null);

    useEffect(() => {
      setMounted(true);

      // Initial state: prefer persisted, else detect
      try {
        const persisted = localStorage.getItem('theme');
        console.log('Initial theme - persisted:', persisted);
        if (persisted === 'dark') {
          applyTheme(true);
          setIsDark(true);
          console.log('Set initial theme to dark');
        } else if (persisted === 'light') {
          applyTheme(false);
          setIsDark(false);
          console.log('Set initial theme to light');
        } else {
          const d = detectDark();
          applyTheme(d);
          setIsDark(d);
          console.log('Set initial theme to detected:', d ? 'dark' : 'light');
        }
      } catch {
        const d = detectDark();
        applyTheme(d);
        setIsDark(d);
        console.log('Set initial theme to fallback detected:', d ? 'dark' : 'light');
      }

      // Listen to OS scheme changes
      mediaRef.current = window.matchMedia('(prefers-color-scheme: dark)');
      const onMedia = () => {
        // Only auto-adjust if user hasn't explicitly chosen (no localStorage)
        const persisted = localStorage.getItem('theme');
        if (!persisted) {
          const d = mediaRef.current!.matches;
          applyTheme(d);
          setIsDark(d);
          console.log('OS theme changed to:', d ? 'dark' : 'light');
        }
      };
      mediaRef.current.addEventListener?.('change', onMedia);

      // Observe DOM changes to class/attributes (for external togglers)
      observerRef.current = new MutationObserver(() => {
        const d = detectDark();
        console.log('DOM changed, detected theme:', d ? 'dark' : 'light');
        setIsDark(d);
      });
      observerRef.current.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });
      observerRef.current.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });

      return () => {
        mediaRef.current?.removeEventListener?.('change', onMedia);
        observerRef.current?.disconnect();
      };
    }, []);

    const label = useMemo(() => (isDark ? 'Dark' : 'Light'), [isDark]);

    if (!mounted) return null;

    console.log('Rendering with isDark:', isDark, 'label:', label);

    return (
      <button
        type="button"
        aria-label="Toggle theme"
        aria-pressed={isDark}
        onClick={() => {
          const next = !isDark;
          console.log('Toggle clicked, current:', isDark, 'next:', next);
          applyTheme(next);
          setIsDark(next);
          console.log('State updated to:', next);
        }}
        className="inline-flex items-center gap-2 rounded-md border border-[hsl(var(--border-hsl))] px-3 py-2 text-sm hover:bg-[hsl(var(--card-bg-hsl))] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
        title={label + ' mode'}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }

  // Next dynamic requires a component to return
  return FallbackToggle as any;
}, { ssr: false, loading: () => null });

export default function ThemeToggle() {
  return <DynamicThemeToggle />;
}
export { ThemeToggle };