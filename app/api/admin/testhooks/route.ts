import { NextResponse } from 'next/server';
import { listCapturedEvents } from '../../../../lib/capture';

export async function GET() {
  const items = listCapturedEvents(200);
  return NextResponse.json({ ok: true, items });
}
