import crypto from 'crypto';
import { sqlite_batch } from 'path-to-your-sqlite-tool'; // This is a placeholder

const SALT = process.env.PREVIEW_SALT || 'default-salt';

export function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim() + SALT).digest('hex');
}

export function generateAccessKey(prefix = 'cf_'): string {
  return prefix + crypto.randomBytes(16).toString('hex');
}

export async function issueNewKey(email: string): Promise<{ key: string; email: string; status: 'active' }> {
  const key = generateAccessKey();
  const params = { key, email: email.toLowerCase().trim() };
  await sqlite_batch({ operations: [`INSERT INTO access_keys (key, email) VALUES ('${params.key}', '${params.email}')`] });
  return { ...params, status: 'active' };
}

export async function checkPreviewUsage(email: string): Promise<{ used: boolean; last_preview_at: string | null }> {
  const email_hash = hashEmail(email);
  const { results } = await sqlite_batch({ operations: [`SELECT last_preview_at FROM preview_usage WHERE email_hash = '${email_hash}'`] });
  const row = results?.[0]?.rows?.[0];
  return { used: !!row, last_preview_at: row ? String(row.last_preview_at) : null };
}

export async function recordPreviewUsage(email: string): Promise<void> {
  const email_hash = hashEmail(email);
  await sqlite_batch({ operations: [`INSERT OR REPLACE INTO preview_usage (email_hash) VALUES ('${email_hash}')`] });
}

export async function listKeys(limit = 100): Promise<any[]> {
  const { results } = await sqlite_batch({ operations: [`SELECT key, email, status, created_at, revoked_at FROM access_keys ORDER BY created_at DESC LIMIT ${limit}`] });
  return results?.[0]?.rows || [];
}

export async function updateKeyStatus(key: string, status: 'active' | 'revoked'): Promise<boolean> {
  const revoked_at = status === 'revoked' ? `revoked_at = CURRENT_TIMESTAMP` : 'revoked_at = NULL';
  const { results } = await sqlite_batch({ operations: [`UPDATE access_keys SET status = '${status}', ${revoked_at} WHERE key = '${key}'`] });
  return (results?.[0]?.changes || 0) > 0;
}
