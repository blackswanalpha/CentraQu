"use client";

import { useState } from "react";
import { SchedulerItem, TaskItem, AuditActivityItem, ChecklistItem, WorkflowItem } from "@/types/scheduler";
import { WidgetCard } from "@/components/Dashboard/widget-card";

interface SchedulerListProps {
  data: SchedulerItem[];
  onItemUpdate: (itemId: string, updates: Partial<SchedulerItem>) => void;
  onItemComplete: (itemId: string) => void;
}

export function SchedulerList({ data, onItemUpdate, onItemComplete }: SchedulerListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getTypeIcon = (type: SchedulerItem['type']) => {
    switch (type) {
      case "task": return "📋";
      case "audit-activity": return "🔍";
      case "checklist": return "✅";
      case "workflow": return "🔄";
      default: return "📄";
    }
  };

  const getStatusColor = (status: SchedulerItem['status']) => {
    switch (status) {
      case "not-started": return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      case "in-progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "review": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "completed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "blocked": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "overdue": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: SchedulerItem['priority']) => {
    switch (priority) {
      case "critical": return "border-l-red-500 bg-red-50 dark:bg-red-900/10";
      case "high": return "border-l-orange-500 bg-orange-50 dark:bg-orange-900/10";
      case "medium": return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10";
      case "low": return "border-l-green-500 bg-green-50 dark:bg-green-900/10";
      default: return "border-l-gray-500 bg-gray-50 dark:bg-gray-900/10";
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  const renderItemDetails = (item: SchedulerItem) => {
    switch (item.type) {
      case "task":
        const task = item as TaskItem;
        return (
          <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>Category: <span className="font-medium">{task.category}</span></div>
            {task.relatedAuditId && (
              <div>Related Audit: <span className="font-medium">{task.relatedAuditId}</span></div>
            )}
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <div className="font-medium mb-1">Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})</div>
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2 ml-4">
                    <input 
                      type="checkbox" 
                      checked={subtask.completed} 
                      readOnly
                      className="rounded"
                    />
                    <span className={subtask.completed ? "line-through" : ""}>{subtask.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "audit-activity":
        const audit = item as AuditActivityItem;
        return (
          <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>Client: <span className="font-medium">{audit.clientName}</span></div>
            <div>Standard: <span className="font-medium">{audit.standard}</span></div>
            <div>Activity: <span className="font-medium">{audit.activityType}</span></div>
            {audit.location && <div>Location: <span className="font-medium">{audit.location}</span></div>}
            {audit.leadAuditor && <div>Lead Auditor: <span className="font-medium">{audit.leadAuditor}</span></div>}
          </div>
        );

      case "checklist":
        const checklist = item as ChecklistItem;
        return (
          <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>Template: <span className="font-medium">{checklist.templateName}</span></div>
            <div>Completion: <span className="font-medium">{checklist.completionRate}%</span></div>
            <div>
              <div className="font-medium mb-1">Items ({checklist.items.filter(item => item.completed).length}/{checklist.items.length})</div>
              {checklist.items.map(checkItem => (
                <div key={checkItem.id} className="flex items-center gap-2 ml-4">
                  <input 
                    type="checkbox" 
                    checked={checkItem.completed} 
                    readOnly
                    className="rounded"
                  />
                  <span className={checkItem.completed ? "line-through" : ""}>{checkItem.title}</span>
                  {checkItem.required && <span className="text-red-500">*</span>}
                </div>
              ))}
            </div>
          </div>
        );

      case "workflow":
        const workflow = item as WorkflowItem;
        return (
          <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>Type: <span className="font-medium">{workflow.workflowType}</span></div>
            <div>Progress: <span className="font-medium">{workflow.completionRate}%</span></div>
            <div>Current Step: <span className="font-medium">{workflow.currentStep}/{workflow.steps.length}</span></div>
            <div>
              <div className="font-medium mb-1">Steps</div>
              {workflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 ml-4">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.status === "completed" ? "bg-green-500 text-white" :
                    step.status === "in-progress" ? "bg-blue-500 text-white" :
                    "bg-gray-300 text-gray-600"
                  }`}>
                    {index + 1}
                  </span>
                  <span className={step.status === "completed" ? "line-through" : ""}>
                    {step.title}
                  </span>
                  {step.approvalRequired && <span className="text-orange-500">⚠</span>}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (data.length === 0) {
    return (
      <WidgetCard title="Scheduler Items">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
            No items found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or time period selection.
          </p>
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard title={`Scheduler Items (${data.length})`}>
      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className={`border-l-4 rounded-lg p-4 ${getPriorityColor(item.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-2xl">{getTypeIcon(item.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-dark dark:text-white">
                      {item.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.replace("-", " ")}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      Due: {formatDate(item.dueDate)}
                      {item.dueTime && ` at ${item.dueTime}`}
                    </div>
                    {item.assignedToName && (
                      <div>Assigned to: {item.assignedToName}</div>
                    )}
                    {item.estimatedDuration && (
                      <div>Est. {Math.round(item.estimatedDuration / 60)}h</div>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {expandedItems.has(item.id) && renderItemDetails(item)}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  {expandedItems.has(item.id) ? "Less" : "More"}
                </button>
                {item.status !== "completed" && (
                  <button
                    onClick={() => onItemComplete(item.id)}
                    className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                  >
                    ✓ Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}