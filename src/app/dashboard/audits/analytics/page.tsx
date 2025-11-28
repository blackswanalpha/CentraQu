"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { ChartCard } from "@/components/Dashboard/chart-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import {
  auditService,
  type AuditStats,
  type FindingStats,
  type SurveillanceStats,
} from "@/services/audit.service";
import {
  dashboardService,
  type FinancialMetrics,
  type AuditorMetrics,
} from "@/services/dashboard.service";

export default function AuditAnalyticsPage() {
  const [activeTab, setActiveTab] =
    useState<"audit" | "financial" | "performance">("audit");
  const [timeFilter, setTimeFilter] =
    useState<"1M" | "3M" | "6M" | "1Y">("6M");
  const [auditStats, setAuditStats] = useState<AuditStats | null>(null);
  const [findingStats, setFindingStats] = useState<FindingStats | null>(null);
  const [financialMetrics, setFinancialMetrics] =
    useState<FinancialMetrics | null>(null);
  const [auditorMetrics, setAuditorMetrics] =
    useState<AuditorMetrics | null>(null);
  const [surveillanceStats, setSurveillanceStats] =
    useState<SurveillanceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          auditStatsResponse,
          findingStatsResponse,
          financialResponse,
          auditorResponse,
          surveillanceResponse,
        ] = await Promise.all([
          auditService.getStats(),
          auditService.getFindingStats(),
          dashboardService.getFinancialMetrics(),
          dashboardService.getAuditorMetrics(),
          auditService.getSurveillanceAudits({ page_size: 10 }),
        ]);

        setAuditStats(auditStatsResponse.data);
        setFindingStats(findingStatsResponse.data);
        setFinancialMetrics(financialResponse);
        setAuditorMetrics(auditorResponse);
        setSurveillanceStats(surveillanceResponse.data.stats);
      } catch (err: any) {
        console.error("Failed to fetch audit analytics data:", err);
        setError(
          err?.message || "Failed to load audit analytics data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = (amount?: number | null) => {
    if (amount === null || amount === undefined) {
      return "—";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const auditorPerformance = auditorMetrics?.auditor_performance ?? [];
  const totalAuditors =
    auditorPerformance.length > 0 ? auditorPerformance.length : null;
  const totalAuditsCompleted =
    auditorPerformance.length > 0
      ? auditorPerformance.reduce(
          (sum, auditor) => sum + auditor.audits_completed,
          0
        )
      : null;
  const avgUtilization =
    auditorPerformance.length > 0
      ? auditorPerformance.reduce(
          (sum, auditor) => sum + auditor.utilization_rate,
          0
        ) / auditorPerformance.length
      : null;
  const avgRating =
    auditorPerformance.length > 0
      ? auditorPerformance.reduce(
          (sum, auditor) => sum + auditor.average_rating,
          0
        ) / auditorPerformance.length
      : null;

  const collectionRate =
    financialMetrics && financialMetrics.billed > 0
      ? (financialMetrics.collected / financialMetrics.billed) * 100
      : null;

  const revenuePerAudit =
    financialMetrics && auditStats && auditStats.total > 0
      ? financialMetrics.revenue / auditStats.total
      : null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Audit Analytics
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Comprehensive audit and financial analysis dashboard
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last Year</option>
            </select>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
              Export Report
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8">
            {[
              { id: "audit", label: "Audit Analysis" },
              { id: "financial", label: "Financial Analysis" },
              { id: "performance", label: "Performance Analysis" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-900 dark:text-red-100">
              {error}
            </p>
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading analytics...
          </p>
        )}

        {/* Tab Content */}
        {activeTab === "audit" && (
          <div className="space-y-8">
            {/* Audit Key Metrics */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Total Audits"
                value={auditStats ? auditStats.total.toLocaleString() : "—"}
                status="normal"
                iconColor="primary"
              />
              <KPICard
                title="Scheduled Audits"
                value={auditStats ? auditStats.scheduled.toLocaleString() : "—"}
                status="normal"
                iconColor="accent"
              />
              <KPICard
                title="In Progress"
                value={auditStats ? auditStats.in_progress.toLocaleString() : "—"}
                status="normal"
                iconColor="info"
              />
              <KPICard
                title="Completed This Month"
                value={
                  auditStats
                    ? auditStats.completed_this_month.toLocaleString()
                    : "—"
                }
                status="normal"
                iconColor="success"
              />
            </div>

        {/* Trends and Performance */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard
            title="Audit Completion Trends"
            subtitle="Last 12 months"
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Chart visualization coming soon
              </p>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total completed audits
              </span>
              <span className="font-medium">
                {auditStats ? auditStats.completed.toLocaleString() : "—"}
              </span>
            </div>
          </ChartCard>

          <ChartCard
            title="Non-Conformance Rate Trends"
            subtitle="Major vs Minor findings"
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Chart visualization coming soon
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Major NCs
                </span>
                <span className="font-medium">
                  {findingStats && findingStats.by_type
                    ? `${findingStats.by_type.major.toLocaleString()} findings`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Minor NCs
                </span>
                <span className="font-medium">
                  {findingStats && findingStats.by_type
                    ? `${findingStats.by_type.minor.toLocaleString()} findings`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Observations
                </span>
                <span className="font-medium">
                  {findingStats && findingStats.by_type
                    ? `${findingStats.by_type.observations.toLocaleString()} findings`
                    : "—"}
                </span>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Auditor Performance */}
        <WidgetCard title="Auditor Performance Comparison">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left font-medium">Auditor</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Audits Completed
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Utilization Rate
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Average Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditorPerformance.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
                    >
                      No auditor performance data available.
                    </td>
                  </tr>
                ) : (
                  auditorPerformance.map((auditor) => (
                    <tr
                      key={auditor.name}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium">{auditor.name}</td>
                      <td className="px-4 py-3">
                        {auditor.audits_completed.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {`${auditor.utilization_rate.toFixed(1)}%`}
                      </td>
                      <td className="px-4 py-3">
                        {auditor.average_rating.toFixed(1)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </WidgetCard>

        {/* Revenue and Certification Trends */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard title="Revenue Summary" subtitle="Key audit revenue metrics">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Revenue</span>
                <span className="font-medium">
                  {formatCurrency(financialMetrics?.revenue ?? null)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Billed</span>
                <span className="font-medium">
                  {formatCurrency(financialMetrics?.billed ?? null)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Collected</span>
                <span className="font-medium">
                  {formatCurrency(financialMetrics?.collected ?? null)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Accounts Receivable</span>
                <span className="font-medium">
                  {formatCurrency(financialMetrics?.accounts_receivable ?? null)}
                </span>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Certification Status" subtitle="Active certifications">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Certifications</span>
                <span className="font-medium">
                  {surveillanceStats
                    ? surveillanceStats.active.toLocaleString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Scheduled Surveillance</span>
                <span className="font-medium">
                  {surveillanceStats
                    ? surveillanceStats.scheduled_surveillance.toLocaleString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Overdue Surveillance</span>
                <span className="font-medium text-red-600">
                  {surveillanceStats
                    ? surveillanceStats.overdue_surveillance.toLocaleString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed This Year</span>
                <span className="font-medium text-green-600">
                  {surveillanceStats
                    ? surveillanceStats.completed_this_year.toLocaleString()
                    : "—"}
                </span>
              </div>
            </div>
          </ChartCard>
        </div>

            {/* Geographic Distribution */}
            <WidgetCard title="Geographic Distribution of Audits">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Geographic distribution analytics will appear here once audit
                location data is available.
              </p>
            </WidgetCard>

            {/* Audit Quality Metrics */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <WidgetCard title="Audit Quality Score">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Auditor Rating</span>
                    <span className="font-bold text-primary text-lg">
                      {avgRating !== null ? `${avgRating.toFixed(1)}/5` : "—"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Based on auditor performance metrics from the dashboard.
                  </p>
                </div>
              </WidgetCard>

              <WidgetCard title="Standard Distribution">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Standard-wise audit distribution will be shown here once
                  aggregated standard metrics are available.
                </p>
              </WidgetCard>
            </div>
          </div>
        )}

        {activeTab === "financial" && (
          <div className="space-y-8">
            {/* Financial Key Metrics */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Total Revenue"
                value={formatCurrency(financialMetrics?.revenue ?? null)}
                trend=
                  {financialMetrics
                    ? {
                        value: financialMetrics.revenue_trend,
                        isPositive: financialMetrics.revenue_trend >= 0,
                      }
                    : undefined}
                status="normal"
                iconColor="success"
              />
              <KPICard
                title="Revenue per Audit"
                value={
                  revenuePerAudit !== null
                    ? formatCurrency(revenuePerAudit)
                    : "—"
                }
                status="normal"
                iconColor="primary"
              />
              <KPICard
                title="Collection Rate"
                value={
                  collectionRate !== null
                    ? `${collectionRate.toFixed(1)}%`
                    : "—"
                }
                trend=
                  {financialMetrics
                    ? {
                        value: financialMetrics.collected_trend,
                        isPositive: financialMetrics.collected_trend >= 0,
                      }
                    : undefined}
                status="normal"
                iconColor="success"
              />
              <KPICard
                title="Outstanding Revenue"
                value={formatCurrency(
                  financialMetrics?.accounts_receivable ?? null
                )}
                trend=
                  {financialMetrics
                    ? {
                        value: financialMetrics.ar_trend,
                        isPositive: financialMetrics.ar_trend <= 0,
                      }
                    : undefined}
                status={
                  financialMetrics && financialMetrics.accounts_receivable > 0
                    ? "warning"
                    : "normal"
                }
                iconColor="error"
              />
            </div>

            {/* Revenue Analysis */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <ChartCard
                title="Revenue Overview"
                subtitle="Current period breakdown"
              >
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Total Revenue</span>
                    <span className="font-medium">
                      {formatCurrency(financialMetrics?.revenue ?? null)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Billed</span>
                    <span className="font-medium">
                      {formatCurrency(financialMetrics?.billed ?? null)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Collected</span>
                    <span className="font-medium">
                      {formatCurrency(financialMetrics?.collected ?? null)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Collection Rate</span>
                    <span className="font-medium">
                      {collectionRate !== null
                        ? `${collectionRate.toFixed(1)}%`
                        : "—"}
                    </span>
                  </div>
                </div>
              </ChartCard>

              <ChartCard
                title="Revenue by Standard"
                subtitle="Standard-level revenue will be available in a future release"
              >
                <div className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                    No standard-level revenue data is available from the API yet.
                  </p>
                </div>
              </ChartCard>
            </div>

            {/* Payment Analysis */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              <WidgetCard title="Payment Status">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-green-600">Collected</span>
                    <span className="font-medium">
                      {formatCurrency(financialMetrics?.collected ?? null)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-600">Billed (Uncollected)</span>
                    <span className="font-medium">
                      {financialMetrics && financialMetrics.billed !== null
                        ? formatCurrency(
                            Math.max(
                              financialMetrics.billed - financialMetrics.collected,
                              0
                            )
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">Outstanding (A/R)</span>
                    <span className="font-medium">
                      {formatCurrency(financialMetrics?.accounts_receivable ?? null)}
                    </span>
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard title="Revenue by Client Type">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Client-type revenue breakdown is not yet available from the
                  backend API.
                </p>
              </WidgetCard>

              <WidgetCard title="Top Revenue Clients">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Top client revenue analytics will be added once client-level
                  revenue data is exposed by the API.
                </p>
              </WidgetCard>
            </div>

            {/* Financial Forecasting */}
            <WidgetCard title="Revenue Forecasting">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Revenue forecasting will be added once pipeline and booking data
                endpoints are available. The current dashboard uses realized
                revenue, billing, and collection metrics from the API.
              </p>
            </WidgetCard>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="space-y-8">
            {/* Performance Key Metrics */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Team Utilization"
                value={
                  avgUtilization !== null
                    ? `${avgUtilization.toFixed(0)}%`
                    : "—"
                }
                status="normal"
                iconColor="primary"
              />
              <KPICard
                title="Quality Index"
                value={avgRating !== null ? `${avgRating.toFixed(1)}/5` : "—"}
                status="normal"
                iconColor="success"
              />
              <KPICard
                title="Total Audits Completed"
                value={
                  totalAuditsCompleted !== null
                    ? totalAuditsCompleted.toLocaleString()
                    : "—"
                }
                status="normal"
                iconColor="success"
              />
              <KPICard
                title="Number of Auditors"
                value={
                  totalAuditors !== null ? totalAuditors.toLocaleString() : "—"
                }
                status="normal"
                iconColor="primary"
              />
            </div>

            {/* Auditor Performance */}
            <WidgetCard title="Auditor Performance Comparison">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left font-medium">Auditor</th>
                      <th className="px-4 py-3 text-left font-medium">Audits Completed</th>
                      <th className="px-4 py-3 text-left font-medium">Utilization Rate</th>
                      <th className="px-4 py-3 text-left font-medium">Average Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditorPerformance.length === 0 ? (
                      <tr>
                        <td
                          className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                          colSpan={4}
                        >
                          No auditor performance data available.
                        </td>
                      </tr>
                    ) : (
                      auditorPerformance.map((auditor) => (
                        <tr
                          key={auditor.name}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <td className="px-4 py-3 font-medium">{auditor.name}</td>
                          <td className="px-4 py-3">
                            {auditor.audits_completed.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            {auditor.utilization_rate.toFixed(0)}%
                          </td>
                          <td className="px-4 py-3">
                            {auditor.average_rating.toFixed(1)}/5
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </WidgetCard>

            {/* Performance Analysis */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <WidgetCard title="Efficiency Metrics">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Average Utilization</span>
                    <span className="font-medium">
                      {avgUtilization !== null
                        ? `${avgUtilization.toFixed(0)}%`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Audits Completed</span>
                    <span className="font-medium">
                      {totalAuditsCompleted !== null
                        ? totalAuditsCompleted.toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard title="Resource Allocation">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Total Auditors</span>
                    <span className="font-medium">
                      {totalAuditors !== null
                        ? totalAuditors.toLocaleString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Audits per Auditor</span>
                    <span className="font-medium">
                      {totalAuditors !== null && totalAuditsCompleted !== null
                        ? (totalAuditsCompleted / totalAuditors).toFixed(1)
                        : "—"}
                    </span>
                  </div>
                </div>
              </WidgetCard>
            </div>

            {/* Capacity Planning */}
            <WidgetCard title="Capacity Planning & Forecasting">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Capacity planning metrics (cycle times, backlog, and projected
                capacity) will be added once scheduling and capacity APIs are
                available. For now, use auditor utilization and total audits
                completed as key performance indicators.
              </p>
            </WidgetCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

