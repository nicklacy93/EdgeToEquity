// src/lib/api.ts
export interface ChatResponse {
  data: {
    response: string;
    agent_used: string;
    model_used: string;
    confidence_score: number;
  };
}

export const apiService = {
  sendChatMessage: async (message: string): Promise<ChatResponse> => {
    // Replace this with your actual API endpoint
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }
};
