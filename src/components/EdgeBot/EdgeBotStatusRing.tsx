'use client';

export default function EdgeBotStatusRing() {
  return (
    <div className="relative w-16 h-16 animate-spin-slow">
      <div className="absolute inset-0 rounded-full border-[3px] border-purple-500 border-t-transparent animate-spin rounded-full" />
      <div className="absolute inset-[6px] bg-gradient-to-br from-purple-600 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
        🧠
      </div>
    </div>
  );
}
