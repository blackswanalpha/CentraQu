"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { Task } from "@/types/audit";
import Link from "next/link";

// Mock data
const MOCK_TASK: Task = {
  id: "1",
  title: "Create invoice for ABC Corp - Stage 2 Audit",
  description:
    "Generate and send invoice to ABC Corporation for the completed Stage 2 ISO 9001 certification audit.\n\nInvoice Amount: $18,000 (Second milestone payment)\nPayment Terms: Net 30 days\n\nAction Required:\n1. Generate invoice in Zoho Books\n2. Attach audit completion certificate\n3. Email to john.smith@abccorp.com\n4. Log in CRM and mark opportunity stage",
  status: "pending",
  priority: "high",
  category: "invoicing",
  progress: "not-started",
  assignedTo: "finance-team",
  assignedToName: "Finance Team",
  createdBy: "system",
  createdByName: "System (Automated)",
  dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  relatedAuditId: "A-2025-145",
  relatedClientId: "ABC-Corp",
  subtasks: [
    { id: "s1", title: "Verify audit completion status", completed: true },
    { id: "s2", title: "Confirm invoice amount with contract", completed: true },
    { id: "s3", title: "Generate invoice in Zoho Books", completed: false },
    { id: "s4", title: "Send invoice to client", completed: false },
  ],
};

export default function TaskDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, you would fetch the task using params.id
  const [task, setTask] = useState<Task>({ ...MOCK_TASK, id: params.id });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const handleMarkComplete = () => {
    setTask({
      ...task,
      status: "completed",
      completedAt: new Date(),
    });
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setTask({
      ...task,
      subtasks: task.subtasks?.map((s) =>
        s.id === subtaskId
          ? { ...s, completed: !s.completed, completedAt: new Date() }
          : s
      ),
    });
  };

  const daysOverdue = Math.floor(
    (new Date().getTime() - task.dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-2xl font-bold text-dark dark:text-white w-full border-b-2 border-primary pb-2"
                />
              ) : (
                <h1 className="text-2xl font-bold text-dark dark:text-white">
                  {task.title}
                </h1>
              )}
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(false)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditTitle(task.title);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <input
              type="checkbox"
              checked={task.status === "completed"}
              onChange={handleMarkComplete}
              className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-lg font-medium text-dark dark:text-white">
              Mark Complete
            </span>
          </div>
        </div>

        {/* Task Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              TASK INFORMATION
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Category
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {task.category}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {task.createdAt.toLocaleDateString()} by {task.createdByName}
                </p>
              </div>
              {task.relatedAuditId && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Related To
                  </p>
                  <Link
                    href={`/audits/${task.relatedAuditId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Audit: {task.relatedAuditId}
                  </Link>
                </div>
              )}
              {task.relatedClientId && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Client
                  </p>
                  <Link
                    href={`/clients/${task.relatedClientId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {task.relatedClientId}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              STATUS & PRIORITY
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </label>
                <select
                  value={task.status}
                  onChange={(e) =>
                    setTask({ ...task, status: e.target.value as any })
                  }
                  className="w-full mt-1 rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Priority
                </label>
                <select
                  value={task.priority}
                  onChange={(e) =>
                    setTask({ ...task, priority: e.target.value as any })
                  }
                  className="w-full mt-1 rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              {daysOverdue > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    ⚠️ Overdue by {daysOverdue} days
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assignment & Timing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
            ASSIGNMENT & TIMING
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Assigned To
              </label>
              <input
                type="text"
                value={task.assignedToName || ""}
                readOnly
                className="w-full mt-1 rounded-lg border-2 border-stroke px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Due Date
              </label>
              <input
                type="date"
                value={task.dueDate.toISOString().split("T")[0]}
                onChange={(e) =>
                  setTask({
                    ...task,
                    dueDate: new Date(e.target.value),
                  })
                }
                className="w-full mt-1 rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
            DESCRIPTION
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {task.description}
          </p>
        </div>

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              SUBTASKS ({completedSubtasks}/{totalSubtasks} completed)
            </h2>
            <div className="space-y-3">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtask(subtask.id)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span
                    className={`${
                      subtask.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-dark dark:text-white"
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={handleMarkComplete}>
            MARK COMPLETE
          </Button>
          <Link href="/tasks/list">
            <Button variant="secondary">BACK TO LIST</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

