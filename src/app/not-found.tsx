import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background-hsl))]">
            <div className="text-center space-y-6 p-6">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-[#22c55e]">404</h1>
                    <h2 className="text-2xl font-semibold text-[hsl(var(--text-main))]">
                        Page Not Found
                    </h2>
                    <p className="text-[hsl(var(--text-muted))] max-w-md">
                        Sorry, we couldn't find the page you're looking for.
                        It might have been moved or doesn't exist.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#2563eb]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
                    >
                        Go to Dashboard
                    </Link>
                    <div className="text-sm text-[hsl(var(--text-muted))]">
                        Or <Link href="/landing" className="text-[#22c55e] hover:underline">go home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
