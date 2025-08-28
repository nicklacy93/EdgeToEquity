'use client';

import { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
}

export default function TradeJournalOnboardingTooltip({ onClose }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide tooltip after 10 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className='p-4 bg-blue-900 text-white rounded shadow-md max-w-md mx-auto mt-4'>
      <h3 className='font-bold mb-2'>Welcome to the Trade Journal!</h3>
      <p>Upload your trading history CSV or enter trades manually to get personalized insights and coaching.</p>
      <button
        className='mt-3 px-3 py-1 bg-blue-700 rounded hover:bg-blue-600'
        onClick={() => {
          setVisible(false);
          onClose();
        }}
      >
        Got it!
      </button>
    </div>
  );
}
