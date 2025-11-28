/**
 * Opportunity Service
 * Handles all business development opportunity-related API calls
 */

import { apiClient } from '@/lib/api-client';

export interface Opportunity {
  id: number;
  title: string;
  description?: string;
  // Client can be either nested object (detail view) or ID (list view)
  client?: {
    id: number;
    name: string;
    industry?: string;
  };
  client_id?: number;
  client_name?: string; // Used in list view
  service_type: string;
  estimated_value: string | number;
  currency: string;
  probability: number;
  status: string;
  expected_close_date: string;
  actual_close_date?: string | null;
  // Owner can be either nested object (detail view) or ID (list view)
  owner?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  };
  owner_id?: number;
  owner_name?: string; // Used in list view
  created_at: string;
  updated_at: string;
  last_activity?: {
    type: string;
    date: string;
    description: string;
  };
}

export interface OpportunityListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Opportunity[];
}

export interface OpportunityStats {
  total_pipeline: number;
  opportunity_count: number;
  weighted_forecast: number;
  won_this_month: number;
  conversion_rate: number;
  average_deal_size: number;
  by_stage: Record<string, { name: string; count: number; value: number }>;
}

export interface TeamMember {
  owner: {
    id: number;
    name: string;
    email: string;
  };
  opportunity_count: number;
  total_value: number;
  weighted_value: number;
  win_rate: number;
}

export const opportunityService = {
  /**
   * Get all opportunities with optional filtering
   */
  async getOpportunities(params?: {
    status?: string;
    service_type?: string;
    owner?: string | number;
    client?: string | number;
    search?: string;
    ordering?: string;
    page?: number;
  }): Promise<OpportunityListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.service_type) queryParams.append('service_type', params.service_type);
    if (params?.owner) queryParams.append('owner', params.owner.toString());
    if (params?.client) queryParams.append('client', params.client.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/opportunities/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<OpportunityListResponse>(endpoint);
  },

  /**
   * Get a single opportunity by ID
   */
  async getOpportunity(id: string | number): Promise<Opportunity> {
    return apiClient.get<Opportunity>(`/opportunities/${id}/`);
  },

  /**
   * Get pipeline statistics
   */
  async getStats(): Promise<{ success: boolean; data: OpportunityStats }> {
    return apiClient.get<{ success: boolean; data: OpportunityStats }>('/opportunities/stats/');
  },

  /**
   * Get opportunities grouped by owner
   */
  async getByOwner(): Promise<{ success: boolean; data: TeamMember[] }> {
    return apiClient.get<{ success: boolean; data: TeamMember[] }>('/opportunities/by_owner/');
  },

  /**
   * Get a single opportunity by ID
   */
  async getOpportunityById(id: number): Promise<Opportunity> {
    return apiClient.get<Opportunity>(`/opportunities/${id}/`);
  },

  /**
   * Create a new opportunity
   */
  async createOpportunity(data: Partial<Opportunity>): Promise<Opportunity> {
    return apiClient.post<Opportunity>('/opportunities/', data);
  },

  /**
   * Update an existing opportunity
   */
  async updateOpportunity(id: number, data: Partial<Opportunity>): Promise<Opportunity> {
    return apiClient.put<Opportunity>(`/opportunities/${id}/`, data);
  },

  /**
   * Partially update an opportunity
   */
  async patchOpportunity(id: number, data: Partial<Opportunity>): Promise<Opportunity> {
    return apiClient.patch<Opportunity>(`/opportunities/${id}/`, data);
  },

  /**
   * Delete an opportunity
   */
  async deleteOpportunity(id: number): Promise<void> {
    return apiClient.delete(`/opportunities/${id}/`);
  }
};

