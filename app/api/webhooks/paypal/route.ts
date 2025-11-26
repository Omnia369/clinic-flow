import { NextResponse } from 'next/server';
import { verifyPayPalWebhookSignature } from '../../../../lib/paypal';
import { addCapturedEvent } from '../../../../lib/capture';

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
    const note = 'Missing PAYPAL_WEBHOOK_ID';
    try {
      addCapturedEvent({ provider: 'paypal', headers: Object.fromEntries(headers.entries()), parsed_body: body, alert_name: body?.event_type, verify_result: false, note, last_status: 202 });
    } catch {}
    return NextResponse.json({ ok: true, provider: 'paypal', verified: false, note }, { status: 202 });
  }

  if (missing.length) {
    const note = `Missing headers: ${missing.join(', ')}`;
    try {
      addCapturedEvent({ provider: 'paypal', headers: Object.fromEntries(headers.entries()), parsed_body: body, alert_name: body?.event_type, verify_result: false, note, last_status: 202 });
    } catch {}
    return NextResponse.json({ ok: true, provider: 'paypal', verified: false, note }, { status: 202 });
  }

  try {
    const verified = await verifyPayPalWebhookSignature(verifyHeaders as any, webhookId, body);
    const status = verified ? 200 : 202;
    try {
      addCapturedEvent({ provider: 'paypal', headers: Object.fromEntries(headers.entries()), parsed_body: body, alert_name: body?.event_type, verify_result: verified, note: verified ? 'Verified' : 'Verification failed', last_status: status });
    } catch {}
    return NextResponse.json({ ok: true, provider: 'paypal', verified }, { status });
  } catch (e: any) {
    const note = e?.message || 'Verification error';
    try {
      addCapturedEvent({ provider: 'paypal', headers: Object.fromEntries(headers.entries()), parsed_body: body, alert_name: body?.event_type, verify_result: false, note, last_status: 500 });
    } catch {}
    return NextResponse.json({ ok: false, provider: 'paypal', verified: false, error: note }, { status: 500 });
  }
}
