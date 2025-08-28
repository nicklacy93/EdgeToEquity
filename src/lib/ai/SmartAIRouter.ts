import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AIRequest, AIResponse } from '@/types/ai';
import { CostTracker } from './CostTracker';

export class SmartAIRouter {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private costTracker: CostTracker;

  // AI Provider Configurations
  private providers: Record<string, AIProvider> = {
    openai: {
      name: 'openai',
      model: 'gpt-4o-mini',
      costPerToken: {
        input: 0.00015 / 1000,  // $0.15 per 1M input tokens
        output: 0.0006 / 1000   // $0.60 per 1M output tokens
      }
    },
    claude: {
      name: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      costPerToken: {
        input: 0.003 / 1000,    // $3 per 1M input tokens
        output: 0.015 / 1000    // $15 per 1M output tokens
      }
    }
  };

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.costTracker = new CostTracker();
  }

  /**
   * Smart routing based on request type and content
   */
  private routeRequest(request: AIRequest): 'openai' | 'claude' {
    // Topic-based routing logic
    const { message, requestType } = request;
    const lowerMessage = message.toLowerCase();

    // Claude for psychology, coaching, and educational content
    if (
      requestType === 'psychology' ||
      requestType === 'education' ||
      lowerMessage.includes('psychology') ||
      lowerMessage.includes('mindset') ||
      lowerMessage.includes('emotion') ||
      lowerMessage.includes('stress') ||
      lowerMessage.includes('discipline') ||
      lowerMessage.includes('motivation') ||
      lowerMessage.includes('learn') ||
      lowerMessage.includes('explain') ||
      lowerMessage.includes('understand') ||
      lowerMessage.includes('coaching')
    ) {
      return 'claude';
    }

    // OpenAI for technical analysis, strategy, and market data
    if (
      requestType === 'technical' ||
      lowerMessage.includes('technical') ||
      lowerMessage.includes('chart') ||
      lowerMessage.includes('indicator') ||
      lowerMessage.includes('strategy') ||
      lowerMessage.includes('analysis') ||
      lowerMessage.includes('trade') ||
      lowerMessage.includes('market') ||
      lowerMessage.includes('price') ||
      lowerMessage.includes('trend') ||
      lowerMessage.includes('pattern')
    ) {
      return 'openai';
    }

    // Default to OpenAI for general trading queries
    return 'openai';
  }

  /**
   * Process request with appropriate AI provider
   */
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const provider = this.routeRequest(request);
    const requestId = `${request.userId}-${Date.now()}`;

    try {
      let response: AIResponse;

      if (provider === 'openai') {
        response = await this.processOpenAIRequest(request, requestId, startTime);
      } else {
        response = await this.processClaudeRequest(request, requestId, startTime);
      }

      // Track costs and usage
      await this.costTracker.trackUsage({
        userId: request.userId,
        provider,
        requestType: request.requestType,
        cost: response.cost,
        tokensUsed: response.tokensUsed.input + response.tokensUsed.output,
        timestamp: new Date(),
        requestId
      });

      return response;

    } catch (error) {
      console.error(`AI processing error for ${provider}:`, error);
      throw new Error(`AI processing failed: ${error}`);
    }
  }

  /**
   * Process request with OpenAI
   */
  private async processOpenAIRequest(
    request: AIRequest, 
    requestId: string, 
    startTime: number
  ): Promise<AIResponse> {
    const systemPrompt = this.getOpenAISystemPrompt(request.requestType);
    
    const completion = await this.openai.chat.completions.create({
      model: this.providers.openai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    const cost = this.calculateCost('openai', inputTokens, outputTokens);

    return {
      provider: this.providers.openai,
      message: completion.choices[0].message.content || '',
      tokensUsed: { input: inputTokens, output: outputTokens },
      cost,
      processingTime: Date.now() - startTime,
      requestId
    };
  }

  /**
   * Process request with Claude
   */
  private async processClaudeRequest(
    request: AIRequest, 
    requestId: string, 
    startTime: number
  ): Promise<AIResponse> {
    const systemPrompt = this.getClaudeSystemPrompt(request.requestType);
    
    const message = await this.anthropic.messages.create({
      model: this.providers.claude.model,
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        { role: 'user', content: request.message }
      ]
    });

    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const cost = this.calculateCost('claude', inputTokens, outputTokens);

    return {
      provider: this.providers.claude,
      message: message.content[0].type === 'text' ? message.content[0].text : '',
      tokensUsed: { input: inputTokens, output: outputTokens },
      cost,
      processingTime: Date.now() - startTime,
      requestId
    };
  }

  /**
   * Calculate cost based on provider and token usage
   */
  private calculateCost(provider: 'openai' | 'claude', inputTokens: number, outputTokens: number): number {
    const config = this.providers[provider];
    return (inputTokens * config.costPerToken.input) + (outputTokens * config.costPerToken.output);
  }

  /**
   * Get system prompt for OpenAI (Technical/Strategy focus)
   */
  private getOpenAISystemPrompt(requestType: string): string {
    const basePrompt = `You are EdgeBot, a professional trading AI assistant specializing in technical analysis and trading strategies. You provide precise, actionable trading insights for serious traders.

Key capabilities:
- Technical analysis and chart pattern recognition
- Trading strategy development and optimization
- Market trend analysis and forecasting
- Risk management and position sizing
- Real-time market insights and alerts

Style: Professional, direct, data-driven. Focus on actionable insights with specific entry/exit points when relevant.`;

    if (requestType === 'technical') {
      return basePrompt + `\n\nFocus on: Technical indicators, chart patterns, price action analysis, and specific trading setups.`;
    }

    return basePrompt;
  }

  /**
   * Get system prompt for Claude (Psychology/Education focus)
   */
  private getClaudeSystemPrompt(requestType: string): string {
    const basePrompt = `You are EdgeBot, a professional trading psychology coach and educator. You help traders develop the mental discipline and emotional control needed for consistent profitability.

Key capabilities:
- Trading psychology and mindset coaching
- Emotional regulation and stress management
- Educational content on trading concepts
- Habit formation and discipline building
- Performance analysis and improvement strategies

Style: Supportive yet professional, insightful, focuses on long-term trader development.`;

    if (requestType === 'psychology') {
      return basePrompt + `\n\nFocus on: Emotional control, psychological barriers, mindset development, and mental performance optimization.`;
    }

    if (requestType === 'education') {
      return basePrompt + `\n\nFocus on: Clear explanations, educational content, concept clarification, and learning path guidance.`;
    }

    return basePrompt;
  }

  /**
   * Get current system usage stats
   */
  async getSystemStats() {
    return await this.costTracker.getSystemStats();
  }

  /**
   * Get user-specific usage stats
   */
  async getUserStats(userId: string) {
    return await this.costTracker.getUserStats(userId);
  }
}
