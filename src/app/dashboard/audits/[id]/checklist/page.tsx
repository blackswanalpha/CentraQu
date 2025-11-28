"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auditService } from "@/services/audit.service";

export default function AuditChecklistCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const auditId = resolvedParams.id;

  const [audit, setAudit] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const auditData = await auditService.getAudit(auditId);
        setAudit(auditData);

        // Get templates associated with this audit
        const templatesData = auditData.audit_templates_data || [];
        setTemplates(templatesData);
      } catch (err) {
        console.error("Error fetching audit data:", err);
        setError("Failed to load audit checklist data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (auditId) {
      fetchData();
    }
  }, [auditId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading checklists...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !audit) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error || "Failed to load audit data"}</p>
            <button
              onClick={() => router.push(`/dashboard/audits/${auditId}`)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Return to Audit
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Audit Checklists
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              {audit.audit_number} - {audit.client_name}
            </p>
          </div>
          <button
            onClick={() => router.push(`/dashboard/audits/${auditId}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
          >
            Back to Audit
          </button>
        </div>

        {/* Checklists Collection */}
        {templates.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <WidgetCard key={template.id} title={template.iso_standard_name}>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-dark dark:text-white mb-2">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description || "No description available"}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Items:</span>
                      <span className="font-medium">{template.items_count || 0}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/audits/${auditId}/checklist/${template.id}`
                      )
                    }
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Fill Checklist
                  </button>
                </div>
              </WidgetCard>
            ))}
          </div>
        ) : (
          <WidgetCard title="No Checklists">
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-medium text-dark dark:text-white mb-2">
                No checklists assigned
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This audit does not have any certification templates assigned yet.
              </p>
              <button
                onClick={() => router.push(`/dashboard/audits/${auditId}`)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
              >
                Go to Audit Details
              </button>
            </div>
          </WidgetCard>
        )}
      </div>
    </DashboardLayout>
  );
}

