'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { ProgressBar } from "@/components/progress-bar";
import { AnimatedVisual } from "@/components/animated-visual";
import { useMonoAuth } from "@/lib/auth0-utils";

const debtTypes = [
  { id: 'credit-card', label: 'Credit card' },
  { id: 'medical', label: 'Medical debt' },
  { id: 'auto', label: 'Auto loans' },
  { id: 'buy-now', label: 'Buy now, pay later' },
  { id: 'student', label: 'Student loans' },
  { id: 'personal', label: 'Personal loans' }
];

interface DebtSelection {
  [key: string]: {
    selected: boolean;
    amount: string;
  };
}

export default function DebtsPage() {
  const [debts, setDebts] = useState<DebtSelection>({});
  const [hasNoDebt, setHasNoDebt] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useMonoAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while Auth0 is checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render the page if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleDebtToggle = (debtId: string) => {
    setHasNoDebt(false);
    setDebts(prev => ({
      ...prev,
      [debtId]: {
        selected: !prev[debtId]?.selected,
        amount: prev[debtId]?.amount || ''
      }
    }));
  };

  const handleAmountChange = (debtId: string, amount: string) => {
    setDebts(prev => ({
      ...prev,
      [debtId]: {
        ...prev[debtId],
        amount
      }
    }));
  };

  const handleNoDebt = () => {
    setHasNoDebt(true);
    setDebts({});
  };

  const handleContinue = () => {
    if (hasNoDebt) {
      localStorage.setItem('userDebts', JSON.stringify({}));
    } else {
      const selectedDebts = Object.entries(debts)
        .filter(([_, debt]) => debt.selected && debt.amount)
        .reduce((acc, [id, debt]) => ({
          ...acc,
          [id]: debt.amount
        }), {});
      
      localStorage.setItem('userDebts', JSON.stringify(selectedDebts));
    }
    
    router.push('/loading');
  };

  const canContinue = hasNoDebt || Object.values(debts).some(debt => debt.selected && debt.amount);

  return (
    <motion.div 
      className="min-h-screen bg-background flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left side - Visual/Illustration area */}
      <motion.div 
        className="w-1/2 bg-foreground relative overflow-hidden"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <AnimatedVisual variant="debt" />
      </motion.div>

      {/* Right side - Content area */}
      <div className="w-1/2 relative">
        {/* Top left logo section */}
        <motion.div 
          className="absolute top-8 left-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MonoLogo size="md" variant="simple" />
        </motion.div>

        {/* Centered progress bar - aligned with logo */}
        <motion.div 
          className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center h-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ProgressBar currentStep={4} totalSteps={5} />
        </motion.div>

        {/* Main content area - centered */}
        <div className="flex flex-col justify-center items-center h-full px-16 pt-16">
          <div className="w-full max-w-lg space-y-8">
            {/* Main heading */}
            <motion.div 
              className="text-center space-y-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h1 className="text-4xl font-light text-foreground leading-tight">
                Do you currently have any{" "}
                <span className="font-semibold">debt</span>?
              </h1>
            </motion.div>

            {/* Debt options grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {debtTypes.map((debt, index) => (
                <motion.div 
                  key={debt.id} 
                  className="flex flex-col"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 + (index * 0.1) }}
                >
                  <button
                    onClick={() => handleDebtToggle(debt.id)}
                    className={`w-full p-4 border rounded-lg cursor-pointer transition-all duration-200 text-left ${
                      debts[debt.id]?.selected
                        ? 'border-foreground bg-foreground/5'
                        : 'border-foreground/30 hover:border-foreground/50 hover:bg-foreground/5'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-foreground font-normal">{debt.label}</span>
                    </div>
                  </button>
                  
                  {debts[debt.id]?.selected && (
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50">$</span>
                      <input
                        type="number"
                        value={debts[debt.id]?.amount || ''}
                        onChange={(e) => handleAmountChange(debt.id, e.target.value)}
                        placeholder="Amount"
                        className="w-full pl-8 pr-3 py-2 text-sm border border-foreground/30
                                 bg-background text-foreground
                                 focus:border-foreground focus:outline-none focus:ring-0
                                 rounded-md placeholder:text-foreground/50"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* No debt option */}
            <motion.div 
              className="pt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.7 }}
            >
              <button
                onClick={handleNoDebt}
                className={`w-full text-center py-3 px-4 rounded-md transition-all duration-200 ${
                  hasNoDebt
                    ? 'text-foreground font-medium bg-foreground/10'
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
              >
                I don't currently have debt
              </button>
            </motion.div>

            {/* Back and Continue buttons */}
            <motion.div 
              className="flex space-x-4 pt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.9 }}
            >
              <button
                onClick={() => router.back()}
                className="flex-1 py-3 px-6 text-base font-medium
                         text-foreground/60 border border-foreground/20
                         hover:bg-foreground/5
                         rounded-md
                         focus:outline-none focus:ring-0
                         transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className="flex-1 py-3 px-6 text-base font-medium
                         bg-foreground/10 text-foreground border border-foreground/20
                         hover:bg-foreground/20
                         disabled:opacity-50 disabled:cursor-not-allowed
                         rounded-md
                         focus:outline-none focus:ring-0
                         transition-all duration-200"
              >
                Continue
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
