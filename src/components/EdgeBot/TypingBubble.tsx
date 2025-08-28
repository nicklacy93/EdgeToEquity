'use client';

export default function TypingBubble() {
  return (
    <div className='flex gap-1 items-center animate-pulse text-zinc-400 text-sm'>
      <div className='h-2 w-2 bg-zinc-400 rounded-full'></div>
      <div className='h-2 w-2 bg-zinc-400 rounded-full'></div>
      <div className='h-2 w-2 bg-zinc-400 rounded-full'></div>
    </div>
  );
}
