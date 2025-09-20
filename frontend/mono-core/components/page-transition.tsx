'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={`min-h-screen ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: 0.4
      }}
    >
      {children}
    </motion.div>
  );
}

export function SlideTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={`min-h-screen ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={`min-h-screen ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}
