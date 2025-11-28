/**
 * Audit Service
 * Handles all audit-related API calls
 */

import { apiClient } from '@/lib/api-client';

export interface Audit {
  id: number;
  client: number;
  client_name: string;
  client_data?: any;
  iso_standard: number;
  iso_standard_name: string;
  iso_standard_data?: any;
  iso_standards?: number[]; // Support for multiple ISO standards
  iso_standards_data?: any[];
  audit_type: string;
  audit_number: string;
  title: string;
  description: string;
  scope: string;
  objectives?: string[];
  deliverables?: string[];
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  lead_auditor?: number;
  lead_auditor_name?: string;
  lead_auditor_data?: any;
  auditors?: number[];
  auditors_data?: any[];
  status: string;
  audit_template?: number;
  audit_template_data?: any;
  audit_templates?: number[];
  audit_templates_data?: any[];
  checklist_responses?: any[];
  findings_count: number;
  major_findings: number;
  minor_findings: number;
  opportunities: number;
  certificate_number?: string;
  certificate_issue_date?: string;
  certificate_expiry_date?: string;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  findings?: AuditFinding[];
}

export interface AuditFinding {
  id: number;
  audit: number;
  finding_number: string;
  finding_type: string;
  clause_reference: string;
  description: string;
  evidence: string;
  requirement: string;
  correction?: string;
  corrective_action?: string;
  root_cause?: string;
  target_date?: string;
  actual_closure_date?: string;
  status: string;
  responsible_person?: string;
  verified_by?: number;
  verified_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ISOStandard {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  default_template?: number;
  default_template_title?: string;
  created_at: string;
  updated_at: string;
}



export interface AuditListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Audit[];
}

export interface AuditFindingListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AuditFinding[];
}

export interface ISOStandardListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISOStandard[];
}

export interface SurveillanceSchedule {
  date: string;
  status: 'scheduled' | 'overdue' | 'pending' | 'completed';
}

export interface SurveillanceCertification {
  id: string;
  certificate_number: string;
  client: {
    id: string | number;
    name: string;
  };
  iso_standards: {
    id: number;
    code: string;
    name: string;
  }[];
  // Keep backward compatibility
  iso_standard?: {
    id: number;
    code: string;
    name: string;
  };
  issue_date: string;
  expiry_date: string;
  year1_surveillance: SurveillanceSchedule;
  year2_surveillance: SurveillanceSchedule;
  recertification: SurveillanceSchedule;
}

export interface SurveillanceStats {
  active: number;
  scheduled_surveillance: number;
  overdue_surveillance: number;
  completed_this_year: number;
}

export interface SurveillanceResponse {
  success: boolean;
  data: {
    certifications: SurveillanceCertification[];
    stats: SurveillanceStats;
    pagination?: {
      page: number;
      page_size: number;
      total_pages: number;
      total_items: number;
      has_next: boolean;
      has_previous: boolean;
    };
  };
}

export interface AuditStats {
  total: number;
  scheduled: number;
  in_progress: number;
  completed: number;
  completed_this_month: number;
  overdue: number;
  findings: {
    total_findings: number;
    total_major: number;
    total_minor: number;
    total_opportunities: number;
  };
}

export interface FindingStats {
  total: number;
  by_type: {
    major: number;
    minor: number;
    observations: number;
    opportunities: number;
  };
  by_status: {
    open: number;
    in_progress: number;
    closed: number;
    verified: number;
  };
}

export interface CalendarAudit {
  id: number;
  audit_number: string;
  client: string;
  standard: string;
  type: string;
  start_date: string;
  end_date: string;
  auditor: string;
  status: string;
}

export interface ChecklistItem {
  id: number;
  clause_reference: string;
  item_type: string;
  question: string;
  guidance: string;
  order: number;
}

export interface AuditChecklist {
  id: number;
  iso_standard: number;
  iso_standard_data?: any;
  title: string;
  description: string;
  is_template: boolean;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  items?: ChecklistItem[];
}

