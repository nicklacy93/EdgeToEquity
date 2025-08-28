'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { LayoutDashboard, LogIn, UserPlus, LogOut } from 'lucide-react';

export default function TopNav({ isAuthed }: { isAuthed: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="border-b border-[hsl(var(--border-hsl))] sticky top-0 z-50 bg-[hsl(var(--card-bg-hsl))]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/dashboard"
            className="text-2xl font-bold gradient-text hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
          >
            EdgeToEquity
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              aria-current={isActive('/dashboard') ? 'page' : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 ${isActive('/dashboard')
                  ? 'bg-[hsl(var(--primary-hsl))] text-white'
                  : 'text-[hsl(var(--text-main))] hover:bg-[hsl(var(--card-bg-hsl))]'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            {isAuthed ? (
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[hsl(var(--text-main))] hover:bg-[hsl(var(--card-bg-hsl))] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  aria-current={isActive('/auth/login') ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 ${isActive('/auth/login')
                      ? 'bg-[hsl(var(--primary-hsl))] text-white'
                      : 'text-[hsl(var(--text-main))] hover:bg-[hsl(var(--card-bg-hsl))]'
                    }`}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  aria-current={isActive('/auth/signup') ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 ${isActive('/auth/signup')
                      ? 'bg-[hsl(var(--primary-hsl))] text-white'
                      : 'text-[hsl(var(--text-main))] hover:bg-[hsl(var(--card-bg-hsl))]'
                    }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
