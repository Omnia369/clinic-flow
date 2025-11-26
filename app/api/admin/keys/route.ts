import { NextResponse } from 'next/server';
import { listKeys, issueNewKey } from '../../../../lib/auth';

function checkAuth(req: Request): boolean {
  const auth = req.headers.get('authorization');
  const token = process.env.ADMIN_BEARER_TOKEN;
  if (!token) return false; // No token set, deny access
  return (auth === `Bearer ${token}`);
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const items = await listKeys(200);
    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Error listing keys' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing or invalid email' }, { status: 400 });
    }
    const newKey = await issueNewKey(email);
    return NextResponse.json({ ok: true, key: newKey });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Error issuing key' }, { status: 500 });
  }
}
