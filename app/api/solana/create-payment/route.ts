import { NextResponse } from 'next/server';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { createTransfer, encodeURL, findReference, validateTransfer, FindReferenceError } from '@solana/pay';
import { getSolanaRpcUrl } from '../../../../lib/solana';
import BigNumber from 'bignumber.js';

export async function POST(req: Request) {
  try {
    const { amount, memo } = await req.json();
    if (!amount) {
      return NextResponse.json({ ok: false, error: 'Amount is required' }, { status: 400 });
    }

    const rpcUrl = getSolanaRpcUrl();
    const connection = new Connection(rpcUrl, 'confirmed');

    const recipient = new PublicKey(process.env.SOLANA_RECIPIENT_ADDRESS || '');
    const splToken = new PublicKey(process.env.SOLANA_USDC_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    const reference = new Keypair().publicKey;
    const label = 'Clinic Flow';

    const url = encodeURL({
      recipient,
      amount: new BigNumber(amount),
      splToken,
      reference,
      label,
      memo,
    });

    return NextResponse.json({ ok: true, url: url.toString(), reference: reference.toBase58() });

  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to create payment' }, { status: 500 });
  }
}
