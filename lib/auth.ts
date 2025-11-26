export async function validateKey(key: string): Promise<{ valid: boolean; email: string | null }> {
  if (!key || typeof key !== 'string') return { valid: false, email: null };
  const { results } = await sqlite_batch({ operations: [`SELECT email FROM access_keys WHERE key = '${key}' AND status = 'active'`] });
  const row = results?.[0]?.rows?.[0];
  if (row) {
    return { valid: true, email: String(row.email) };
  }
  return { valid: false, email: null };
}
