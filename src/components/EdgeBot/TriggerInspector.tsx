"use client";

import { coachingTriggers } from "@/utils/coachingTriggers";
import { ChatMessageWithMeta } from "@/types/ChatTypes";

interface Props {
  messages: ChatMessageWithMeta[];
  firedNudges: Set<string>;
}

export default function TriggerInspector({ messages, firedNudges }: Props) {
  const results = coachingTriggers
    .filter(t => firedNudges.has(t.tag))
    .map(t => {
      return {
        tag: t.tag,
        explanation: t.explanation || "Triggered rule",
      };
    });

  if (!results.length) return null;

  return (
    <div className="p-3 text-sm border-t">
      <h2 className="font-semibold text-base mb-2">?? Trigger Inspector</h2>
      <ul className="list-disc pl-4 space-y-1">
        {results.map((r) => (
          <li key={r.tag} className="text-xs text-muted-foreground">
            <strong>{r.tag}</strong>: {r.explanation}
          </li>
        ))}
      </ul>
    </div>
  );
}
