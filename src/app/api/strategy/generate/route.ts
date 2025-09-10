import { NextResponse } from "next/server";
import { StrategySpec as SpecSchema } from "@/types/strategy";
import { jsonOnly, SYS_ARCHITECT } from "@/lib/llm";

export async function POST(req: Request) {
  const { brief, constraints } = await req.json();
  const prompt = `
Return StrategySpec JSON (version "v1") for:

BRIEF:
${brief}

CONSTRAINTS:
${constraints ?? "none"}

SCHEMA:
${SpecSchema.toString()}
  `.trim();

  const raw = await jsonOnly("gpt-4o-mini", SYS_ARCHITECT, prompt);
  try {
    const spec = SpecSchema.parse(JSON.parse(raw));
    return NextResponse.json({ ok: true, spec });
  } catch (err: any) {
    const repair = await jsonOnly("gpt-4o-mini", SYS_ARCHITECT,
      `Previous JSON failed Zod validation:\n${err?.message}\nReturn a corrected StrategySpec JSON ONLY.`);
    const spec = SpecSchema.parse(JSON.parse(repair));
    return NextResponse.json({ ok: true, spec, repaired: true });
  }
}
