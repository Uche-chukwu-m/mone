'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { ProgressBar } from "@/components/progress-bar";
import { AnimatedVisual } from "@/components/animated-visual";
import { useMonoAuth } from "@/lib/auth0-utils";
import { useApiClient } from '@/lib/api-client';

export default function WelcomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useMonoAuth();
  const apiClient = useApiClient();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!apiClient) return;
    try {
      const [transactionsData, summaryData] = await Promise.all([
        apiClient.getTransactions(),
        apiClient.getSummary(),
      ]);
      setTransactions(transactionsData.transactions);
      setSummary(summaryData);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }

    if (isAuthenticated && apiClient) {
      fetchData();
    }
  }, [isAuthenticated, isLoading, router, apiClient]);

  const handleLinkGoogle = async () => {
    if (!apiClient) return;
    try {
      const { authorization_url } = await apiClient.getGoogleLoginUrl();
      window.location.href = authorization_url;
    } catch (err) {
      setError('Could not start the Google linking process.');
      console.error(err);
    }
  };

  const handleSyncEmails = async () => {
    if (!apiClient) return;
    setIsSyncing(true);
    setError('');
    try {
      await apiClient.syncEmails();
      await fetchData(); // Refresh data after sync
    } catch (err) {
      setError('Failed to sync emails.');
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div className="min-h-screen bg-background flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="w-1/2 bg-foreground relative overflow-hidden">
        <AnimatedVisual variant="welcome" />
      </div>
      <div className="w-1/2 relative p-8">
        <header className="flex justify-between items-center mb-8">
          <MonoLogo size="md" variant="simple" />
          <ProgressBar currentStep={1} totalSteps={5} />
        </header>

        <main className="flex flex-col justify-center h-full">
          <div className="w-full max-w-lg mx-auto space-y-6">
            <h1 className="text-3xl font-light text-foreground">Welcome, {user?.name || 'friend'}!</h1>

            <div className="space-y-4">
              <button onClick={handleLinkGoogle} className="w-full bg-blue-500 text-white p-2 rounded">Link Google Account</button>
              <button onClick={handleSyncEmails} disabled={isSyncing} className="w-full bg-green-500 text-white p-2 rounded disabled:bg-gray-400">
                {isSyncing ? 'Syncing...' : 'Sync Emails'}
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Spending Summary</h2>
              {summary ? (
                <pre className="bg-gray-800 p-4 rounded text-sm">{JSON.stringify(summary, null, 2)}</pre>
              ) : (
                <p>No summary data yet. Try syncing your emails.</p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              {transactions.length > 0 ? (
                <ul className="space-y-2">
                  {transactions.slice(0, 5).map((t, i) => <li key={i} className="bg-gray-800 p-2 rounded">{t.vendorName}: ${t.totalAmount}</li>)}
                </ul>
              ) : (
                <p>No transactions found. Sync your emails to get started.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
