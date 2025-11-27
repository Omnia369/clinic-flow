import crypto from 'crypto';
import { getDb } from './client';

interface InsertWebhookParams {
  provider: string;
  headers: Record<string, any>;
  raw_body: string;
  parsed_body?: any;
  verify_result: 'SUCCESS' | 'FAILURE' | string;
  note?: string;
}

export async function insertWebhook(params: InsertWebhookParams): Promise<number> {
  const { provider, headers, raw_body, parsed_body, verify_result, note } = params;
  const db = await getDb();

  const idempotencyKey = crypto.createHash('sha256').update(raw_body).digest('hex');

  // Skip if already stored
  const existing = await db.getAsync<{ id: number }>(
    'SELECT id FROM captured_webhooks WHERE idempotency_key = ?',
    [idempotencyKey]
  );
  if (existing?.id) {
    return existing.id;
  }

  const result = await db.runAsync(
    `INSERT INTO captured_webhooks (provider, headers, raw_body, parsed_body, verify_result, note, idempotency_key)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      provider,
      JSON.stringify(headers || {}),
      raw_body,
      parsed_body ? JSON.stringify(parsed_body) : null,
      verify_result,
      note || null,
      idempotencyKey,
    ]
  );

  return result.lastID as number;
}

export async function listWebhooks(limit = 100, provider?: string) {
  const db = await getDb();
  if (provider) {
    return db.allAsync(
      'SELECT id, ts, provider, verify_result, alert_name, note FROM captured_webhooks WHERE provider = ? ORDER BY id DESC LIMIT ?',
      [provider, limit]
    );
  }
  return db.allAsync(
    'SELECT id, ts, provider, verify_result, alert_name, note FROM captured_webhooks ORDER BY id DESC LIMIT ?',
    [limit]
  );
}

export async function getWebhook(id: number) {
  const db = await getDb();
  return db.getAsync('SELECT * FROM captured_webhooks WHERE id = ?', [id]);
}
