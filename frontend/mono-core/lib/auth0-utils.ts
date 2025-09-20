'use client';

import { useAuth0 } from '@auth0/auth0-react';

// Custom hook that provides Auth0 utilities
export function useMonoAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  // Sign in with Google specifically
  const signInWithGoogle = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
        scope: 'openid profile email'
      }
    });
  };

  // Sign out and redirect to sign-in page
  const signOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin + '/auth/signin'
      }
    });
  };

  // Get user information
  const getUser = () => {
    return user || null;
  };

  // Get access token (JWT)
  const getAccessToken = async () => {
    try {
      if (!isAuthenticated) return null;
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  return {
    user: getUser(),
    isAuthenticated,
    isLoading,
    signInWithGoogle,
    signOut,
    getAccessToken
  };
}

// Non-hook utility functions for backwards compatibility
export const authUtils = {
  // These are now handled by Auth0 automatically
  isAuthenticated: () => {
    // This should only be used in components wrapped with useAuth0
    console.warn('Use useMonoAuth hook instead of authUtils.isAuthenticated()');
    return false;
  },
  
  signInWithGoogle: () => {
    console.warn('Use useMonoAuth hook instead of authUtils.signInWithGoogle()');
    // Redirect to sign-in page where Auth0 will handle it
    window.location.href = '/auth/signin';
  },

  signOut: () => {
    console.warn('Use useMonoAuth hook instead of authUtils.signOut()');
    // Redirect to sign-in page
    window.location.href = '/auth/signin';
  }
};
