'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function TradingViewWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Clear existing widget
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Load TradingView Advanced Chart with FULL functionality
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          container_id: "tradingview_widget",
          autosize: true,
          symbol: "OANDA:EURUSD",
          interval: "15",
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: theme === 'dark' ? "#1e293b" : "#ffffff",
          enable_publishing: false,
          
          // ENABLE ALL TRADINGVIEW FEATURES
          hide_top_toolbar: false,        // Show full toolbar with symbol search
          hide_side_toolbar: false,       // Show drawing tools, indicators
          allow_symbol_change: true,      // Enable symbol search - THIS IS KEY!
          details: true,                  // Show market details
          hotlist: true,                  // Show market movers
          calendar: true,                 // Economic calendar
          news: ['headlines'],            // Market news
          withdateranges: true,          // Date range selector
          
          // Studies/Indicators
          studies: [
            "MACD@tv-basicstudies",
            "RSI@tv-basicstudies",
            "EMA@tv-basicstudies"
          ],
          
          // Professional features
          saved_charts: true,
          watchlist: ['stocks', 'forex', 'crypto'],
          
          // Styling
          backgroundColor: theme === 'dark' ? "#0f172a" : "#ffffff",
          gridColor: theme === 'dark' ? "#374151" : "#e5e7eb",
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [theme]);

  return (
    <div className="w-full h-full">
      <div id="tradingview_widget" ref={containerRef} className="w-full h-full min-h-[500px]" />
    </div>
  );
}

declare global {
  interface Window {
    TradingView: any;
  }
}