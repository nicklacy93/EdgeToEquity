export function getPersonalizedGreeting(user: { firstName: string }, performance: number) {
  const timeOfDay = getTimeOfDay();
  const status = performance > 0.7
    ? "🔥 You're on fire today!"
    : "🔎 Let's find your next edge together.";

  return {
    greeting: `Good ${timeOfDay}, ${user.firstName}!`,
    status,
    suggestions: [
      "🧠 Mindset Reset – Regroup after today’s trades",
      "📈 Performance Deep Dive – Explore win/loss logic",
      "🔬 Optimize Strategy – Review missed setups"
    ]
  };
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
