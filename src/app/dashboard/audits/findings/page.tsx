"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { auditService, type AuditFinding, type FindingStats } from "@/services/audit.service";

export default function AuditFindingsPage() {
  const [severityFilter, setSeverityFilter] = useState<"all" | "major" | "minor" | "observation">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "corrective" | "verification" | "closed">("all");
  const [findings, setFindings] = useState<AuditFinding[]>([]);
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
          auditService.getFindings({ ordering: '-created_at' }),
          auditService.getFindingStats(),
        ]);

        setFindings(findingsResponse.results || []);
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching findings:', err);
        setError('Failed to load findings data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      major: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      minor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      observation: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  const getSeverityBadge = (severity: string) => {
    const badges: Record<string, string> = {
      major: "🔴",
      minor: "🟡",
      observation: "🟢",
    };
    return badges[severity] || "⚫";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      corrective: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      verification: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      closed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Audit Findings Management
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Track and manage all audit findings across all audits
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            + Add Finding
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading findings...</p>
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
                title="Total Findings"
                value={stats.total}
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
                status="normal"
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
        <WidgetCard title="Filters & Search">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-6">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Severity: All</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="observation">Observation</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Status: All</option>
              <option value="open">Open</option>
              <option value="corrective">Corrective Action</option>
              <option value="verification">Verification Pending</option>
              <option value="closed">Closed</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Auditor: All</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Client: All</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Date Range: All Time</option>
            </select>
            <input
              type="text"
              placeholder="Search findings..."
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </WidgetCard>

        {/* Findings List */}
        <WidgetCard title="Findings">
          <div className="space-y-4">
            {findings.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No findings found.
              </div>
            ) : (
              findings.map((finding) => (
                <div
                  key={finding.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getSeverityBadge(finding.finding_type)}</span>
                      <div>
                        <p className="font-semibold text-dark dark:text-white">
                          {finding.finding_number}: {finding.description}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Clause: {finding.clause_reference}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                          finding.finding_type
                        )}`}
                      >
                        {finding.finding_type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          finding.status
                        )}`}
                      >
                        {finding.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex gap-4">
                      <span>Audit: {finding.audit}</span>
                      <span>Logged: {new Date(finding.created_at).toLocaleDateString()}</span>
                      {finding.responsible_person && <span>By: {finding.responsible_person}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-primary hover:text-primary-hover text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-primary hover:text-primary-hover text-sm font-medium">
                        Add Evidence
                      </button>
                      <button className="text-primary hover:text-primary-hover text-sm font-medium">
                        Request Correction
                      </button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </WidgetCard>

        {/* Findings Trends */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Findings by Severity">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Major Non-Conformances</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Minor Non-Conformances</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Observations</span>
                <span className="font-semibold">4</span>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Findings by Status">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Open</span>
                <span className="font-semibold text-red-600">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Corrective Action Requested</span>
                <span className="font-semibold text-orange-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Verified</span>
                <span className="font-semibold text-blue-600">{stats.by_status.verified}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Closed</span>
                <span className="font-semibold text-green-600">{stats.by_status.closed}</span>
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

