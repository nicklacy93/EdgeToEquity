import { NextResponse } from "next/server";
import { openai } from "@/lib/llm";

export async function GET() {
  try {
    // Simple test to verify API key
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "Say 'API key is working' and nothing else." }
      ],
      max_tokens: 10,
    });

    const message = response.choices[0]?.message?.content || "No response";
    
    return NextResponse.json({ 
      ok: true, 
      message,
      apiKeyWorking: true 
    });
  } catch (error) {
    console.error("API key test error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        apiKeyWorking: false 
      },
      { status: 500 }
    );
  }
}
