import { NextResponse } from "next/server";
import { z } from "zod";
import { StrategySpec as SpecSchema, StrategySpec } from "@/types/strategy";
import { jsonOnly, SYS_DOCTOR } from "@/lib/llm";
import { applyPatch } from "fast-json-patch";

const EditRequest = z.object({
    spec: SpecSchema,
    instruction: z.string().min(1),
    mode: z.enum(["patch", "replace"]).optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { spec, instruction, mode = "patch" } = EditRequest.parse(body);

        if (!instruction) {
            return NextResponse.json(
                { ok: false, error: "Instruction is required" },
                { status: 400 }
            );
        }

        const userPrompt = `Apply this instruction to the strategy: "${instruction}"\n\nCurrent strategy: ${JSON.stringify(spec, null, 2)}`;

        const result = await jsonOnly("gpt-4o-mini", SYS_DOCTOR, userPrompt);

        let updatedSpec: StrategySpec;

        if (mode === "patch") {
            // Apply JSON patch
            const patch = result.patch || [];
            updatedSpec = applyPatch(spec, patch).newDocument;
        } else {
            // Full replacement
            updatedSpec = SpecSchema.parse(result);
        }

        // Increment revision and update metadata
        updatedSpec.revision = spec.revision + 1;
        updatedSpec.meta.updatedAt = new Date().toISOString();
        updatedSpec.meta.updatedBy = "doctor";

        return NextResponse.json({ ok: true, spec: updatedSpec });
    } catch (error) {
        console.error("Edit strategy error:", error);
        return NextResponse.json(
            { ok: false, error: "Failed to edit strategy" },
            { status: 500