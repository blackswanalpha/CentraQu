/**
 * Template API Client for Django Backend
 * Handles all template-related operations with backend_centra
 */

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000/api/v1';

export interface BackendTemplate {
    id?: number;
    template_id?: string;
    name: string;
    description?: string;
    template_type: 'CERTIFICATION_CONTRACT' | 'AUDIT_CHECKLIST' | 'SERVICE_AGREEMENT' | 'OTHER';
    template_data: any; // The full Template object from template.service.ts
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    is_active: boolean;
    is_default: boolean;
    version: string;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
}

/**
 * Fetch all contract templates from Django backend
 */
export async function fetchTemplates(templateType?: string): Promise<BackendTemplate[]> {
    const params = new URLSearchParams();
    if (templateType) {
        params.append('template_type', templateType);
    }
    params.append('is_active', 'true');

    const response = await fetch(`${DJANGO_API_URL}/contract-templates/?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
}

/**
 * Fetch a specific template by ID
 */
export async function fetchTemplateById(templateId: string): Promise<BackendTemplate> {
    const response = await fetch(`${DJANGO_API_URL}/contract-templates/${templateId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
}

/**
 * Create a new template
 */
export async function createTemplate(templateData: any): Promise<BackendTemplate> {
    console.log('🌐 API: Creating template...', {
        url: `${DJANGO_API_URL}/contract-templates/`,
        title: templateData.title,
        type: templateData.type,
        pagesCount: templateData.pages?.length
    });

    const response = await fetch(`${DJANGO_API_URL}/contract-templates/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            template_data: templateData,
        }),
    });

    console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        console.error('❌ API Error:', error);
        throw new Error(`Failed to create template: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('✅ API Success:', result);
    return result.data;
}

/**
 * Update an existing template
 */
export async function updateTemplate(templateId: string, templateData: any): Promise<BackendTemplate> {
    console.log('🌐 API: Updating template...', {
        url: `${DJANGO_API_URL}/contract-templates/${templateId}/`,
        templateId,
        title: templateData.title,
        type: templateData.type,
        pagesCount: templateData.pages?.length
    });

    const response = await fetch(`${DJANGO_API_URL}/contract-templates/${templateId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            template_data: templateData,
        }),
    });

    console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        console.error('❌ API Error:', error);
        throw new Error(`Failed to update template: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('✅ API Success:', result);
    return result.data;
}

/**
 * Delete a template
 */
export async function deleteTemplate(templateId: string): Promise<void> {
    const response = await fetch(`${DJANGO_API_URL}/contract-templates/${templateId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete template: ${response.statusText}`);
    }
}

/**
 * Get the default template for a specific type
 */
export async function fetchDefaultTemplate(templateType: string): Promise<BackendTemplate | null> {
    const response = await fetch(`${DJANGO_API_URL}/contract-templates/default_template/?template_type=${templateType}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error(`Failed to fetch default template: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
}

/**
 * Export template as JSON
 */
export async function exportTemplate(templateId: string): Promise<any> {
    const response = await fetch(`${DJANGO_API_URL}/contract-templates/${templateId}/export/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to export template: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
}

/**
 * Import template from JSON
 */
export async function importTemplate(templateJson: any): Promise<BackendTemplate> {
    const response = await fetch(`${DJANGO_API_URL}/contract-templates/import_template/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            template_json: templateJson,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to import template: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    return result.data;
}
