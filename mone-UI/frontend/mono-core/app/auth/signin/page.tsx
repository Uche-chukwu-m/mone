'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Full-width centered content */}
      <div className="w-full max-w-md mx-auto text-center space-y-12">
        {/* Animated "Welcome to Mono" with glowing effect */}
        <motion.div
          className="space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h1 
            className="text-5xl font-light text-white leading-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Welcome to{" "}
            <motion.span 
              className="font-semibold relative inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Glowing "Mono" text */}
              <motion.span
                className="relative z-10 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.2), 0 0 30px rgba(255,255,255,0.1)",
                    "0 0 15px rgba(255,255,255,0.5), 0 0 25px rgba(255,255,255,0.3), 0 0 35px rgba(255,255,255,0.2)",
                    "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.2), 0 0 30px rgba(255,255,255,0.1)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Mono
              </motion.span>
              
              {/* Subtle background glow effect */}
              <motion.div
                className="absolute inset-0 bg-white/10 blur-xl rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-white/60"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            Your financial journey starts here.
          </motion.p>
        </motion.div>

        {/* Animated Sign-in Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <motion.button
            onClick={handleGoogleSignIn}
            className="group relative w-full py-4 px-8 text-base font-medium
                     bg-white/10 text-white border border-white/20
                     hover:bg-white/20 hover:border-white/30
                     rounded-lg backdrop-blur-sm
                     focus:outline-none focus:ring-2 focus:ring-white/30
                     transition-all duration-300 flex items-center justify-center space-x-3
                     overflow-hidden"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 20px rgba(255,255,255,0.1)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button background glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Google Icon (simplified to white) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
            </svg>
            
            <span className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
              Continue with Google
            </span>
          </motion.button>
        </motion.div>

        {/* Subtle footer text */}
        <motion.p 
          className="text-xs text-white/40 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          Simple. Focused. Minimal.
        </motion.p>
      </div>
    </motion.div>
  );
}