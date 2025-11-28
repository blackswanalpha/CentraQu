"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { taskService } from "@/services/task.service";
import Link from "next/link";

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  taskCount: number;
  tasksByPriority: Record<string, number>;
}

export default function TaskCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Current month
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get tasks for current month
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const startDate = new Date(year, month, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

        const response = await taskService.getTasks({
          start_date: startDate,
          end_date: endDate,
          ordering: '-created_at',
        });

        setTasks(response.results);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load calendar data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        dayOfMonth: prevMonthLastDay - i,
        isCurrentMonth: false,
        taskCount: 0,
        tasksByPriority: {},
      });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      
      // Filter tasks for this day
      const dayTasks = tasks.filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return taskDate.getDate() === i && 
               taskDate.getMonth() === month && 
               taskDate.getFullYear() === year;
      });

      // Count tasks by priority
      const tasksByPriority = dayTasks.reduce((acc: Record<string, number>, task: any) => {
        const priority = task.priority?.toLowerCase() || 'medium';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, { critical: 0, high: 0, medium: 0, low: 0 });

      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: true,
        taskCount: dayTasks.length,
        tasksByPriority,
      });
    }

    // Next month's days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        dayOfMonth: i,
        isCurrentMonth: false,
        taskCount: 0,
        tasksByPriority: {},
      });
    }

    return days;
  }, [currentDate, tasks]);

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Task Management &gt; Calendar
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Visual calendar of all tasks
            </p>
          </div>
          {!loading && (
          <Link href="/tasks/new">
            <Button variant="primary">+ Create Task</Button>
          </Link>
          )}
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Calendar Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={previousMonth}
                className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 transition"
              >
                ◄
              </button>
              <h2 className="text-xl font-bold text-dark dark:text-white min-w-48 text-center">
                {monthName}
              </h2>
              <button
                onClick={nextMonth}
                className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 transition"
              >
                ►
              </button>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 transition">
                Month
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 transition">
                Week
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 transition">
                Day
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                My Tasks
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Team Tasks
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                All Tasks
              </span>
            </label>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`min-h-24 p-2 rounded-lg border-2 transition ${
                  day.isCurrentMonth
                    ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary"
                    : "border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-900"
                }`}
              >
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {day.dayOfMonth}
                </div>
                {day.taskCount > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {day.taskCount > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-lg">
                            {day.tasksByPriority.critical > 0 ? "🔴" : ""}
                            {day.tasksByPriority.high > 0 ? "🔴" : ""}
                            {day.tasksByPriority.medium > 0 ? "🟠" : ""}
                            {day.tasksByPriority.low > 0 ? "🟡" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {day.taskCount} tasks
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Tasks & Workload */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              TODAY'S TASKS ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
            </h2>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {(() => {
                    const today = new Date();
                    const todayTasks = tasks.filter(task => {
                      if (!task.due_date) return false;
                      const taskDate = new Date(task.due_date);
                      return taskDate.toDateString() === today.toDateString();
                    });
                    const overdueTasks = tasks.filter(task => {
                      if (!task.due_date) return false;
                      const taskDate = new Date(task.due_date);
                      return taskDate < today && task.status !== 'COMPLETED';
                    });
                    const completedToday = tasks.filter(task => {
                      if (!task.completed_date) return false;
                      const completedDate = new Date(task.completed_date);
                      return completedDate.toDateString() === today.toDateString();
                    });

                    return (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          🔴 <span className="font-medium">{overdueTasks.length} Overdue</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          🟠 <span className="font-medium">{todayTasks.length} Due Today</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          🟢 <span className="font-medium">{completedToday.length} Completed</span>
                        </p>
                      </>
                    );
                  })()}
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href="/tasks/list">
                    <Button variant="secondary">VIEW LIST</Button>
                  </Link>
                  <Button variant="secondary">PRINT</Button>
                </div>
              </>
            )}
          </div>

          {/* Workload Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              WORKLOAD DISTRIBUTION
            </h2>
            <div className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
              <p className="text-gray-500 dark:text-gray-400">
                Chart visualization coming soon
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                You: <span className="font-semibold text-dark dark:text-white">12 tasks</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Sarah: <span className="font-semibold text-dark dark:text-white">8 tasks</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                James: <span className="font-semibold text-dark dark:text-white">6 tasks</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Linda: <span className="font-semibold text-dark dark:text-white">10 tasks</span>
              </p>
            </div>
            <Button variant="secondary" className="w-full mt-4">
              REBALANCE WORKLOAD
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

