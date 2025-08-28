export interface LongTermMemory {
  userPreferences: {
    communicationStyle: 'direct' | 'supportive' | 'analytical';
    coachingFrequency: 'minimal' | 'moderate' | 'active';
    celebrationStyle: 'quiet' | 'enthusiastic';
    stressResponse: 'space' | 'guidance' | 'analysis';
  };

  effectiveInterventions: {
    intervention: string;
    context: any;
    outcome: 'positive' | 'neutral' | 'negative';
    timestamp: Date;
  }[];

  learningPatterns: {
    bestPerformanceTimes: string[];
    strugglingPatterns: string[];
    motivationalTriggers: string[];
    avoidancePatterns: string[];
  };
}
