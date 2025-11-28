/**
 * Authentication Types
 */

export type UserRole = 
  | 'ADMIN' 
  | 'AUDITOR' 
  | 'BUSINESS_DEV' 
  | 'CONSULTANT' 
  | 'FINANCE' 
  | 'EMPLOYEE';

export interface UserProfile {
  role: UserRole;
  department: string;
  phone: string;
  avatar?: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  profile: UserProfile;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
  requires_2fa?: boolean;
  requires_verification?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  department?: string;
  phone?: string;
}

export interface LoginData {
  username: string;
  password: string;
  two_factor_code?: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  password: string;
  password_confirm: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface Enable2FAResponse {
  success: boolean;
  secret?: string;
  qr_code_url?: string;
  message?: string;
  error?: string;
}

export interface Verify2FAResponse {
  success: boolean;
  message?: string;
  backup_codes?: string[];
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  verifyEmail: (data: VerifyEmailData) => Promise<AuthResponse>;
  resendVerification: (email: string) => Promise<AuthResponse>;
  requestPasswordReset: (email: string) => Promise<AuthResponse>;
  confirmPasswordReset: (data: PasswordResetConfirmData) => Promise<AuthResponse>;
  changePassword: (data: ChangePasswordData) => Promise<AuthResponse>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

