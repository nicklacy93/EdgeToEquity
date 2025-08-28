// Types
type Mood = "confident" | "focused" | "alert" | "supportive" | "neutral";

interface EdgeBotContext {
  recentWin?: boolean;
  focusScore?: number;
  stressLevel?: number;
}

// Determines the trader's mood based on context
function calculateMood(context: EdgeBotContext): Mood {
  if (context.recentWin) return "confident";
  if ((context.focusScore ?? 0) > 80) return "focused";
  if ((context.stressLevel ?? 0) > 75) return "alert";
  if ((context.stressLevel ?? 0) < 40) return "supportive";
  return "neutral";
}

// Message shown based on mood
function getContextualMessage(mood: Mood): string {
  switch (mood) {
    case "confident":
      return "Great job! Let’s keep the momentum going.";
    case "focused":
      return "You’re locked in. Stay on target.";
    case "alert":
      return "Caution. Take a step back and reassess.";
    case "supportive":
      return "Let’s rebuild together. You’ve got this.";
    case "neutral":
    default:
      return "Let’s make today count.";
  }
}

// Color/emoji theme for mood UI
function getMoodTheme(mood: Mood) {
  switch (mood) {
    case "confident":
      return {
        color: "#10B981",
        bg: "bg-emerald-100",
        emoji: "🚀",
      };
    case "focused":
      return {
        color: "#6366F1",
        bg: "bg-indigo-100",
        emoji: "🎯",
      };
    case "alert":
      return {
        color: "#F59E0B",
        bg: "bg-amber-100",
        emoji: "⚠️",
      };
    case "supportive":
      return {
        color: "#3B82F6",
        bg: "bg-blue-100",
        emoji: "🤝",
      };
    case "neutral":
    default:
      return {
        color: "#9CA3AF",
        bg: "bg-gray-100",
        emoji: "🧠",
      };
  }
}

// ✅ Clean export block
export {
  calculateMood,
  getContextualMessage,
  getMoodTheme,
  EdgeBotContext,
  Mood,
};
