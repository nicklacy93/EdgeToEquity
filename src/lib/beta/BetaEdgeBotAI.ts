// Beta-Optimized AI Service - Cost-controlled responses
import OpenAI from 'openai';

interface BetaAIConfig {
  maxTokensPerResponse: 1000;  // ~750 words max
  temperature: 0.7;
  model: 'gpt-4o-mini';       // Use mini for beta to save costs
  fallbackToMini: true;
}

class BetaEdgeBotAI {
  private openai: OpenAI;
  private config: BetaAIConfig;
  private systemPrompt: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.config = {
      maxTokensPerResponse: 1000,
      temperature: 0.7,
      model: 'gpt-4o-mini', // Cheaper model for beta
      fallbackToMini: true
    };
    
    // Shorter system prompt for beta to save tokens
    this.systemPrompt = `You are EdgeBot, an expert AI trading coach. Provide helpful, actionable trading advice in a concise but complete manner. 

Focus on:
- Trading strategies and technical analysis
- Risk management and position sizing  
- Trading psychology and discipline
- Practical, implementable guidance

Keep responses informative but under 750 words unless complex analysis is specifically requested. Use clear structure with headers and bullet points.`;
  }

  async generateBetaResponse(userMessage: string, userId: string): Promise<{
    response: string;
    tokensUsed: number;
    cost: number;
  }> {
    try {
      // Add beta context to message
      const betaMessage = `BETA USER QUERY: ${userMessage}

Please provide a helpful but concise response suitable for beta testing. Focus on demonstrating EdgeBot's capabilities while being cost-efficient.`;

      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: betaMessage }
        ],
        max_tokens: this.config.maxTokensPerResponse,
        temperature: this.config.temperature,
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
      
      // Calculate actual usage and cost
      const tokensUsed = completion.usage?.total_tokens || 0;
      const cost = this.calculateCost(tokensUsed);

      return {
        response: this.addBetaFooter(response),
        tokensUsed,
        cost
      };

    } catch (error) {
      console.error('Beta AI Error:', error);
      
      return {
        response: this.getBetaFallbackResponse(),
        tokensUsed: 0,
        cost: 0
      };
    }
  }

  private addBetaFooter(response: string): string {
    return `${response}

---
*🧪 Beta Testing: Thank you for helping us improve EdgeBot! Your feedback is valuable for making this the best AI trading coach possible.*`;
  }

  private getBetaFallbackResponse(): string {
    return `I'm experiencing a temporary issue, but I'm here to help with your trading questions!

**I can assist with:**
• Trading strategy development
• Risk management guidance  
• Technical analysis questions
• Trading psychology support
• Platform feature explanations

Please try your question again, or explore these areas where I excel!

---
*🧪 Beta Testing: Temporary connectivity issue. This helps us improve the platform's reliability.*`;
  }

  private calculateCost(tokens: number): number {
    // GPT-4o-mini pricing: $0.15 per 1M input tokens, $0.60 per 1M output tokens
    // Rough estimate: 70% output tokens
    const inputTokens = Math.floor(tokens * 0.3);
    const outputTokens = Math.floor(tokens * 0.7);
    
    const inputCost = (inputTokens / 1000000) * 0.15;
    const outputCost = (outputTokens / 1000000) * 0.60;
    
    return inputCost + outputCost;
  }

  // Get cost statistics for beta program
  getTotalCost(totalTokens: number): number {
    return this.calculateCost(totalTokens);
  }
}

export default BetaEdgeBotAI;