'use client';

export default function EmotionQuickReplies({ onSelect }) {
  const replies = [
    { label: '🧘 I\'m calm and focused', value: 'calm' },
    { label: '😰 Feeling nervous', value: 'nervous' },
    { label: '📊 What do you see in this setup?', value: 'analysis' },
    { label: '💪 Ready to pull the trigger', value: 'confident' },
    { label: '🤔 Something feels off', value: 'uncertain' }
  ];

  return (
    <div className="flex gap-2 flex-wrap mt-4">
      {replies.map((r, i) => (
        <button key={i} onClick={() => onSelect(r.value)}
          className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm text-white shadow">
          {r.label}
        </button>
      ))}
    </div>
  );
}
