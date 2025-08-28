"use client";

export default function EdgeBotThinkingDots() {
  return (
    <div className="flex gap-1 justify-center items-center text-2xl h-8">
      <span className="animate-bounce [animation-delay:-0.3s]">.</span>
      <span className="animate-bounce [animation-delay:-0.15s]">.</span>
      <span className="animate-bounce">.</span>
    </div>
  );
}
