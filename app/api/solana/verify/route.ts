import { NextResponse } from 'next/server';
import { findSignaturesForReference } from '../../../../lib/solana';

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { reference } = body || {};
  if (!reference) {
    return NextResponse.json({ ok: false, error: 'Missing reference' }, { status: 400 });
  }

  try {
    const signatures = await findSignaturesForReference(String(reference));
    if (signatures.length > 0) {
      return NextResponse.json({ ok: true, found: true, signature: signatures[0], signatures }, { status: 200 });
    }
    return NextResponse.json({ ok: true, found: false }, { status: 202 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Lookup error' }, { status: 500 });
  }
}
