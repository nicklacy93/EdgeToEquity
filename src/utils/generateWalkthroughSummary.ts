export async function generateWalkthroughSummary({
  mood,
  confidence,
  messages,
}: {
  mood: string;
  confidence: string;
  messages: { sender: string; content: string }[];
}): Promise<string> {
  const summaryPrompt = `
You are EdgeBot, an emotionally intelligent trading performance coach.

Summarize the user's trading mindset and decision behavior based on this session.

Mood: ${mood}
Confidence: ${confidence}

Chat Transcript:
${messages
  .map((msg) => `${msg.sender === "user" ? "Trader" : "EdgeBot"}: ${msg.content}`)
  .join("\\n")}

Write a 2-paragraph walkthrough summary with:
1. Emotional progression + decision tone
2. Strengths, risks, and growth recommendations

Use a supportive, objective tone.
`;

  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: summaryPrompt }),
  });

  const data = await response.json();
  return data.reply || "No summary generated.";
}
