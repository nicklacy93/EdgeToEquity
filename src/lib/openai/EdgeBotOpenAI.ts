// OpenAI Integration Service for EdgeBot
import OpenAI from 'openai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface TradingContext {
  userExperience: string;
  tradingStyle: string[];
  preferredMarkets: string[];
  riskTolerance: string;
  conversationHistory: ChatMessage[];
}

class EdgeBotOpenAI {
  private openai: OpenAI;
  private systemPrompt: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.systemPrompt = `You are EdgeBot, an expert AI trading coach and the primary assistant for EdgeToEquity, a professional trading platform. You are highly knowledgeable about:

• Trading strategies (Pine Script, Python, NinjaScript, EasyLanguage)
• Technical analysis (RSI, MACD, moving averages, chart patterns)
• Risk management (position sizing, stop losses, portfolio management)
• Trading psychology (FOMO, discipline, emotional control)
• Market analysis (futures, stocks, forex, crypto)
• Platform features (TradingView integration, backtesting, alerts)

PERSONALITY: Professional, encouraging, analytical, and practical. You provide actionable advice with specific examples and code when appropriate.

RESPONSE STYLE:
- Use trading terminology correctly
- Provide specific, actionable guidance
- Include relevant examples (Pine Script code, position sizing calculations, etc.)
- Ask intelligent follow-up questions
- Structure responses with headers, bullet points, and emojis for readability
- Always aim to provide immediate value

SPECIALIZATIONS:
- Strategy creation and optimization
- Psychology coaching for traders
- Risk management frameworks
- Market analysis and opportunities
- Platform guidance and education

When users ask for strategies, provide specific entry/exit rules, risk management, and code examples. When discussing psychology, offer practical techniques and assessment questions. Always maintain a supportive, expert coaching tone.`;
  }

  async generateResponse(
    userMessage: string, 
    tradingContext: TradingContext
  ): Promise<string> {
    try {
      // Build conversation history
      const messages: ChatMessage[] = [
        { role: 'system', content: this.systemPrompt },
        ...tradingContext.conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
      ];

      // Add context about user preferences if available
      let contextualPrompt = userMessage;
      if (tradingContext.userExperience || tradingContext.tradingStyle.length > 0) {
        contextualPrompt = `User Context: Experience: ${tradingContext.userExperience}, Trading Style: ${tradingContext.tradingStyle.join(', ')}, Markets: ${tradingContext.preferredMarkets.join(', ')}, Risk: ${tradingContext.riskTolerance}

User Message: ${userMessage}`;
        messages[messages.length - 1].content = contextualPrompt;
      }

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o', // Best model for complex reasoning
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7, // Balanced creativity and consistency
        presence_penalty: 0.1, // Slight preference for new information
        frequency_penalty: 0.1, // Slight reduction in repetition
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response generated');
      }

      return response;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Fallback to enhanced error message
      return `I apologize, but I'm experiencing a temporary connection issue. This typically resolves quickly. 

In the meantime, here are some quick resources:
• **Strategy Help**: Check out our Strategy Builder in the dashboard
• **Psychology**: Visit the Psychology Coach for emotional trading support  
• **Risk Management**: Use our Risk Calculator for position sizing
• **Platform Guide**: Explore the features in your dashboard

Please try your question again in a moment, and I'll be ready to provide detailed, personalized guidance! 🎯`;
    }
  }

  async generateStrategyCode(
    strategyDescription: string,
    platform: 'pinescript' | 'python' | 'ninjaScript' = 'pinescript'
  ): Promise<string> {
    const codePrompt = `Create a complete ${platform} trading strategy based on this description: ${strategyDescription}

Requirements:
- Include all necessary imports and setup
- Add proper entry and exit conditions
- Include risk management (stop loss, take profit)
- Add comments explaining the logic
- Make it ready to use in ${platform === 'pinescript' ? 'TradingView' : platform === 'python' ? 'a Python trading environment' : 'NinjaTrader'}
- Include position sizing considerations

Provide working, production-ready code with explanations.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert trading strategy developer. Create complete, working code with detailed explanations.' },
          { role: 'user', content: codePrompt }
        ],
        max_tokens: 3000,
        temperature: 0.3, // Lower temperature for more consistent code
      });

      return completion.choices[0]?.message?.content || 'Error generating code';
    } catch (error) {
      console.error('Code generation error:', error);
      return 'I apologize, but I cannot generate strategy code at the moment. Please try again shortly.';
    }
  }

  async analyzeTradingFile(
    fileContent: string,
    fileType: 'pinescript' | 'python' | 'other',
    analysisType: 'optimization' | 'bug_check' | 'explanation' = 'optimization'
  ): Promise<string> {
    const analysisPrompt = `Analyze this ${fileType} trading strategy file and provide ${analysisType}:

${fileContent}

Please provide:
1. Strategy overview and logic explanation
2. Strengths and potential improvements
3. Risk management assessment
4. Performance optimization suggestions
5. Any bugs or issues identified
6. Recommended next steps

Be specific and actionable in your analysis.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert trading strategy analyst. Provide detailed, actionable feedback on trading code and strategies.' },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 2500,
        temperature: 0.4,
      });

      return completion.choices[0]?.message?.content || 'Error analyzing file';
    } catch (error) {
      console.error('File analysis error:', error);
      return 'I apologize, but I cannot analyze the file at the moment. Please try again shortly.';
    }
  }

  // Token usage tracking for cost management
  async estimateTokens(message: string): Promise<number> {
    // Rough estimation: ~4 characters per token
    return Math.ceil(message.length / 4);
  }

  // Cost calculation helper
  calculateCost(inputTokens: number, outputTokens: number): number {
    // GPT-4o pricing as of 2024
    const inputCost = (inputTokens / 1000000) * 2.50; // $2.50 per 1M input tokens
    const outputCost = (outputTokens / 1000000) * 10.00; // $10.00 per 1M output tokens
    return inputCost + outputCost;
  }
}

export default EdgeBotOpenAI;