"use client";

export default function Error({
  error,
  reset,
}: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-[50vh] grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-xl font-semibold mb-2">Something went wrong.</h1>
        <p className="opacity-70 mb-4">{error?.message}</p>
        <button
          onClick={() => {
            // clear the hash so we don't immediately throw again
            if (typeof window !== "undefined") window.location.hash = "";
            reset();
          }}
          className="px-3 py-2 rounded-md border hover:bg-slate-100"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
