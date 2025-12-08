/**
 * Document Service
 * Handles all document-related API calls to backend_centra
 */

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
        client?: number | string;
        page?: number;
        page_size?: number;
        ordering?: string;
    }): Promise<DocumentListResponse> {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.document_type) queryParams.append('document_type', params.document_type);
        if (params?.category) queryParams.append('category', params.category.toString());
        if (params?.access_level) queryParams.append('access_level', params.access_level);
        if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
        if (params?.client) queryParams.append('client', params.client.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params?.ordering) queryParams.append('ordering', params.ordering);

        const endpoint = `/documents/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return apiClient.get<DocumentListResponse>(endpoint);
    },

    async getDocument(id: string | number): Promise<Document> {
        return apiClient.get<Document>(`/documents/${id}/`);
    },

    async createDocument(data: FormData): Promise<Document> {
        // Content-Type header is handled by apiClient/browser for FormData
        return apiClient.post<Document>('/documents/', data);
    },

    async updateDocument(id: string | number, data: Partial<Document> | FormData): Promise<Document> {
        return apiClient.put<Document>(`/documents/${id}/`, data);
    },

    async patchDocument(id: string | number, data: Partial<Document>): Promise<Document> {
        return apiClient.patch<Document>(`/documents/${id}/`, data);
    },

    async deleteDocument(id: string | number): Promise<void> {
        return apiClient.delete<void>(`/documents/${id}/`);
    },

    async getStats(): Promise<DocumentLibraryStats> {
        return apiClient.get<DocumentLibraryStats>('/documents/stats/');
    },

    async getRecentDocuments(limit: number = 10): Promise<Document[]> {
        return apiClient.get<Document[]>(`/documents/recent/?limit=${limit}`);
    },

    async getExpiringDocuments(days: number = 30): Promise<Document[]> {
        return apiClient.get<Document[]>(`/documents/expiring/?days=${days}`);
    },

    async trackDownload(id: string | number): Promise<{ success: boolean; file_url: string | null }> {
        return apiClient.post<{ success: boolean; file_url: string | null }>(`/documents/${id}/download/`);
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
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.is_public !== undefined) queryParams.append('is_public', params.is_public.toString());
        if (params?.owner) queryParams.append('owner', params.owner.toString());
        if (params?.client) queryParams.append('client', params.client.toString());
        if (params?.parent_folder) queryParams.append('parent_folder', params.parent_folder.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

        const endpoint = `/folders/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return apiClient.get<FolderListResponse>(endpoint);
    },

    async getFolder(id: string | number): Promise<Folder> {
        return apiClient.get<Folder>(`/folders/${id}/`);
    },

    async createFolder(data: Partial<Folder>): Promise<Folder> {
        return apiClient.post<Folder>('/folders/', data);
    },

    async updateFolder(id: string | number, data: Partial<Folder>): Promise<Folder> {
        return apiClient.put<Folder>(`/folders/${id}/`, data);
    },

    async deleteFolder(id: string | number): Promise<void> {
        return apiClient.delete<void>(`/folders/${id}/`);
    },

    async getFolderDocuments(folderId: string | number): Promise<Document[]> {
        return apiClient.get<Document[]>(`/folders/${folderId}/documents/`);
    },

    async addDocumentToFolder(folderId: string | number, documentId: number): Promise<{ success: boolean; message: string }> {
        return apiClient.post<{ success: boolean; message: string }>(`/folders/${folderId}/add_document/`, {
            document_id: documentId,
        });
    },

    // Categories
    async getCategories(): Promise<DocumentCategory[]> {
        const response = await apiClient.get<any>('/categories/');
        return response.results || response;
    },

    async getCategory(id: string | number): Promise<DocumentCategory> {
        return apiClient.get<DocumentCategory>(`/categories/${id}/`);
    },

    async createCategory(data: Partial<DocumentCategory>): Promise<DocumentCategory> {
        return apiClient.post<DocumentCategory>('/categories/', data);
    },
};

export default documentService;
