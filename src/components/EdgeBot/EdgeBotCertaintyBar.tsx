"use client";

type Props = {
  confidence: number; // 0 to 1
};

export default function EdgeBotCertaintyBar({ confidence }: Props) {
  const percent = Math.round(confidence * 100);
  let color = "bg-gray-400";

  if (confidence > 0.8) color = "bg-emerald-400";
  else if (confidence > 0.5) color = "bg-amber-400";
  else color = "bg-red-400";

  return (
    <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mt-2">
      <div
        className={`${color} h-full transition-all duration-300`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}
