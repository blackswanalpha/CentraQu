"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Deliverable {
  id: string;
  name: string;
  type: string;
  dueDate: string;
  status: "pending" | "submitted" | "approved" | "revision";
  approvalStatus: "pending" | "internal-review" | "client-review" | "approved";
  versions: number;
  clientRating?: number;
  submittedDate?: string;
  approvedDate?: string;
}

const mockDeliverables: Deliverable[] = [
  {
    id: "DEL-001",
    name: "Current State Assessment Report",
    type: "Report",
    dueDate: "May 19, 2025",
    status: "approved",
    approvalStatus: "approved",
    versions: 1,
    clientRating: 5,
    submittedDate: "May 18, 2025",
    approvedDate: "May 19, 2025",
  },
  {
    id: "DEL-002",
    name: "Strategic Options Analysis",
    type: "Analysis Document",
    dueDate: "Jul 28, 2025",
    status: "approved",
    approvalStatus: "approved",
    versions: 2,
    clientRating: 4,
    submittedDate: "Jul 25, 2025",
    approvedDate: "Jul 28, 2025",
  },
  {
    id: "DEL-003",
    name: "Strategy Roadmap",
    type: "Presentation",
    dueDate: "Oct 15, 2025",
    status: "approved",
    approvalStatus: "approved",
    versions: 3,
    clientRating: 5,
    submittedDate: "Oct 14, 2025",
    approvedDate: "Oct 15, 2025",
  },
  {
    id: "DEL-004",
    name: "Implementation Plan",
    type: "Document",
    dueDate: "Oct 22, 2025",
    status: "submitted",
    approvalStatus: "client-review",
    versions: 1,
    submittedDate: "Oct 21, 2025",
  },
  {
    id: "DEL-005",
    name: "Board Presentation Deck",
    type: "Presentation",
    dueDate: "Oct 28, 2025",
    status: "pending",
    approvalStatus: "pending",
    versions: 0,
  },
  {
    id: "DEL-006",
    name: "Executive Workshop Materials",
    type: "Training Materials",
    dueDate: "Oct 30, 2025",
    status: "pending",
    approvalStatus: "pending",
    versions: 0,
  },
];

const statusColors = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  revision: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export default function DeliverablesPage() {
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
              DELIVERABLES MANAGEMENT
            </h1>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            + Upload Deliverable
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL DELIVERABLES</p>
            <p className="mt-2 text-3xl font-bold text-dark dark:text-white">10</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">APPROVED</p>
            <p className="mt-2 text-3xl font-bold text-green-600">7</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">(70%)</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">SUBMITTED</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">1</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">In Review</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">PENDING</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">2</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Due Soon</p>
          </div>
        </div>

        {/* Quality Checklist */}
        <WidgetCard title="PRE-SUBMISSION QUALITY CHECKLIST">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked readOnly className="w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Content completeness verified</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked readOnly className="w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Formatting and branding applied</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked readOnly className="w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Spelling and grammar reviewed</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked readOnly className="w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Technical accuracy verified</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" readOnly className="w-4 h-4" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Client review completed</span>
            </div>
          </div>
        </WidgetCard>

        {/* Deliverables List */}
        <WidgetCard title="DELIVERABLES LIST">
          <div className="space-y-4">
            {mockDeliverables.map((deliverable) => (
              <div key={deliverable.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-dark dark:text-white">{deliverable.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[deliverable.status]}`}>
                        {deliverable.status.charAt(0).toUpperCase() + deliverable.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Type: {deliverable.type} | Due: {deliverable.dueDate} | Versions: {deliverable.versions}
                    </p>
                  </div>
                  {deliverable.clientRating && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-600">★ {deliverable.clientRating}/5</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Client Rating</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Approval Status:</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {deliverable.approvalStatus === "pending"
                        ? "Pending"
                        : deliverable.approvalStatus === "internal-review"
                        ? "Internal Review"
                        : deliverable.approvalStatus === "client-review"
                        ? "Client Review"
                        : "Approved"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Submitted:</p>
                    <p className="text-gray-600 dark:text-gray-400">{deliverable.submittedDate || "Not yet"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Approved:</p>
                    <p className="text-gray-600 dark:text-gray-400">{deliverable.approvedDate || "Pending"}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                    View
                  </button>
                  {deliverable.status === "pending" && (
                    <button className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                      Upload
                    </button>
                  )}
                  {deliverable.status === "submitted" && (
                    <button className="px-3 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Request Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Approval Workflow */}
        <WidgetCard title="APPROVAL WORKFLOW">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">1. Internal Review</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Quality assurance and completeness check</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">2. Client Review</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Client feedback and approval</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">3. Final Approval</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Project manager sign-off</p>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

