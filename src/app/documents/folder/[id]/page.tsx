"use client";

import { useState, use } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { FormSelect } from "@/components/Dashboard/form-select";
import { Document } from "@/types/document";
import Link from "next/link";

// Mock data
const MOCK_DOCUMENTS: Document[] = Array.from({ length: 10 }, (_, i) => ({
  id: `doc${i + 1}`,
  fileName: `INV-${1047 - i}.pdf`,
  fileType: "pdf",
  fileSize: (400 + Math.random() * 200) * 1024,
  fileUrl: `/documents/doc${i + 1}`,
  folderId: "1",
  folderPath: "Finance/Invoices",
  ownerId: "user1",
  ownerName: "Finance Team",
  permissions: [],
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  createdBy: "Finance Team",
  updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  updatedBy: "Finance Team",
  status: "active",
  currentVersion: 1,
}));

export default function FolderViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("date-modified");
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedDocs(new Set());
      setSelectAll(false);
    } else {
      setSelectedDocs(new Set(MOCK_DOCUMENTS.map((d) => d.id)));
      setSelectAll(true);
    }
  };

  const toggleSelectDoc = (docId: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
    setSelectAll(newSelected.size === MOCK_DOCUMENTS.length);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              📁 Finance / Invoices
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              {MOCK_DOCUMENTS.length} documents
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/documents/upload">
              <Button variant="primary">⬆ Upload</Button>
            </Link>
            <Button variant="secondary">+ Folder</Button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <FormSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "date-modified", label: "Date Modified" },
                { value: "date-created", label: "Date Created" },
                { value: "name", label: "Name" },
                { value: "size", label: "Size" },
              ]}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                ≡ List
              </button>
            </div>

            <FormSelect
              options={[
                { value: "all-types", label: "All Types" },
                { value: "pdf", label: "PDF" },
                { value: "word", label: "Word" },
                { value: "excel", label: "Excel" },
              ]}
            />
          </div>

          {/* Bulk Actions */}
          {selectedDocs.size > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="secondary" size="sm">
                Download Selected ({selectedDocs.size})
              </Button>
              <Button variant="secondary" size="sm">
                Move
              </Button>
              <Button variant="secondary" size="sm">
                Delete
              </Button>
              <Button variant="secondary" size="sm">
                Share
              </Button>
            </div>
          )}
        </div>

        {/* Documents Grid/List */}
        {viewMode === "grid" ? (
          <div>
            {/* Select All */}
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Select All
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {MOCK_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedDocs.has(doc.id)}
                      onChange={() => toggleSelectDoc(doc.id)}
                      className="w-4 h-4 rounded mt-1"
                    />
                    <span className="text-3xl">📄</span>
                  </div>
                  <h4 className="font-semibold text-sm text-dark dark:text-white truncate mb-2">
                    {doc.fileName}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {(doc.fileSize / 1024).toFixed(0)} KB
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </p>
                  <button className="text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white">
                    ⋮ Menu
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DOCUMENTS.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedDocs.has(doc.id)}
                        onChange={() => toggleSelectDoc(doc.id)}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-dark dark:text-white">
                      📄 {doc.fileName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {(doc.fileSize / 1024).toFixed(0)} KB
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white">
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
            Load More
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            [1] [2] [3] ... [15] [Next]
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}

