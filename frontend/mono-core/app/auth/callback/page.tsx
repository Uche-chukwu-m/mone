'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { AnimatedVisual } from "@/components/animated-visual";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extract token and user info from URL parameters (from our backend)
        const token = searchParams.get('token');
        const userId = searchParams.get('user_id');
        const email = searchParams.get('email');
        const name = searchParams.get('name');

        if (!token || !userId || !email || !name) {
          throw new Error('Missing authentication data');
        }

        setMessage('Setting up your account...');

        // Store authentication data in localStorage
        localStorage.setItem('google_access_token', token);
        localStorage.setItem('user_id', userId);
        localStorage.setItem('email', email);
        localStorage.setItem('name', decodeURIComponent(name));

        console.log('✅ Google OAuth successful:', {
          userId,
          email,
          name: decodeURIComponent(name)
        });

        setStatus('success');
        setMessage('Welcome! Redirecting to your dashboard...');

        // Quick redirect to welcome page
        setTimeout(() => {
          router.push('/welcome');
        }, 500); // Much faster redirect

      } catch (error) {
        console.error('❌ Authentication callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <AnimatedVisual variant="loading" />;
      case 'success':
        return (
          <div className="text-background text-6xl flex items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="text-background text-6xl flex items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      default:
        return null;
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
        className="w-1/2 bg-foreground relative overflow-hidden flex items-center justify-center"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {getStatusIcon()}
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
          <div className="w-full max-w-md space-y-8 text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h1 className="text-4xl font-light text-foreground leading-tight">
                {status === 'loading' && "Just a moment..."}
                {status === 'success' && "Welcome to Mono!"}
                {status === 'error' && "Oops! Something went wrong"}
              </h1>
              <p className="text-lg text-foreground/70 mt-2">
                {message}
              </p>
            </motion.div>

            {/* Loading progress for visual feedback */}
            {status === 'loading' && (
              <motion.div
                className="w-full bg-foreground/20 rounded-full h-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div
                  className="bg-foreground h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}