'use client';

import { useSessionSummary } from "@/hooks/useSessionSummary";

export default function SessionSummary() {
  const { summary } = useSessionSummary();

  return (
    <div className="bg-muted rounded-xl p-4 text-white shadow space-y-1">
      <h3 className="text-sm font-semibold text-purple-300">?? Session Summary</h3>
      <p className="text-sm">??? Exchanges: {summary.totalExchanges}</p>
      <p className="text-sm">?? Last Input: "{summary.mostRecent}"</p>
      <p className="text-sm">?? Top Topics: {summary.topTopics.join(", ") || "N/A"}</p>
    </div>
  );
}
