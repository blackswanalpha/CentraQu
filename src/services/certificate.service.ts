import { apiClient } from '@/lib/api-client';

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  iso_standard?: {
    id: number;
    code: string;
    name: string;
    description: string;
  };
  template_type: 'docx' | 'pdf' | 'html' | 'jasper';
  template_file: string;
  variables: Record<string, string>;
  is_active: boolean;
  is_default: boolean;
  created_by?: any;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  client: any;
  iso_standard: any;
  audit?: any;
  certificate_number: string;
  issue_date: string;
  expiry_date: string;
  status: 'pending' | 'active' | 'expiring-soon' | 'expired' | 'suspended' | 'revoked';
  scope: string;
  lead_auditor?: any;
  certification_body: string;
  accreditation_number: string;
  template?: CertificateTemplate;
  document_url?: string;
  metadata: Record<string, any>;
  notes: string;
  created_by?: any;
  created_at: string;
  updated_at: string;
  days_until_expiry?: number;
  is_expired?: boolean;
  is_expiring_soon?: boolean;
}

export interface CreateTemplateData {
  name: string;
  description?: string;
  iso_standard?: number;
  template_type: 'docx' | 'pdf' | 'html' | 'jasper';
  template_file: File;
  variables?: Record<string, string>;
  is_default?: boolean;
}

export interface UpdateTemplateData {
  name?: string;
  description?: string;
  iso_standard?: number;
  template_type?: 'docx' | 'pdf' | 'html' | 'jasper';
  template_file?: File;
  variables?: Record<string, string>;
  is_default?: boolean;
  is_active?: boolean;
}

export interface CreateCertificationData {
  client: number;
  iso_standard: number;
  audit?: number;
  certificate_number?: string;
  issue_date: string;
  expiry_date: string;
  scope: string;
  lead_auditor?: number;
  certification_body?: string;
  accreditation_number?: string;
  template?: string;
  metadata?: Record<string, any>;
  notes?: string;
}

export interface UpdateCertificationData {
  client?: number;
  iso_standard?: number;
  audit?: number;
  certificate_number?: string;
  issue_date?: string;
  expiry_date?: string;
  status?: 'pending' | 'active' | 'expiring-soon' | 'expired' | 'suspended' | 'revoked';
  scope?: string;
  lead_auditor?: number;
  certification_body?: string;
  accreditation_number?: string;
  template?: string;
  metadata?: Record<string, any>;
  notes?: string;
}

