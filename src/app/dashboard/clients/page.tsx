"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";

export default function ClientsDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Client Health
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Monitor client satisfaction, engagement, and retention metrics
          </p>
        </div>

        {/* Portfolio Overview */}
        <WidgetCard title="Client Portfolio Overview">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
                <p className="text-2xl font-bold text-dark dark:text-white">58</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-success">52</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
                <p className="text-2xl font-bold text-accent">4</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Churned</p>
                <p className="text-2xl font-bold text-error">2</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Avg Health Score
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div className="h-full bg-success w-3/4" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-dark dark:text-white">
                  78/100
                </span>
                <span className="text-sm text-success">↑ 3 pts</span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* At-Risk Clients */}
        <WidgetCard
          title="At-Risk Clients"
          action={
            <button className="text-sm font-medium text-primary hover:text-primary-hover">
              Take Action
            </button>
          }
        >
          <div className="space-y-4">
            {[
              {
                client: "ABC Corp",
                score: 42,
                risks: ["Payment overdue (45d)", "No communication (30d)", "Satisfaction: 2.1/5"],
                lastContact: "Oct 1",
              },
              {
                client: "XYZ Ltd",
                score: 65,
                risks: ["2 missed appointments", "Declining engagement"],
                lastContact: "Oct 12",
              },
            ].map((item) => (
              <div
                key={item.client}
                className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-dark dark:text-white">
                      🔴 {item.client}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Health Score: {item.score}/100
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Last: {item.lastContact}
                  </span>
                </div>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                  {item.risks.map((risk, idx) => (
                    <li key={idx}>• {risk}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button className="text-xs font-medium text-primary hover:underline">
                    ESCALATE
                  </button>
                  <button className="text-xs font-medium text-primary hover:underline">
                    SCHEDULE CALL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Charts Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Client Lifetime Value">
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Scatter plot visualization coming soon
              </p>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Top 20% of clients generate 65% of revenue
              </p>
            </div>
          </WidgetCard>

          <WidgetCard title="Retention Metrics">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Retention Rate
                  </span>
                  <span className="text-sm font-bold text-success">94%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                  <div className="h-full bg-success w-11/12" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Churn Rate
                  </span>
                  <span className="text-sm font-bold text-error">6%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                  <div className="h-full bg-error w-1/12" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Client Tenure
                </p>
                <p className="text-2xl font-bold text-dark dark:text-white mt-1">
                  3.2 years
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

