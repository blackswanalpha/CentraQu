/**
 * Billing Service
 * Handles billing-related API calls including timesheets and billing calculations
 */

import { apiClient } from '@/lib/api-client';

export interface TimeSheetEntry {
  id: number;
  certificate_no: string;
  task_name: string;
  task_name_display: string;
  employee: number;
  employee_name?: string;
  employee_email?: string;
  employee_data?: any;
  date: string;
  notes: string;
  billable_status: 'BILLABLE' | 'NON_BILLABLE' | 'INTERNAL';
  billable_status_display: string;
  billed_status: 'UNBILLED' | 'BILLED' | 'INVOICED' | 'PAID';
  billed_status_display: string;
  amount?: number;
  currency: string;
  regular_hours: number;
  overtime_hours: number;
  break_hours: number;
  total_hours: number;
  billable_hours: number;
  calculated_amount: number;
  clock_in?: string;
  clock_out?: string;
  work_description: string;
  project_code: string;
  client?: number;
  client_name?: string;
  client_data?: any;
  approved: boolean;
  approved_by?: number;
  approved_by_name?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  created_by_name?: string;
}

export interface BillingItem {
  id: string;
  client_name: string;
  project_code: string;
  employee_name: string;
  description: string;
  task_title?: string;
  date: string;
  regular_hours: number;
  overtime_hours: number;
  total_hours: number;
  hourly_rate: number;
  total_amount: number;
  status: 'billable' | 'billed' | 'non_billable';
  approved: boolean;
  invoice_id?: number;
}

export interface BillingListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BillingItem[];
}

export interface BillingStats {
  total_hours: number;
  billable_hours: number;
  billed_hours: number;
  unbilled_hours: number;
  total_revenue: number;
  pending_revenue: number;
  by_client: {
    [client: string]: {
      hours: number;
      amount: number;
    };
  };
  by_employee: {
    [employee: string]: {
      hours: number;
      amount: number;
    };
  };
}

