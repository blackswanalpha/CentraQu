"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { SchedulerKanban } from "@/components/Scheduler/scheduler-kanban";
import { SchedulerCalendar } from "@/components/Scheduler/scheduler-calendar";
import { SchedulerList } from "@/components/Scheduler/scheduler-list";
import { SchedulerFilters } from "@/components/Scheduler/scheduler-filters";
import { SchedulerStats } from "@/components/Scheduler/scheduler-stats";
import { schedulerService } from "@/services/scheduler.service";
import {
  SchedulerItem,
  SchedulerViewMode,
  TimePeriod,
  SchedulerFilters as ISchedulerFilters,
  TaskItem,
  AuditActivityItem,
  ChecklistItem,
  WorkflowItem
} from "@/types/scheduler";

// Mock data removed - now using real API data

export default function SchedulerPage() {
  const [currentView, setCurrentView] = useState<SchedulerViewMode>("list");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week");
  const [filters, setFilters] = useState<ISchedulerFilters>({});
  const [schedulerData, setSchedulerData] = useState<SchedulerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch scheduler data from API
  useEffect(() => {
    const fetchSchedulerData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate date range based on time period
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate = today.toISOString().split('T')[0];
        let endDate: string | undefined;

        switch (timePeriod) {
          case "today":
            endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case "week":
            endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case "month":
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
            break;
          case "all":
            startDate = new Date(today.getFullYear() - 1, 0, 1).toISOString().split('T')[0];
            endDate = new Date(today.getFullYear() + 1, 11, 31).toISOString().split('T')[0];
            break;
        }

        const items = await schedulerService.getSchedulerItems({
          start_date: startDate,
          end_date: endDate,
          assigned_to: filters.assignedTo ? parseInt(filters.assignedTo) : undefined,
          status: filters.status,
          priority: filters.priority,
          type: filters.type ? [filters.type] : undefined,
        });

        setSchedulerData(items);
      } catch (err) {
        console.error('Error fetching scheduler data:', err);
        setError('Failed to load scheduler data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedulerData();
  }, [timePeriod, filters]);

  // Filter data based on current filters and time period
  const filteredData = useMemo(() => {
    let filtered = [...schedulerData];

    // Apply time period filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    switch (timePeriod) {
      case "today":
        filtered = filtered.filter(item => 
          item.dueDate >= today && item.dueDate < tomorrow
        );
        break;
      case "week":
        filtered = filtered.filter(item => 
          item.dueDate >= today && item.dueDate < weekEnd
        );
        break;
      case "month":
        filtered = filtered.filter(item => 
          item.dueDate >= today && item.dueDate < monthEnd
        );
        break;
    }

    // Apply other filters
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(item => filters.type!.includes(item.type));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(item => filters.status!.includes(item.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(item => filters.priority!.includes(item.priority));
    }

    if (filters.assignedTo) {
      filtered = filtered.filter(item => item.assignedTo === filters.assignedTo);
    }

    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [schedulerData, timePeriod, filters]);

  // Handle item updates
  const handleItemUpdate = (itemId: string, updates: Partial<SchedulerItem>) => {
    setSchedulerData(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, ...updates, updatedAt: new Date() }
          : item
      )
    );
  };

  // Handle item status change (for Kanban drag & drop)
  const handleStatusChange = (itemId: string, newStatus: SchedulerItem['status']) => {
    handleItemUpdate(itemId, { status: newStatus });
  };

  // Handle item completion
  const handleItemComplete = (itemId: string) => {
    handleItemUpdate(itemId, { 
      status: "completed", 
      completedAt: new Date() 
    });
  };

  // Handle time period change
  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: ISchedulerFilters) => {
    setFilters(newFilters);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: SchedulerViewMode) => {
    setCurrentView(mode);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Scheduler
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage tasks, audit activities, checklists, and workflows
            </p>
          </div>

          {/* View Mode Toggle */}
          {!loading && (
          <div className="flex gap-2">
            <button
              onClick={() => handleViewModeChange("list")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === "list"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              📋 List
            </button>
            <button
              onClick={() => handleViewModeChange("kanban")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === "kanban"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              📊 Kanban
            </button>
            <button
              onClick={() => handleViewModeChange("calendar")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === "calendar"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              📅 Calendar
            </button>
          </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading scheduler data...</p>
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
        {/* Statistics */}
        <SchedulerStats
          data={filteredData}
          timePeriod={timePeriod}
        />

        {/* Filters */}
        <SchedulerFilters
          filters={filters}
          timePeriod={timePeriod}
          onFiltersChange={handleFiltersChange}
          onTimePeriodChange={handleTimePeriodChange}
        />

        {/* Main Content */}
        <div className="min-h-96">
          {currentView === "list" && (
            <SchedulerList
              data={filteredData}
              onItemUpdate={handleItemUpdate}
              onItemComplete={handleItemComplete}
            />
          )}
          
          {currentView === "kanban" && (
            <SchedulerKanban
              data={filteredData}
              onStatusChange={handleStatusChange}
              onItemUpdate={handleItemUpdate}
            />
          )}
          
          {currentView === "calendar" && (
            <SchedulerCalendar
              data={filteredData}
              onItemUpdate={handleItemUpdate}
              onItemComplete={handleItemComplete}
            />
          )}
        </div>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}