import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import * as crypto from 'crypto';
import * as phpserialize from 'php-serialize';

// This is a simplified DB helper. Replace with your actual implementation.
import { insertWebhook } from '../../../lib/db/webhooks';

const PADDLE_PUBLIC_KEY = process.env.PADDLE_PUBLIC_KEY;

// Helper to verify the Paddle signature
function verifyPaddleSignature(body: Record<string, any>): boolean {
  if (!PADDLE_PUBLIC_KEY) {
    console.error('Paddle public key is not configured.');
    return false;
  }

  const signature = Buffer.from(body.p_signature, 'base64');
  delete body.p_signature;

  // Replicate PHP's ksort
  const sortedKeys = Object.keys(body).sort();
  const sortedBody: Record<string, any> = {};
  for (const key of sortedKeys) {
    sortedBody[key] = body[key];
  }

  const serializedBody = phpserialize.serialize(sortedBody);

  const verifier = crypto.createVerify('sha1');
  verifier.update(serializedBody);
  verifier.end();

  return verifier.verify(PADDLE_PUBLIC_KEY, signature);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const rawBody = await buffer(req);
    const body = new URLSearchParams(rawBody.toString());
    const payload: Record<string, any> = {};
    for (const [key, value] of body.entries()) {
      payload[key] = value;
    }

    const isVerified = verifyPaddleSignature({ ...payload });

    await insertWebhook({
      provider: 'paddle',
      headers: req.headers,
      raw_body: rawBody.toString(),
      parsed_body: payload,
      verify_result: isVerified ? 'SUCCESS' : 'FAILURE',
    });

    if (!isVerified) {
      console.warn('Paddle webhook signature verification failed.');
      // Return 202 to acknowledge receipt but indicate an issue
      return res.status(202).send('Signature verification failed.');
    }

    // Process the verified webhook event here
    // e.g., handle subscription_created, subscription_payment_succeeded, etc.
    console.log(`Successfully verified Paddle webhook: ${payload.alert_name}`);

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing Paddle webhook:', error);
    res.status(500).send('Internal Server Error');
  }
}
