"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { useState } from "react";

export default function InvoiceManagementPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending" | "overdue" | "draft">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock invoice data
  const invoiceData = [
    {
      id: "INV-2025-001",
      number: "INV-2025-001",
      client: "ABC Corporation",
      auditId: "A-2025-142",
      auditType: "Initial Certification",
      amount: 160000,
      issueDate: "2025-10-21",
      dueDate: "2025-11-21",
      status: "pending",
      certifications: ["ISO 9001:2015", "ISO 14001:2015"],
      paymentTerms: "Net 30",
      description: "Initial certification audit for multiple standards"
    },
    {
      id: "INV-2025-002",
      number: "INV-2025-002",
      client: "XYZ Ltd",
      auditId: "A-2025-138",
      auditType: "Surveillance",
      amount: 45000,
      issueDate: "2025-10-15",
      dueDate: "2025-11-15",
      status: "paid",
      certifications: ["ISO 45001:2018"],
      paymentTerms: "Net 30",
      description: "Surveillance audit for occupational health and safety management",
      paidDate: "2025-10-28"
    },
    {
      id: "INV-2025-003",
      number: "INV-2025-003",
      client: "DEF Inc",
      auditId: "A-2025-135",
      auditType: "Recertification",
      amount: 215000,
      issueDate: "2025-10-08",
      dueDate: "2025-11-08",
      status: "overdue",
      certifications: ["ISO 9001:2015", "ISO 27001:2013"],
      paymentTerms: "Net 30",
      description: "Recertification audit for quality and information security management"
    },
    {
      id: "INV-2025-004",
      number: "INV-2025-004",
      client: "GHI Corp",
      auditId: "A-2025-130",
      auditType: "Initial Certification",
      amount: 78000,
      issueDate: "2025-09-28",
      dueDate: "2025-10-28",
      status: "paid",
      certifications: ["ISO 14001:2015"],
      paymentTerms: "Net 30",
      description: "Initial certification audit for environmental management",
      paidDate: "2025-10-25"
    },
    {
      id: "DRAFT-001",
      number: "DRAFT-001",
      client: "JKL Industries",
      auditId: "A-2025-150",
      auditType: "Stage 1",
      amount: 35000,
      issueDate: "",
      dueDate: "",
      status: "draft",
      certifications: ["ISO 9001:2015"],
      paymentTerms: "Net 30",
      description: "Stage 1 audit for quality management system"
    }
  ];

  const stats = {
    totalInvoices: invoiceData.length,
    totalAmount: invoiceData.reduce((sum, invoice) => sum + invoice.amount, 0),
    paidAmount: invoiceData
      .filter(invoice => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.amount, 0),
    pendingAmount: invoiceData
      .filter(invoice => invoice.status === "pending")
      .reduce((sum, invoice) => sum + invoice.amount, 0),
    overdueAmount: invoiceData
      .filter(invoice => invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.amount, 0),
    draftCount: invoiceData.filter(invoice => invoice.status === "draft").length
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      paid: "✅",
      pending: "⏳",
      overdue: "⚠️",
      draft: "📝",
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

  const filteredInvoices = invoiceData.filter(invoice => {
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.auditId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Invoice Management
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage and track all audit invoices and payments
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Export Invoices
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
              Create Invoice
            </button>
          </div>
        </div>

        {/* Invoice Overview */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <KPICard
            title="Total Invoices"
            value={stats.totalInvoices.toString()}
            status="normal"
            iconColor="primary"
          />
          <KPICard
            title="Total Amount"
            value={formatCurrency(stats.totalAmount)}
            status="normal"
            iconColor="primary"
          />
          <KPICard
            title="Paid"
            value={formatCurrency(stats.paidAmount)}
            trend={{ value: 15, isPositive: true }}
            status="normal"
            iconColor="success"
          />
          <KPICard
            title="Pending"
            value={formatCurrency(stats.pendingAmount)}
            status="warning"
            iconColor="accent"
          />
          <KPICard
            title="Overdue"
            value={formatCurrency(stats.overdueAmount)}
            status="critical"
            iconColor="error"
          />
        </div>

        {/* Filters and Search */}
        <WidgetCard title="Filters & Search">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Status: All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
            <input
              type="text"
              placeholder="Search by client, invoice number, or audit ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Reset Filters
            </button>
          </div>
        </WidgetCard>

        {/* Invoice Table */}
        <WidgetCard title={`Invoices (${filteredInvoices.length})`}>
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
                    Audit ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Issue Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 font-medium text-dark dark:text-white">
                      {invoice.number}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-dark dark:text-white">{invoice.client}</p>
                        <p className="text-xs text-gray-500">{invoice.auditType}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {invoice.auditId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-dark dark:text-white">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {invoice.issueDate || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {invoice.dueDate || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {getStatusIcon(invoice.status)} {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-primary hover:text-primary-hover text-xs font-medium">
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                          Edit
                        </button>
                        {invoice.status === "pending" && (
                          <button className="text-green-600 hover:text-green-800 text-xs font-medium">
                            Mark Paid
                          </button>
                        )}
                        {invoice.status === "draft" && (
                          <button className="text-orange-600 hover:text-orange-800 text-xs font-medium">
                            Send
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-800 text-xs font-medium">
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WidgetCard>

        {/* Invoice Analytics */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Payment Status Breakdown">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-green-600">Paid Invoices</span>
                <span className="font-medium">
                  {invoiceData.filter(i => i.status === "paid").length} / {invoiceData.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-600">Pending Payment</span>
                <span className="font-medium">
                  {invoiceData.filter(i => i.status === "pending").length} / {invoiceData.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-600">Overdue</span>
                <span className="font-medium">
                  {invoiceData.filter(i => i.status === "overdue").length} / {invoiceData.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Draft</span>
                <span className="font-medium">
                  {invoiceData.filter(i => i.status === "draft").length} / {invoiceData.length}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Collection Rate</span>
                  <span className="font-medium text-green-600">
                    {Math.round((stats.paidAmount / (stats.totalAmount - invoiceData.filter(i => i.status === "draft").reduce((sum, i) => sum + i.amount, 0))) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Recent Activities">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-dark dark:text-white">Payment Received</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">INV-2025-004 - GHI Corp - {formatCurrency(78000)}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Oct 25, 2025</p>
                  <p>2:30 PM</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-dark dark:text-white">Invoice Generated</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">INV-2025-001 - ABC Corporation - {formatCurrency(160000)}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Oct 21, 2025</p>
                  <p>10:15 AM</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-dark dark:text-white">Payment Received</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">INV-2025-002 - XYZ Ltd - {formatCurrency(45000)}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Oct 15, 2025</p>
                  <p>4:20 PM</p>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Quick Actions */}
        <WidgetCard title="Quick Actions">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
              <div className="text-2xl mb-2">📄</div>
              <p className="font-medium text-dark dark:text-white">Create Invoice</p>
              <p className="text-xs text-gray-500">Generate new invoice</p>
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
              <div className="text-2xl mb-2">📧</div>
              <p className="font-medium text-dark dark:text-white">Send Reminders</p>
              <p className="text-xs text-gray-500">Payment follow-ups</p>
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-medium text-dark dark:text-white">Revenue Report</p>
              <p className="text-xs text-gray-500">Export financial data</p>
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="font-medium text-dark dark:text-white">Invoice Settings</p>
              <p className="text-xs text-gray-500">Configure templates</p>
            </button>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}