"use client";

import { useEffect, useState } from "react";
import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { ChartCard } from "@/components/Dashboard/chart-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { consultingService, DashboardOverviewData } from "@/services/consulting.service";

export default function ConsultingDashboardPage() {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await consultingService.getDashboardOverview();
        setData(response);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ConsultingDashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ConsultingDashboardLayout>
    );
  }

  if (!data) {
    return (
      <ConsultingDashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load dashboard data.</p>
        </div>
      </ConsultingDashboardLayout>
    );
  }

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Welcome back! Here's your consulting platform overview.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              Filter ▼
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="ACTIVE PROJECTS"
            value={data.active_projects_count.toString()}
            trend={{ value: 2, isPositive: true }}
          />
          <KPICard
            title="TOTAL REVENUE"
            value={`$${data.total_revenue.toLocaleString()}`}
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="UTILIZATION"
            value={`${data.utilization_rate}%`}
            trend={{ value: 5, isPositive: true }}
          />
          <KPICard
            title="REVENUE THIS QTR"
            value={`$${data.revenue_this_qtr.toLocaleString()}`}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Project Health Overview */}
          <WidgetCard
            title="Project Health Overview"
            action={
              <Link href="/consulting/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Project List
              </Link>
            }
          >
            <div className="space-y-4">
              {[
                { label: "On Track", ...data.project_health.on_track, color: "bg-green-500" },
                { label: "At Risk", ...data.project_health.at_risk, color: "bg-yellow-500" },
                { label: "Behind", ...data.project_health.behind, color: "bg-red-500" },
              ].map((status) => (
                <div key={status.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {status.label}: {status.count} projects
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ${(status.value / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full ${status.color} rounded-full`}
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-dark dark:text-white">
                  Total Value: ${data.total_revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </WidgetCard>

          {/* Resource Allocation */}
          <WidgetCard
            title="Resource Allocation"
            action={
              <Link href="/consulting/resources/allocation" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Resource Planning
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-center h-48">
                <div className="relative w-48 h-48">
                  {/* Donut Chart Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-dark dark:text-white">{data.utilization_rate}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Utilization</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Billable</span>
                  </div>
                  <p className="font-semibold text-dark dark:text-white">{data.resource_allocation.billable}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Admin</span>
                  </div>
                  <p className="font-semibold text-dark dark:text-white">{data.resource_allocation.admin}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Training</span>
                  </div>
                  <p className="font-semibold text-dark dark:text-white">{data.resource_allocation.training}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Bench</span>
                  </div>
                  <p className="font-semibold text-dark dark:text-white">{data.resource_allocation.bench}%</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Target: <span className="font-semibold text-dark dark:text-white">80%</span>
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Upcoming Milestones */}
          <WidgetCard
            title="Upcoming Milestones"
            action={
              <Link href="/consulting/projects/calendar" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Calendar
              </Link>
            }
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">Upcoming:</h4>
                {data.upcoming_milestones.length > 0 ? (
                  <ul className="space-y-2">
                    {data.upcoming_milestones.map((milestone: any, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">•</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-dark dark:text-white">{new Date(milestone.due_date).toLocaleDateString()}:</span> {milestone.title} - {milestone.project_name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No upcoming milestones.</p>
                )}
              </div>
            </div>
          </WidgetCard>

          {/* Team Workload */}
          <WidgetCard
            title="Team Workload"
            action={
              <Link href="/consulting/resources/allocation" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Rebalance Workload
              </Link>
            }
          >
            <div className="space-y-3">
              {data.team_workload.length > 0 ? (
                data.team_workload.map((consultant: any) => (
                  <div key={consultant.name} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-dark dark:text-white">
                          {consultant.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {consultant.projects} projects
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${consultant.utilization > 85 ? "bg-red-500" : consultant.utilization > 70 ? "bg-green-500" : "bg-blue-500"
                            }`}
                          style={{ width: `${consultant.utilization}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-dark dark:text-white w-12 text-right">
                      {consultant.utilization}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No consultant data available.</p>
              )}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ Overallocated: None
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Charts Row 3 */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Revenue Trend */}
          <ChartCard
            title="Revenue Trend"
            subtitle="6-month progression with target overlay"
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Oct: $47K recognized | $52K invoiced | $45K collected
                </p>
                <p className="text-sm font-medium text-dark dark:text-white">
                  Collection Rate: 94% | DSO: 28 days (Target: 30)
                </p>
              </div>
            </div>
          </ChartCard>

          {/* Client Portfolio */}
          <WidgetCard
            title="Client Portfolio"
            action={
              <Link href="/consulting/clients" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Client Dashboard
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-dark dark:text-white">12</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Active Clients</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark dark:text-white">3</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">New This Quarter</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark dark:text-white">2</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Renewals Pending</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">Top Clients:</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">ABC Corp</span>
                    <span className="font-semibold text-dark dark:text-white">$85K YTD</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">XYZ Ltd</span>
                    <span className="font-semibold text-dark dark:text-white">$72K YTD</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">DEF Inc</span>
                    <span className="font-semibold text-dark dark:text-white">$58K YTD</span>
                  </li>
                </ul>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

