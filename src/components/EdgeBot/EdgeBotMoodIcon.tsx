"use client";

type Props = {
  mood: "focused" | "winning" | "caution" | "calm" | "warning";
};

const emojiMap = {
  focused: "🧠",
  winning: "🔥",
  caution: "⚠️",
  calm: "🧘",
  warning: "❗",
};

export default function EdgeBotMoodIcon({ mood }: Props) {
  const emoji = emojiMap[mood] || "🤖";
  return (
    <div className="text-3xl animate-pulse" title={mood}>
      {emoji}
    </div>
  );
}
