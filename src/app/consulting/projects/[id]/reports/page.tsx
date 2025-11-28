"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReportsPage() {
  const params = useParams();
  const id = params.id as string;
  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/consulting/projects/${params.id}`} className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
              ← Back to Project
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              PROJECT REPORTS & ANALYTICS
            </h1>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            Custom Report ▼
          </button>
        </div>

        {/* Quick Reports */}
        <WidgetCard title="QUICK REPORTS">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-left transition-colors">
              <p className="font-medium text-dark dark:text-white">Executive Summary</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">One-page project overview</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-left transition-colors">
              <p className="font-medium text-dark dark:text-white">Status Report</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Weekly/monthly status update</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-left transition-colors">
              <p className="font-medium text-dark dark:text-white">Financial Report</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Budget and cost analysis</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-left transition-colors">
              <p className="font-medium text-dark dark:text-white">Performance Metrics</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Timeline, quality, team metrics</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-left transition-colors">
              <p className="font-medium text-dark dark:text-white">Risk Summary</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Current risks and mitigation</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-left transition-colors">
              <p className="font-medium text-dark dark:text-white">Client Report</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Client-facing summary</p>
            </button>
          </div>
        </WidgetCard>

        {/* Executive Summary */}
        <WidgetCard title="EXECUTIVE PROJECT SUMMARY" action={<button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Export PDF</button>}>
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Project</p>
                <p className="text-sm font-medium text-dark dark:text-white">ABC Corp - Strategic Planning</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Report Date</p>
                <p className="text-sm font-medium text-dark dark:text-white">October 21, 2025</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Reporting Period</p>
                <p className="text-sm font-medium text-dark dark:text-white">May 1 - October 21, 2025</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</p>
                <p className="text-sm font-medium text-green-600">🟢 ON TRACK</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-dark dark:text-white mb-3">OVERALL PROJECT STATUS</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                  <span className="font-medium text-dark dark:text-white">78% complete (Expected: 75%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Timeline:</span>
                  <span className="font-medium text-green-600">6 days ahead of schedule ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                  <span className="font-medium text-green-600">$1,800 under budget (2% savings) ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                  <span className="font-medium text-green-600">Excellent - all deliverables approved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Client Satisfaction:</span>
                  <span className="font-medium text-green-600">4.8/5.0 ⭐⭐⭐⭐⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Health Score:</span>
                  <span className="font-medium text-green-600">92/100 (Excellent)</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-dark dark:text-white mb-3">KEY METRICS</p>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Schedule Performance Index (SPI)</p>
                  <p className="text-lg font-bold text-green-600 mt-1">1.03 ✓</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Cost Performance Index (CPI)</p>
                  <p className="text-lg font-bold text-green-600 mt-1">1.02 ✓</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Milestones Completed</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">15/18 (83%)</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Deliverables Delivered</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">7/10 (70%)</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-dark dark:text-white mb-3">ACCOMPLISHMENTS THIS PERIOD</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Phase 4 (Implementation Planning) 95% complete</li>
                <li>✓ Strategy Roadmap delivered and approved (Oct 15)</li>
                <li>✓ Implementation plan near completion</li>
                <li>✓ Change management strategy finalized</li>
                <li>✓ All critical risks mitigated successfully</li>
                <li>✓ Board presentation materials 85% complete</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-dark dark:text-white mb-3">UPCOMING ACTIVITIES (Next 14 Days)</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Oct 22: Implementation Plan approval</li>
                <li>• Oct 26: Internal presentation review</li>
                <li>• Oct 28: Final Board presentation (Critical)</li>
                <li>• Oct 30: Executive strategy workshop</li>
                <li>• Oct 31: Project completion and closeout</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-dark dark:text-white mb-3">RISKS & ISSUES</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Active Risks:</p>
                  <p className="text-sm font-medium text-green-600">0 (All previously identified risks successfully mitigated)</p>
                </div>
                <span className="text-lg">🟢</span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Report Templates */}
        <WidgetCard title="REPORT TEMPLATES">
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-dark dark:text-white">Status Report Template</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Weekly/monthly status updates for stakeholders</p>
              <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">Use Template →</button>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-dark dark:text-white">Financial Report Template</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Budget tracking and cost analysis</p>
              <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">Use Template →</button>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-dark dark:text-white">Risk Report Template</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Risk register and mitigation status</p>
              <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">Use Template →</button>
            </div>
          </div>
        </WidgetCard>

        {/* Export Options */}
        <WidgetCard title="EXPORT OPTIONS">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-center transition-colors">
              <p className="text-2xl mb-2">📄</p>
              <p className="font-medium text-dark dark:text-white">PDF</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Professional format</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-center transition-colors">
              <p className="text-2xl mb-2">📊</p>
              <p className="font-medium text-dark dark:text-white">Excel</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Spreadsheet format</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-center transition-colors">
              <p className="text-2xl mb-2">🎯</p>
              <p className="font-medium text-dark dark:text-white">PowerPoint</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Presentation format</p>
            </button>
          </div>
        </WidgetCard>

        {/* Scheduled Reports */}
        <WidgetCard title="SCHEDULED REPORTS">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">Weekly Status Report</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Every Monday at 9:00 AM</p>
                </div>
                <span className="text-xs font-medium text-green-600">Active</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">Monthly Financial Report</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">First day of each month at 8:00 AM</p>
                </div>
                <span className="text-xs font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

