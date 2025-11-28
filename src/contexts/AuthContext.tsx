"use client";

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { apiClient } from '@/lib/api-client';
import type {
  AuthContextType,
  User,
  LoginData,
  RegisterData,
  VerifyEmailData,
  PasswordResetConfirmData,
  ChangePasswordData,
  AuthResponse,
  UserRole,
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load user from token on mount
   */
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = apiClient.getToken();
      
      if (storedToken) {
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.user) {
            setUser(response.user);
            setToken(storedToken);
          } else {
            apiClient.clearToken();
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          apiClient.clearToken();
        }
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
        errors: error.errors,
      };
    }
  }, []);

  /**
   * Verify email with code
   */
  const verifyEmail = useCallback(async (data: VerifyEmailData): Promise<AuthResponse> => {
    try {
      const response = await authService.verifyEmail(data);
      
      if (response.success && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        apiClient.setToken(response.token);
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Email verification failed',
      };
    }
  }, []);

  /**
   * Resend verification code
   */
  const resendVerification = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      return await authService.resendVerification(email);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to resend verification code',
      };
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log('[AuthContext] Attempting login for:', data.username);
      const response = await authService.login(data);
      console.log('[AuthContext] Login response:', response);

      if (response.success && response.token && response.user) {
        console.log('[AuthContext] Login successful, setting token and user');
        setToken(response.token);
        setUser(response.user);
        apiClient.setToken(response.token);
      } else {
        console.log('[AuthContext] Login failed:', response.error);
      }

      return response;
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
        requires_2fa: error.requires_2fa,
        requires_verification: error.requires_verification,
      };
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      apiClient.clearToken();
    }
  }, []);

  /**
   * Request password reset
   */
  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      return await authService.requestPasswordReset(email);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset request failed',
      };
    }
  }, []);

  /**
   * Confirm password reset
   */
  const confirmPasswordReset = useCallback(async (data: PasswordResetConfirmData): Promise<AuthResponse> => {
    try {
      return await authService.confirmPasswordReset(data);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
      };
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (data: ChangePasswordData): Promise<AuthResponse> => {
    try {
      const response = await authService.changePassword(data);
      
      if (response.success) {
        // Logout after password change
        await logout();
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password change failed',
      };
    }
  }, [logout]);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [token]);

  /**
   * Check if user has specific role(s)
   */
  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.profile.role);
  }, [user]);

  /**
   * Check if user has specific permission
   * This is a placeholder - implement based on your permission system
   */
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.profile.role === 'ADMIN') return true;
    
    // Implement your permission logic here
    // For now, return false for non-admin users
    return false;
  }, [user]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    requestPasswordReset,
    confirmPasswordReset,
    changePassword,
    refreshUser,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

