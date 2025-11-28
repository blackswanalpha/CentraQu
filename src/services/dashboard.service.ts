/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

import { apiClient } from '@/lib/api-client';

export interface DashboardMetrics {
  actual_revenue: number;
  completed_revenue: number;
  active_audits: number;
  overdue_invoices: number;
  revenue_trend: number;
  completed_revenue_trend: number;
  active_audits_trend: number;
  overdue_invoices_trend: number;
}

export interface FinancialMetrics {
  revenue: number;
  billed: number;
  collected: number;
  accounts_receivable: number;
  revenue_trend: number;
  billed_trend: number;
  collected_trend: number;
  ar_trend: number;
  ar_aging: {
    range: string;
    amount: number;
    percentage: number;
    critical?: boolean;
  }[];
}

export interface SalesMetrics {
  pipeline_stages: {
    stage: string;
    count: number;
    value: number;
    percentage: number;
  }[];
  top_opportunities: {
    client: string;
    value: number;
    stage: string;
    probability: number;
  }[];
  conversion_metrics: {
    lead_to_qualified: number;
    qualified_to_proposal: number;
    proposal_to_closed: number;
  };
}

export interface AuditorPerformance {
  name: string;
  audits_completed: number;
  utilization_rate: number;
  average_rating: number;
}

export interface AuditorMetrics {
  auditor_performance: AuditorPerformance[];
}

export interface ClientMetrics {
  total_clients: number;
  active_clients: number;
  at_risk_clients: number;
  satisfaction_score: number;
  health_distribution: {
    healthy: number;
    at_risk: number;
    critical: number;
  };
  top_clients: {
    name: string;
    revenue: number;
    satisfaction: number;
  }[];
}

export interface OperationsMetrics {
  capacity_utilization: number;
  avg_response_time: number;
  task_completion_rate: number;
  document_search_time: number;
  bottlenecks: {
    stage: string;
    volume: number;
    avg_time: string;
    is_bottleneck: boolean;
  }[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  user?: string;
  action_url?: string;
}

export interface GoalsMetrics {
  strategic_goals: {
    goal: string;
    progress: number;
    current: string;
    target: string;
    status: 'on-track' | 'at-risk' | 'behind';
  }[];
  kpis: {
    category: string;
    metrics: {
      name: string;
      value: string;
      target: string;
      variance: number;
    }[];
  }[];
}

export const dashboardService = {
  /**
   * Get main dashboard metrics
   */
  async getMainDashboard(): Promise<DashboardMetrics> {
    return apiClient.get<DashboardMetrics>('/dashboard/overview/');
  },

  /**
   * Get financial dashboard metrics
   */
  async getFinancialMetrics(): Promise<FinancialMetrics> {
    return apiClient.get<FinancialMetrics>('/dashboard/financial/');
  },

  /**
   * Get sales pipeline metrics
   */
  async getSalesMetrics(): Promise<SalesMetrics> {
    return apiClient.get<SalesMetrics>('/dashboard/sales/');
  },

  /**
   * Get auditor performance metrics
   */
  async getAuditorMetrics(): Promise<AuditorMetrics> {
    return apiClient.get<AuditorMetrics>('/dashboard/auditors/');
  },

  /**
   * Get client health metrics
   */
  async getClientMetrics(): Promise<ClientMetrics> {
    return apiClient.get<ClientMetrics>('/dashboard/clients/');
  },

  /**
   * Get operations efficiency metrics
   */
  async getOperationsMetrics(): Promise<OperationsMetrics> {
    return apiClient.get<OperationsMetrics>('/dashboard/operations/');
  },

  /**
   * Get activity feed
   */
  async getActivityFeed(limit: number = 20): Promise<ActivityLog[]> {
    return apiClient.get<ActivityLog[]>(`/dashboard/activity/?limit=${limit}`);
  },

  /**
   * Get goals and KPIs
   */
  async getGoalsMetrics(): Promise<GoalsMetrics> {
    return apiClient.get<GoalsMetrics>('/dashboard/goals/');
  },
};

