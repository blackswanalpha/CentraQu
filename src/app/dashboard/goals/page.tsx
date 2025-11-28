"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";

export default function GoalsDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Goals & KPIs
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Track organizational goals and key performance indicators
            </p>
          </div>
          <select className="px-4 py-2 rounded-lg border border-stroke bg-white dark:bg-gray-800 text-sm">
            <option>Q4 2025</option>
            <option>Q3 2025</option>
            <option>Q2 2025</option>
            <option>Q1 2025</option>
          </select>
        </div>

        {/* Strategic Goals */}
        <WidgetCard title="Strategic Goals">
          <div className="space-y-4">
            {[
              {
                goal: "Increase Revenue to $500K",
                progress: 71,
                current: "$355K",
                target: "$500K",
                status: "on-track",
              },
              {
                goal: "Expand to 10 Auditors",
                progress: 60,
                current: "6 Auditors",
                target: "10 Auditors",
                status: "on-track",
              },
              {
                goal: "Achieve 95% Client Satisfaction",
                progress: 99,
                current: "94%",
                target: "95%",
                status: "at-risk",
              },
              {
                goal: "Launch New ISO 27001 Service",
                progress: 45,
                current: "In Development",
                target: "Q4 2025",
                status: "on-track",
              },
            ].map((item) => (
              <div key={item.goal} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-dark dark:text-white">
                      {item.goal}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {item.current} / {item.target}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.status === "on-track"
                        ? "bg-success/20 text-success"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {item.status === "on-track" ? "On Track" : "At Risk"}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.status === "on-track" ? "bg-success" : "bg-accent"
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* KPI Dashboard */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Revenue KPIs">
            <div className="space-y-4">
              {[
                { kpi: "Monthly Recurring Revenue", value: "$35,200", target: "$40,000", variance: "-12%" },
                { kpi: "Average Deal Size", value: "$13,500", target: "$15,000", variance: "-10%" },
                { kpi: "Customer Acquisition Cost", value: "$2,100", target: "$2,500", variance: "+16%" },
                { kpi: "Lifetime Value", value: "$42,000", target: "$45,000", variance: "-7%" },
              ].map((item) => (
                <div key={item.kpi} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {item.kpi}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Target: {item.target}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-dark dark:text-white">
                      {item.value}
                    </p>
                    <p className={`text-xs font-medium ${item.variance.startsWith("-") ? "text-error" : "text-success"}`}>
                      {item.variance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard title="Operational KPIs">
            <div className="space-y-4">
              {[
                { kpi: "Auditor Utilization", value: "82%", target: "80%", variance: "+2%" },
                { kpi: "Audit Completion Rate", value: "94%", target: "95%", variance: "-1%" },
                { kpi: "Client Retention Rate", value: "94%", target: "95%", variance: "-1%" },
                { kpi: "Average Response Time", value: "2.3 hrs", target: "2 hrs", variance: "-15%" },
              ].map((item) => (
                <div key={item.kpi} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {item.kpi}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Target: {item.target}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-dark dark:text-white">
                      {item.value}
                    </p>
                    <p className={`text-xs font-medium ${item.variance.startsWith("-") ? "text-error" : "text-success"}`}>
                      {item.variance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Trend Analysis */}
        <WidgetCard title="KPI Trends">
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Multi-line chart visualization coming soon
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Revenue Trend</p>
              <p className="text-lg font-bold text-success mt-1">↑ 8.5%</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Growth Rate</p>
              <p className="text-lg font-bold text-success mt-1">↑ 12.3%</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Efficiency</p>
              <p className="text-lg font-bold text-success mt-1">↑ 5.2%</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Satisfaction</p>
              <p className="text-lg font-bold text-accent mt-1">↓ 1.2%</p>
            </div>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