export const billingService = {
  /**
   * Get timesheets with optional filtering
   */
  async getTimeSheets(params?: {
    employee?: number;
    date_from?: string;
    date_to?: string;
    approved?: boolean;
    project_code?: string;
    ordering?: string;
    page?: number;
  }): Promise<{ count: number; next: string | null; previous: string | null; results: TimeSheetEntry[] }> {
    const queryParams = new URLSearchParams();

    if (params?.employee) queryParams.append('employee', params.employee.toString());
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    if (params?.approved !== undefined) queryParams.append('approved', params.approved.toString());
    if (params?.project_code) queryParams.append('project_code', params.project_code);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/timesheets/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{ count: number; next: string | null; previous: string | null; results: TimeSheetEntry[] }>(endpoint);
  },

  /**
   * Get billing data (calculated from timesheets and tasks)
   */
  async getBillingData(params?: {
    client?: number;
    employee?: number;
    date_from?: string;
    date_to?: string;
    status?: 'billable' | 'billed' | 'non_billable';
    approved_only?: boolean;
    ordering?: string;
    page?: number;
  }): Promise<BillingListResponse> {
    try {
      const timesheetParams: any = {};
      if (params?.employee) timesheetParams.employee = params.employee;
      if (params?.date_from) timesheetParams.date_from = params.date_from;
      if (params?.date_to) timesheetParams.date_to = params.date_to;
      if (params?.approved_only) timesheetParams.approved = true;
      if (params?.client) timesheetParams.client = params.client;
      
      // Map status to backend format
      if (params?.status) {
        if (params.status === 'billable') timesheetParams.billable_status = 'BILLABLE';
        else if (params.status === 'non_billable') timesheetParams.billable_status = 'NON_BILLABLE';
        else if (params.status === 'billed') timesheetParams.billed_status = 'BILLED';
      }
      
      timesheetParams.ordering = params?.ordering || '-date';

      const timesheets = await this.getTimeSheets(timesheetParams);

      // Convert timesheets to billing items format
      const billingItems: BillingItem[] = timesheets.results.map((timesheet) => {
        // Map status from backend format to frontend format
        let status: 'billable' | 'billed' | 'non_billable' = 'non_billable';
        if (timesheet.billed_status === 'BILLED' || timesheet.billed_status === 'INVOICED' || timesheet.billed_status === 'PAID') {
          status = 'billed';
        } else if (timesheet.billable_status === 'BILLABLE') {
          status = 'billable';
        }

        return {
          id: `timesheet-${timesheet.id}`,
          client_name: timesheet.client_name || 'Unknown Client',
          project_code: timesheet.project_code || timesheet.certificate_no || 'N/A',
          employee_name: timesheet.employee_name || 'Unknown Employee',
          description: timesheet.work_description || timesheet.task_name_display || timesheet.notes || 'No description',
          task_title: timesheet.task_name_display,
          date: timesheet.date,
          regular_hours: timesheet.regular_hours,
          overtime_hours: timesheet.overtime_hours,
          total_hours: timesheet.total_hours,
          hourly_rate: 75, // This could come from employee settings or timesheet calculation
          total_amount: timesheet.calculated_amount || timesheet.amount || 0,
          status: status,
          approved: timesheet.approved,
          invoice_id: timesheet.billed_status === 'INVOICED' || timesheet.billed_status === 'PAID' ? 1 : undefined,
        };
      });

      return {
        count: timesheets.count,
        next: timesheets.next,
        previous: timesheets.previous,
        results: billingItems,
      };
    } catch (error) {
      console.error('Error getting billing data:', error);
      throw error;
    }
  },

  /**
   * Get billing statistics
   */
  async getBillingStats(params?: {
    date_from?: string;
    date_to?: string;
    client?: number;
  }): Promise<BillingStats> {
    try {
      // Use the backend stats endpoint if available
      const statsParams = new URLSearchParams();
      if (params?.date_from) statsParams.append('date_from', params.date_from);
      if (params?.date_to) statsParams.append('date_to', params.date_to);
      if (params?.client) statsParams.append('client', params.client.toString());

      try {
        // Try to get stats from backend API
        const statsEndpoint = `/timesheets/stats/${statsParams.toString() ? `?${statsParams.toString()}` : ''}`;
        const backendStats = await apiClient.get<any>(statsEndpoint);
        
        return {
          total_hours: backendStats.total_hours || 0,
          billable_hours: backendStats.billable_hours || 0,
          billed_hours: backendStats.billable_hours || 0, // Backend doesn't separate this yet
          unbilled_hours: backendStats.billable_hours || 0,
          total_revenue: backendStats.total_amount || 0,
          pending_revenue: backendStats.total_amount || 0,
          by_client: {},
          by_employee: {},
        };
      } catch (apiError) {
        // Fallback to calculating from billing data
        const billingData = await this.getBillingData({
          date_from: params?.date_from,
          date_to: params?.date_to,
          client: params?.client,
        });

        const stats: BillingStats = {
          total_hours: 0,
          billable_hours: 0,
          billed_hours: 0,
          unbilled_hours: 0,
          total_revenue: 0,
          pending_revenue: 0,
          by_client: {},
          by_employee: {},
        };

        billingData.results.forEach(item => {
          stats.total_hours += item.total_hours;
          stats.total_revenue += item.total_amount;

          if (item.status === 'billable') {
            stats.billable_hours += item.total_hours;
            stats.pending_revenue += item.total_amount;
          } else if (item.status === 'billed') {
            stats.billed_hours += item.total_hours;
          }

          // By client stats
          if (!stats.by_client[item.client_name]) {
            stats.by_client[item.client_name] = { hours: 0, amount: 0 };
          }
          stats.by_client[item.client_name].hours += item.total_hours;
          stats.by_client[item.client_name].amount += item.total_amount;

          // By employee stats
          if (!stats.by_employee[item.employee_name]) {
            stats.by_employee[item.employee_name] = { hours: 0, amount: 0 };
          }
          stats.by_employee[item.employee_name].hours += item.total_hours;
          stats.by_employee[item.employee_name].amount += item.total_amount;
        });

        stats.unbilled_hours = stats.billable_hours;
        return stats;
      }
    } catch (error) {
      console.error('Error calculating billing stats:', error);
      throw error;
    }
  },

  /**
   * Create a new timesheet entry
   */
  async createTimeSheet(data: Partial<TimeSheetEntry>): Promise<TimeSheetEntry> {
    return apiClient.post<TimeSheetEntry>('/timesheets/', data);
  },

  /**
   * Update a timesheet entry
   */
  async updateTimeSheet(id: string | number, data: Partial<TimeSheetEntry>): Promise<TimeSheetEntry> {
    return apiClient.patch<TimeSheetEntry>(`/timesheets/${id}/`, data);
  },

  /**
   * Approve timesheet entries
   */
  async approveTimeSheets(ids: number[]): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>('/timesheets/bulk_approve/', { ids });
  },

  /**
   * Generate invoice from billing items
   */
  async generateInvoice(data: {
    client_id: number;
    billing_item_ids: string[];
    invoice_details?: {
      due_date?: string;
      notes?: string;
      payment_terms?: string;
    };
  }): Promise<{ success: boolean; invoice_id: number; message: string }> {
    return apiClient.post<{ success: boolean; invoice_id: number; message: string }>('/invoices/generate/', data);
  },
};