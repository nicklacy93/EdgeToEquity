// Trading utilities for symbol handling and futures access
export const FUTURES_EXCHANGES = {
  CME: 'Chicago Mercantile Exchange',
  CBOT: 'Chicago Board of Trade', 
  NYMEX: 'New York Mercantile Exchange',
  COMEX: 'Commodity Exchange',
  ICE: 'Intercontinental Exchange'
};

export const FUTURES_CATEGORIES = {
  'Index Futures': ['ES', 'NQ', 'YM', 'RTY', 'MES', 'MNQ', 'MYM', 'M2K'],
  'Energy Futures': ['CL', 'NG', 'HO', 'RB', 'MCL'],
  'Metal Futures': ['GC', 'SI', 'HG', 'PA', 'PL', 'MGC'],
  'Agricultural Futures': ['ZS', 'ZC', 'ZW', 'ZO', 'ZR', 'ZM', 'ZL'],
  'Interest Rate Futures': ['ZB', 'ZN', 'ZF', 'ZT'],
  'Currency Futures': ['6E', '6B', '6J', '6A', '6C', '6S'],
  'Livestock Futures': ['HE', 'LE', 'GF'],
  'Soft Commodities': ['CC', 'CT', 'KC', 'SB', 'OJ'],
  'Crypto Futures': ['BTC', 'ETH', 'MBT', 'MET']
};

export const formatSymbolForTradingView = (symbol: string): string => {
  const upperSymbol = symbol.toUpperCase();
  
  // Handle common futures symbols
  const futuresMapping: Record<string, string> = {
    'ES': 'CME_MINI:ES1!',
    'NQ': 'CME_MINI:NQ1!',
    'YM': 'CBOT_MINI:YM1!',
    'RTY': 'CME_MINI:RTY1!',
    'CL': 'NYMEX:CL1!',
    'GC': 'COMEX:GC1!',
    'SI': 'COMEX:SI1!',
    'NG': 'NYMEX:NG1!',
    // Micro futures
    'MES': 'CME_MINI:MES1!',
    'MNQ': 'CME_MINI:MNQ1!',
    'MYM': 'CBOT_MINI:MYM1!',
    'M2K': 'CME_MINI:M2K1!',
    // Crypto futures
    'BTC': 'CME:BTC1!',
    'ETH': 'CME:ETH1!'
  };

  return futuresMapping[upperSymbol] || symbol;
};

export const getSymbolInfo = (symbol: string) => {
  const formatted = formatSymbolForTradingView(symbol);
  const [exchange, contract] = formatted.split(':');
  
  return {
    original: symbol,
    formatted,
    exchange,
    contract,
    isFutures: formatted.includes('1!'),
    category: Object.entries(FUTURES_CATEGORIES).find(([_, symbols]) => 
      symbols.includes(symbol.toUpperCase())
    )?.[0] || 'Other'
  };
};

export const POPULAR_TRADING_SYMBOLS = [
  // Major Index Futures
  { symbol: 'ES', name: 'E-mini S&P 500', type: 'futures' },
  { symbol: 'NQ', name: 'E-mini NASDAQ', type: 'futures' },
  { symbol: 'YM', name: 'E-mini Dow Jones', type: 'futures' },
  { symbol: 'RTY', name: 'E-mini Russell 2000', type: 'futures' },
  
  // Micro Futures
  { symbol: 'MES', name: 'Micro E-mini S&P 500', type: 'futures' },
  { symbol: 'MNQ', name: 'Micro E-mini NASDAQ', type: 'futures' },
  
  // Commodities
  { symbol: 'CL', name: 'Crude Oil', type: 'futures' },
  { symbol: 'GC', name: 'Gold', type: 'futures' },
  { symbol: 'SI', name: 'Silver', type: 'futures' },
  { symbol: 'NG', name: 'Natural Gas', type: 'futures' },
  
  // Crypto Futures
  { symbol: 'BTC', name: 'Bitcoin Futures', type: 'futures' },
  { symbol: 'ETH', name: 'Ethereum Futures', type: 'futures' },
  
  // Major Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock' },
  
  // Forex
  { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex' },
  { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex' },
  { symbol: 'USDJPY', name: 'USD/JPY', type: 'forex' },
  
  // Crypto Spot
  { symbol: 'BTCUSD', name: 'Bitcoin/USD', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum/USD', type: 'crypto' }
];