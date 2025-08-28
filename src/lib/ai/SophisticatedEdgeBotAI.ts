// Working Sophisticated AI Engine - Actually adapts to user input
interface UserContext {
  name?: string;
  previousMessages: string[];
  interests: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  tradingStyle: string[];
  psychologyState: string;
  sessionTime: number;
  currentTopic: string;
  personalityType: string;
}

interface ResponseData {
  intent: string;
  entities: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'excited' | 'frustrated' | 'curious';
  urgency: number;
  specificity: number;
  complexity: number;
}

class SophisticatedEdgeBotAI {
  private userContext: UserContext;
  private conversationMemory: Map<string, any> = new Map();
  private personalityTraits: string[] = [];
  
  constructor(userContext: UserContext) {
    this.userContext = userContext;
    this.initializePersonality();
  }

  private initializePersonality() {
    this.personalityTraits = [
      'supportive', 'analytical', 'educational', 'patient', 
      'encouraging', 'detail-oriented', 'practical'
    ];
  }

  private analyzeUserInput(message: string): ResponseData {
    const lowerMessage = message.toLowerCase();
    
    let intent = 'general_inquiry';
    let urgency = 1;
    let specificity = 1;
    let complexity = 1;
    
    // Strategy-related intents with better detection
    if (this.matchesKeywords(lowerMessage, ['build', 'create', 'develop', 'design']) && 
        this.matchesKeywords(lowerMessage, ['strategy', 'system', 'algorithm'])) {
      intent = 'strategy_creation';
      urgency = this.matchesKeywords(lowerMessage, ['need', 'want', 'ready', 'now']) ? 3 : 2;
      specificity = this.matchesKeywords(lowerMessage, ['own', 'my', 'custom', 'personal']) ? 3 : 2;
      
      // Check for very specific strategy requests
      if (this.hasSpecificRequirements(lowerMessage)) {
        intent = 'strategy_creation_specific';
        specificity = 3;
        urgency = 3;
      }
    }
    
    // Psychology intents
    else if (this.matchesKeywords(lowerMessage, ['psychology', 'emotion', 'discipline', 'fear', 'greed', 'confidence', 'stress', 'anxiety'])) {
      intent = 'psychology_coaching';
      urgency = this.matchesKeywords(lowerMessage, ['struggling', 'help', 'problem', 'issue']) ? 3 : 2;
    }
    
    // Risk management intents
    else if (this.matchesKeywords(lowerMessage, ['risk', 'position', 'size', 'stop', 'loss', 'money', 'capital', 'drawdown'])) {
      intent = 'risk_management';
      urgency = this.matchesKeywords(lowerMessage, ['losing', 'lost', 'protect', 'safe']) ? 3 : 2;
    }
    
    // Market analysis intents
    else if (this.matchesKeywords(lowerMessage, ['market', 'analysis', 'trend', 'forecast', 'prediction', 'outlook', 'chart'])) {
      intent = 'market_analysis';
    }
    
    // Learning intents
    else if (this.matchesKeywords(lowerMessage, ['learn', 'teach', 'explain', 'understand', 'how', 'what', 'why', 'show'])) {
      intent = 'education';
      complexity = this.matchesKeywords(lowerMessage, ['beginner', 'new', 'start']) ? 1 : 
                  this.matchesKeywords(lowerMessage, ['advanced', 'complex', 'deep']) ? 3 : 2;
    }
    
    // Platform/technical intents
    else if (this.matchesKeywords(lowerMessage, ['platform', 'feature', 'tool', 'function', 'navigate', 'use', 'edgetoequity'])) {
      intent = 'platform_guidance';
    }

    const entities = this.extractEntities(lowerMessage);
    const sentiment = this.analyzeSentiment(lowerMessage);
    
    return {
      intent,
      entities,
      sentiment,
      urgency,
      specificity,
      complexity
    };
  }

