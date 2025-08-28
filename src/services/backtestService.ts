// Backtest Service
export interface BacktestResult {
  totalReturn: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  avgTradeReturn: number;
  profitFactor: number;
  timeframe: string;
  symbol: string;
  startDate: string;
  endDate: string;
  equity: Array<{ date: string; value: number }>;
  trades: Array<{
    date: string;
    type: 'buy' | 'sell';
    price: number;
    quantity: number;
    profit?: number;
  }>;
}

export interface BacktestConfig {
  strategy: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  commission: number;
}

// Mock backtest function - replace with actual implementation
export const runBacktest = async (config: BacktestConfig): Promise<BacktestResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock data
  const mockResult: BacktestResult = {
    totalReturn: Math.random() * 50 + 10, // 10-60%
    winRate: Math.random() * 30 + 55, // 55-85%
    sharpeRatio: Math.random() * 1.5 + 0.5, // 0.5-2.0
    maxDrawdown: -(Math.random() * 20 + 5), // -5% to -25%
    totalTrades: Math.floor(Math.random() * 100) + 50,
    avgTradeReturn: Math.random() * 2 + 0.5,
    profitFactor: Math.random() * 1.5 + 1.2,
    timeframe: config.timeframe,
    symbol: config.symbol,
    startDate: config.startDate,
    endDate: config.endDate,
    equity: generateMockEquityCurve(),
    trades: generateMockTrades()
  };

  return mockResult;
};

function generateMockEquityCurve() {
  const data = [];
  let value = 10000;
  const startDate = new Date('2023-01-01');
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Random walk with slight upward bias
    value += (Math.random() - 0.4) * 100;
    value = Math.max(value, 5000); // Minimum value
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value)
    });
  }
  
  return data;
}

function generateMockTrades() {
  const trades = [];
  const startDate = new Date('2023-01-01');
  
  for (let i = 0; i < 50; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 7);
    
    trades.push({
      date: date.toISOString().split('T')[0],
      type: Math.random() > 0.5 ? 'buy' : 'sell' as 'buy' | 'sell',
      price: Math.random() * 50 + 100,
      quantity: Math.floor(Math.random() * 100) + 10,
      profit: (Math.random() - 0.3) * 500 // Slight positive bias
    });
  }
  
  return trades;
}
