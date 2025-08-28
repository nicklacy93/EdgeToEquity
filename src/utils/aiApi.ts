import { ChatMessage } from '@/types/ChatTypes';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;
const ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export async function fetchAIResponse(messages: ChatMessage[], prompt: string): Promise<string> {
  const chatHistory = messages
    .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.message }))
    .concat({ role: 'user', content: prompt });

  const body = {
    model: 'gpt-4',
    messages: chatHistory,
    temperature: 0.7,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: \Bearer \\,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  return json.choices?.[0]?.message?.content || 'No response.';
}
