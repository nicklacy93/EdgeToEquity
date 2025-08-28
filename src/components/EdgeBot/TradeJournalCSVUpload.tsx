'use client';

import { useState } from 'react';

interface Props {
  onDataParsed: (data: any[]) => void;
}

export default function TradeJournalCSVUpload({ onDataParsed }: Props) {
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        // Simple CSV parsing; replace with a robust CSV parser if needed
        const lines = text.trim().split('\\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: Record<string, string> = {};
          headers.forEach((header, idx) => {
            obj[header.trim()] = values[idx]?.trim() || '';
          });
          return obj;
        });
        onDataParsed(data);
        setError(null);
      } catch (e) {
        setError('Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className='my-4'>
      <label className='block mb-1 font-semibold'>Upload Trade Journal CSV:</label>
      <input type='file' accept='.csv' onChange={handleFileChange} />
      {error && <div className='text-red-500 mt-2'>{error}</div>}
    </div>
  );
}
