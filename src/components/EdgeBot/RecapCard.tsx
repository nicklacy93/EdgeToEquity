"use client";

interface Props {
  summary: string;
}

export default function RecapCard({ summary }: Props) {
  return (
    <div className="bg-background border rounded-xl shadow-md p-4 space-y-2 max-w-xl">
      <h3 className="text-lg font-semibold text-purple-500">?? Session Recap</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-line">{summary}</p>
    </div>
  );
}
