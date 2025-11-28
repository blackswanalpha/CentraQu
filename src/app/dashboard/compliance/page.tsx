"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";

export default function ComplianceDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              License Compliance
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Monitor certification license expirations and renewals
            </p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last Check: 1 hour ago
          </div>
        </div>

        {/* Compliance Status Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="p-6 rounded-lg border-2 border-error bg-red-50 dark:bg-red-950/20">
            <div className="text-3xl mb-2">🔴</div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              CRITICAL
            </p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-2">
              3 Licenses
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              &lt;14 days
            </p>
            <button className="mt-4 text-sm font-medium text-error hover:underline">
              View All →
            </button>
          </div>

          <div className="p-6 rounded-lg border-2 border-accent bg-orange-50 dark:bg-orange-950/20">
            <div className="text-3xl mb-2">🟡</div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              WARNING
            </p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-2">
              8 Licenses
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              14-30 days
            </p>
            <button className="mt-4 text-sm font-medium text-accent hover:underline">
              View All →
            </button>
          </div>

          <div className="p-6 rounded-lg border-2 border-success bg-green-50 dark:bg-green-950/20">
            <div className="text-3xl mb-2">🟢</div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              HEALTHY
            </p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-2">
              47 Licenses
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              &gt;30 days
            </p>
            <button className="mt-4 text-sm font-medium text-success hover:underline">
              View All →
            </button>
          </div>
        </div>

        {/* Critical Attention Required */}
        <WidgetCard
          title="Critical Attention Required"
          action={
            <button className="text-sm font-medium text-primary hover:text-primary-hover">
              Send Alerts
            </button>
          }
        >
          <div className="space-y-4">
            {[
              {
                client: "ABC Corp",
                cert: "ISO 9001",
                expiry: "Oct 28, 2025",
                days: 7,
                status: "Not Started",
              },
              {
                client: "XYZ Ltd",
                cert: "ISO 14001",
                expiry: "Nov 2, 2025",
                days: 12,
                status: "Proposal Sent",
              },
              {
                client: "DEF Inc",
                cert: "ISO 45001",
                expiry: "Nov 5, 2025",
                days: 15,
                status: "Awaiting Response",
              },
            ].map((license) => (
              <div
                key={license.client}
                className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-dark dark:text-white">
                      🔴 {license.client}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {license.cert} • Expires {license.expiry}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-error">{license.days} days</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {license.status}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs font-medium text-primary hover:underline">
                    START RENEWAL
                  </button>
                  <button className="text-xs font-medium text-primary hover:underline">
                    CONTACT CLIENT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Charts Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Upcoming Expirations (Next 90 Days)">
            <div className="space-y-4">
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan 2026</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>🔴🔴🔴</span>
                  <span>🟡🟡🟡🟡🟡</span>
                  <span>🟢🟢🟢🟢</span>
                  <span>🟢🟢🟢</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <span>(3)</span>
                  <span>(8)</span>
                  <span>(12)</span>
                  <span>(15)</span>
                </div>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Renewal Status Breakdown">
            <div className="space-y-3">
              {[
                { label: "Not Started", count: 15, percentage: 26, color: "bg-error" },
                { label: "In Progress", count: 28, percentage: 48, color: "bg-accent" },
                { label: "Completed", count: 10, percentage: 17, color: "bg-success" },
                { label: "Expired", count: 5, percentage: 9, color: "bg-gray-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* All Licenses Table */}
        <WidgetCard title="All Licenses">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Cert Type
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Expiry Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Days Left
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { client: "ABC Corp", cert: "ISO 9001", expiry: "Oct 28", days: 7, status: "🔴" },
                  { client: "XYZ Ltd", cert: "ISO 14001", expiry: "Nov 2", days: 12, status: "🔴" },
                  { client: "DEF Inc", cert: "ISO 45001", expiry: "Nov 5", days: 15, status: "🔴" },
                  { client: "GHI Co", cert: "ISO 9001", expiry: "Nov 15", days: 25, status: "🟡" },
                  { client: "JKL Ent", cert: "ISO 27001", expiry: "Dec 1", days: 41, status: "🟡" },
                  { client: "MNO Ltd", cert: "ISO 22000", expiry: "Jan 10", days: 81, status: "🟢" },
                ].map((license) => (
                  <tr
                    key={license.client}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 font-medium text-dark dark:text-white">
                      {license.client}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {license.cert}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {license.expiry}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {license.days}d
                    </td>
                    <td className="px-4 py-3 text-lg">{license.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

