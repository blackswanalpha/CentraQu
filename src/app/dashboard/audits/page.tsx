"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { ChartCard } from "@/components/Dashboard/chart-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import type { Audit, AuditStatus } from "@/types/audit";
import { auditService, type Audit as APIAudit, type AuditStats } from "@/services/audit.service";

export default function AuditsPage() {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [audits, setAudits] = useState<APIAudit[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    total: 0,
    scheduled: 0,
    in_progress: 0,
    completed: 0,
    completed_this_month: 0,
    overdue: 0,
    findings: {
      total_findings: 0,
      total_major: 0,
      total_minor: 0,
      total_opportunities: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch audits and stats in parallel
        const [auditsResponse, statsResponse] = await Promise.all([
          auditService.getAudits({ ordering: '-planned_start_date' }),
          auditService.getStats(),
        ]);

        setAudits(auditsResponse.results || []);
        setStats(statsResponse.data);
      } catch (err) {
        console.error('Error fetching audits:', err);
        setError('Failed to load audits. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map backend status to frontend status
  const mapStatus = (backendStatus: string): AuditStatus => {
    const statusMap: Record<string, AuditStatus> = {
      'PLANNED': 'scheduled',
      'IN_PROGRESS': 'in-progress',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'ON_HOLD': 'cancelled',
    };
    return statusMap[backendStatus] || 'scheduled';
  };

  const getStatusColor = (status: AuditStatus) => {
    const colors: Record<AuditStatus, string> = {
      "scheduled": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "in-progress": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "completed": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
      "overdue": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "cancelled": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };
    return colors[status];
  };

  const getStatusBadge = (status: AuditStatus) => {
    const badges: Record<AuditStatus, string> = {
      "scheduled": "🟦",
      "in-progress": "🟩",
      "completed": "🟢",
      "overdue": "🔴",
      "cancelled": "⚫",
    };
    return badges[status];
  };

  // Calculate audit progress based on checklist responses
  const calculateAuditProgress = (checklistResponses: any[]) => {
    if (!checklistResponses || checklistResponses.length === 0) {
      return {
        percentage: 0,
        completed: 0,
        total: 0
      };
    }
    
    const total = checklistResponses.length;
    const completed = checklistResponses.filter((r: any) => r.compliance_status !== 'pending').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { percentage, completed, total };
  };

  // Group audits by status for Kanban view
  const groupAuditsByStatus = () => {
    const groups: Record<string, APIAudit[]> = {
      'PLANNED': [],
      'IN_PROGRESS': [],
      'COMPLETED': []
    };
    
    audits.forEach(audit => {
      const status = audit.status;
      if (groups[status]) {
        groups[status].push(audit);
      } else {
        // Default to PLANNED if status not recognized
        groups['PLANNED'].push(audit);
      }
    });
    
    return groups;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Audit Management
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              All Audits
            </p>
          </div>
          <a 
            href="/dashboard/audits/new"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            + Schedule Audit
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading audits...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Overview Cards */}
        {!loading && !error && (
          <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Scheduled"
                value={stats.scheduled}
                status="normal"
                iconColor="primary"
              />
              <KPICard
                title="In Progress"
                value={stats.in_progress}
                status="normal"
                iconColor="success"
              />
              <KPICard
                title="Completed This Month"
                value={stats.completed_this_month}
                status="normal"
                iconColor="info"
              />
              <KPICard
            title="Overdue"
            value={stats.overdue}
            status="critical"
            iconColor="error"
          />
        </div>

        {/* Filters */}
        <WidgetCard title="Filters & Search">
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-6">
              <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Status: All</option>
                <option>Scheduled</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Overdue</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Auditor: All</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Cert: All</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Date Range: This Month</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Client: All</option>
              </select>
              <input
                type="text"
                placeholder="Search audits..."
                className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </WidgetCard>

        {/* View Toggle and Audits Table */}
        <WidgetCard
          title="Audits"
          action={
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded ${
                  viewMode === "table"
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1 rounded ${
                  viewMode === "kanban"
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                Kanban
              </button>
            </div>
          }
        >
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                      Cert
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {audits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No audits found. Click "Schedule Audit" to create your first audit.
                      </td>
                    </tr>
                  ) : (
                    audits.map((audit) => {
                      const status = mapStatus(audit.status);
                      return (
                        <tr
                          key={audit.id}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <td className="px-4 py-3 font-medium text-dark dark:text-white">
                            {getStatusBadge(status)} {audit.audit_number}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                            {audit.client_name}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                            {audit.iso_standard_name}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                            {new Date(audit.planned_start_date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {(() => {
                              const progress = calculateAuditProgress(audit.checklist_responses || []);
                              const isCompleted = progress.percentage === 100;
                              return (
                                <div className="flex-1">
                                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div
                                      className="bg-primary h-2 rounded-full"
                                      style={{ width: `${progress.percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1">
                                    {progress.percentage}% ({progress.completed}/{progress.total})
                                  </span>
                                </div>
                              );
                            })()}
                          </td>
                          <td className="px-4 py-3">
                            {(() => {
                              const progress = calculateAuditProgress(audit.checklist_responses || []);
                              const isCompleted = progress.percentage === 100;
                              
                              if (isCompleted) {
                                return (
                                  <a
                                    href={`/dashboard/audits/certifications?audit=${audit.id}`}
                                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                  >
                                    View Certification
                                  </a>
                                );
                              } else {
                                return (
                                  <a
                                    href={`/dashboard/audits/${audit.id}`}
                                    className="text-primary hover:text-primary-hover text-sm font-medium"
                                  >
                                    View Details
                                  </a>
                                );
                              }
                            })()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(() => {
                const groupedAudits = groupAuditsByStatus();
                const columns = [
                  { key: 'PLANNED', title: 'Planned', color: 'blue', bgColor: 'bg-blue-50 dark:bg-blue-900/10' },
                  { key: 'IN_PROGRESS', title: 'In Progress', color: 'green', bgColor: 'bg-green-50 dark:bg-green-900/10' },
                  { key: 'COMPLETED', title: 'Completed', color: 'gray', bgColor: 'bg-gray-50 dark:bg-gray-900/10' }
                ];

                return columns.map(column => (
                  <div key={column.key} className={`${column.bgColor} rounded-lg p-4 min-h-96`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-dark dark:text-white">{column.title}</h3>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium">
                        {groupedAudits[column.key]?.length || 0}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {groupedAudits[column.key]?.map((audit) => {
                        const progress = calculateAuditProgress(audit.checklist_responses || []);
                        const isCompleted = progress.percentage === 100;
                        const status = mapStatus(audit.status);
                        
                        return (
                          <div
                            key={audit.id}
                            className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow ${isCompleted ? 'cursor-default' : 'cursor-pointer'}`}
                            onClick={() => {
                              if (!isCompleted) {
                                window.location.href = `/dashboard/audits/${audit.id}`;
                              }
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-dark dark:text-white text-sm mb-1">
                                  {getStatusBadge(status)} {audit.audit_number}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  {audit.client_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  {audit.iso_standard_name}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                                <span className="text-xs font-medium">{progress.percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div
                                  className="bg-primary h-1.5 rounded-full"
                                  style={{ width: `${progress.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1">
                                {progress.completed} of {progress.total} items completed
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {new Date(audit.planned_start_date).toLocaleDateString()}
                              </span>
                              
                              {isCompleted ? (
                                <a
                                  href={`/dashboard/audits/certifications?audit=${audit.id}`}
                                  className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View Certification
                                </a>
                              ) : (
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                                  {status}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {(!groupedAudits[column.key] || groupedAudits[column.key].length === 0) && (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-sm">No {column.title.toLowerCase()} audits</p>
                        </div>
                      )}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </WidgetCard>

        {/* Performance Metrics */}
        {!loading && !error && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <ChartCard title="Audit Pipeline" subtitle="Conversion funnel">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Scheduled
                  </span>
                  <span className="font-medium">{stats.scheduled} audits</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    In Progress
                  </span>
                  <span className="font-medium">{stats.in_progress} audits</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Completed
                  </span>
                  <span className="font-medium">{stats.completed} audits</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total
                  </span>
                  <span className="font-medium">{stats.total} audits</span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Completion Rate: {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Findings Summary" subtitle="Non-conformances">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Findings
                  </span>
                  <span className="font-medium">{stats.findings.total_findings || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Major Non-Conformances
                  </span>
                  <span className="font-medium text-red-600">{stats.findings.total_major || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Minor Non-Conformances
                  </span>
                  <span className="font-medium text-yellow-600">{stats.findings.total_minor || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Opportunities
                  </span>
                  <span className="font-medium text-blue-600">{stats.findings.total_opportunities || 0}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This Month: {stats.completed_this_month} audits completed, {stats.overdue} overdue
                  </p>
                </div>
              </div>
            </ChartCard>
          </div>
        )}
        </>
        )}
      </div>
    </DashboardLayout>
  );
}

