"use client";

import { FormSelect } from "@/components/Dashboard/form-select";
import { FormInput } from "@/components/Dashboard/form-input";

interface FilterPanelProps {
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearAll: () => void;
  onSaveView?: () => void;
  filterOptions: {
    label: string;
    key: string;
    options: { label: string; value: string }[];
  }[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
}

export function FilterPanel({
  filters,
  onFilterChange,
  onClearAll,
  onSaveView,
  filterOptions,
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch,
}: FilterPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 md:p-6">
      <div className="space-y-4">
        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filterOptions.map((filter) => (
            <FormSelect
              key={filter.key}
              label={filter.label}
              value={filters[filter.key] || ""}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              options={filter.options}
            />
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {showSearch && (
            <div className="flex-1">
              <FormInput
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                icon="🔍"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClearAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Clear All
            </button>

            {onSaveView && (
              <button
                onClick={onSaveView}
                className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition"
              >
                Save View ▼
              </button>
            )}

            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              🔽 Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

