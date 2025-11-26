'use client';
import { useEffect, useState } from 'react';

type Key = {
  key: string;
  email: string;
  status: 'active' | 'revoked';
  created_at: string;
  revoked_at?: string | null;
};

export default function KeysManagerPage() {
  const [items, setItems] = useState<Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const token = prompt('Enter Admin Bearer Token');
      if (!token) {
        setError('Token is required to view keys.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/admin/keys', {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e: any) {
      setError(e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function issueKey() {
    // Simplified for scaffold; add better token handling
    const token = prompt('Enter Admin Bearer Token');
    if (!token || !email) return;
    await fetch('/api/admin/keys', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setEmail('');
    load(); // Reload list
  }

  async function updateStatus(key: string, status: 'active' | 'revoked') {
    const token = prompt('Enter Admin Bearer Token');
    if (!token) return;
    await fetch(`/api/admin/keys/${key}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load(); // Reload list
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Keys Manager</h1>
        <p className="mt-2 text-gray-600">Issue and revoke access keys.</p>

        <div className="mt-6 p-4 border rounded">
          <h2 className="font-bold">Issue New Key</h2>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="px-2 py-1 border rounded"
            />
            <button onClick={issueKey} className="px-3 py-1 rounded bg-blue-600 text-white">Issue</button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          {error && <p className="text-red-500">{error}</p>}
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">No keys issued yet.</p>
          ) : (
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-2 border">Key</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Created</th>
                  <th className="p-2 border">Revoked</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.key}>
                    <td className="p-2 border font-mono text-xs">{it.key}</td>
                    <td className="p-2 border">{it.email}</td>
                    <td className="p-2 border">{it.status}</td>
                    <td className="p-2 border whitespace-nowrap">{new Date(it.created_at).toLocaleString()}</td>
                    <td className="p-2 border whitespace-nowrap">{it.revoked_at ? new Date(it.revoked_at).toLocaleString() : ''}</td>
                    <td className="p-2 border">
                      {it.status === 'active' ? (
                        <button onClick={() => updateStatus(it.key, 'revoked')} className="text-red-600">Revoke</button>
                      ) : (
                        <button onClick={() => updateStatus(it.key, 'active')} className="text-green-600">Reactivate</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
