import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const live = url.searchParams.get('live') === '1';
  const key = process.env.OPENAI_API_KEY ?? '';
  const hasKey = !!key && key.trim().length > 20;

  if (!live) {
    return NextResponse.json({ ok: hasKey, hasKey, runtime: 'nodejs' });
  }
  if (!hasKey) {
    return NextResponse.json({ ok: false, hasKey, error: 'Missing OPENAI_API_KEY' }, { status: 500 });
  }

  try {
    const r = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` }
    });
    const text = await r.text();
    return NextResponse.json({ ok: r.ok, upstreamStatus: r.status, upstreamBody: text.slice(0, 500) }, { status: r.ok ? 200 : 500 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}
