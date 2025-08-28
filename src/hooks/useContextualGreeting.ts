export function useContextualGreeting(username: string, mood: string) {
  const hour = new Date().getHours();
  const isMorning = hour < 12;
  const isEvening = hour >= 17;

  if (mood === "drawdown") return `Hey ${username}, rough day yesterday. Ready to reset?`;
  if (mood === "streak") return `You're on fire, ${username}! What’s next?`;

  if (isMorning) return `Morning, ${username}. Ready to dive into today’s trades?`;
  if (isEvening) return `Evening, ${username}. Want to review today’s session?`;

  return `Hey ${username}, what's on your mind right now?`;
}
