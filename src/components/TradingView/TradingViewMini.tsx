'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface TradingViewMiniProps {
  symbol?: string;
  width?: string;
  height?: string;
}

export function TradingViewMini({
  symbol = "NASDAQ:AAPL",
  width = "100%",
  height = "400px"
}: TradingViewMiniProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: width,
      height: height,
      locale: "en",
      dateRange: "12M",
      colorTheme: theme === 'dark' ? 'dark' : 'light',
      trendLineColor: "rgba(41, 98, 255, 1)",
      underLineColor: "rgba(41, 98, 255, 0.3)",
      underLineBottomColor: "rgba(41, 98, 255, 0)",
      isTransparent: false,
      autosize: true,
      largeChartUrl: ""
    });

    script.onload = () => setIsLoading(false);
    containerRef.current.appendChild(script);
  }, [symbol, theme, width, height]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ width, height }}
      />
    </div>
  );
}

export default TradingViewMini;
