"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { ReportsAPI, type RevenueSummaryData, type PaymentAnalysisData, type ClientProfitabilityData, type RevenueForecastData } from "@/services/reports-api";

export default function FinancialReportsPage() {
  const [selectedReport, setSelectedReport] = useState("revenue-summary");
  const [dateRange, setDateRange] = useState("6M");
  const [filterClient, setFilterClient] = useState("all");
  const [filterStandard, setFilterStandard] = useState("all");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportTypes = [
    {
      id: "revenue-summary",
      name: "Revenue Summary Report",
      description: "Comprehensive revenue analysis across all audits and clients",
      icon: "💰"
    },
    {
      id: "payment-analysis",
      name: "Payment Analysis Report",
      description: "Payment tracking, collection rates, and outstanding amounts",
      icon: "💳"
    },
    {
      id: "client-profitability",
      name: "Client Profitability Report",
      description: "Revenue and profitability analysis by client",
      icon: "📈"
    },
    {
      id: "revenue-forecast",
      name: "Revenue Forecast Report",
      description: "Revenue projections and pipeline analysis",
      icon: "🔮"
    },
    {
      id: "cost-analysis",
      name: "Cost Analysis Report",
      description: "Audit costs, margins, and profitability metrics",
      icon: "📊"
    },
    {
      id: "invoice-tracking",
      name: "Invoice Tracking Report",
      description: "Invoice generation, delivery, and payment tracking",
      icon: "📄"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Load report data from API
  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ReportsAPI.getFinancialReports(
        selectedReport as any,
        {
          dateRange: dateRange as any,
          client: filterClient === 'all' ? undefined : filterClient,
          standard: filterStandard === 'all' ? undefined : filterStandard,
        }
      );
      setReportData(data);
    } catch (error) {
      console.error('Failed to load report data:', error);
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when report type or filters change
  useEffect(() => {
    loadReportData();
  }, [selectedReport, dateRange, filterClient, filterStandard]);

  const renderReportContent = () => {
    switch (selectedReport) {
      case "revenue-summary":
        const revenueData = reportData as RevenueSummaryData;
        return (
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(revenueData?.summary?.total_revenue || 0)}</p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">Current period</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Avg Revenue per Audit</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(revenueData?.summary?.avg_revenue_per_audit || 0)}</p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Average per audit</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Collection Rate</p>
                <p className="text-2xl font-bold text-yellow-600">{revenueData?.summary?.collection_rate || 0}%</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">Payment collection</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-300">Outstanding</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(revenueData?.summary?.outstanding_amount || 0)}</p>
                <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Pending payments</p>
              </div>
            </div>

            {/* Revenue by Standard */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <WidgetCard title="Revenue by Certification Standard">
                <div className="space-y-4">
                  {/* Note: This would need to be added to the backend API response */}
                  <div className="text-center py-4 text-gray-500">
                    Revenue by standard data will be available when integrated with audit data
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard title="Monthly Revenue Trends">
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-3">
                    {revenueData?.monthly_trends?.slice(-3).map((item) => (
                      <div key={item.month} className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.month}</p>
                        <p className="font-semibold">{formatCurrency(item.revenue)}</p>
                        <p className="text-xs text-gray-600">Monthly total</p>
                      </div>
                    )) || (
                      <div className="col-span-3 text-center py-4 text-gray-500">
                        No monthly trend data available
                      </div>
                    )}
                  </div>
                  {revenueData?.monthly_trends && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Period Total</span>
                        <span className="font-bold text-lg">
                          {formatCurrency(revenueData.monthly_trends.reduce((sum, month) => sum + month.revenue, 0))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </WidgetCard>
            </div>

            {/* Top Revenue Clients */}
            <WidgetCard title="Top Revenue Generating Clients">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left font-medium">Client</th>
                      <th className="px-4 py-3 text-left font-medium">Total Revenue</th>
                      <th className="px-4 py-3 text-left font-medium">Audits Completed</th>
                      <th className="px-4 py-3 text-left font-medium">Avg per Audit</th>
                      <th className="px-4 py-3 text-left font-medium">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData?.top_clients?.map((client) => (
                      <tr key={client.client_name} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 font-medium">{client.client_name}</td>
                        <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(client.total_revenue)}</td>
                        <td className="px-4 py-3">{client.audit_count}</td>
                        <td className="px-4 py-3">{formatCurrency(client.avg_per_audit)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            client.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            client.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {client.payment_status}
                          </span>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No client data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </WidgetCard>
          </div>
        );

      case "payment-analysis":
        const paymentData = reportData as PaymentAnalysisData;
        return (
          <div className="space-y-6">
            {/* Payment Status Overview */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">Payments Received</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(paymentData?.summary?.paid_amount || 0)}</p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">{paymentData?.summary?.collection_rate || 0}% collection rate</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(paymentData?.summary?.pending_amount || 0)}</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">Awaiting payment</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-red-900 dark:text-red-300">Overdue Payments</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(paymentData?.summary?.overdue_amount || 0)}</p>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">Past due date</p>
              </div>
            </div>

            {/* Payment Timeline */}
            <WidgetCard title="Payment Collection Timeline">
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">On-time Rate</p>
                    <p className="text-lg font-bold text-green-600">{paymentData?.payment_timeline?.on_time_rate || 0}%</p>
                    <p className="text-xs">Payments on time</p>
                  </div>
                  <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Invoices</p>
                    <p className="text-lg font-bold text-blue-600">{paymentData?.payment_timeline?.total_invoices || 0}</p>
                    <p className="text-xs">Invoice count</p>
                  </div>
                </div>
              </div>
            </WidgetCard>

            {/* Outstanding Invoices */}
            <WidgetCard title="Outstanding Invoices by Age">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left font-medium">Invoice #</th>
                      <th className="px-4 py-3 text-left font-medium">Client</th>
                      <th className="px-4 py-3 text-left font-medium">Amount</th>
                      <th className="px-4 py-3 text-left font-medium">Due Date</th>
                      <th className="px-4 py-3 text-left font-medium">Days Overdue</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData?.outstanding_invoices?.map((invoice) => (
                      <tr key={invoice.invoice_number} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 font-medium">{invoice.invoice_number}</td>
                        <td className="px-4 py-3">{invoice.client_name}</td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(invoice.amount)}</td>
                        <td className="px-4 py-3">{invoice.due_date}</td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${invoice.days_overdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {invoice.days_overdue > 0 ? `${invoice.days_overdue} days` : 'Current'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status.toLowerCase()}
                          </span>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No outstanding invoices data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </WidgetCard>
          </div>
        );

      case "client-profitability":
        const profitabilityData = reportData as ClientProfitabilityData;
        return (
          <div className="space-y-6">
            <WidgetCard title="Client Profitability Analysis">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left font-medium">Client</th>
                      <th className="px-4 py-3 text-left font-medium">Total Revenue</th>
                      <th className="px-4 py-3 text-left font-medium">Estimated Costs</th>
                      <th className="px-4 py-3 text-left font-medium">Profit</th>
                      <th className="px-4 py-3 text-left font-medium">Margin</th>
                      <th className="px-4 py-3 text-left font-medium">Profitability Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitabilityData?.client_profitability?.map((client) => (
                      <tr key={client.client_name} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 font-medium">{client.client_name}</td>
                        <td className="px-4 py-3">{formatCurrency(client.total_revenue)}</td>
                        <td className="px-4 py-3">{formatCurrency(client.estimated_costs)}</td>
                        <td className="px-4 py-3 font-semibold text-green-600">{formatCurrency(client.profit)}</td>
                        <td className="px-4 py-3 font-medium">{client.margin}%</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            client.margin >= 35 ? 'bg-green-100 text-green-800' :
                            client.margin >= 25 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {client.margin >= 35 ? 'High' : client.margin >= 25 ? 'Medium' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No client profitability data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </WidgetCard>
          </div>
        );

      case "revenue-forecast":
        const forecastData = reportData as RevenueForecastData;
        return (
          <div className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Q1 2026 Projection</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(forecastData?.forecast?.q1_2026_projection || 0)}</p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">{forecastData?.forecast?.confidence_level || 0}% confidence</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">Confirmed Pipeline</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(forecastData?.forecast?.confirmed_pipeline || 0)}</p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">Secured revenue</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-300">Pipeline Value</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(forecastData?.forecast?.pipeline_value || 0)}</p>
                <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Potential revenue</p>
              </div>
            </div>

            <WidgetCard title="Revenue Forecast by Month">
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                  {forecastData?.monthly_projections?.map((item) => (
                    <div key={item.month} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-dark dark:text-white">{item.month}</h3>
                      <p className="text-2xl font-bold text-primary mt-2">{formatCurrency(item.projected)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{item.confidence}% confidence</span>
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-3 text-center py-4 text-gray-500">
                      No forecast data available
                    </div>
                  )}
                </div>
              </div>
            </WidgetCard>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {reportTypes.find(r => r.id === selectedReport)?.description}
            </p>
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
              Generate Report
            </button>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Financial Reports
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Comprehensive financial analysis and revenue reporting
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Schedule Report
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
              Export Current Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <WidgetCard title="Report Configuration">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="1M">Last Month</option>
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="1Y">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Client</label>
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Clients</option>
                <option value="abc">ABC Corporation</option>
                <option value="xyz">XYZ Industries</option>
                <option value="def">DEF Manufacturing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Standard</label>
              <select
                value={filterStandard}
                onChange={(e) => setFilterStandard(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Standards</option>
                <option value="iso9001">ISO 9001:2015</option>
                <option value="iso14001">ISO 14001:2015</option>
                <option value="iso45001">ISO 45001:2018</option>
                <option value="iso27001">ISO 27001:2013</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Export Format</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="pdf">PDF Report</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV Data</option>
                <option value="powerpoint">PowerPoint Presentation</option>
              </select>
            </div>
          </div>
        </WidgetCard>

        {/* Report Types and Content */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-4">
          <div>
            <WidgetCard title="Report Types">
              <div className="space-y-2">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedReport === report.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{report.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                        <p className="text-xs opacity-75">{report.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </WidgetCard>
          </div>

          <div className="lg:col-span-3">
            <WidgetCard title={reportTypes.find(r => r.id === selectedReport)?.name || "Report"}>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading report data...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Report</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                  <button 
                    onClick={loadReportData}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                renderReportContent()
              )}
            </WidgetCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}