export async function sendToGenerator(prompt: string) {
  try {
    const response = await fetch("/api/analysis/generator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data?.code || "⚠️ No strategy code returned.";
  } catch (error) {
    console.error("Generator API error:", error);
    return "❌ Failed to generate strategy. Please try again.";
  }
}
export async function sendToGenerator(prompt: string) {
  try {
    const response = await fetch("/api/analysis/generator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data?.code || "⚠️ No strategy code returned.";
  } catch (error) {
    console.error("Generator API error:", error);
    return "❌ Failed to generate strategy. Please try again.";
  }
}
