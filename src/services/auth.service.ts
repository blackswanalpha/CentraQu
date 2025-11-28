/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient } from '@/lib/api-client';
import type {
  AuthResponse,
  RegisterData,
  LoginData,
  VerifyEmailData,
  PasswordResetRequestData,
  PasswordResetConfirmData,
  ChangePasswordData,
  User,
  Enable2FAResponse,
  Verify2FAResponse,
} from '@/types/auth';

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register/', data);
  },

  /**
   * Verify email with code
   */
  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/verify-email/', data);
  },

  /**
   * Resend verification code
   */
  async resendVerification(email: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/resend-verification/', { email });
  },

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    // Clear any existing token before login attempt
    apiClient.clearToken();

    const response = await apiClient.post<AuthResponse>('/auth/login/', data, true);

    // Store token if login successful
    if (response.success && response.token) {
      apiClient.setToken(response.token);
    }

    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout/');
    } finally {
      // Always clear token, even if request fails
      apiClient.clearToken();
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<{ success: boolean; user: User }> {
    return apiClient.get<{ success: boolean; user: User }>('/auth/me/');
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/password/reset/', { email });
  },

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(data: PasswordResetConfirmData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/password/reset/confirm/', data);
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/password/change/', data);
  },

  /**
   * Enable 2FA
   */
  async enable2FA(password: string): Promise<Enable2FAResponse> {
    return apiClient.post<Enable2FAResponse>('/auth/2fa/enable/', { password });
  },

  /**
   * Verify and activate 2FA
   */
  async verify2FA(code: string): Promise<Verify2FAResponse> {
    return apiClient.post<Verify2FAResponse>('/auth/2fa/verify/', { code });
  },

  /**
   * Disable 2FA
   */
  async disable2FA(password: string, code: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/2fa/disable/', { password, code });
  },
};

