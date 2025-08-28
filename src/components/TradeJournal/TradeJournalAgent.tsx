'use client';

import { useEffect, useState } from 'react';
import { PersonalityProfile } from '@/types/ChatTypes';
import { sendToAI } from '@/utils/sendToAI';

interface TradeJournalAgentProps {
  personality: PersonalityProfile;
  journalData?: any[] | null;
}

export default function TradeJournalAgent({ personality, journalData }: TradeJournalAgentProps) {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatJournalSample = (rows: any[]) => {
    const sample = rows.slice(0, 5);
    return \I uploaded a trading journal with \ entries. Here are the first 5:\n\n\ +
      sample.map((row, i) => \Entry \: \\).join('\n');
  };

  useEffect(() => {
    const analyzeJournal = async () => {
      if (!journalData || journalData.length === 0) return;

      const prompt = formatJournalSample(journalData);
      setLoading(true);
      setError(null);

      try {
        const result = await sendToAI(prompt, 'journal', personality);
        setAiResponse(result.content);
      } catch (err) {
        setError('?? Failed to analyze journal. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    analyzeJournal();
  }, [journalData]);

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <h3 className="text-lg font-semibold">Trade Journal Insights</h3>
      {loading && <p>?? Analyzing your journal...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {aiResponse && <p className="whitespace-pre-wrap text-sm">{aiResponse}</p>}
      {!loading && !aiResponse && <p className="text-sm text-muted-foreground">Upload a CSV journal to get started.</p>}
    </div>
  );
}
