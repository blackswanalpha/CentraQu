"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";

export default function ActivityDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Activity Feed
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Real-time system activity and events
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-stroke text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900">
              Filters ▼
            </button>
            <button className="px-4 py-2 rounded-lg border border-stroke text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900">
              Pause
            </button>
          </div>
        </div>

        {/* Live Activity */}
        <WidgetCard title="Live Activity">
          <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="inline-block h-2 w-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-blue-900 dark:text-blue-100">
              Auto-refresh: ON ⟳
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                time: "Just now",
                icon: "🔵",
                message: "Sarah Mitchell completed ISO 9001 audit for ABC Corp",
                action: "View Report",
              },
              {
                time: "2 mins ago",
                icon: "💰",
                message: "Payment received: $4,500 from XYZ Ltd",
                action: "View in Zoho Books",
              },
              {
                time: "5 mins ago",
                icon: "📧",
                message: "Automated reminder sent to DEF Inc",
                action: "View Details",
              },
              {
                time: "12 mins ago",
                icon: "📋",
                message: "New opportunity created: GHI Partners - ISO 45001 - $32,000",
                action: "View Details",
              },
              {
                time: "18 mins ago",
                icon: "⚠️",
                message: "License compliance alert: JKL Enterprises ISO 27001 expires in 7 days",
                action: "Take Action",
              },
              {
                time: "25 mins ago",
                icon: "👤",
                message: "James Kennedy updated audit schedule - 3 audits rescheduled",
                action: "View Changes",
              },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors"
              >
                <div className="text-2xl flex-shrink-0">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.time}
                  </p>
                  <p className="text-sm font-medium text-dark dark:text-white mt-1">
                    {activity.message}
                  </p>
                  <button className="text-xs font-medium text-primary hover:underline mt-2">
                    {activity.action} →
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full py-3 text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              LOAD MORE ACTIVITIES
            </button>
          </div>
        </WidgetCard>

        {/* Analytics Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Activity Heatmap">
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Calendar heatmap visualization coming soon
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Busiest Day:</span>
                <span className="font-medium text-dark dark:text-white">Tuesday</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Slowest Day:</span>
                <span className="font-medium text-dark dark:text-white">Friday PM</span>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Peak Hours">
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Bar chart visualization coming soon
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Peak Time:</span>
                <span className="font-medium text-dark dark:text-white">10 AM - 12 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Quiet Time:</span>
                <span className="font-medium text-dark dark:text-white">1 PM - 3 PM</span>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

