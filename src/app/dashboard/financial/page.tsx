"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { ChartCard } from "@/components/Dashboard/chart-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { dashboardService, type FinancialMetrics } from "@/services/dashboard.service";

export default function FinancialDashboardPage() {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getFinancialMetrics();
        setMetrics(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch financial data:", err);
        setError(err.message || "Failed to load financial data");
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Financial Dashboard
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Detailed financial metrics and Zoho Books integration
            </p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last sync: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-900 dark:text-red-100">
              {error}
            </p>
          </div>
        )}

        {/* Financial Overview Cards */}
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
                title="Revenue"
                value={formatCurrency(metrics.revenue)}
                trend={{ value: metrics.revenue_trend, isPositive: metrics.revenue_trend >= 0 }}
                status="normal"
              />
              <KPICard
                title="Billed"
                value={formatCurrency(metrics.billed)}
                trend={{ value: metrics.billed_trend, isPositive: metrics.billed_trend >= 0 }}
                status="normal"
              />
              <KPICard
                title="Collected"
                value={formatCurrency(metrics.collected)}
                trend={{ value: metrics.collected_trend, isPositive: metrics.collected_trend >= 0 }}
                status="normal"
              />
              <KPICard
                title="A/R"
                value={formatCurrency(metrics.accounts_receivable)}
                trend={{ value: metrics.ar_trend, isPositive: metrics.ar_trend <= 0 }}
                status={metrics.accounts_receivable > 50000 ? "warning" : "normal"}
              />
            </>
          ) : null}
        </div>

        {/* Revenue vs Expenses Chart */}
        <ChartCard
          title="Revenue vs Expenses (YTD)"
          subtitle="Monthly comparison with profit margin"
        >
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Chart visualization coming soon
            </p>
          </div>
        </ChartCard>

        {/* Financial Widgets Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Accounts Receivable Aging">
            {loading ? (
              <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ) : metrics?.ar_aging ? (
              <div className="space-y-4">
                {metrics.ar_aging.map((aging) => (
                  <div key={aging.range}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-dark dark:text-white">
                        {aging.range}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(aging.amount)} ({aging.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          aging.critical ? "bg-error" : "bg-primary"
                        }`}
                        style={{ width: `${aging.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No aging data available</p>
            )}
            <div className="mt-4">
              <button className="text-sm font-medium text-primary hover:text-primary-hover">
                Send Reminders →
              </button>
            </div>
          </WidgetCard>

          <WidgetCard title="Top 5 Clients by Revenue">
            <div className="space-y-3">
              {[
                { name: "ABC Corp", revenue: "$45,200", percentage: 100 },
                { name: "XYZ Industries", revenue: "$38,900", percentage: 86 },
                { name: "DEF Limited", revenue: "$22,100", percentage: 49 },
                { name: "GHI Partners", revenue: "$18,750", percentage: 41 },
                { name: "JKL Enterprises", revenue: "$17,550", percentage: 39 },
              ].map((client) => (
                <div key={client.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {client.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {client.revenue}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${client.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="text-sm font-medium text-primary hover:text-primary-hover">
                Full Client List →
              </button>
            </div>
          </WidgetCard>
        </div>

        {/* Recent Invoices Table */}
        <WidgetCard title="Recent Invoices (Synced from Zoho Books)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Invoice #
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "INV-1047",
                    client: "ABC Corp",
                    date: "Oct 18",
                    amount: "$4,500",
                    status: "Paid",
                    statusColor: "text-success",
                  },
                  {
                    id: "INV-1046",
                    client: "XYZ Ind.",
                    date: "Oct 15",
                    amount: "$3,200",
                    status: "Sent",
                    statusColor: "text-accent",
                  },
                  {
                    id: "INV-1045",
                    client: "DEF Ltd",
                    date: "Oct 12",
                    amount: "$5,100",
                    status: "Overdue",
                    statusColor: "text-error",
                  },
                  {
                    id: "INV-1044",
                    client: "GHI Part.",
                    date: "Oct 10",
                    amount: "$2,800",
                    status: "Paid",
                    statusColor: "text-success",
                  },
                  {
                    id: "INV-1043",
                    client: "JKL Ent.",
                    date: "Oct 8",
                    amount: "$6,400",
                    status: "Paid",
                    statusColor: "text-success",
                  },
                ].map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 text-dark dark:text-white">
                      {invoice.id}
                    </td>
                    <td className="px-4 py-3 text-dark dark:text-white">
                      {invoice.client}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {invoice.date}
                    </td>
                    <td className="px-4 py-3 font-medium text-dark dark:text-white">
                      {invoice.amount}
                    </td>
                    <td className={`px-4 py-3 font-medium ${invoice.statusColor}`}>
                      {invoice.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <button className="text-sm font-medium text-primary hover:text-primary-hover">
              Load More
            </button>
            <a
              href="#"
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              View in Zoho Books →
            </a>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

