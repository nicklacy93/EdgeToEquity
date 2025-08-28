'use client';

import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

export function Tooltip({ children, text }: TooltipProps) {
  return (
    <div className="group relative cursor-pointer">
      {children}
      <span className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-50 whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}
