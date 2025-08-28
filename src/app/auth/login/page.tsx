'use client';

import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
            {/* TODO: wire real auth */}
            <form
                onSubmit={(e) => { e.preventDefault(); document.cookie = 'auth-token=dummy; path=/'; window.location.href = '/dashboard'; }}
                className="space-y-4"
            >
                <input className="w-full border rounded p-2" placeholder="Email" />
                <input className="w-full border rounded p-2" placeholder="Password" type="password" />
                <button className="w-full rounded-md bg-[#2563eb] text-white py-2">Sign in</button>
            </form>
            <p className="text-sm mt-4">
                No account? <Link href="/auth/signup" className="text-[#2563eb] underline">Sign up</Link>
            </p>
        </div>
    );
}
