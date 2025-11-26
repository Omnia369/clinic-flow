import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { command = '', context = {}, govers_level = 1, email = '' } = payload || {};

    // NOTE: This is a stub for development. Persistence and 1-free-per-email gating to be added.
    const result = {
      ok: true,
      watermark: true,
      command,
      govers_level,
      blocks: [
        { id: 'sample', title: 'Preview', body: 'This is a stubbed preview. Full generation will unlock after key redemption.', tags: ['preview'] }
      ],
      contextSummary: Object.keys(context)
    };

    const res = NextResponse.json(result, { status: 200 });
    res.headers.set('X-Preview', 'true');
    if (email) res.headers.set('X-Preview-Email', email);
    return res;
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Invalid request' }, { status: 400 });
  }
}
