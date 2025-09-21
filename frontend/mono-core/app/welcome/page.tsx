'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { WelcomeForm } from "@/components/welcome-form";
import { ProgressBar } from "@/components/progress-bar";
import { AnimatedVisual } from "@/components/animated-visual";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated via localStorage (replacing Auth0)
    const token = localStorage.getItem('google_access_token');
    
    if (!token) {
      router.push('/auth/signin');
      return;
    }
  }, [router]);

  return (
    <motion.div 
      className="min-h-screen bg-background flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left side - Visual/Illustration area (like YNAB's green section) */}
      <motion.div 
        className="w-1/2 bg-foreground relative overflow-hidden"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <AnimatedVisual variant="welcome" />
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
          <ProgressBar currentStep={0} totalSteps={5} />
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
                First things first, people call us{" "}
                <span className="font-semibold">"mono"</span>.
              </h1>
            </motion.div>

            {/* Form section - appears after heading */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <WelcomeForm />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
