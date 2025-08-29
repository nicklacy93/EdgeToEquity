'use client';

interface ErrorFallbackProps {
    error?: Error;
    resetErrorBoundary?: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background-hsl))]">
            <div className="text-center space-y-6 p-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-[hsl(var(--text-main))]">
                        Something went wrong
                    </h1>
                    <p className="text-[hsl(var(--text-muted))] max-w-md">
                        {error?.message || 'An unexpected error occurred. Please try again.'}
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={resetErrorBoundary || (() => window.location.reload())}
                        className="inline-flex items-center px-6 py-3 bg-[#22c55e] text-white rounded-lg hover:bg-[#22c55e]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
                    >
                        Try Again
                    </button>
                    <div className="text-sm text-[hsl(var(--text-muted))]">
                        Or <button onClick={() => window.location.href = '/dashboard'} className="text-[#2563eb] hover:underline">go to dashboard</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
