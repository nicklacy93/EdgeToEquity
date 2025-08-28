'use client';

import React from 'react';

interface TradeJournalResultsProps {
  result: string;
  loading: boolean;
  error?: string;
}

export default function TradeJournalResults({ result, loading, error }: TradeJournalResultsProps) {
  if (loading) {
    return <div className='p-4 text-center'>Analyzing your trades, please wait...</div>;
  }

  if (error) {
    return <div className='p-4 text-red-600 font-semibold'>Error: {error}</div>;
  }

  return (
    <div className='p-4 whitespace-pre-wrap bg-gray-50 rounded-md border'>
      {result}
    </div>
  );
}
