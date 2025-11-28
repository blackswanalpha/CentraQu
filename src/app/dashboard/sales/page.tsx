"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { ChartCard } from "@/components/Dashboard/chart-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { dashboardService, type SalesMetrics } from "@/services/dashboard.service";

export default function SalesDashboardPage() {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getSalesMetrics();
        setMetrics(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch sales data:", err);
        setError(err.message || "Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
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
            Sales Pipeline
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Visualize sales opportunities and conversion metrics
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

        {/* Pipeline Overview */}
        <WidgetCard
          title="Pipeline Overview"
          action={
            <button className="text-sm font-medium text-primary hover:text-primary-hover">
              + Add Opportunity
            </button>
          }
        >
          {loading ? (
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ) : metrics?.pipeline_stages ? (
            <div className="space-y-4">
              <div className="text-right mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Value:{" "}
                  <span className="font-bold text-dark dark:text-white">
                    {formatCurrency(
                      metrics.pipeline_stages.reduce((sum, stage) => sum + stage.value, 0)
                    )}
                  </span>
                </p>
              </div>

              {metrics.pipeline_stages.map((stage) => (
                <div key={stage.stage}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {stage.stage} ({stage.count})
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(stage.value)} • {stage.percentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No pipeline data available</p>
          )}
        </WidgetCard>

        {/* Opportunities Kanban */}
        <WidgetCard title="Opportunities by Stage">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { stage: "Qualified", count: 32 },
              { stage: "Proposal", count: 18 },
              { stage: "Negotiation", count: 9 },
              { stage: "Closed-Won", count: 6 },
            ].map((column) => (
              <div
                key={column.stage}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
              >
                <h4 className="font-semibold text-dark dark:text-white mb-4">
                  {column.stage}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({column.count})
                  </span>
                </h4>

                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {["ABC Corp", "XYZ Ltd", "DEF Inc", "GHI Co"][i - 1]}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        ISO 9001
                      </p>
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="font-medium text-dark dark:text-white">
                          ${18000 + i * 7000}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {15 + i * 7}d
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Revenue Forecast and At-Risk */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartCard
            title="Revenue Forecast"
            subtitle="Projected revenue over next 3 months"
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Chart visualization coming soon
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Conservative (30%):
                </span>
                <span className="font-medium text-dark dark:text-white">
                  $185K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Most Likely (60%):
                </span>
                <span className="font-medium text-dark dark:text-white">
                  $245K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Optimistic (90%):
                </span>
                <span className="font-medium text-dark dark:text-white">
                  $320K
                </span>
              </div>
            </div>
          </ChartCard>

          <WidgetCard title="Opportunities at Risk">
            <div className="space-y-3">
              {[
                { client: "ABC Corp", stage: "Proposal", days: 45, critical: true },
                { client: "XYZ Ltd", stage: "Negotiation", days: 38, critical: false },
                { client: "DEF Inc", stage: "Qualified", days: 52, critical: true },
              ].map((opp) => (
                <div
                  key={opp.client}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {opp.client}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {opp.stage} • {opp.days} days
                    </p>
                  </div>
                  <span className={opp.critical ? "text-error" : "text-accent"}>
                    {opp.critical ? "🔴" : "🟡"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="text-sm font-medium text-primary hover:text-primary-hover">
                View All At-Risk →
              </button>
            </div>
          </WidgetCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

