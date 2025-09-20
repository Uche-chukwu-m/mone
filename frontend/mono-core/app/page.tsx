'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMonoAuth } from "@/lib/auth0-utils";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useMonoAuth();

  useEffect(() => {
    // TEMPORARILY BYPASS AUTH - go directly to welcome page for development
    router.push('/welcome');
    
    // TODO: Restore this when Auth0 is ready
    // Always redirect to appropriate page based on auth status
    // if (!isLoading) {
    //   if (isAuthenticated) {
    //     // User is authenticated, send them to onboarding
    //     router.push('/welcome');
    //   } else {
    //     // User is not authenticated, send them to sign-in
    //     router.push('/auth/signin');
    //   }
    // }
  }, [router]);

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-foreground">Loading...</div>
    </div>
  );
}