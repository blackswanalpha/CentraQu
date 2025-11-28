"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { ReportsAPI, type AuditSummaryData, type ComplianceAnalysisData, type AuditorPerformanceData } from "@/services/reports-api";

export default function AuditReportsPage() {
  const [selectedReport, setSelectedReport] = useState("audit-summary");
  const [dateRange, setDateRange] = useState("6M");
  const [filterStandard, setFilterStandard] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportTypes = [
    {
      id: "audit-summary",
      name: "Audit Summary Report",
      description: "Comprehensive overview of all audit activities and outcomes",
      icon: "📊"
    },
    {
      id: "compliance-analysis",
      name: "Compliance Analysis Report",
      description: "Analysis of compliance rates across different standards",
      icon: "✓"
    },
    {
      id: "auditor-performance",
      name: "Auditor Performance Report",
      description: "Individual and team performance metrics and analytics",
      icon: "👥"
    },
    {
      id: "quality-metrics",
      name: "Quality Metrics Report",
      description: "Quality scores, client satisfaction, and improvement trends",
      icon: "⭐"
    },
    {
      id: "findings-analysis",
      name: "Findings Analysis Report",
      description: "Detailed analysis of audit findings and non-conformances",
      icon: "🔍"
    },
    {
      id: "geographic-distribution",
      name: "Geographic Distribution Report",
      description: "Audit distribution across different regions and locations",
      icon: "🌍"
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
      const data = await ReportsAPI.getAuditReports(
        selectedReport as any,
        {
          dateRange: dateRange as any,
          standard: filterStandard === 'all' ? undefined : filterStandard,
          status: filterStatus === 'all' ? undefined : filterStatus,
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
  }, [selectedReport, dateRange, filterStandard, filterStatus]);

  const renderReportContent = () => {
    switch (selectedReport) {
      case "audit-summary":
        const summaryData = reportData as AuditSummaryData;
        return (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Total Audits</p>
                <p className="text-2xl font-bold text-blue-600">{summaryData?.summary?.total_audits || 0}</p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Current period</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">Completed</p>
                <p className="text-2xl font-bold text-green-600">{summaryData?.summary?.completed_audits || 0}</p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">{summaryData?.summary?.completion_rate || 0}% completion rate</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{summaryData?.summary?.in_progress_audits || 0}</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">Active audits</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-300">Avg Duration</p>
                <p className="text-2xl font-bold text-purple-600">{summaryData?.summary?.avg_duration || 0} days</p>
                <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Average completion time</p>
              </div>
            </div>

            {/* Audit Distribution */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <WidgetCard title="Audits by Standard">
                <div className="space-y-3">
                  {summaryData?.standards_distribution?.map((standard, index) => {
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-gray-500'];
                    return (
                      <div key={standard.standard} className="flex justify-between items-center">
                        <span className="text-sm">{standard.standard}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${colors[index % colors.length]}`}
                              style={{ width: `${Math.min(standard.percentage * 4, 96)}px` }}
                            ></div>
                          </div>
                          <span className="font-medium">{standard.count} ({standard.percentage}%)</span>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="text-center py-4 text-gray-500">
                      No standards data available
                    </div>
                  )}
                </div>
              </WidgetCard>

              <WidgetCard title="Audits by Type">
                <div className="space-y-3">
                  {summaryData?.audit_types?.map((type) => (
                    <div key={type.type} className="flex justify-between items-center">
                      <span className="text-sm">{type.type}</span>
                      <span className="font-medium">{type.count} audits</span>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-gray-500">
                      No audit type data available
                    </div>
                  )}
                </div>
              </WidgetCard>
            </div>

            {/* Monthly Trends */}
            <WidgetCard title="Monthly Audit Trends">
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-2 md:grid-cols-6">
                  {summaryData?.monthly_trends?.slice(-6).map((trend) => {
                    const maxValue = Math.max(...(summaryData?.monthly_trends?.map(t => t.count) || [1]));
                    return (
                      <div key={trend.month} className="text-center">
                        <div className="mb-2">
                          <div className="h-20 w-8 bg-gray-200 rounded mx-auto relative">
                            <div 
                              className="absolute bottom-0 w-full bg-primary rounded"
                              style={{ height: `${(trend.count / maxValue) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{trend.month}</p>
                        <p className="text-sm font-medium">{trend.count}</p>
                      </div>
                    );
                  }) || (
                    <div className="text-center py-4 text-gray-500 col-span-6">
                      No monthly trend data available
                    </div>
                  )}
                </div>
              </div>
            </WidgetCard>
          </div>
        );

      case "compliance-analysis":
        const complianceData = reportData as ComplianceAnalysisData;
        return (
          <div className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">Overall Compliance Rate</p>
                <p className="text-3xl font-bold text-green-600">{complianceData?.summary?.overall_compliance_rate || 0}%</p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">Current period</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Minor Non-Conformances</p>
                <p className="text-3xl font-bold text-yellow-600">{complianceData?.summary?.minor_findings || 0}</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">Total findings</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-red-900 dark:text-red-300">Major Non-Conformances</p>
                <p className="text-3xl font-bold text-red-600">{complianceData?.summary?.major_findings || 0}</p>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">Critical issues</p>
              </div>
            </div>

            <WidgetCard title="Compliance by Standard">
              <div className="space-y-4">
                {complianceData?.compliance_by_standard?.map((item) => (
                  <div key={item.standard} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-dark dark:text-white">{item.standard}</h3>
                      <span className="text-2xl font-bold text-green-600">{item.compliance_rate}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>Non-conformances found: {item.total_findings}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.compliance_rate >= 95 ? 'bg-green-100 text-green-800' :
                        item.compliance_rate >= 90 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.compliance_rate >= 95 ? 'Excellent' : item.compliance_rate >= 90 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">
                    No compliance data available
                  </div>
                )}
              </div>
            </WidgetCard>
          </div>
        );

      case "auditor-performance":
        const performanceData = reportData as AuditorPerformanceData;
        return (
          <div className="space-y-6">
            <WidgetCard title="Auditor Performance Metrics">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left font-medium">Auditor</th>
                      <th className="px-4 py-3 text-left font-medium">Audits Completed</th>
                      <th className="px-4 py-3 text-left font-medium">Avg Duration</th>
                      <th className="px-4 py-3 text-left font-medium">Quality Score</th>
                      <th className="px-4 py-3 text-left font-medium">Client Satisfaction</th>
                      <th className="px-4 py-3 text-left font-medium">On-time Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData?.auditor_performance?.map((auditor) => (
                      <tr key={auditor.name} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 font-medium">{auditor.name}</td>
                        <td className="px-4 py-3">{auditor.audits_completed}</td>
                        <td className="px-4 py-3">{auditor.avg_duration} days</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            auditor.quality_score >= 9 ? 'bg-green-100 text-green-800' :
                            auditor.quality_score >= 8.5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {auditor.quality_score}/10
                          </span>
                        </td>
                        <td className="px-4 py-3">{auditor.client_satisfaction}/5.0</td>
                        <td className="px-4 py-3">{auditor.on_time_rate}%</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No auditor performance data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </WidgetCard>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
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
              Audit Reports
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Comprehensive audit analysis and reporting
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
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="scheduled">Scheduled</option>
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

        {/* Report Types */}
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