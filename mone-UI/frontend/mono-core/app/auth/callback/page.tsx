'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { AnimatedVisual } from "@/components/animated-visual";

export default function AuthCallbackPage() {
  const { isAuthenticated, isLoading, error, user, getAccessTokenSilently } = useAuth0();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing sign-in...');
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (isLoading) {
        setStatus('loading');
        setMessage('Processing authentication...');
        return;
      }

      if (error) {
        console.error('Auth0 error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
        return;
      }

      if (isAuthenticated && user) {
        try {
          setStatus('loading');
          setMessage('Setting up your account...');

          // Step 6: Auth0 creates a user profile and issues your app's JWT
          // Get the access token (JWT) from Auth0
          const accessToken = await getAccessTokenSilently();
          
          // Store user info and token (Auth0 handles most of this automatically)
          console.log('User authenticated:', user);
          console.log('Access token received:', !!accessToken);

          setStatus('success');
          setMessage('Welcome! Redirecting to your dashboard...');

          // Redirect to onboarding or main app
          setTimeout(() => {
            router.push('/');
          }, 2000);

        } catch (tokenError) {
          console.error('Token retrieval error:', tokenError);
          setStatus('error');
          setMessage('Failed to complete authentication setup.');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
        }
      }
    };

    handleAuthCallback();
  }, [isAuthenticated, isLoading, error, user, getAccessTokenSilently, router]);

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