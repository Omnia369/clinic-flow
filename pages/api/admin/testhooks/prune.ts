import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAccess } from '../../../../lib/admin_auth';
import { pruneWebhooks } from '../../../../lib/db/webhooks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!checkAdminAccess(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    await pruneWebhooks();
    res.status(200).json({ message: 'All webhooks have been pruned.' });
  } catch (error) {
    console.error('Error pruning webhooks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
