"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auditService } from "@/services/audit.service";

export default function AuditChecklistDetailPage({
  params,
}: {
  params: Promise<{ id: string; checklistId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const auditId = resolvedParams.id;
  const checklistId = resolvedParams.checklistId;

  const [audit, setAudit] = useState<any>(null);
  const [checklist, setChecklist] = useState<any>(null);
  const [responses, setResponses] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [auditData, checklistData] = await Promise.all([
          auditService.getAudit(auditId),
          auditService.getChecklist(parseInt(checklistId)),
        ]);

        setAudit(auditData);
        setChecklist(checklistData);

        // Initialize responses
        if (checklistData.items) {
          const initialResponses: { [key: number]: any } = {};
          
          // Get existing responses from audit data for this checklist
          const existingResponses = auditData.checklist_responses || [];
          const existingResponsesMap = existingResponses.reduce((acc: any, response: any) => {
            if (response.checklist_item && response.checklist_item.checklist === parseInt(checklistId)) {
              acc[response.checklist_item.id] = response;
            }
            return acc;
          }, {});
          
          checklistData.items.forEach((item: any) => {
            const existingResponse = existingResponsesMap[item.id];
            
            initialResponses[item.id] = {
              checklist_item_id: item.id,
              compliance_status: existingResponse?.compliance_status || "pending",
              auditor_comments: existingResponse?.auditor_comments || "",
              auditor_notes: existingResponse?.auditor_notes || "",
              actions_taken: existingResponse?.actions_taken || "",
              evidence_description: existingResponse?.evidence_description || "",
              corrective_action_required: existingResponse?.corrective_action_required || false,
            };
          });
          setResponses(initialResponses);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load checklist data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (auditId && checklistId) {
      fetchData();
    }
  }, [auditId, checklistId]);

  const handleResponseChange = (itemId: number, field: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const handleSaveResponses = async () => {
    try {
      setSaving(true);
      // Save responses to backend
      const responsesToSave = Object.values(responses);
      await auditService.saveChecklistResponses(auditId, responsesToSave);
      
      // Check if audit is completed after saving responses
      await checkAndCompleteAudit();
      
      alert("Checklist responses saved successfully!");
      // Optionally navigate back to checklist collection
      // router.push(`/dashboard/audits/${auditId}/checklist`);
    } catch (err) {
      console.error("Error saving responses:", err);
      alert("Failed to save responses. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const checkAndCompleteAudit = async () => {
    try {
      // Fetch updated audit data with all checklist responses
      const updatedAudit = await auditService.getAudit(auditId);
      
      // Get all checklist responses for this audit
      const allResponses = updatedAudit.checklist_responses || [];
      
      if (allResponses.length > 0) {
        // Check if all responses are completed (no pending items)
        const hasPendingItems = allResponses.some((response: any) => 
          response.compliance_status === 'pending'
        );
        
        if (!hasPendingItems) {
          // All items are completed, update audit status to COMPLETED (backend enum)
          await auditService.updateAudit(auditId, { status: 'COMPLETED' });

          // Show completion message and redirect to certifications
          alert('🎉 Audit completed successfully! Redirecting to certifications...');
          setTimeout(() => {
            router.push('/dashboard/audits/certifications');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error checking audit completion:', error);
      // Don't show error to user as this is background operation
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading checklist...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !audit || !checklist) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error || "Failed to load data"}</p>
            <button
              onClick={() => router.push(`/dashboard/audits/${auditId}/checklist`)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Return to Checklists
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
              {checklist.title}
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              {audit.audit_number} - {audit.client_name}
            </p>
          </div>
          <button
            onClick={() => router.push(`/dashboard/audits/${auditId}/checklist`)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
          >
            Back to Checklists
          </button>
        </div>

        {/* Checklist Items */}
        <WidgetCard title="Checklist Items">
          <div className="space-y-6">
            {checklist.items && checklist.items.length > 0 ? (
              <>
                {checklist.items.map((item: any, index: number) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-dark dark:text-white">
                              {index + 1}. {item.question}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Clause: {item.clause_reference}
                            </p>
                          </div>
                        </div>

                        {item.guidance && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Guidance: {item.guidance}
                          </p>
                        )}

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Compliance Status
                            </label>
                            <select
                              value={responses[item.id]?.compliance_status || "pending"}
                              onChange={(e) =>
                                handleResponseChange(
                                  item.id,
                                  "compliance_status",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="compliant">Compliant</option>
                              <option value="needs_improvement">Needs Improvement</option>
                              <option value="non_compliant">Non-Compliant</option>
                              <option value="not_applicable">Not Applicable</option>
                            </select>
                          </div>

                          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                              <label className="flex items-center text-sm font-medium mb-2 text-blue-800 dark:text-blue-200">
                                <span className="mr-2">💬</span>
                                Auditor Comments
                              </label>
                              <textarea
                                value={responses[item.id]?.auditor_comments || ""}
                                onChange={(e) =>
                                  handleResponseChange(
                                    item.id,
                                    "auditor_comments",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                placeholder="Enter your comments..."
                              />
                              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                                General observations and findings
                              </div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                              <label className="flex items-center text-sm font-medium mb-2 text-green-800 dark:text-green-200">
                                <span className="mr-2">🔧</span>
                                Actions Taken
                              </label>
                              <textarea
                                value={responses[item.id]?.actions_taken || ""}
                                onChange={(e) =>
                                  handleResponseChange(
                                    item.id,
                                    "actions_taken",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                rows={3}
                                placeholder="Describe actions taken to address this item..."
                              />
                              <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                                Specific actions and remediation steps
                              </div>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                              <label className="flex items-center text-sm font-medium mb-2 text-purple-800 dark:text-purple-200">
                                <span className="mr-2">📝</span>
                                Auditor Notes
                              </label>
                              <textarea
                                value={responses[item.id]?.auditor_notes || ""}
                                onChange={(e) =>
                                  handleResponseChange(
                                    item.id,
                                    "auditor_notes",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                rows={3}
                                placeholder="Additional notes or observations..."
                              />
                              <div className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                                Additional insights and detailed notes
                              </div>
                            </div>
                          </div>

                          {/* Completion Status Indicator */}
                          {(() => {
                            const currentResponse = responses[item.id];
                            const hasComments = currentResponse?.auditor_comments?.trim();
                            const hasActions = currentResponse?.actions_taken?.trim();
                            const hasNotes = currentResponse?.auditor_notes?.trim();
                            const completedCount = [hasComments, hasActions, hasNotes].filter(Boolean).length;
                            
                            if (completedCount > 0) {
                              return (
                                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Documentation Progress
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex space-x-1">
                                        <div className={`w-3 h-3 rounded-full ${hasComments ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        <div className={`w-3 h-3 rounded-full ${hasActions ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className={`w-3 h-3 rounded-full ${hasNotes ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                                      </div>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {completedCount}/3 completed
                                      </span>
                                    </div>
                                  </div>
                                  {completedCount === 3 && (
                                    <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                                      <span className="mr-1">✅</span>
                                      All documentation fields completed
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => router.push(`/dashboard/audits/${auditId}/checklist`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveResponses}
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Responses"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">No items in this checklist</p>
            )}
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

