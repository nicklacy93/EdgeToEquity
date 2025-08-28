"use client";

interface ConfidenceBadgeProps {
  score: number;
}

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  let label = "Low", color = "bg-red-500";
  if (score >= 0.7) {
    label = "High";
    color = "bg-green-500";
  } else if (score >= 0.4) {
    label = "Medium";
    color = "bg-yellow-400 text-black";
  }

  return (
    <div className={`absolute top-1 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </div>
  );
}
