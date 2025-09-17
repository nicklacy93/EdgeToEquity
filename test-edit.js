console.log('Testing Edit endpoint...');

const testSpec = {
  version: 'v1',
  revision: 0,
  name: 'Test Strategy',
  timeframe: '5m',
  symbols: ['SPY'],
  indicators: [],
  entries: [],
  exits: [],
  risk: {}
};

fetch('http://localhost:3000/api/strategy/edit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    spec: testSpec,
    instruction: 'Add RSI indicator',
    mode: 'replace'
  })
})
.then(response => response.json())
.then(data => console.log(' Edit endpoint:', data.ok ? 'SUCCESS' : 'FAILED'))
.catch(error => console.log(' Edit endpoint failed:', error.message));
