'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated via localStorage token
    const token = localStorage.getItem('google_access_token');
    
    if (token) {
      // User is authenticated, send them to welcome/onboarding
      router.push('/welcome');
    } else {
      // User is not authenticated, send them to sign-in
      router.push('/auth/signin');
    }
  }, [router]);

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>
  );
}