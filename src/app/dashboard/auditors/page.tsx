"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { ChartCard } from "@/components/Dashboard/chart-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { AuditorScheduler } from "@/components/Scheduler/auditor-scheduler";
import { dashboardService, type AuditorMetrics } from "@/services/dashboard.service";

export default function AuditorsDashboardPage() {
  const [metrics, setMetrics] = useState<AuditorMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditorData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getAuditorMetrics();
        setMetrics(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch auditor data:", err);
        setError(err.message || "Failed to load auditor data");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditorData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Auditor Performance
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Track individual and team auditor metrics
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

        {/* Team Metrics */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Avg Utilization"
            value="82%"
            trend={{ value: 5, isPositive: true }}
            status="normal"
          />
          <KPICard
            title="Audits Completed"
            value="23"
            trend={{ value: 3, isPositive: true }}
            status="normal"
          />
          <KPICard
            title="Quality Score"
            value="4.6/5.0"
            trend={{ value: 2, isPositive: true }}
            status="normal"
          />
          <KPICard
            title="Client Satisfaction"
            value="94%"
            trend={{ value: 2, isPositive: true }}
            status="normal"
          />
        </div>

        {/* Individual Auditor Performance */}
        <WidgetCard
          title="Individual Auditor Performance"
          action={
            <button className="text-sm font-medium text-primary hover:text-primary-hover">
              Export Report
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Audits
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Util %
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Quality
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Satisfaction
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Sarah Mitchell",
                    audits: 8,
                    util: 92,
                    revenue: "$36,000",
                    quality: "4.8/5",
                    satisfaction: "96%",
                    status: "🏆",
                  },
                  {
                    name: "James Kennedy",
                    audits: 6,
                    util: 78,
                    revenue: "$27,000",
                    quality: "4.5/5",
                    satisfaction: "92%",
                    status: "✓",
                  },
                  {
                    name: "Linda Peterson",
                    audits: 5,
                    util: 85,
                    revenue: "$22,500",
                    quality: "4.7/5",
                    satisfaction: "95%",
                    status: "✓",
                  },
                  {
                    name: "Michael Roberts",
                    audits: 4,
                    util: 65,
                    revenue: "$18,000",
                    quality: "4.3/5",
                    satisfaction: "88%",
                    status: "⚠",
                  },
                  {
                    name: "Emma Thompson",
                    audits: 0,
                    util: 45,
                    revenue: "$0",
                    quality: "N/A",
                    satisfaction: "N/A",
                    status: "⚠",
                  },
                ].map((auditor) => (
                  <tr
                    key={auditor.name}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 font-medium text-dark dark:text-white">
                      {auditor.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {auditor.audits}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {auditor.util}%
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {auditor.revenue}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {auditor.quality}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {auditor.satisfaction}
                    </td>
                    <td className="px-4 py-3 text-lg">{auditor.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WidgetCard>

        {/* Charts Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard
            title="Utilization Trend"
            subtitle="6-month trend by auditor"
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Chart visualization coming soon
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Target: 80%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Sarah: 92%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  James: 78%
                </span>
              </div>
            </div>
          </ChartCard>

          <WidgetCard title="Certification Expertise">
            <div className="space-y-4">
              {[
                { cert: "ISO 9001", audits: 12, percentage: 100 },
                { cert: "ISO 14001", audits: 8, percentage: 67 },
                { cert: "ISO 45001", audits: 6, percentage: 50 },
                { cert: "ISO 27001", audits: 4, percentage: 33 },
                { cert: "ISO 22000", audits: 2, percentage: 17 },
              ].map((cert) => (
                <div key={cert.cert}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {cert.cert}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {cert.audits} audits
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${cert.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Most in-demand: <span className="font-medium text-dark dark:text-white">ISO 9001</span></p>
              <p>Gap area: <span className="font-medium text-dark dark:text-white">ISO 27001</span></p>
            </div>
          </WidgetCard>
        </div>

        {/* Audit Cycle Time and Feedback */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard
            title="Audit Cycle Time"
            subtitle="Distribution by auditor"
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Chart visualization coming soon
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Average: 5.2 days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Fastest: Sarah (4.2 days)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Slowest: Michael (6.8 days)
                </span>
              </div>
            </div>
          </ChartCard>

          <WidgetCard title="Client Feedback Summary">
            <div className="space-y-4">
              {[
                {
                  comment: "Sarah was thorough and professional",
                  client: "ABC Corp",
                  rating: "⭐⭐⭐⭐⭐",
                },
                {
                  comment: "Great attention to detail",
                  client: "XYZ Industries",
                  rating: "⭐⭐⭐⭐",
                },
              ].map((feedback, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <p className="text-sm text-dark dark:text-white">
                    "{feedback.comment}"
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {feedback.client}
                    </span>
                    <span className="text-sm">{feedback.rating}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="text-sm font-medium text-primary hover:text-primary-hover">
                All Feedback (47) →
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

