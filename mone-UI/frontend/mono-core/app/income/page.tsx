'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { ProgressBar } from "@/components/progress-bar";
import { AnimatedVisual } from "@/components/animated-visual";
import { useMonoAuth } from "@/lib/auth0-utils";

export default function IncomePage() {
  const [income, setIncome] = useState<string>('');
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

  const handleContinue = () => {
    if (income.trim()) {
      localStorage.setItem('monthlyIncome', income.trim());
      router.push('/rent');
    }
  };

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
        <AnimatedVisual variant="income" />
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
          <ProgressBar currentStep={2} totalSteps={5} />
        </motion.div>

        {/* Main content area - centered */}
        <div className="flex flex-col justify-center items-center h-full px-16">
          <div className="w-full max-w-md space-y-8">
            {/* Main heading */}
            <motion.div 
              className="text-center space-y-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h1 className="text-4xl font-light text-foreground leading-tight">
                How much do you earn monthly{" "}
                <span className="font-semibold">after tax</span>?
              </h1>
            </motion.div>

            {/* Input form */}
            <motion.div 
              className="space-y-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="space-y-2">
                <label 
                  htmlFor="income" 
                  className="block text-base font-medium text-foreground"
                >
                  Monthly income (after tax)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/50 text-lg">$</span>
                  <input
                    id="income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 text-base border border-foreground/30
                             bg-background text-foreground
                             focus:border-foreground focus:outline-none focus:ring-0
                             rounded-md
                             placeholder:text-foreground/50"
                    required
                  />
                </div>
              </div>

              <motion.button
                onClick={handleContinue}
                disabled={!income.trim()}
                className="w-full py-3 px-6 text-base font-medium
                         bg-foreground/10 text-foreground border border-foreground/20
                         hover:bg-foreground/20
                         disabled:opacity-50 disabled:cursor-not-allowed
                         rounded-md
                         focus:outline-none focus:ring-0
                         transition-all duration-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Continue
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}