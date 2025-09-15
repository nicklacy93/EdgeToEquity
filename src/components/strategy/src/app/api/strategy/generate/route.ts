import { NextResponse } from "next/server";
import { z } from "zod";
import { StrategySpec as SpecSchema } from "@/types/strategy";
import { jsonOnly, SYS_ARCHITECT } from "@/lib/llm";

const GenerateRequest = z.object({
    brief: z.string().min(1),
    constraints: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { brief, constraints } = GenerateRequest.parse(body);

        if (!brief) {
            return NextResponse.json(
                { ok: false, error: "Brief is required" },
                { status: 400 }
            );
        }

    const userPrompt = `Create a trading strategy based on this brief: "${brief}"${
      constraints ? `\n\nConstraints: ${constraints}` : ""
    }`;

    const result = await jsonOnly("gpt-4o-mini", SYS_ARCHITECT, userPrompt);
    
    // Validate the result
    const spec = SpecSchema.parse(result);
    
    return NextResponse.json({ ok: true, spec });
    } catch (error) {
        console.error("Generate strategy error:", error);
        return NextResponse.json(
            { ok: false, error: "Failed to generate strategy" },
            { status: 500 }
        );
    }
}
