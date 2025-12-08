/**
 * Finance Service
 * Handles all finance-related API calls to backend_centra
 */

import { apiClient } from '@/lib/api-client';

export interface InvoiceItem {
    id: number;
    invoice: number;
    description: string;
    quantity: number;
    unit_price: string;
    total_price: string;
    tax_rate: string;
    tax_amount: string;
}

export interface Invoice {
    id: number;
    client: number;
    client_name: string;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    subtotal: string;
    tax_amount: string;
    total_amount: string;
    currency: string;
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    payment_terms: string;
    payment_method: string;
    notes: string;
    terms_conditions: string;
    created_by: number;
    created_by_name: string;
    created_at: string;
    updated_at: string;
    items: InvoiceItem[];
}

export interface InvoiceListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Invoice[];
}

export const financeService = {
    /**
     * Get all invoices with optional filtering
     */
    async getInvoices(params?: {
        client?: string | number;
        status?: string;
        search?: string;
        ordering?: string;
        page?: number;
    }): Promise<InvoiceListResponse> {
        const queryParams = new URLSearchParams();

        if (params?.client) queryParams.append('client', params.client.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.ordering) queryParams.append('ordering', params.ordering);
        if (params?.page) queryParams.append('page', params.page.toString());

        const endpoint = `/invoices/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return apiClient.get<InvoiceListResponse>(endpoint);
    },

    /**
     * Get a single invoice by ID
     */
    async getInvoice(id: string | number): Promise<Invoice> {
        return apiClient.get<Invoice>(`/invoices/${id}/`);
    },

    /**
     * Create a new invoice
     */
    async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
        return apiClient.post<Invoice>('/invoices/', data);
    },

    /**
     * Update an invoice
     */
    async updateInvoice(id: string | number, data: Partial<Invoice>): Promise<Invoice> {
        return apiClient.patch<Invoice>(`/invoices/${id}/`, data);
    },

    /**
     * Delete an invoice
     */
    async deleteInvoice(id: string | number): Promise<void> {
        return apiClient.delete<void>(`/invoices/${id}/`);
    },
};
