export const adaptToneBasedOnHistory = (message, memory, currentContext) => {
  const relevantHistory = memory.effectiveInterventions.filter(
    i => i.context && i.outcome === 'positive'
  );

  const successfulTones = relevantHistory.map(h => h.intervention);

  if (successfulTones.includes('analytical-support')) {
    return {
      ...message,
      style: 'analytical',
      includeData: true,
      tone: 'professional'
    };
  }

  if (successfulTones.includes('emotional-support')) {
    return {
      ...message,
      style: 'empathetic',
      includeEncouragement: true,
      tone: 'warm'
    };
  }

  return message;
};
