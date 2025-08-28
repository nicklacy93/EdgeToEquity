import { PersonalityProfile } from "@/types/ChatTypes";

interface MemoryRewriteRequest {
  content: string;
  tone: PersonalityProfile["preferredTone"];
  agent: string;
}

interface RewrittenMemory {
  rewritten: string;
  tags?: string[];
  emoji?: string;
}

export async function rewriteMemoryCard({ content, tone, agent }: MemoryRewriteRequest): Promise<RewrittenMemory> {
  try {
    const response = await fetch("/api/ai/rewriteMemory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, tone, agent }),
    });

    if (!response.ok) throw new Error("Failed to rewrite memory");

    const data = await response.json();
    return {
      rewritten: data.rewritten,
      tags: data.tags,
      emoji: data.emoji,
    };
  } catch (err) {
    console.error("Rewrite error:", err);
    return {
      rewritten: content,
    };
  }
}
