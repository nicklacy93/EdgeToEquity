'use client';

import { useState } from 'react';
import Papa from 'papaparse';

export default function CSVUpload({ onData }: { onData: (rows: any[]) => void }) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('CSV parsing error. Please check your file format.');
        } else {
          setError(null);
          onData(results.data);
        }
      },
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-2">
      <input type="file" accept=".csv" onChange={handleFileChange} className="text-sm" />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
