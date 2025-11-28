"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";

export default function OperationsDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Operational Efficiency
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Monitor process efficiency and identify bottlenecks
          </p>
        </div>

        {/* Efficiency Metrics */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Capacity Utilization"
            value="87%"
            trend={{ value: 5, isPositive: true }}
            status="normal"
          />
          <KPICard
            title="Response Time"
            value="2.3 hrs"
            trend={{ value: 0.7, isPositive: true }}
            status="normal"
          />
          <KPICard
            title="Task Completion"
            value="94%"
            trend={{ value: 3, isPositive: true }}
            status="normal"
          />
          <KPICard
            title="Document Search"
            value="<10 sec"
            trend={{ value: 15, isPositive: true }}
            status="normal"
          />
        </div>

        {/* Process Bottlenecks */}
        <WidgetCard title="Process Bottlenecks">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Workflow stages with drop-off rates
            </p>

            {[
              {
                stage: "Lead Created",
                volume: 45,
                avgTime: "-",
                bottleneck: false,
              },
              {
                stage: "Initial Contact",
                volume: 42,
                avgTime: "4.2 hrs",
                bottleneck: true,
              },
              {
                stage: "Proposal Sent",
                volume: 35,
                avgTime: "18 hrs",
                bottleneck: false,
              },
              {
                stage: "Contract Signed",
                volume: 28,
                avgTime: "5.2 days",
                bottleneck: true,
              },
              {
                stage: "Audit Scheduled",
                volume: 28,
                avgTime: "2.1 days",
                bottleneck: false,
              },
            ].map((item) => (
              <div
                key={item.stage}
                className={`p-4 rounded-lg border ${
                  item.bottleneck
                    ? "bg-orange-50 dark:bg-orange-950/20 border-accent"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark dark:text-white">
                      {item.stage}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Volume: {item.volume} • Avg Time: {item.avgTime}
                    </p>
                  </div>
                  {item.bottleneck && (
                    <span className="text-lg">⚠</span>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Recommendation: Automate initial contact templates
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Performance Metrics */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Workflow Efficiency">
            <div className="space-y-4">
              {[
                { metric: "Avg Lead-to-Audit Time", value: "12.3 days", target: "10 days" },
                { metric: "Proposal Acceptance Rate", value: "78%", target: "80%" },
                { metric: "Contract Turnaround", value: "5.2 days", target: "3 days" },
                { metric: "Audit Completion Rate", value: "94%", target: "95%" },
              ].map((item) => (
                <div key={item.metric}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {item.metric}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Target: {item.target}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard title="Resource Allocation">
            <div className="space-y-4">
              {[
                { resource: "Auditors", allocated: 5, available: 5, utilization: 87 },
                { resource: "Support Staff", allocated: 3, available: 3, utilization: 72 },
                { resource: "Admin", allocated: 2, available: 2, utilization: 65 },
              ].map((item) => (
                <div key={item.resource}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {item.resource}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.allocated}/{item.available} • {item.utilization}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

