"use client";

import { useState, useMemo } from "react";
import { SchedulerItem, SchedulerItemStatus, KanbanColumn } from "@/types/scheduler";
import { WidgetCard } from "@/components/Dashboard/widget-card";

interface SchedulerKanbanProps {
  data: SchedulerItem[];
  onStatusChange: (itemId: string, newStatus: SchedulerItemStatus) => void;
  onItemUpdate: (itemId: string, updates: Partial<SchedulerItem>) => void;
}

export function SchedulerKanban({ data, onStatusChange, onItemUpdate }: SchedulerKanbanProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Define Kanban columns
  const columns: KanbanColumn[] = useMemo(() => [
    {
      id: "not-started",
      title: "Not Started",
      status: "not-started",
      items: data.filter(item => item.status === "not-started"),
      color: "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800",
    },
    {
      id: "in-progress",
      title: "In Progress",
      status: "in-progress",
      items: data.filter(item => item.status === "in-progress"),
      color: "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20",
    },
    {
      id: "review",
      title: "Review",
      status: "review",
      items: data.filter(item => item.status === "review"),
      color: "border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20",
    },
    {
      id: "blocked",
      title: "Blocked",
      status: "blocked",
      items: data.filter(item => item.status === "blocked"),
      color: "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20",
    },
    {
      id: "completed",
      title: "Completed",
      status: "completed",
      items: data.filter(item => item.status === "completed"),
      color: "border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20",
    },
  ], [data]);

  const getTypeIcon = (type: SchedulerItem['type']) => {
    switch (type) {
      case "task": return "📋";
      case "audit-activity": return "🔍";
      case "checklist": return "✅";
      case "workflow": return "🔄";
      default: return "📄";
    }
  };

  const getPriorityColor = (priority: SchedulerItem['priority']) => {
    switch (priority) {
      case "critical": return "border-l-red-500";
      case "high": return "border-l-orange-500";
      case "medium": return "border-l-yellow-500";
      case "low": return "border-l-green-500";
      default: return "border-l-gray-500";
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
        month: "short", 
        day: "numeric" 
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: SchedulerItemStatus) => {
    e.preventDefault();
    if (draggedItem) {
      onStatusChange(draggedItem, newStatus);
      setDraggedItem(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const renderKanbanCard = (item: SchedulerItem) => {
    const isOverdue = item.dueDate < new Date() && item.status !== "completed";
    
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragEnd={handleDragEnd}
        className={`bg-white dark:bg-gray-700 rounded-lg p-3 border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-move ${
          getPriorityColor(item.priority)
        } ${draggedItem === item.id ? "opacity-50" : ""} ${
          isOverdue ? "ring-2 ring-red-300 dark:ring-red-600" : ""
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(item.type)}</span>
            <span className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
              {item.type.replace("-", " ")}
            </span>
          </div>
          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full">
            {item.priority}
          </span>
        </div>

        <h4 className="font-semibold text-sm text-dark dark:text-white mb-2 line-clamp-2">
          {item.title}
        </h4>

        {item.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span className={isOverdue ? "text-red-600 dark:text-red-400 font-medium" : ""}>
              {formatDate(item.dueDate)}
              {item.dueTime && ` ${item.dueTime}`}
            </span>
            {item.estimatedDuration && (
              <span>{Math.round(item.estimatedDuration / 60)}h</span>
            )}
          </div>

          {item.assignedToName && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              👤 {item.assignedToName}
            </div>
          )}

          {/* Progress indicators for specific types */}
          {item.type === "checklist" && "completionRate" in item && (
            <div className="text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium">{item.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${item.completionRate}%` }}
                />
              </div>
            </div>
          )}

          {item.type === "workflow" && "completionRate" in item && (
            <div className="text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-400">Workflow</span>
                <span className="font-medium">{item.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${item.completionRate}%` }}
                />
              </div>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {isOverdue && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
            ⚠ Overdue
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 min-h-96">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className={`rounded-lg border-2 border-dashed p-4 ${column.color}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark dark:text-white">
                  {column.title}
                </h3>
                <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
                  {column.items.length}
                </span>
              </div>

              <div
                className="space-y-3 min-h-32"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {column.items.length > 0 ? (
                  column.items.map(renderKanbanCard)
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-3xl mb-2">📋</div>
                    <p className="text-sm">Drop items here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <WidgetCard title="Kanban Summary">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="text-center">
              <div className="text-2xl font-bold text-dark dark:text-white">
                {column.items.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {column.title}
              </div>
            </div>
          ))}
        </div>
      </WidgetCard>
    </div>
  );
}