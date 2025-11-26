const BASES = {
  sandbox: 'https://api.sandbox.paypal.com',
  live: 'https://api.paypal.com',
} as const;

type PayPalEnv = 'sandbox' | 'live';

type VerifyHeaders = {
  transmission_id: string;
  transmission_time: string;
  cert_url: string;
  auth_algo: string;
  transmission_sig: string;
};

export function getPayPalBaseUrl(): string {
  const env = (process.env.PAYPAL_ENV || 'sandbox') as PayPalEnv;
  return env === 'live' ? BASES.live : BASES.sandbox;
}

export async function getPayPalAccessToken(): Promise<string> {
  const client = process.env.PAYPAL_CLIENT_ID || '';
  const secret = process.env.PAYPAL_CLIENT_SECRET || '';
  if (!client || !secret) throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET');

  const url = `${getPayPalBaseUrl()}/v1/oauth2/token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${client}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`PayPal token error: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

export async function verifyPayPalWebhookSignature(headers: VerifyHeaders, webhookId: string, eventBody: any): Promise<boolean> {
  const accessToken = await getPayPalAccessToken();
  const url = `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`;
  const payload = {
    transmission_id: headers.transmission_id,
    transmission_time: headers.transmission_time,
    cert_url: headers.cert_url,
    auth_algo: headers.auth_algo,
    transmission_sig: headers.transmission_sig,
    webhook_id: webhookId,
    webhook_event: eventBody,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return false;
  const data = await res.json();
  // PayPal returns { verification_status: 'SUCCESS' | 'FAILURE' }
  return (data?.verification_status === 'SUCCESS');
}
