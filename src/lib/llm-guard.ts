let pauseUntil = 0, fails = 0;
export function liveDown() { return Date.now() < pauseUntil; }
function ok() { fails = 0; }
function fail() { if (++fails >= 2) { pauseUntil = Date.now() + 60_000; fails = 0; } }

export async function withTimeout<T>(p: Promise<T>, ms=30000) {
  const t = setTimeout(() => { /* no signal used; rely on SDK timeouts */ }, ms);
  try { return await p; } finally { clearTimeout(t); }
}
export async function tryLive<T>(fn: () => Promise<T>) {
  try { const r = await withTimeout(fn()); ok(); return { ok: true as const, r }; }
  catch (e) { fail(); return { ok: false as const, e }; }
}
