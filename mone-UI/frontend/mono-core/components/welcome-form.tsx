'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export function WelcomeForm() {
  const [firstName, setFirstName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [parent] = useAutoAnimate();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim()) {
      // Store the name in localStorage
      localStorage.setItem('userFirstName', firstName.trim());
      // Navigate to the onboarding page
      router.push('/onboarding');
    }
  };

  const handleContinue = () => {
    if (firstName.trim()) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  return (
    <motion.div 
      ref={parent}
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Question */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-lg text-foreground/70 font-normal">
          What should we call you?
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.label
            htmlFor="firstName"
            className="block text-base font-medium text-foreground"
            animate={{ 
              color: isFocused ? 'rgb(var(--foreground))' : 'rgb(var(--foreground) / 0.8)' 
            }}
          >
            Name
          </motion.label>
          <motion.div className="relative">
            <motion.input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Your first name"
              className="w-full px-4 py-3 text-base border border-foreground/30
                       bg-background text-foreground
                       focus:border-foreground focus:outline-none focus:ring-0
                       rounded-md
                       placeholder:text-foreground/50
                       transition-all duration-200"
              whileFocus={{ 
                scale: 1.02,
                borderColor: 'rgb(var(--foreground))',
                boxShadow: '0 0 0 3px rgb(var(--foreground) / 0.1)'
              }}
              required
            />
            {firstName && (
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.button
          type="submit"
          onClick={handleContinue}
          disabled={!firstName.trim()}
          className="w-full py-3 px-6 text-base font-medium
                   bg-foreground/10 text-foreground border border-foreground/20
                   hover:bg-foreground/20
                   disabled:opacity-50 disabled:cursor-not-allowed
                   rounded-md
                   focus:outline-none focus:ring-0
                   transition-all duration-200"
          whileHover={{ 
            scale: firstName.trim() ? 1.02 : 1,
            backgroundColor: firstName.trim() ? 'rgb(var(--foreground) / 0.15)' : undefined
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.span
            animate={{ 
              opacity: firstName.trim() ? 1 : 0.7,
            }}
          >
            Continue
          </motion.span>
        </motion.button>
      </form>
    </motion.div>
  );
}
