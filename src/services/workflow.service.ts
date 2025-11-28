/**
 * Workflow Service
 * Handles all workflow-related API calls
 */

import { apiClient } from '@/lib/api-client';

export interface WorkflowStep {
  id: number;
  workflow: number;
  title: string;
  description?: string;
  order: number;
  status: string;
  assigned_to?: number;
  assigned_to_name?: string;
  assigned_to_data?: any;
  due_date?: string;
  completed_at?: string;
  depends_on?: number[];
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: number;
  title: string;
  description: string;
  workflow_type: string;
  priority: string;
  status: string;
  assigned_to?: number;
  assigned_to_name?: string;
  assigned_to_data?: any;
  created_by?: number;
  created_by_name?: string;
  created_by_data?: any;
  client?: number;
  client_name?: string;
  template?: number;
  template_name?: string;
  due_date?: string;
  start_date?: string;
  completed_date?: string;
  estimated_duration?: number;
  current_step: number;
  completion_rate: number;
  approval_required: boolean;
  approver?: number;
  approver_name?: string;
  approver_data?: any;
  approved_at?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
  steps?: WorkflowStep[];
  steps_count?: number;
}

export interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  workflow_type: string;
  template_data: any;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Workflow[];
}

export interface WorkflowStats {
  total: number;
  by_status: {
    not_started: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    on_hold: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  overdue: number;
}

export const workflowService = {
  /**
   * Get all workflows with optional filtering
   */
  async getWorkflows(params?: {
    search?: string;
    status?: string;
    priority?: string;
    workflow_type?: string;
    assigned_to?: number;
    client?: number;
    approval_required?: boolean;
    start_date?: string;
    end_date?: string;
    ordering?: string;
    page?: number;
  }): Promise<WorkflowListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.workflow_type) queryParams.append('workflow_type', params.workflow_type);
    if (params?.assigned_to) queryParams.append('assigned_to', params.assigned_to.toString());
    if (params?.client) queryParams.append('client', params.client.toString());
    if (params?.approval_required !== undefined) queryParams.append('approval_required', params.approval_required.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/workflows/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<WorkflowListResponse>(endpoint);
  },

  /**
   * Get a single workflow by ID
   */
  async getWorkflow(id: string | number): Promise<Workflow> {
    return apiClient.get<Workflow>(`/workflows/${id}/`);
  },

  /**
   * Get workflow statistics
   */
  async getStats(): Promise<{ success: boolean; data: WorkflowStats }> {
    return apiClient.get<{ success: boolean; data: WorkflowStats }>('/workflows/stats/');
  },




  /**
   * Create a new workflow
   */
  async createWorkflow(data: Partial<Workflow>): Promise<Workflow> {
    return apiClient.post<Workflow>('/workflows/', data);
  },

  /**
   * Update a workflow
   */
  async updateWorkflow(id: string | number, data: Partial<Workflow>): Promise<Workflow> {
    return apiClient.patch<Workflow>(`/workflows/${id}/`, data);
  },

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/workflows/${id}/`);
  },

  /**
   * Mark workflow as completed
   */
  async completeWorkflow(id: string | number): Promise<Workflow> {
    return apiClient.post<Workflow>(`/workflows/${id}/complete/`, {});
  },

  /**
   * Get workflow templates
   */
  async getTemplates(params?: {
    search?: string;
    workflow_type?: string;
    ordering?: string;
    page?: number;
  }): Promise<{ count: number; next: string | null; previous: string | null; results: WorkflowTemplate[] }> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.workflow_type) queryParams.append('workflow_type', params.workflow_type);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/workflow-templates/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{ count: number; next: string | null; previous: string | null; results: WorkflowTemplate[] }>(endpoint);
  },

  /**
   * Get workflow steps
   */
  async getSteps(workflowId: number): Promise<{ count: number; results: WorkflowStep[] }> {
    return apiClient.get<{ count: number; results: WorkflowStep[] }>(`/workflow-steps/?workflow=${workflowId}`);
  },

  /**
   * Update a workflow step
   */
  async updateStep(id: string | number, data: Partial<WorkflowStep>): Promise<WorkflowStep> {
    return apiClient.patch<WorkflowStep>(`/workflow-steps/${id}/`, data);
  },

  /**
   * Mark workflow step as completed
   */
  async completeStep(id: string | number): Promise<WorkflowStep> {
    return apiClient.post<WorkflowStep>(`/workflow-steps/${id}/complete/`, {});
  },

  /**
   * Get assignees (users) for workflows
   */
  async getAssignees(): Promise<any[]> {
    // This will fetch from the employees endpoint
    const response = await apiClient.get<{ count: number; results: any[] }>('/employees/');
    return response.results;
  },
};
