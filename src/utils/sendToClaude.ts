export async function sendToClaude(prompt: string) {
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const payload = {
    model: "anthropic/claude-3-sonnet",
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`,
        "HTTP-Referer": "https://edge2equity.ai",
        "X-Title": "EdgeToEquity Chat",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("🧠 Claude raw response:", data);

    const content =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.content ||
      JSON.stringify(data);

    return content;
  } catch (error: any) {
    console.error("❌ Claude API error:", error?.message || error);
    throw new Error("Claude failed to respond.");
  }
}
