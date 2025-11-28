/**
 * Job Pipeline Service
 * Handles all job pipeline-related API calls
 */

import { apiClient } from '@/lib/api-client';

export interface JobPipeline {
  id: number;
  pipeline_id: string;
  client_name: string;
  service_description: string;
  estimated_value: number;
  currency: string;
  current_stage: 'LEAD' | 'OPPORTUNITY' | 'CONTRACT' | 'AUDIT_SCHEDULED' | 'AUDIT_IN_PROGRESS' | 'AUDIT_COMPLETED' | 'CERTIFICATE_ISSUED' | 'SURVEILLANCE_DUE' | 'CLOSED';
  status: 'ACTIVE' | 'ON_HOLD' | 'CANCELLED' | 'COMPLETED';
  stage_progress_percentage: number;
  days_in_current_stage: number;

  // Timeline dates
  lead_created_date?: string;
  opportunity_created_date?: string;
  contract_signed_date?: string;
  audit_scheduled_date?: string;
  audit_completed_date?: string;
  certificate_issued_date?: string;

  // Next milestones
  next_milestone?: string;
  next_milestone_date?: string;

  // Assignment
  owner?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    full_name?: string;
  };

  // Counts
  audits_count: number;
  milestones_count: number;
  overdue_milestones_count: number;

  created_at: string;
  updated_at: string;
}

export interface JobPipelineDetail extends JobPipeline {
  lead?: {
    id: number;
    company_name: string;
    contact_person: string;
    email: string;
    status: string;
    estimated_value: number;
    currency: string;
  };

  opportunity?: {
    id: number;
    title: string;
    client_name: string;
    status: string;
    estimated_value: number;
    currency: string;
    probability: number;
  };

  contract?: {
    id: number;
    contract_number: string;
    client_organization: string;
    status: string;
    contract_value: number;
    currency: string;
    start_date: string;
    end_date: string;
  };

  audits: Array<{
    id: number;
    audit_number: string;
    title: string;
    audit_type: string;
    status: string;
    planned_start_date: string;
    planned_end_date: string;
    lead_auditor_name: string;
  }>;

  milestones: PipelineMilestone[];
  recent_transitions: PipelineStageTransition[];

  // Formatted references
  opportunity_ref?: string;
  contract_ref?: string;
  audit_refs?: string[];
}

export interface PipelineMilestone {
  id: number;
  milestone_type: string;
  title: string;
  description: string;
  due_date: string;
  completed_date?: string;
  is_completed: boolean;
  is_critical: boolean;
  is_overdue: boolean;
  days_remaining: number;
  assigned_to?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    full_name?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PipelineStageTransition {
  id: number;
  pipeline: number;
  pipeline_name: string;
  from_stage: string;
  to_stage: string;
  transitioned_at: string;
  transitioned_by?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    full_name?: string;
  };
  notes: string;
}

export interface PipelineStats {
  total_pipelines: number;
  total_value: number;
  stage_distribution: Array<{
    current_stage: string;
    count: number;
    total_value: number;
  }>;
  status_distribution: Array<{
    status: string;
    count: number;
  }>;
  average_stage_time: number;
  monthly_trend: Array<{
    month: string;
    count: number;
    total_value: number;
  }>;
  top_owners: Array<{
    owner__id: number;
    owner__first_name: string;
    owner__last_name: string;
    pipeline_count: number;
    total_value: number;
  }>;
}

export interface PipelineDashboard {
  quick_stats: {
    active: number;
    on_hold: number;
    completed: number;
    total: number;
  };
  stage_breakdown: Array<{
    current_stage: string;
    count: number;
  }>;
  upcoming_milestones: PipelineMilestone[];
  overdue_count: number;
  recent_activity: PipelineStageTransition[];
}

export interface PipelineTimeline {
  pipeline_id: string;
  client_name: string;
  current_stage: string;
  timeline: Array<{
    type: 'transition' | 'milestone';
    date: string;
    title: string;
    description: string;
    user?: string;
    completed?: boolean;
    overdue?: boolean;
    data: any;
  }>;
}

export interface JobPipelineListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobPipeline[];
}

