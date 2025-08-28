// ? Enhanced TradingViewChart with fallback & style
'use client';

import { useEffect, useRef } from 'react';

type Props = {
  symbol?: string;
  height?: number;
};

export default function TradingViewChart({ symbol = 'SPY', height = 400 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[symbol]],
      width: '100%',
      height,
      colorTheme: 'dark',
      locale: 'en'
    });

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);
  }, [symbol, height]);

  return (
    <div className='relative overflow-hidden rounded-xl border border-slate-700
                    bg-slate-800/50 shadow-lg p-2'>
      <div ref={containerRef} className='h-[400px]' />
      <div className='text-slate-400 text-xs text-center mt-2'>
        Track all markets on TradingView
      </div>
    </div>
  );
}
