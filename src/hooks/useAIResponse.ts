'use client';

import { useState } from 'react';
import { ChatMessage } from '@/types/ChatTypes';
import { fetchAIResponse } from '@/utils/aiApi';

export default function useAIResponse() {
  const [loading, setLoading] = useState(false);

  const getAIReply = async (messages: ChatMessage[], prompt: string) => {
    setLoading(true);
    try {
      const reply = await fetchAIResponse(messages, prompt);
      return reply;
    } catch (err) {
      console.error('AI fetch failed:', err);
      return 'Hmm, something went wrong. Please try again.';
    } finally {
      setLoading(false);
    }
  };

  return { getAIReply, loading };
}
