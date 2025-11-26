import { NextResponse } from 'next/server';
import { verifyPayPalWebhookSignature } from '../../../../lib/paypal';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const headers = req.headers;
  const verifyHeaders = {
    transmission_id: headers.get('paypal-transmission-id') || '',
    transmission_time: headers.get('paypal-transmission-time') || '',
    cert_url: headers.get('paypal-cert-url') || '',
    auth_algo: headers.get('paypal-auth-algo') || '',
    transmission_sig: headers.get('paypal-transmission-sig') || '',
  };

  const webhookId = process.env.PAYPAL_WEBHOOK_ID || '';
  const missing = Object.entries(verifyHeaders).filter(([_, v]) => !v).map(([k]) => k);

  if (!webhookId) {
    return NextResponse.json({ ok: true, provider: 'paypal', verified: false, note: 'Missing PAYPAL_WEBHOOK_ID' }, { status: 202 });
  }

  if (missing.length) {
    return NextResponse.json({ ok: true, provider: 'paypal', verified: false, note: `Missing headers: ${missing.join(', ')}` }, { status: 202 });
  }

  try {
    const verified = await verifyPayPalWebhookSignature(verifyHeaders as any, webhookId, body);
    const status = verified ? 200 : 202;
    return NextResponse.json({ ok: true, provider: 'paypal', verified }, { status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, provider: 'paypal', verified: false, error: e?.message || 'Verification error' }, { status: 500 });
  }
}
