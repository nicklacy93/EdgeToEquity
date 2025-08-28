'use client';

import { ChatMessage } from '@/types/ChatTypes';

interface Props {
  messages: ChatMessage[];
}

export default function EdgeMemorySidebar({ messages }: Props) {
  const highlights = messages.filter(msg => msg.messageType === 'coaching' && msg.confidenceScore && msg.confidenceScore >= 0.75);

  const getConfidencePhrase = (score: number) => {
    if (score >= 0.9) return '?? Strong Conviction';
    if (score >= 0.75) return '?? Confident Insight';
    if (score >= 0.5) return '?? Considered Thought';
    return '??? Low Certainty';
  };

  return (
    <div className="p-4 border-t border-white/10 space-y-3 text-white">
      <h3 className="text-md font-semibold mb-2">?? Bookmarked Insights</h3>

      {highlights.length === 0 && (
        <p className="text-sm text-muted">No high-confidence insights yet.</p>
      )}

      {highlights.map((msg, index) => (
        <div
          key={index}
          className="bg-[#141414] border border-purple-500/30 p-3 rounded-xl space-y-1 shadow-sm"
        >
          <p className="text-sm italic">"{msg.message}"</p>
          <p className="text-xs text-purple-400">{getConfidencePhrase(msg.confidenceScore ?? 0)}</p>
        </div>
      ))}
    </div>
  );
}
