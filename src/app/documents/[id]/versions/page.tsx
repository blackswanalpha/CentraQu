"use client";

import { useState, use } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import Link from "next/link";

interface Version {
  id: string;
  versionNumber: number;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  changeNotes: string;
  isCurrent: boolean;
  activity: string[];
}

const MOCK_VERSIONS: Version[] = [
  {
    id: "v3",
    versionNumber: 3,
    uploadedBy: "Sarah Mitchell",
    uploadedAt: new Date("2025-10-18T14:30:00"),
    fileSize: 2.4 * 1024 * 1024,
    changeNotes:
      "Final version approved by QA. Added management response to non-conformances. Ready for client delivery.",
    isCurrent: true,
    activity: [
      "Viewed by John Smith (Client) - Oct 20, 4:45 PM",
      "Downloaded by Finance Team - Oct 19, 11:20 AM",
      "Emailed to j.smith@abccorp.com - Oct 18, 2:45 PM",
    ],
  },
  {
    id: "v2",
    versionNumber: 2,
    uploadedBy: "Sarah Mitchell",
    uploadedAt: new Date("2025-10-17T16:15:00"),
    fileSize: 2.3 * 1024 * 1024,
    changeNotes:
      "Added findings summary and recommendations section. Pending QA review.",
    isCurrent: false,
    activity: [
      "Reviewed by Quality Team - Oct 17, 5:30 PM",
      "Downloaded by Sarah Mitchell - Oct 17, 4:20 PM",
    ],
  },
  {
    id: "v1",
    versionNumber: 1,
    uploadedBy: "Sarah Mitchell",
    uploadedAt: new Date("2025-10-16T10:00:00"),
    fileSize: 2.4 * 1024 * 1024,
    changeNotes:
      "Initial audit report draft. Contains all required sections and preliminary findings.",
    isCurrent: false,
    activity: ["Downloaded for review - Oct 16, 11:30 AM"],
  },
];

export default function VersionHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [compareVersion1, setCompareVersion1] = useState("v3");
  const [compareVersion2, setCompareVersion2] = useState("v2");
  const [autoCreateVersion, setAutoCreateVersion] = useState(true);
  const [requireChangeNotes, setRequireChangeNotes] = useState(true);
  const [notifyOwner, setNotifyOwner] = useState(true);
  const [versionRetention, setVersionRetention] = useState("indefinite");

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/documents/${id}`} className="text-primary hover:text-primary/80 mb-2 inline-block">
              ← Back to Document
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Version History
            </h1>
          </div>
          <Link href={`/documents/${id}/upload`}>
            <Button variant="primary">Upload New</Button>
          </Link>
        </div>

        {/* Document Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="font-semibold text-dark dark:text-white">
            ABC_Audit_Report_Final.pdf
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current Version: v3.0 | Total Versions: 3 | Total Size: 7.1MB
          </p>
        </div>

        {/* Versions */}
        <div className="space-y-4">
          {MOCK_VERSIONS.map((version) => (
            <div
              key={version.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* Version Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-dark dark:text-white">
                    Version {version.versionNumber}.0
                    {version.isCurrent && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                    {!version.isCurrent && (
                      <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {version.uploadedAt.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Version Details */}
              <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <p>Uploaded by: {version.uploadedBy}</p>
                <p>File size: {formatFileSize(version.fileSize)}</p>
              </div>

              {/* Change Notes */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-dark dark:text-white mb-1">
                  Change Notes:
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {version.changeNotes}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="secondary" size="sm">
                  📄 PREVIEW
                </Button>
                <Button variant="secondary" size="sm">
                  ⬇ DOWNLOAD
                </Button>
                <Button variant="secondary" size="sm">
                  📧 EMAIL
                </Button>
                {!version.isCurrent && (
                  <>
                    <Button variant="secondary" size="sm">
                      🔄 RESTORE
                    </Button>
                    <Button variant="secondary" size="sm">
                      COMPARE WITH v3.0
                    </Button>
                  </>
                )}
                {!version.isCurrent && (
                  <Button variant="danger" size="sm">
                    🗑 DELETE
                  </Button>
                )}
              </div>

              {/* Activity */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm font-medium text-dark dark:text-white mb-2">
                  Activity:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {version.activity.map((activity, idx) => (
                    <li key={idx}>• {activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Version Comparison Tool */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-dark dark:text-white mb-4">
            Version Comparison Tool
          </h3>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Compare:
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white">
                <option>Version 3.0</option>
                <option>Version 2.0</option>
                <option>Version 1.0</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                with:
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white">
                <option>Version 2.0</option>
                <option>Version 1.0</option>
              </select>
            </div>
          </div>

          <Button variant="primary" fullWidth>
            COMPARE VERSIONS
          </Button>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Comparison shows:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
            <li>• Text changes highlighted</li>
            <li>• Added content in green</li>
            <li>• Removed content in red</li>
            <li>• Side-by-side or unified view</li>
          </ul>
        </div>

        {/* Version Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-dark dark:text-white mb-4">
            Version Settings
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoCreateVersion}
                onChange={(e) => setAutoCreateVersion(e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Automatically create version when document is edited
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requireChangeNotes}
                onChange={(e) => setRequireChangeNotes(e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Require change notes for new versions
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Limit number of versions (keep last
              </span>
              <input
                type="number"
                defaultValue="10"
                className="w-12 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-dark dark:text-white text-sm"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                versions)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOwner}
                onChange={(e) => setNotifyOwner(e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Notify document owner when new version is uploaded
              </span>
            </label>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Version Retention:
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="retention"
                    value="indefinite"
                    checked={versionRetention === "indefinite"}
                    onChange={(e) => setVersionRetention(e.target.value)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Keep all versions indefinitely
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="retention"
                    value="limited"
                    checked={versionRetention === "limited"}
                    onChange={(e) => setVersionRetention(e.target.value)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Delete versions older than:
                  </span>
                  <select className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-dark dark:text-white text-sm">
                    <option>1 year</option>
                    <option>6 months</option>
                    <option>3 months</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="secondary">CANCEL</Button>
            <Button variant="primary">SAVE SETTINGS</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

