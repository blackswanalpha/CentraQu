"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { WorkflowItem, WorkflowStep } from "@/types/scheduler";
import { workflowService, WorkflowTemplate } from "@/services/workflow.service";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock data removed - now using real API data

export default function NewWorkflowPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workflowType: "audit-process" as WorkflowItem['workflowType'],
    priority: "medium" as WorkflowItem['priority'],
    assignedTo: "",
    dueDate: "",
    estimatedDuration: "",
    approvalRequired: false,
    tags: [] as string[],
  });

  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [assignees, setAssignees] = useState<any[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch assignees and templates from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch assignees (employees)
        const assigneesData = await workflowService.getAssignees();
        setAssignees(assigneesData);

        // Fetch workflow templates
        const templatesResponse = await workflowService.getTemplates();
        setTemplates(templatesResponse.results);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load form data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id.toString() === templateId);

    if (template && template.template_data) {
      setFormData(prev => ({
        ...prev,
        title: template.name,
        description: template.description,
        workflowType: template.workflow_type.toLowerCase().replace('_', '-') as WorkflowItem['workflowType'],
      }));

      // Parse template data to extract steps if available
      if (template.template_data.steps && Array.isArray(template.template_data.steps)) {
        const templateSteps: WorkflowStep[] = template.template_data.steps.map((step: any, index: number) => ({
          id: `step-${index + 1}`,
          title: step.title || '',
          description: step.description || '',
          assignedTo: step.assignedTo || '',
          status: "pending" as const,
          dueDate: new Date(Date.now() + (step.estimatedDays || 7) * 24 * 60 * 60 * 1000),
          approvalRequired: step.approvalRequired || false,
        }));

        setSteps(templateSteps);
      }
    }
  };

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${steps.length + 1}`,
      title: "",
      description: "",
      assignedTo: "",
      status: "pending",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      approvalRequired: false,
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (index: number, field: string, value: any) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value
    };
    setSteps(updatedSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const updatedSteps = [...steps];
    [updatedSteps[index], updatedSteps[newIndex]] = [updatedSteps[newIndex], updatedSteps[index]];
    setSteps(updatedSteps);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (steps.length === 0) {
      alert("Please add at least one workflow step");
      return;
    }

    const invalidSteps = steps.filter(step => !step.title || !step.assignedTo);
    if (invalidSteps.length > 0) {
      alert("Please complete all workflow steps");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Create workflow via API
      const workflowData = {
        title: formData.title,
        description: formData.description,
        workflow_type: formData.workflowType.toUpperCase().replace('-', '_'),
        priority: formData.priority.toUpperCase(),
        assigned_to: parseInt(formData.assignedTo),
        due_date: formData.dueDate,
        estimated_duration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : undefined,
        approval_required: formData.approvalRequired,
        tags: formData.tags.join(','),
        status: 'NOT_STARTED',
      };

      const createdWorkflow = await workflowService.createWorkflow(workflowData);

      // TODO: Create workflow steps via API
      // For now, we'll just redirect to the workflows list

      // Redirect to workflows list
      router.push("/workflows");
    } catch (err) {
      console.error('Error creating workflow:', err);
      setError('Failed to create workflow. Please try again.');
      setSubmitting(false);
    }
  };

  const selectedAssignee = assignees.find(a => a.id.toString() === formData.assignedTo);

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
              Create New Workflow
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Set up a multi-step business process with defined stages and assignments
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading form data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Form - Only show when not loading */}
        {!loading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <WidgetCard title="Start from Template (Optional)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTemplate === template.id.toString()
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                  onClick={() => handleTemplateSelect(template.id.toString())}
                >
                  <h3 className="font-semibold text-dark dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {template.steps.length} steps
                  </div>
                </div>
              ))}
            </div>
            {selectedTemplate && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  ✅ Template loaded! You can customize the details below.
                </p>
              </div>
            )}
          </WidgetCard>

          {/* Basic Information */}
          <WidgetCard title="Workflow Information">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Workflow Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="e.g., ISO 9001 Certification Process - ABC Corporation"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  rows={3}
                  placeholder="Describe the workflow purpose and scope..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Workflow Type</label>
                <select
                  value={formData.workflowType}
                  onChange={(e) => handleInputChange("workflowType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                >
                  <option value="audit-process">Audit Process</option>
                  <option value="certification">Certification</option>
                  <option value="client-onboarding">Client Onboarding</option>
                  <option value="compliance-check">Compliance Check</option>
                  <option value="review-process">Review Process</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange("priority", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Workflow Owner <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  required
                >
                  <option value="">Select workflow owner</option>
                  {assignees.map(assignee => (
                    <option key={assignee.id} value={assignee.id}>{assignee.first_name} {assignee.last_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Completion Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Total Hours</label>
                <input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="40"
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.approvalRequired}
                    onChange={(e) => handleInputChange("approvalRequired", e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium">Requires Approval</span>
                </label>
              </div>
            </div>
          </WidgetCard>

          {/* Workflow Steps */}
          <WidgetCard title="Workflow Steps">
            <div className="space-y-4">
              {steps.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No steps added yet. Click "Add Step" to create your workflow.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <h4 className="font-medium text-dark dark:text-white">
                            Step {index + 1}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === steps.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Step Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateStep(index, "title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                            placeholder="e.g., Application Review"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Assigned To <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={step.assignedTo || ""}
                            onChange={(e) => updateStep(index, "assignedTo", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                            required
                          >
                            <option value="">Select assignee</option>
                            {assignees.map(assignee => (
                              <option key={assignee.id} value={assignee.id}>{assignee.first_name} {assignee.last_name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={step.description || ""}
                            onChange={(e) => updateStep(index, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                            rows={2}
                            placeholder="Describe what needs to be done in this step..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Due Date</label>
                          <input
                            type="date"
                            value={step.dueDate ? step.dueDate.toISOString().split('T')[0] : ""}
                            onChange={(e) => updateStep(index, "dueDate", new Date(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                          />
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={step.approvalRequired || false}
                              onChange={(e) => updateStep(index, "approvalRequired", e.target.checked)}
                              className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm">Requires Approval</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center">
                <Button type="button" variant="secondary" onClick={addStep}>
                  + Add Step
                </Button>
              </div>
            </div>
          </WidgetCard>

          {/* Tags */}
          <WidgetCard title="Tags">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="Add tags..."
                />
                <Button type="button" variant="secondary" onClick={addTag}>
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-red-500 hover:text-red-700 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </WidgetCard>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Link href="/workflows">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Workflow'}
            </Button>
          </div>
        </form>
        )}
      </div>
    </DashboardLayout>
  );
}