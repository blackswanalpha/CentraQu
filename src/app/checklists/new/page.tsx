"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { ChecklistItem, ChecklistSubItem } from "@/types/scheduler";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock data for dropdowns
const MOCK_CLIENTS = [
  { id: "ABC-Corp", name: "ABC Corporation" },
  { id: "XYZ-Industries", name: "XYZ Industries Ltd" },
  { id: "DEF-Ltd", name: "DEF Limited" },
  { id: "GHI-Partners", name: "GHI Partners" },
];

const MOCK_AUDITORS = [
  { id: "sarah-mitchell", name: "Sarah Mitchell" },
  { id: "james-kennedy", name: "James Kennedy" },
  { id: "linda-peterson", name: "Linda Peterson" },
  { id: "michael-roberts", name: "Michael Roberts" },
  { id: "emma-wilson", name: "Emma Wilson" },
];

const ISO_STANDARDS = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001:2018",
  "ISO 27001:2022",
  "ISO 22000:2018",
  "ISO 50001:2018",
];

const CHECKLIST_TEMPLATES = [
  {
    id: "template-001",
    name: "ISO 9001 Pre-Audit Documentation Review",
    description: "Standard checklist for reviewing documentation before on-site audit",
    standard: "ISO 9001:2015",
    items: [
      { title: "Quality Manual Review", description: "Review current quality manual for compliance", required: true },
      { title: "Process Documentation Verification", description: "Verify all key processes are documented", required: true },
      { title: "Internal Audit Records", description: "Review last 12 months of internal audit records", required: true },
      { title: "Management Review Minutes", description: "Review management review meeting minutes", required: true },
      { title: "Customer Complaint Records", description: "Review customer complaint handling", required: false },
      { title: "Corrective Action Log", description: "Review corrective actions from previous audits", required: true },
    ]
  },
  {
    id: "template-002",
    name: "ISO 14001 Environmental Compliance Check",
    description: "Environmental management system compliance verification",
    standard: "ISO 14001:2015",
    items: [
      { title: "Environmental Policy Review", description: "Verify environmental policy is current", required: true },
      { title: "Environmental Aspects Register", description: "Review identification of environmental aspects", required: true },
      { title: "Legal Compliance Register", description: "Verify compliance with regulations", required: true },
      { title: "Waste Management Records", description: "Review waste disposal documentation", required: true },
      { title: "Environmental Monitoring Data", description: "Review monitoring records", required: false },
    ]
  },
  {
    id: "template-003",
    name: "ISO 45001 Safety Management Review",
    description: "Occupational health and safety management system checklist",
    standard: "ISO 45001:2018",
    items: [
      { title: "OH&S Policy Verification", description: "Verify health and safety policy", required: true },
      { title: "Hazard Identification Process", description: "Review hazard identification process", required: true },
      { title: "Incident Investigation Records", description: "Review incident investigation records", required: true },
      { title: "Training Records Review", description: "Verify safety training compliance", required: true },
      { title: "Safety Performance Metrics", description: "Review safety KPIs and metrics", required: false },
    ]
  },
];

export default function NewChecklistPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "",
    auditId: "",
    standard: "",
    priority: "medium" as ChecklistItem['priority'],
    assignedTo: "",
    dueDate: "",
    mustCompleteBy: "",
    estimatedDuration: "",
    tags: [] as string[],
  });

  const [checklistItems, setChecklistItems] = useState<ChecklistSubItem[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = CHECKLIST_TEMPLATES.find(t => t.id === templateId);
    
    if (template) {
      setFormData(prev => ({
        ...prev,
        title: template.name,
        description: template.description,
        standard: template.standard,
      }));

      const templateItems: ChecklistSubItem[] = template.items.map((item, index) => ({
        id: `item-${index + 1}`,
        title: item.title,
        description: item.description,
        required: item.required,
        completed: false,
      }));

      setChecklistItems(templateItems);
    }
  };

  const addChecklistItem = () => {
    const newItem: ChecklistSubItem = {
      id: `item-${checklistItems.length + 1}`,
      title: "",
      description: "",
      required: false,
      completed: false,
    };
    setChecklistItems([...checklistItems, newItem]);
  };

  const updateChecklistItem = (index: number, field: string, value: any) => {
    const updatedItems = [...checklistItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setChecklistItems(updatedItems);
  };

  const removeChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= checklistItems.length) return;

    const updatedItems = [...checklistItems];
    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
    setChecklistItems(updatedItems);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (checklistItems.length === 0) {
      alert("Please add at least one checklist item");
      return;
    }

    const invalidItems = checklistItems.filter(item => !item.title);
    if (invalidItems.length > 0) {
      alert("Please complete all checklist items");
      return;
    }

    // In a real app, this would make an API call
    console.log("Creating checklist:", { formData, checklistItems });
    
    // Redirect to checklists list
    router.push("/checklists");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/checklists"
                className="text-primary hover:text-primary-hover"
              >
                ← Back to Checklists
              </Link>
            </div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Create New Checklist
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Create a comprehensive checklist for audit activities and compliance verification
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <WidgetCard title="Start from Template (Optional)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CHECKLIST_TEMPLATES.map(template => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <h3 className="font-semibold text-dark dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Standard: {template.standard}</div>
                    <div>{template.items.length} items</div>
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
          <WidgetCard title="Checklist Information">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Checklist Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="e.g., ISO 9001 Pre-Audit Documentation Review"
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
                  placeholder="Describe the purpose and scope of this checklist..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleInputChange("clientId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                >
                  <option value="">Select a client</option>
                  {MOCK_CLIENTS.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Audit ID</label>
                <input
                  type="text"
                  value={formData.auditId}
                  onChange={(e) => handleInputChange("auditId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="e.g., A-2025-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ISO Standard</label>
                <select
                  value={formData.standard}
                  onChange={(e) => handleInputChange("standard", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                >
                  <option value="">Select a standard</option>
                  {ISO_STANDARDS.map(standard => (
                    <option key={standard} value={standard}>{standard}</option>
                  ))}
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
                  Assigned To <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  required
                >
                  <option value="">Select assignee</option>
                  {MOCK_AUDITORS.map(auditor => (
                    <option key={auditor.id} value={auditor.id}>{auditor.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Due Date <span className="text-red-500">*</span>
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
                <label className="block text-sm font-medium mb-2">Must Complete By</label>
                <input
                  type="date"
                  value={formData.mustCompleteBy}
                  onChange={(e) => handleInputChange("mustCompleteBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Duration (hours)</label>
                <input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="3"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </WidgetCard>

          {/* Checklist Items */}
          <WidgetCard title="Checklist Items">
            <div className="space-y-4">
              {checklistItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No items added yet. Click "Add Item" to create your checklist.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {checklistItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <h4 className="font-medium text-dark dark:text-white">
                            Item {index + 1}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveItem(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(index, 'down')}
                            disabled={index === checklistItems.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeChecklistItem(index)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Item Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateChecklistItem(index, "title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                            placeholder="e.g., Quality Manual Review"
                            required
                          />
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.required}
                              onChange={(e) => updateChecklistItem(index, "required", e.target.checked)}
                              className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm">Required Item</span>
                          </label>
                        </div>

                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={item.description || ""}
                            onChange={(e) => updateChecklistItem(index, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                            rows={2}
                            placeholder="Describe what needs to be checked or verified..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center">
                <Button type="button" variant="secondary" onClick={addChecklistItem}>
                  + Add Item
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
            <Link href="/checklists">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary">
              Create Checklist
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}