import { NextResponse } from "next/server";
import { z } from "zod";
import { StrategySpec as SpecSchema } from "@/types/strategy";
import { jsonOnly, SYS_ARCHITECT } from "@/lib/llm";

const ImportRequest = z.object({
    kind: z.enum(["json", "pine", "brief"]),
    content: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { kind, content } = ImportRequest.parse(body);

        if (!content) {
            return NextResponse.json(
                { ok: false, error: "Content is required" },
                { status: 400 }
            );
        }

        let spec: any;

        if (kind === "json") {
            // Direct JSON import
            try {
                spec = JSON.parse(content);
            } catch (error) {
                return NextResponse.json(
                    { ok: false, error: "Invalid JSON content" },
                    { status: 400 }
                );
            }
        } else if (kind === "pine") {
            // Convert Pine Script to StrategySpec
            const userPrompt = `Convert this Pine Script to a StrategySpec: ${content}`;
            spec = await jsonOnly("gpt-4o-mini", SYS_ARCHITECT, userPrompt);
        } else if (kind === "brief") {
            // Generate from brief
            const userPrompt = `Create a trading strategy based on this brief: ${content}`;
            spec = await jsonOnly("gpt-4o-mini", SYS_ARCHITECT, userPrompt);
        } else {
            return NextResponse.json(
                { ok: false, error: "Invalid import kind" },
                { status: 400 }
            );
        }

        // Validate the result
        const validatedSpec = SpecSchema.parse(spec);

        return NextResponse.json({ ok: true, spec: validatedSpec });
    } catch (error) {
        console.error("Import strategy error:", error);
        return NextResponse.json(
            { ok: false, error: "Failed to import strategy" },
            { status: 500 }
        );
    }
}
