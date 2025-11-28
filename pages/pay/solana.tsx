import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import Layout from '../../components/Layout';

const SolanaPayPage = () => {
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState('Enter an amount to begin.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [signature, setSignature] = useState('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generatePaymentRequest = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('Generating payment request...');
    setQrCode('');
    setSignature('');

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
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (reference && !signature) {
      intervalRef.current = setInterval(async () => {
        try {
          const response = await fetch(`/api/solana-pay/verify?reference=${reference}`);
          const data = await response.json();

          if (data.status === 'confirmed') {
            setStatus(`Payment confirmed!`);
            setSignature(data.signature);
            setReference('');
            if (intervalRef.current) clearInterval(intervalRef.current);
          } else if (data.status === 'pending') {
            setStatus('Awaiting confirmation...');
          } else {
            setStatus('Awaiting payment...');
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reference, signature]);

  const resetForm = () => {
    setAmount('');
    setQrCode('');
    setStatus('Enter an amount to begin.');
    setError('');
    setReference('');
    setSignature('');
  };

  return (
    <Layout>
      <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>Solana Pay</h1>

        {signature ? (
          <div className='text-center'>
            <p className='text-green-600 font-semibold'>Payment Successful!</p>
            <p className='text-sm text-gray-500 mt-2'>Transaction Signature:</p>
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs text-indigo-600 hover:underline break-all'
            >
              {signature}
            </a>
            <button
              onClick={resetForm}
              className='mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700'
            >
              Start New Payment
            </button>
          </div>
        ) : (
          <>
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
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100'
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
            <p className='mt-4 text-sm text-center text-gray-600 h-5'>{status}</p>

            {qrCode && (
              <div className='mt-6 flex flex-col items-center'>
                <img src={qrCode} alt='Solana Pay QR Code' className='w-48 h-48' />
                <p className='mt-2 text-xs text-gray-500'>Scan with a Solana Pay compatible wallet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SolanaPayPage;