export interface CertificationFilters {
  status?: string;
  client?: number;
  iso_standard?: number;
  lead_auditor?: number;
  expiry_date_before?: string;
  expiry_date_after?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface TemplateFilters {
  template_type?: string;
  iso_standard?: number;
  is_active?: boolean;
  is_default?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

class CertificateService {
  private baseUrl = ''; // API client already has /api/v1 prefix

  // Certificate Templates
  async getTemplates(filters?: TemplateFilters): Promise<{ results: CertificateTemplate[], count: number, next?: string, previous?: string }> {
    const params = new URLSearchParams();
    
    if (filters?.template_type) params.append('template_type', filters.template_type);
    if (filters?.iso_standard) params.append('iso_standard', filters.iso_standard.toString());
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    if (filters?.is_default !== undefined) params.append('is_default', filters.is_default.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());

    const queryString = params.toString();
    const url = `/certificate-templates/${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(url);
  }

  async getTemplate(id: string): Promise<CertificateTemplate> {
    return apiClient.get(`/certificate-templates/${id}/`);
  }

  async createTemplate(data: CreateTemplateData): Promise<CertificateTemplate> {
    const formData = new FormData();
    
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.iso_standard) formData.append('iso_standard', data.iso_standard.toString());
    formData.append('template_type', data.template_type);
    formData.append('template_file', data.template_file);
    if (data.variables) formData.append('variables', JSON.stringify(data.variables));
    if (data.is_default !== undefined) formData.append('is_default', data.is_default.toString());

    return apiClient.post(`/certificate-templates/`, formData);
  }

  async updateTemplate(id: string, data: UpdateTemplateData): Promise<CertificateTemplate> {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.iso_standard) formData.append('iso_standard', data.iso_standard.toString());
    if (data.template_type) formData.append('template_type', data.template_type);
    if (data.template_file) formData.append('template_file', data.template_file);
    if (data.variables) formData.append('variables', JSON.stringify(data.variables));
    if (data.is_default !== undefined) formData.append('is_default', data.is_default.toString());
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());

    return apiClient.put(`/certificate-templates/${id}/`, formData);
  }

  async deleteTemplate(id: string): Promise<void> {
    return apiClient.delete(`/certificate-templates/${id}/`);
  }

  async getActiveTemplates(): Promise<CertificateTemplate[]> {
    return apiClient.get(`/certificate-templates/active/`);
  }

  // Certifications
  async getCertifications(filters?: CertificationFilters): Promise<{ results: Certification[], count: number, next?: string, previous?: string }> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.client) params.append('client', filters.client.toString());
    if (filters?.iso_standard) params.append('iso_standard', filters.iso_standard.toString());
    if (filters?.lead_auditor) params.append('lead_auditor', filters.lead_auditor.toString());
    if (filters?.expiry_date_before) params.append('expiry_date_before', filters.expiry_date_before);
    if (filters?.expiry_date_after) params.append('expiry_date_after', filters.expiry_date_after);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());

    const queryString = params.toString();
    const url = `/certifications/${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(url);
  }

  async getCertification(id: string): Promise<Certification> {
    return apiClient.get(`/certifications/${id}/`);
  }

  async createCertification(data: CreateCertificationData): Promise<Certification> {
    return apiClient.post(`/certifications/`, data);
  }

  async updateCertification(id: string, data: UpdateCertificationData): Promise<Certification> {
    return apiClient.put(`/certifications/${id}/`, data);
  }

  async deleteCertification(id: string): Promise<void> {
    return apiClient.delete(`/certifications/${id}/`);
  }

  // Certificate Generation
  async generateCertificate(certificationId: string): Promise<{ success: boolean, document_url?: string, message?: string }> {
    return apiClient.post(`/certifications/${certificationId}/generate/`, {});
  }

  async downloadCertificate(certificationId: string): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/certifications/${certificationId}/download/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download certificate');
    }

    return response.blob();
  }

  // Statistics and Analytics
  async getCertificationStats(): Promise<{
    total: number;
    active: number;
    expiring_soon: number;
    expired: number;
    by_standard: Array<{ standard: string; count: number }>;
    recent_activity: Array<any>;
  }> {
    return apiClient.get(`/certifications/stats/`);
  }

  async getExpiringCertifications(days?: number): Promise<Certification[]> {
    const params = new URLSearchParams();
    if (days) params.append('days', days.toString());
    
    const queryString = params.toString();
    const url = `/certifications/expiring/${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(url);
  }

  // Template Preview and Validation
  async previewTemplate(templateId: string, sampleData?: Record<string, any>): Promise<{ preview_url: string }> {
    return apiClient.post(`/certificate-templates/${templateId}/preview/`, {
      sample_data: sampleData || {},
    });
  }

  async validateTemplate(templateId: string): Promise<{ 
    is_valid: boolean; 
    errors?: string[];
    warnings?: string[];
    missing_variables?: string[];
  }> {
    return apiClient.post(`/certificate-templates/${templateId}/validate/`, {});
  }

  // Bulk Operations
  async bulkUpdateCertifications(certificationIds: string[], updates: Partial<UpdateCertificationData>): Promise<{ updated: number; errors: any[] }> {
    return apiClient.post(`/certifications/bulk-update/`, {
      certification_ids: certificationIds,
      updates,
    });
  }

  async bulkGenerateCertificates(certificationIds: string[]): Promise<{ generated: number; errors: any[] }> {
    return apiClient.post(`/certifications/bulk-generate/`, {
      certification_ids: certificationIds,
    });
  }

  // Import/Export
  async exportCertifications(filters?: CertificationFilters, format: 'csv' | 'xlsx' = 'xlsx'): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.client) params.append('client', filters.client.toString());
    if (filters?.iso_standard) params.append('iso_standard', filters.iso_standard.toString());
    if (filters?.lead_auditor) params.append('lead_auditor', filters.lead_auditor.toString());
    if (filters?.expiry_date_before) params.append('expiry_date_before', filters.expiry_date_before);
    if (filters?.expiry_date_after) params.append('expiry_date_after', filters.expiry_date_after);
    if (filters?.search) params.append('search', filters.search);
    
    params.append('format', format);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/certifications/export/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export certifications');
    }

    return response.blob();
  }
}

// Export singleton instance
export const certificateService = new CertificateService();