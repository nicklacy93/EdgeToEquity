'use client';

import { ChatMessage } from '@/types/ChatTypes';

interface Props {
  messages: ChatMessage[];
}

export default function SessionSummaryPanel({ messages }: Props) {
  const totalMessages = messages.length;
  const coachingMessages = messages.filter(m => m.messageType === 'coaching');
  const avgConfidence = coachingMessages.length
    ? coachingMessages.reduce((sum, msg) => sum + (msg.confidenceScore ?? 0), 0) / coachingMessages.length
    : 0;

  const confidenceLabel = avgConfidence >= 0.9
    ? '?? Feeling Strong'
    : avgConfidence >= 0.75
    ? '?? Focused and Confident'
    : avgConfidence >= 0.5
    ? '?? Thoughtful & Steady'
    : avgConfidence >= 0.25
    ? '?? Cautious Today'
    : '??? Uncertain & Reflective';

  return (
    <div className="p-4 rounded-xl border bg-background shadow-md space-y-4 text-white">
      <h3 className="text-lg font-semibold">?? Session Pulse</h3>

      <div className="bg-black/40 p-3 rounded-lg border border-white/10">
        <p className="text-sm text-muted">Confidence Level:</p>
        <p className="font-medium text-base">{confidenceLabel}</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted">?? Total Messages: {totalMessages}</p>
        <p className="text-sm text-muted">?? Coaching Insights: {coachingMessages.length}</p>
      </div>

      <div className="text-xs text-muted italic">
        Insights adapt based on your tone, focus, and EdgeBot’s perceived conviction.
      </div>
    </div>
  );
}
