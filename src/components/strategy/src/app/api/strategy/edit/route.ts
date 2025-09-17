import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/llm";
import { tryLive, liveDown } from "@/lib/llm-guard";
import { extractJson } from "@/lib/json-extract";
import { contentToString } from "@/lib/content-normalize";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mockEdit(body: any) {
    const spec = body?.strategy ?? {};
    return {
        ...spec,
        name: (spec?.name ?? 'Strategy') + '_Edited',
        indicators: [...(spec?.indicators ?? []), { name: 'EMA', type: 'trend', params: { period: 200 } }],
        risk: { ...(spec?.risk ?? {}), stopLoss: 0.03 },
    };
}

export async function POST(req: Request) {
    const reqId = Date.now().toString(36);
    try {
        const body = await req.json();
        if (body?.mock === true) {
            return NextResponse.json({ ok: true, mode: 'MOCK', spec: mockEdit(body), reqId });
        }
        if (liveDown()) {
            return NextResponse.json({ ok: true, mode: 'MOCK_FALLBACK', spec: mockEdit(body), reqId });
        }

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
                            "You are the Strategy Doctor. Respond with a JSON object containing key 'spec' (edited StrategySpec). No extra text.",
                    },
                    { role: "user", content: `Edit request: ${JSON.stringify(body)}` }, // stringify objects
                ],
            });

            const raw = completion.choices?.[0]?.message?.content;
            const text = contentToString(raw);
            if (process.env.NODE_ENV !== "production") {
                console.log("[edit] content type:", typeof raw);
                console.log("[edit] content head:", text.slice(0, 200));
            }
            const parsed = extractJson(text);
            return parsed;
        });

        if (live.ok) {
            const payload: any = live.r;
            const spec = payload?.spec ?? payload;
            return NextResponse.json({ ok: true, mode: "LIVE", spec, reqId });
        }

        return NextResponse.json({ ok: true, mode: "MOCK_FALLBACK", spec: mockEdit(body), reqId });

    } catch (err: any) {
        console.error("[edit] error", err);
        // Graceful fallback instead of 500
        return NextResponse.json(
            { ok: true, mode: "MOCK_FALLBACK", spec: mockEdit({}), reqId, note: String(err?.message ?? err) },
            { status: 200 }
        );
    }
}