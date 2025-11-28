"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use } from "react";

export default function AuditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  use(params);
  const [reportData, setReportData] = useState({
    title: "Audit Report - ABC Corporation",
    executiveSummary: "",
    findings: true,
    observations: true,
    recommendations: true,
    includePhotos: true,
    includeSignatures: true,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <button className="text-primary hover:text-primary-hover mb-2">
            ← Back to Audit
          </button>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Generate Audit Report
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Create and customize audit report for A-2025-142
          </p>
        </div>

        {/* Report Template Selection */}
        <WidgetCard title="Report Template">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Template
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>ISO 9001 Standard Report</option>
                <option>ISO 14001 Standard Report</option>
                <option>ISO 45001 Standard Report</option>
                <option>Custom Template</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Report Title
              </label>
              <input
                type="text"
                value={reportData.title}
                onChange={(e) =>
                  setReportData({ ...reportData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </WidgetCard>

        {/* Report Sections */}
        <WidgetCard title="Report Sections">
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={reportData.findings}
                onChange={(e) =>
                  setReportData({ ...reportData, findings: e.target.checked })
                }
              />
              <span className="font-medium">Include Findings</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={reportData.observations}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    observations: e.target.checked,
                  })
                }
              />
              <span className="font-medium">Include Observations</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={reportData.recommendations}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    recommendations: e.target.checked,
                  })
                }
              />
              <span className="font-medium">Include Recommendations</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={reportData.includePhotos}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    includePhotos: e.target.checked,
                  })
                }
              />
              <span className="font-medium">Include Evidence Photos</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={reportData.includeSignatures}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    includeSignatures: e.target.checked,
                  })
                }
              />
              <span className="font-medium">Include Digital Signatures</span>
            </label>
          </div>
        </WidgetCard>

        {/* Executive Summary */}
        <WidgetCard title="Executive Summary">
          <div>
            <label className="block text-sm font-medium mb-2">
              Summary Text
            </label>
            <textarea
              value={reportData.executiveSummary}
              onChange={(e) =>
                setReportData({
                  ...reportData,
                  executiveSummary: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={6}
              placeholder="Enter executive summary..."
            ></textarea>
          </div>
        </WidgetCard>

        {/* Findings Selection */}
        <WidgetCard title="Select Findings to Include">
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">
                🟡 Minor NC-01: Documented Procedure Gap
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">
                🟡 Minor NC-02: Training Record Incomplete
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">
                🟢 Observation-01: Opportunity for Improvement
              </span>
            </label>
          </div>
        </WidgetCard>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
            Preview
          </button>
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
            Generate PDF
          </button>
          <button className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10">
            Email to Client
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
            Save as Draft
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

