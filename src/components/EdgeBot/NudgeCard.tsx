'use client';

interface NudgeCardProps {
  message: string;
}

export default function NudgeCard({ message }: NudgeCardProps) {
  return (
    <div className='bg-amber-100 dark:bg-amber-900 text-sm p-3 rounded-md shadow-sm border-l-4 border-amber-500 my-2'>
      ?? {message}
    </div>
  );
}
