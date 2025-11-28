"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

interface Phase {
  name: string;
  progress: number;
  startDate: string;
  endDate: string;
  status: "completed" | "in-progress" | "upcoming";
}

const mockProjectDetail = {
  id: "PRJ-2025-041",
  name: "ABC CORP - STRATEGIC PLANNING",
  status: "on-track",
  progress: 78,
  health: 92,
  pm: "Sarah Mitchell",
  duration: "May 1 - Oct 31, 2025",
  daysRemaining: 6,
  
  details: {
    projectId: "PRJ-2025-041",
    type: "Strategic Planning",
    serviceLine: "Strategy",
    contract: "CON-2025-047",
    value: 85000,
    contractType: "Fixed Price",
    startDate: "May 1, 2025",
    endDate: "Oct 31, 2025",
    duration: 184,
    daysElapsed: 178,
    daysRemaining: 6,
  },
  
  client: {
    name: "ABC Corporation",
    industry: "Manufacturing",
    primaryContact: "John Smith (CEO)",
    phone: "+254 700 123 456",
    email: "j.smith@abccorp.com",
    sponsor: "John Smith",
    champion: "Mary Wanjiru (COO)",
    stakeholders: 8,
  },

  phases: [
    { name: "Discovery & Assessment", progress: 100, startDate: "May 1", endDate: "May 21", status: "completed" },
    { name: "Strategy Development", progress: 100, startDate: "May 22", endDate: "Jul 2", status: "completed" },
    { name: "Roadmap & Planning", progress: 100, startDate: "Jul 3", endDate: "Aug 27", status: "completed" },
    { name: "Implementation Planning", progress: 95, startDate: "Aug 28", endDate: "Oct 22", status: "in-progress" },
    { name: "Final Delivery & Transition", progress: 25, startDate: "Oct 23", endDate: "Oct 31", status: "upcoming" },
  ] as Phase[],

  healthScorecard: {
    timeline: { score: 95, status: "On schedule, ahead by 6 days" },
    budget: { score: 90, status: "Budget: $85,000 | Spent: $66,300 (78%)" },
    quality: { score: 94, status: "All deliverables approved on first submission" },
    clientSatisfaction: { score: 96, status: "Highly engaged sponsor, excellent relationship" },
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "team" | "budget" | "deliverables" | "files">("overview");

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    { id: "timeline", label: "TIMELINE" },
    { id: "team", label: "TEAM" },
    { id: "budget", label: "BUDGET" },
    { id: "deliverables", label: "DELIVERABLES" },
    { id: "files", label: "FILES" },
  ] as const;

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/consulting/projects" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
              ← Back to Projects
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              {mockProjectDetail.name}
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Status: 🟢 On Track | Progress: {mockProjectDetail.progress}% | Health Score: {mockProjectDetail.health}/100
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              EDIT
            </button>
            <button className="px-4 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950">
              CLOSE PROJECT
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Project Details */}
            <WidgetCard title="PROJECT DETAILS">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Project ID:</span>
                  <span className="font-medium text-dark dark:text-white">{mockProjectDetail.details.projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium text-dark dark:text-white">{mockProjectDetail.details.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service Line:</span>
                  <span className="font-medium text-dark dark:text-white">{mockProjectDetail.details.serviceLine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contract:</span>
                  <span className="font-medium text-dark dark:text-white">{mockProjectDetail.details.contract}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Value:</span>
                  <span className="font-medium text-dark dark:text-white">${(mockProjectDetail.details.value / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium text-dark dark:text-white">{mockProjectDetail.details.duration} days</span>
                </div>
              </div>
            </WidgetCard>

            {/* Client Information */}
            <WidgetCard title="CLIENT INFORMATION">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Client:</span>
                  <span className="font-medium text-dark dark:text-white">{mockProjectDetail.client.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                  <span className="font-medium text-dark dark:text-white">{mockProjectDetail.client.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Primary Contact:</span>
                  <span className="font-medium text-dark dark:text-white">{mockProjectDetail.client.primaryContact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-dark dark:text-white text-xs">{mockProjectDetail.client.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Stakeholders:</span>
                  <span className="font-medium text-dark dark:text-white">{mockProjectDetail.client.stakeholders}</span>
                </div>
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === "overview" && (
          <>
            {/* Project Progress */}
            <WidgetCard title="PROJECT PROGRESS">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress: {mockProjectDetail.progress}%</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Expected: 75% | Ahead of schedule ✓</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${mockProjectDetail.progress}%` }} />
                </div>

                <div className="space-y-3 mt-6">
                  <p className="text-sm font-medium text-dark dark:text-white">Phase Breakdown:</p>
                  {mockProjectDetail.phases.map((phase, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{phase.name}</span>
                        <span className="text-gray-600 dark:text-gray-400">{phase.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                        <div
                          className={`h-full ${
                            phase.status === "completed"
                              ? "bg-green-500"
                              : phase.status === "in-progress"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </WidgetCard>

            {/* Health Scorecard */}
            <WidgetCard title="PROJECT HEALTH SCORECARD">
              <div className="space-y-4">
                {Object.entries(mockProjectDetail.healthScorecard).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <span className="text-sm font-bold text-blue-600">{value.score}/100</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden mb-1">
                      <div className="h-full bg-blue-500" style={{ width: `${value.score}%` }} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{value.status}</p>
                  </div>
                ))}
              </div>
            </WidgetCard>
          </>
        )}

        {activeTab === "timeline" && (
          <WidgetCard title="PROJECT TIMELINE">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Timeline view coming soon</p>
              <Link href={`/consulting/projects/${params.id}/milestones`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Milestones →
              </Link>
            </div>
          </WidgetCard>
        )}

        {activeTab === "deliverables" && (
          <WidgetCard title="DELIVERABLES">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Deliverables management coming soon</p>
              <Link href={`/consulting/projects/${params.id}/deliverables`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Deliverables →
              </Link>
            </div>
          </WidgetCard>
        )}

        {activeTab === "budget" && (
          <WidgetCard title="BUDGET">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget tracking coming soon</p>
              <Link href={`/consulting/projects/${params.id}/budget`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Budget →
              </Link>
            </div>
          </WidgetCard>
        )}

        {(activeTab === "team" || activeTab === "files") && (
          <WidgetCard title={activeTab === "team" ? "TEAM" : "FILES"}>
            <p className="text-sm text-gray-600 dark:text-gray-400">Content coming soon</p>
          </WidgetCard>
        )}
      </div>
    </ConsultingDashboardLayout>
  );
}

