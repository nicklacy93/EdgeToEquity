"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface TradingViewChartProps {
  symbol?: string;
  theme?: "dark" | "light";
  width?: string | number;
  height?: string | number;
}

export default function TradingViewChart({
  symbol = "NASDAQ:AAPL",
  theme = "dark",
  width = "100%",
  height = 500,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (typeof window.TradingView !== "undefined" && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol,
          interval: "15",
          timezone: "Etc/UTC",
          theme,
          style: "1",
          locale: "en",
          toolbar_bg: "rgba(0, 0, 0, 0)",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview-chart",
        });
      }
    };

    containerRef.current?.appendChild(script);

    return () => {
      containerRef.current?.innerHTML && (containerRef.current.innerHTML = "");
    };
  }, [symbol, theme]);

  return (
    <motion.div
      className="w-full relative bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        id="tradingview-chart"
        ref={containerRef}
        style={{ width, height }}
        className="relative"
      >
        <div className="flex items-center justify-center h-full text-slate-400 text-sm p-4">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Loading TradingView Chart...
        </div>
      </div>
    </motion.div>
  );
}
