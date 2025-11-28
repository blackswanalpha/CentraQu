/**
 * Employee Service
 * Handles all employee-related API calls to backend_centra
 */

import { apiClient } from '@/lib/api-client';
import type { Employee } from '@/types/audit';

export interface EmployeeFilters {
  search?: string;
  status?: string;
  role?: string;
  department?: string;
  ordering?: string;
  page?: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  terminated: number;
}

export const employeeService = {
  /**
   * Get all employees with optional filtering
   */
  async getEmployees(params?: EmployeeFilters): Promise<Employee[]> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) {
      // Map frontend status to backend format (uppercase)
      const statusMap: Record<string, string> = {
        'active': 'ACTIVE',
        'inactive': 'INACTIVE',
        'on-leave': 'ON_LEAVE',
        'terminated': 'TERMINATED',
        'resigned': 'RESIGNED'
      };
      const backendStatus = statusMap[params.status.toLowerCase()] || params.status.toUpperCase();
      queryParams.append('employment_status', backendStatus);
    }
    if (params?.role) queryParams.append('role', params.role);
    if (params?.department) queryParams.append('department_name', params.department);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/employees/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<Employee[] | { results: Employee[] }>(endpoint);

    // Handle both paginated and non-paginated responses
    return Array.isArray(response) ? response : response.results || [];
  },

  /**
   * Get a single employee by ID
   */
  async getEmployee(id: string): Promise<Employee> {
    return apiClient.get<Employee>(`/employees/${id}/`);
  },

  /**
   * Create a new employee
   */
  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    return apiClient.post<Employee>('/employees/', data);
  },

  /**
   * Update an existing employee
   */
  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    return apiClient.put<Employee>(`/employees/${id}/`, data);
  },

  /**
   * Partially update an employee
   */
  async patchEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    return apiClient.patch<Employee>(`/employees/${id}/`, data);
  },

  /**
   * Delete an employee
   */
  async deleteEmployee(id: string): Promise<void> {
    return apiClient.delete<void>(`/employees/${id}/`);
  },

  /**
   * Get employee statistics
   */
  async getEmployeeStats(): Promise<EmployeeStats> {
    return apiClient.get<EmployeeStats>('/employees/stats/');
  },

  /**
   * Get employee skills
   */
  async getEmployeeSkills(employeeId: string): Promise<any[]> {
    return apiClient.get<any[]>(`/employees/${employeeId}/skills/`);
  },
};

export default employeeService;

