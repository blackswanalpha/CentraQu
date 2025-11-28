"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { AuditActivityItem } from "@/types/scheduler";
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

export default function NewAuditActivityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "",
    standard: "",
    activityType: "site-visit" as AuditActivityItem['activityType'],
    stage: "stage-1" as AuditActivityItem['stage'],
    priority: "medium" as AuditActivityItem['priority'],
    assignedTo: "",
    dueDate: "",
    dueTime: "",
    estimatedDuration: "",
    location: "",
    equipment: [] as string[],
    documents: [] as string[],
    teamMembers: [] as string[],
    tags: [] as string[],
  });

  const [equipmentInput, setEquipmentInput] = useState("");
  const [documentInput, setDocumentInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = (field: 'equipment' | 'documents' | 'tags', input: string, setInput: (value: string) => void) => {
    if (input.trim() && !formData[field].includes(input.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], input.trim()]
      }));
      setInput("");
    }
  };

  const removeItem = (field: 'equipment' | 'documents' | 'tags', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }));
  };

  const handleTeamMemberToggle = (auditorId: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(auditorId)
        ? prev.teamMembers.filter(id => id !== auditorId)
        : [...prev.teamMembers, auditorId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.clientId || !formData.assignedTo || !formData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    // In a real app, this would make an API call
    console.log("Creating audit activity:", formData);
    
    // Redirect to activities list
    router.push("/audit-activities");
  };

  const selectedClient = MOCK_CLIENTS.find(c => c.id === formData.clientId);
  const selectedAuditor = MOCK_AUDITORS.find(a => a.id === formData.assignedTo);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/audit-activities"
                className="text-primary hover:text-primary-hover"
              >
                ← Back to Activities
              </Link>
            </div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Create New Audit Activity
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Set up a new audit activity with all necessary details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <WidgetCard title="Basic Information">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Activity Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="e.g., ISO 9001 Stage 2 Audit - ABC Corporation"
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
                  placeholder="Describe the audit activity..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleInputChange("clientId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  required
                >
                  <option value="">Select a client</option>
                  {MOCK_CLIENTS.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium mb-2">Activity Type</label>
                <select
                  value={formData.activityType}
                  onChange={(e) => handleInputChange("activityType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                >
                  <option value="preparation">Preparation</option>
                  <option value="site-visit">Site Visit</option>
                  <option value="documentation">Documentation</option>
                  <option value="report-writing">Report Writing</option>
                  <option value="follow-up">Follow-up</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Audit Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange("stage", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                >
                  <option value="stage-1">Stage 1</option>
                  <option value="stage-2">Stage 2</option>
                  <option value="surveillance">Surveillance</option>
                  <option value="recertification">Recertification</option>
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
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="e.g., Client office, Remote, etc."
                />
              </div>
            </div>
          </WidgetCard>

          {/* Schedule */}
          <WidgetCard title="Schedule">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => handleInputChange("dueTime", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                <input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="8"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </WidgetCard>

          {/* Team Assignment */}
          <WidgetCard title="Team Assignment">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lead Auditor <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  required
                >
                  <option value="">Select lead auditor</option>
                  {MOCK_AUDITORS.map(auditor => (
                    <option key={auditor.id} value={auditor.id}>{auditor.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Team Members</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {MOCK_AUDITORS
                    .filter(auditor => auditor.id !== formData.assignedTo)
                    .map(auditor => (
                    <label key={auditor.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.teamMembers.includes(auditor.id)}
                        onChange={() => handleTeamMemberToggle(auditor.id)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm">{auditor.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </WidgetCard>

          {/* Equipment & Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WidgetCard title="Required Equipment">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={equipmentInput}
                    onChange={(e) => setEquipmentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('equipment', equipmentInput, setEquipmentInput))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                    placeholder="Add equipment item..."
                  />
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => addItem('equipment', equipmentInput, setEquipmentInput)}
                  >
                    Add
                  </Button>
                </div>
                
                {formData.equipment.length > 0 && (
                  <div className="space-y-2">
                    {formData.equipment.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItem('equipment', item)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </WidgetCard>

            <WidgetCard title="Required Documents">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={documentInput}
                    onChange={(e) => setDocumentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('documents', documentInput, setDocumentInput))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                    placeholder="Add document..."
                  />
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => addItem('documents', documentInput, setDocumentInput)}
                  >
                    Add
                  </Button>
                </div>
                
                {formData.documents.length > 0 && (
                  <div className="space-y-2">
                    {formData.documents.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItem('documents', item)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </WidgetCard>
          </div>

          {/* Tags */}
          <WidgetCard title="Tags">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('tags', tagInput, setTagInput))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="Add tags..."
                />
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={() => addItem('tags', tagInput, setTagInput)}
                >
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
                        onClick={() => removeItem('tags', tag)}
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
            <Link href="/audit-activities">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary">
              Create Activity
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}