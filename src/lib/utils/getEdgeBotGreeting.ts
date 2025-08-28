export function getEdgeBotGreeting({ name, edgeScore, winRate }: {
  name: string;
  edgeScore: number;
  winRate: number;
}) {
  const hour = new Date().getHours();

  const timeOfDay =
    hour < 12 ? "morning" :
    hour < 18 ? "afternoon" : "evening";

  const mood =
    winRate > 0.75 ? "🔥 You're on fire today!" :
    winRate > 0.5 ? "🚀 Solid progress — let's refine even more." :
    "🧘 Let’s analyze and reset together.";

  return {
    greeting: `Good ${timeOfDay}, ${name}!`,
    context: mood,
    summary: `EdgeScore: ${Math.round(edgeScore * 100)}% · WinRate: ${Math.round(winRate * 100)}%`
  };
}
