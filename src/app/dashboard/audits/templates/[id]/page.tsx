"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { auditService, type AuditChecklist, type ChecklistItem } from "@/services/audit.service";
import Link from "next/link";

interface ChecklistResponse {
  id?: number;
  checklist_item_id: number;
  compliance_status?: 'compliant' | 'needs_improvement' | 'non_compliant' | 'not_applicable' | 'pending';
  auditor_comments?: string;
  auditor_notes?: string;
  actions_taken?: string;
  evidence_description?: string;
  corrective_action_required: boolean;
}

interface EnhancedChecklistItem extends ChecklistItem {
  actions_required?: string;
  allow_comments?: boolean;
  allow_notes?: boolean;
  allow_evidence_upload?: boolean;
  section_name?: string;
  subsection?: string;
  is_mandatory?: boolean;
  response?: ChecklistResponse;
}

interface GroupedItems {
  [sectionName: string]: EnhancedChecklistItem[];
}

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  
  const [template, setTemplate] = useState<AuditChecklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [responses, setResponses] = useState<{[key: number]: ChecklistResponse}>({});
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await auditService.getChecklist(parseInt(templateId));
      setTemplate(data);
      
      // Initialize responses for preview mode
      if (data.items) {
        const initialResponses: {[key: number]: ChecklistResponse} = {};
        data.items.forEach((item: EnhancedChecklistItem) => {
          initialResponses[item.id] = {
            checklist_item_id: item.id,
            compliance_status: 'pending',
            auditor_comments: '',
            auditor_notes: '',
            actions_taken: '',
            evidence_description: '',
            corrective_action_required: false
          };
        });
        setResponses(initialResponses);
      }
      
      // Auto-expand first section
      if (data.items && data.items.length > 0) {
        const firstSection = (data.items[0] as EnhancedChecklistItem).section_name || "General";
        setExpandedSections({ [firstSection]: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load template");
      console.error("Error loading template:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!template) return;

    try {
      setGeneratingPdf(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(
        `${apiUrl}/audit-checklists/${template.id}/generate_pdf/`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PDF generation failed:', errorText);
        throw new Error(`Failed to generate PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDelete = async () => {
    if (!template || !confirm(`Are you sure you want to delete "${template.title}"?`)) return;
    
    try {
      await auditService.deleteChecklist(template.id);
      router.push('/dashboard/audits/templates');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete template");
    }
  };

  const updateResponse = (itemId: number, field: keyof ChecklistResponse, value: any) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const getComplianceStatusColor = (status?: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'needs_improvement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'non_compliant': return 'bg-red-100 text-red-800 border-red-200';
      case 'not_applicable': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const groupItemsBySection = (items: EnhancedChecklistItem[]): GroupedItems => {
    return items.reduce((acc: GroupedItems, item) => {
      const sectionName = item.section_name || "General";
      if (!acc[sectionName]) {
        acc[sectionName] = [];
      }
      acc[sectionName].push(item);
      return acc;
    }, {});
  };

  const filteredItems = template?.items?.filter((item: EnhancedChecklistItem) => {
    const matchesSearch = searchTerm === "" || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clause_reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const response = responses[item.id];
    const matchesFilter = filterStatus === "all" || 
      (response?.compliance_status === filterStatus);
    
    return matchesSearch && matchesFilter;
  }) || [];

  const groupedItems = groupItemsBySection(filteredItems as EnhancedChecklistItem[]);
  
  const getProgressStats = () => {
    const totalItems = template?.items?.length || 0;
    const completedItems = Object.values(responses).filter(r => r.compliance_status !== 'pending').length;
    const compliantItems = Object.values(responses).filter(r => r.compliance_status === 'compliant').length;
    const nonCompliantItems = Object.values(responses).filter(r => r.compliance_status === 'non_compliant').length;
    
    return {
      total: totalItems,
      completed: completedItems,
      percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      compliant: compliantItems,
      nonCompliant: nonCompliantItems
    };
  };

  const progressStats = getProgressStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading template...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !template) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <Link href="/dashboard/audits/templates">
            <Button variant="secondary" className="mt-4">Back to Templates</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!template) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Template not found</p>
          <Link href="/dashboard/audits/templates">
            <Button variant="secondary" className="mt-4">Back to Templates</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href="/dashboard/audits/templates" className="text-sm text-primary hover:underline mb-2 inline-block">
              ← Back to Templates
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              {template.title}
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              {template.description}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isPreviewMode ? "secondary" : "primary"}
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? '📋 View Template' : '👀 Preview Mode'}
            </Button>
            <Link href={`/dashboard/audits/templates/${templateId}/edit`}>
              <Button variant="secondary">
                ✏️ Edit
              </Button>
            </Link>
            <Button
              variant="primary"
              onClick={handleGeneratePdf}
              disabled={generatingPdf}
            >
              {generatingPdf ? 'Generating...' : '📄 Download PDF'}
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Template Info and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Information */}
          <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">Template Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">ISO Standard</p>
                <p className="text-base font-medium text-dark dark:text-white">
                  {template.isoStandard ? `ISO ${template.isoStandard}` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-base font-medium text-dark dark:text-white">
                  {template.items?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-base font-medium text-dark dark:text-white">
                  {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          {isPreviewMode && (
            <>
              <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">Completion Progress</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Overall Progress</span>
                      <span>{progressStats.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressStats.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>Completed: {progressStats.completed} of {progressStats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">Compliance Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">✅ Compliant</span>
                    <span className="text-sm font-medium">{progressStats.compliant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">❌ Non-Compliant</span>
                    <span className="text-sm font-medium">{progressStats.nonCompliant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-600">⏳ Pending</span>
                    <span className="text-sm font-medium">{progressStats.total - progressStats.completed}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search and Filter Controls */}
        {isPreviewMode && (
          <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search questions or clause references..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Items</option>
                <option value="pending">Pending</option>
                <option value="compliant">Compliant</option>
                <option value="needs_improvement">Needs Improvement</option>
                <option value="non_compliant">Non-Compliant</option>
                <option value="not_applicable">Not Applicable</option>
              </select>
            </div>
          </div>
        )}

        {/* Checklist Items */}
        <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">
            {isPreviewMode ? 'Interactive Checklist' : 'Checklist Items'}
          </h2>

          {template.items && template.items.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([sectionName, items]) => (
                <div key={sectionName} className="border border-gray-200 dark:border-gray-600 rounded-lg">
                  {/* Section Header */}
                  <div 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer rounded-t-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => toggleSection(sectionName)}
                  >
                    <h3 className="text-lg font-semibold text-dark dark:text-white">
                      {sectionName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {items.length} item{items.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-gray-400">
                        {expandedSections[sectionName] ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>

                  {/* Section Content */}
                  {expandedSections[sectionName] && (
                    <div className="p-4 space-y-4">
                      {items.map((item, index) => {
                        const response = responses[item.id];
                        return (
                          <div
                            key={item.id}
                            className="border border-stroke dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="space-y-4">
                              {/* Question Header */}
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-base font-medium text-dark dark:text-white pr-4">
                                      {item.question}
                                    </h4>
                                    <div className="flex gap-2 ml-4 flex-shrink-0">
                                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                                        {item.clauseReference || 'N/A'}
                                      </span>
                                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                                        {item.itemType}
                                      </span>
                                      {isPreviewMode && (
                                        <span className={`px-2 py-1 text-xs rounded border ${getComplianceStatusColor(response?.compliance_status)}`}>
                                          {response?.compliance_status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {item.guidance && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3">
                                      Guidance: {item.guidance}
                                    </p>
                                  )}

                                  {(item as EnhancedChecklistItem).actions_required && (
                                    <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                        <strong>Actions Required:</strong> {(item as EnhancedChecklistItem).actions_required}
                                      </p>
                                    </div>
                                  )}

                                  {/* Interactive Compliance Section */}
                                  {isPreviewMode && (
                                    <div className="mt-4 space-y-4 border-t pt-4">
                                      {/* Compliance Status Selection */}
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                          Compliance Status
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                          {[
                                            { value: 'compliant', label: '✅ Compliant', class: 'border-green-300 text-green-700 hover:bg-green-50' },
                                            { value: 'needs_improvement', label: '⚠️ Needs Improvement', class: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' },
                                            { value: 'non_compliant', label: '❌ Non-Compliant', class: 'border-red-300 text-red-700 hover:bg-red-50' },
                                            { value: 'not_applicable', label: '➖ Not Applicable', class: 'border-gray-300 text-gray-700 hover:bg-gray-50' }
                                          ].map((status) => (
                                            <button
                                              key={status.value}
                                              onClick={() => updateResponse(item.id, 'compliance_status', status.value)}
                                              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                                                response?.compliance_status === status.value 
                                                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                                                  : status.class
                                              }`}
                                            >
                                              {status.label}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Corrective Action Required */}
                                      {response?.compliance_status === 'non_compliant' && (
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            id={`corrective-${item.id}`}
                                            checked={response?.corrective_action_required || false}
                                            onChange={(e) => updateResponse(item.id, 'corrective_action_required', e.target.checked)}
                                            className="rounded text-red-600"
                                          />
                                          <label htmlFor={`corrective-${item.id}`} className="text-sm text-red-700 dark:text-red-300">
                                            Corrective Action Required
                                          </label>
                                        </div>
                                      )}

                                      {/* Comments Section */}
                                      {(item as EnhancedChecklistItem).allow_comments !== false && (
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Auditor Comments
                                          </label>
                                          <textarea
                                            value={response?.auditor_comments || ''}
                                            onChange={(e) => updateResponse(item.id, 'auditor_comments', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                                            placeholder="Add your observations and comments..."
                                          />
                                        </div>
                                      )}

                                      {/* Notes Section */}
                                      {(item as EnhancedChecklistItem).allow_notes !== false && (
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Personal Notes
                                          </label>
                                          <textarea
                                            value={response?.auditor_notes || ''}
                                            onChange={(e) => updateResponse(item.id, 'auditor_notes', e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                                            placeholder="Add personal notes and reminders..."
                                          />
                                        </div>
                                      )}

                                      {/* Actions Taken Section */}
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                          Actions Taken
                                        </label>
                                        <textarea
                                          value={response?.actions_taken || ''}
                                          onChange={(e) => updateResponse(item.id, 'actions_taken', e.target.value)}
                                          rows={2}
                                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                                          placeholder="Document actions taken during audit..."
                                        />
                                      </div>

                                      {/* Evidence Description Section */}
                                      {(item as EnhancedChecklistItem).allow_evidence_upload !== false && (
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Evidence Description
                                          </label>
                                          <textarea
                                            value={response?.evidence_description || ''}
                                            onChange={(e) => updateResponse(item.id, 'evidence_description', e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                                            placeholder="Describe evidence found or required..."
                                          />
                                          
                                          {/* Future: File Upload Area */}
                                          <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400">
                                            <p className="text-sm">Evidence file upload (Coming soon)</p>
                                            <p className="text-xs">Support for PDF, images, and documents</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No checklist items found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}