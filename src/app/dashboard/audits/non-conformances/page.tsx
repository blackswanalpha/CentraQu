"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { auditService, type AuditFinding, type FindingStats } from "@/services/audit.service";

export default function NonConformanceTrackingPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "action" | "verification" | "closed">("all");
  const [selectedNC, setSelectedNC] = useState<number | null>(null);
  const [nonConformances, setNonConformances] = useState<AuditFinding[]>([]);
  const [stats, setStats] = useState<FindingStats>({
    total: 0,
    by_type: {
      major: 0,
      minor: 0,
      observations: 0,
      opportunities: 0,
    },
    by_status: {
      open: 0,
      in_progress: 0,
      closed: 0,
      verified: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [findingsResponse, statsResponse] = await Promise.all([
          auditService.getFindings({
            finding_type__in: 'MAJOR,MINOR',
            ordering: '-created_at'
          }),
          auditService.getFindingStats(),
        ]);

        setNonConformances(findingsResponse.results || []);
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching non-conformances:', err);
        setError('Failed to load non-conformance data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map backend status to frontend filter values
  const mapStatusToFilter = (backendStatus: string): string => {
    const statusMap: Record<string, string> = {
      'OPEN': 'open',
      'IN_PROGRESS': 'action',
      'VERIFIED': 'verification',
      'CLOSED': 'closed',
    };
    return statusMap[backendStatus] || 'open';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      IN_PROGRESS: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      VERIFIED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      CLOSED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getSeverityBadge = (findingType: string) => {
    const badges: Record<string, string> = {
      MAJOR: "🔴",
      MINOR: "🟡",
      OBSERVATION: "🟢",
      OPPORTUNITY: "🔵",
    };
    return badges[findingType] || "⚫";
  };

  const filteredNC = nonConformances.filter((nc) => {
    if (filterStatus === "all") return true;
    return mapStatusToFilter(nc.status) === filterStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Non-Conformance Tracking
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Track and manage all non-conformances across audits
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
            + New Non-Conformance
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading non-conformances...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Overview Stats */}
        {!loading && !error && (
          <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
              <KPICard
                title="Total NCs"
                value={stats.by_type.major + stats.by_type.minor}
                status="normal"
                iconColor="primary"
              />
              <KPICard
                title="Open"
                value={stats.by_status.open}
                status="critical"
                iconColor="error"
              />
              <KPICard
                title="In Progress"
                value={stats.by_status.in_progress}
                status="warning"
                iconColor="accent"
              />
              <KPICard
                title="Verified"
                value={stats.by_status.verified}
                status="warning"
                iconColor="info"
              />
              <KPICard
                title="Closed"
                value={stats.by_status.closed}
                status="normal"
                iconColor="success"
              />
            </div>

        {/* Filters */}
        <WidgetCard title="Filters">
          <div className="flex gap-4 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Status: All</option>
              <option value="open">Open</option>
              <option value="corrective-action-requested">Corrective Action</option>
              <option value="verification-pending">Verification Pending</option>
              <option value="closed">Closed</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Severity: All</option>
              <option>Major</option>
              <option>Minor</option>
              <option>Observation</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Client: All</option>
              <option>ABC Corporation</option>
              <option>XYZ Ltd</option>
              <option>DEF Inc</option>
            </select>
            <input
              type="text"
              placeholder="Search NC ID or description..."
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </WidgetCard>

        {/* Non-Conformances List */}
        <WidgetCard title={`Non-Conformances (${filteredNC.length})`}>
          <div className="space-y-4">
            {filteredNC.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No non-conformances found.
              </div>
            ) : (
              filteredNC.map((nc) => (
                <div
                  key={nc.id}
                  onClick={() => setSelectedNC(selectedNC === nc.id ? null : nc.id)}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getSeverityBadge(nc.finding_type)}</span>
                        <p className="font-semibold text-dark dark:text-white">
                          {nc.finding_number}
                        </p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            nc.status
                          )}`}
                        >
                          {nc.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {nc.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Audit: {nc.audit} | Clause: {nc.clause_reference} | Found: {new Date(nc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
                      View
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {selectedNC === nc.id && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-4">
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Root Cause Analysis
                          </p>
                          <p className="text-sm text-dark dark:text-white">
                            {nc.root_cause || 'Pending analysis'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Corrective Action Plan
                          </p>
                          <p className="text-sm text-dark dark:text-white">
                            {nc.corrective_action || 'Not yet assigned'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Due Date
                          </p>
                          <p className="text-sm text-dark dark:text-white">
                            {nc.target_date ? new Date(nc.target_date).toLocaleDateString() : 'Not set'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Evidence
                          </p>
                          <p className="text-sm text-dark dark:text-white">
                            {nc.evidence || 'Not submitted'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Responsible Person
                          </p>
                          <p className="text-sm text-dark dark:text-white">
                            {nc.responsible_person || 'Not assigned'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Closure Date
                          </p>
                          <p className="text-sm text-dark dark:text-white">
                            {nc.actual_closure_date ? new Date(nc.actual_closure_date).toLocaleDateString() : 'Not closed'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-hover">
                          Edit
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
                          Upload Evidence
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
                          Update Status
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </WidgetCard>

            {/* NC Trends */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <WidgetCard title="Non-Conformances by Status">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Open</span>
                    <span className="font-medium">{stats.by_status.open}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Progress</span>
                    <span className="font-medium">{stats.by_status.in_progress}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Verified</span>
                    <span className="font-medium">{stats.by_status.verified}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Closed</span>
                    <span className="font-medium">{stats.by_status.closed}</span>
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard title="Non-Conformances by Type">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🔴 Major</span>
                    <span className="font-medium">{stats.by_type.major}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🟡 Minor</span>
                    <span className="font-medium">{stats.by_type.minor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🟢 Observation</span>
                    <span className="font-medium">{stats.by_type.observations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🔵 Opportunity</span>
                    <span className="font-medium">{stats.by_type.opportunities}</span>
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

