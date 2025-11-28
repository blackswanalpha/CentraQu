"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ChangeRequest {
  id: string;
  title: string;
  requestedBy: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected" | "implemented";
  priority: "high" | "medium" | "low";
  timelineImpact: string;
  budgetImpact: number;
  resourceImpact: string;
  description: string;
  justification: string;
  approvedBy?: string;
  approvalDate?: string;
}

const mockChangeRequests: ChangeRequest[] = [
  {
    id: "CHG-001",
    title: "Add executive dashboard to implementation plan",
    requestedBy: "John Smith (Client CEO)",
    requestDate: "Oct 10, 2025",
    status: "approved",
    priority: "high",
    timelineImpact: "+2 weeks",
    budgetImpact: 12000,
    resourceImpact: "1 additional developer for 2 weeks",
    description: "Client requested addition of real-time executive dashboard to track KPIs",
    justification: "Critical for executive visibility and decision-making",
    approvedBy: "Sarah Mitchell",
    approvalDate: "Oct 12, 2025",
  },
  {
    id: "CHG-002",
    title: "Expand training scope to include 3 additional departments",
    requestedBy: "Mary Wanjiru (Client COO)",
    requestDate: "Oct 15, 2025",
    status: "approved",
    priority: "medium",
    timelineImpact: "+1 week",
    budgetImpact: 8500,
    resourceImpact: "Training specialist for 1 week",
    description: "Client wants to expand training to Finance, HR, and Operations departments",
    justification: "Broader organizational adoption needed",
    approvedBy: "Sarah Mitchell",
    approvalDate: "Oct 16, 2025",
  },
  {
    id: "CHG-003",
    title: "Modify reporting frequency from monthly to weekly",
    requestedBy: "James Kennedy (PM)",
    requestDate: "Oct 18, 2025",
    status: "pending",
    priority: "medium",
    timelineImpact: "No impact",
    budgetImpact: 0,
    resourceImpact: "Minimal - automated reports",
    description: "Change status reporting from monthly to weekly during implementation phase",
    justification: "Better visibility during critical implementation phase",
  },
];

const changeStats = {
  total: 15,
  approved: 8,
  rejected: 2,
  pending: 3,
  implemented: 2,
  totalValue: 45000,
  approvalRate: 80,
};

export default function ChangesPage() {
  const params = useParams();
  const id = params.id as string;
  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/consulting/projects/${id}`} className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
              ← Back to Project
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              CHANGE REQUEST MANAGEMENT
            </h1>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            + New Change Request
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL REQUESTS</p>
            <p className="mt-2 text-3xl font-bold text-dark dark:text-white">{changeStats.total}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">APPROVED</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{changeStats.approved}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">PENDING</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">{changeStats.pending}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL VALUE</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">${(changeStats.totalValue / 1000).toFixed(0)}K</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">APPROVAL RATE</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{changeStats.approvalRate}%</p>
          </div>
        </div>

        {/* Approval Workflow */}
        <WidgetCard title="CHANGE REQUEST WORKFLOW">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">1. Request Submission</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Requestor submits change with justification</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">2. Impact Analysis</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">PM analyzes timeline, budget, and resource impact</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">3. Approval Decision</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Steering committee approves or rejects</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">4. Implementation</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Approved changes integrated into project</p>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Change Requests */}
        <WidgetCard title="CHANGE REQUESTS">
          <div className="space-y-4">
            {mockChangeRequests.map((request) => (
              <div key={request.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-dark dark:text-white">{request.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : request.status === "approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : request.status === "rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.priority === "high"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Requested by: {request.requestedBy} | Date: {request.requestDate}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{request.description}</p>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Timeline Impact:</p>
                    <p className="text-gray-600 dark:text-gray-400">{request.timelineImpact}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Budget Impact:</p>
                    <p className="text-gray-600 dark:text-gray-400">${request.budgetImpact.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Resource Impact:</p>
                    <p className="text-gray-600 dark:text-gray-400">{request.resourceImpact}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm mb-3">
                  <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Justification:</p>
                  <p className="text-gray-600 dark:text-gray-400">{request.justification}</p>
                </div>

                {request.approvedBy && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Approved by {request.approvedBy} on {request.approvalDate}
                  </div>
                )}

                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                      Approve
                    </button>
                    <button className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Baseline Comparison */}
        <WidgetCard title="BASELINE COMPARISON">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-4 font-medium text-gray-600 dark:text-gray-400">Metric</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-600 dark:text-gray-400">Original</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-600 dark:text-gray-400">Current</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-600 dark:text-gray-400">Variance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-400">Project Duration</td>
                  <td className="text-right py-2 px-4 text-gray-600 dark:text-gray-400">6 months</td>
                  <td className="text-right py-2 px-4 text-gray-600 dark:text-gray-400">6.5 months</td>
                  <td className="text-right py-2 px-4 text-red-600">+0.5 months</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-400">Project Budget</td>
                  <td className="text-right py-2 px-4 text-gray-600 dark:text-gray-400">$85,000</td>
                  <td className="text-right py-2 px-4 text-gray-600 dark:text-gray-400">$105,500</td>
                  <td className="text-right py-2 px-4 text-red-600">+$20,500</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-400">Team Size</td>
                  <td className="text-right py-2 px-4 text-gray-600 dark:text-gray-400">4 people</td>
                  <td className="text-right py-2 px-4 text-gray-600 dark:text-gray-400">5 people</td>
                  <td className="text-right py-2 px-4 text-red-600">+1 person</td>
                </tr>
              </tbody>
            </table>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

