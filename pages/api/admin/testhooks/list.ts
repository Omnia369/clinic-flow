import type { NextApiRequest, NextApiResponse } from 'next';
import { listWebhooks } from '../../../../lib/db/webhooks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${process.env.ADMIN_BEARER_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { provider, limit } = req.query as { provider?: string; limit?: string };
    const lim = Math.min(Math.max(parseInt(limit || '100', 10) || 100, 1), 500);
    const rows = await listWebhooks(lim, provider && provider !== 'all' ? provider : undefined);
    return res.status(200).json({ items: rows });
  } catch (err) {
    console.error('Error listing captured webhooks', err);
    return res.status(500).json({ error: 'Failed to list webhooks' });
  }
}
