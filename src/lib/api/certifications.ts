/**
 * API client for certifications management
 */

import { Certification, CertificationFilters } from "@/types/audit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface CertificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Certification[];
}

interface CertificationStats {
  total: number;
  active: number;
  expiring_soon: number;
  expired: number;
  suspended: number;
  revoked: number;
  pending: number;
}

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  
  // Try localStorage first
  let token = localStorage.getItem("auth_token");
  
  // If no token in localStorage, try to get from cookies as fallback
  if (!token) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth_token' && value) {
        token = value;
        // Store back in localStorage for future use
        localStorage.setItem("auth_token", token);
        break;
      }
    }
  }
  
  return token;
}

/**
 * Get authorization headers
 */
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    console.warn('[CertificationAPI] No authentication token found. Some requests may fail.');
  }
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Token ${token}` }),
  };
}

/**
 * Helper function to check if an ID exists as a template
 */
async function isTemplateId(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/certificate-templates/${id}/`, {
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch all certifications with optional filters
 */
export async function fetchCertifications(
  filters?: CertificationFilters
): Promise<Certification[]> {
  const params = new URLSearchParams();

  if (filters?.status && filters.status.length > 0) {
    filters.status.forEach((s) => params.append("status", s));
  }
  if (filters?.standard && filters.standard.length > 0) {
    filters.standard.forEach((s) => params.append("iso_standard", s));
  }
  if (filters?.clientId) {
    params.append("client", filters.clientId);
  }

  const url = `${API_BASE_URL}/certifications/?${params.toString()}`;
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch certifications");
  }

  const data: CertificationListResponse = await response.json();
  return data.results || [];
}

/**
 * Get certification by ID
 */
export async function getCertification(id: string): Promise<Certification> {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    // If 404, check if this might be a template ID being used incorrectly
    if (response.status === 404) {
      const isTemplate = await isTemplateId(id);
      if (isTemplate) {
        throw new Error(`ID "${id}" is a certificate template, not a certification. This suggests a navigation error. Expected a certification UUID.`);
      }
    }
    throw new Error(`Failed to fetch certification: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create new certification
 */
export async function createCertification(
  data: Partial<Certification>
): Promise<Certification> {
  const response = await fetch(`${API_BASE_URL}/certifications/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create certification");
  }

  return response.json();
}

/**
 * Update certification
 */
export async function updateCertification(
  id: string,
  data: Partial<Certification>
): Promise<Certification> {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update certification");
  }

  return response.json();
}

/**
 * Delete certification
 */
export async function deleteCertification(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete certification");
  }
}

/**
 * Get certification statistics
 */
export async function getCertificationStats(): Promise<CertificationStats> {
  const response = await fetch(`${API_BASE_URL}/certifications/statistics/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch certification statistics");
  }

  return response.json();
}

/**
 * Generate certificate document
 */
export async function generateCertificate(id: string): Promise<ApiResponse<any>> {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}/generate/`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate certificate");
  }

  return response.json();
}

/**
 * Renew certification
 */
export async function renewCertification(
  id: string,
  expiryDate: string
): Promise<Certification> {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}/renew/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ expiry_date: expiryDate }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to renew certification");
  }

  return response.json();
}

/**
 * Suspend certification
 */
export async function suspendCertification(
  id: string,
  reason: string
): Promise<Certification> {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}/suspend/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to suspend certification");
  }

  return response.json();
}

/**
 * Revoke certification
 */
export async function revokeCertification(
  id: string,
  reason: string
): Promise<Certification> {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}/revoke/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to revoke certification");
  }

  return response.json();
}

/**
 * Reactivate certification
 */
export async function reactivateCertification(id: string): Promise<Certification> {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}/reactivate/`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to reactivate certification");
  }

  return response.json();
}

/**
 * Get expiring certifications
 */
export async function getExpiringCertifications(
  days: number = 90
): Promise<Certification[]> {
  const response = await fetch(
    `${API_BASE_URL}/certifications/expiring/?days=${days}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch expiring certifications");
  }

  return response.json();
}

