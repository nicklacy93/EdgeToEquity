import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/llm";
import { tryLive, liveDown } from "@/lib/llm-guard";
import { extractJson } from "@/lib/json-extract";
import { contentToString } from "@/lib/content-normalize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mockSpec(brief?: string) {
    return {
        version: 'v1',
        name: 'RSI-EMA Momentum v1',
        description: `Mocked from brief: ${brief ?? 'baseline'}`,
        indicators: [
            { name: 'RSI', type: 'momentum', params: { period: 14 } },
            { name: 'EMA', type: 'trend', params: { period: 50 } },
        ],
        entries: [
            { id: 'e1', condition: 'RSI(14) crosses above 50 and Close > EMA(50)', action: 'enter_long', priority: 5 },
        ],
        exits: [{ id: 'x1', condition: 'RSI(14) crosses below 50', action: 'exit_long' }],
        risk: { stopLoss: 0.02, takeProfit: 0.04, maxPositionSize: 0.1 },
    };
}

export async function POST(req: Request) {
    const reqId = Date.now().toString(36);
    try {
        const body = await req.json() as { brief?: string; mock?: boolean };
        // Manual debug override
        if (body?.mock === true) {
            return NextResponse.json({ ok: true, mode: 'MOCK', spec: mockSpec(body.brief), reqId });
        }
        // Circuit breaker
        if (liveDown()) {
            return NextResponse.json({ ok: true, mode: 'MOCK_FALLBACK', spec: mockSpec(body?.brief), reqId });
        }

        // LIVE call (AI-first)
        const live = await tryLive(async () => {
            const openai = getOpenAI();
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                temperature: 0,
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content:
                            "You are the Strategy Architect. Respond with a JSON object containing key 'spec' (StrategySpec). No extra text.",
                    },
                    { role: "user", content: `Brief: ${String(body?.brief ?? "baseline")}` },
                ],
            });

            const raw = completion.choices?.[0]?.message?.content;
            const text = contentToString(raw);
            if (process.env.NODE_ENV !== "production") {
                console.log("[generate] content type:", typeof raw);
                console.log("[generate] content head:", text.slice(0, 200));
            }
            const parsed = extractJson(text);
            return parsed; // expected { spec: {...} } or the spec itself
        });

        if (live.ok) {
            const payload: any = live.r;
            const spec = payload?.spec ?? payload;
            return NextResponse.json({ ok: true, mode: "LIVE", spec, reqId });
        }

        // Live failed → graceful fallback
        return NextResponse.json({ ok: true, mode: "MOCK_FALLBACK", spec: mockSpec(body?.brief), reqId });

    } catch (err: any) {
        console.error("[generate] error", err);
        // Never strand the user—fallback instead of 500
        return NextResponse.json(
            { ok: true, mode: "MOCK_FALLBACK", spec: mockSpec(), reqId, note: String(err?.message ?? err) },
            { status: 200 }
        );
    }
}
