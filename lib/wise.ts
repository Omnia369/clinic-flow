export async function getRecipientByEmail(email: string, currency = 'USD'): Promise<any | null> {
  const url = `${getWiseBaseUrl()}/v1/accounts?currency=${currency}&email=${encodeURIComponent(email)}`;
  const res = await fetch(url, { headers: getWiseAuthHeaders(), cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[0] || null;
}
