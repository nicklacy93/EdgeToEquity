'use client';

export default function TypingIndicator() {
  return (
    <div className='flex gap-1'>
      <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></span>
      <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100'></span>
      <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200'></span>
    </div>
  );
}