export const jobPipelineService = {
  /**
   * Get all job pipelines with optional filtering
   */
  async getPipelines(params?: {
    stage?: string;
    status?: string;
    owner?: string | number;
    client?: string;
    search?: string;
    page?: number;
  }): Promise<JobPipelineListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.stage) queryParams.append('stage', params.stage);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.owner) queryParams.append('owner', params.owner.toString());
    if (params?.client) queryParams.append('client', params.client);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/job-pipeline/pipelines/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<JobPipelineListResponse>(endpoint);
  },

  /**
   * Get a single job pipeline by ID
   */
  async getPipeline(id: string | number): Promise<JobPipelineDetail> {
    return apiClient.get<JobPipelineDetail>(`/job-pipeline/pipelines/${id}/`);
  },

  /**
   * Create a new job pipeline
   */
  async createPipeline(data: Partial<JobPipeline>): Promise<JobPipeline> {
    return apiClient.post<JobPipeline>('/job-pipeline/pipelines/', data);
  },

  /**
   * Update an existing job pipeline
   */
  async updatePipeline(id: string | number, data: Partial<JobPipeline>): Promise<JobPipeline> {
    return apiClient.put<JobPipeline>(`/job-pipeline/pipelines/${id}/`, data);
  },

  /**
   * Delete a job pipeline
   */
  async deletePipeline(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/job-pipeline/pipelines/${id}/`);
  },

  /**
   * Advance pipeline to next stage
   */
  async advanceStage(id: string | number, stage: string): Promise<JobPipeline> {
    return apiClient.post<JobPipeline>(`/job-pipeline/pipelines/${id}/advance_stage/`, { stage });
  },

  /**
   * Link an object (lead, opportunity, contract, audit) to pipeline
   */
  async linkObject(id: string | number, objectType: 'lead' | 'opportunity' | 'contract' | 'audit', objectId: string | number): Promise<JobPipeline> {
    return apiClient.post<JobPipeline>(`/job-pipeline/pipelines/${id}/link_object/`, {
      object_type: objectType,
      object_id: objectId
    });
  },

  /**
   * Get pipeline statistics
   */
  async getStats(): Promise<PipelineStats> {
    return apiClient.get<PipelineStats>('/job-pipeline/pipelines/stats/');
  },

  /**
   * Get dashboard data
   */
  async getDashboard(): Promise<PipelineDashboard> {
    return apiClient.get<PipelineDashboard>('/job-pipeline/pipelines/dashboard/');
  },

  /**
   * Get pipeline timeline
   */
  async getTimeline(id: string | number): Promise<PipelineTimeline> {
    return apiClient.get<PipelineTimeline>(`/job-pipeline/pipelines/${id}/timeline/`);
  },

  /**
   * Get milestones with optional filtering
   */
  async getMilestones(params?: {
    pipeline?: string | number;
    type?: string;
    completed?: boolean;
    overdue?: boolean;
    assigned_to?: string | number;
  }): Promise<{ results: PipelineMilestone[] }> {
    const queryParams = new URLSearchParams();

    if (params?.pipeline) queryParams.append('pipeline', params.pipeline.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.completed !== undefined) queryParams.append('completed', params.completed.toString());
    if (params?.overdue) queryParams.append('overdue', params.overdue.toString());
    if (params?.assigned_to) queryParams.append('assigned_to', params.assigned_to.toString());

    const endpoint = `/job-pipeline/milestones/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{ results: PipelineMilestone[] }>(endpoint);
  },

  /**
   * Create a new milestone
   */
  async createMilestone(data: Partial<PipelineMilestone> & { pipeline: number }): Promise<PipelineMilestone> {
    return apiClient.post<PipelineMilestone>('/job-pipeline/milestones/', data);
  },

  /**
   * Update a milestone
   */
  async updateMilestone(id: string | number, data: Partial<PipelineMilestone>): Promise<PipelineMilestone> {
    return apiClient.put<PipelineMilestone>(`/job-pipeline/milestones/${id}/`, data);
  },

  /**
   * Mark milestone as completed
   */
  async markMilestoneCompleted(id: string | number): Promise<PipelineMilestone> {
    return apiClient.post<PipelineMilestone>(`/job-pipeline/milestones/${id}/mark_completed/`);
  },

  /**
   * Delete a milestone
   */
  async deleteMilestone(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/job-pipeline/milestones/${id}/`);
  },

  /**
   * Get stage transitions with optional filtering
   */
  async getTransitions(params?: {
    pipeline?: string | number;
  }): Promise<{ results: PipelineStageTransition[] }> {
    const queryParams = new URLSearchParams();

    if (params?.pipeline) queryParams.append('pipeline', params.pipeline.toString());

    const endpoint = `/job-pipeline/transitions/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{ results: PipelineStageTransition[] }>(endpoint);
  },

  /**
   * Create pipeline from lead
   */
  async createFromLead(leadId: number, ownerId?: number, serviceDescription?: string): Promise<JobPipeline> {
    return apiClient.post<JobPipeline>('/job-pipeline/pipelines/create_from_lead/', {
      lead_id: leadId,
      owner_id: ownerId,
      service_description: serviceDescription
    });
  },

  /**
   * Create pipeline from opportunity
   */
  async createFromOpportunity(opportunityId: number, ownerId?: number): Promise<JobPipeline> {
    return apiClient.post<JobPipeline>('/job-pipeline/pipelines/create_from_opportunity/', {
      opportunity_id: opportunityId,
      owner_id: ownerId
    });
  },
};