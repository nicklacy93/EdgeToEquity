'use client';

import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Create account</h1>
            {/* TODO: wire real signup */}
            <form
                onSubmit={(e) => { e.preventDefault(); document.cookie = 'auth-token=dummy; path=/'; window.location.href = '/dashboard'; }}
                className="space-y-4"
            >
                <input className="w-full border rounded p-2" placeholder="Name" />
                <input className="w-full border rounded p-2" placeholder="Email" />
                <input className="w-full border rounded p-2" placeholder="Password" type="password" />
                <button className="w-full rounded-md bg-[#22c55e] text-white py-2">Sign up</button>
            </form>
            <p className="text-sm mt-4">
                Already have an account? <Link href="/auth/login" className="text-[#2563eb] underline">Sign in</Link>
            </p>
        </div>
    );
}
