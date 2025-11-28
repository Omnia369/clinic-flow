import { useState } from 'react';

const WisePayoutPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    recipientName: '',
    accountNumber: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.recipientName.trim()) return 'Recipient Name is required.';
    if (!formData.accountNumber.trim()) return 'Account Number is required.';
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      return 'A valid positive amount is required.';
    }
    return '';
  };

  const handlePayout = async () => {
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setStatus('Initiating payout...');

    try {
      const response = await fetch('/api/admin/wise-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`Payout initiated successfully. Transfer ID: ${data.transferId}`);
        // Clear form on success
        setFormData({
          amount: '',
          currency: 'USD',
          recipientName: '',
          accountNumber: '',
        });
      } else {
        throw new Error(data.error || 'Failed to initiate payout.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus('Error initiating payout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-2xl mx-auto bg-white p-6 rounded-lg shadow'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Wise Payout</h1>
        <div className='space-y-4'>
          <div>
            <label htmlFor='recipientName' className='block text-sm font-medium text-gray-700'>
              Recipient Name
            </label>
            <input
              type='text'
              name='recipientName'
              id='recipientName'
              value={formData.recipientName}
              onChange={handleInputChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100'
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor='accountNumber' className='block text-sm font-medium text-gray-700'>
              Account Number
            </label>
            <input
              type='text'
              name='accountNumber'
              id='accountNumber'
              value={formData.accountNumber}
              onChange={handleInputChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100'
              disabled={loading}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='amount' className='block text-sm font-medium text-gray-700'>
                Amount
              </label>
              <input
                type='number'
                name='amount'
                id='amount'
                value={formData.amount}
                onChange={handleInputChange}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100'
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor='currency' className='block text-sm font-medium text-gray-700'>
                Currency
              </label>
              <select
                name='currency'
                id='currency'
                value={formData.currency}
                onChange={handleInputChange}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100'
                disabled={loading}
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
          </div>
          <button
            onClick={handlePayout}
            disabled={loading}
            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400'
          >
            {loading ? 'Processing...' : 'Initiate Payout'}
          </button>
        </div>
        {status && !error && <p className='mt-4 text-sm text-center text-green-600'>{status}</p>}
        {error && <p className='mt-4 text-sm text-center text-red-600'>{error}</p>}
      </div>
    </div>
  );
};

export default WisePayoutPage;
