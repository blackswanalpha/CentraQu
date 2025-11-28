"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  daysUntil: number;
  priority: "high" | "medium" | "low";
  phase: string;
  owner: string;
  status: "on-track" | "preparation-needed" | "scheduled";
  readiness: number;
  description: string;
  deliverables: string[];
  dependencies: string[];
  nextActions: string[];
}

const mockMilestones: Milestone[] = [
  {
    id: "MS-001",
    title: "Implementation Plan Approval",
    dueDate: "Oct 22, 2025",
    daysUntil: 1,
    priority: "high",
    phase: "4 - Implementation Planning",
    owner: "Sarah Mitchell",
    status: "on-track",
    readiness: 95,
    description: "Final implementation plan document ready for client approval.",
    deliverables: ["Implementation roadmap", "Resource plan", "Risk assessment", "Final document compilation"],
    dependencies: ["All prerequisite tasks completed", "Client feedback incorporated"],
    nextActions: ["Final quality review (Oct 21)", "Submit to client for approval (Oct 22 AM)", "Schedule approval meeting if needed"],
  },
  {
    id: "MS-002",
    title: "Final Strategy Presentation to Board",
    dueDate: "Oct 28, 2025",
    daysUntil: 7,
    priority: "high",
    phase: "5 - Final Delivery",
    owner: "Sarah Mitchell",
    status: "preparation-needed",
    readiness: 85,
    description: "Present final strategy, roadmap, and implementation plan to ABC Corp Board of Directors.",
    deliverables: ["Presentation deck (40 slides)", "Executive summary", "Appendix - Detailed Analysis", "Handout - One-Page Strategy"],
    dependencies: ["Presentation deck created", "Executive summary prepared"],
    nextActions: ["Internal review scheduled (Oct 26)", "Dry run with team (Oct 27)", "Final rehearsal (Oct 28 AM)"],
  },
  {
    id: "MS-003",
    title: "Executive Strategy Workshop",
    dueDate: "Oct 30, 2025",
    daysUntil: 9,
    priority: "high",
    phase: "5 - Final Delivery",
    owner: "Sarah Mitchell",
    status: "scheduled",
    readiness: 100,
    description: "Full-day facilitated workshop with executive team to align on strategy execution.",
    deliverables: ["Workshop agenda", "Participant list", "Materials", "Logistics confirmation"],
    dependencies: ["Venue booked", "Participants confirmed"],
    nextActions: ["Materials preparation (Oct 28-29)", "Final confirmation with participants"],
  },
];

const completedMilestones = [
  {
    title: "Strategy Roadmap Delivery",
    completedDate: "Oct 15, 2025",
    phase: "3",
    owner: "Sarah Mitchell",
    feedback: "Excellent (5/5 stars)",
    comment: "The roadmap exceeds our expectations. Clear, actionable, and well-structured.",
  },
  {
    title: "Strategic Options Analysis Approval",
    completedDate: "Jul 28, 2025",
    phase: "2",
    owner: "Sarah Mitchell",
    feedback: "Very Good (4/5 stars)",
    comment: "",
  },
  {
    title: "Current State Assessment Completion",
    completedDate: "May 19, 2025",
    phase: "1",
    owner: "Sarah Mitchell & Emma Thompson",
    feedback: "Excellent (5/5 stars)",
    comment: "",
  },
];

export default function MilestonesPage() {
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
              MILESTONE TRACKER
            </h1>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            + Add Milestone
          </button>
        </div>

        {/* Milestone Overview */}
        <WidgetCard title="MILESTONE OVERVIEW">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Milestones: 18</span>
              <span className="text-gray-600 dark:text-gray-400">Completed: 15 (83%)</span>
              <span className="text-gray-600 dark:text-gray-400">Remaining: 3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">On-Time Completion: 100%</span>
              <span className="text-gray-600 dark:text-gray-400">Average Lead Time: 2 days early</span>
            </div>
          </div>
        </WidgetCard>

        {/* Upcoming Milestones */}
        <WidgetCard title="UPCOMING MILESTONES (Next 30 Days)">
          <div className="space-y-4">
            {mockMilestones.map((milestone) => (
              <div key={milestone.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⏰</span>
                      <h4 className="font-semibold text-dark dark:text-white">{milestone.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Due: {milestone.dueDate} ({milestone.daysUntil} day{milestone.daysUntil !== 1 ? "s" : ""}) | Priority: {milestone.priority}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    milestone.status === "on-track"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : milestone.status === "preparation-needed"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {milestone.status === "on-track" ? "🟢 On Track" : milestone.status === "preparation-needed" ? "🟡 Preparation Needed" : "🔵 Scheduled"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{milestone.description}</p>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Deliverables:</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {milestone.deliverables.map((d, i) => (
                        <li key={i}>✓ {d}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Next Actions:</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {milestone.nextActions.map((a, i) => (
                        <li key={i}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Readiness: {milestone.readiness}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${milestone.readiness}%` }} />
                    </div>
                  </div>
                  <button className="ml-4 px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Completed Milestones */}
        <WidgetCard title="COMPLETED MILESTONES (Recent)" footer={<Link href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All (15)</Link>}>
          <div className="space-y-4">
            {completedMilestones.map((milestone, idx) => (
              <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-dark dark:text-white">✓ {milestone.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Completed: {milestone.completedDate} | Phase: {milestone.phase} | Owner: {milestone.owner}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {milestone.feedback}
                  </span>
                </div>
                {milestone.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{milestone.comment}"</p>
                )}
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Performance Metrics */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <WidgetCard title="MILESTONE PERFORMANCE">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">On-Time Rate:</span>
                <span className="font-medium text-green-600">100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Early:</span>
                <span className="font-medium text-green-600">2 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Late:</span>
                <span className="font-medium text-gray-600">0 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Trend:</span>
                <span className="font-medium text-green-600">Excellent ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Missed Milestones:</span>
                <span className="font-medium text-gray-600">None</span>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="CRITICAL PATH MILESTONES">
            <div className="space-y-3 text-sm">
              <p className="text-gray-600 dark:text-gray-400">Milestones on Critical Path:</p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Implementation Plan (Oct 22)</li>
                <li>• Final Presentation (Oct 28)</li>
                <li>• Project Complete (Oct 31)</li>
              </ul>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-green-600">All on track ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Level:</span>
                  <span className="font-medium text-green-600">Low</span>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

