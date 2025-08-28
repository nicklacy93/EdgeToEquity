export function routeToAgent(input: string): string {
  const message = input.toLowerCase();

  if (/(strategy|generate|create|build)/.test(message)) return 'strategy_generator';
  if (/(psychology|emotional|fomo|stress|revenge)/.test(message)) return 'psychology_analyzer';
  if (/(explain|what is|how does|define)/.test(message)) return 'strategy_explainer';
  if (/(debug|fix|problem|issue|wrong)/.test(message)) return 'ai_debugger';

  return 'strategy_explainer'; // default fallback
}
