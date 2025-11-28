"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { TaskForm } from "@/components/Tasks/task-form";
import { Task } from "@/types/audit";
import { taskService } from "@/services/task.service";

export default function NewTaskPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Task) => {
    setIsLoading(true);
    setError(null);

    try {
      // Map frontend task structure to backend API format
      const taskData: any = {
        title: data.title,
        description: data.description || '',
        task_type: mapCategoryToTaskType(data.category),
        priority: mapPriorityToBackend(data.priority),
        status: mapStatusToBackend(data.status),
        assigned_to: data.assignedTo ? parseInt(data.assignedTo) : undefined,
        due_date: data.dueDate ? data.dueDate.toISOString() : undefined,
        tags: Array.isArray(data.tags) ? data.tags.join(',') : (data.tags || ''),
      };

      console.log("Creating task with data:", taskData);

      // Call the actual API
      const createdTask = await taskService.createTask(taskData);

      console.log("Task created successfully:", createdTask);

      // Redirect to tasks list
      router.push("/tasks/list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      console.error("Error creating task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to map frontend values to backend format
  const mapCategoryToTaskType = (category: string): string => {
    const mapping: Record<string, string> = {
      'audit-scheduling': 'AUDIT',
      'compliance': 'AUDIT',
      'sales': 'BUSINESS_DEV',
      'hr': 'ADMIN',
      'reporting': 'ADMIN',
      'invoicing': 'ADMIN',
      'vendor-payments': 'ADMIN',
      'approvals': 'ADMIN',
      'follow-ups': 'FOLLOW_UP',
      'other': 'ADMIN',
    };
    return mapping[category] || 'ADMIN';
  };

  const mapPriorityToBackend = (priority: string): string => {
    return priority.toUpperCase();
  };

  const mapStatusToBackend = (status: string): string => {
    const mapping: Record<string, string> = {
      'pending': 'TODO',
      'in-progress': 'IN_PROGRESS',
      'completed': 'COMPLETED',
      'cancelled': 'CANCELLED',
      'on-hold': 'ON_HOLD',
    };
    return mapping[status] || 'TODO';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Create New Task
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Create a new task and assign it to team members
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/tasks/templates")}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 dark:text-white dark:border-white dark:hover:bg-white/10"
            >
              📋 Use Template
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Success Tips */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips for Creating Effective Tasks
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use clear, action-oriented titles (e.g., "Review Q4 Financial Report")</li>
            <li>• Set realistic due dates and assign to the right team member</li>
            <li>• Break down complex tasks into subtasks for better tracking</li>
            <li>• Link related audits, clients, or contracts for context</li>
            <li>• Use templates for recurring tasks to save time</li>
          </ul>
        </div>

        {/* Form */}
        <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}

