/**
 * Client Service
 * Handles all client-related API calls to backend_centra
 */

import { apiClient } from '@/lib/api-client';
import type { Client } from '@/types/audit';

export interface ClientListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Client[];
}

export interface ClientResponse {
  success?: boolean;
  data?: Client;
  message?: string;
  error?: string;
}

export const clientService = {
  /**
   * Get all clients with optional filtering
   */
  async getClients(params?: {
    search?: string;
    status?: string;
    industry?: string;
    ordering?: string;
    page?: number;
  }): Promise<ClientListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.industry) queryParams.append('industry', params.industry);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/clients/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ClientListResponse>(endpoint);
  },

  /**
   * Get a single client by ID
   */
  async getClient(id: string | number): Promise<Client> {
    return apiClient.get<Client>(`/clients/${id}/`);
  },

  /**
   * Create a new client
   */
  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    return apiClient.post<Client>('/clients/', data);
  },

  /**
   * Update an existing client
   */
  async updateClient(id: string | number, data: Partial<Client>): Promise<Client> {
    return apiClient.put<Client>(`/clients/${id}/`, data);
  },

  /**
   * Partially update a client
   */
  async patchClient(id: string | number, data: Partial<Client>): Promise<Client> {
    return apiClient.patch<Client>(`/clients/${id}/`, data);
  },

  /**
   * Delete a client
   */
  async deleteClient(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/clients/${id}/`);
  },

  /**
   * Get client contacts
   */
  async getClientContacts(clientId: string | number): Promise<any[]> {
    return apiClient.get<any[]>(`/clients/${clientId}/contacts/`);
  },

  /**
   * Get client audits
   */
  async getClientAudits(clientId: string | number): Promise<any[]> {
    return apiClient.get<any[]>(`/clients/${clientId}/audits/`);
  },
};

