"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { useState, use } from "react";
import Link from "next/link";

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");

  const opportunity = {
    id: id,
    company: "EFG Industries",
    service: "Digital Transformation",
    value: 78000,
    probability: 90,
    stage: "Verbal Commit",
    expectedClose: "Nov 15, 2025",
    daysToClose: 11,
    salesCycle: 52,
    owner: "James Kennedy",
    created: "Sep 24, 2025",
    daysOpen: 28,
  };

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    { id: "contacts", label: "CONTACTS" },
    { id: "activity", label: "ACTIVITY" },
    { id: "documents", label: "DOCUMENTS" },
    { id: "notes", label: "NOTES" },
  ];

  const stages = [
    { name: "Inquiry", date: "Sep 24", days: 2, completed: true },
    { name: "Qualified", date: "Sep 28", days: 4, completed: true },
    { name: "Proposal", date: "Oct 5", days: 7, completed: true },
    { name: "Negotiation", date: "Oct 18", days: 13, completed: true },
    { name: "Verbal", date: "Oct 20", days: 2, completed: true, current: true },
    { name: "Won", date: "", days: 0, completed: false },
  ];

  const stakeholders = [
    {
      name: "Sarah Johnson",
      title: "CTO",
      role: "Decision Maker",
      email: "s.johnson@efgindustries.co.ke",
      phone: "+254 722 345 678",
      engagement: "High",
      sentiment: "Very Positive",
      lastContact: "Oct 20 (Video call - 45 min)",
    },
    {
      name: "David Kimani",
      title: "Operations Director",
      role: "Influencer",
      email: "d.kimani@efgindustries.co.ke",
      phone: "+254 733 456 789",
      engagement: "Medium",
      sentiment: "Positive",
      lastContact: "Oct 15 (Site visit)",
    },
    {
      name: "Mary Wanjiru",
      title: "CFO",
      role: "Gatekeeper",
      email: "m.wanjiru@efgindustries.co.ke",
      phone: "+254 711 567 890",
      engagement: "Low",
      sentiment: "Neutral (Budget Concern)",
      lastContact: "Oct 12 (Email exchange)",
      warning: "Need to address ROI concerns before contract",
    },
  ];

  const activities = [
    {
      date: "Oct 20, 3:30 PM",
      type: "Video Call",
      title: "Video Call with Sarah Johnson (CTO)",
      duration: "45 minutes",
      participants: "James Kennedy, Sarah Johnson",
      outcome: "Verbal commitment received! Contract review scheduled for Nov 12. Very positive meeting.",
    },
    {
      date: "Oct 18, 10:00 AM",
      type: "Presentation",
      title: "Proposal Presentation",
      location: "EFG Industries HQ",
      participants: "James Kennedy, Linda Peterson, Sarah Johnson, David Kimani, Mary Wanjiru",
      outcome: "Positive reception. CFO had ROI questions but we addressed them.",
    },
    {
      date: "Oct 15, 2:00 PM",
      type: "Site Visit",
      title: "Site Visit & Discovery Session",
      location: "EFG Manufacturing Facility",
      outcome: "Heavy manual processes, staff eager for change",
    },
  ];

  const documents = [
    { name: "Proposal_v2.pdf", type: "PDF", size: "2.4 MB" },
    { name: "SOW_Digital_Trans.docx", type: "DOCX", size: "156 KB" },
    { name: "ROI_Analysis.xlsx", type: "XLSX", size: "89 KB" },
    { name: "Case_Study_ABC.pdf", type: "PDF", size: "1.2 MB" },
    { name: "Site_Photos.zip", type: "ZIP", size: "8.5 MB" },
    { name: "Assessment_Notes.docx", type: "DOCX", size: "234 KB" },
  ];

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/consulting/business-development/opportunities"
              className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
            >
              ← Back to Opportunities
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              {opportunity.id}: {opportunity.company.toUpperCase()} - {opportunity.service.toUpperCase()}
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              EDIT
            </button>
            <button className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700">
              CONVERT TO WON
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stage</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {opportunity.stage}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Value</p>
              <p className="text-xl font-bold text-dark dark:text-white">
                ${opportunity.value.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Probability</p>
              <p className="text-xl font-bold text-green-600">{opportunity.probability}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expected Close</p>
              <p className="text-lg font-semibold text-dark dark:text-white">
                {opportunity.expectedClose}
              </p>
              <p className="text-sm text-gray-500">({opportunity.daysToClose} days)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sales Cycle</p>
              <p className="text-lg font-semibold text-dark dark:text-white">{opportunity.salesCycle} days</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Owner</p>
              <p className="text-lg font-semibold text-dark dark:text-white">{opportunity.owner}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
              <p className="text-lg font-semibold text-dark dark:text-white">{opportunity.created}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
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
          <div className="space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Opportunity Details */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="font-semibold text-dark dark:text-white mb-4">OPPORTUNITY DETAILS</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Service Type:</p>
                    <p className="text-dark dark:text-white font-medium">{opportunity.service}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Current Stage:</p>
                    <p className="text-dark dark:text-white font-medium">{opportunity.stage} ({opportunity.probability}%)</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Value:</p>
                    <p className="text-dark dark:text-white font-medium">${opportunity.value.toLocaleString()}</p>
                    <p className="text-gray-500">Weighted: ${(opportunity.value * opportunity.probability / 100).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Expected Close:</p>
                    <p className="text-dark dark:text-white font-medium">{opportunity.expectedClose}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Contract Duration:</p>
                    <p className="text-dark dark:text-white font-medium">6 months</p>
                    <p className="text-gray-500">Start Date: Dec 1, 2025</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Lead Source:</p>
                    <p className="text-dark dark:text-white font-medium">Referral (ABC Corp)</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Created:</p>
                    <p className="text-dark dark:text-white font-medium">{opportunity.created}</p>
                    <p className="text-gray-500">Days Open: {opportunity.daysOpen}</p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="font-semibold text-dark dark:text-white mb-4">COMPANY INFORMATION</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Company:</p>
                    <p className="text-dark dark:text-white font-medium">EFG Industries</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Industry:</p>
                    <p className="text-dark dark:text-white font-medium">Manufacturing</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Size:</p>
                    <p className="text-dark dark:text-white font-medium">250 employees</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Location:</p>
                    <p className="text-dark dark:text-white font-medium">Nairobi, Kenya</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Website:</p>
                    <p className="text-blue-600 font-medium">efgindustries.co.ke</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Revenue:</p>
                    <p className="text-dark dark:text-white font-medium">$15M annually</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Current System:</p>
                    <p className="text-dark dark:text-white font-medium">Manual/Legacy</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Relationship History:</p>
                    <ul className="text-dark dark:text-white space-y-1 mt-1">
                      <li>• New client (first project)</li>
                      <li>• Referral from ABC Corp</li>
                      <li>• No prior engagements</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium dark:bg-blue-900 dark:text-blue-300">
                    VIEW FULL PROFILE
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium dark:border-gray-600">
                    CREATE CLIENT RECORD
                  </button>
                </div>
              </div>
            </div>

            {/* Sales Stage Progression */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-semibold text-dark dark:text-white mb-4">SALES STAGE PROGRESSION</h3>
              
              {/* Stage Timeline */}
              <div className="flex items-center justify-between mb-6">
                {stages.map((stage, index) => (
                  <div key={stage.name} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          stage.completed
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        } ${stage.current ? "ring-4 ring-blue-300" : ""}`}
                      >
                        {stage.completed ? "✓" : "●"}
                      </div>
                      <p className="text-xs font-medium text-dark dark:text-white mt-2">{stage.name}</p>
                      {stage.date && (
                        <>
                          <p className="text-xs text-gray-500 mt-1">{stage.date}</p>
                          <p className="text-xs text-gray-400">({stage.days}d)</p>
                        </>
                      )}
                    </div>
                    {index < stages.length - 1 && (
                      <div
                        className={`h-1 w-16 mx-2 ${
                          stage.completed ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-dark dark:text-white">
                  <span className="font-medium">Current Stage:</span> Verbal Commit (Day 2)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Avg Time in Stage: 5 days | Historical: 3-7 days
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Next Stage: Closed-Won (Contract signature)
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Sales Velocity: Good pace ✓ | Expected close on track
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                  ADVANCE STAGE
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                  UPDATE PROBABILITY
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                  SET REMINDER
                </button>
              </div>
            </div>

            {/* Key Stakeholders */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark dark:text-white">KEY STAKEHOLDERS</h3>
                <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                  + Add Contact
                </button>
              </div>
              
              <div className="space-y-4">
                {stakeholders.map((person) => (
                  <div key={person.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-dark dark:text-white">
                          👤 {person.name} - {person.title} ({person.role})
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Email: {person.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Phone: {person.phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          person.engagement === "High" ? "bg-green-100 text-green-800" : 
                          person.engagement === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {person.engagement} Engagement
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {person.sentiment}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="font-medium">Role:</span> {person.role === "Decision Maker" ? "Final approver, technical requirements" : person.role === "Influencer" ? "End-user champion, implementation lead" : "Budget approval, ROI validation"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Last Contact: {person.lastContact}
                    </p>
                    {person.warning && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mb-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          ⚠ Action: {person.warning}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium dark:bg-blue-900 dark:text-blue-300">
                        ✉ EMAIL
                      </button>
                      <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium dark:bg-blue-900 dark:text-blue-300">
                        📞 CALL
                      </button>
                      <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium dark:bg-blue-900 dark:text-blue-300">
                        📅 SCHEDULE
                      </button>
                      <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium dark:border-gray-600">
                        VIEW HISTORY
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-dark dark:text-white">RECENT ACTIVITY</h3>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                + Log Activity
              </button>
            </div>
            {activities.map((activity, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-dark dark:text-white">{activity.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.date}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {activity.type}
                  </span>
                </div>
                {activity.duration && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration: {activity.duration}</p>
                )}
                {activity.location && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location: {activity.location}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Participants: {activity.participants}
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-3">
                  <p className="text-sm text-dark dark:text-white">
                    <span className="font-medium">Outcome:</span> {activity.outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-dark dark:text-white">DOCUMENTS ({documents.length})</h3>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                UPLOAD
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 hover:border-blue-300 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-dark dark:text-white">📄 {doc.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-sm text-blue-600 hover:text-blue-700">View</button>
                    <button className="text-sm text-blue-600 hover:text-blue-700">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ConsultingDashboardLayout>
  );
}

