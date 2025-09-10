import { NextResponse } from "next/server";
import { StrategySpec as SpecSchema } from "@/types/strategy";
import { jsonOnly, SYS_ARCHITECT } from "@/lib/llm";

export async function POST(req: Request) {
  const { content, kind } = await req.json() as { content: string; kind: "json"|"pine"|"brief" };
  if (kind === "json") {
    const parsed = SpecSchema.parse(JSON.parse(content));
    return NextResponse.json({ ok: true, spec: parsed, source: "upload:json" });
  }
  if (kind === "brief") {
    const raw = await jsonOnly("gpt-4o-mini", SYS_ARCHITECT, `
Return StrategySpec JSON (version "v1") for this brief (JSON only):
${content}
SCHEMA:
${SpecSchema.toString()}
`.trim());
    const parsed = SpecSchema.parse(JSON.parse(raw));
    parsed.meta = { ...(parsed.meta ?? {}), source: "upload:brief" };
    return NextResponse.json({ ok: true, spec: parsed, source: "upload:brief" });
  }
  // pine
  const raw = await jsonOnly("gpt-4o-mini", SYS_ARCHITECT, `
Extract a StrategySpec JSON ONLY (no code, no prose) from this Pine Script.
Map ta.sma/ta.ema/ta.rsi/ta.atr/macd to indicators SMA/EMA/RSI/ATR/MACD with reasonable params.
If exits/entries are ambiguous, infer simplest consistent rules.
SCHEMA:
${SpecSchema.toString()}

PINE:
${content.slice(0, 20000)}
`.trim());
  const parsed = SpecSchema.parse(JSON.parse(raw));
  parsed.meta = { ...(parsed.meta ?? {}), source: "upload:pine" };
  return NextResponse.json({ ok: true, spec: parsed, source: "upload:pine" });
}
