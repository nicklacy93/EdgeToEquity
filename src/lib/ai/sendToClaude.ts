import { buildSystemPrompt } from "@/utils/buildSystemPrompt";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  content: string;
}

export async function sendToClaude(messages: ChatMessage[], mood: string, confidence: string) {
  const formattedHistory = messages.map(m =>
    `${m.sender === "user" ? "User" : "EdgeBot"}: ${m.content}`
  ).join("\n");

  const systemPrompt = buildSystemPrompt({
    mood,
    confidence,
    context: "pre-execution"
  });

  const fullPrompt = `${systemPrompt}\n\n${formattedHistory}\nEdgeBot:`;

  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: fullPrompt })
  });

  const data = await response.json();
  return data.completion?.trim() || "Sorry, I had trouble thinking. Try again.";
}
