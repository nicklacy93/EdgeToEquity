"use client";

import { useEffect, useState } from "react";
import { ChatMessageWithMeta } from "@/types/ChatTypes";
import { summarizeSession } from "@/utils/summarizeSession";

export default function AgentSessionSummary({
  agent,
  messages,
}: {
  agent: string;
  messages: ChatMessageWithMeta[];
}) {
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const load = async () => {
      const recent = messages.slice(-10);
      const result = await summarizeSession(agent, recent);
      setSummary(result.summary || "?? No summary available yet.");
    };
    load();
  }, [agent, messages]);

  return (
    <div className="p-4 text-sm space-y-2 bg-muted/30 rounded-lg border mt-4">
      <h2 className="font-semibold mb-2">?? Session Summary ({agent})</h2>
      <p>{summary}</p>
    </div>
  );
}
