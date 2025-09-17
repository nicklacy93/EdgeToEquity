console.log('Testing API endpoints after fixes...');

// Test 1: OpenAI health endpoint
fetch('http://localhost:3000/api/openai/health')
.then(response => response.json())
.then(data => console.log(' OpenAI health:', data))
.catch(error => console.log(' OpenAI health failed:', error.message));

// Test 2: Strategy generate endpoint
fetch('http://localhost:3000/api/strategy/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brief: 'RSI mean reversion on SPY 5m',
    constraints: 'use 1.5x ATR stop'
  })
})
.then(response => response.json())
.then(data => console.log(' Strategy generate:', data.ok ? 'SUCCESS' : 'FAILED - ' + data.error))
.catch(error => console.log(' Strategy generate failed:', error.message));
