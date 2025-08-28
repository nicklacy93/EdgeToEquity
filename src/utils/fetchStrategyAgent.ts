export async function fetchStrategyAgent({
  endpoint,
  payload,
}: {
  endpoint: string;
  payload: Record<string, any>;
}): Promise<{
  content: string;
  model: string;
  fallbackUsed: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(`http://127.0.0.1:5001${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    // Normalize response based on route
    return {
      content:
        data.code ||
        data.explanation ||
        data.diagnostics ||
        data.psychologyReport ||
        data.summary ||
        "No content returned.",
      model: data.model || "unknown",
      fallbackUsed: data.fallbackUsed || false,
      error: data.error || "",
    };
  } catch (err: any) {
    return {
      content: "",
      model: "none",
      fallbackUsed: true,
      error: err.message || "Request failed",
    };
  }
}
