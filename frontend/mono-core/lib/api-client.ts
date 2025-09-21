import { useCallback } from 'react';
import { useMonoAuth } from './auth0-utils';

// Prefer NEXT_PUBLIC_API_BASE_URL, fall back to NEXT_PUBLIC_BACKEND_URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export function useApiClient() {
  const { getAccessToken } = useMonoAuth();

  const fetchWithAuth = useCallback(async (path: string, options: RequestInit = {}) => {
    if (!API_BASE_URL) {
      throw new Error(
        'API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_BACKEND_URL in .env.local.'
      );
    }
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    // Ensure we don't end up with double slashes when concatenating
    const base = API_BASE_URL.replace(/\/$/, '');
    const endpoint = path.startsWith('/') ? path : `/${path}`;
    const response = await fetch(`${base}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'API request failed');
    }

    return response.json();
  }, [getAccessToken]);

  return {
    getTransactions: () => fetchWithAuth('/transactions'),
    getSummary: () => fetchWithAuth('/summary'),
    syncEmails: () => fetchWithAuth('/email/sync', { method: 'POST' }),
    getGoogleLoginUrl: () => fetchWithAuth('/auth/google/login'),
  };
}
