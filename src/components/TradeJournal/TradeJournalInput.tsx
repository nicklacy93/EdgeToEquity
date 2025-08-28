'use client';

import React, { useState } from 'react';

interface TradeJournalInputProps {
  onSubmit: (data: string) => void;
}

export default function TradeJournalInput({ onSubmit }: TradeJournalInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <div className='p-4 border rounded-md'>
      <h3 className='mb-2 font-semibold'>Upload or Paste Your Trade Journal Data</h3>
      <textarea
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON or CSV trade data here"
        className='w-full border p-2 rounded-md'
      />
      <button
        onClick={handleSubmit}
        className='mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
      >
        Analyze Trades
      </button>
    </div>
  );
}
