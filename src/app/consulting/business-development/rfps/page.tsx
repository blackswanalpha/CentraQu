"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { Badge } from "@/components/Dashboard/badge";
import { ProgressBar } from "@/components/Dashboard/progress-bar";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useState } from "react";

export default function RFPManagementPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [viewMode, setViewMode] = useState("list");

  const rfpStats = {
    active: 8,
    submitted: 12,
    won: 9,
    lost: 3,
    winRate: 75,
    avgResponseTime: 14,
  };

  const activeRFPs = [
    {
      id: "RFP-2025-012",
      client: "National Bank of Kenya",
      title: "Digital Banking Transformation",
      dueDate: "2025-11-15",
      daysRemaining: 8,
      estimatedValue: 285000,
      status: "In Progress",
      completion: 65,
      assignedTo: "James Kennedy",
      priority: "High",
      sections: 12,
      completedSections: 8,
    },
    {
      id: "RFP-2025-011",
      client: "SafariCom Ltd",
      title: "Process Optimization Consulting",
      dueDate: "2025-11-20",
      daysRemaining: 13,
      estimatedValue: 175000,
      status: "In Progress",
      completion: 45,
      assignedTo: "Sarah Mitchell",
      priority: "High",
      sections: 10,
      completedSections: 5,
    },
    {
      id: "RFP-2025-010",
      client: "Kenya Power",
      title: "Change Management Services",
      dueDate: "2025-11-25",
      daysRemaining: 18,
      estimatedValue: 95000,
      status: "Not Started",
      completion: 0,
      assignedTo: "Linda Peterson",
      priority: "Medium",
      sections: 8,
      completedSections: 0,
    },
  ];

  const submittedRFPs = [
    {
      id: "RFP-2025-009",
      client: "Equity Bank",
      title: "Risk Management Framework",
      submittedDate: "2025-10-28",
      estimatedValue: 145000,
      status: "Under Review",
      followUpDate: "2025-11-10",
    },
    {
      id: "RFP-2025-008",
      client: "KCB Group",
      title: "Strategic Planning Engagement",
      submittedDate: "2025-10-22",
      estimatedValue: 220000,
      status: "Shortlisted",
      followUpDate: "2025-11-05",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "primary";
      case "Not Started":
        return "warning";
      case "Under Review":
        return "info";
      case "Shortlisted":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "danger";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              RFP Management
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage responses to Requests for Proposals
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              RFP Library
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              Question Bank
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              + New RFP
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active RFPs</p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-1">{rfpStats.active}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-1">{rfpStats.submitted}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Won</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{rfpStats.won}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Lost</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{rfpStats.lost}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{rfpStats.winRate}%</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-1">{rfpStats.avgResponseTime}d</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "active"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Active RFPs ({activeRFPs.length})
            </button>
            <button
              onClick={() => setActiveTab("submitted")}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "submitted"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Submitted ({submittedRFPs.length})
            </button>
            <button
              onClick={() => setActiveTab("won")}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "won"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Won ({rfpStats.won})
            </button>
            <button
              onClick={() => setActiveTab("lost")}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "lost"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Lost ({rfpStats.lost})
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "library"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              RFP Library
            </button>
          </div>
        </div>

        {/* Active RFPs */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {/* Filters & View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-700 dark:bg-gray-800">
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-700 dark:bg-gray-800">
                  <option>All Statuses</option>
                  <option>In Progress</option>
                  <option>Not Started</option>
                </select>
                <input
                  type="text"
                  placeholder="Search RFPs..."
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    viewMode === "calendar"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>

            {/* RFP Cards */}
            {activeRFPs.map((rfp) => (
              <div
                key={rfp.id}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-dark dark:text-white">
                        {rfp.title}
                      </h3>
                      <Badge label={rfp.priority} variant={getPriorityColor(rfp.priority) as any} size="sm" />
                      <Badge label={rfp.status} variant={getStatusColor(rfp.status) as any} size="sm" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{rfp.id}</span>
                      <span>•</span>
                      <span>{rfp.client}</span>
                      <span>•</span>
                      <span>Assigned to: {rfp.assignedTo}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Value</p>
                    <p className="text-xl font-bold text-blue-600">${rfp.estimatedValue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                    <p className="font-medium text-dark dark:text-white">{rfp.dueDate}</p>
                    <p className={`text-sm ${rfp.daysRemaining <= 7 ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}>
                      {rfp.daysRemaining} days remaining
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
                    <p className="font-medium text-dark dark:text-white">{rfp.completion}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rfp.completedSections}/{rfp.sections} sections
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Progress</p>
                    <ProgressBar
                      value={rfp.completion}
                      max={100}
                      variant={rfp.completion >= 80 ? "success" : rfp.completion >= 50 ? "primary" : "warning"}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Link
                      href={`/consulting/business-development/rfps/${rfp.id}`}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                    >
                      Open Workspace
                    </Link>
                    <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                      View Details
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                      📎 Attachments
                    </button>
                    <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                      💬 Comments
                    </button>
                    <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                      ⋮
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submitted RFPs */}
        {activeTab === "submitted" && (
          <div className="space-y-4">
            {submittedRFPs.map((rfp) => (
              <div
                key={rfp.id}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-dark dark:text-white">
                        {rfp.title}
                      </h3>
                      <Badge label={rfp.status} variant={getStatusColor(rfp.status) as any} size="sm" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{rfp.id}</span>
                      <span>•</span>
                      <span>{rfp.client}</span>
                      <span>•</span>
                      <span>Submitted: {rfp.submittedDate}</span>
                      <span>•</span>
                      <span>Follow-up: {rfp.followUpDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Value</p>
                    <p className="text-xl font-bold text-blue-600">${rfp.estimatedValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RFP Library */}
        {activeTab === "library" && (
          <WidgetCard title="RFP Library" action={<button className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Template</button>}>
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="font-semibold text-dark dark:text-white mb-2">Company Overview Template</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Standard company overview section with credentials, certifications, and team overview
                </p>
                <div className="flex gap-2">
                  <Badge label="Used 24 times" variant="info" size="sm" />
                  <Badge label="Last updated: Oct 2025" variant="neutral" size="sm" />
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="font-semibold text-dark dark:text-white mb-2">Methodology & Approach Template</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Detailed consulting methodology with phases, deliverables, and timeline
                </p>
                <div className="flex gap-2">
                  <Badge label="Used 18 times" variant="info" size="sm" />
                  <Badge label="Last updated: Sep 2025" variant="neutral" size="sm" />
                </div>
              </div>
            </div>
          </WidgetCard>
        )}
      </div>
    </ConsultingDashboardLayout>
  );
}

