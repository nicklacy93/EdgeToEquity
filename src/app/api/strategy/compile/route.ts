import { NextResponse } from "next/server";
import { z } from "zod";
import { StrategySpec as SpecSchema } from "@/types/strategy";
import { compileToTS } from "@/lib/strategy-compiler";

const CompileRequest = z.object({
    spec: SpecSchema,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { spec } = CompileRequest.parse(body);

        const { code, diagnostics } = compileToTS(spec);

        return NextResponse.json({
            ok: true,
            code,
            diagnostics
        });
    } catch (error) {
        console.error("Compile strategy error:", error);
        return NextResponse.json(
            { ok: false, error: "Failed to compile strategy" },
            { status: 500 }
        );
    }
}
