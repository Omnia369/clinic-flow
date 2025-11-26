import { NextResponse } from 'next/server';
import { validateKey, checkPreviewUsage, recordPreviewUsage } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { command = '', context = {}, govers_level = 1, email = '' } = payload || {};
    const authKey = req.headers.get('authorization')?.replace('Bearer ', '');

    let effectiveEmail: string | null = null;
    let isGated = false;

    if (authKey) {
      const { valid, email: keyEmail } = await validateKey(authKey);
      if (valid) {
        effectiveEmail = keyEmail;
        isGated = true;
      } else {
        return NextResponse.json({ ok: false, error: 'Invalid access key' }, { status: 401 });
      }
    } else if (email) {
      // No key, check for free preview eligibility
      const usage = await checkPreviewUsage(email);
      if (usage.used) {
        return NextResponse.json({ ok: false, error: 'Free preview already used for this email address.' }, { status: 429 });
      }
      effectiveEmail = email;
    } else {
      return NextResponse.json({ ok: false, error: 'An access key or email is required.' }, { status: 400 });
    }

    // Record usage for the free preview
    if (!isGated && effectiveEmail) {
      await recordPreviewUsage(effectiveEmail);
    }

    const result = {
      ok: true,
      watermark: !isGated, // Watermark if it was a free preview
      command,
      govers_level,
      blocks: [
        { id: 'sample', title: 'Preview', body: 'This is a stubbed preview. Full generation will unlock after key redemption.', tags: ['preview'] }
      ],
      contextSummary: Object.keys(context)
    };

    const res = NextResponse.json(result, { status: 200 });
    res.headers.set('X-Preview', 'true');
    if (effectiveEmail) res.headers.set('X-Preview-Email', effectiveEmail);
    return res;
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Invalid request' }, { status: 400 });
  }
}
