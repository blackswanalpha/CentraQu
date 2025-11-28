"use client";

import { SchedulerFilters as ISchedulerFilters, TimePeriod, SchedulerItemType, SchedulerItemStatus, Priority } from "@/types/scheduler";
import { WidgetCard } from "@/components/Dashboard/widget-card";

interface SchedulerFiltersProps {
  filters: ISchedulerFilters;
  timePeriod: TimePeriod;
  onFiltersChange: (filters: ISchedulerFilters) => void;
  onTimePeriodChange: (period: TimePeriod) => void;
}

export function SchedulerFilters({ 
  filters, 
  timePeriod, 
  onFiltersChange, 
  onTimePeriodChange 
}: SchedulerFiltersProps) {
  
  const handleFilterChange = (key: keyof ISchedulerFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMultiSelectChange = (key: keyof ISchedulerFilters, value: string, checked: boolean) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    handleFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof ISchedulerFilters];
    return value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0);
  });

  return (
    <WidgetCard 
      title="Filters"
      action={
        hasActiveFilters ? (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary-hover"
          >
            Clear All
          </button>
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Time Period */}
        <div>
          <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
            Time Period
          </label>
          <div className="space-y-1">
            {[
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ].map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="timePeriod"
                  value={option.value}
                  checked={timePeriod === option.value}
                  onChange={(e) => onTimePeriodChange(e.target.value as TimePeriod)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Item Type */}
        <div>
          <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
            Type
          </label>
          <div className="space-y-1">
            {[
              { value: "task", label: "📋 Tasks", icon: "📋" },
              { value: "audit-activity", label: "🔍 Audit Activities", icon: "🔍" },
              { value: "checklist", label: "✅ Checklists", icon: "✅" },
              { value: "workflow", label: "🔄 Workflows", icon: "🔄" },
            ].map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(filters.type || []).includes(option.value as SchedulerItemType)}
                  onChange={(e) => handleMultiSelectChange("type", option.value, e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
            Status
          </label>
          <div className="space-y-1">
            {[
              { value: "not-started", label: "Not Started" },
              { value: "in-progress", label: "In Progress" },
              { value: "review", label: "Review" },
              { value: "blocked", label: "Blocked" },
              { value: "completed", label: "Completed" },
              { value: "overdue", label: "Overdue" },
            ].map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(filters.status || []).includes(option.value as SchedulerItemStatus)}
                  onChange={(e) => handleMultiSelectChange("status", option.value, e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
            Priority
          </label>
          <div className="space-y-1">
            {[
              { value: "critical", label: "🔴 Critical" },
              { value: "high", label: "🟠 High" },
              { value: "medium", label: "🟡 Medium" },
              { value: "low", label: "🟢 Low" },
            ].map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(filters.priority || []).includes(option.value as Priority)}
                  onChange={(e) => handleMultiSelectChange("priority", option.value, e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
            Assigned To
          </label>
          <select
            value={filters.assignedTo || ""}
            onChange={(e) => handleFilterChange("assignedTo", e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white text-sm"
          >
            <option value="">All</option>
            <option value="current-user">Me</option>
            <option value="sarah-mitchell">Sarah Mitchell</option>
            <option value="james-kennedy">James Kennedy</option>
            <option value="linda-peterson">Linda Peterson</option>
            <option value="michael-roberts">Michael Roberts</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
            Search
          </label>
          <input
            type="text"
            value={filters.searchTerm || ""}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value || undefined)}
            placeholder="Search titles, descriptions..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white text-sm"
          />
        </div>
      </div>
    </WidgetCard>
  );
}