// Simple API test script
const testEndpoints = async () => {
    const baseUrl = 'http://localhost:3000';

    console.log('Testing API endpoints...');

    // Test 1: Simple test endpoint
    try {
        const response = await fetch(`${baseUrl}/api/test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data = await response.json();
        console.log('✅ Test endpoint:', data);
    } catch (error) {
        console.log('❌ Test endpoint failed:', error.message);
    }

    // Test 2: OpenAI test endpoint
    try {
        const response = await fetch(`${baseUrl}/api/test-openai`, {
            method: 'GET'
        });
        const data = await response.json();
        console.log('✅ OpenAI test endpoint:', data);
    } catch (error) {
        console.log('❌ OpenAI test endpoint failed:', error.message);
    }

    // Test 3: Strategy generate endpoint
    try {
        const response = await fetch(`${baseUrl}/api/strategy/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                brief: "RSI mean reversion on SPY 5m",
                constraints: "use 1.5x ATR stop"
            })
        });
        const data = await response.json();
        console.log('✅ Strategy generate endpoint:', data);
    } catch (error) {
        console.log('❌ Strategy generate endpoint failed:', error.message);
    }
};

testEndpoints();

