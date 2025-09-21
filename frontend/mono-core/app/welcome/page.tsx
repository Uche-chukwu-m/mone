'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { ProgressBar } from "@/components/progress-bar";
import { AnimatedVisual } from "@/components/animated-visual";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated via localStorage (replacing Auth0)
    const token = localStorage.getItem('google_access_token');
    
    if (!token) {
      router.push('/auth/signin');
    }

    if (isAuthenticated && apiClient) {
      fetchData();
    }
  }, [router]);

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
