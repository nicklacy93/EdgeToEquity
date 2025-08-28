// pages/api/test-claude.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resp = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hello?' }]
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );

    return res.status(200).json({ result: resp.data });
  } catch (err: any) {
    console.error("❌ Claude test failed:", err.response?.data || err.message);
    return res.status(500).json({
      error: err.response?.data || err.message
    });
  }
}
