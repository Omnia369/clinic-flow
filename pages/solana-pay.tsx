import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

export default function SolanaPayPage() {
  const [amount, setAmount] = useState('10'); // Default to 10 USDC
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function generatePaymentRequest() {
    setLoading(true);
    setError(null);
    setPaymentUrl(null);
    setReference(null);

    try {
      const res = await fetch('/api/solana-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          memo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate payment URL');
      }

      setPaymentUrl(data.url);
      setReference(data.reference);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // TODO: Add a useEffect hook to poll for transaction confirmation using the reference

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-semibold mb-4">Solana Pay</h1>
      
      {!paymentUrl ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (USDC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Memo (Optional)</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <button
            onClick={generatePaymentRequest}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Generating...' : 'Generate Payment QR Code'}
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-medium mb-4">Scan to Pay</h2>
          <div className="p-4 bg-white inline-block rounded-lg">
            <QRCode value={paymentUrl} />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Reference: <code>{reference}</code>
          </p>
          <button
            onClick={() => setPaymentUrl(null)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Create New Payment
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
