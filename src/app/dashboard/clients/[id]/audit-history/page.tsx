"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { use } from "react";

export default function ClientAuditHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  use(params);
  const auditHistory = [
    {
      id: "A-2025-142",
      date: "2025-09-15",
      type: "Stage 2",
      standard: "ISO 9001:2015",
      status: "completed",
      findings: 3,
      majorNC: 1,
      minorNC: 2,
      leadAuditor: "Sarah Mitchell",
      reportUrl: "#",
    },
    {
      id: "A-2025-100",
      date: "2024-09-10",
      type: "Surveillance",
      standard: "ISO 9001:2015",
      status: "completed",
      findings: 1,
      majorNC: 0,
      minorNC: 1,
      leadAuditor: "James Kennedy",
      reportUrl: "#",
    },
    {
      id: "A-2024-089",
      date: "2024-03-20",
      type: "Stage 1",
      standard: "ISO 9001:2015",
      status: "completed",
      findings: 5,
      majorNC: 2,
      minorNC: 3,
      leadAuditor: "Sarah Mitchell",
      reportUrl: "#",
    },
    {
      id: "A-2023-045",
      date: "2023-09-15",
      type: "Recertification",
      standard: "ISO 9001:2015",
      status: "completed",
      findings: 2,
      majorNC: 0,
      minorNC: 2,
      leadAuditor: "Linda Peterson",
      reportUrl: "#",
    },
  ];

  const certifications = [
    {
      standard: "ISO 9001:2015",
      issueDate: "2023-10-15",
      expiryDate: "2026-10-14",
      status: "active",
      daysRemaining: 347,
    },
  ];

  const stats = {
    totalAudits: 4,
    completedAudits: 4,
    totalFindings: 11,
    majorNC: 3,
    minorNC: 8,
    certifications: 1,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      scheduled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <button className="text-primary hover:text-primary-hover mb-2">
            ← Back to Clients
          </button>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            ABC Corporation - Audit History
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Complete audit history and certification status
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Audits"
            value={stats.totalAudits}
            status="normal"
            iconColor="primary"
          />
          <KPICard
            title="Total Findings"
            value={stats.totalFindings}
            status="normal"
            iconColor="info"
          />
          <KPICard
            title="Major NCs"
            value={stats.majorNC}
            status="warning"
            iconColor="error"
          />
          <KPICard
            title="Active Certifications"
            value={stats.certifications}
            status="normal"
            iconColor="success"
          />
        </div>

        {/* Certification Status */}
        <WidgetCard title="Certification Status">
          <div className="space-y-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-dark dark:text-white">
                      {cert.standard}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Issued: {cert.issueDate} | Expires: {cert.expiryDate}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded text-sm font-medium">
                    Active
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(cert.daysRemaining / 1095) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {cert.daysRemaining} days remaining
                </p>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Audit Timeline */}
        <WidgetCard title="Audit Timeline">
          <div className="space-y-4">
            {auditHistory.map((audit, idx) => (
              <div
                key={audit.id}
                className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  {idx < auditHistory.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600 my-2"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-dark dark:text-white">
                        {audit.id} - {audit.type} Audit
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {audit.date} | {audit.standard}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        audit.status
                      )}`}
                    >
                      {audit.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span>Lead: {audit.leadAuditor}</span>
                    <span>Findings: {audit.findings}</span>
                    <span>🔴 {audit.majorNC} Major</span>
                    <span>🟡 {audit.minorNC} Minor</span>
                  </div>
                  <button className="text-primary hover:text-primary-hover text-sm font-medium">
                    View Report →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Findings Trend */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard title="Findings Trend">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">2023 Recertification</span>
                <span className="font-medium">2 findings</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">2024 Stage 1</span>
                <span className="font-medium">5 findings</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">2024 Surveillance</span>
                <span className="font-medium">1 finding</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">2025 Stage 2</span>
                <span className="font-medium">3 findings</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ✓ Trend: Improving (findings decreasing)
                </p>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Upcoming Audits">
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Year 2 Surveillance Audit
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-400">
                  Scheduled: 2025-10-15
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-1">
                  Re-certification Audit
                </p>
                <p className="text-xs text-yellow-800 dark:text-yellow-400">
                  Scheduled: 2026-10-14
                </p>
              </div>
              <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 text-sm font-medium">
                Schedule Audit
              </button>
            </div>
          </WidgetCard>
        </div>

        {/* Quick Actions */}
        <WidgetCard title="Quick Actions">
          <div className="flex gap-4 flex-wrap">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
              Schedule New Audit
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Download All Reports
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Export History
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              View Certificates
            </button>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

