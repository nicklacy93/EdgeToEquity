console.log('Testing API endpoints...');

// Test 1: Simple test endpoint
fetch('http://localhost:3000/api/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})
.then(response => response.json())
.then(data => console.log(' Test endpoint:', data))
.catch(error => console.log(' Test endpoint failed:', error.message));

// Test 2: OpenAI test endpoint
fetch('http://localhost:3000/api/test-openai', {
  method: 'GET'
})
.then(response => response.json())
.then(data => console.log(' OpenAI test endpoint:', data))
.catch(error => console.log(' OpenAI test endpoint failed:', error.message));
