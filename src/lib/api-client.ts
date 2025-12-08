/**
 * API Client for Backend Communication
 * Handles authentication, token management, and API requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;

    // Load token from localStorage on initialization (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null) {
    this.token = token;

    if (typeof window !== 'undefined') {
      if (token) {
        // Store in both localStorage and cookie for SSR support
        localStorage.setItem('auth_token', token);
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
      } else {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; path=/; max-age=0';
      }
    }
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try localStorage first
      const localToken = localStorage.getItem('auth_token');
      if (localToken) return localToken;

      // Fallback to cookie
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token') {
          return value;
        }
      }
    }
    return this.token;
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.setToken(null);
  }

  /**
   * Make an API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuthRedirect: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Don't set Content-Type for FormData - let browser set it with boundary
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string> || {}),
    };

    // Add authentication token if available
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
      console.log('[APIClient] Using token:', this.token.substring(0, 10) + '...');
    } else {
      console.log('[APIClient] No token available');
    }

    console.log('[APIClient] Request:', options.method || 'GET', url);
    if (options.body) {
      console.log('[APIClient] Request body:', isFormData ? 'FormData' : options.body);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('[APIClient] Response status:', response.status);

      // Handle 204 No Content explicitly
      if (response.status === 204) {
        return null as T;
      }

      // Parse response - check content type first
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Non-JSON response (likely HTML error page)
        const text = await response.text();
        console.error('[APIClient] Non-JSON response:', text.substring(0, 200));

        // If it's an error status, throw a more helpful error
        if (!response.ok) {
          throw new APIError(
            `Server returned ${response.status}: ${response.statusText}`,
            response.status
          );
        }

        data = text;
      }

      console.log('[APIClient] Response data:', data);

      // Handle different response statuses
      if (response.status === 401) {
        console.log('[APIClient] 401 Unauthorized, skipAuthRedirect:', skipAuthRedirect);
        // Unauthorized - clear token and redirect to login (unless it's a login/register request)
        if (!skipAuthRedirect) {
          this.clearToken();
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
            window.location.href = '/auth/login';
          }
        }

        // For login/register, return the error response instead of throwing
        if (skipAuthRedirect) {
          return data as T;
        }

        throw new APIError('Unauthorized', 401);
      }

      if (!response.ok) {
        console.error('[APIClient] Request failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          url: url
        });

        // Extract error message from various possible formats
        let errorMessage = 'Request failed';
        if (typeof data === 'object' && data !== null) {
          // Check for common error message fields
          errorMessage = data.error || data.message || data.detail || JSON.stringify(data);
        } else if (typeof data === 'string') {
          errorMessage = data;
        }

        throw new APIError(
          errorMessage,
          response.status,
          data.errors || data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      console.error('[APIClient] Network error:', error);
      // Network or other errors
      throw new APIError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';

    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, skipAuthRedirect: boolean = false): Promise<T> {
    // Skip auth redirect for login, register, and password reset endpoints
    const shouldSkipRedirect = skipAuthRedirect ||
      endpoint.includes('/auth/login') ||
      endpoint.includes('/auth/register') ||
      endpoint.includes('/auth/password/reset') ||
      endpoint.includes('/auth/verify-email');

    // Handle FormData differently - don't JSON.stringify it
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);

    return this.request<T>(endpoint, {
      method: 'POST',
      body,
    }, shouldSkipRedirect);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export class for testing or custom instances
export default APIClient;

