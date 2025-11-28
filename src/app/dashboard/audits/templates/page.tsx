"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auditService, type AuditChecklist } from "@/services/audit.service";

export default function AuditTemplatesPage() {
  const router = useRouter();
  const [templateType, setTemplateType] = useState<"checklists">("checklists");
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [checklists, setChecklists] = useState<AuditChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await auditService.getChecklists({
          is_template: true,
          ordering: '-created_at'
        });

        setChecklists(response.results || []);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Audit Templates Library
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage audit checklists and templates
            </p>
          </div>
          <Link
            href="/template/starter"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            + Create Checklist Template
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading templates...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Templates List */}
        {!loading && !error && (
          <WidgetCard title={`Checklist Templates (${checklists.length})`}>
            {checklists.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No checklist templates found. Create your first template to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {checklists.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-dark dark:text-white">
                          {template.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {template.iso_standard_data?.code || `ISO Standard #${template.iso_standard}`}
                        </p>
                        {template.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {template.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/audits/templates/${template.id}/edit`)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/audits/templates/${template.id}`)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(template.id)}
                          className="px-3 py-1 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50 dark:border-red-600 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span>{template.items?.length || 0} items</span>
                        <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                        {template.created_by_name && <span>By: {template.created_by_name}</span>}
                      </div>
                      <button
                        onClick={() => router.push(`/dashboard/audits/new?checklist=${template.id}`)}
                        className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-hover"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}

        {/* Template Management Info */}
        <WidgetCard title="Template Management">
          <div className="space-y-4">
            <div>
              <p className="font-medium text-dark dark:text-white mb-2">
                Version Control
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All templates maintain version history. You can revert to previous versions at any time.
              </p>
            </div>
            <div>
              <p className="font-medium text-dark dark:text-white mb-2">
                Template Variables
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use variables like [Client Name], [Audit Date], [Auditor Name] for dynamic content.
              </p>
            </div>
            <div>
              <p className="font-medium text-dark dark:text-white mb-2">
                Best Practices
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                <li>Keep templates updated with latest standards</li>
                <li>Test templates before using in production</li>
                <li>Document any custom modifications</li>
                <li>Review templates quarterly for improvements</li>
              </ul>
            </div>
          </div>
        </WidgetCard>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
                Delete Template
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this template? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await auditService.deleteChecklist(showDeleteModal);
                      // Refresh the list
                      const response = await auditService.getChecklists({
                        is_template: true,
                        ordering: '-created_at'
                      });
                      setChecklists(response.results || []);
                      setShowDeleteModal(null);
                    } catch (err) {
                      console.error("Error deleting template:", err);
                      setError('Failed to delete template. Please try again.');
                      setShowDeleteModal(null);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

