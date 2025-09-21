'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { ProgressBar } from "@/components/progress-bar";
import { AnimatedVisual } from "@/components/animated-visual";
import { useMonoAuth } from "@/lib/auth0-utils";

const options = [
  'Cutting my monthly spending',
  'Saving for a specific goal (e.g., vacation, down payment)',
  'Understanding where my money is going',
  'Optimizing my subscriptions'
];

export default function OnboardingPage() {
  const [selectedOption, setSelectedOption] = useState<string>('');
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
    if (selectedOption) {
      // Store the selection and move to next step
      localStorage.setItem('monoGoal', selectedOption);
      router.push('/income');
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
      {/* Left side - Visual/Illustration area (black, like YNAB's colored section) */}
      <motion.div 
        className="w-1/2 bg-foreground relative overflow-hidden"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <AnimatedVisual variant="goal" />
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
          <ProgressBar currentStep={1} totalSteps={5} />
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
                What brings you to{" "}
                <span className="font-semibold">Mono</span> today?
              </h1>
            </motion.div>

            {/* Options */}
            <motion.div 
              className="space-y-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {options.map((option, index) => (
                <motion.label
                  key={index}
                  className={`block p-4 border rounded-md cursor-pointer transition-all duration-200 ${
                    selectedOption === option
                      ? 'border-foreground bg-foreground/5'
                      : 'border-foreground/30 hover:border-foreground/50 hover:bg-foreground/5'
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 + (index * 0.1) }}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={option}
                    checked={selectedOption === option}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === option
                        ? 'border-foreground bg-foreground'
                        : 'border-foreground/50'
                    }`}>
                      {selectedOption === option && (
                        <div className="w-2 h-2 bg-background rounded-full"></div>
                      )}
                    </div>
                    <span className="text-foreground font-normal">{option}</span>
                  </div>
                </motion.label>
              ))}
            </motion.div>

            {/* Continue button */}
            <motion.button
              onClick={handleContinue}
              disabled={!selectedOption}
              className="w-full py-3 px-6 text-base font-medium
                       bg-foreground/10 text-foreground border border-foreground/20
                       hover:bg-foreground/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       rounded-md
                       focus:outline-none focus:ring-0
                       transition-all duration-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              Continue
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
