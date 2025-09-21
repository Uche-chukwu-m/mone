'use client';

import { FC } from 'react';

interface MonoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function MonoLogo({ size = 'lg', className = '' }: MonoLogoProps) {
  const sizeClasses = {
    sm: 'text-2xl tracking-[0.2em]',
    md: 'text-4xl tracking-[0.25em]',
    lg: 'text-6xl tracking-[0.3em]',
    xl: 'text-8xl tracking-[0.35em]'
  };

  return (
    <div className={`mono-logo ${className}`}>
      <h1 className={`font-mono font-bold text-black dark:text-white ${sizeClasses[size]} select-none`}>
        M·O·N·O
      </h1>
    </div>
  );
}
