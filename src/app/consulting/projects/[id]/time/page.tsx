"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

interface TimeEntry {
  id: string;
  date: string;
  consultant: string;
  task: string;
  hours: number;
  billable: boolean;
  status: "draft" | "submitted" | "approved";
  description: string;
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: "TE-001",
    date: "Oct 21, 2025",
    consultant: "Sarah Mitchell",
    task: "Implementation Plan Review",
    hours: 8,
    billable: true,
    status: "approved",
    description: "Final review and quality assurance of implementation plan",
  },
  {
    id: "TE-002",
    date: "Oct 20, 2025",
    consultant: "Sarah Mitchell",
    task: "Client Presentation Prep",
    hours: 6,
    billable: true,
    status: "approved",
    description: "Preparation for board presentation",
  },
  {
    id: "TE-003",
    date: "Oct 20, 2025",
    consultant: "James Kennedy",
    task: "Technical Documentation",
    hours: 7,
    billable: true,
    status: "submitted",
    description: "Technical specifications and architecture documentation",
  },
  {
    id: "TE-004",
    date: "Oct 19, 2025",
    consultant: "Emma Thompson",
    task: "Training Material Development",
    hours: 5,
    billable: true,
    status: "draft",
    description: "Creating training materials for executive workshop",
  },
];

const timeSummary = {
  totalHours: 26,
  billableHours: 26,
  nonBillableHours: 0,
  billablePercentage: 100,
  approvedHours: 14,
  submittedHours: 7,
  draftHours: 5,
};

export default function TimePage() {
  const params = useParams();
  const id = params.id as string;
  const [showForm, setShowForm] = useState(false);

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
              TIME TRACKING INTERFACE
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            + Log Time
          </button>
        </div>

        {/* Time Entry Form */}
        {showForm && (
          <WidgetCard title="LOG TIME ENTRY">
            <form className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Consultant</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    <option>Sarah Mitchell</option>
                    <option>James Kennedy</option>
                    <option>Emma Thompson</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Task</label>
                  <input type="text" placeholder="Task name" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hours</label>
                  <input type="number" placeholder="0" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea placeholder="Describe the work performed" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 h-24"></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="billable" defaultChecked className="w-4 h-4" />
                <label htmlFor="billable" className="text-sm text-gray-700 dark:text-gray-300">Billable Time</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                  Save Entry
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  Cancel
                </button>
              </div>
            </form>
          </WidgetCard>
        )}

        {/* Time Summary */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL HOURS</p>
            <p className="mt-2 text-3xl font-bold text-dark dark:text-white">{timeSummary.totalHours}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">BILLABLE</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{timeSummary.billableHours}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">({timeSummary.billablePercentage}%)</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">APPROVED</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{timeSummary.approvedHours}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">SUBMITTED</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">{timeSummary.submittedHours}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">DRAFT</p>
            <p className="mt-2 text-3xl font-bold text-gray-600">{timeSummary.draftHours}</p>
          </div>
        </div>

        {/* Time Entries */}
        <WidgetCard title="TIME ENTRIES">
          <div className="space-y-4">
            {mockTimeEntries.map((entry) => (
              <div key={entry.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-dark dark:text-white">{entry.task}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        entry.status === "approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : entry.status === "submitted"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                      {entry.billable && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Billable
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {entry.consultant} | {entry.date} | {entry.hours} hours
                    </p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{entry.hours}h</p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{entry.description}</p>

                {entry.status === "draft" && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                      Edit
                    </button>
                    <button className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                      Submit
                    </button>
                  </div>
                )}
                {entry.status === "submitted" && (
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

        {/* Time Analysis */}
        <WidgetCard title="TIME ANALYSIS">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Actual vs Estimated</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Estimated Hours:</span>
                  <span className="font-medium text-dark dark:text-white">24 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Actual Hours:</span>
                  <span className="font-medium text-dark dark:text-white">26 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Variance:</span>
                  <span className="font-medium text-red-600">+2 hours (8.3% over)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Utilization by Consultant</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sarah Mitchell:</span>
                  <span className="font-medium text-dark dark:text-white">14 hours (54%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">James Kennedy:</span>
                  <span className="font-medium text-dark dark:text-white">7 hours (27%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Emma Thompson:</span>
                  <span className="font-medium text-dark dark:text-white">5 hours (19%)</span>
                </div>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Approval Workflow */}
        <WidgetCard title="APPROVAL WORKFLOW">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">1. Consultant Logs Time</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Consultant enters time entry</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">2. Submit for Review</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Consultant submits timesheet</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">3. Manager Approval</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Project manager reviews and approves</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-dark dark:text-white">4. Billing Integration</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Approved hours sync to Zoho Books</p>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

