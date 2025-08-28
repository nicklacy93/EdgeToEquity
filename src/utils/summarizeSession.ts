import { ChatMessageWithMeta } from "@/types/ChatTypes";

export async function summarizeSession(agent: string, messages: ChatMessageWithMeta[]) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "Summarize this conversation as an insight report:",
      agent,
      personality: {},
      messages,
      mode: "session-summary"
    }),
  });

  if (!res.ok) return { summary: "?? AI error during summary." };
  return await res.json();
}
