/**
 * Contract Service
 * Handles all contract-related API calls to backend_centra
 */

import { apiClient } from '@/lib/api-client';

export interface Contract {
  id: number;
  proposal?: number;
  proposal_number?: string;
  opportunity?: number;
  opportunity_title?: string;
  client_name: string;
  client_id?: number;
  contract_number: string;
  contract_type: string;
  title: string;
  description: string;
  agreement_date?: string;
  contract_template_id?: number;

  // Client Contact Info
  client_organization?: string;
  client_address?: string;
  client_contact_person?: string;
  client_telephone?: string;
  client_email?: string;
  client_secondary_email?: string;
  client_website?: string;
  site_covered?: string;

  // Certification Body Info
  cb_name?: string;
  cb_address?: string;
  cb_role?: string;

  // Scope & Standards
  iso_standards?: string[];
  scope_of_work?: string;
  scope_of_certification?: string;
  objectives?: string;

  // Audit Process
  stage_1_audit_days?: number;
  stage_1_audit_description?: string;
  stage_1_remote_allowed?: boolean;
  stage_2_audit_days?: number;
  stage_2_audit_description?: string;
  surveillance_audit_frequency?: string;
  surveillance_audit_description?: string;
  recertification_audit_timing?: string;
  recertification_audit_description?: string;

  // Timeline
  start_date: string;
  end_date: string;
  duration_months: number;
  certification_cycle_years?: number;
  stage_1_stage_2_max_gap_days?: number;
  nc_closure_max_days?: number;
  certificate_issue_days?: number;
  certificate_validity_years?: number;
  certificate_validity_extension_allowed?: boolean;

  // Fees
  fee_per_standard_year_1?: string | number;
  fee_per_standard_year_2?: string | number;
  fee_per_standard_year_3?: string | number;
  recertification_fee_tbd?: boolean;
  recertification_fee?: number;
  additional_fees_description?: string;

  // Total Financials
  contract_value: string | number;
  currency: string;
  payment_schedule?: string;

  // Policies
  cancellation_notice_days?: number;
  cancellation_fee_applies?: boolean;
  confidentiality_clause?: string;
  data_protection_compliance?: string;
  client_responsibilities?: string[];

  // Status & Renewal
  status: string;
  termination_notice_days?: number;
  termination_fee_waiver?: boolean;
  auto_renewal: boolean;
  renewal_notice_days: number;

  // Legal
  entire_agreement_clause?: string;

  // Signatures
  signed_by_client_name?: string;
  signed_by_client_position?: string;
  client_signed_date?: string;
  signed_by_company?: number;
  signed_by_company_name?: string;
  signed_by_company_position?: string;
  company_signed_date?: string;

  // Computed
  total_standards_count?: number;
  total_year_1_fee?: string | number;
  total_year_2_fee?: string | number;
  total_year_3_fee?: string | number;

  created_at: string;
  updated_at: string;
}

export interface ContractStats {
  active: number;
  pending: number;
  expiring: number;
  expired: number;
  total_value: number;
  total_count: number;
}

export interface ContractListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contract[];
}

export interface ContractStatsResponse {
  success: boolean;
  data: ContractStats;
}

export interface ContractTemplate {
  id: number;
  template_id: string;
  name: string;
  description: string;
  template_type: string;
  template_category?: 'CONTRACT_AGREEMENT_DEFAULT' | 'RENEWAL_CONTRACT_AGREEMENT_DEFAULT' | 'CUSTOM';
  template_data: any;
  status: string;
  is_active: boolean;
  is_default: boolean;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratedContract {
  contract_id: number;
  contract_number: string;
  title: string;
  status: string;
  client_organization: string;
  contract_value: number;
}

export const contractService = {
  /**
   * Get all contracts with optional filtering
   */
  async getContracts(params?: {
    search?: string;
    status?: string;
    contract_type?: string;
    client?: string;
    opportunity?: number;
    ordering?: string;
    page?: number;
  }): Promise<ContractListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.contract_type) queryParams.append('contract_type', params.contract_type);
    if (params?.client) queryParams.append('client', params.client);
    if (params?.opportunity) queryParams.append('opportunity', params.opportunity.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/contracts/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ContractListResponse>(endpoint);
  },

  /**
   * Get contract statistics
   */
  async getStats(): Promise<ContractStatsResponse> {
    return apiClient.get<ContractStatsResponse>('/contracts/stats/');
  },

  /**
   * Get a single contract by ID
   */
  async getContract(id: string | number): Promise<Contract> {
    return apiClient.get<Contract>(`/contracts/${id}/`);
  },

  /**
   * Create a new contract
   */
  async createContract(data: Partial<Contract>): Promise<Contract> {
    return apiClient.post<Contract>('/contracts/', data);
  },

