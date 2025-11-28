"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use } from "react";

export default function AuditPreparationChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  use(params);
  const [checklist, setChecklist] = useState({
    documentReview: true,
    travelArrangements: true,
    equipmentChecklist: false,
    clientDocuments: true,
    previousAuditReview: false,
    teamBriefing: false,
  });

  const [notes, setNotes] = useState({
    documentReview: "All documents received and reviewed",
    travelArrangements: "Flight and hotel booked",
    equipmentChecklist: "Pending - need to pack camera",
    clientDocuments: "Client sent all required documents",
    previousAuditReview: "In progress",
    teamBriefing: "Scheduled for 2025-09-14",
  });

  const toggleItem = (key: keyof typeof checklist) => {
    setChecklist({ ...checklist, [key]: !checklist[key] });
  };

  const completionPercentage = Math.round(
    (Object.values(checklist).filter(Boolean).length / Object.keys(checklist).length) * 100
  );

  const checklistItems = [
    {
      key: "documentReview",
      title: "Document Review",
      description: "Review all client documents and previous audit reports",
      dueDate: "2025-09-13",
      assignee: "Sarah Mitchell",
    },
    {
      key: "travelArrangements",
      title: "Travel Arrangements",
      description: "Confirm flights, accommodation, and ground transportation",
      dueDate: "2025-09-13",
      assignee: "Sarah Mitchell",
    },
    {
      key: "equipmentChecklist",
      title: "Equipment Checklist",
      description: "Prepare and verify all audit equipment",
      dueDate: "2025-09-14",
      assignee: "Sarah Mitchell",
      items: [
        { name: "Laptop", status: true },
        { name: "Camera", status: false },
        { name: "Measuring tools", status: true },
        { name: "Audit forms", status: true },
        { name: "Backup power", status: true },
      ],
    },
    {
      key: "clientDocuments",
      title: "Client Document Receipt",
      description: "Confirm receipt of all required documents from client",
      dueDate: "2025-09-13",
      assignee: "Client Contact",
    },
    {
      key: "previousAuditReview",
      title: "Previous Audit Review",
      description: "Review findings from previous audits and follow-up status",
      dueDate: "2025-09-14",
      assignee: "Sarah Mitchell",
    },
    {
      key: "teamBriefing",
      title: "Team Briefing",
      description: "Conduct pre-audit team briefing and role assignment",
      dueDate: "2025-09-14",
      assignee: "Sarah Mitchell",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <button className="text-primary hover:text-primary-hover mb-2">
            ← Back to Audit
          </button>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Audit Preparation Checklist
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Pre-audit preparation for A-2025-142 | Audit Date: 2025-09-15
          </p>
        </div>

        {/* Progress Overview */}
        <WidgetCard title="Preparation Progress">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-dark dark:text-white">
                Preparation Progress
              </p>
              <p className="text-2xl font-bold text-primary">
                {completionPercentage}%
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {Object.values(checklist).filter(Boolean).length} of{" "}
              {Object.keys(checklist).length} items completed
            </p>
          </div>
        </WidgetCard>

        {/* Checklist Items */}
        <WidgetCard title="Pre-Audit Checklist">
          <div className="space-y-4">
            {checklistItems.map((item) => (
              <div
                key={item.key}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={checklist[item.key as keyof typeof checklist]}
                    onChange={() =>
                      toggleItem(item.key as keyof typeof checklist)
                    }
                    className="mt-1 w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p
                          className={`font-semibold ${
                            checklist[item.key as keyof typeof checklist]
                              ? "line-through text-gray-500 dark:text-gray-400"
                              : "text-dark dark:text-white"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          checklist[item.key as keyof typeof checklist]
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {checklist[item.key as keyof typeof checklist]
                          ? "✓ Done"
                          : "Pending"}
                      </span>
                    </div>

                    <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <span>Due: {item.dueDate}</span>
                      <span>Assigned to: {item.assignee}</span>
                    </div>

                    {/* Equipment Sub-items */}
                    {item.key === "equipmentChecklist" && (
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded mb-3 space-y-2">
                        {item.items?.map((subitem, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              {subitem.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                subitem.status
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {subitem.status ? "✓" : "✗"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea
                      value={notes[item.key as keyof typeof notes]}
                      onChange={(e) =>
                        setNotes({
                          ...notes,
                          [item.key]: e.target.value,
                        })
                      }
                      placeholder="Add notes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={2}
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Audit Team */}
        <WidgetCard title="Audit Team">
          <div className="space-y-3">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-dark dark:text-white">
                Lead Auditor
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sarah Mitchell
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-dark dark:text-white">
                Supporting Auditors
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                James Kennedy, Linda Peterson
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-dark dark:text-white">
                Client Contact
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                John Smith (Quality Manager)
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Audit Details */}
        <WidgetCard title="Audit Details">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Audit Type
              </p>
              <p className="text-sm font-medium text-dark dark:text-white">
                Stage 2
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Standard
              </p>
              <p className="text-sm font-medium text-dark dark:text-white">
                ISO 9001:2015
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Audit Date
              </p>
              <p className="text-sm font-medium text-dark dark:text-white">
                2025-09-15 to 2025-09-17
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Location
              </p>
              <p className="text-sm font-medium text-dark dark:text-white">
                Nairobi, Kenya
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
            Mark as Ready
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
            Print Checklist
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
            Email Team
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

