import { Template } from './template.service';

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  type: 'certification' | 'service' | 'consulting' | 'maintenance' | 'license';
  category: string;
  template_data: Template;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  tags?: string[];
  version: number;
}

export interface ContractTemplateStats {
  total_templates: number;
  active_templates: number;
  total_usage: number;
  popular_templates: ContractTemplate[];
}

export interface SaveTemplateRequest {
  name: string;
  description: string;
  type: ContractTemplate['type'];
  category: string;
  template_data: Template;
  tags?: string[];
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  category?: string;
  template_data?: Template;
  is_active?: boolean;
  tags?: string[];
}

class ContractTemplateService {
  private baseUrl = '/api/contract-templates';

  // Save new contract template
  async saveTemplate(templateData: SaveTemplateRequest): Promise<{ success: boolean; data?: ContractTemplate; error?: string }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to save template' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error saving contract template:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Get all contract templates with filtering
  async getTemplates(filters?: {
    type?: string;
    category?: string;
    active?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; data?: ContractTemplate[]; total?: number; error?: string }> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.type) params.append('type', filters.type);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.active !== undefined) params.append('active', filters.active.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const response = await fetch(`${this.baseUrl}?${params}`);
      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch templates' };
      }

      return { 
        success: true, 
        data: result.results || result.data || [],
        total: result.count || result.total || 0
      };
    } catch (error) {
      console.error('Error fetching contract templates:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Get specific contract template
  async getTemplate(templateId: string): Promise<{ success: boolean; data?: ContractTemplate; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}`);
      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch template' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error fetching contract template:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Update contract template
  async updateTemplate(templateId: string, updates: UpdateTemplateRequest): Promise<{ success: boolean; data?: ContractTemplate; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to update template' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error updating contract template:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Delete contract template
  async deleteTemplate(templateId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        return { success: false, error: result.error || 'Failed to delete template' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting contract template:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Duplicate contract template
  async duplicateTemplate(templateId: string, newName?: string): Promise<{ success: boolean; data?: ContractTemplate; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to duplicate template' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error duplicating contract template:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Get template statistics
  async getTemplateStats(): Promise<{ success: boolean; data?: ContractTemplateStats; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch template stats' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error fetching template stats:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Track template usage
  async trackTemplateUsage(templateId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}/use`, {
        method: 'POST',
      });

      if (!response.ok) {
        const result = await response.json();
        return { success: false, error: result.error || 'Failed to track usage' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error tracking template usage:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Export template to JSON
  exportTemplate(template: ContractTemplate): string {
    return JSON.stringify(template, null, 2);
  }

  // Import template from JSON
  async importTemplate(templateJson: string, name: string): Promise<{ success: boolean; data?: ContractTemplate; error?: string }> {
    try {
      const templateData = JSON.parse(templateJson);
      
      // Validate required fields
      if (!templateData.template_data) {
        return { success: false, error: 'Invalid template data' };
      }

      const importData: SaveTemplateRequest = {
        name,
        description: templateData.description || 'Imported template',
        type: templateData.type || 'service',
        category: templateData.category || 'General',
        template_data: templateData.template_data,
        tags: templateData.tags || []
      };

      return await this.saveTemplate(importData);
    } catch (error) {
      console.error('Error importing template:', error);
      return { success: false, error: 'Invalid template format' };
    }
  }

  // Generate contract from template
  async generateContract(templateId: string, contractData: any): Promise<{ success: boolean; contractId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}/generate-contract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to generate contract' };
      }

      return { success: true, contractId: result.contract_id };
    } catch (error) {
      console.error('Error generating contract:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Save template to local storage (fallback for offline use)
  saveToLocalStorage(template: ContractTemplate): void {
    try {
      const templates = this.getFromLocalStorage();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = template;
      } else {
        templates.push(template);
      }
      
      localStorage.setItem('contract_templates', JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  // Get templates from local storage
  getFromLocalStorage(): ContractTemplate[] {
    try {
      const data = localStorage.getItem('contract_templates');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from local storage:', error);
      return [];
    }
  }

  // Clear local storage
  clearLocalStorage(): void {
    try {
      localStorage.removeItem('contract_templates');
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  }
}

export const contractTemplateService = new ContractTemplateService();
export default contractTemplateService;