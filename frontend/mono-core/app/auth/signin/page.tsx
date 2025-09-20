'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MonoLogo } from "@/components/mono-logo";
import { AnimatedVisual } from "@/components/animated-visual";

export default function SignInPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    // If user is already authenticated, redirect to main app
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  const handleGoogleSignIn = () => {
    // Step 1: User clicks "Sign in with Google" button
    // Step 2: Frontend asks Auth0 to handle it using Auth0 SDK
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2', // Specifically use Google connection
        scope: 'openid profile email'
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

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

        {/* Main content area - centered */}
        <div className="flex flex-col justify-center items-center h-full px-16">
          <div className="w-full max-w-md space-y-8 text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h1 className="text-4xl font-light text-foreground leading-tight">
                Welcome to <span className="font-semibold">Mono</span>.
              </h1>
              <p className="text-lg text-foreground/70 mt-2">
                Sign in to continue your financial journey.
              </p>
            </motion.div>

            <motion.button
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-6 text-base font-medium
                       bg-foreground/10 text-foreground border border-foreground/20
                       hover:bg-foreground/20
                       rounded-md
                       focus:outline-none focus:ring-0
                       transition-all duration-200 flex items-center justify-center space-x-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              {/* Google "G" icon */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.6 10.232c0-.64-.057-1.25-.164-1.84H10v3.481h5.347a4.168 4.168 0 01-1.81 2.715v2.35h3.027c1.77-1.638 2.79-4.045 2.79-6.906z" fill="#4285F4"/>
                <path d="M10 20c2.71 0 4.98-1.02 6.64-2.79l-3.02-2.35c-.83.56-1.9.89-3.62.89-2.79 0-5.16-1.88-6.01-4.42H.957v2.437C2.71 18.09 6.14 20 10 20z" fill="#34A853"/>
                <path d="M3.99 11.98c-.2-.56-.31-1.16-.31-1.8s.11-1.24.31-1.8V5.81H.957C.347 7.04 0 8.47 0 10s.347 2.96.957 4.19L3.99 11.98z" fill="#FBBC05"/>
                <path d="M10 3.98c1.48 0 2.8.5 3.85 1.49l2.67-2.67C14.98 1.02 12.71 0 10 0 6.14 0 2.71 1.91.957 5.81L3.99 8.24C4.84 5.7 7.21 3.98 10 3.98z" fill="#EA4335"/>
              </svg>
              <span className="text-foreground">Continue with Google</span>
            </motion.button>

            <motion.div
              className="text-sm text-foreground/50 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <p>
                By signing in, you agree to our terms and privacy policy.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}