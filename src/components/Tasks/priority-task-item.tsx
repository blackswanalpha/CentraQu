"use client";

import { Task, TaskPriority } from "@/types/audit";
import Link from "next/link";

interface PriorityTaskItemProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onSnooze?: (taskId: string) => void;
  onAction?: (taskId: string, action: string) => void;
}

const priorityIcons = {
  critical: "🔴",
  high: "🔴",
  medium: "🟠",
  low: "🟡",
};

const priorityLabels = {
  critical: "CRITICAL",
  high: "OVERDUE",
  medium: "TODAY",
  low: "TOMORROW",
};

export function PriorityTaskItem({
  task,
  onComplete,
  onSnooze,
  onAction,
}: PriorityTaskItemProps) {
  const daysOverdue = Math.floor(
    (new Date().getTime() - task.dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysOverdue > 0;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex items-start gap-3">
        <div className="text-2xl mt-1">
          {priorityIcons[task.priority as TaskPriority]}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-dark dark:text-white">
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Due: {task.dueDate.toLocaleDateString()} (
                {isOverdue ? `${daysOverdue} days ago` : "upcoming"})
              </p>
            </div>
          </div>

          {task.relatedAuditId && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Related to: Audit {task.relatedAuditId}
            </p>
          )}

          {task.assignedToName && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Assigned to: {task.assignedToName}
            </p>
          )}

          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => onComplete?.(task.id)}
              className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition"
            >
              ✓ COMPLETE NOW
            </button>
            <button
              onClick={() => onSnooze?.(task.id)}
              className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              SNOOZE
            </button>
            <button
              onClick={() => onAction?.(task.id, "reassign")}
              className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
            >
              REASSIGN
            </button>
            <Link
              href={`/tasks/${task.id}`}
              className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded hover:bg-primary/20 transition"
            >
              VIEW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

