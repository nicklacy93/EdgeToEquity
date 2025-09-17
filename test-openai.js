console.log('Testing OpenAI integration...');

fetch('http://localhost:3000/api/strategy/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brief: 'RSI mean reversion on SPY 5m',
    constraints: 'use 1.5x ATR stop'
  })
})
.then(response => {
  console.log('Response status:', response.status);
  return response.text();
})
.then(text => {
  try {
    const data = JSON.parse(text);
    console.log(' Strategy generate response:', data);
  } catch (error) {
    console.log(' Response is not JSON:', text.substring(0, 200));
  }
})
.catch(error => console.log(' Request failed:', error.message));
