'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, className = '' }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`w-64 ${className}`}>
      <div className="w-full bg-foreground/20 rounded-full h-2 overflow-hidden">
        <motion.div 
          className="bg-foreground h-2 rounded-full" 
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ 
            duration: 0.8, 
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}
