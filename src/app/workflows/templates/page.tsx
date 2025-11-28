"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { workflowService, WorkflowTemplate } from "@/services/workflow.service";
import Link from "next/link";

interface TemplateCardProps {
  template: WorkflowTemplate;
  onUse: (templateId: string) => void;
  onEdit: (templateId: string) => void;
}

function TemplateCard({ template, onUse, onEdit }: TemplateCardProps) {
  const getWorkflowTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "certification": return "🏆";
      case "client_onboarding": return "👋";
      case "compliance_check": return "✅";
      case "audit_process": return "🔍";
      case "review_process": return "📋";
      default: return "🔄";
    }
  };

  const formatWorkflowType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-2xl">{getWorkflowTypeIcon(template.workflow_type)}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-dark dark:text-white mb-1">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {template.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{formatWorkflowType(template.workflow_type)}</span>
              <span>•</span>
              <span>{template.steps?.length || 0} steps</span>
              <span>•</span>
              <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Template Steps Preview */}
      {template.template_data?.steps && template.template_data.steps.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-dark dark:text-white mb-2">
            Workflow Steps:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {template.template_data.steps.slice(0, 4).map((step: any, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{step.title || `Step ${index + 1}`}</span>
              </li>
            ))}
            {template.template_data.steps.length > 4 && (
              <li className="text-gray-500 italic">
                + {template.template_data.steps.length - 4} more steps
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <Button variant="primary" onClick={() => onUse(template.id.toString())}>
          🔄 Use Template
        </Button>
        <Button variant="secondary" onClick={() => onEdit(template.id.toString())}>
          ✏️ Edit
        </Button>
        <button className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          📋 Duplicate
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default function WorkflowTemplatesPage() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await workflowService.getTemplates({
          ordering: '-created_at',
          search: searchTerm || undefined,
          workflow_type: selectedType !== "all" ? selectedType : undefined,
        });

        setTemplates(response.results);
      } catch (err) {
        console.error('Error fetching workflow templates:', err);
        setError('Failed to load workflow templates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchTemplates();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedType]);

  // Get unique workflow types for filter dropdown
  const uniqueTypes = Array.from(
    new Set(templates.map(template => template.workflow_type))
  );

  const handleUseTemplate = (templateId: string) => {
    // Navigate to create workflow with template
    window.location.href = `/workflows/new?template=${templateId}`;
  };

  const handleEditTemplate = (templateId: string) => {
    // Navigate to edit template (you may want to create this page)
    console.log("Editing template:", templateId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/workflows"
                className="text-primary hover:text-primary-hover"
              >
                ← Back to Workflows
              </Link>
            </div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Workflow Templates
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Create and manage reusable workflow templates for consistent processes
            </p>
          </div>
          {!loading && (
          <div className="flex gap-2">
            <Link href="/workflows/new">
              <Button variant="secondary">+ New Workflow</Button>
            </Link>
            <Button variant="primary">+ Create Template</Button>
          </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading templates...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && !error && (
        <>
        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            🔄 Workflow Templates
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Save time by creating standardized workflow templates. Templates help ensure 
            consistency across similar processes and can include predefined steps, 
            assignees, and timelines that can be customized for each workflow instance.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-dark dark:text-white">
              {templates.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Templates</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">
              {templates.filter(t => t.workflow_type === "CERTIFICATION").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Certification</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">
              {templates.filter(t => t.workflow_type === "AUDIT_PROCESS").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Audit Process</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600">
              {templates.filter(t => t.workflow_type === "CLIENT_ONBOARDING").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Onboarding</div>
          </div>
        </div>

        {/* Filters */}
        <WidgetCard title="Filters">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Workflow Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates by name or description..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
            </div>
          </div>
        </WidgetCard>

        {/* Templates Grid */}
        <WidgetCard title={`Workflow Templates (${templates.length})`}>
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={handleUseTemplate}
                  onEdit={handleEditTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
                No workflow templates found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || selectedType !== "all" 
                  ? "Try adjusting your filters or create a new template."
                  : "Create your first workflow template to get started."}
              </p>
              <Button variant="primary">+ Create Your First Template</Button>
            </div>
          )}
        </WidgetCard>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}