"use client";

import { useMemo } from "react";
import { SchedulerItem, SchedulerStats as ISchedulerStats, TimePeriod } from "@/types/scheduler";
import { TaskOverviewCard } from "@/components/Tasks/task-overview-card";

interface SchedulerStatsProps {
  data: SchedulerItem[];
  timePeriod: TimePeriod;
}

export function SchedulerStats({ data, timePeriod }: SchedulerStatsProps) {
  const stats = useMemo((): ISchedulerStats => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Count by status
    const byStatus = data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count by type
    const byType = data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count by priority
    const byPriority = data.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate overdue
    const overdue = data.filter(item => 
      item.dueDate < today && item.status !== "completed"
    ).length;

    // Calculate due today
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dueToday = data.filter(item => 
      item.dueDate >= today && 
      item.dueDate < tomorrow && 
      item.status !== "completed"
    ).length;

    // Calculate due this week
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueThisWeek = data.filter(item => 
      item.dueDate >= today && 
      item.dueDate < weekEnd && 
      item.status !== "completed"
    ).length;

    // Calculate completion rate
    const completed = byStatus["completed"] || 0;
    const total = data.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      byStatus: {
        "not-started": byStatus["not-started"] || 0,
        "in-progress": byStatus["in-progress"] || 0,
        "review": byStatus["review"] || 0,
        "completed": byStatus["completed"] || 0,
        "blocked": byStatus["blocked"] || 0,
        "overdue": byStatus["overdue"] || 0,
      },
      byType: {
        "task": byType["task"] || 0,
        "audit-activity": byType["audit-activity"] || 0,
        "checklist": byType["checklist"] || 0,
        "workflow": byType["workflow"] || 0,
      },
      byPriority: {
        "critical": byPriority["critical"] || 0,
        "high": byPriority["high"] || 0,
        "medium": byPriority["medium"] || 0,
        "low": byPriority["low"] || 0,
      },
      overdue,
      dueToday,
      dueThisWeek,
      completionRate,
    };
  }, [data]);

  const getTimePeriodLabel = () => {
    switch (timePeriod) {
      case "today": return "Today";
      case "week": return "This Week";
      case "month": return "This Month";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <TaskOverviewCard
          title="TOTAL"
          count={stats.total}
          icon="📊"
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
          title="THIS WEEK"
          count={stats.dueThisWeek}
          icon="📅"
          color="yellow"
        />
        <TaskOverviewCard
          title="IN PROGRESS"
          count={stats.byStatus["in-progress"]}
          icon="🔄"
          color="blue"
        />
        <TaskOverviewCard
          title="COMPLETED"
          count={stats.byStatus.completed}
          icon="✅"
          color="green"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* By Type */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
            By Type
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byType).map(([type, count]) => {
              const icons = {
                "task": "📋",
                "audit-activity": "🔍", 
                "checklist": "✅",
                "workflow": "🔄",
              };
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icons[type as keyof typeof icons]}</span>
                    <span className="text-sm font-medium text-dark dark:text-white capitalize">
                      {type.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-dark dark:text-white w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
            By Status
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byStatus).map(([status, count]) => {
              const colors = {
                "not-started": "bg-gray-400",
                "in-progress": "bg-blue-500",
                "review": "bg-yellow-500",
                "completed": "bg-green-500",
                "blocked": "bg-red-500",
                "overdue": "bg-red-600",
              };
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`} />
                    <span className="text-sm font-medium text-dark dark:text-white capitalize">
                      {status.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${colors[status as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-dark dark:text-white w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Priority */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
            By Priority
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byPriority).map(([priority, count]) => {
              const colors = {
                "critical": "bg-red-500",
                "high": "bg-orange-500",
                "medium": "bg-yellow-500",
                "low": "bg-green-500",
              };
              const icons = {
                "critical": "🔴",
                "high": "🟠",
                "medium": "🟡",
                "low": "🟢",
              };
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icons[priority as keyof typeof icons]}</span>
                    <span className="text-sm font-medium text-dark dark:text-white capitalize">
                      {priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${colors[priority as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-dark dark:text-white w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Completion Rate - {getTimePeriodLabel()}
          </h3>
          <span className="text-2xl font-bold text-primary">
            {stats.completionRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-primary to-green-500 h-4 rounded-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${stats.completionRate}%` }}
          >
            {stats.completionRate > 10 && (
              <span className="text-white text-xs font-medium">
                {stats.completionRate}%
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {stats.byStatus.completed} of {stats.total} items completed
        </p>
      </div>
    </div>
  );
}