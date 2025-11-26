import { NextResponse } from 'next/server';
import { updateKeyStatus } from '../../../../lib/auth';

function checkAuth(req: Request): boolean {
  const auth = req.headers.get('authorization');
  const token = process.env.ADMIN_BEARER_TOKEN;
  if (!token) return false;
  return (auth === `Bearer ${token}`);
}

export async function PATCH(req: Request, { params }: { params: { key: string } }) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { key } = params;
    const { status } = await req.json();
    if (status !== 'active' && status !== 'revoked') {
      return NextResponse.json({ ok: false, error: 'Invalid status' }, { status: 400 });
    }
    const success = await updateKeyStatus(key, status);
    if (success) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: 'Key not found or no change' }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Error updating key' }, { status: 500 });
  }
}
