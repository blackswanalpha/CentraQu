"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect, useMemo } from "react";
import { auditService, Audit } from "@/services/audit.service";

interface QualityReviewAudit {
  id: string;
  client: string;
  auditType: string;
  completionDate: string;
  status: "pending" | "approved" | "rejected";
  reportQuality: number;
  processCompliance: number;
  clientFeedback: number;
  auditorPerformance: number;
  overallScore: number;
  issues: string[];
  improvements: string[];
  reviewer: string;
  comments: string;
}

// Helper function to calculate quality scores from audit data
const calculateQualityScores = (audit: Audit): QualityReviewAudit => {
  // Calculate report quality based on findings (fewer findings = higher quality)
  const reportQuality = Math.max(5, 10 - (audit.major_findings * 2 + audit.minor_findings * 0.5));

  // Calculate process compliance (based on status and completion)
  const processCompliance = audit.status === 'COMPLETED' ?
    (audit.actual_end_date && audit.planned_end_date ?
      (new Date(audit.actual_end_date) <= new Date(audit.planned_end_date) ? 9 : 8) : 8) : 7;

  // Mock client feedback (would come from actual feedback system)
  const clientFeedback = Math.max(3, 5 - (audit.major_findings * 0.3 + audit.minor_findings * 0.1));

  // Calculate auditor performance
  const auditorPerformance = (reportQuality + processCompliance) / 2;

  // Overall score
  const overallScore = (reportQuality + processCompliance + auditorPerformance) / 3;

  // Determine review status
  let status: "pending" | "approved" | "rejected" = "pending";
  if (audit.status === 'COMPLETED') {
    status = overallScore >= 7.5 ? "approved" : "pending";
  }

  // Generate issues and improvements
  const issues: string[] = [];
  const improvements: string[] = [];

  if (audit.major_findings > 0) {
    issues.push(`${audit.major_findings} major finding(s) identified`);
    improvements.push("Address major non-conformities before next audit");
  }
  if (audit.minor_findings > 2) {
    issues.push(`${audit.minor_findings} minor findings need attention`);
    improvements.push("Implement corrective actions for minor findings");
  }

  return {
    id: audit.audit_number,
    client: audit.client_name,
    auditType: audit.audit_type.replace('_', ' '),
    completionDate: audit.actual_end_date || audit.planned_end_date,
    status,
    reportQuality: Math.round(reportQuality * 10) / 10,
    processCompliance: Math.round(processCompliance * 10) / 10,
    clientFeedback: Math.round(clientFeedback * 10) / 10,
    auditorPerformance: Math.round(auditorPerformance * 10) / 10,
    overallScore: Math.round(overallScore * 10) / 10,
    issues,
    improvements,
    reviewer: status === "approved" ? (audit.lead_auditor_name || "System") : "Pending",
    comments: status === "approved" ? "Audit completed successfully" : "",
  };
};

