import { NextResponse } from 'next/server';
import { verifyPaddleSignature, coercePublicKeyFromEnv } from '../../../lib/paddle';
import { addCapturedEvent } from '../../../../lib/capture';

function formDataToObject(fd: FormData) {
  const obj: Record<string, any> = {};
  fd.forEach((v, k) => { obj[k] = String(v); });
  return obj;
}

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') || '';
  let body: Record<string, any> = {};

  try {
    if (ct.includes('application/x-www-form-urlencoded')) {
      const fd = await req.formData();
      body = formDataToObject(fd);
    } else if (ct.includes('application/json')) {
      body = await req.json();
    } else {
      const text = await req.text();
      body = { _raw: text } as any;
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Unable to parse body' }, { status: 400 });
  }

  const alert_name = body?.alert_name || null;
  const publicKey = coercePublicKeyFromEnv(process.env.PADDLE_PUBLIC_KEY);
  const verified = publicKey ? verifyPaddleSignature(body, publicKey) : false;
  const status = verified ? 200 : 202;

  // Capture for admin QA (in-memory; replace with DB for production)
  try {
    const headersObj = Object.fromEntries(req.headers.entries());
    addCapturedEvent({
      provider: 'paddle',
      headers: headersObj,
      parsed_body: body,
      alert_name,
      verify_result: verified,
      note: verified ? 'Signature verified' : (!publicKey ? 'Missing PADDLE_PUBLIC_KEY' : 'Signature not verified'),
      last_status: status,
    });
  } catch {}

  return NextResponse.json(
    {
      ok: true,
      provider: 'paddle',
      alert_name,
      verified,
      note: verified ? 'Signature verified' : (!publicKey ? 'Missing PADDLE_PUBLIC_KEY' : 'Signature not verified')
    },
    { status }
  );
}
