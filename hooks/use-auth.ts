'use client';

import { useState, useEffect, useCallback } from 'react';

import { API_URL } from '@/lib/api-config';
import { clearAvatarData } from '@/lib/avatar-api';

const AUTH_URL = `${API_URL}/auth`;

// Decode JWT payload (without verification - just for reading claims)
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Get role from JWT token
function getRoleFromToken(token: string): 'user' | 'admin' {
  const payload = decodeJwtPayload(token);
  if (payload && typeof payload.role === 'string') {
    return payload.role as 'user' | 'admin';
  }
  return 'user';
}

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_verified: boolean;
  role?: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  needsVerification?: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setState({ user: null, loading: false, error: null });
      return;
    }

    try {
      const res = await fetch(`${AUTH_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        // Get role from JWT token since /me might not return it
        const role = getRoleFromToken(token);
        const userWithRole = { ...data.user, role };
        setState({ user: userWithRole, loading: false, error: null });
      } else {
        // Token expired or invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setState({ user: null, loading: false, error: null });
      }
    } catch (e) {
      setState({ user: null, loading: false, error: 'Failed to fetch user' });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const register = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResult> => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, user: data.user, needsVerification: true };
      }

      return { success: false, error: data.error || 'Registration failed' };
    } catch (e) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${AUTH_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('access_token', data.tokens.access_token);
        localStorage.setItem('refresh_token', data.tokens.refresh_token);
        setState({ user: data.user, loading: false, error: null });
        return { success: true, user: data.user };
      }

      return { success: false, error: data.error || 'Verification failed' };
    } catch (e) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const resendVerification = async (email: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${AUTH_URL}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        return { success: true };
      }

      const data = await res.json();
      return { success: false, error: data.error || 'Failed to resend code' };
    } catch (e) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('access_token', data.tokens.access_token);
        localStorage.setItem('refresh_token', data.tokens.refresh_token);
        // Get role from JWT token
        const role = getRoleFromToken(data.tokens.access_token);
        const userWithRole = { ...data.user, role };
        setState({ user: userWithRole, loading: false, error: null });
        return { success: true, user: userWithRole };
      }

      return { success: false, error: data.error || 'Invalid email or password' };
    } catch (e) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${AUTH_URL}/google`;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    clearAvatarData();
    setState({ user: null, loading: false, error: null });
  };

  const refreshToken = async (): Promise<boolean> => {
    const refreshTokenValue = localStorage.getItem('refresh_token');
    if (!refreshTokenValue) return false;

    try {
      const res = await fetch(`${AUTH_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshTokenValue}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.tokens.access_token);
        localStorage.setItem('refresh_token', data.tokens.refresh_token);
        return true;
      }

      logout();
      return false;
    } catch (e) {
      logout();
      return false;
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    register,
    verifyEmail,
    resendVerification,
    login,
    loginWithGoogle,
    logout,
    refreshToken,
    refetchUser: fetchUser,
  };
}

// Password validation helper
export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/\d/.test(password)) return 'Password must contain a digit';
  return null;
}

// Email validation helper
export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
}
