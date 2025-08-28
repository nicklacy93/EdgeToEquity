export async function sendToOpenAI(prompt: string) {
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const payload = {
    model: "openai/gpt-4", // ✅ OpenAI via OpenRouter
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`, // ✅ Now works
        "HTTP-Referer": "https://edge2equity.ai",
        "X-Title": "EdgeToEquity Chat",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("🤖 OpenAI (via OpenRouter) raw response:", data);

    const content =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.content ||
      JSON.stringify(data);

    return content;
  } catch (error: any) {
    console.error("❌ OpenAI API error (via OpenRouter):", error?.message || error);
    throw new Error("OpenAI (via OpenRouter) failed to respond.");
  }
}
