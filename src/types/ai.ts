// AI Types for EdgeToEquity Dual-AI System
export interface AIProvider {
  name: 'openai' | 'claude';
  model: string;
  costPerToken: {
    input: number;
    output: number;
  };
}

export interface AIRequest {
  userId: string;
  message: string;
  context?: string;
  requestType: 'technical' | 'psychology' | 'education' | 'general';
  timestamp: Date;
}

export interface AIResponse {
  provider: AIProvider;
  message: string;
  tokensUsed: {
    input: number;
    output: number;
  };
  cost: number;
  processingTime: number;
  requestId: string;
}

export interface CostTracking {
  userId: string;
  provider: 'openai' | 'claude';
  requestType: string;
  cost: number;
  tokensUsed: number;
  timestamp: Date;
  requestId: string;
}

export interface UserUsageStats {
  userId: string;
  totalCost: number;
  requestCount: number;
  providerBreakdown: {
    openai: { cost: number; requests: number; tokens: number };
    claude: { cost: number; requests: number; tokens: number };
  };
  typeBreakdown: {
    technical: { cost: number; requests: number };
    psychology: { cost: number; requests: number };
    education: { cost: number; requests: number };
    general: { cost: number; requests: number };
  };
  lastActivity: Date;
}

export interface SystemUsageStats {
  totalCost: number;
  totalRequests: number;
  activeUsers: number;
  providerCosts: {
    openai: number;
    claude: number;
  };
  dailyUsage: Array<{
    date: string;
    cost: number;
    requests: number;
  }>;
}
