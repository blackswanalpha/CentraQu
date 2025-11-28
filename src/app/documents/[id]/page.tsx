"use client";

import { useState, use } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import Link from "next/link";

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("details");
  const [isStarred, setIsStarred] = useState(false);

  const tabs = [
    { id: "details", label: "Details" },
    { id: "versions", label: "Versions" },
    { id: "activity", label: "Activity" },
    { id: "comments", label: "Comments" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/documents" className="text-primary hover:text-primary/80">
              ← Back to Invoices
            </Link>
          </div>
          <button className="text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white text-2xl">
            ✕ Close
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-dark dark:text-white mb-4">
                Document Preview
              </h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl mb-2">📄</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    PDF Preview
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    INV-1047.pdf
                  </p>
                </div>
              </div>

              {/* Preview Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <button className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white">
                    ◄
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                    Page 1 of 2
                  </span>
                  <button className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white">
                    ►
                  </button>
                </div>
                <select className="px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm">
                  <option>100%</option>
                  <option>75%</option>
                  <option>50%</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" size="sm" fullWidth>
                  ⬇ Download
                </Button>
                <Button variant="secondary" size="sm" fullWidth>
                  🖨 Print
                </Button>
                <Button variant="secondary" size="sm" fullWidth>
                  🔗 Share
                </Button>
                <Button variant="secondary" size="sm" fullWidth>
                  📁 Move
                </Button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-1 space-y-4">
            {/* Document Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-dark dark:text-white mb-4">
                Document Details
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Filename</p>
                  <p className="font-medium text-dark dark:text-white">
                    INV-1047.pdf
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-medium text-dark dark:text-white">
                    PDF Document
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Size</p>
                  <p className="font-medium text-dark dark:text-white">456 KB</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Created</p>
                  <p className="font-medium text-dark dark:text-white">
                    Oct 18, 2025, 2:30 PM
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Created by</p>
                  <p className="font-medium text-dark dark:text-white">
                    Sarah Mitchell
                  </p>
                </div>
              </div>

              <hr className="my-4 border-gray-200 dark:border-gray-700" />

              {/* Related To */}
              <div className="mb-4">
                <p className="font-medium text-dark dark:text-white mb-2">
                  Related To
                </p>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Client: ABC Corporation</li>
                  <li>• Audit: A-2025-145</li>
                  <li>• Contract: CTR-2025-047</li>
                </ul>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <p className="font-medium text-dark dark:text-white mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {["invoice", "abc-corp", "iso-9001", "paid", "2025-q4"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
                <button className="text-primary text-sm mt-2 hover:text-primary/80">
                  + Add Tag
                </button>
              </div>

              {/* Folder */}
              <div className="mb-4">
                <p className="font-medium text-dark dark:text-white mb-2">
                  Folder
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Finance &gt; Invoices
                </p>
                <button className="text-primary text-sm mt-2 hover:text-primary/80">
                  MOVE TO ANOTHER FOLDER
                </button>
              </div>

              {/* Expiry */}
              <div>
                <p className="font-medium text-dark dark:text-white mb-2">
                  Expiry Date
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">None</p>
                <button className="text-primary text-sm mt-2 hover:text-primary/80">
                  SET EXPIRY DATE
                </button>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark dark:text-white">
                  Access
                </h3>
                <Link href={`/documents/${id}/permissions`}>
                  <button className="text-primary text-sm hover:text-primary/80">
                    MANAGE
                  </button>
                </Link>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  • Finance Team (Edit)
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • Sarah Mitchell (Owner)
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • Managers (View)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "details" && (
              <div className="text-gray-600 dark:text-gray-400">
                <p>Document details and metadata displayed here.</p>
              </div>
            )}
            {activeTab === "versions" && (
              <div className="text-gray-600 dark:text-gray-400">
                <p>Version history displayed here.</p>
                <Link href={`/documents/${id}/versions`}>
                  <button className="text-primary mt-2 hover:text-primary/80">
                    View Full Version History →
                  </button>
                </Link>
              </div>
            )}
            {activeTab === "activity" && (
              <div className="text-gray-600 dark:text-gray-400">
                <p>Activity log displayed here.</p>
              </div>
            )}
            {activeTab === "comments" && (
              <div className="text-gray-600 dark:text-gray-400">
                <p>Comments displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

