"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { FormSelect } from "@/components/Dashboard/form-select";
import Link from "next/link";

interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: "ready" | "uploading" | "completed" | "error";
  progress: number;
}

export default function DocumentUploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([
    {
      id: "1",
      name: "ABC_Audit_Report.pdf",
      size: 2.4 * 1024 * 1024,
      status: "completed",
      progress: 100,
    },
    {
      id: "2",
      name: "Site_Photos.zip",
      size: 15.2 * 1024 * 1024,
      status: "uploading",
      progress: 67,
    },
    {
      id: "3",
      name: "Client_Contract_Draft.docx",
      size: 456 * 1024,
      status: "ready",
      progress: 0,
    },
  ]);

  const [destinationFolder, setDestinationFolder] = useState("finance-invoices");
  const [relatedClient, setRelatedClient] = useState("");
  const [tags, setTags] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [sendReminder, setSendReminder] = useState(true);
  const [extractText, setExtractText] = useState(true);
  const [generateThumbnail, setGenerateThumbnail] = useState(true);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/documents" className="text-primary hover:text-primary/80 mb-2 inline-block">
              ← Back
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Upload Documents
            </h1>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center hover:border-primary transition-colors cursor-pointer">
          <p className="text-4xl mb-4">📁</p>
          <p className="text-lg font-medium text-dark dark:text-white mb-2">
            Drag & Drop Files Here
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, JPG, PNG, ZIP (Max 10MB per file)
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary">📁 Browse Files</Button>
            <Button variant="secondary">📂 Browse Folder</Button>
          </div>
        </div>

        {/* Upload Queue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dark dark:text-white">
              Upload Queue ({files.length} files)
            </h3>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              CLEAR ALL
            </button>
          </div>

          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {file.status === "completed" && "✓"}
                      {file.status === "uploading" && "⏳"}
                      {file.status === "ready" && "☐"}
                      {file.status === "error" && "✕"}
                    </span>
                    <div>
                      <p className="font-medium text-dark dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {file.status === "uploading" && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {file.progress}%
                    </span>
                  </div>
                )}

                {file.status === "completed" && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Uploaded successfully
                  </p>
                )}

                {file.status === "ready" && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Ready to upload
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* File Details & Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-dark dark:text-white mb-6">
            File Details & Options
          </h3>

          <div className="space-y-6">
            {/* Destination Folder */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Destination Folder *
              </label>
              <div className="flex gap-2">
                <FormSelect
                  value={destinationFolder}
                  onChange={(e) => setDestinationFolder(e.target.value)}
                  options={[
                    { value: "finance-invoices", label: "Finance > Invoices" },
                    { value: "finance-receipts", label: "Finance > Receipts" },
                    { value: "marketing", label: "Marketing" },
                    { value: "auditors", label: "Auditors" },
                  ]}
                  className="flex-1"
                />
                <Button variant="secondary">CREATE NEW FOLDER</Button>
              </div>
            </div>

            {/* Related To */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Related To (Optional)
              </label>
              <div className="space-y-3">
                <FormSelect
                  options={[
                    { value: "", label: "Select Client..." },
                    { value: "abc-corp", label: "ABC Corporation" },
                    { value: "xyz-ltd", label: "XYZ Ltd" },
                  ]}
                  value={relatedClient}
                  onChange={(e) => setRelatedClient(e.target.value)}
                />
                <FormSelect
                  options={[
                    { value: "", label: "Select Audit..." },
                    { value: "a-2025-145", label: "A-2025-145" },
                  ]}
                />
                <FormSelect
                  options={[
                    { value: "", label: "Select Contract..." },
                    { value: "ctr-2025-047", label: "CTR-2025-047" },
                  ]}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Tags (Optional)
              </label>
              <FormInput
                placeholder="audit-report, abc-corp, iso-9001"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Suggested: stage-2-audit, completed, 2025-q4
              </p>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-3">
                Access Permissions
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="permissions" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Inherit from folder (Finance Team)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="permissions" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Custom permissions
                  </span>
                </label>
              </div>
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-3">
                Document Expiry
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="expiry" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    No expiry
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="expiry" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Set expiry date:
                  </span>
                </label>
                <FormInput
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  disabled={!expiryDate}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={sendReminder}
                  onChange={(e) => setSendReminder(e.target.checked)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Send reminder 30 days before expiry
                </span>
              </label>
            </div>

            {/* Additional Options */}
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-3">
                Additional Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extractText}
                    onChange={(e) => setExtractText(e.target.checked)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Extract text for search indexing (PDF only)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateThumbnail}
                    onChange={(e) => setGenerateThumbnail(e.target.checked)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Generate thumbnail preview
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Notify team members about upload
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Add to client portal (make visible to client)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end mt-8">
            <Link href="/documents">
              <Button variant="secondary">CANCEL</Button>
            </Link>
            <Button variant="primary">UPLOAD ALL FILES</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

