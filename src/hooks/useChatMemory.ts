import { useCallback } from "react";
import { ChatMessage } from "@/types/ChatTypes";

const CHAT_MEMORY_KEY = "edgebot-chat-memory";

export function useChatMemory() {
  const loadMemory = useCallback((): { messages: ChatMessage[] } | null => {
    try {
      const raw = localStorage.getItem(CHAT_MEMORY_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("Failed to load chat memory:", error);
      return null;
    }
  }, []);

  const saveMemory = useCallback((memory: { messages: ChatMessage[] }) => {
    try {
      localStorage.setItem(CHAT_MEMORY_KEY, JSON.stringify(memory));
    } catch (error) {
      console.error("Failed to save chat memory:", error);
    }
  }, []);

  return { loadMemory, saveMemory };
}
