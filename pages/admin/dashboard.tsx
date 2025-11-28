import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

interface AdminStats {
  database: string;
  environment: string;
  timestamp: string;
  metrics: {
    access_keys: number;
    preview_usage: number;
    captured_webhooks: number;
    payment_transactions: number;
    latest_webhook: string | null;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
        setLastRefresh(new Date());
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatLatestWebhook = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  const getEnvironmentColor = (env: string) => {
    switch (env.toLowerCase()) {
      case 'production':
        return 'text-green-600 bg-green-100';
      case 'staging':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && !stats) {
    return (
      <Layout>
        <div className='max-w-7xl mx-auto'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-1/4 mb-4'></div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='bg-white shadow rounded-lg p-6'>
                  <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
                  <div className='h-8 bg-gray-200 rounded w-3/4'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
            <p className='text-gray-600 mt-1'>
              Operational overview and system health metrics
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400'
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className='mb-6 bg-red-50 border border-red-200 rounded-md p-4'>
            <p className='text-red-600'>{error}</p>
          </div>
        )}

        {stats && (
          <>
            {/* System Status */}
            <div className='bg-white shadow rounded-lg p-6 mb-6'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>System Status</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Environment</p>
                  <p className={`mt-1 px-2 py-1 text-xs font-medium rounded-full inline-block ${getEnvironmentColor(stats.environment)}`}>
                    {stats.environment}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Database</p>
                  <p className={`mt-1 px-2 py-1 text-xs font-medium rounded-full inline-block ${
                    stats.database === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stats.database}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Last Refresh</p>
                  <p className='mt-1 text-sm text-gray-900'>
                    {lastRefresh ? lastRefresh.toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='bg-white shadow rounded-lg p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Access Keys</p>
                    <p className='mt-2 text-3xl font-bold text-gray-900'>{stats.metrics.access_keys}</p>
                  </div>
                  <div className='p-3 bg-blue-100 rounded-full'>
                    <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='bg-white shadow rounded-lg p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Preview Usage</p>
                    <p className='mt-2 text-3xl font-bold text-gray-900'>{stats.metrics.preview_usage}</p>
                  </div>
                  <div className='p-3 bg-green-100 rounded-full'>
                    <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='bg-white shadow rounded-lg p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Captured Webhooks</p>
                    <p className='mt-2 text-3xl font-bold text-gray-900'>{stats.metrics.captured_webhooks}</p>
                  </div>
                  <div className='p-3 bg-purple-100 rounded-full'>
                    <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='bg-white shadow rounded-lg p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Payment Transactions</p>
                    <p className='mt-2 text-3xl font-bold text-gray-900'>{stats.metrics.payment_transactions}</p>
                  </div>
                  <div className='p-3 bg-yellow-100 rounded-full'>
                    <svg className='w-6 h-6 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Activity */}
            <div className='bg-white shadow rounded-lg p-6 mt-6'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>Latest Activity</h2>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <p className='text-sm text-gray-500'>Latest Webhook</p>
                  <p className='text-sm text-gray-900'>{formatLatestWebhook(stats.metrics.latest_webhook)}</p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-sm text-gray-500'>Data Timestamp</p>
                  <p className='text-sm text-gray-900'>{new Date(stats.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
