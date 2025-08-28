export function getRandomNudge(triggerType: keyof typeof coachingTriggers): string {
  const options = coachingTriggers[triggerType];
  return options[Math.floor(Math.random() * options.length)];
}
