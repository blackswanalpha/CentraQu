"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState } from "react";

export default function FinancialTimelineReportsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [selectedView, setSelectedView] = useState("monthly");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Mock timeline data
  const timelineData = [
    {
      date: "2025-05-01",
      month: "May 2025",
      revenue: 580000,
      collections: 520000,
      outstanding: 60000,
      newInvoices: 8,
      paidInvoices: 7,
      overdueInvoices: 1,
      events: [
        { type: "milestone", description: "Q2 Target: 80% achieved", icon: "🎯" },
        { type: "payment", description: "ABC Corp - KES 85,000 received", icon: "💰" }
      ]
    },
    {
      date: "2025-06-01",
      month: "June 2025",
      revenue: 620000,
      collections: 590000,
      outstanding: 30000,
      newInvoices: 10,
      paidInvoices: 9,
      overdueInvoices: 1,
      events: [
        { type: "achievement", description: "Best month for collections", icon: "🏆" },
        { type: "invoice", description: "12 new invoices generated", icon: "📄" }
      ]
    },
    {
      date: "2025-07-01",
      month: "July 2025",
      revenue: 485000,
      collections: 455000,
      outstanding: 30000,
      newInvoices: 6,
      paidInvoices: 5,
      overdueInvoices: 2,
      events: [
        { type: "alert", description: "2 invoices became overdue", icon: "⚠️" },
        { type: "payment", description: "XYZ Ltd - KES 45,000 received", icon: "💰" }
      ]
    },
    {
      date: "2025-08-01",
      month: "August 2025",
      revenue: 720000,
      collections: 680000,
      outstanding: 40000,
      newInvoices: 11,
      paidInvoices: 10,
      overdueInvoices: 1,
      events: [
        { type: "milestone", description: "Q3 Target exceeded", icon: "🎯" },
        { type: "achievement", description: "Record month for revenue", icon: "🏆" }
      ]
    },
    {
      date: "2025-09-01",
      month: "September 2025",
      revenue: 650000,
      collections: 620000,
      outstanding: 30000,
      newInvoices: 9,
      paidInvoices: 8,
      overdueInvoices: 1,
      events: [
        { type: "payment", description: "DEF Inc - KES 95,000 received", icon: "💰" },
        { type: "milestone", description: "95% collection rate achieved", icon: "🎯" }
      ]
    },
    {
      date: "2025-10-01",
      month: "October 2025",
      revenue: 580000,
      collections: 540000,
      outstanding: 100000,
      newInvoices: 8,
      paidInvoices: 6,
      overdueInvoices: 3,
      events: [
        { type: "alert", description: "Outstanding amounts increased", icon: "⚠️" },
        { type: "invoice", description: "Follow-up required for 3 invoices", icon: "📧" }
      ]
    }
  ];

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      milestone: "bg-blue-100 text-blue-800 border-blue-200",
      achievement: "bg-green-100 text-green-800 border-green-200",
      payment: "bg-purple-100 text-purple-800 border-purple-200",
      invoice: "bg-yellow-100 text-yellow-800 border-yellow-200",
      alert: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Financial Timeline Reports
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Track financial performance over time with detailed timeline analysis
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Export Timeline
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
              Generate Report
            </button>
          </div>
        </div>

        {/* Controls */}
        <WidgetCard title="Timeline Configuration">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-2">Timeframe</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="1Y">Last Year</option>
                <option value="2Y">Last 2 Years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="revenue">Revenue</option>
                <option value="collections">Collections</option>
                <option value="outstanding">Outstanding</option>
                <option value="invoices">Invoice Count</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">View</label>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Export Format</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="pdf">PDF Report</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="powerpoint">PowerPoint Timeline</option>
              </select>
            </div>
          </div>
        </WidgetCard>

        {/* Timeline Visualization */}
        <WidgetCard title="Financial Performance Timeline">
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(timelineData.reduce((sum, item) => sum + item.revenue, 0))}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">6-month period</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">Collections</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(timelineData.reduce((sum, item) => sum + item.collections, 0))}
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  {Math.round((timelineData.reduce((sum, item) => sum + item.collections, 0) / 
                   timelineData.reduce((sum, item) => sum + item.revenue, 0)) * 100)}% collection rate
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-300">Current Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(timelineData[timelineData.length - 1].outstanding)}
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">As of latest month</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-300">Avg Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(timelineData.reduce((sum, item) => sum + item.revenue, 0) / timelineData.length)}
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">6-month average</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="space-y-8">
                {timelineData.map((item, index) => (
                  <div key={item.date} className="relative flex items-start gap-6">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 border-4 border-primary rounded-full">
                      <div className="text-xs text-center">
                        <div className="font-bold text-primary">{item.month.split(' ')[0]}</div>
                        <div className="text-gray-500">{item.month.split(' ')[1]}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        {/* Month Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-dark dark:text-white">{item.month}</h3>
                          <div className="flex gap-2">
                            {index > 0 && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                calculateGrowth(item.revenue, timelineData[index - 1].revenue) >= 0
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {calculateGrowth(item.revenue, timelineData[index - 1].revenue) >= 0 ? '+' : ''}
                                {calculateGrowth(item.revenue, timelineData[index - 1].revenue).toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-xs text-blue-700 dark:text-blue-400">Revenue</p>
                            <p className="text-lg font-bold text-blue-600">{formatCurrency(item.revenue)}</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-xs text-green-700 dark:text-green-400">Collections</p>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(item.collections)}</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <p className="text-xs text-orange-700 dark:text-orange-400">Outstanding</p>
                            <p className="text-lg font-bold text-orange-600">{formatCurrency(item.outstanding)}</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-xs text-purple-700 dark:text-purple-400">New Invoices</p>
                            <p className="text-lg font-bold text-purple-600">{item.newInvoices}</p>
                          </div>
                        </div>

                        {/* Invoice Summary */}
                        <div className="grid gap-2 grid-cols-3 mb-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">New Invoices:</span>
                            <span className="font-medium">{item.newInvoices}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Paid:</span>
                            <span className="font-medium text-green-600">{item.paidInvoices}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Overdue:</span>
                            <span className="font-medium text-red-600">{item.overdueInvoices}</span>
                          </div>
                        </div>

                        {/* Events */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Events:</h4>
                          {item.events.map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={`flex items-center gap-3 p-3 rounded-lg border ${getEventColor(event.type)}`}
                            >
                              <span className="text-lg">{event.icon}</span>
                              <span className="text-sm font-medium">{event.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Trends Analysis */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Revenue Trend Analysis">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium">Best Performing Month</span>
                <span className="font-bold text-green-600">August 2025 - {formatCurrency(720000)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm font-medium">Lowest Performing Month</span>
                <span className="font-bold text-red-600">July 2025 - {formatCurrency(485000)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium">Average Growth Rate</span>
                <span className="font-bold text-blue-600">+2.1% monthly</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-sm font-medium">Volatility Index</span>
                <span className="font-bold text-purple-600">Medium (±15%)</span>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Collection Performance">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium">Best Collection Rate</span>
                <span className="font-bold text-green-600">June 2025 - 95.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-sm font-medium">Average Collection Time</span>
                <span className="font-bold text-yellow-600">28 days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="text-sm font-medium">Peak Outstanding</span>
                <span className="font-bold text-orange-600">October 2025 - {formatCurrency(100000)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium">Collection Efficiency</span>
                <span className="font-bold text-blue-600">92.1% overall</span>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Forecast Section */}
        <WidgetCard title="Financial Forecast">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <div>
              <h3 className="font-medium text-dark dark:text-white mb-4">Next Month Projection</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Projected Revenue</span>
                  <span className="font-medium">{formatCurrency(625000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Expected Collections</span>
                  <span className="font-medium">{formatCurrency(590000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Invoices</span>
                  <span className="font-medium">9-10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Confidence Level</span>
                  <span className="font-medium text-green-600">85%</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-dark dark:text-white mb-4">Quarter Outlook</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Q1 2026 Target</span>
                  <span className="font-medium">{formatCurrency(1800000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current Pipeline</span>
                  <span className="font-medium">{formatCurrency(1200000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gap to Close</span>
                  <span className="font-medium text-orange-600">{formatCurrency(600000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Probability</span>
                  <span className="font-medium text-yellow-600">72%</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-dark dark:text-white mb-4">Risk Assessment</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Collection Risk</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">Medium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Market Risk</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Liquidity Risk</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Overall Risk</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">Medium</span>
                </div>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}