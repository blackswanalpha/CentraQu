import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Template Service - Complete Redesign with Visual Canvas Support
// Now uses Axios for persistence with Django Backend

export type TemplateType = 'audit' | 'contract' | 'report' | 'certification';
export type PageSize = 'A4' | 'Letter' | 'Legal' | 'Custom';
export type Orientation = 'portrait' | 'landscape';

// ============= TEMPLATE SETTINGS =============
export interface TemplateSettings {
    pageSize: PageSize;
    orientation: Orientation;
    customWidth?: number; // in px
    customHeight?: number; // in px
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    backgroundColor: string;
    backgroundImage?: string;
    gridEnabled: boolean;
    gridSize: number; // in px
    snapToGrid: boolean;
    showRuler: boolean;
    zoom: number; // percentage 25-200
}

export const defaultTemplateSettings: TemplateSettings = {
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 40, right: 40, bottom: 40, left: 40 },
    backgroundColor: '#ffffff',
    gridEnabled: true,
    gridSize: 10,
    snapToGrid: true,
    showRuler: true,
    zoom: 100,
};

// Page size dimensions (in pixels at 96 DPI)
export const PAGE_DIMENSIONS = {
    A4: {
        portrait: { width: 794, height: 1123 },
        landscape: { width: 1123, height: 794 },
    },
    Letter: {
        portrait: { width: 816, height: 1056 },
        landscape: { width: 1056, height: 816 },
    },
    Legal: {
        portrait: { width: 816, height: 1344 },
        landscape: { width: 1344, height: 816 },
    },
};

// ============= MAIN TEMPLATE =============
export interface Template {
    id?: string;
    title: string;
    description?: string;
    type: TemplateType;
    pages: TemplatePage[];
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
    settings: TemplateSettings;
    metadata?: {
        require_all?: boolean;
        show_progress?: boolean;
        auto_save?: boolean;
        variables?: Array<{
            name: string;
            description: string;
            type: string;
        }>;
        contract?: {
            client_name?: string;
            contract_date?: string;
            amount?: number;
            status?: string;
            contract_type?: string;
        };
    };
}

// =============PAGE WITH VISUAL CANVAS =============
export interface TemplatePage {
    id: string;
    title: string;
    order: number;
    content: string; // Rich HTML content for page background
    sections: VisualSection[];
    images: PageImage[];
    layers: PageLayer[];
}

// ============= VISUAL SECTION (RESIZABLE & DRAGGABLE) =============
export interface VisualSection {
    id: string;
    title: string;
    description?: string;
    order: number;
    position: {
        x: number; // pixels from left
        y: number; // pixels from top
    };
    size: {
        width: number; // pixels
        height: number; // pixels or auto
    };
    zIndex: number;
    locked: boolean;
    style: {
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        borderStyle?: 'solid' | 'dashed' | 'dotted';
        borderRadius?: number;
        padding?: number;
        shadow?: string;
    };
    items: (TemplateItem | FormElement)[];
    template_content?: string; // Rich HTML content for the section
}

// ============= PAGE IMAGE (DRAGGABLE & RESIZABLE) =============
export interface PageImage {
    id: string;
    url: string;
    base64?: string; // For uploaded images
    alt?: string;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    rotation: number; // degrees
    zIndex: number;
    locked: boolean;
    opacity: number; // 0-1
}

// ============= LAYER MANAGEMENT =============
export interface PageLayer {
    id: string;
    name: string;
    type: 'section' | 'image' | 'text';
    visible: boolean;
    locked: boolean;
    zIndex: number;
}

// ============= QUESTION TYPES (EXISTING) =============
export type ItemType = 'text' | 'multiple_choice' | 'dropdown' | 'rating' | 'date' | 'file' | 'image' | 'instruction' | 'rich_text';

export interface TemplateItem {
    id: string;
    type: ItemType;
    label: string;
    order: number;
    required: boolean;
    options?: string[];
    rating_scale?: number;
    placeholder?: string;
    rich_content?: string;
    image_url?: string;
}

// ============= FORM BUILDER (NEW) =============
export type FormElementType =
    | 'input_text'
    | 'input_email'
    | 'input_number'
    | 'input_tel'
    | 'input_url'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'time'
    | 'datetime'
    | 'file'
    | 'button'
    | 'label';

export type ValidationType = 'email' | 'number' | 'tel' | 'url' | 'pattern';

export interface FormValidation {
    type?: ValidationType;
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    customMessage?: string;
}

export interface FormElement {
    id: string;
    type: FormElementType;
    label: string;
    name: string;
    placeholder?: string;
    required: boolean;
    validation?: FormValidation;
    options?: string[]; // For select, radio, checkbox
    defaultValue?: any;
    helpText?: string;
    disabled?: boolean;
    readOnly?: boolean;
    style?: {
        width?: string;
        className?: string;
    };
}


const BASE_URL = 'http://localhost:8000/api/v1/templates/';

// Helper to get auth token - assuming it's stored in localStorage or similar
const getAuthToken = (): string | null => {
    // Implement your logic to retrieve the authentication token
    // For example, from localStorage:
    return localStorage.getItem('authToken');
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
    (config) => {
        // const token = getAuthToken(); // Temporarily comment out for debugging 401 with AllowAny
        // if (token) {
        //     config.headers.Authorization = `Token ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// ============= TEMPLATE SERVICE =============
export const templateService = {
    async createTemplate(data: Partial<Template>): Promise<Template> {
        try {
            const templateData = { ...data };
            if (!templateData.id) {
                templateData.id = uuidv4();
            }
            const response = await axiosInstance.post<Template>('', templateData);
            return response.data;
        } catch (error) {
            console.error('Error creating template:', error);
            throw error;
        }
    },

    async updateTemplate(id: string, data: Partial<Template>): Promise<Template> {
        try {
            const response = await axiosInstance.put<Template>(`${id}/`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating template:', error);
            throw error;
        }
    },

    async getTemplate(id: string): Promise<Template> {
        try {
            const response = await axiosInstance.get<Template>(`${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching template:', error);
            throw error;
        }
    },

    async publishTemplate(id: string): Promise<void> {
        try {
            // Assuming publishing is an update to is_published field
            await axiosInstance.patch(`${id}/`, { is_published: true });
        } catch (error) {
            console.error('Error publishing template:', error);
            throw error;
        }
    },

    async deleteTemplate(id: string): Promise<void> {
        try {
            await axiosInstance.delete(`${id}/`);
        } catch (error) {
            console.error('Error deleting template:', error);
            throw error;
        }
    },
};


