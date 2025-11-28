"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { auditService, type Audit } from "@/services/audit.service";
import { apiClient } from "@/lib/api-client";

interface CertificationStats {
  total: number;
  active: number;
  expiring_soon: number;
  expired: number;
  suspended: number;
  revoked: number;
  pending: number;
}

// Component that uses search params
function CertificationContent() {
  const searchParams = useSearchParams();
  const highlightAuditId = searchParams.get('audit'); // Get audit ID from URL params
  
  const [filterStatus, setFilterStatus] = useState<"all" | "ready" | "pending" | "issued">("all");
  const [auditsForCertification, setAuditsForCertification] = useState<Audit[]>([]);
  const [stats, setStats] = useState<CertificationStats>({
    total: 0,
    active: 0,
    expiring_soon: 0,
    expired: 0,
    suspended: 0,
    revoked: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate audit progress based on checklist responses
  const calculateAuditProgress = (checklistResponses: any[]) => {
    if (!checklistResponses || checklistResponses.length === 0) {
      return { percentage: 0, completed: 0, total: 0 };
    }
    
    const total = checklistResponses.length;
    const completed = checklistResponses.filter((r: any) => r.compliance_status !== 'pending').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { percentage, completed, total };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all audits and filter for those ready for certification (100% complete)
        const [auditsResponse, statsResponse] = await Promise.all([
          auditService.getAudits({ ordering: '-planned_end_date' }), // Get all audits, not just "COMPLETED" status
          apiClient.get<CertificationStats>('/certifications/statistics/'),
        ]);

        let allAudits = auditsResponse.results || [];
        
        // Filter audits that are 100% complete (ready for certification)
        let auditsForCert = allAudits.filter(audit => {
          // Include audits with completed status (backend uses 'COMPLETED')
          if (audit.status === 'COMPLETED') {
            return true;
          }
          // Include audits that are 100% complete based on checklist responses
          if (audit.checklist_responses && audit.checklist_responses.length > 0) {
            const progress = calculateAuditProgress(audit.checklist_responses);
            return progress.percentage === 100;
          }
          return false;
        });
        
        // If we have a specific audit ID, make sure it's included even if not in the filtered list
        if (highlightAuditId) {
          const auditExists = auditsForCert.some(audit => audit.id.toString() === highlightAuditId);
          if (!auditExists) {
            try {
              const specificAudit = await auditService.getAudit(highlightAuditId);
              // Check if this audit is actually ready for certification (100% complete)
              if (specificAudit.checklist_responses) {
                const progress = calculateAuditProgress(specificAudit.checklist_responses);
                if (progress.percentage === 100) {
                  auditsForCert = [specificAudit, ...auditsForCert];
                }
              }
            } catch (err) {
              console.warn('Could not fetch specific audit:', err);
            }
          }
        }

        setAuditsForCertification(auditsForCert);
        setStats(statsResponse);
      } catch (err) {
        console.error('Error fetching certification data:', err);
        setError('Failed to load certification data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [highlightAuditId]); // Re-fetch when audit ID changes

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ready: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      issued: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      ready: "✅",
      pending: "⏳",
      issued: "📜",
    };
    return badges[status] || "•";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Certification Issuance
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage and issue certifications for completed audits
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            Generate Certificate
          </button>
        </div>

        {/* Highlight Notification */}
        {highlightAuditId && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <p className="text-green-800 dark:text-green-200 font-medium">
                Audit completed successfully! The certification for audit #{highlightAuditId} is ready for issuance.
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading certification data...</p>
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
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Ready for Certification"
                value={auditsForCertification.length}
                status="normal"
                iconColor="success"
              />
              <KPICard
                title="Pending Approval"
                value={stats.pending}
                status="normal"
                iconColor="accent"
              />
              <KPICard
                title="Active Certifications"
                value={stats.active}
                status="normal"
                iconColor="primary"
              />
              <KPICard
                title="Expiring Soon"
                value={stats.expiring_soon}
            status="warning"
            iconColor="error"
          />
        </div>

        {/* Filters */}
        <WidgetCard title="Filters">
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Status: All</option>
              <option value="ready">Ready for Certification</option>
              <option value="pending">Pending Approval</option>
              <option value="issued">Issued</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>Standard: All</option>
              <option>ISO 9001</option>
              <option>ISO 14001</option>
              <option>ISO 45001</option>
            </select>
            <input
              type="text"
              placeholder="Search client..."
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </WidgetCard>

        {/* Audits for Certification */}
        <WidgetCard title="Audits Requiring Certification">
          <div className="space-y-4">
            {auditsForCertification.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No completed audits ready for certification.
              </div>
            ) : (
              auditsForCertification.map((audit) => {
                const certStatus = audit.certificate_number ? "issued" : "ready";
                const isHighlighted = highlightAuditId && audit.id.toString() === highlightAuditId;
                return (
                  <div
                    key={audit.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      isHighlighted 
                        ? 'border-primary bg-primary/5 shadow-lg dark:bg-primary/10' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-dark dark:text-white">
                            {getStatusBadge(certStatus)} {audit.client_name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(certStatus)}`}
                          >
                            {certStatus === "issued" ? "Certificate Issued" : "Ready for Certification"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {audit.iso_standard_name} | {audit.audit_type} | Audit #: {audit.audit_number}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Completed: {audit.actual_end_date ? new Date(audit.actual_end_date).toLocaleDateString() : 'N/A'} |
                          Lead Auditor: {audit.lead_auditor_name || 'Unassigned'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/audits/certifications/${audit.id}`}
                          className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-hover"
                        >
                          {certStatus === "issued" ? "View Certificate" : "Issue Certificate"}
                        </Link>
                        <Link
                          href={`/dashboard/audits/${audit.id}`}
                          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                        >
                          View Audit
                        </Link>
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Audit Findings
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-red-600">Major: {audit.major_findings}</span>
                          <span className="text-yellow-600">Minor: {audit.minor_findings}</span>
                          <span className="text-blue-600">Opp: {audit.opportunities}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Certificate Validity
                        </p>
                        <p className="text-sm font-medium">
                          {audit.certificate_issue_date && audit.certificate_expiry_date
                            ? `${new Date(audit.certificate_issue_date).toLocaleDateString()} to ${new Date(audit.certificate_expiry_date).toLocaleDateString()}`
                            : "Not yet issued"}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Certificate Number
                        </p>
                        <p className="text-sm font-medium">
                          {audit.certificate_number || "Not yet assigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </WidgetCard>

        {/* Quick Actions */}
        <WidgetCard title="Quick Actions">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-left">
              <div className="text-2xl mb-2">📋</div>
              <p className="font-medium text-dark dark:text-white">Bulk Certificate Generation</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generate multiple certificates at once</p>
            </button>

            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-left">
              <div className="text-2xl mb-2">🎨</div>
              <p className="font-medium text-dark dark:text-white">Manage Templates</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Edit certificate templates and layouts</p>
            </button>

            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-left">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-medium text-dark dark:text-white">Certification Analytics</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">View certification statistics and trends</p>
            </button>

            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-left">
              <div className="text-2xl mb-2">📧</div>
              <p className="font-medium text-dark dark:text-white">Send Notifications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notify clients about certificate status</p>
            </button>
          </div>
        </WidgetCard>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}

// Main component with Suspense wrapper
export default function CertificationIssuancePage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading certifications...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <CertificationContent />
    </Suspense>
  );
}