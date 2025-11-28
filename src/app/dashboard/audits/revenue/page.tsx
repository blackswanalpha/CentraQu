"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { useState, useEffect } from "react";
import { auditService, type Audit } from "@/services/audit.service";

export default function AuditRevenuePage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [filterPeriod, setFilterPeriod] = useState<"month" | "quarter" | "year">("month");
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch completed audits for revenue tracking
        const response = await auditService.getAudits({
          status: 'COMPLETED',
          ordering: '-actual_end_date'
        });

        setAudits(response.results || []);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('Failed to load revenue data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from real audit data
  // Note: In a real system, this would come from invoices/payments
  const stats = {
    totalRevenue: audits.length * 75000, // Placeholder calculation
    paidRevenue: Math.floor(audits.length * 0.6) * 75000,
    pendingRevenue: Math.floor(audits.length * 0.3) * 75000,
    overdueRevenue: Math.floor(audits.length * 0.1) * 75000,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      partial: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      paid: "✅",
      pending: "⏳",
      partial: "🔵",
      overdue: "⚠️",
    };
    return icons[status] || "•";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // For now, we'll use a simple payment status assignment based on audit completion
  // In a real system, this would come from invoices/payments
  const getPaymentStatus = (index: number) => {
    const statuses = ['paid', 'pending', 'overdue', 'paid'];
    return statuses[index % statuses.length];
  };

  const filteredData = audits.filter((_, index) => {
    if (filterStatus === "all") return true;
    return getPaymentStatus(index) === filterStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Audit Revenue Management
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Track and manage revenue from all audit services
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Export Revenue Report
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
              Generate Invoice
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading revenue data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Revenue Overview */}
        {!loading && !error && (
          <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                status="normal"
                iconColor="primary"
              />
              <KPICard
                title="Paid Revenue"
                value={formatCurrency(stats.paidRevenue)}
                trend={{ value: 12, isPositive: true }}
                status="normal"
                iconColor="success"
              />
              <KPICard
                title="Pending Revenue"
                value={formatCurrency(stats.pendingRevenue)}
                status="warning"
                iconColor="accent"
              />
              <KPICard
                title="Overdue Revenue"
                value={formatCurrency(stats.overdueRevenue)}
                status="critical"
                iconColor="error"
              />
            </div>

        {/* Filters */}
        <WidgetCard title="Filters & Search">
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Status: All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial Payment</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <input
              type="text"
              placeholder="Search client or audit ID..."
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </WidgetCard>

        {/* Revenue Table */}
        <WidgetCard title="Audit Revenue Details">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Audit ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Certifications
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Total Revenue
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Payment Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                      No revenue data found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((audit, index) => {
                    const paymentStatus = getPaymentStatus(index);
                    const estimatedRevenue = 75000; // Placeholder - would come from invoices
                    const dueDate = audit.actual_end_date
                      ? new Date(new Date(audit.actual_end_date).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                      : 'N/A';

                    return (
                      <tr
                        key={audit.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <td className="px-4 py-3 font-medium text-dark dark:text-white">
                          {audit.audit_number}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {audit.client_name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-400">{audit.iso_standard_name}</span>
                              <span className="font-medium">{formatCurrency(estimatedRevenue)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-dark dark:text-white">
                          {formatCurrency(estimatedRevenue)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              paymentStatus
                            )}`}
                          >
                            {getStatusIcon(paymentStatus)} {paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {dueDate}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="text-primary hover:text-primary-hover text-xs font-medium">
                              View Invoice
                            </button>
                            {paymentStatus !== "paid" && (
                              <button className="text-green-600 hover:text-green-800 text-xs font-medium">
                                Mark Paid
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </WidgetCard>

        {/* Revenue Analytics */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Revenue by Certification Standard">
            <div className="space-y-4">
              {/* Calculate revenue by standard from real audit data */}
              {(() => {
                const revenueByStandard = audits.reduce((acc, audit) => {
                  const standard = audit.iso_standard_name || 'Unknown';
                  if (!acc[standard]) {
                    acc[standard] = 0;
                  }
                  acc[standard] += 75000; // Placeholder - would come from invoices
                  return acc;
                }, {} as Record<string, number>);

                return Object.entries(revenueByStandard).length > 0 ? (
                  Object.entries(revenueByStandard).map(([standard, revenue]) => (
                    <div key={standard} className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{standard}</span>
                      <span className="font-medium">{formatCurrency(revenue)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    No revenue data available
                  </div>
                );
              })()}
            </div>
          </WidgetCard>

          <WidgetCard title="Payment Status Overview">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Audits</span>
                <span className="font-medium">{audits.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-600">Paid Audits</span>
                <span className="font-medium">
                  {Math.floor(audits.length * 0.6)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-600">Pending Payment</span>
                <span className="font-medium">
                  {Math.floor(audits.length * 0.3)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-600">Overdue</span>
                <span className="font-medium">
                  {Math.floor(audits.length * 0.1)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Collection Rate</span>
                  <span className="font-medium text-green-600">
                    {stats.totalRevenue > 0 ? Math.round((stats.paidRevenue / stats.totalRevenue) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}