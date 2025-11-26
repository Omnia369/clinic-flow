import { NextApiRequest, NextApiResponse } from 'next';
import { Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

// This would be your actual recipient wallet address
const SOLANA_MERCHANT_WALLET = process.env.SOLANA_MERCHANT_WALLET;
const SOLANA_USDC_MINT = process.env.SOLANA_USDC_MINT;

// Endpoint to generate a Solana Pay URL
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { amount, memo } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    if (!SOLANA_MERCHANT_WALLET || !SOLANA_USDC_MINT) {
      return res.status(500).json({ error: 'Server configuration missing for Solana.' });
    }

    const recipient = new PublicKey(SOLANA_MERCHANT_WALLET);
    const splToken = new PublicKey(SOLANA_USDC_MINT);
    const reference = new Keypair().publicKey; // Unique reference for this transaction
    const label = 'Clinic Flow Purchase';
    const message = `Your order of ${amount} USDC`;
    
    const url = encodeURL({
      recipient,
      amount: new BigNumber(amount),
      splToken,
      reference,
      label,
      message,
      memo,
    });

    res.status(200).json({ url: url.toString(), reference: reference.toString() });
  } catch (error) {
    console.error('Error generating Solana Pay URL:', error);
    res.status(500).json({ error: 'Failed to generate URL' });
  }
}
