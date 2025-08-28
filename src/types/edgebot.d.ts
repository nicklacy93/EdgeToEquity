export type EdgeBotMood = 'confident' | 'focused' | 'supportive' | 'alert';

export interface EmotionalContext {
  mood: EdgeBotMood;
  confidence: number;
  winRate: number;
  pnlTrend: 'up' | 'flat' | 'down';
  streak: 'win' | 'loss' | 'neutral';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  marketPhase: 'premarket' | 'open' | 'lunch' | 'close' | 'afterhours';
  tradingSession: 'asia' | 'london' | 'ny' | 'overlap';
  volatilityState: 'low' | 'normal' | 'high' | 'extreme';
  userEnergyLevel: 'fresh' | 'focused' | 'tired' | 'overwhelmed';
  lastInteraction: Date;
}

export interface CommunicationPreferences {
  preferredTone: 'direct' | 'encouraging' | 'analytical' | 'casual';
  emojiUsage: 'minimal' | 'normal' | 'expressive';
  coachingStyle: 'gentle' | 'firm' | 'data-driven';
  privacyLevel: 'open' | 'professional' | 'minimal';
}
