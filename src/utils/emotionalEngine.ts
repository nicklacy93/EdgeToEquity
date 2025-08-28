import { EmotionalState } from '../types/EmotionalState';
import { TradingContext, PerformanceData } from '../types/TradingContext';

export const calculateMoodTransition = (
  currentState: EmotionalState,
  newData: PerformanceData
): EmotionalState => {
  const evidenceStrength = newData.score; // Simplified
  const resistanceThreshold = currentState.stability * 0.7;

  if (evidenceStrength > resistanceThreshold) {
    return {
      ...currentState,
      momentum: (evidenceStrength + currentState.momentum * 0.7) / 1.7,
      stability: 0.1
    };
  }

  return {
    ...currentState,
    stability: Math.min(1, currentState.stability + 0.1)
  };
};
