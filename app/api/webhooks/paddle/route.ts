import { NextResponse } from 'next/server';

function formDataToObject(fd: FormData) {
  const obj: Record<string, string> = {};
  fd.forEach((v, k) => { obj[k] = String(v); });
  return obj;
}

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') || '';
  let body: any = {};

  try {
    if (ct.includes('application/x-www-form-urlencoded')) {
      const fd = await req.formData();
      body = formDataToObject(fd);
    } else if (ct.includes('application/json')) {
      body = await req.json();
    } else {
      const text = await req.text();
      body = { _raw: text };
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Unable to parse body' }, { status: 400 });
  }

  // TODO: Implement RSA-SHA1 verification of p_signature using PADDLE_PUBLIC_KEY.
  // For now, we accept and return 202 to indicate async processing.
  const alert_name = body?.alert_name || null;

  return NextResponse.json(
    {
      ok: true,
      received: true,
      provider: 'paddle',
      alert_name,
      verified: false,
      note: 'Verification pending implementation'
    },
    { status: 202 }
  );
}