  /**
   * Update an existing contract
   */
  async updateContract(id: string | number, data: Partial<Contract>): Promise<Contract> {
    return apiClient.put<Contract>(`/contracts/${id}/`, data);
  },

  /**
   * Partially update a contract
   */
  async patchContract(id: string | number, data: Partial<Contract>): Promise<Contract> {
    return apiClient.patch<Contract>(`/contracts/${id}/`, data);
  },

  /**
   * Delete a contract
   */
  async deleteContract(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/contracts/${id}/`);
  },

  /**
   * Generate a contract from an opportunity
   */
  async generateFromOpportunity(opportunityId: number, data: Partial<Contract>): Promise<Contract> {
    return apiClient.post<Contract>(`/opportunities/${opportunityId}/generate_from_opportunity/`, data);
  },

  /**
   * Download contract PDF
   */
  async downloadContractPdf(id: string | number): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts/${id}/download_pdf/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download contract PDF');
    }

    return response.blob();
  },

  /**
   * Send contract via email
   */
  async sendContractEmail(
    id: string | number,
    emailData: {
      recipient_email?: string;
      recipient_name?: string;
      subject?: string;
      message?: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/contracts/${id}/send_email/`,
      emailData
    );
  },

  // Contract Template Methods

  /**
   * Get all contract templates
   */
  async getContractTemplates(params?: {
    template_type?: string;
    is_active?: boolean;
  }): Promise<{ success: boolean; data: ContractTemplate[] }> {
    const queryParams = new URLSearchParams();

    if (params?.template_type) queryParams.append('template_type', params.template_type);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

    const endpoint = `/contract-templates/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{ success: boolean; data: ContractTemplate[] }>(endpoint);
  },

  /**
   * Get a specific contract template
   */
  async getContractTemplate(templateId: string): Promise<{ success: boolean; data: ContractTemplate }> {
    return apiClient.get<{ success: boolean; data: ContractTemplate }>(`/contract-templates/${templateId}/`);
  },

  /**
   * Create a new contract template from template builder data
   */
  async createContractTemplate(templateData: any): Promise<{
    success: boolean;
    message: string;
    data: Partial<ContractTemplate>
  }> {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: Partial<ContractTemplate>
    }>('/contract-templates/', {
      template_data: templateData
    });
  },

  /**
   * Update an existing contract template
   */
  async updateContractTemplate(templateId: string, templateData: any): Promise<{
    success: boolean;
    message: string;
    data: Partial<ContractTemplate>
  }> {
    return apiClient.put<{
      success: boolean;
      message: string;
      data: Partial<ContractTemplate>
    }>(`/contract-templates/${templateId}/`, {
      template_data: templateData
    });
  },

  /**
   * Generate a contract from a template
   */
  async generateContractFromTemplate(
    templateId: string,
    data: {
      opportunity_id?: number;
      contract_data?: any;
    }
  ): Promise<{
    success: boolean;
    message: string;
    data: GeneratedContract
  }> {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: GeneratedContract
    }>(`/contract-templates/${templateId}/generate_contract/`, data);
  },

  /**
   * Get the default template for a specific type
   */
  async getDefaultContractTemplate(templateType: string): Promise<{
    success: boolean;
    data: ContractTemplate
  }> {
    return apiClient.get<{
      success: boolean;
      data: ContractTemplate
    }>(`/contract-templates/default_template/?template_type=${templateType}`);
  },

  /**
   * Export template as JSON
   */
  async exportContractTemplate(templateId: string): Promise<{
    success: boolean;
    data: any
  }> {
    return apiClient.get<{
      success: boolean;
      data: any
    }>(`/contract-templates/${templateId}/export/`);
  },

  /**
   * Import template from JSON
   */
  async importContractTemplate(templateJson: any): Promise<{
    success: boolean;
    message: string;
    data: Partial<ContractTemplate>
  }> {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: Partial<ContractTemplate>
    }>('/contract-templates/import_template/', {
      template_json: templateJson
    });
  },

  // ============================================================
  // CONTRACT COSTS
  // ============================================================

  /**
   * Get all costs for a contract
   */
  async getContractCosts(contractId: number | string): Promise<ContractCost[]> {
    const response = await apiClient.get<{ results: ContractCost[] }>(`/contract-costs/?contract=${contractId}`);
    return response.results || [];
  },

  /**
   * Create a new contract cost
   */
  async createContractCost(data: Partial<ContractCost>): Promise<ContractCost> {
    return apiClient.post<ContractCost>('/contract-costs/', data);
  },

  /**
   * Update a contract cost
   */
  async updateContractCost(costId: number, data: Partial<ContractCost>): Promise<ContractCost> {
    return apiClient.patch<ContractCost>(`/contract-costs/${costId}/`, data);
  },

  /**
   * Delete a contract cost
   */
  async deleteContractCost(costId: number): Promise<void> {
    return apiClient.delete(`/contract-costs/${costId}/`);
  },

  // ============================================================
  // CONTRACT INCOMES
  // ============================================================

  /**
   * Get all incomes for a contract
   */
  async getContractIncomes(contractId: number | string): Promise<ContractIncome[]> {
    const response = await apiClient.get<{ results: ContractIncome[] }>(`/contract-incomes/?contract=${contractId}`);
    return response.results || [];
  },

  /**
   * Create a new contract income
   */
  async createContractIncome(data: Partial<ContractIncome>): Promise<ContractIncome> {
    return apiClient.post<ContractIncome>('/contract-incomes/', data);
  },

  /**
   * Update a contract income
   */
  async updateContractIncome(incomeId: number, data: Partial<ContractIncome>): Promise<ContractIncome> {
    return apiClient.patch<ContractIncome>(`/contract-incomes/${incomeId}/`, data);
  },

  /**
   * Delete a contract income
   */
  async deleteContractIncome(incomeId: number): Promise<void> {
    return apiClient.delete(`/contract-incomes/${incomeId}/`);
  },

  // ============================================================
  // FINANCIAL SUMMARY
  // ============================================================

  /**
   * Get financial summary for a contract
   */
  async getContractFinancialSummary(contractId: number | string): Promise<ContractFinancialSummary> {
    return apiClient.get<ContractFinancialSummary>(`/contract-financials/summary/?contract_id=${contractId}`);
  },

  /**
   * Get costs breakdown by type for a contract
   */
  async getContractCostBreakdown(contractId: number | string): Promise<ContractCostBreakdown[]> {
    return apiClient.get<ContractCostBreakdown[]>(`/contract-financials/costs_breakdown/?contract_id=${contractId}`);
  },

  // ============================================================
  // TEMPLATE EDITOR
  // ============================================================

  /**
   * Get PDF preview URL for a contract
   */
  getPreviewPdfUrl(contractId: number | string, templateCategory?: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
    let url = `${baseUrl}/contracts/${contractId}/preview_pdf/`;
    if (templateCategory) {
      url += `?template_category=${templateCategory}`;
    }
    return url;
  },

  /**
   * Save template configuration for a contract
   */
  async saveContractTemplate(contractId: number | string, templateData: Record<string, unknown>, templateCategory: string): Promise<{
    success: boolean;
    message: string;
    template_id: string;
    contract_id: number;
  }> {
    return apiClient.post(`/contracts/${contractId}/save_template/`, {
      template_data: templateData,
      template_category: templateCategory
    });
  },

  /**
   * Get template configuration for a contract
   */
  async getContractTemplateConfig(contractId: number | string): Promise<{
    success: boolean;
    template_data: Record<string, unknown>;
    template_category: string;
    contract_id: number;
    has_custom_template: boolean;
  }> {
    return apiClient.get(`/contracts/${contractId}/template_config/`);
  },
};

// ============================================================
// ADDITIONAL INTERFACES
// ============================================================

export interface ContractCost {
  id: number;
  contract: number;
  cost_type: 'FLIGHT' | 'ACCOMMODATION' | 'MEALS' | 'CAR_HIRE' | 'VISA' | 'AUDITORS_FEE' | 'BD_FEE' | 'OTHERS';
  cost_type_display?: string;
  description: string;
  tentative_amount: string | number;
  actual_amount?: string | number | null;
  currency: string;
  date_incurred?: string;
  notes?: string;
  variance?: string | number | null;
  created_by?: number;
  created_by_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContractIncome {
  id: number;
  contract: number;
  description: string;
  amount: string | number;
  currency: string;
  date_received: string;
  payment_method?: 'BANK_TRANSFER' | 'CHEQUE' | 'CASH' | 'MOBILE_MONEY' | 'CREDIT_CARD' | 'OTHER';
  payment_method_display?: string;
  reference?: string;
  notes?: string;
  created_by?: number;
  created_by_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContractFinancialSummary {
  contract_id: string;
  contract_value: string;
  total_income: string;
  total_tentative_cost: string;
  total_actual_cost: string;
  effective_cost: string;
  net_profit: string;
  margin_percentage: string;
  currency: string;
}

export interface ContractCostBreakdown {
  cost_type: string;
  cost_type_display: string;
  tentative_total: string;
  actual_total: string;
  item_count: number;
}

export const COST_TYPE_OPTIONS = [
  { value: 'FLIGHT', label: 'Flight' },
  { value: 'ACCOMMODATION', label: 'Accommodation' },
  { value: 'MEALS', label: 'Meals' },
  { value: 'CAR_HIRE', label: 'Car Hire' },
  { value: 'VISA', label: 'Visa' },
  { value: 'AUDITORS_FEE', label: 'Auditors Fee' },
  { value: 'BD_FEE', label: 'BD Fee' },
  { value: 'OTHERS', label: 'Others' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'CASH', label: 'Cash' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'OTHER', label: 'Other' },
];
