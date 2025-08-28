'use client';

export default function EdgeBotActivityWidget() {
  return (
    <div className="hidden lg:flex items-center gap-2 text-sm glass-card p-3 shadow-lg border dark:border-white/10 border-black/10">
      <div className="edgebot-pulse"></div>
      <span className="text-black dark:text-white font-medium">EdgeBot is monitoring...</span>
    </div>
  );
}
