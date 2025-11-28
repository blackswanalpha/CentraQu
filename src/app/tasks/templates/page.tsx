"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { TaskTemplate } from "@/types/audit";
import { taskService } from "@/services/task.service";
import Link from "next/link";

// Helper function to convert API TaskTemplate to component type
const convertToTemplateItem = (template: any): TaskTemplate => {
  return {
    id: template.id.toString(),
    name: template.name,
    description: template.description,
    tasks: template.template_data?.tasks || [],
    category: template.task_type?.toLowerCase().replace('_', '-') || 'general',
    typicalDuration: template.template_data?.typical_duration || 7,
    usageCount: template.template_data?.usage_count || 0,
    lastUsedAt: template.updated_at ? new Date(template.updated_at) : undefined,
    createdAt: new Date(template.created_at),
    updatedAt: new Date(template.updated_at),
  };
};

interface TemplateCardProps {
  template: TaskTemplate;
  onUse: (templateId: string) => void;
  onEdit: (templateId: string) => void;
}

function TemplateCard({ template, onUse, onEdit }: TemplateCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-dark dark:text-white">
            📋 {template.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {template.tasks.length} tasks | Typical duration: {template.typicalDuration} days
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Last used: {template.lastUsedAt?.toLocaleDateString()} | Used:{" "}
            {template.usageCount} times
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Tasks included:
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Send welcome email and onboarding kit</li>
          <li>• Schedule kickoff meeting</li>
          <li>• Collect client documentation</li>
          <li>• Set up client profile in system</li>
          <li>• Create Zoho Books customer record</li>
        </ul>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="primary" onClick={() => onUse(template.id)}>
          USE
        </Button>
        <Button variant="secondary" onClick={() => onEdit(template.id)}>
          EDIT
        </Button>
        <button className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 transition">
          DUPLICATE
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 transition">
          DELETE
        </button>
      </div>
    </div>
  );
}

export default function TaskTemplatesPage() {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await taskService.getTemplates({
          ordering: '-created_at',
        });

        const templateItems = response.results.map(convertToTemplateItem);
        setTemplates(templateItems);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleUseTemplate = (templateId: string) => {
    // Navigate to create task with template
    console.log("Using template:", templateId);
  };

  const handleEditTemplate = (templateId: string) => {
    // Navigate to edit template
    console.log("Editing template:", templateId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Task Management &gt; Templates
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Create and manage reusable task templates
            </p>
          </div>
          {!loading && (
          <Button variant="primary">+ Create Template</Button>
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
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Save time by creating templates for recurring task sequences. Use
            templates to quickly create multiple related tasks with consistent
            settings.
          </p>
        </div>

        {/* Templates Grid */}
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

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No templates created yet
            </p>
            <Button variant="primary">+ Create Your First Template</Button>
          </div>
        )}
        </>
        )}
      </div>
    </DashboardLayout>
  );
}

