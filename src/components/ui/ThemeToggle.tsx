'use client';
import dynamic from 'next/dynamic';

const Impl = dynamic(
  () => import('./theme-toggle').then(m => (m as any).ThemeToggle ?? (m as any).default ?? (() => null)),
  { ssr: false }
);
export const ThemeToggle = Impl;
export default Impl;