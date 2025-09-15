import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        return NextResponse.json({ ok: true, message: "Test endpoint working" });
    } catch (error) {
        console.error("Test error:", error);
        return NextResponse.json(
            { ok: false, error: "Test failed" },
            { status: 500 }
        );
    }
}
