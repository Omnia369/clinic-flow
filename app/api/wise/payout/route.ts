import { NextResponse } from 'next/server';
import { createQuote, createRecipient, createTransfer, fundTransfer } from '../../../../lib/wise';

function checkAuth(req: Request): boolean {
  const auth = req.headers.get('authorization');
  const token = process.env.ADMIN_BEARER_TOKEN;
  if (!token) return false;
  return (auth === `Bearer ${token}`);
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, currency, email, fullName } = body;

    if (!amount || !currency || !email || !fullName) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const profileId = parseInt(process.env.WISE_PROFILE_ID || '0', 10);
    if (!profileId) {
      return NextResponse.json({ ok: false, error: 'WISE_PROFILE_ID is not configured' }, { status: 500 });
    }

    // 1. Create Recipient (Account)
    const recipient = await createRecipient({
      currency,
      type: 'email',
      profile: profileId,
      accountHolderName: fullName,
      details: {
        email,
      }
    });

    // 2. Create a Quote
    const quote = await createQuote(profileId, {
      sourceCurrency: 'USD', // Assuming source is USD
      targetCurrency: currency,
      targetAmount: amount,
      payOut: 'BALANCE',
    });

    // 3. Create a Transfer
    const transfer = await createTransfer(profileId, {
      targetAccount: recipient.id,
      quoteUuid: quote.id,
      customerTransactionId: `payout-${Date.now()}`, // Idempotency key
      details: {
        reference: 'Clinic Flow Payout',
      }
    });

    // 4. Fund the Transfer from Balance
    const funded = await fundTransfer(profileId, transfer.id);

    return NextResponse.json({ ok: true, transferId: transfer.id, status: funded.status });

  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Payout failed' }, { status: 500 });
  }
}
