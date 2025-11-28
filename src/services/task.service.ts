/**
 * Task Service
 * Handles all task-related API calls
 */

import { apiClient } from '@/lib/api-client';

export interface Task {
  id: number;
  title: string;
  description: string;
  task_type: string;
  priority: string;
  status: string;
  assigned_to?: number;
  assigned_to_name?: string;
  assigned_to_data?: any;
  created_by?: number;
  created_by_name?: string;
  created_by_data?: any;
  client?: number;
  client_name?: string;
  parent_task?: number;
  due_date?: string;
  start_date?: string;
  completed_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags?: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  subtasks?: Task[];
  subtasks_count?: number;
}

export interface TaskComment {
  id: number;
  task: number;
  author: number;
  author_name: string;
  author_data?: any;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TaskAttachment {
  id: number;
  task: number;
  file: string;
  file_name: string;
  file_size: number;
  uploaded_by: number;
  uploaded_by_name: string;
  created_at: string;
}

export interface TaskTemplate {
  id: number;
  name: string;
  description: string;
  task_type: string;
  template_data: any;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export interface TaskStats {
  total: number;
  by_status: {
    todo: number;
    in_progress: number;
    in_review: number;
    completed: number;
    cancelled: number;
    on_hold: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  overdue: number;
}

export const taskService = {
  /**
   * Get all tasks with optional filtering
   */
  async getTasks(params?: {
    search?: string;
    status?: string;
    priority?: string;
    task_type?: string;
    assigned_to?: number;
    client?: number;
    parent_task?: number;
    only_parents?: boolean;
    start_date?: string;
    end_date?: string;
    ordering?: string;
    page?: number;
  }): Promise<TaskListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.task_type) queryParams.append('task_type', params.task_type);
    if (params?.assigned_to) queryParams.append('assigned_to', params.assigned_to.toString());
    if (params?.client) queryParams.append('client', params.client.toString());
    if (params?.parent_task) queryParams.append('parent_task', params.parent_task.toString());
    if (params?.only_parents) queryParams.append('only_parents', 'true');
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/tasks/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<TaskListResponse>(endpoint);
  },

  /**
   * Get a single task by ID
   */
  async getTask(id: string | number): Promise<Task> {
    return apiClient.get<Task>(`/tasks/${id}/`);
  },

  /**
   * Get task statistics
   */
  async getStats(): Promise<{ success: boolean; data: TaskStats }> {
    return apiClient.get<{ success: boolean; data: TaskStats }>('/tasks/stats/');
  },




  /**
   * Create a new task
   */
  async createTask(data: Partial<Task>): Promise<Task> {
    return apiClient.post<Task>('/tasks/', data);
  },

  /**
   * Update a task
   */
  async updateTask(id: string | number, data: Partial<Task>): Promise<Task> {
    return apiClient.patch<Task>(`/tasks/${id}/`, data);
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/tasks/${id}/`);
  },

  /**
   * Mark task as completed
   */
  async completeTask(id: string | number): Promise<Task> {
    return apiClient.post<Task>(`/tasks/${id}/complete/`, {});
  },

  /**
   * Get task templates
   */
  async getTemplates(params?: {
    search?: string;
    task_type?: string;
    ordering?: string;
    page?: number;
  }): Promise<{ count: number; next: string | null; previous: string | null; results: TaskTemplate[] }> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.task_type) queryParams.append('task_type', params.task_type);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/task-templates/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{ count: number; next: string | null; previous: string | null; results: TaskTemplate[] }>(endpoint);
  },

  /**
   * Get task comments
   */
  async getComments(taskId: number): Promise<{ count: number; results: TaskComment[] }> {
    return apiClient.get<{ count: number; results: TaskComment[] }>(`/task-comments/?task=${taskId}`);
  },

  /**
   * Add a comment to a task
   */
  async addComment(taskId: number, content: string): Promise<TaskComment> {
    return apiClient.post<TaskComment>('/task-comments/', { task: taskId, content });
  },

  /**
   * Get task attachments
   */
  async getAttachments(taskId: number): Promise<{ count: number; results: TaskAttachment[] }> {
    return apiClient.get<{ count: number; results: TaskAttachment[] }>(`/task-attachments/?task=${taskId}`);
  },
};
