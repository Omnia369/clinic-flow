import { NextApiRequest, NextApiResponse } from 'next';
import { getWebhook } from '../../../../lib/db/webhooks';
import fetch from 'node-fetch';

// Admin-only endpoint to replay a captured webhook
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.ADMIN_BEARER_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Webhook ID is required' });
    }

    const webhook = await getWebhook(id);

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    // Determine the target URL based on the provider
    const targetUrl = `${process.env.NEXT_PUBLIC_URL}/api/webhooks/${webhook.provider}`;

    // Replay the original request
    const replayRes = await fetch(targetUrl, {
      method: 'POST',
      headers: JSON.parse(webhook.headers),
      body: webhook.raw_body,
    });

    res.status(200).json({ success: true, status: replayRes.status });
  } catch (error) {
    console.error('Error replaying webhook:', error);
    res.status(500).json({ error: 'Failed to replay webhook' });
  }
}
