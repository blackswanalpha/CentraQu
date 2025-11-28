/**
 * Payroll Service
 * Handles all payroll-related API calls
 */

import { apiClient } from '@/lib/api-client';

export interface PayrollEarning {
  id?: number;
  payroll?: number;
  earning_type: string;
  description: string;
  amount: number;
  created_at?: string;
}

export interface PayrollDeduction {
  id?: number;
  payroll?: number;
  deduction_type: string;
  description: string;
  amount: number;
  created_at?: string;
}

export interface Payroll {
  id?: number;
  employee: number;
  employee_name?: string;
  employee_id_display?: string;
  employee_data?: any;
  department?: string;
  pay_period: string;
  start_date: string;
  end_date: string;
  base_salary: number;
  gross_pay: number;
  total_deductions: number;
  net_pay: number;
  currency?: string;
  status: string;
  approved_by?: number;
  approved_by_name?: string;
  approved_by_data?: any;
  approved_date?: string;
  payment_method: string;
  payment_date?: string;
  processed_date?: string;
  payment_reference?: string;
  notes?: string;
  created_by?: number;
  created_by_name?: string;
  created_by_data?: any;
  created_at?: string;
  updated_at?: string;
  earnings?: PayrollEarning[];
  deductions?: PayrollDeduction[];
}

export interface PayrollListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payroll[];
}

export interface PayrollStats {
  total_payroll: number;
  pending_payroll: number;
  completed_payroll: number;
  average_salary: number;
  total_records: number;
  draft_count: number;
  pending_count: number;
  approved_count: number;
  paid_count: number;
}

export const payrollService = {
  /**
   * Get all payroll records with optional filtering
   */
  async getPayrolls(params?: {
    search?: string;
    status?: string;
    pay_period?: string;
    employee?: number;
    payment_method?: string;
    ordering?: string;
    page?: number;
  }): Promise<PayrollListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.pay_period) queryParams.append('pay_period', params.pay_period);
    if (params?.employee) queryParams.append('employee', params.employee.toString());
    if (params?.payment_method) queryParams.append('payment_method', params.payment_method);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    return apiClient.get(`/payroll/?${queryParams.toString()}`);
  },

  /**
   * Get a single payroll record by ID
   */
  async getPayroll(id: number): Promise<Payroll> {
    return apiClient.get(`/payroll/${id}/`);
  },

  /**
   * Create a new payroll record
   */
  async createPayroll(data: Partial<Payroll>): Promise<Payroll> {
    return apiClient.post('/payroll/', data);
  },

  /**
   * Update an existing payroll record
   */
  async updatePayroll(id: number, data: Partial<Payroll>): Promise<Payroll> {
    return apiClient.put(`/payroll/${id}/`, data);
  },

  /**
   * Delete a payroll record
   */
  async deletePayroll(id: number): Promise<void> {
    return apiClient.delete(`/payroll/${id}/`);
  },

  /**
   * Get payroll statistics
   */
  async getStats(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<PayrollStats> {
    const queryParams = new URLSearchParams();

    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    return apiClient.get(`/payroll/stats/?${queryParams.toString()}`);
  },

  /**
   * Approve a payroll record
   */
  async approvePayroll(id: number): Promise<Payroll> {
    return apiClient.post(`/payroll/${id}/approve/`, {});
  },

  /**
   * Process payment for a payroll record
   */
  async processPayment(id: number): Promise<Payroll> {
    return apiClient.post(`/payroll/${id}/process_payment/`, {});
  },

  /**
   * Create a payroll earning
   */
  async createEarning(data: PayrollEarning): Promise<PayrollEarning> {
    return apiClient.post('/payroll-earnings/', data);
  },

  /**
   * Update a payroll earning
   */
  async updateEarning(id: number, data: Partial<PayrollEarning>): Promise<PayrollEarning> {
    return apiClient.put(`/payroll-earnings/${id}/`, data);
  },

  /**
   * Delete a payroll earning
   */
  async deleteEarning(id: number): Promise<void> {
    return apiClient.delete(`/payroll-earnings/${id}/`);
  },

  /**
   * Create a payroll deduction
   */
  async createDeduction(data: PayrollDeduction): Promise<PayrollDeduction> {
    return apiClient.post('/payroll-deductions/', data);
  },

  /**
   * Update a payroll deduction
   */
  async updateDeduction(id: number, data: Partial<PayrollDeduction>): Promise<PayrollDeduction> {
    return apiClient.put(`/payroll-deductions/${id}/`, data);
  },

  /**
   * Delete a payroll deduction
   */
  async deleteDeduction(id: number): Promise<void> {
    return apiClient.delete(`/payroll-deductions/${id}/`);
  },
};

