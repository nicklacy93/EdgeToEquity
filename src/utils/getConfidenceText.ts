export function getConfidenceText(score: number) {
  if (score >= 0.9) return 'Strong Conviction 💪';
  if (score >= 0.75) return 'Feeling Confident ✅';
  if (score >= 0.5) return 'Cautious Optimism 🤔';
  if (score >= 0.25) return 'Low Confidence 😕';
  return 'Very Uncertain ⚠️';
}
