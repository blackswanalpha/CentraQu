import { apiClient } from '@/lib/api-client';

// Types
export interface Document {
    id: number;
    title: string;
    description: string;
    document_type: string;
    category: number | null;
    category_name: string | null;
    file: string;
    file_name: string;
    file_size: number;
    file_extension: string;
    file_url: string | null;
    client: number | null;
    version: string;
    is_current_version: boolean;
    parent_document: number | null;
    access_level: string;
    is_active: boolean;
    tags: string;
    reference_number: string;
    document_date: string | null;
    expiry_date: string | null;
    uploaded_by: number | null;
    owner_name: string;
    folder_path: string | null;
    created_at: string;
    updated_at: string;
}

export interface Folder {
    id: number;
    name: string;
    description: string;
    parent_folder: number | null;
    is_public: boolean;
    owner: number;
    owner_name: string;
    client: number | null;
    document_count: number;
    subfolder_count: number;
    created_at: string;
    updated_at: string;
    color?: string; // For UI purposes
}

export interface DocumentCategory {
    id: number;
    name: string;
    description: string;
    parent_category: number | null;
    created_at: string;
    updated_at: string;
}

export interface DocumentLibraryStats {
    total_documents: number;
    total_size: number;
    storage_usage_percentage: number;
    added_this_month: number;
    expiring_documents: number;
    pending_access_requests: number;
}

export interface DocumentListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Document[];
}

export interface FolderListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Folder[];
}

// Document Service
export const documentService = {
    // Documents
    async getDocuments(params?: {
        search?: string;
        document_type?: string;
        category?: number;
        access_level?: string;
        is_active?: boolean;
        client?: number;
        page?: number;
        page_size?: number;
    }): Promise<DocumentListResponse> {
        const response = await apiClient.get('/documents/', { params });
        return response.data;
    },

    async getDocument(id: string | number): Promise<Document> {
        const response = await apiClient.get(`/documents/${id}/`);
        return response.data;
    },

    async createDocument(data: FormData): Promise<Document> {
        const response = await apiClient.post('/documents/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async updateDocument(id: string | number, data: Partial<Document> | FormData): Promise<Document> {
        const response = await apiClient.put(`/documents/${id}/`, data, {
            headers: data instanceof FormData ? {
                'Content-Type': 'multipart/form-data',
            } : undefined,
        });
        return response.data;
    },

    async patchDocument(id: string | number, data: Partial<Document>): Promise<Document> {
        const response = await apiClient.patch(`/documents/${id}/`, data);
        return response.data;
    },

    async deleteDocument(id: string | number): Promise<void> {
        await apiClient.delete(`/documents/${id}/`);
    },

    async getStats(): Promise<DocumentLibraryStats> {
        const response = await apiClient.get('/documents/stats/');
        return response.data;
    },

    async getRecentDocuments(limit: number = 10): Promise<Document[]> {
        const response = await apiClient.get('/documents/recent/', {
            params: { limit },
        });
        return response.data;
    },

    async getExpiringDocuments(days: number = 30): Promise<Document[]> {
        const response = await apiClient.get('/documents/expiring/', {
            params: { days },
        });
        return response.data;
    },

    async trackDownload(id: string | number): Promise<{ success: boolean; file_url: string | null }> {
        const response = await apiClient.post(`/documents/${id}/download/`);
        return response.data;
    },

    // Folders
    async getFolders(params?: {
        search?: string;
        is_public?: boolean;
        owner?: number;
        client?: number;
        parent_folder?: number;
        page?: number;
        page_size?: number;
    }): Promise<FolderListResponse> {
        const response = await apiClient.get('/folders/', { params });
        return response.data;
    },

    async getFolder(id: string | number): Promise<Folder> {
        const response = await apiClient.get(`/folders/${id}/`);
        return response.data;
    },

    async createFolder(data: Partial<Folder>): Promise<Folder> {
        const response = await apiClient.post('/folders/', data);
        return response.data;
    },

    async updateFolder(id: string | number, data: Partial<Folder>): Promise<Folder> {
        const response = await apiClient.put(`/folders/${id}/`, data);
        return response.data;
    },

    async deleteFolder(id: string | number): Promise<void> {
        await apiClient.delete(`/folders/${id}/`);
    },

    async getFolderDocuments(folderId: string | number): Promise<Document[]> {
        const response = await apiClient.get(`/folders/${folderId}/documents/`);
        return response.data;
    },

    async addDocumentToFolder(folderId: string | number, documentId: number): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.post(`/folders/${folderId}/add_document/`, {
            document_id: documentId,
        });
        return response.data;
    },

    // Categories
    async getCategories(): Promise<DocumentCategory[]> {
        const response = await apiClient.get('/categories/');
        return response.data.results || response.data;
    },

    async getCategory(id: string | number): Promise<DocumentCategory> {
        const response = await apiClient.get(`/categories/${id}/`);
        return response.data;
    },

    async createCategory(data: Partial<DocumentCategory>): Promise<DocumentCategory> {
        const response = await apiClient.post('/categories/', data);
        return response.data;
    },
};

export default documentService;
