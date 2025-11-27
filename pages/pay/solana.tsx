import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const SolanaPayPage = () => {
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState('Enter an amount to begin.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');

  const generatePaymentRequest = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid amount.');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('Generating payment request...');
    setQrCode('');

    try {
      const response = await fetch(`/api/solana-pay?amount=${amount}`);
      const data = await response.json();

      if (response.ok) {
        setReference(data.reference);
        const qr = await QRCode.toDataURL(data.url);
        setQrCode(qr);
        setStatus('Scan the QR code to complete the payment.');
      } else {
        throw new Error(data.error || 'Failed to generate payment request.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus('Error generating payment request.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reference) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/solana-pay/verify?reference=${reference}`);
          const data = await response.json();
          if (data.status === 'confirmed') {
            setStatus('Payment confirmed!');
            setReference(''); // Stop polling
            clearInterval(interval);
          } else if (data.status === 'pending') {
            setStatus('Awaiting confirmation...');
          } else {
            setStatus('Awaiting payment...');
          }
        } catch (err) {
          // Don't show polling errors to the user unless necessary
          console.error('Polling error:', err);
        }
      }, 5000); // Poll every 5 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [reference]);

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
      <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>Solana Pay</h1>
        <div className='space-y-4'>
          <div>
            <label htmlFor='amount' className='block text-sm font-medium text-gray-700'>
              Amount (USDC)
            </label>
            <input
              type='number'
              id='amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='e.g., 10.00'
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              disabled={loading || !!reference}
            />
          </div>
          <button
            onClick={generatePaymentRequest}
            disabled={loading || !amount || !!reference}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400'
          >
            {loading ? 'Generating...' : 'Generate Payment QR'}
          </button>
        </div>

        {error && <p className='mt-4 text-sm text-center text-red-600'>{error}</p>}
        <p className='mt-4 text-sm text-center text-gray-600'>{status}</p>

        {qrCode && (
          <div className='mt-6 flex flex-col items-center'>
            <img src={qrCode} alt='Solana Pay QR Code' className='w-48 h-48' />
            <p className='mt-2 text-xs text-gray-500'>Scan with a Solana Pay compatible wallet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolanaPayPage;