export const auditService = {
  /**
   * Get all audits with optional filtering
   */
  async getAudits(params?: {
    search?: string;
    status?: string;
    audit_type?: string;
    client?: number;
    iso_standard?: number;
    lead_auditor?: number;
    ordering?: string;
    page?: number;
  }): Promise<AuditListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.audit_type) queryParams.append('audit_type', params.audit_type);
    if (params?.client) queryParams.append('client', params.client.toString());
    if (params?.iso_standard) queryParams.append('iso_standard', params.iso_standard.toString());
    if (params?.lead_auditor) queryParams.append('lead_auditor', params.lead_auditor.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/audits/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<AuditListResponse>(endpoint);
  },

  /**
   * Get a single audit by ID
   */
  async getAudit(id: string | number): Promise<Audit> {
    return apiClient.get<Audit>(`/audits/${id}/`);
  },

  /**
   * Get audit statistics
   */
  async getStats(): Promise<{ success: boolean; data: AuditStats }> {
    return apiClient.get<{ success: boolean; data: AuditStats }>('/audits/stats/');
  },

  /**
   * Get surveillance audits for active certifications (primary backend API)
   */
  async getSurveillanceAudits(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: string;
    standard?: string;
  }): Promise<SurveillanceResponse> {
    const queryString = params
      ? '?' + new URLSearchParams(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, value.toString()])
      ).toString()
      : '';
    return apiClient.get<SurveillanceResponse>(`/audits/surveillance/${queryString}`);
  },

  /**
   * Create surveillance certification tracking when certificate is issued
   */
  async createSurveillanceCertification(data: {
    audit_id: number;
    certificate_number: string;
    client_id: number;
    iso_standards: number[];
    issue_date: string;
    expiry_date: string;
  }): Promise<SurveillanceCertification> {
    return apiClient.post<SurveillanceCertification>('/certifications/surveillance/', data);
  },

  /**
   * Get surveillance tracking data from issued certificates (fallback method)
   */
  async getSurveillanceFromCertificates(): Promise<SurveillanceResponse> {
    // Get all audits with issued certificates
    const auditsResponse = await this.getAudits({});
    const auditsList = auditsResponse.results || [];

    // Filter audits that have certificates issued
    const issuedCertificates = auditsList.filter(audit => audit.certificate_number);

    console.log("Found issued certificates:", issuedCertificates);

    // Transform audits into surveillance certification format
    const surveillanceCertifications: SurveillanceCertification[] = issuedCertificates.map(audit => {
      const issueDate = new Date(audit.certificate_issue_date || audit.created_at);
      const expiryDate = new Date(audit.certificate_expiry_date || new Date(issueDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000));

      // Calculate surveillance dates
      const year1Date = new Date(issueDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year after issue
      const year2Date = new Date(issueDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000); // 2 years after issue
      const recertDate = new Date(expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days before expiry

      return {
        id: audit.id.toString(),
        certificate_number: audit.certificate_number!,
        client: {
          id: audit.client,
          name: audit.client_name
        },
        iso_standards: audit.iso_standards?.map((stdId, index) => ({
          id: stdId,
          code: `ISO ${stdId}`, // Basic mapping - real data would come from ISO standards API
          name: `ISO Standard ${stdId}`
        })) || [{
          id: audit.iso_standard,
          code: audit.iso_standard_name?.split(' - ')[0] || audit.iso_standard_name || `ISO ${audit.iso_standard}`,
          name: audit.iso_standard_name || `ISO Standard ${audit.iso_standard}`
        }],
        issue_date: issueDate.toISOString().split('T')[0],
        expiry_date: expiryDate.toISOString().split('T')[0],
        year1_surveillance: {
          date: year1Date.toISOString().split('T')[0],
          status: year1Date > new Date() ? 'scheduled' : 'overdue'
        },
        year2_surveillance: {
          date: year2Date.toISOString().split('T')[0],
          status: year2Date > new Date() ? 'scheduled' : 'overdue'
        },
        recertification: {
          date: recertDate.toISOString().split('T')[0],
          status: recertDate > new Date() ? 'scheduled' : 'overdue'
        }
      };
    });

    return {
      success: true,
      data: {
        certifications: surveillanceCertifications,
        stats: {
          active: surveillanceCertifications.length,
          scheduled_surveillance: surveillanceCertifications.filter(cert =>
            [cert.year1_surveillance.status, cert.year2_surveillance.status, cert.recertification.status]
              .includes('scheduled')
          ).length,
          overdue_surveillance: surveillanceCertifications.filter(cert =>
            [cert.year1_surveillance.status, cert.year2_surveillance.status, cert.recertification.status]
              .includes('overdue')
          ).length,
          completed_this_year: 0
        }
      }
    };
  },

  /**
   * Get audits for calendar view
   */
  async getCalendarAudits(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<{ success: boolean; data: CalendarAudit[] }> {
    const queryParams = new URLSearchParams();

    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const endpoint = `/audits/calendar/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{ success: boolean; data: CalendarAudit[] }>(endpoint);
  },

  /**
   * Create a new audit
   */
  async createAudit(data: Partial<Audit>): Promise<Audit> {
    return apiClient.post<Audit>('/audits/', data);
  },

  /**
   * Update an audit
   */
  async updateAudit(id: string | number, data: Partial<Audit>): Promise<Audit> {
    return apiClient.patch<Audit>(`/audits/${id}/`, data);
  },

  /**
   * Delete an audit
   */
  async deleteAudit(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/audits/${id}/`);
  },

  /**
   * Get all audit findings with optional filtering
   */
  async getFindings(params?: {
    search?: string;
    finding_type?: string;
    status?: string;
    audit?: number;
    client?: number;
    ordering?: string;
    page?: number;
  }): Promise<AuditFindingListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.finding_type) queryParams.append('finding_type', params.finding_type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.audit) queryParams.append('audit', params.audit.toString());
    if (params?.client) queryParams.append('audit__client', params.client.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/audit-findings/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<AuditFindingListResponse>(endpoint);
  },

  /**
   * Get finding statistics
   */
  async getFindingStats(): Promise<{ success: boolean; data: FindingStats }> {
    return apiClient.get<{ success: boolean; data: FindingStats }>('/audit-findings/stats/');
  },

  /**
   * Get a single finding by ID
   */
  async getFinding(id: string | number): Promise<AuditFinding> {
    return apiClient.get<AuditFinding>(`/audit-findings/${id}/`);
  },

  /**
   * Create a new finding
   */
  async createFinding(data: Partial<AuditFinding>): Promise<AuditFinding> {
    return apiClient.post<AuditFinding>('/audit-findings/', data);
  },

  /**
   * Update a finding
   */
  async updateFinding(id: string | number, data: Partial<AuditFinding>): Promise<AuditFinding> {
    return apiClient.patch<AuditFinding>(`/audit-findings/${id}/`, data);
  },

  /**
   * Delete a finding
   */
  async deleteFinding(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/audit-findings/${id}/`);
  },

  /**
   * Get all ISO standards
   */
  async getISOStandards(params?: {
    search?: string;
    ordering?: string;
    page?: number;
  }): Promise<ISOStandardListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/iso-standards/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ISOStandardListResponse>(endpoint);
  },

  /**
   * Get a single ISO standard by ID
   */
  async getISOStandard(id: string | number): Promise<ISOStandard> {
    return apiClient.get<ISOStandard>(`/iso-standards/${id}/`);
  },

  /**
   * Get all audit checklists/templates
   */
  async getChecklists(params?: {
    search?: string;
    iso_standard?: number;
    is_template?: boolean;
    ordering?: string;
    page?: number;
  }): Promise<{ count: number; next: string | null; previous: string | null; results: AuditChecklist[] }> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.iso_standard) queryParams.append('iso_standard', params.iso_standard.toString());
    if (params?.is_template !== undefined) queryParams.append('is_template', params.is_template.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/audit-checklists/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{ count: number; next: string | null; previous: string | null; results: AuditChecklist[] }>(endpoint);
  },

  /**
   * Get a single checklist by ID
   */
  async getChecklist(id: string | number): Promise<AuditChecklist> {
    return apiClient.get<AuditChecklist>(`/audit-checklists/${id}/`);
  },

  /**
   * Create a new checklist
   */
  async createChecklist(data: Partial<AuditChecklist>): Promise<AuditChecklist> {
    return apiClient.post<AuditChecklist>('/audit-checklists/', data);
  },

  /**
   * Update a checklist
   */
  async updateChecklist(id: string | number, data: Partial<AuditChecklist>): Promise<AuditChecklist> {
    return apiClient.patch<AuditChecklist>(`/audit-checklists/${id}/`, data);
  },

  /**
   * Delete a checklist
   */
  async deleteChecklist(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/audit-checklists/${id}/`);
  },

  /**
   * Save checklist responses for an audit
   */
  async saveChecklistResponses(auditId: string | number, responses: any[]): Promise<any> {
    return apiClient.post(`/audits/${auditId}/checklist-responses/`, { responses });
  },

  /**
   * Get checklist responses for an audit
   */
  async getChecklistResponses(auditId: string | number): Promise<any[]> {
    return apiClient.get<any[]>(`/audits/${auditId}/checklist-responses/`);
  },

  /**
   * Update a single checklist response
   */
  async updateChecklistResponse(auditId: string | number, responseId: string | number, data: any): Promise<any> {
    return apiClient.patch(`/audits/${auditId}/checklist-responses/${responseId}/`, data);
  },

  /**
   * Get documents for an audit
   */
  async getDocuments(auditId: string | number): Promise<any[]> {
    const response = await apiClient.get<any>(`/audit-documents/?audit=${auditId}`);
    return response.results || response;
  },

  /**
   * Upload a document for an audit
   */
  async uploadDocument(auditId: string | number, file: File, data: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('audit', auditId.toString());
    formData.append('original_name', file.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);

    // Don't set Content-Type header - let browser set it with boundary
    return apiClient.post('/audit-documents/', formData);
  },

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string | number): Promise<void> {
    return apiClient.delete<void>(`/audit-documents/${documentId}/`);
  },
  /**
   * Create a new ISO standard
   */
  async createISOStandard(data: Partial<ISOStandard>): Promise<ISOStandard> {
    return apiClient.post<ISOStandard>('/iso-standards/', data);
  },

  /**
   * Update an ISO standard
   */
  async updateISOStandard(id: string | number, data: Partial<ISOStandard>): Promise<ISOStandard> {
    return apiClient.patch<ISOStandard>(`/iso-standards/${id}/`, data);
  },

  /**
   * Delete an ISO standard
   */
  async deleteISOStandard(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/iso-standards/${id}/`);
  },
};

