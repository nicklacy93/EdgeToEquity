"use client";
import { useState } from "react";

export default function TradeJournalUpload({ onTradesUploaded }: { onTradesUploaded: (trades: any[]) => void }) {
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      // Simple CSV parse (comma separated, header assumed)
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",");
      const trades = lines.slice(1).map((line) => {
        const values = line.split(",");
        const trade: any = {};
        headers.forEach((header, i) => {
          trade[header.trim()] = values[i].trim();
        });
        return trade;
      });
      onTradesUploaded(trades);
    } catch (e) {
      setError("Failed to parse CSV file.");
    }
  };

  return (
    <div className="p-4 border rounded space-y-2">
      <label className="block font-semibold">Upload Trade Journal CSV</label>
      <input type="file" accept=".csv" onChange={handleFile} className="border p-1 rounded" />
      {error && <div className="text-red-600">{error}</div>}
      <small>CSV format: Date, Symbol, Quantity, Price, Side, etc.</small>
    </div>
  );
}
