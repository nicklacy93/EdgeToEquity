'use client';

import { useState } from 'react';

export function useEdgeBot() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const askEdgeBot = async (question: string) => {
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('/api/edgebot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
      });
      const data = await res.json();
      setResponse(data.reply || 'No response.');
    } catch (err) {
      setResponse('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, response, askEdgeBot };
}
