"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { Task, TaskStatus, TaskPriority, TaskCategory } from "@/types/audit";
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

const priorityIcons = {
  critical: "🔴",
  high: "🔴",
  medium: "🟠",
  low: "🟡",
};

function TaskListItem({ task }: { task: Task }) {
  const isOverdue =
    task.dueDate < new Date() && task.status !== "completed";

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <span className="text-lg">{priorityIcons[task.priority]}</span>
              <div>
                <h3 className="font-semibold text-dark dark:text-white">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Due: {task.dueDate.toLocaleDateString()} | Assigned to:{" "}
                  {task.assignedToName}
                </p>
                {task.relatedAuditId && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Related: Audit {task.relatedAuditId} | Category:{" "}
                    {task.category}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <button className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 transition">
              ✓ COMPLETE
            </button>
            <button className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 transition">
              EDIT
            </button>
            <Link
              href={`/tasks/${task.id}`}
              className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 transition"
            >
              VIEW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all"
  );
  const [groupBy, setGroupBy] = useState<"due-date" | "priority" | "assignee">(
    "due-date"
  );

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await taskService.getTasks({
          ordering: '-created_at',
          status: statusFilter !== "all" ? statusFilter.toUpperCase().replace('-', '_') : undefined,
          priority: priorityFilter !== "all" ? priorityFilter.toUpperCase() : undefined,
          search: searchTerm || undefined,
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

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [statusFilter, priorityFilter, searchTerm]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const groupedTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (groupBy === "due-date") {
      const groups: Record<string, Task[]> = {
        overdue: [],
        today: [],
        tomorrow: [],
        "this-week": [],
        later: [],
      };

      filteredTasks.forEach((task) => {
        const taskDate = new Date(
          task.dueDate.getFullYear(),
          task.dueDate.getMonth(),
          task.dueDate.getDate()
        );

        if (taskDate < today) {
          groups.overdue.push(task);
        } else if (taskDate.getTime() === today.getTime()) {
          groups.today.push(task);
        } else if (
          taskDate.getTime() ===
          new Date(today.getTime() + 24 * 60 * 60 * 1000).getTime()
        ) {
          groups.tomorrow.push(task);
        } else if (
          taskDate.getTime() <
          new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).getTime()
        ) {
          groups["this-week"].push(task);
        } else {
          groups.later.push(task);
        }
      });

      return groups;
    }

    return { all: filteredTasks };
  }, [filteredTasks, groupBy]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Task Management &gt; All Tasks
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Detailed list of all tasks with filtering
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

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")}
                className="rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | "all")}
                className="rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Group By:
              </span>
              {(["due-date", "priority", "assignee"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setGroupBy(option)}
                  className={`px-3 py-1 text-sm rounded transition ${
                    groupBy === option
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {option === "due-date" ? "Due Date" : option === "priority" ? "Priority" : "Assignee"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Groups */}
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([groupName, groupTasks]) => {
            if (groupTasks.length === 0) return null;

            const groupLabels: Record<string, string> = {
              overdue: "OVERDUE",
              today: "TODAY",
              tomorrow: "TOMORROW",
              "this-week": "THIS WEEK",
              later: "LATER",
              all: "ALL TASKS",
            };

            return (
              <div
                key={groupName}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
                  {groupLabels[groupName]} ({groupTasks.length} tasks)
                </h2>
                <div className="space-y-4">
                  {groupTasks.map((task) => (
                    <TaskListItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}

