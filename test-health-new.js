console.log('Testing OpenAI health endpoint...');

fetch('http://localhost:3000/api/openai/health')
.then(response => response.json())
.then(data => console.log(' OpenAI health:', data))
.catch(error => console.log(' OpenAI health failed:', error.message));
