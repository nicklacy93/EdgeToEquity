export function getContextualPrompts(winRate: number) {
  if (winRate > 0.75) {
    return [
      "📈 What made today so effective?",
      "🔥 How can I double down on my winning setup?",
      "🧠 Did I follow my process or improvise?"
    ];
  }

  if (winRate > 0.5) {
    return [
      "📊 What minor tweaks could improve my edge?",
      "🧘 What caused hesitation or emotional entries?",
      "📌 Did I exit with logic or impulse?"
    ];
  }

  return [
    "🔍 What’s the root cause of my losses?",
    "🧠 What was my mindset before each trade?",
    "💡 What lessons can I extract from today?"
  ];
}
