console.log('Testing all strategy API endpoints...');

// Test 1: Strategy compile endpoint
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
.then(data => console.log(' Compile endpoint:', data.ok ? 'SUCCESS' : 'FAILED'))
.catch(error => console.log(' Compile endpoint failed:', error.message));

// Test 2: Strategy import endpoint
fetch('http://localhost:3000/api/strategy/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    kind: 'json',
    content: JSON.stringify({
      version: 'v1',
      revision: 0,
      name: 'Test Strategy',
      timeframe: '5m',
      symbols: ['SPY'],
      indicators: [],
      entries: [],
      exits: [],
      risk: {}
    })
  })
})
.then(response => response.json())
.then(data => console.log(' Import endpoint:', data.ok ? 'SUCCESS' : 'FAILED'))
.catch(error => console.log(' Import endpoint failed:', error.message));
