"use client";

import { DocumentLibraryStats } from "@/types/document";

interface QuickStatsProps {
  stats: DocumentLibraryStats;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + " " + sizes[i];
};

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-dark dark:text-white mb-4">Quick Stats</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Documents */}
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {stats.totalDocuments.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Total Documents
          </p>
        </div>

        {/* Total Size */}
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {formatBytes(stats.totalSize)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Total Size
          </p>
        </div>

        {/* Storage Usage */}
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {stats.storageUsagePercentage}%
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Storage Used
          </p>
        </div>

        {/* Added This Month */}
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {stats.addedThisMonth}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Added This Month
          </p>
        </div>

        {/* Expiring Soon */}
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {stats.expiringDocuments}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Expiring Soon
          </p>
        </div>

        {/* Access Requests */}
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">
            {stats.pendingAccessRequests}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Access Requests
          </p>
        </div>
      </div>

      {/* Storage Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Storage Usage
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats.storageUsagePercentage}% of 100 GB
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${Math.min(stats.storageUsagePercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

