"use client";

import { useState, useMemo } from "react";
import { Task, TaskPriority } from "@/types/audit";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { TaskOverviewCard } from "@/components/Tasks/task-overview-card";
import { PriorityTaskItem } from "@/components/Tasks/priority-task-item";

type TimeView = "today" | "week" | "month";

interface AuditorSchedulerProps {
  tasks?: Task[];
  onTaskComplete?: (taskId: string) => void;
  onTaskSnooze?: (taskId: string) => void;
  onTaskAction?: (taskId: string, action: string) => void;
}

const MOCK_SCHEDULER_TASKS: Task[] = [];

export function AuditorScheduler({
  tasks = MOCK_SCHEDULER_TASKS,
  onTaskComplete,
  onTaskSnooze,
  onTaskAction,
}: AuditorSchedulerProps) {
  const [currentView, setCurrentView] = useState<TimeView>("today");

  // Calculate date ranges for filtering
  const dateRanges = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      today: { start: today, end: tomorrow },
      week: { start: today, end: weekEnd },
      month: { start: today, end: monthEnd },
    };
  }, []);

  // Filter tasks based on current view
  const filteredTasks = useMemo(() => {
    const range = dateRanges[currentView];
    return tasks
      .filter((task) => 
        task.status !== "completed" &&
        task.dueDate >= range.start && 
        task.dueDate < range.end
      )
      .sort((a, b) => {
        // Sort by priority first, then by due date
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                            priorityOrder[b.priority as keyof typeof priorityOrder];
        if (priorityDiff !== 0) return priorityDiff;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });
  }, [tasks, currentView, dateRanges]);

  // Calculate statistics for each view
  const stats = useMemo(() => {
    const today = dateRanges.today;
    const week = dateRanges.week;
    const month = dateRanges.month;

    const todayTasks = tasks.filter(t => 
      t.status !== "completed" && 
      t.dueDate >= today.start && 
      t.dueDate < today.end
    ).length;

    const weekTasks = tasks.filter(t => 
      t.status !== "completed" && 
      t.dueDate >= week.start && 
      t.dueDate < week.end
    ).length;

    const monthTasks = tasks.filter(t => 
      t.status !== "completed" && 
      t.dueDate >= month.start && 
      t.dueDate < month.end
    ).length;

    const overdueTasks = tasks.filter(t => 
      t.status !== "completed" && 
      t.dueDate < today.start
    ).length;

    return {
      today: todayTasks,
      week: weekTasks,
      month: monthTasks,
      overdue: overdueTasks,
    };
  }, [tasks, dateRanges]);

  // Get title and description for current view
  const getViewInfo = () => {
    switch (currentView) {
      case "today":
        return {
          title: "Today's Schedule",
          description: `${stats.today} tasks due today`,
          emptyMessage: "No tasks due today. Great job staying on top of things!",
        };
      case "week":
        return {
          title: "This Week's Schedule", 
          description: `${stats.week} tasks due this week`,
          emptyMessage: "No tasks due this week. You're all caught up!",
        };
      case "month":
        return {
          title: "This Month's Schedule",
          description: `${stats.month} tasks due this month`,
          emptyMessage: "No tasks due this month. Well planned!",
        };
      default:
        return { title: "", description: "", emptyMessage: "" };
    }
  };

  const viewInfo = getViewInfo();

  // Group tasks by date for better organization
  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: Task[] } = {};
    
    filteredTasks.forEach(task => {
      const dateKey = task.dueDate.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });

    return Object.entries(groups).sort(([a], [b]) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
  }, [filteredTasks]);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "long", 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  return (
    <WidgetCard 
      title="Task Scheduler"
      action={
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {viewInfo.description}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Time Period Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView("today")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === "today"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Today ({stats.today})
            </button>
            <button
              onClick={() => setCurrentView("week")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === "week"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              This Week ({stats.week})
            </button>
            <button
              onClick={() => setCurrentView("month")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === "month"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              This Month ({stats.month})
            </button>
          </div>

          {/* Quick Stats */}
          {stats.overdue > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
              <span>⚠️</span>
              <span>{stats.overdue} overdue task{stats.overdue !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {groupedTasks.length > 0 ? (
            groupedTasks.map(([dateString, dateTasks]) => (
              <div key={dateString} className="space-y-3">
                {/* Date Header */}
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-dark dark:text-white">
                    {formatDateHeader(dateString)}
                  </h3>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Tasks for this date */}
                <div className="space-y-3">
                  {dateTasks.map((task) => (
                    <PriorityTaskItem
                      key={task.id}
                      task={task}
                      onComplete={onTaskComplete}
                      onSnooze={onTaskSnooze}
                      onAction={onTaskAction}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
                All Clear!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {viewInfo.emptyMessage}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {filteredTasks.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-hover border border-primary rounded-lg hover:bg-primary/5 transition-colors">
              Mark All Complete
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Bulk Reschedule
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Export Schedule
            </button>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}