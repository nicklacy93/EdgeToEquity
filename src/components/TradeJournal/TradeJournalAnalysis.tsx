"use client";
import React from "react";

export default function TradeJournalAnalysis({ insights }: { insights: string }) {
  return (
    <div className="p-4 border rounded bg-muted space-y-2">
      <h3 className="font-semibold">Trade Journal Insights</h3>
      <pre className="whitespace-pre-wrap">{insights}</pre>
    </div>
  );
}
