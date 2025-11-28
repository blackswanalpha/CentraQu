"use client";

import { useState, use } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import Link from "next/link";

interface Permission {
  id: string;
  name: string;
  type: "user" | "team" | "link";
  level: "view" | "edit" | "full-control" | "owner";
  inherited: boolean;
  expiresAt?: Date;
  views?: number;
}

const MOCK_PERMISSIONS: Permission[] = [
  {
    id: "1",
    name: "Sarah Mitchell (You)",
    type: "user",
    level: "owner",
    inherited: false,
  },
  {
    id: "2",
    name: "Finance Team (5 members)",
    type: "team",
    level: "edit",
    inherited: true,
  },
  {
    id: "3",
    name: "Managers (3 members)",
    type: "team",
    level: "view",
    inherited: true,
  },
  {
    id: "4",
    name: "John Smith (ABC Corp)",
    type: "user",
    level: "view",
    inherited: false,
    expiresAt: new Date("2026-01-31"),
  },
  {
    id: "5",
    name: "Shared Link",
    type: "link",
    level: "view",
    inherited: false,
    expiresAt: new Date("2025-11-18"),
    views: 3,
  },
];

export default function PermissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [permissions, setPermissions] = useState<Permission[]>(MOCK_PERMISSIONS);
  const [searchUser, setSearchUser] = useState("");
  const [selectedPermissionLevel, setSelectedPermissionLevel] = useState("edit");
  const [accessDuration, setAccessDuration] = useState("permanent");

  const removePermission = (permissionId: string) => {
    setPermissions(permissions.filter((p) => p.id !== permissionId));
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
              Manage Permissions
            </h1>
          </div>
        </div>

        {/* Document Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="font-semibold text-dark dark:text-white">
            ABC_Audit_Report_Final.pdf
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Location: Finance &gt; Auditors &gt; Reports
          </p>
        </div>

        {/* Current Access */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dark dark:text-white">
              Current Access
            </h3>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              + Add People
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    User/Team
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Permission
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Inherited
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm) => (
                  <tr
                    key={perm.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {perm.type === "user" && "👤"}
                          {perm.type === "team" && "👥"}
                          {perm.type === "link" && "🔗"}
                        </span>
                        <div>
                          <p className="font-medium text-dark dark:text-white">
                            {perm.name}
                          </p>
                          {perm.expiresAt && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Expires: {perm.expiresAt.toLocaleDateString()}
                            </p>
                          )}
                          {perm.views !== undefined && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Views: {perm.views} times
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700 dark:text-gray-300">
                        {perm.level === "owner" && "Full Control"}
                        {perm.level === "full-control" && "Full Control"}
                        {perm.level === "edit" && "Edit"}
                        {perm.level === "view" && "View"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700 dark:text-gray-300">
                        {perm.inherited ? "Yes (Folder)" : "No"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {perm.level !== "owner" && (
                          <>
                            <button className="text-primary hover:text-primary/80 text-sm font-medium">
                              CHANGE
                            </button>
                            <button
                              onClick={() => removePermission(perm.id)}
                              className="text-error hover:text-error/80 text-sm font-medium"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add People */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-dark dark:text-white mb-4">
            Add People or Teams
          </h3>

          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Search users or teams:
              </label>
              <FormInput
                placeholder="Type name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Suggested:
              </p>
              <div className="space-y-2">
                {[
                  "James Kennedy (Lead Auditor)",
                  "Audit Team (6 members)",
                  "Linda Peterson (Senior Auditor)",
                ].map((suggestion) => (
                  <div
                    key={suggestion}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      • {suggestion}
                    </span>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium">
                      + ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Permission Level */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Permission Level:
              </label>
              <div className="space-y-2">
                {[
                  { value: "view", label: "View only (Can view and download)" },
                  {
                    value: "edit",
                    label: "Edit (Can view, download, and upload new versions)",
                  },
                  {
                    value: "full-control",
                    label: "Full control (Can manage permissions and delete)",
                  },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="permissionLevel"
                      value={option.value}
                      checked={selectedPermissionLevel === option.value}
                      onChange={(e) => setSelectedPermissionLevel(e.target.value)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Access Duration */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Access Duration:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accessDuration"
                    value="permanent"
                    checked={accessDuration === "permanent"}
                    onChange={(e) => setAccessDuration(e.target.value)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Permanent
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accessDuration"
                    value="temporary"
                    checked={accessDuration === "temporary"}
                    onChange={(e) => setAccessDuration(e.target.value)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Temporary (Set expiry date):
                  </span>
                </label>
                {accessDuration === "temporary" && (
                  <FormInput type="date" className="ml-6" />
                )}
              </div>
            </div>

            {/* Notification */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Notify users via email about this access
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include personal message:
                </span>
              </label>
              <textarea
                className="w-full mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white text-sm"
                rows={3}
                placeholder="This audit report is now available for your review..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="secondary">CANCEL</Button>
              <Button variant="primary">GRANT ACCESS</Button>
            </div>
          </div>
        </div>

        {/* Generate Shareable Link */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-dark dark:text-white mb-4">
            Generate Shareable Link
          </h3>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a link that can be shared with anyone:
            </p>

            {/* Link Options */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Link Options:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="linkOption" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    View only (recommended)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="linkOption" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    View and download
                  </span>
                </label>
              </div>
            </div>

            {/* Link Expiry */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Link Expiry:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="linkExpiry" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Never
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="linkExpiry" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Custom date:
                  </span>
                </label>
                <FormInput type="date" defaultValue="2025-11-30" className="ml-6" />
              </div>
            </div>

            {/* Security */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Require password to access
                </span>
              </label>
              <div className="flex gap-2 ml-6">
                <FormInput type="password" value="●●●●●●●●●●●●" disabled />
                <Button variant="secondary">GENERATE</Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="secondary">CANCEL</Button>
              <Button variant="primary">GENERATE LINK</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

