'use client';
import { useEffect, useState } from 'react';

type Item = {
  id: number;
  provider: string;
  ts: string;
  alert_name?: string | null;
  verify_result?: boolean;
  note?: string;
};

export default function TestHooksPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testhooks', { cache: 'no-store' });
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Test Hooks</h1>
        <p className="mt-2 text-gray-600">Captured webhook events (in-memory). Refresh after sending a test payload.</p>
        <div className="mt-4">
          <button onClick={load} className="px-3 py-1 rounded bg-blue-600 text-white">Refresh</button>
        </div>
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">No events captured yet.</p>
          ) : (
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">When</th>
                  <th className="p-2 border">Provider</th>
                  <th className="p-2 border">Alert / Event</th>
                  <th className="p-2 border">Verified</th>
                  <th className="p-2 border">Note</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="p-2 border">{it.id}</td>
                    <td className="p-2 border whitespace-nowrap">{new Date(it.ts).toLocaleString()}</td>
                    <td className="p-2 border">{it.provider}</td>
                    <td className="p-2 border">{it.alert_name || '—'}</td>
                    <td className="p-2 border">{it.verify_result ? 'Yes' : 'No'}</td>
                    <td className="p-2 border">{it.note || ''}</td>
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
