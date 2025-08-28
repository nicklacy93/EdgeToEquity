// src/types/ChatTypes.ts

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  provider?: "Claude" | "OpenAI";
}
