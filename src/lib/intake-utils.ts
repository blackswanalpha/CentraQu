/**
 * Client Intake Utility Functions
 * Helper functions for generating tokens, access codes, and validating intake links
 */

import { ClientIntakeLink, IntakeLinkStatus } from "@/types/client-intake";

/**
 * Generate a cryptographically secure random token
 * @param length - Length of the token (default: 64)
 * @returns Random token string
 */
export function generateSecureToken(length: number = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  // Use crypto.getRandomValues for secure random generation
  const randomValues = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomValues);
  } else if (typeof global !== 'undefined' && global.crypto) {
    global.crypto.getRandomValues(randomValues);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }
  
  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % chars.length];
  }
  
  return token;
}

/**
 * Generate a human-readable access code
 * Format: XXXX-XXXX (8 characters, uppercase alphanumeric)
 * @returns Access code string
 */
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking chars (0, O, 1, I)
  let code = '';
  
  const randomValues = new Uint8Array(8);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomValues);
  } else if (typeof global !== 'undefined' && global.crypto) {
    global.crypto.getRandomValues(randomValues);
  } else {
    for (let i = 0; i < 8; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }
  
  for (let i = 0; i < 8; i++) {
    code += chars[randomValues[i] % chars.length];
    if (i === 3) code += '-'; // Add separator after 4 chars
  }
  
  return code;
}

/**
 * Format access code to standard format (XXXX-XXXX)
 * @param code - Raw access code
 * @returns Formatted access code
 */
export function formatAccessCode(code: string): string {
  // Remove any non-alphanumeric characters
  const cleaned = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // Add separator after 4 characters
  if (cleaned.length > 4) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
  }
  
  return cleaned;
}

/**
 * Validate access code format
 * @param code - Access code to validate
 * @returns True if valid format
 */
export function isValidAccessCodeFormat(code: string): boolean {
  const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(code);
}

/**
 * Calculate link status based on current state
 * @param link - Client intake link
 * @returns Current status
 */
export function calculateLinkStatus(link: ClientIntakeLink): IntakeLinkStatus {
  if (!link.isActive) {
    return "revoked";
  }

  const now = new Date();
  const expiresAt = parseDate(link.expiresAt);

  if (!expiresAt || now > expiresAt) {
    return "expired";
  }

  if (link.currentUses >= link.maxUses) {
    return "exhausted";
  }

  return "active";
}

/**
 * Check if a link is usable
 * @param link - Client intake link
 * @returns True if link can be used
 */
export function isLinkUsable(link: ClientIntakeLink): boolean {
  const status = calculateLinkStatus(link);
  return status === "active";
}

/**
 * Get human-readable status label
 * @param status - Link status
 * @returns Display label
 */
export function getStatusLabel(status: IntakeLinkStatus): string {
  const labels: Record<IntakeLinkStatus, string> = {
    active: "Active",
    expired: "Expired",
    exhausted: "Exhausted",
    revoked: "Revoked",
  };
  return labels[status];
}

/**
 * Get status color for UI
 * @param status - Link status
 * @returns Tailwind color class
 */
export function getStatusColor(status: IntakeLinkStatus): string {
  const colors: Record<IntakeLinkStatus, string> = {
    active: "text-green-600 bg-green-50 dark:bg-green-900/20",
    expired: "text-gray-600 bg-gray-50 dark:bg-gray-900/20",
    exhausted: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    revoked: "text-red-600 bg-red-50 dark:bg-red-900/20",
  };
  return colors[status];
}

/**
 * Calculate time remaining until expiration
 * @param expiresAt - Expiration date (can be Date object or string)
 * @returns Human-readable time remaining
 */
export function getTimeRemaining(expiresAt: Date | string): string {
  const now = new Date();
  const expiresAtDate = parseDate(expiresAt);

  if (!expiresAtDate) {
    return "Invalid date";
  }

  const diff = expiresAtDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return "Expired";
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}

/**
 * Generate full intake URL
 * @param linkToken - Link token
 * @param baseUrl - Base URL (optional, defaults to current origin)
 * @returns Full intake URL
 */
export function generateIntakeUrl(linkToken: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/intake/${linkToken}`;
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Format date for display
 * @param date - Date to format (can be Date object or string)
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) {
    return 'N/A';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Parse date from API response (handles both Date objects and ISO strings)
 * @param date - Date to parse
 * @returns Date object or null if invalid
 */
export function parseDate(date: Date | string | null | undefined): Date | null {
  if (!date) {
    return null;
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    return dateObj;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

/**
 * Validate client data before submission
 * @param data - Client data
 * @returns Validation errors or null if valid
 */
export function validateClientData(data: any): Record<string, string> | null {
  const errors: Record<string, string> = {};
  
  if (!data.name?.trim()) {
    errors.name = "Company name is required";
  }
  
  if (!data.contact?.trim()) {
    errors.contact = "Contact person is required";
  }
  
  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }
  
  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  }
  
  if (!data.address?.trim()) {
    errors.address = "Address is required";
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

