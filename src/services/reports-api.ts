import { apiClient } from '@/lib/api-client';

// Types for report responses
export interface AuditSummaryData {
  summary: {
    total_audits: number;
    completed_audits: number;
    in_progress_audits: number;
    completion_rate: number;
    avg_duration: number;
  };
  standards_distribution: Array<{
    standard: string;
    count: number;
    percentage: number;
  }>;
  audit_types: Array<{
    type: string;
    count: number;
  }>;
  monthly_trends: Array<{
    month: string;
    count: number;
  }>;
}

export interface ComplianceAnalysisData {
  summary: {
    overall_compliance_rate: number;
    minor_findings: number;
    major_findings: number;
    total_audits: number;
  };
  compliance_by_standard: Array<{
    standard: string;
    compliance_rate: number;
    total_findings: number;
  }>;
}

export interface AuditorPerformanceData {
  auditor_performance: Array<{
    name: string;
    audits_completed: number;
    avg_duration: number;
    quality_score: number;
    client_satisfaction: number;
    on_time_rate: number;
  }>;
}

export interface RevenueSummaryData {
  summary: {
    total_revenue: number;
    avg_revenue_per_audit: number;
    collection_rate: number;
    outstanding_amount: number;
  };
  monthly_trends: Array<{
    month: string;
    revenue: number;
  }>;
  top_clients: Array<{
    client_name: string;
    total_revenue: number;
    audit_count: number;
    avg_per_audit: number;
    payment_status: 'paid' | 'partial' | 'pending';
  }>;
}

export interface PaymentAnalysisData {
  summary: {
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    overdue_amount: number;
    collection_rate: number;
  };
  payment_timeline: {
    on_time_rate: number;
    total_invoices: number;
  };
  outstanding_invoices: Array<{
    invoice_number: string;
    client_name: string;
    amount: number;
    due_date: string;
    days_overdue: number;
    status: string;
  }>;
}

export interface ClientProfitabilityData {
  client_profitability: Array<{
    client_name: string;
    total_revenue: number;
    estimated_costs: number;
    profit: number;
    margin: number;
  }>;
}

export interface RevenueForecastData {
  forecast: {
    q1_2026_projection: number;
    confidence_level: number;
    confirmed_pipeline: number;
    pipeline_value: number;
  };
  monthly_projections: Array<{
    month: string;
    projected: number;
    confidence: number;
  }>;
}

// Report filters interface
export interface ReportFilters {
  dateRange?: '1M' | '3M' | '6M' | '1Y' | 'custom';
  standard?: string;
  status?: string;
  client?: string;
}

export class ReportsAPI {
  /**
   * Get audit reports data
   */
  static async getAuditReports(
    type: 'audit-summary' | 'compliance-analysis' | 'auditor-performance' | 'quality-metrics' | 'findings-analysis' | 'geographic-distribution',
    filters: ReportFilters = {}
  ): Promise<AuditSummaryData | ComplianceAnalysisData | AuditorPerformanceData> {
    const params = {
      type,
      ...filters,
    };

    return apiClient.get<AuditSummaryData | ComplianceAnalysisData | AuditorPerformanceData>(
      '/reports/audit-reports/',
      params
    );
  }

  /**
   * Get financial reports data
   */
  static async getFinancialReports(
    type: 'revenue-summary' | 'payment-analysis' | 'client-profitability' | 'revenue-forecast' | 'cost-analysis' | 'invoice-tracking',
    filters: ReportFilters = {}
  ): Promise<RevenueSummaryData | PaymentAnalysisData | ClientProfitabilityData | RevenueForecastData> {
    const params = {
      type,
      ...filters,
    };

    return apiClient.get<RevenueSummaryData | PaymentAnalysisData | ClientProfitabilityData | RevenueForecastData>(
      '/reports/financial-reports/',
      params
    );
  }

  /**
   * Get quick audit summary for dashboards
   */
  static async getAuditSummary() {
    return apiClient.get<{
      total_audits: number;
      completed: number;
      in_progress: number;
      completion_rate: number;
    }>('/reports/audit-summary/');
  }

  /**
   * Get quick financial summary for dashboards
   */
  static async getFinancialSummary() {
    return apiClient.get<{
      monthly_revenue: number;
      paid_amount: number;
      outstanding_amount: number;
      collection_rate: number;
    }>('/reports/financial-summary/');
  }

  /**
   * Generate and download report
   */
  static async generateReport(templateId: number, parameters: Record<string, unknown>, format: 'PDF' | 'Excel' | 'CSV' = 'PDF') {
    const response = await apiClient.post('/reports/generated/', {
      template: templateId,
      parameters,
      file_format: format,
      status: 'GENERATING'
    });

    return response;
  }

  /**
   * Get list of available report templates
   */
  static async getReportTemplates() {
    return apiClient.get('/reports/templates/');
  }

  /**
   * Get list of generated reports
   */
  static async getGeneratedReports() {
    return apiClient.get('/reports/generated/');
  }

  /**
   * Get specific generated report
   */
  static async getGeneratedReport(reportId: number) {
    return apiClient.get(`/reports/generated/${reportId}/`);
  }

  /**
   * Delete generated report
   */
  static async deleteGeneratedReport(reportId: number) {
    return apiClient.delete(`/reports/generated/${reportId}/`);
  }

  /**
   * Share report with user
   */
  static async shareReport(reportId: number, userId: number, permission: 'VIEW' | 'DOWNLOAD' = 'VIEW') {
    return apiClient.post('/reports/shares/', {
      report: reportId,
      shared_with: userId,
      permission
    });
  }
}

export default ReportsAPI;