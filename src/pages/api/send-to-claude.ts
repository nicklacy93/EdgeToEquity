import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    const claudeRes = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-sonnet-20240620',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': Bearer ,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = claudeRes.data.choices?.[0]?.message?.content || '? No response from Claude.';
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Claude API error:', error?.response?.data || error.message);
    return res.status(500).json({
      message: 'Claude API call failed.',
      error: error?.response?.data || error.message
    });
  }
}
