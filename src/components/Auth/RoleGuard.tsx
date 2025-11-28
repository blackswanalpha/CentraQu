"use client";

/**
 * Role Guard Component
 * Conditionally renders children based on user role
 */

import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/auth';

interface RoleGuardProps {
  roles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { hasRole } = useAuth();
  
  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Permission Guard Component
 * Conditionally renders children based on user permission
 */

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Hook to check if user has role
 */
export function useHasRole(roles: UserRole | UserRole[]): boolean {
  const { hasRole } = useAuth();
  return hasRole(roles);
}

/**
 * Hook to check if user has permission
 */
export function useHasPermission(permission: string): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

