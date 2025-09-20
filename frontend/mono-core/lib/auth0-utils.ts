'use client';

import { useAuth0 } from '@auth0/auth0-react';

// Custom hook that provides Auth0 utilities
export function useMonoAuth() {
  // TEMPORARILY MOCK AUTH STATE FOR DEVELOPMENT
  // Remove this when Auth0 credentials are ready
  const mockUser = {
    sub: 'mock-user-123',
    name: 'Test User',
    email: 'test@example.com'
  };

  // Mock authenticated state for development
  const isAuthenticated = true;
  const isLoading = false;
  const user = mockUser;

  // Comment out real Auth0 hooks for now
  // const {
  //   user,
  //   isAuthenticated,
  //   isLoading,
  //   loginWithRedirect,
  //   logout,
  //   getAccessTokenSilently
  // } = useAuth0();

  // TEMPORARILY MOCK AUTH FUNCTIONS FOR DEVELOPMENT
  // Sign in with Google specifically - mock for now
  const signInWithGoogle = () => {
    console.log('Mock: Would redirect to Google sign-in');
    // loginWithRedirect({
    //   authorizationParams: {
    //     connection: 'google-oauth2',
    //     scope: 'openid profile email'
    //   }
    // });
  };

  // Sign out and redirect to sign-in page - mock for now
  const signOut = () => {
    console.log('Mock: Would sign out user');
    // logout({
    //   logoutParams: {
    //     returnTo: window.location.origin + '/auth/signin'
    //   }
    // });
  };

  // Get user information
  const getUser = () => {
    return user || null;
  };

  // Get access token (JWT) - mock for now
  const getAccessToken = async () => {
    console.log('Mock: Returning fake access token');
    return 'mock-jwt-token-123';
    // try {
    //   if (!isAuthenticated) return null;
    //   return await getAccessTokenSilently();
    // } catch (error) {
    //   console.error('Error getting access token:', error);
    //   return null;
    // }
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
