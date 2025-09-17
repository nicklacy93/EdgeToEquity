'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function TopNav() {
    return (
        <nav className="border-b border-[hsl(var(--border-hsl))] bg-[hsl(var(--card-bg-hsl))]">
            <div className="max-w-7xl mx-auto h-12 px-4 flex items-center justify-between">
                <Link href="/dashboard" className="font-semibold">EdgeToEquity</Link>
                <div className="flex items-center gap-3">
                    <Link href="/landing" className="text-sm hover:underline">Landing</Link>
                    <Link href="/auth/login" className="text-sm hover:underline">Login</Link>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