  private hasSpecificRequirements(message: string): boolean {
    const hasTimeframe = this.extractTimeframe(message) !== null;
    const hasInstrument = this.extractInstrument(message) !== null;
    const hasStyle = this.extractTradingStyle(message) !== null;
    const hasTimeRestriction = this.extractTimeRestriction(message) !== null;
    const hasIndicators = this.extractIndicators(message).length > 0;
    
    // If user mentions 2+ specific requirements, it's a specific request
    const specificCount = [hasTimeframe, hasInstrument, hasStyle, hasTimeRestriction, hasIndicators].filter(Boolean).length;
    return specificCount >= 2;
  }

  private matchesKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private extractEntities(message: string): string[] {
    const entities: string[] = [];
    
    // Trading instruments
    const instruments = ['stocks', 'forex', 'futures', 'crypto', 'options', 'es', 'nq', 'cl', 'gc', 'btc', 'eth', 'spy', 'qqq'];
    instruments.forEach(instrument => {
      if (message.includes(instrument)) entities.push(`instrument:${instrument}`);
    });
    
    // Technical indicators
    const indicators = ['rsi', 'macd', 'bollinger', 'moving average', 'sma', 'ema', 'stochastic', 'fibonacci', 'pivot'];
    indicators.forEach(indicator => {
      if (message.includes(indicator)) entities.push(`indicator:${indicator}`);
    });
    
    // Timeframes
    const timeframes = ['scalping', 'day trading', 'swing trading', '1m', '5m', '15m', '1h', '4h', 'daily'];
    timeframes.forEach(timeframe => {
      if (message.includes(timeframe)) entities.push(`timeframe:${timeframe}`);
    });
    
    return entities;
  }

  private analyzeSentiment(message: string): ResponseData['sentiment'] {
    const positiveWords = ['excited', 'great', 'awesome', 'love', 'interested', 'ready', 'confident', 'good'];
    const negativeWords = ['frustrated', 'confused', 'lost', 'scared', 'worried', 'difficult', 'hard', 'problem'];
    const excitedWords = ['really', '!', 'excited', 'amazing', 'can\'t wait'];
    const frustratedWords = ['struggling', 'stuck', 'confused', 'not working', 'help'];
    
    if (this.matchesKeywords(message, excitedWords)) return 'excited';
    if (this.matchesKeywords(message, frustratedWords)) return 'frustrated';
    if (this.matchesKeywords(message, positiveWords)) return 'positive';
    if (this.matchesKeywords(message, negativeWords)) return 'negative';
    
    return 'neutral';
  }

  // Main response generation
  public async generateResponse(userMessage: string): Promise<string> {
    const analysis = this.analyzeUserInput(userMessage);
    
    // Update conversation memory
    this.conversationMemory.set('lastIntent', analysis.intent);
    this.conversationMemory.set('userSentiment', analysis.sentiment);
    this.conversationMemory.set('entities', analysis.entities);
    
    let response = '';
    
    switch (analysis.intent) {
      case 'strategy_creation_specific':
        response = await this.generateSpecificStrategyResponse(userMessage, analysis);
        break;
      case 'strategy_creation':
        response = await this.generateStrategyResponse(userMessage, analysis);
        break;
      case 'psychology_coaching':
        response = await this.generatePsychologyResponse(userMessage, analysis);
        break;
      case 'risk_management':
        response = await this.generateRiskResponse(userMessage, analysis);
        break;
      case 'market_analysis':
        response = await this.generateMarketResponse(userMessage, analysis);
        break;
      case 'education':
        response = await this.generateEducationResponse(userMessage, analysis);
        break;
      case 'platform_guidance':
        response = await this.generatePlatformResponse(userMessage, analysis);
        break;
      default:
        response = await this.generateGeneralResponse(userMessage, analysis);
    }
    
    return this.addPersonalityToResponse(response, analysis);
  }

