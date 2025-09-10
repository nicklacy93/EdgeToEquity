import { NextResponse } from "next/server";
import { StrategySpec as SpecSchema } from "@/types/strategy";
import { compileToTS } from "@/lib/strategy-compiler";

export async function POST(req: Request) {
  const { spec } = await req.json();
  const parsed = SpecSchema.parse(spec);
  const { code, diagnostics } = compileToTS(parsed);
  return NextResponse.json({ ok: diagnostics.length === 0, code, diagnostics });
}
