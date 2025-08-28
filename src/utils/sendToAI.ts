import { sendToClaude } from "./sendToClaude";
import { sendToOpenAI } from "./sendToOpenAI";

interface AIResponse {
  success: boolean;
  message: string;
  provider: "Claude" | "OpenAI";
}

// ✅ Added "summary" and clarified intent
const agentToProvider: Record<string, "Claude" | "OpenAI"> = {
  strategy: "OpenAI",
  debug: "OpenAI",
  psychology: "Claude",
  general: "Claude",
  news: "Claude",
  summary: "Claude", // ✅ Session summary uses Claude by default
};

export async function sendToAI(prompt: string, agent: string): Promise<AIResponse> {
  const provider = agentToProvider[agent] || "OpenAI";
  console.log("🧠 Agent selected:", agent);
  console.log("📡 Routed to:", provider);

  try {
    const message =
      provider === "Claude"
        ? await sendToClaude(prompt)
        : await sendToOpenAI(prompt);

    return {
      success: true,
      message,
      provider,
    };
  } catch (error: any) {
    console.error("❌ AI Routing Error:", error?.message || error);
    return {
      success: false,
      message: "AI failed to respond.",
      provider,
    };
  }
}
