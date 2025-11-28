"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { Badge } from "@/components/Dashboard/badge";
import { useState } from "react";
import Link from "next/link";

export default function OpportunitiesListPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban" | "timeline">("list");

  const pipelineSummary = {
    totalPipeline: 825000,
    opportunityCount: 20,
    weightedForecast: 485000,
    quarterTarget: 150000,
    coverageRatio: 5.5,
    winRate: 68,
  };

  const closingThisMonth = [
    {
      id: "OPP-2025-089",
      company: "EFG Industries",
      service: "Digital Transformation",
      value: 78000,
      probability: 90,
      stage: "Verbal Commit",
      expectedClose: "Nov 15, 2025",
      owner: "James Kennedy",
      lastActivity: "Oct 20 (Client call)",
      nextAction: "Contract review meeting - Nov 12, 10:00 AM",
      daysToClose: 11,
      daysInStage: 8,
      salesCycle: 52,
      decisionMaker: "CTO Sarah Johnson (Engaged)",
      budget: "Approved ($80K allocated)",
      competition: "None identified",
      riskLevel: "low",
    },
    {
      id: "OPP-2025-087",
      company: "HIJ Corporation",
      service: "Strategic Planning",
      value: 65000,
      probability: 80,
      stage: "Negotiation",
      expectedClose: "Nov 22, 2025",
      owner: "Sarah Mitchell",
      lastActivity: "Oct 18 (In-person mtg)",
      nextAction: "Final pricing discussion - Nov 8, 2:00 PM",
      daysToClose: 18,
      daysInStage: 12,
      salesCycle: 45,
      decisionMaker: "CEO Mark Williams (Very Interested)",
      budget: "Pending approval ($70K requested)",
      competition: "ConsultCo (pricing higher)",
      riskLevel: "medium",
    },
  ];

  const activeOpportunities = [
    {
      id: "OPP-2025-086",
      company: "KLM Enterprises",
      service: "Process Optimization",
      value: 52000,
      probability: 65,
      stage: "Proposal",
      expectedClose: "Dec 5, 2025",
      owner: "Linda Peterson",
      lastActivity: "Oct 19 (Email)",
      nextAction: "Proposal presentation - Nov 10, 11:00 AM",
      daysInStage: 15,
      salesCycle: 38,
    },
    {
      id: "OPP-2025-085",
      company: "NOP Group",
      service: "Change Management",
      value: 48000,
      probability: 70,
      stage: "Proposal",
      expectedClose: "Dec 10, 2025",
      owner: "Sarah Mitchell",
      lastActivity: "Oct 17 (Site visit)",
      nextAction: "Technical workshop - Nov 12, 9:00 AM",
      daysInStage: 18,
      salesCycle: 41,
    },
    {
      id: "OPP-2025-084",
      company: "STU Technologies",
      service: "Digital Strategy",
      value: 58000,
      probability: 60,
      stage: "Qualified",
      expectedClose: "Dec 18, 2025",
      owner: "James Kennedy",
      lastActivity: "Oct 15 (Discovery call)",
      nextAction: "Needs assessment - Nov 5, 3:00 PM",
      daysInStage: 22,
      salesCycle: 32,
    },
  ];

  const needsAttention = [
    {
      id: "OPP-2025-072",
      company: "QRS Limited",
      service: "IT Strategy",
      value: 38000,
      probability: 40,
      stage: "Qualified",
      expectedClose: "TBD",
      owner: "Michael Roberts",
      lastActivity: "Aug 20 (Email)",
      issue: "STALLED: 62 days with no activity",
      reason: "No response to multiple follow-up attempts",
    },
    {
      id: "OPP-2025-078",
      company: "VWX Manufacturing",
      service: "Operations Excellence",
      value: 42000,
      probability: 55,
      stage: "Proposal",
      expectedClose: "Nov 30, 2025",
      owner: "Linda Peterson",
      lastActivity: "Oct 10 (Proposal sent)",
      issue: "DELAYED: Proposal sent 11 days ago, no response",
      reason: "Client requested time to review with team",
    },
  ];

  const recentlyWon = [
    {
      id: "OPP-2025-083",
      company: "YZA Consulting",
      service: "Strategic Planning",
      value: 45000,
      wonDate: "Oct 19, 2025",
      owner: "Sarah Mitchell",
      salesCycle: 38,
      projectStart: "Nov 4, 2025",
      duration: "3 months",
      winReason: "Expertise and competitive pricing",
    },
  ];

  const getRiskBadge = (level: string) => {
    if (level === "low") return <Badge label="Low Risk 🟢" variant="success" size="sm" />;
    if (level === "medium") return <Badge label="Medium Risk 🟡" variant="warning" size="sm" />;
    return <Badge label="High Risk 🔴" variant="error" size="sm" />;
  };

  const getStageBadge = (stage: string) => {
    const variants: Record<string, "primary" | "success" | "warning" | "info"> = {
      "Verbal Commit": "success",
      "Negotiation": "warning",
      "Proposal": "info",
      "Qualified": "primary",
    };
    return <Badge label={stage} variant={variants[stage] || "primary"} size="sm" />;
  };

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Business Development &gt; Opportunities
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Comprehensive view of all consulting sales opportunities
            </p>
          </div>
          <Link
            href="/consulting/business-development/opportunities/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Opportunity
          </Link>
        </div>

        {/* Pipeline Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">
            PIPELINE SUMMARY
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Pipeline</p>
              <p className="text-2xl font-bold text-dark dark:text-white">
                ${pipelineSummary.totalPipeline.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">({pipelineSummary.opportunityCount} opportunities)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Weighted Forecast</p>
              <p className="text-2xl font-bold text-blue-600">
                ${pipelineSummary.weightedForecast.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Quarter Target</p>
              <p className="text-2xl font-bold text-green-600">
                ${pipelineSummary.quarterTarget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coverage Ratio</p>
              <p className="text-xl font-bold text-dark dark:text-white">
                {pipelineSummary.coverageRatio}x
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
              <p className="text-xl font-bold text-dark dark:text-white">
                {pipelineSummary.winRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Views */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dark dark:text-white">FILTERS & VIEWS</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">Save View ▼</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700">
              <option>Stage: All</option>
              <option>Lead</option>
              <option>Qualified</option>
              <option>Proposal</option>
              <option>Negotiation</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700">
              <option>Service: All</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700">
              <option>Owner: All</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700">
              <option>Value: Any</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700">
              <option>Close Date: All Time</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700">
              <option>Status: Active</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium dark:bg-blue-900 dark:text-blue-300">
              My Opportunities
            </button>
            <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
              Hot Deals
            </button>
            <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
              Stalled
            </button>
            <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
              Won
            </button>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="🔍 Search by company, contact, or keyword..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700"
            />
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              Export
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                ● List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  viewMode === "kanban"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                ○ Kanban
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  viewMode === "timeline"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                ○ Timeline
              </button>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-3 py-1 rounded-lg border border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700">
                <option>Sort: Expected Close Date</option>
              </select>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {pipelineSummary.opportunityCount} of {pipelineSummary.opportunityCount}
              </span>
            </div>
          </div>
        </div>

        {/* Closing This Month */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
            🔥 CLOSING THIS MONTH ({closingThisMonth.length} opportunities)
          </h2>
          <div className="space-y-6">
            {closingThisMonth.map((opp) => (
              <div key={opp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-dark dark:text-white">
                      {opp.id} | {opp.company}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      💼 {opp.service} | Value: ${opp.value.toLocaleString()} | Prob: {opp.probability}%
                    </p>
                  </div>
                  {getRiskBadge(opp.riskLevel)}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Stage:</span>{" "}
                    {getStageBadge(opp.stage)}
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Expected Close:</span>{" "}
                    <span className="text-dark dark:text-white">{opp.expectedClose}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Owner:</span>{" "}
                    <span className="text-dark dark:text-white">{opp.owner}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Last Activity:</span>{" "}
                    <span className="text-dark dark:text-white">{opp.lastActivity}</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                  <p className="text-sm text-dark dark:text-white">
                    <span className="font-medium">Next Action:</span> {opp.nextAction}
                  </p>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  ⏰ Closing in {opp.daysToClose} days | Days in Stage: {opp.daysInStage} | Sales Cycle: {opp.salesCycle}d
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-dark dark:text-white mb-2">Key Details:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Decision Maker: {opp.decisionMaker}</li>
                    <li>• Budget: {opp.budget}</li>
                    <li>• Competition: {opp.competition}</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/consulting/business-development/opportunities/${opp.id}`}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    OPEN
                  </Link>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                    SEND CONTRACT
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                    SCHEDULE MEETING
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                    UPDATE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Opportunities - Simplified for brevity */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
            🎯 ACTIVE OPPORTUNITIES ({activeOpportunities.length} opportunities)
          </h2>
          <div className="space-y-4">
            {activeOpportunities.map((opp) => (
              <div key={opp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark dark:text-white">
                      {opp.id} | {opp.company}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      💼 {opp.service} | Value: ${opp.value.toLocaleString()} | Prob: {opp.probability}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Stage: {opp.stage} | Expected Close: {opp.expectedClose}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Owner: {opp.owner} | Last Activity: {opp.lastActivity}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      Next Action: {opp.nextAction}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Days in Stage: {opp.daysInStage} | Sales Cycle: {opp.salesCycle}d
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/consulting/business-development/opportunities/${opp.id}`}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                    >
                      OPEN
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              [SHOW MORE (12 additional opportunities)]
            </button>
          </div>
        </div>

        {/* Needs Attention & Recently Won - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Needs Attention */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
              ⚠ NEEDS ATTENTION ({needsAttention.length} opportunities)
            </h2>
            <div className="space-y-4">
              {needsAttention.map((opp) => (
                <div key={opp.id} className="border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <h3 className="font-semibold text-dark dark:text-white">
                    {opp.id} | {opp.company}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    💼 {opp.service} | Value: ${opp.value.toLocaleString()} | Prob: {opp.probability}%
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                    ⚠ {opp.issue}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Issue: {opp.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Won */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
              ✓ RECENTLY WON ({recentlyWon.length} opportunity this week)
            </h2>
            <div className="space-y-4">
              {recentlyWon.map((opp) => (
                <div key={opp.id} className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-dark dark:text-white">
                    {opp.id} | {opp.company}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    💼 {opp.service} | Value: ${opp.value.toLocaleString()} | Won: {opp.wonDate}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Owner: {opp.owner} | Sales Cycle: {opp.salesCycle} days
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Project Start: {opp.projectStart} | Duration: {opp.duration}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Win Reason: {opp.winReason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Pipeline Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="font-semibold text-dark dark:text-white mb-4">QUICK ACTIONS</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                + NEW OPPORTUNITY
              </button>
              <button className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                IMPORT FROM RFP
              </button>
              <button className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                BULK UPDATE
              </button>
              <button className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                EXPORT PIPELINE
              </button>
              <button className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                FORECAST REPORT
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="font-semibold text-dark dark:text-white mb-4">PIPELINE INSIGHTS</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">🔥 Deals closing this month</span>
                <span className="font-semibold text-dark dark:text-white">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">🎯 Active opportunities</span>
                <span className="font-semibold text-dark dark:text-white">15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">⚠ Requiring attention</span>
                <span className="font-semibold text-dark dark:text-white">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">✓ Win rate</span>
                <span className="font-semibold text-green-600">68% (excellent)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">📈 Pipeline growth</span>
                <span className="font-semibold text-blue-600">+12%</span>
              </div>
              <button className="w-full mt-4 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                DETAILED ANALYSIS
              </button>
            </div>
          </div>
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

