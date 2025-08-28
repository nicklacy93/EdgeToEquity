import { ChatMessage } from "@/types/ChatTypes";
import { sendToAI } from "./sendToAI";

/**
 * Builds a session summary prompt and sends it to AI (Claude or OpenAI).
 */
export async function summarizeMemory(
  messages: ChatMessage[],
  moodHistory: string[],
  bookmarks: ChatMessage[]
): Promise<string> {
  const lastMessages = messages.slice(-12); // last 12 exchanges
  const recentMood = (moodHistory || []).slice(-5); // ? minimal null-safe
  const safeBookmarks = bookmarks || [];             // ? optional fallback

  const prompt = `
You are EdgeBot, an AI emotional trading coach. Create a concise TL;DR of this trader's recent chat session.

Include:
- Overall tone and emotional progression
- What the user seems to be struggling with or celebrating
- What was bookmarked (important takeaways)
- Encouraging summary with 1 actionable insight

Mood Trend: ${recentMood.join(" ? ")}

Bookmarked Notes:
${safeBookmarks.map((b) => `• ${b.content}`).join("\n")}

Chat Snippets:
${lastMessages
  .map((m) => `${m.role === "user" ? "User" : "EdgeBot"}: ${m.content}`)
  .join("\n")}
`.trim();

  try {
    const aiResponse = await sendToAI(prompt, "summary");
    return aiResponse || "?? Summary could not be generated.";
  } catch (err) {
    console.error("? summarizeMemory failed:", err);
    return "?? Summary generation failed.";
  }
}
