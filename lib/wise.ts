const BASES = {
  sandbox: 'https://api.sandbox.transferwise.tech',
  live: 'https://api.transferwise.com',
} as const;

export type WiseEnv = 'sandbox' | 'live';

function getWiseEnv(): WiseEnv {
  const env = (process.env.WISE_ENV || 'sandbox').toLowerCase();
  return (env === 'live' ? 'live' : 'sandbox');
}

export function getWiseBaseUrl(): string {
  return BASES[getWiseEnv()];
}

export function getWiseAuthHeaders(): Record<string, string> {
  const token = process.env.WISE_API_TOKEN || '';
  if (!token) throw new Error('Missing WISE_API_TOKEN');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Profiles
export async function listProfiles(): Promise<any> {
  const url = `${getWiseBaseUrl()}/v2/profiles`;
  const res = await fetch(url, { headers: getWiseAuthHeaders(), cache: 'no-store' });
  if (!res.ok) throw new Error(`Wise profiles error: ${res.status}`);
  return res.json();
}

// Quotes (v3)
export async function createQuote(profileId: number, data: any): Promise<any> {
  const url = `${getWiseBaseUrl()}/v3/profiles/${profileId}/quotes`; 
  const res = await fetch(url, { method: 'POST', headers: getWiseAuthHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`Wise quote error: ${res.status}`);
  return res.json();
}

// Recipients (aka accounts)
export async function createRecipient(data: any): Promise<any> {
  const url = `${getWiseBaseUrl()}/v1/accounts`; 
  const res = await fetch(url, { method: 'POST', headers: getWiseAuthHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`Wise recipient error: ${res.status}`);
  return res.json();
}

// Transfers
export async function createTransfer(profileId: number, data: any): Promise<any> {
  const url = `${getWiseBaseUrl()}/v1/transfers`; // Some flows also support /v3/profiles/{id}/transfers
  const headers = { ...getWiseAuthHeaders(), 'X-idempotence-uuid': data?.customerTransactionId || cryptoRandom() };
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`Wise transfer error: ${res.status}`);
  return res.json();
}

export async function fundTransfer(profileId: number, transferId: number, data: any = { type: 'BALANCE' }): Promise<any> {
  const url = `${getWiseBaseUrl()}/v3/profiles/${profileId}/transfers/${transferId}/payments`;
  const res = await fetch(url, { method: 'POST', headers: getWiseAuthHeaders(), body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`Wise fund error: ${res.status}`);
  return res.json();
}

function cryptoRandom() {
  // Lightweight UUID-ish for idempotency if caller didn't set one
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random()*16)|0, v = c=='x'?r:(r&0x3|0x8); return v.toString(16);
  });
}
