import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAccess } from '../../../../lib/admin_auth';
import { getDb } from '../../../../lib/db/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!checkAdminAccess(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const db = getDb();
    
    // Get counts from various tables
    const keyCount = db.prepare('SELECT COUNT(*) as count FROM access_keys').get() as { count: number };
    const previewCount = db.prepare('SELECT COUNT(*) as count FROM preview_usage').get() as { count: number };
    const webhookCount = db.prepare('SELECT COUNT(*) as count FROM captured_webhooks').get() as { count: number };
    const transactionCount = db.prepare('SELECT COUNT(*) as count FROM payment_transactions').get() as { count: number };
    
    // Get latest webhook timestamp
    const latestWebhook = db.prepare('SELECT ts as latest FROM captured_webhooks ORDER BY ts DESC LIMIT 1').get() as { latest: string } | undefined;
    
    const stats = {
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      metrics: {
        access_keys: keyCount.count,
        preview_usage: previewCount.count,
        captured_webhooks: webhookCount.count,
        payment_transactions: transactionCount.count,
        latest_webhook: latestWebhook?.latest || null
      }
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      timestamp: new Date().toISOString()
    });
  }
}
