'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { AnimatedVisual } from "@/components/animated-visual";
import { collectUserOnboardingData, sendUserDataToBackend } from "@/lib/user-data";

export default function LoadingPage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const processOnboardingData = async () => {
      // Check if user is authenticated via localStorage (replacing Auth0)
      const token = localStorage.getItem('google_access_token');
      const userName = localStorage.getItem('name');
      const userEmail = localStorage.getItem('email');
      
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      // Collect user data when loading starts
      const userData = collectUserOnboardingData();
      console.log('Collected User Data:', userData);
      console.log('Google OAuth User:', { name: userName, email: userEmail });

      // Send to backend with Google OAuth token
      try {
        console.log('Google Access Token:', !!token);
        await sendUserDataToBackend(userData, token);
      } catch (error) {
        console.error('Error processing onboarding:', error);
      }
    };

    processOnboardingData();

    // Simulate loading progress
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Navigate to next page after loading completes
          setTimeout(() => {
            router.push('/chat'); // or wherever the next step should go
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [router]);

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
        <AnimatedVisual variant="loading" />
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

        {/* Main content area - centered */}
        <div className="flex flex-col justify-center items-center h-full px-16">
          <div className="w-full max-w-lg text-center space-y-8">
            {/* Main heading */}
            <motion.div 
              className="space-y-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h1 className="text-4xl font-light text-foreground leading-tight">
                Let's build your{" "}
                <span className="font-semibold">plan</span>
              </h1>
              <p className="text-lg text-foreground/70 font-light leading-relaxed">
                We've got all your information and we're setting up your personalized 
                plan to help you take control of your finances with confidence.
              </p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div 
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="w-full bg-foreground/20 rounded-full h-3">
                <div 
                  className="bg-foreground h-3 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-foreground/60">
                {loadingProgress < 100 ? 'Processing your information...' : 'Complete! Redirecting...'}
              </p>
            </motion.div>

            {/* Loading steps */}
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className={`flex items-center space-x-3 transition-opacity duration-500 ${loadingProgress >= 20 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-2 h-2 rounded-full ${loadingProgress >= 20 ? 'bg-foreground' : 'bg-foreground/30'}`}></div>
                <span className="text-sm text-foreground/70">Analyzing your income and expenses</span>
              </div>
              <div className={`flex items-center space-x-3 transition-opacity duration-500 ${loadingProgress >= 40 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-2 h-2 rounded-full ${loadingProgress >= 40 ? 'bg-foreground' : 'bg-foreground/30'}`}></div>
                <span className="text-sm text-foreground/70">Calculating your debt strategy</span>
              </div>
              <div className={`flex items-center space-x-3 transition-opacity duration-500 ${loadingProgress >= 60 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-2 h-2 rounded-full ${loadingProgress >= 60 ? 'bg-foreground' : 'bg-foreground/30'}`}></div>
                <span className="text-sm text-foreground/70">Setting up your budget categories</span>
              </div>
              <div className={`flex items-center space-x-3 transition-opacity duration-500 ${loadingProgress >= 80 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-2 h-2 rounded-full ${loadingProgress >= 80 ? 'bg-foreground' : 'bg-foreground/30'}`}></div>
                <span className="text-sm text-foreground/70">Personalizing your experience</span>
              </div>
              <div className={`flex items-center space-x-3 transition-opacity duration-500 ${loadingProgress >= 100 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-2 h-2 rounded-full ${loadingProgress >= 100 ? 'bg-foreground' : 'bg-foreground/30'}`}></div>
                <span className="text-sm text-foreground/70">Ready to take control!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
