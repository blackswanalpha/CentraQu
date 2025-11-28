"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { TaskOverviewCard } from "@/components/Tasks/task-overview-card";
import { PriorityTaskItem } from "@/components/Tasks/priority-task-item";
import { Button } from "@/components/Dashboard/button";
import { Task } from "@/types/audit";
import { taskService } from "@/services/task.service";
import Link from "next/link";

// Helper function to convert API Task to component Task type
const convertToTaskItem = (task: any): Task => {
  return {
    id: task.id.toString(),
    title: task.title,
    description: task.description,
    status: task.status.toLowerCase().replace('_', '-') as any,
    priority: task.priority.toLowerCase() as any,
    category: task.task_type.toLowerCase().replace('_', '-') as any,
    progress: task.status.toLowerCase().replace('_', '-') as any,
    assignedTo: task.assigned_to?.toString(),
    assignedToName: task.assigned_to_name || 'Unassigned',
    dueDate: task.due_date ? new Date(task.due_date) : new Date(),
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
    relatedAuditId: task.client_name,
    completedAt: task.completed_date ? new Date(task.completed_date) : undefined,
  };
};

export default function TaskDashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await taskService.getTasks({
          ordering: '-created_at',
        });

        const taskItems = response.results.map(convertToTaskItem);
        setTasks(taskItems);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      myTasks: tasks.filter((t) => t.assignedTo === "current-user").length,
      overdue: tasks.filter((t) => t.dueDate < today && t.status !== "completed")
        .length,
      dueToday: tasks.filter(
        (t) =>
          t.dueDate >= today &&
          t.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000) &&
          t.status !== "completed"
      ).length,
      dueThisWeek: tasks.filter(
        (t) =>
          t.dueDate >= today &&
          t.dueDate < weekEnd &&
          t.status !== "completed"
      ).length,
    };
  }, [tasks]);

  const priorityTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== "completed")
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        );
      })
      .slice(0, 4);
  }, [tasks]);

  const handleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "completed", completedAt: new Date() }
          : t
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Task Management
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Overview of all tasks and reminders
            </p>
          </div>
          {!loading && (
          <Link href="/tasks/new">
            <Button variant="primary">+ Create Task</Button>
          </Link>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && !error && (
        <>

        {/* Task Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TaskOverviewCard
            title="MY TASKS"
            count={stats.myTasks}
            icon="📋"
            color="blue"
          />
          <TaskOverviewCard
            title="OVERDUE"
            count={stats.overdue}
            icon="⚠️"
            color="red"
          />
          <TaskOverviewCard
            title="DUE TODAY"
            count={stats.dueToday}
            icon="⏰"
            color="orange"
          />
          <TaskOverviewCard
            title="DUE THIS WEEK"
            count={stats.dueThisWeek}
            icon="📅"
            color="yellow"
          />
        </div>

        {/* Priority Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-dark dark:text-white">
              PRIORITY TASKS
            </h2>
            <Link href="/tasks/list" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>

          {priorityTasks.length > 0 ? (
            <div className="space-y-4">
              {priorityTasks.map((task) => (
                <PriorityTaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleTaskComplete}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No priority tasks at the moment
            </p>
          )}
        </div>

        {/* Upcoming Reminders & Completion Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              UPCOMING REMINDERS
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    2:00 PM Today
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Invoice creation reminder - XYZ Ltd
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    9:00 AM Tomorrow
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    License expiry alert - MNO Corp (30 days)
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/tasks/reminders"
              className="text-sm text-primary hover:underline mt-4 inline-block"
            >
              View All Reminders
            </Link>
          </div>

          {/* Completion Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              TASK COMPLETION TREND
            </h2>
            <div className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Chart visualization coming soon
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                This Week: <span className="font-semibold text-dark dark:text-white">85% complete</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Last Week: <span className="font-semibold text-dark dark:text-white">92% complete</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Trend: <span className="font-semibold text-accent">Declining ⚠️</span>
              </p>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}

