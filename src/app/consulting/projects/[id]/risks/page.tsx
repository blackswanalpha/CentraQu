"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Risk {
  id: string;
  title: string;
  category: string;
  probability: number;
  impact: number;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "mitigated" | "closed";
  owner: string;
  mitigation: string;
  contingency: string;
}

const mockRisks: Risk[] = [
  {
    id: "RISK-001",
    title: "Key stakeholder unavailability",
    category: "Resource",
    probability: 30,
    impact: 80,
    severity: "high",
    status: "mitigated",
    owner: "Sarah Mitchell",
    mitigation: "Assigned interim sponsor (CFO) as decision maker",
    contingency: "Escalation to CEO if needed",
  },
  {
    id: "RISK-002",
    title: "Technical complexity higher than anticipated",
    category: "Technical",
    probability: 40,
    impact: 60,
    severity: "medium",
    status: "mitigated",
    owner: "James Kennedy",
    mitigation: "Brought in technical specialist for 2 weeks",
    contingency: "Extended timeline approved by client",
  },
  {
    id: "RISK-003",
    title: "Scope creep from change requests",
    category: "Scope",
    probability: 50,
    impact: 70,
    severity: "high",
    status: "active",
    owner: "Sarah Mitchell",
    mitigation: "Formal change control process implemented",
    contingency: "Additional budget allocation available",
  },
];

const mockIssues = [
  {
    id: "ISSUE-001",
    title: "Delayed client feedback on draft materials",
    priority: "high",
    status: "open",
    owner: "Sarah Mitchell",
    dueDate: "Oct 22, 2025",
    description: "Client has not provided feedback on implementation plan draft",
    action: "Send reminder email and schedule follow-up call",
  },
];

export default function RisksPage() {
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
              RISK & ISSUE REGISTER
            </h1>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              + Add Risk
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              + Add Issue
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ACTIVE RISKS</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">1</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Requires attention</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">MITIGATED</p>
            <p className="mt-2 text-3xl font-bold text-green-600">2</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Under control</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ACTIVE ISSUES</p>
            <p className="mt-2 text-3xl font-bold text-red-600">1</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Needs resolution</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">RISK TREND</p>
            <p className="mt-2 text-3xl font-bold text-green-600">↓</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Decreasing</p>
          </div>
        </div>

        {/* Risk Matrix */}
        <WidgetCard title="RISK MATRIX (Probability vs Impact)">
          <div className="overflow-x-auto">
            <div className="min-w-max p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                5x5 Risk Matrix visualization showing probability (horizontal) vs impact (vertical)
              </p>
              <div className="grid grid-cols-6 gap-2 text-xs">
                <div></div>
                {["Very Low", "Low", "Medium", "High", "Very High"].map((label) => (
                  <div key={label} className="text-center font-medium text-gray-600 dark:text-gray-400">
                    {label}
                  </div>
                ))}
                {["Very High", "High", "Medium", "Low", "Very Low"].map((impact) => (
                  <div key={impact} className="text-center font-medium text-gray-600 dark:text-gray-400">
                    {impact}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                Interactive matrix would display risks as colored dots based on their probability and impact scores
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Risk Register */}
        <WidgetCard title="RISK REGISTER">
          <div className="space-y-4">
            {mockRisks.map((risk) => (
              <div key={risk.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-dark dark:text-white">{risk.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        risk.severity === "critical"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : risk.severity === "high"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : risk.severity === "medium"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        risk.status === "active"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : risk.status === "mitigated"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Category: {risk.category} | Owner: {risk.owner}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Probability & Impact:</p>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Probability: {risk.probability}%</p>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden w-24">
                          <div className="h-full bg-blue-500" style={{ width: `${risk.probability}%` }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Impact: {risk.impact}%</p>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden w-24">
                          <div className="h-full bg-red-500" style={{ width: `${risk.impact}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Mitigation Plan:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{risk.mitigation}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs">
                  <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Contingency Plan:</p>
                  <p className="text-gray-600 dark:text-gray-400">{risk.contingency}</p>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Issue Log */}
        <WidgetCard title="ISSUE LOG">
          <div className="space-y-4">
            {mockIssues.map((issue) => (
              <div key={issue.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-dark dark:text-white">{issue.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        issue.priority === "high"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Owner: {issue.owner} | Due: {issue.dueDate}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{issue.description}</p>
                <p className="text-sm font-medium text-blue-600">Action: {issue.action}</p>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Risk Categories */}
        <WidgetCard title="RISK CATEGORIES">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
            {["Strategic", "Operational", "Financial", "Resource", "Client"].map((category) => (
              <div key={category} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-sm font-medium text-dark dark:text-white">{category}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Risks</p>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

