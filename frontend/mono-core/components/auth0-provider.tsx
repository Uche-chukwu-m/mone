'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode } from 'react';

interface Auth0ProviderWrapperProps {
  children: ReactNode;
}

export function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const redirectUri = typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : '';

  if (!domain || !clientId || domain.includes('placeholder') || clientId.includes('placeholder')) {
    console.error('Auth0 configuration missing or using placeholder values. Please set real NEXT_PUBLIC_AUTH0_DOMAIN and NEXT_PUBLIC_AUTH0_CLIENT_ID environment variables.');
    
    // Show a nice setup message instead of error
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md text-center space-y-4 p-8">
          <h1 className="text-2xl font-semibold text-foreground">Setup Required</h1>
          <p className="text-foreground/70">
            Please configure your Auth0 credentials in the <code className="bg-foreground/10 px-2 py-1 rounded">.env.local</code> file.
          </p>
          <p className="text-sm text-foreground/50">
            Check the README-AUTH0.md file for setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: 'openid profile email'
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}
