import { apiClient } from '@/lib/api-client';

export interface DashboardOverviewData {
    active_projects_count: number;
    total_revenue: number;
    utilization_rate: number;
    revenue_this_qtr: number;
    project_health: {
        on_track: { count: number; value: number; percentage: number };
        at_risk: { count: number; value: number; percentage: number };
        behind: { count: number; value: number; percentage: number };
    };
    resource_allocation: {
        billable: number;
        admin: number;
        training: number;
        bench: number;
    };
    upcoming_milestones: any[];
    team_workload: any[];
    revenue_trend: any[];
    client_portfolio: any;
}

export interface ConsultantPerformanceData {
    consultants: any[];
    kpis: {
        avg_utilization: number;
        total_billable_hours: number;
        avg_client_rating: number;
        revenue_per_head: number;
    };
    skills_capacity: any[];
    client_feedback: any[];
}

export interface ClientHealthData {
    kpis: {
        active_clients: number;
        healthy_accounts: number;
        at_risk_accounts: number;
        lifetime_value: number;
        pipeline_value: number;
    };
    at_risk_clients: any[];
    client_matrix: any[];
    activity_log: any[];
}

export interface DeliveryExcellenceData {
    kpis: {
        on_time_delivery: number;
        on_budget: number;
        client_satisfaction: number;
        quality_score: number;
    };
    projects: any[];
    risks: any[];
    client_satisfaction: any[];
    quality_scores: any[];
}

export const consultingService = {
    getDashboardOverview: async (): Promise<DashboardOverviewData> => {
        return apiClient.get('/consulting/dashboard/');
    },

    getConsultantPerformance: async (): Promise<ConsultantPerformanceData> => {
        return apiClient.get('/consulting/dashboard/consultants/');
    },

    getClientHealth: async (): Promise<ClientHealthData> => {
        return apiClient.get('/consulting/dashboard/clients/');
    },

    getDeliveryExcellence: async (): Promise<DeliveryExcellenceData> => {
        return apiClient.get('/consulting/dashboard/delivery/');
    },
};
