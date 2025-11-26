import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { insertWebhook } from '../../../lib/db/webhooks';

const PAYPAL_API_URL = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID } = process.env;

// Function to get a PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  return data.access_token;
}

// Function to verify the webhook signature
async function verifyPayPalSignature(req: NextApiRequest, rawBody: Buffer) {
  const accessToken = await getPayPalAccessToken();
  const verificationBody = {
    transmission_id: req.headers['paypal-transmission-id'],
    transmission_time: req.headers['paypal-transmission-time'],
    cert_url: req.headers['paypal-cert-url'],
    auth_algo: req.headers['paypal-auth-algo'],
    transmission_sig: req.headers['paypal-transmission-sig'],
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: JSON.parse(rawBody.toString()),
  };

  const response = await fetch(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verificationBody),
  });

  const data = await response.json();
  return data.verification_status === 'SUCCESS';
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
    const parsedBody = JSON.parse(rawBody.toString());

    const isVerified = await verifyPayPalSignature(req, rawBody);

    await insertWebhook({
      provider: 'paypal',
      headers: req.headers,
      raw_body: rawBody.toString(),
      parsed_body: parsedBody,
      verify_result: isVerified ? 'SUCCESS' : 'FAILURE',
    });

    if (!isVerified) {
      console.warn('PayPal webhook signature verification failed.');
      return res.status(202).send('Signature verification failed.');
    }

    console.log(`Successfully verified PayPal webhook: ${parsedBody.event_type}`);
    // Process the verified webhook event here

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    res.status(500).send('Internal Server Error');
  }
}