  // NEW: Generate specific strategy response for detailed requests
  private async generateSpecificStrategyResponse(message: string, analysis: ResponseData): Promise<string> {
    const enthusiasm = analysis.sentiment === 'excited' ? "I love your enthusiasm! " : "";
    const encouragement = analysis.sentiment === 'frustrated' ? "Don't worry, I'll create exactly what you need. " : "";
    
    const lowerMessage = message.toLowerCase();
    
    // Extract specific requirements
    const timeframe = this.extractTimeframe(lowerMessage);
    const instrument = this.extractInstrument(lowerMessage);
    const style = this.extractTradingStyle(lowerMessage);
    const timeRestriction = this.extractTimeRestriction(lowerMessage);
    const indicators = this.extractIndicators(lowerMessage);
    const isFromScratch = lowerMessage.includes('from scratch') || lowerMessage.includes('build from scratch');
    const isMomentum = lowerMessage.includes('momentum');
    const isAggressive = lowerMessage.includes('aggressive');
    
    return `${enthusiasm}${encouragement}Perfect! You've given me excellent specifications. Let me create a custom ${isMomentum ? 'momentum ' : ''}${style || 'trading'} strategy${instrument ? ` for ${instrument.toUpperCase()}` : ''}${timeframe ? ` on the ${timeframe} timeframe` : ''}${timeRestriction ? ` during ${timeRestriction}` : ''}!

**🚀 Your Custom ${instrument ? instrument.toUpperCase() + ' ' : ''}${style ? style.charAt(0).toUpperCase() + style.slice(1) : 'Trading'} Strategy:**

**📊 Strategy Foundation:**
${instrument ? `• **Instrument**: ${instrument.toUpperCase()} ${instrument === 'nq' ? 'Futures (NASDAQ-100 E-mini)' : instrument === 'es' ? 'Futures (S&P 500 E-mini)' : 'Futures'}` : '• **Instrument**: Your specified market'}
${timeframe ? `• **Timeframe**: ${timeframe} charts` : '• **Timeframe**: As specified'}
${style ? `• **Style**: ${isMomentum ? 'Momentum-based ' : ''}${style}` : '• **Style**: Custom trading approach'}
${timeRestriction ? `• **Session**: ${timeRestriction}` : '• **Session**: During optimal trading hours'}
• **Risk Profile**: ${isAggressive ? 'Aggressive (2-3% risk per trade)' : 'Moderate (1-2% risk per trade)'}

**⚡ Entry Signals:**
${indicators.includes('rsi') && indicators.includes('moving average') ? 
`• **Primary**: 9 EMA crossing above 21 EMA + RSI(14) > 60 for longs
• **Volume Confirmation**: Current bar volume > 1.5x average volume
• **RSI Filter**: RSI between 40-80 (avoid overbought/oversold extremes)
• **Moving Average Filter**: Price above 50 SMA for bullish bias` :
indicators.includes('rsi') ?
`• **Primary**: RSI(14) crossing above 50 with momentum
• **Confirmation**: Price breaking above previous high
• **Volume**: Above-average volume on breakout` :
indicators.includes('moving average') ?
`• **Primary**: 9 EMA crossing above 21 EMA
• **Confirmation**: Price closing above both EMAs
• **Trend Filter**: 50 SMA slope pointing upward` :
`• **Primary**: ${isMomentum ? 'Momentum breakout above resistance' : 'Technical breakout pattern'}
• **Volume Confirmation**: Volume spike above average
• **Trend Filter**: Higher timeframe alignment`}
${timeRestriction ? `• **Session Filter**: Only trade during ${timeRestriction}` : ''}

**🎯 Entry Rules:**
${timeframe === '1m' || style === 'scalping' ?
`1. Wait for setup to form on ${timeframe || '1m'} chart
2. Enter immediately on signal confirmation
3. Use tight stops (${instrument === 'nq' ? '8-12 points' : '6-10 points'})
4. Scale out profits quickly (1:1, 1:2 targets)` :
`1. Identify setup on ${timeframe || 'primary'} timeframe
2. Wait for confirmation signals to align
3. Enter on next candle open after all conditions met
4. Set stop loss below recent swing low`}
${isAggressive ? '5. Take full position size immediately on signal' : '5. Consider scaling into position on pullbacks'}

**🛡️ Exit Strategy:**
${timeframe === '1m' || style === 'scalping' ?
`• **Stop Loss**: ${instrument === 'nq' ? '8-12 points' : '6-10 points'} below entry (tight scalping stops)
• **Take Profit 1**: ${instrument === 'nq' ? '12-16 points' : '8-12 points'} (1.5:1 ratio)
• **Take Profit 2**: ${instrument === 'nq' ? '20-24 points' : '16-20 points'} (2:1 ratio)
${timeRestriction ? `• **Time Stop**: Exit all positions by ${timeRestriction.split(' to ')[1] || '11:00 AM EST'}` : '• **Time Stop**: Exit by end of optimal session'}` :
`• **Stop Loss**: ${isAggressive ? '15-20 points' : '12-15 points'} below entry
• **Take Profit 1**: ${isAggressive ? '25-30 points' : '20-25 points'} (1.5:1 minimum)
• **Take Profit 2**: ${isAggressive ? '40-50 points' : '30-40 points'} (let winners run)
• **Trailing Stop**: Move to breakeven after 1:1 profit`}

${instrument ? `**📈 ${instrument.toUpperCase()}-Specific Optimizations:**
• **Tick Size**: ${instrument === 'nq' ? '0.25 points ($5 per contract)' : instrument === 'es' ? '0.25 points ($12.50 per contract)' : 'Standard tick size'}
• **Average Range**: ${timeframe === '1m' ? '15-25 points during active session' : '30-50 points daily'}
• **Best Setups**: ${instrument === 'nq' ? 'Tech sector momentum plays' : 'Market direction breakouts'}
• **Volume Profile**: Focus on high-volume nodes for support/resistance` : ''}

**🧠 Psychology & Risk Rules:**
• **Max ${timeframe === '1m' || style === 'scalping' ? '5' : '3'} trades per session** (prevents overtrading)
• **Stop trading after 2 consecutive losses**
• **${isAggressive ? 'Scale position size based on confidence (1-3 contracts)' : 'Consistent 1-2 contract position sizing'}**
• **Daily P&L limit**: ${isAggressive ? '+/- $500' : '+/- $300'} per day

${indicators.length > 0 ? `**🔧 Technical Setup (${indicators.includes('rsi') && indicators.includes('moving average') ? 'RSI + MA' : indicators.join(' + ')} Strategy):**
\`\`\`pinescript
//@version=5
strategy("${instrument ? instrument.toUpperCase() + ' ' : ''}${style || 'Custom'} ${indicators.join('+')} Strategy", overlay=true)

// Indicators
${indicators.includes('rsi') ? 'rsi = ta.rsi(close, 14)' : ''}
${indicators.includes('moving average') ? 'ema9 = ta.ema(close, 9)\nema21 = ta.ema(close, 21)\nsma50 = ta.sma(close, 50)' : ''}
vol_avg = ta.sma(volume, 20)

// Entry Conditions
${indicators.includes('rsi') && indicators.includes('moving average') ? 
'long_condition = ta.crossover(ema9, ema21) and rsi > 60 and close > sma50 and volume > vol_avg * 1.5' :
indicators.includes('rsi') ?
'long_condition = ta.crossover(rsi, 50) and volume > vol_avg * 1.2' :
'long_condition = ta.crossover(ema9, ema21) and volume > vol_avg * 1.5'}

// Risk Management
${timeframe === '1m' || style === 'scalping' ?
'stop_loss = close * 0.998  // Tight stops for scalping\ntake_profit1 = close * 1.004  // Quick 1:2 target' :
'stop_loss = close * 0.995  // 0.5% stop\ntake_profit1 = close * 1.015  // 1.5% target'}

if long_condition
    strategy.entry("Long", strategy.long)
    strategy.exit("TP1", "Long", limit=take_profit1, stop=stop_loss, qty_percent=50)
    strategy.exit("TP2", "Long", stop=stop_loss)
\`\`\`` : ''}

**🎯 Next Steps:**
1. ${isFromScratch ? 'Want me to provide the complete Pine Script code?' : 'Should we refine any specific aspects?'}
2. Need help with backtesting this strategy on historical data?
3. Want to discuss position sizing for your account?
4. Should we set up alerts for these entry signals?

This strategy is tailored specifically for your ${isAggressive ? 'aggressive' : 'moderate'} ${style || 'trading'} approach${instrument ? ` on ${instrument.toUpperCase()}` : ''}! Ready to start implementing? 🚀`;
  }

  private extractTimeframe(message: string): string | null {
    const timeframes = {
      '1 minute': '1m', '1m': '1m', '1 min': '1m',
      '5 minute': '5m', '5m': '5m', '5 min': '5m',
      '15 minute': '15m', '15m': '15m', '15 min': '15m',
      '1 hour': '1h', '1h': '1h',
      '4 hour': '4h', '4h': '4h',
      'daily': 'daily', '1d': 'daily',
      'scalping': '1m', 'scalp': '1m'
    };
    
    for (const [key, value] of Object.entries(timeframes)) {
      if (message.includes(key)) return value;
    }
    return null;
  }

  private extractInstrument(message: string): string | null {
    const instruments = ['nq', 'es', 'spy', 'qqq', 'btc', 'eth', 'cl', 'gc', 'rty'];
    for (const instrument of instruments) {
      if (message.includes(instrument)) return instrument;
    }
    return null;
  }

  private extractTradingStyle(message: string): string | null {
    if (message.includes('scalping') || message.includes('scalp')) return 'scalping';
    if (message.includes('day trading') || message.includes('day trade')) return 'day trading';
    if (message.includes('swing trading') || message.includes('swing')) return 'swing trading';
    if (message.includes('momentum')) return 'momentum trading';
    return null;
  }

  private extractTimeRestriction(message: string): string | null {
    // Look for time patterns like "9:30am to 11am"
    const timePattern = /(\d{1,2}:\d{2})\s*(am|pm)?\s*to\s*(\d{1,2})(:\d{2})?\s*(am|pm)/i;
    const match = message.match(timePattern);
    if (match) {
      return `${match[1]}${match[2] || ''} to ${match[3]}${match[4] || ''}${match[5]}`;
    }
    return null;
  }

  private extractIndicators(message: string): string[] {
    const indicators = [];
    if (message.includes('rsi')) indicators.push('rsi');
    if (message.includes('moving average') || message.includes('ema') || message.includes('sma')) indicators.push('moving average');
    if (message.includes('macd')) indicators.push('macd');
    if (message.includes('bollinger')) indicators.push('bollinger bands');
    if (message.includes('stochastic')) indicators.push('stochastic');
    return indicators;
  }

  private async generateStrategyResponse(message: string, analysis: ResponseData): Promise<string> {
    const enthusiasm = analysis.sentiment === 'excited' ? "I love your enthusiasm! " : "";
    const encouragement = analysis.sentiment === 'frustrated' ? "Don't worry, building strategies can seem complex at first, but I'll guide you step by step. " : "";
    
    if (message.toLowerCase().includes('own strategy') || message.toLowerCase().includes('my strategy')) {
      return `${enthusiasm}${encouragement}Building your own trading strategy is one of the most rewarding aspects of trading! Let me walk you through my proven strategy development process:

**🎯 Step 1: Define Your Foundation**
• **Trading Style**: Are you thinking scalping (quick 1-5 minute trades), day trading (intraday), or swing trading (multi-day holds)?
• **Market Focus**: Which instruments interest you most? (Stocks, Futures like ES/NQ, Forex, Crypto)
• **Time Commitment**: How many hours per day can you dedicate to trading?

**📊 Step 2: Choose Your Edge**
Based on your answers, I'll recommend specific technical indicators and setups that match your personality and schedule.

**🧪 Step 3: Backtesting & Refinement**  
I'll help you test your strategy on historical data and optimize it for consistent performance.

**🧠 Step 4: Psychology Integration**
We'll build in psychological safeguards to help you stick to your plan when emotions run high.

To get started, could you tell me:
1. What's your preferred trading timeframe?
2. Do you prefer trend-following or mean-reversion strategies?
3. What's your experience level with technical analysis?

I'll then create a personalized strategy blueprint just for you! 🚀`;
    }

    return `${enthusiasm}${encouragement}Absolutely! I'd be happy to help you develop a winning trading strategy. 

**Here's how we can approach this:**

**🔍 Strategy Analysis Options:**
• **Upload Existing Code** - Share any Pine Script, Python, or other trading code you have
• **Build From Scratch** - I'll guide you through creating a completely new strategy
• **Modify Existing** - We can take a proven strategy and customize it for your needs

**📈 Popular Strategy Types I Can Help With:**
• **Trend Following** - Moving average crossovers, breakout systems
• **Mean Reversion** - RSI oversold/overbought, Bollinger Band reversals  
• **Momentum** - MACD signals, volume-based entries
• **Multi-Timeframe** - Higher timeframe trend + lower timeframe entries

**🎯 What I Need From You:**
1. What type of trading appeals to you most?
2. Do you have any existing strategies or ideas?
3. What's your risk tolerance (conservative, moderate, aggressive)?

Based on your answers, I'll create a detailed strategy development plan with specific entry/exit rules, risk management, and backtesting suggestions.

What aspect would you like to dive into first? 🎯`;
  }

  private async generatePsychologyResponse(message: string, analysis: ResponseData): Promise<string> {
    const empathy = analysis.sentiment === 'frustrated' ? "I completely understand - trading psychology is one of the biggest challenges traders face. " : "";
    const validation = analysis.sentiment === 'negative' ? "Your feelings are completely normal and experienced by every successful trader. " : "";
    
    return `${empathy}${validation}Trading psychology is absolutely crucial - it's often the difference between consistent profits and emotional losses.

**🧠 Let's Address Your Psychology:**

**Common Trading Psychology Challenges:**
• **FOMO (Fear of Missing Out)** - Jumping into trades late
• **Revenge Trading** - Trying to "win back" losses immediately
• **Overconfidence** - Taking excessive risk after winning streaks
• **Analysis Paralysis** - Overthinking and missing good setups

**🎯 EdgeToEquity Psychology Tools:**
• **Emotional State Tracking** - Daily mood and confidence assessments
• **Discipline Scoring** - How well you follow your trading rules
• **Pattern Recognition** - I'll identify your emotional trading triggers
• **Personalized Coaching** - Specific strategies for your psychological profile

**📊 Psychology Assessment Questions:**
1. What emotional challenge affects your trading most?
2. Do you tend to overtrade when stressed or undertrade when uncertain?
3. How do you typically react after a losing trade?
4. What time of day do you feel most confident vs. most anxious?

**💡 Immediate Psychology Tips:**
• **Pre-Trade Ritual** - Same routine before every trade to stay calm
• **Position Sizing Rules** - Never risk more than you can afford to lose mentally
• **Loss Limits** - Stop trading after 2-3 consecutive losses
• **Mindfulness Practice** - 2-minute breathing exercise before trading sessions

Would you like me to create a personalized psychology improvement plan based on your specific challenges? I can also set up daily check-ins to track your emotional patterns and progress! 🎯`;
  }

  private async generateRiskResponse(message: string, analysis: ResponseData): Promise<string> {
    const urgency = analysis.urgency > 2 ? "Risk management is absolutely critical - let's get this sorted out right away. " : "";
    
    return `${urgency}Excellent question! Risk management is the foundation of successful trading - it's what separates professionals from gamblers.

**🛡️ EdgeToEquity Risk Management Framework:**

**1. Position Sizing (Most Important)**
• **2% Rule**: Never risk more than 2% of your account per trade
• **1% Rule**: Conservative traders use 1% max risk
• **Kelly Criterion**: Mathematical optimal sizing based on win rate

**2. Stop Loss Strategy**
• **Technical Stops**: Below support/above resistance levels
• **Percentage Stops**: Fixed % from entry (typically 1-3%)
• **ATR Stops**: Based on Average True Range for volatility adjustment
• **Time Stops**: Exit if trade doesn't move as expected within X hours

**3. Position Correlation**
• **Diversification**: Don't put all positions in same sector/currency
• **Correlation Analysis**: Avoid highly correlated positions
• **Max Exposure**: Limit total account risk across all open trades

**📊 Risk Calculation Tools:**
• **Position Size Calculator**: Based on account size and stop distance
• **Risk/Reward Analyzer**: Minimum 1:2 risk/reward ratio recommended
• **Drawdown Protector**: Maximum consecutive loss limits
• **Portfolio Heat**: Total account risk across all positions

**🎯 Your Personal Risk Assessment:**
To create your custom risk management plan, I need to know:
1. What's your total trading account size?
2. What's your maximum comfortable loss per trade?
3. Are you trading multiple positions simultaneously?
4. What's your target monthly return goal?

Would you like me to calculate optimal position sizes for your account, or shall we dive deeper into stop-loss strategies? 🎯`;
  }

  private async generateMarketResponse(message: string, analysis: ResponseData): Promise<string> {
    return `Great question about current market conditions! Let me share my analysis of what's happening right now.

**📈 Current Market Environment:**

**Major Indices Analysis:**
• **S&P 500 (ES Futures)**: Currently showing mixed signals with support around key levels
• **NASDAQ (NQ Futures)**: Technology sector showing relative strength
• **Small Caps (RTY)**: Lagging major indices, indicating risk-off sentiment
• **VIX**: Volatility in moderate range, suggesting stable but cautious market

**🌍 Global Market Sentiment:**
• **Currency Markets**: USD showing strength against major pairs
• **Commodities**: Gold maintaining range, Oil responding to supply/demand dynamics
• **Crypto**: Bitcoin and Ethereum following traditional risk-asset patterns

**📊 Technical Analysis Insights:**
• **Trend Structure**: Primary trend remains intact with healthy corrections
• **Volume Analysis**: Institutional participation levels normal
• **Seasonal Patterns**: Current time of year historically shows specific tendencies

**🎯 Trading Opportunities:**
• **Mean Reversion**: Look for oversold bounces in quality names
• **Trend Following**: Breakout setups in leading sectors
• **Volatility Plays**: Options strategies around key events

**⚡ Key Levels to Watch:**
• **ES (S&P 500 Futures)**: Support at [level], resistance at [level]
• **NQ (NASDAQ Futures)**: Critical pivot at [level]
• **Dollar Index**: Watch for [level] break

**💡 Strategy Recommendations:**
Given current conditions, strategies that work well:
• Specific strategy type for trending markets
• Specific strategy type for range-bound conditions

What specific instruments or timeframes are you most interested in analyzing? I can provide detailed setups and entry/exit levels! 📊`;
  }

  private async generateEducationResponse(message: string, analysis: ResponseData): Promise<string> {
    const complexity = analysis.complexity;
    const beginnerPrefix = complexity === 1 ? "Perfect! Let me explain this in simple, easy-to-understand terms. " : "";
    const advancedPrefix = complexity === 3 ? "Great question! Let's dive deep into the advanced concepts. " : "";
    
    return `${beginnerPrefix}${advancedPrefix}I love helping traders learn! Education is the foundation of trading success.

**📚 EdgeToEquity Learning Framework:**

**🎯 Core Trading Concepts:**
• **Technical Analysis**: Chart patterns, indicators, support/resistance
• **Fundamental Analysis**: Economic data, earnings, news impact
• **Risk Management**: Position sizing, stop losses, portfolio management
• **Trading Psychology**: Emotional control, discipline, decision-making
• **Strategy Development**: Building, testing, and optimizing systems

**📈 Skill Level Progression:**
• **Beginner**: Market basics, chart reading, simple strategies
• **Intermediate**: Multi-timeframe analysis, advanced indicators, backtesting
• **Advanced**: System development, portfolio management, algorithmic trading

**🛠️ Learning Tools Available:**
• **Interactive Strategy Builder**: Learn by creating actual strategies
• **Psychology Simulator**: Practice emotional control in safe environment
• **Market Analysis Practice**: Real-time chart analysis with feedback
• **Risk Calculator**: Hands-on position sizing exercises

**🎯 What Would You Like to Learn Today?**
• Specific technical indicators (RSI, MACD, Bollinger Bands)
• Chart pattern recognition
• Strategy backtesting methods
• Psychology techniques
• Platform-specific features

Tell me what interests you most, and I'll create a personalized lesson plan with practical exercises you can start immediately! 🚀`;
  }

  private async generatePlatformResponse(message: string, analysis: ResponseData): Promise<string> {
    return `Absolutely! I'm here to help you navigate EdgeToEquity and make the most of all our features.

**🎯 EdgeToEquity Platform Guide:**

**📊 Dashboard Features:**
• **Strategy Builder**: Create and analyze trading strategies
• **Psychology Coach**: Track emotional patterns and build discipline
• **Risk Guardian**: Calculate position sizes and manage portfolio risk
• **Market Analyzer**: Real-time chart analysis and insights
• **Performance Tracker**: Monitor your progress and improvements

**🤖 AI Chat Features (That's Me!):**
• **Strategy Analysis**: Upload and review your trading code
• **Psychology Coaching**: Personalized emotional guidance
• **Risk Assessment**: Custom risk management plans
• **Market Insights**: Current market analysis and opportunities
• **Learning Support**: Explanations and educational content

**📈 TradingView Integration:**
• **Live Charts**: Real-time data for stocks, futures, forex, crypto
• **Futures Access**: ES, NQ, CL, GC, BTC and more
• **Technical Analysis**: Full indicator suite and drawing tools
• **Multiple Timeframes**: From 1-minute to monthly charts

**🎮 Quick Actions Available:**
• **"Analyze Strategy"** - Upload Pine Script, Python, or other code
• **"Psychology Help"** - Get emotional trading support
• **"Generate Code"** - Create new trading strategies
• **"Risk Analysis"** - Review your risk management
• **"Market Insights"** - Current market opportunities

**🎯 What Would You Like Help With?**
• Setting up your first strategy analysis?
• Understanding the psychology tracking features?
• Navigating specific dashboard sections?
• Uploading and analyzing trading code?

Just let me know what you'd like to explore! 🚀`;
  }

  private async generateGeneralResponse(message: string, analysis: ResponseData): Promise<string> {
    const sentiment = analysis.sentiment;
    const encouragement = sentiment === 'frustrated' ? "I'm here to help work through any challenges you're facing. " : "";
    const enthusiasm = sentiment === 'excited' ? "I love your enthusiasm for trading! " : "";
    
    return `${encouragement}${enthusiasm}Thanks for reaching out! I'm EdgeBot, your AI trading coach, and I'm here to help you succeed in the markets.

**🎯 I Can Help You With:**

**Strategy Development:**
• Create custom trading strategies for any market
• Analyze and optimize existing strategies
• Convert strategies between platforms
• Backtest and validate strategy performance

**Psychology Coaching:**
• Identify and overcome emotional trading patterns
• Build discipline and consistency
• Develop pre-trade and post-trade routines
• Manage FOMO, revenge trading, and overconfidence

**Risk Management:**
• Calculate optimal position sizes
• Set appropriate stop-loss levels
• Manage portfolio correlation and exposure
• Develop drawdown protection strategies

**Market Analysis:**
• Current market condition assessment
• Technical and fundamental analysis
• Identify trading opportunities
• Sector rotation and correlation insights

**💡 Pro Tip:** The more specific your questions, the better I can help! Instead of "help me trade," try "analyze my RSI strategy for day trading ES futures" or "help me manage FOMO when entering trades late."

What aspect of trading would you like to explore today? 🎯`;
  }

  private addPersonalityToResponse(response: string, analysis: ResponseData): string {
    let personalizedResponse = response;
    
    if (analysis.sentiment === 'frustrated') {
      personalizedResponse += "\n\n🤝 Remember, every successful trader has been where you are right now. We'll work through this together!";
    } else if (analysis.sentiment === 'excited') {
      personalizedResponse += "\n\n🎉 Your excitement is contagious! Let's channel that energy into building your trading success.";
    }
    
    if (analysis.urgency > 2) {
      personalizedResponse += "\n\n⚡ **Next Steps:** I'm ready to dive in immediately. What would you like to tackle first?";
    }
    
    return personalizedResponse;
  }
}

export default SophisticatedEdgeBotAI;