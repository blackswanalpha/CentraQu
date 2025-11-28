"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { ChartCard } from "@/components/Dashboard/chart-card";
import { RevenueChart } from "@/components/Dashboard/revenue-chart";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { AuditorScheduler } from "@/components/Scheduler/auditor-scheduler";
import { dashboardService, type DashboardMetrics } from "@/services/dashboard.service";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getMainDashboard();
        setMetrics(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Welcome back! Here's your audit platform overview.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-900 dark:text-red-100">
              {error}
            </p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </>
          ) : metrics ? (
            <>
              <KPICard
                title="Actual Revenue"
                value={formatCurrency(metrics.actual_revenue)}
                trend={{ value: metrics.revenue_trend, isPositive: metrics.revenue_trend >= 0 }}
                status="normal"
                index={0}
              />
              <KPICard
                title="Completed Revenue"
                value={formatCurrency(metrics.completed_revenue)}
                trend={{ value: metrics.completed_revenue_trend, isPositive: metrics.completed_revenue_trend >= 0 }}
                status="normal"
                index={1}
              />
              <KPICard
                title="Active Audits"
                value={metrics.active_audits.toString()}
                trend={{ value: metrics.active_audits_trend, isPositive: metrics.active_audits_trend >= 0 }}
                status="normal"
                index={2}
              />
              <KPICard
                title="Overdue Invoices"
                value={metrics.overdue_invoices.toString()}
                trend={{ value: metrics.overdue_invoices_trend, isPositive: metrics.overdue_invoices_trend <= 0 }}
                status={metrics.overdue_invoices > 5 ? "warning" : "normal"}
                index={3}
              />
            </>
          ) : null}
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <RevenueChart />

          <WidgetCard title="Audit Pipeline">
            <div className="space-y-4">
              {[
                { label: "WIP", count: 12, percentage: 30 },
                { label: "Pending", count: 8, percentage: 20 },
                { label: "Scheduled", count: 15, percentage: 38 },
                { label: "Completed", count: 23, percentage: 58 },
              ].map((stage) => (
                <div key={stage.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {stage.label}: {stage.count} audits
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="text-sm font-medium text-primary hover:text-primary-hover">
                View Details →
              </button>
            </div>
          </WidgetCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Auditor Performance">
            <div className="space-y-3">
              {[
                { name: "Sarah M.", audits: 8, util: 92, status: "⭐" },
                { name: "James K.", audits: 6, util: 78, status: "✓" },
                { name: "Linda P.", audits: 5, util: 85, status: "✓" },
                { name: "Michael R.", audits: 4, util: 65, status: "⚠" },
              ].map((auditor) => (
                <div
                  key={auditor.name}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {auditor.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {auditor.audits} audits • {auditor.util}% util
                    </p>
                  </div>
                  <span className="text-lg">{auditor.status}</span>
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard title="Upcoming This Week">
            <div className="space-y-3">
              {[
                { day: "Mon 21", cert: "ISO 9001", client: "ABC Corp" },
                { day: "Tue 22", cert: "ISO 14001", client: "XYZ Industries" },
                { day: "Wed 23", cert: "ISO 45001", client: "DEF Limited" },
                { day: "Thu 24", cert: "Renewal", client: "GHI Partners" },
                { day: "Fri 25", cert: "Follow-up", client: "JKL Enterprises" },
              ].map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {event.day}: {event.cert}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {event.client}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="text-sm font-medium text-primary hover:text-primary-hover">
                View Calendar →
              </button>
            </div>
          </WidgetCard>
        </div>

        {/* Auditor Scheduler */}
        <AuditorScheduler />
      </div>
    </DashboardLayout>
  );
}

