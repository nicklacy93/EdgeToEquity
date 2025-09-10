import { NextResponse } from "next/server";
import { StrategySpec as SpecSchema, StrategySpec } from "@/types/strategy";
import { jsonOnly, SYS_DOCTOR } from "@/lib/llm";
import { applyPatch } from "fast-json-patch";

export async function POST(req: Request) {
  const { spec, instruction, mode = "patch" } = await req.json() as { spec: StrategySpec; instruction: string; mode?: "patch"|"replace" };
  SpecSchema.parse(spec);

  if (mode === "patch") {
    const msg = `
Return a JSON Patch (RFC6902) array to apply the INSTRUCTION to SPEC.
- Minimal, targeted ops.
- Do not remove risk.stop unless requested explicitly.

SPEC:
${JSON.stringify(spec)}

INSTRUCTION:
${instruction}
`.trim();

    const raw = await jsonOnly("gpt-4o-mini", SYS_DOCTOR, msg);
    const patch = JSON.parse(raw);
    const updated = applyPatch(structuredClone(spec), patch, /*validate*/ true).newDocument;
    const parsed = SpecSchema.parse(updated);
    parsed.revision = (parsed.revision ?? 0) + 1;
    parsed.meta = { ...(parsed.meta ?? {}), updatedBy: "doctor" };
    return NextResponse.json({ ok: true, spec: parsed, patch });
  }

  const raw = await jsonOnly("gpt-4o-mini", SYS_DOCTOR,
    `Return a complete StrategySpec JSON replacement (no prose) that applies the INSTRUCTION.\nSPEC:\n${JSON.stringify(spec)}\nINSTRUCTION:\n${instruction}\nSCHEMA:\n${SpecSchema.toString()}`);
  const parsed = SpecSchema.parse(JSON.parse(raw));
  parsed.revision = (parsed.revision ?? 0) + 1;
  parsed.meta = { ...(parsed.meta ?? {}), updatedBy: "doctor" };
  return NextResponse.json({ ok: true, spec: parsed, replaced: true });
}