export default function AuditQualityReviewPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const [audits, setAudits] = useState<QualityReviewAudit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await auditService.getAudits({
          status: 'COMPLETED',
          ordering: '-actual_end_date',
        });
        const qualityAudits = response.results.map(calculateQualityScores);
        setAudits(qualityAudits);
      } catch (err) {
        console.error('Error fetching audits:', err);
        setError('Failed to load audit quality reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, []);

  const stats = useMemo(() => {
    const pending = audits.filter(a => a.status === "pending").length;
    const approved = audits.filter(a => a.status === "approved").length;
    const rejected = audits.filter(a => a.status === "rejected").length;
    const avgScore = audits.length > 0
      ? Math.round((audits.reduce((sum, a) => sum + a.overallScore, 0) / audits.length) * 10) / 10
      : 0;

    return { pending, approved, rejected, avgScore };
  }, [audits]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600";
    if (score >= 7.5) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredAudits = audits.filter(
    (audit) => filterStatus === "all" || audit.status === filterStatus
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Audit Quality Review
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Management review of completed audits for quality assurance
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
        <>
        {/* Overview Stats */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Pending Review"
            value={stats.pending}
            status="warning"
            iconColor="accent"
          />
          <KPICard
            title="Approved"
            value={stats.approved}
            status="normal"
            iconColor="success"
          />
          <KPICard
            title="Rejected"
            value={stats.rejected}
            status="normal"
            iconColor="error"
          />
          <KPICard
            title="Avg Quality Score"
            value={`${stats.avgScore}/10`}
            status="normal"
            iconColor="primary"
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
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Audit Type: All</option>
              <option>Stage 1</option>
              <option>Stage 2</option>
              <option>Surveillance</option>
            </select>
            <input
              type="text"
              placeholder="Search audit ID or client..."
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </WidgetCard>

        {/* Audits for Review */}
        <WidgetCard title={`Audits for Review (${filteredAudits.length})`}>
          <div className="space-y-4">
            {filteredAudits.map((audit) => (
              <div
                key={audit.id}
                onClick={() =>
                  setSelectedAudit(selectedAudit === audit.id ? null : audit.id)
                }
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-dark dark:text-white">
                        {audit.id}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          audit.status
                        )}`}
                      >
                        {audit.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {audit.client} | {audit.auditType} | Completed:{" "}
                      {audit.completionDate}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span>Report Quality: {audit.reportQuality}/10</span>
                      <span>Process Compliance: {audit.processCompliance}/10</span>
                      <span>Client Feedback: {audit.clientFeedback}/5</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${getScoreColor(
                        audit.overallScore
                      )}`}
                    >
                      {audit.overallScore}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Overall Score
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedAudit === audit.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-4">
                    {/* Quality Metrics */}
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Report Quality Assessment
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completeness</span>
                            <span className="font-medium">9/10</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Clarity</span>
                            <span className="font-medium">8/10</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Accuracy</span>
                            <span className="font-medium">8/10</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Audit Process Compliance
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Procedure Adherence</span>
                            <span className="font-medium">9/10</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Documentation</span>
                            <span className="font-medium">9/10</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Timeline</span>
                            <span className="font-medium">9/10</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Issues and Improvements */}
                    {audit.issues.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-2">
                          Issues Found:
                        </p>
                        <ul className="text-sm text-red-800 dark:text-red-400 list-disc list-inside space-y-1">
                          {audit.issues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {audit.improvements.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-2">
                          Areas for Improvement:
                        </p>
                        <ul className="text-sm text-yellow-800 dark:text-yellow-400 list-disc list-inside space-y-1">
                          {audit.improvements.map((improvement, idx) => (
                            <li key={idx}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Reviewer Comments */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Reviewer Comments
                      </label>
                      <textarea
                        defaultValue={audit.comments}
                        placeholder="Add your review comments..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={3}
                      ></textarea>
                    </div>

                    {/* Action Buttons */}
                    {audit.status === "pending" && (
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          Approve
                        </button>
                        <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          Reject
                        </button>
                        <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
                          Request Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Quality Metrics Summary */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Quality Metrics Trend">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Report Quality</span>
                <span className="font-medium">8.3/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Process Compliance</span>
                <span className="font-medium">8.7/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Client Satisfaction</span>
                <span className="font-medium">4.5/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Auditor Performance</span>
                <span className="font-medium">8.5/10</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ✓ Overall quality is improving
                </p>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Approval Status">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Review</span>
                <span className="font-medium text-yellow-600">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Approved</span>
                <span className="font-medium text-green-600">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Rejected</span>
                <span className="font-medium text-red-600">0</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Approval Rate: 100%
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Auditor Performance */}
        <WidgetCard title="Auditor Performance Evaluation">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left font-medium">Auditor</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Recent Audits
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Avg Score
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium">Sarah Mitchell</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">8.7</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded text-xs font-medium">
                      Excellent
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">James Kennedy</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">8.0</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded text-xs font-medium">
                      Good
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </WidgetCard>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}

