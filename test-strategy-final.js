console.log('Testing Strategy API endpoints...');

// Test 1: Strategy generate endpoint
fetch('http://localhost:3000/api/strategy/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brief: 'RSI mean reversion on SPY 5m',
    constraints: 'use 1.5x ATR stop'
  })
})
.then(response => response.json())
.then(data => console.log(' Strategy generate endpoint:', data.ok ? 'SUCCESS' : 'FAILED - ' + data.error))
.catch(error => console.log(' Strategy generate endpoint failed:', error.message));

// Test 2: Strategy compile endpoint
fetch('http://localhost:3000/api/strategy/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    spec: {
      version: 'v1',
      revision: 0,
      name: 'Test Strategy',
      timeframe: '5m',
      symbols: ['SPY'],
      indicators: [],
      entries: [],
      exits: [],
      risk: {}
    }
  })
})
.then(response => response.json())
.then(data => console.log(' Strategy compile endpoint:', data.ok ? 'SUCCESS' : 'FAILED - ' + data.error))
.catch(error => console.log(' Strategy compile endpoint failed:', error.message));
