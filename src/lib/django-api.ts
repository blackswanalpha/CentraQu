/**
 * Django Backend API Client
 * 
 * This module provides functions to interact with the Django backend API.
 * All intake-related operations are now handled by the Django backend with PostgreSQL.
 */

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000/api/v1';

export interface DjangoIntakeLink {
  id: number;
  title: string;
  token: string;
  access_code: string;
  description: string;
  is_active: boolean;
  expires_at: string;
  max_uses: number;
  current_uses: number;
  related_audit_id: string | null;
  related_project_id: string | null;
  notes: string;
  metadata: Record<string, any>;
  last_accessed_at: string | null;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
  submissions_count: number;
  is_expired: boolean;
  is_exhausted: boolean;
  is_usable: boolean;
  status: 'active' | 'expired' | 'exhausted' | 'inactive';
  status_display: string;
}

export interface DjangoIntakeSubmission {
  id: number;
  intake_link: number;
  intake_title: string;
  client: number | null;
  client_data: Record<string, any>;
  submitted_at: string;
  ip_address: string | null;
  user_agent: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: number | null;
  reviewed_by_name: string | null;
  reviewed_at: string | null;
  notes: string;
  rejection_reason: string;
  processed: boolean;
  processed_by: number | null;
  processed_at: string | null;
  company_name: string;
}

/**
 * Fetch all intake links from Django backend
 */
export async function fetchIntakeLinks(): Promise<DjangoIntakeLink[]> {
  const response = await fetch(`${DJANGO_API_URL}/intake-links/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch intake links: ${response.statusText}`);
  }

  const data = await response.json();

  // Django REST Framework returns paginated results with 'results' array
  // If it's paginated, return the results array, otherwise return the data as-is
  return data.results || data;
}

/**
 * Create a new intake link in Django backend
 */
export async function createIntakeLink(data: {
  title?: string;
  description?: string;
  expires_at: string;
  max_uses?: number;
  related_audit_id?: string;
  related_project_id?: string;
  notes?: string;
  metadata?: Record<string, any>;
}): Promise<DjangoIntakeLink> {
  const response = await fetch(`${DJANGO_API_URL}/intake-links/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create intake link: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Validate an access code for an intake link
 */
export async function validateAccessCode(linkToken: string, accessCode: string): Promise<{
  valid: boolean;
  error?: string;
  linkData?: {
    id: number;
    title: string;
    description: string;
    maxUses: number;
    currentUses: number;
    expiresAt: string;
  };
}> {
  const response = await fetch(`${DJANGO_API_URL}/clients/intake/validate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      linkToken,
      accessCode,
    }),
  });

  return response.json();
}

/**
 * Submit an intake form
 */
export async function submitIntakeForm(token: string, accessCode: string, formData: Record<string, any>): Promise<{
  success: boolean;
  error?: string;
  submission?: DjangoIntakeSubmission;
}> {
  const response = await fetch(`${DJANGO_API_URL}/clients/intake/${token}/submit/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessCode,
      formData,
    }),
  });

  return response.json();
}

/**
 * Fetch all intake submissions from Django backend
 */
export async function fetchIntakeSubmissions(): Promise<DjangoIntakeSubmission[]> {
  const response = await fetch(`${DJANGO_API_URL}/intake-submissions/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch intake submissions: ${response.statusText}`);
  }

  const data = await response.json();

  // Django REST Framework returns paginated results with 'results' array
  // If it's paginated, return the results array, otherwise return the data as-is
  return data.results || data;
}

