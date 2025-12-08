"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auditService } from "@/services/audit.service";

export default function PostScheduleWorkflowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auditId = searchParams.get('auditId');
  
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState("");
  const [customEmailData, setCustomEmailData] = useState({
    to: "",
    subject: "",
    body: ""
  });
  const [step, setStep] = useState<"template" | "email">("template");
  const [selectedTaskTemplate, setSelectedTaskTemplate] = useState("");
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  
  // Real data from API
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch audit and templates on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!auditId) {
        setError("No audit ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [auditData, templatesData] = await Promise.all([
          auditService.getAudit(auditId),
          auditService.getChecklists({ is_template: true })
        ]);
        
        setAudit(auditData);
        setAvailableTemplates(templatesData.results || []);
        
        // Pre-populate email data
        setCustomEmailData({
          to: auditData.client_data?.email || "",
          subject: `Audit Scheduled - ${auditData.client_name}`,
          body: ""
        });
      } catch (err) {
        console.error("Error fetching audit data:", err);
        setError("Failed to load audit data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auditId]);

  const emailTemplates = [
    {
      id: "EMAIL-001",
      name: "Audit Confirmation Email",
      subject: "Audit Scheduled - [Client Name]",
      preview: "We are pleased to confirm that your audit has been scheduled..."
    },
    {
      id: "EMAIL-002",
      name: "Pre-Audit Information Request",
      subject: "Document Request for Upcoming Audit - [Client Name]",
      preview: "In preparation for your upcoming audit, please provide..."
    },
    {
      id: "EMAIL-003",
      name: "Audit Team Introduction",
      subject: "Meet Your Audit Team - [Client Name]",
      preview: "We would like to introduce the audit team assigned..."
    }
  ];

  const taskTemplates = [
    {
      id: "TASK-001",
      name: "ISO 9001:2015 Pre-Audit Checklist",
      description: "Standard pre-audit preparation tasks for ISO 9001",
      tasks: [
        { id: "T001", task: "Review client's quality manual", required: true, category: "Document Review" },
        { id: "T002", task: "Verify scope of certification", required: true, category: "Planning" },
        { id: "T003", task: "Prepare audit plan and schedule", required: true, category: "Planning" },
        { id: "T004", task: "Conduct opening meeting preparation", required: false, category: "Communication" },
        { id: "T005", task: "Review previous audit reports", required: false, category: "Document Review" }
      ]
    },
    {
      id: "TASK-002", 
      name: "ISO 14001:2015 Environmental Audit Tasks",
      description: "Environmental management system audit preparation",
      tasks: [
        { id: "T006", task: "Review environmental policy and objectives", required: true, category: "Document Review" },
        { id: "T007", task: "Check environmental aspects register", required: true, category: "Document Review" },
        { id: "T008", task: "Verify legal compliance monitoring", required: true, category: "Compliance" },
        { id: "T009", task: "Review emergency response procedures", required: false, category: "Procedures" },
        { id: "T010", task: "Check waste management records", required: false, category: "Records" }
      ]
    },
    {
      id: "TASK-003",
      name: "Multi-Standard Integration Checklist", 
      description: "Tasks for combined certification audits",
      tasks: [
        { id: "T011", task: "Map integrated management system", required: true, category: "Planning" },
        { id: "T012", task: "Review common procedures alignment", required: true, category: "Document Review" },
        { id: "T013", task: "Check management review integration", required: true, category: "Management" },
        { id: "T014", task: "Verify internal audit coordination", required: false, category: "Audit" },
        { id: "T015", task: "Review risk assessment integration", required: false, category: "Risk Management" }
      ]
    }
  ];

  const handleTemplateSelection = async () => {
    if (selectedTemplates.length === 0) {
      alert("Please select at least one template to continue");
      return;
    }

    try {
      // Associate the first selected template with the audit (for backward compatibility)
      const templateId = parseInt(selectedTemplates[0]);
      // Also associate all selected templates via the many-to-many relationship
      const templateIds = selectedTemplates.map(id => parseInt(id));

      await auditService.updateAudit(auditId!, {
        audit_template: templateId,
        audit_templates: templateIds
      });
      setStep("email");
    } catch (err) {
      console.error("Error associating template with audit:", err);
      alert("Failed to associate template. Please try again.");
    }
  };

  const handleContinueToChecklist = async () => {
    if (selectedTemplates.length === 0) {
      alert("Please select at least one template to continue");
      return;
    }

    try {
      // Associate all selected templates with the audit
      const templateId = parseInt(selectedTemplates[0]);
      const templateIds = selectedTemplates.map(id => parseInt(id));

      await auditService.updateAudit(auditId!, {
        audit_template: templateId,
        audit_templates: templateIds
      });

      // Navigate directly to the checklist collection page
      router.push(`/dashboard/audits/${auditId}/checklist`);
    } catch (err) {
      console.error("Error associating templates with audit:", err);
      alert("Failed to associate templates. Please try again.");
    }
  };

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleCreateTemplate = () => {
    router.push("/dashboard/audits/templates/new");
  };

  const handleSendEmail = () => {
    console.log("Sending email:", customEmailData);
    // Redirect to the audit detail page after completion
    router.push(`/dashboard/audits/${auditId}`);
  };

  const handleUseEmailTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setCustomEmailData({
        ...customEmailData,
        subject: template.subject,
        body: template.preview + "\n\nThis is the full email content that would be loaded from the template..."
      });
    }
  };

  const handleTaskToggle = (taskId: string) => {
    setCheckedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleTaskTemplateSelect = (templateId: string) => {
    setSelectedTaskTemplate(templateId);
    // Auto-check required tasks when template is selected
    const template = taskTemplates.find(t => t.id === templateId);
    if (template) {
      const requiredTasks = template.tasks.filter(task => task.required).map(task => task.id);
      setCheckedTasks(requiredTasks);
    }
  };

  const getSelectedTaskTemplate = () => {
    return taskTemplates.find(t => t.id === selectedTaskTemplate);
  };

  const getTaskProgress = () => {
    const template = getSelectedTaskTemplate();
    if (!template) return { completed: 0, total: 0, percentage: 0 };
    
    const total = template.tasks.length;
    const completed = checkedTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading audit data...</p>
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
            <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Failed to load audit data'}</p>
            <button
              onClick={() => router.push('/dashboard/audits')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Return to Audits
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
              Audit Setup Complete
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Configure your audit template and notify the client
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${step === "template" ? "bg-primary" : "bg-green-500"}`}></div>
              <span className="text-sm">Template Selection</span>
            </div>
            <div className="w-4 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${step === "email" ? "bg-primary" : "bg-gray-300"}`}></div>
              <span className="text-sm">Email Notification</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">✓</span>
            </div>
            <div>
              <h3 className="font-medium text-green-900 dark:text-green-300">Audit Successfully Scheduled</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your audit for {audit.client_name} has been scheduled for {new Date(audit.planned_start_date).toLocaleDateString()} - {new Date(audit.planned_end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {step === "template" && (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {/* Template Selection */}
            <div className="lg:col-span-2">
              <WidgetCard title="Select Audit Template">
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose one or more templates to structure your audit process. You can select multiple certifications for comprehensive audits.
                  </p>

                  {selectedTemplates.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                        Selected Templates ({selectedTemplates.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplates.map(templateId => {
                          const template = availableTemplates.find(t => t.id.toString() === templateId);
                          return template ? (
                            <span key={templateId} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                              {template.iso_standard_data?.code || template.title}
                              <button 
                                onClick={() => handleTemplateToggle(templateId)}
                                className="hover:text-blue-600 dark:hover:text-blue-300"
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {availableTemplates.length > 0 ? (
                    <div className="space-y-4">
                      {availableTemplates.map((template) => (
                        <div 
                          key={template.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedTemplates.includes(template.id.toString())
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                          }`}
                          onClick={() => handleTemplateToggle(template.id.toString())}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedTemplates.includes(template.id.toString())}
                                  onChange={() => handleTemplateToggle(template.id.toString())}
                                  className="text-primary rounded"
                                />
                                <h3 className="font-semibold text-dark dark:text-white">
                                  {template.title}
                                </h3>
                                {selectedTemplates.includes(template.id.toString()) && (
                                  <span className="px-2 py-1 bg-primary text-white text-xs rounded">Selected</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-6">
                                {template.description || 'No description available'}
                              </p>
                              <div className="flex gap-4 text-xs text-gray-500 mt-3 ml-6">
                                <span>Standard: {template.iso_standard_data?.code || 'N/A'}</span>
                                <span>{template.sections?.length || 0} sections</span>
                                <span>{template.items?.length || 0} items</span>
                              </div>
                            </div>
                            <button 
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/audits/templates/${template.id}`);
                              }}
                            >
                              Preview
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No templates available</p>
                      <button 
                        onClick={handleCreateTemplate}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover"
                      >
                        Create Your First Template
                      </button>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleCreateTemplate}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                    >
                      Create New Template
                    </button>
                    <button
                      onClick={handleContinueToChecklist}
                      disabled={selectedTemplates.length === 0}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Checklist ({selectedTemplates.length} selected)
                    </button>
                    <button
                      onClick={handleTemplateSelection}
                      disabled={selectedTemplates.length === 0}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Email Setup ({selectedTemplates.length} selected)
                    </button>
                  </div>
                </div>
              </WidgetCard>
            </div>

            {/* Template Preview */}
            <div>
              <WidgetCard title="Selected Templates Summary">
                {selectedTemplates.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {selectedTemplates.length} template(s) selected for multi-certification audit
                    </div>
                    {selectedTemplates.map(templateId => {
                      const template = availableTemplates.find(t => t.id.toString() === templateId);
                      return template ? (
                        <div key={templateId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                          <h4 className="font-medium text-dark dark:text-white text-sm">{template.iso_standard_data?.code || template.title}</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2">
                            <div>Sections: {template.sections?.length || 0}</div>
                            <div>Items: {template.items?.length || 0}</div>
                          </div>
                        </div>
                      ) : null;
                    })}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Total Sections:</span>
                          <span className="font-medium">
                            {selectedTemplates.reduce((total, templateId) => {
                              const template = availableTemplates.find(t => t.id.toString() === templateId);
                              return total + (template?.sections?.length || 0);
                            }, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Items:</span>
                          <span className="font-medium">
                            {selectedTemplates.reduce((total, templateId) => {
                              const template = availableTemplates.find(t => t.id.toString() === templateId);
                              return total + (template?.items?.length || 0);
                            }, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Select templates to preview</p>
                )}
              </WidgetCard>

              {/* Audit Preparation Checklist */}
              <WidgetCard title="Audit Preparation Checklist">
                <div className="space-y-4">
                  {/* Task Template Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Task Template</label>
                    <select
                      value={selectedTaskTemplate}
                      onChange={(e) => handleTaskTemplateSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Choose a task template...</option>
                      {taskTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    {selectedTaskTemplate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getSelectedTaskTemplate()?.description}
                      </p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {selectedTaskTemplate && (
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Checklist Progress</span>
                        <span className="text-sm text-gray-600">
                          {getTaskProgress().completed} of {getTaskProgress().total} tasks
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getTaskProgress().percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getTaskProgress().percentage}% complete
                      </div>
                    </div>
                  )}

                  {/* Task List */}
                  {selectedTaskTemplate && getSelectedTaskTemplate() && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-dark dark:text-white">Tasks to Complete</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {getSelectedTaskTemplate()?.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                              checkedTasks.includes(task.id)
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checkedTasks.includes(task.id)}
                              onChange={() => handleTaskToggle(task.id)}
                              className="mt-1 text-primary rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm ${checkedTasks.includes(task.id) ? 'line-through text-gray-500' : 'text-dark dark:text-white'}`}>
                                  {task.task}
                                </span>
                                {task.required && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Required</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                  {task.category}
                                </span>
                                {checkedTasks.includes(task.id) && (
                                  <span className="text-xs text-green-600">✓ Completed</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Task Template Actions */}
                  {selectedTaskTemplate && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-sm">
                        Save Progress
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-sm">
                        Export Checklist
                      </button>
                      <button 
                        onClick={() => {
                          const template = getSelectedTaskTemplate();
                          if (template) {
                            const allTaskIds = template.tasks.map(task => task.id);
                            setCheckedTasks(allTaskIds);
                          }
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
                      >
                        Mark All Complete
                      </button>
                    </div>
                  )}

                  {/* No Template Selected State */}
                  {!selectedTaskTemplate && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">📋</div>
                      <h4 className="font-medium text-dark dark:text-white mb-2">No Task Template Selected</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Choose a task template above to see your audit preparation checklist
                      </p>
                      <button 
                        onClick={() => setSelectedTaskTemplate("TASK-001")}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
                      >
                        Use Default Checklist
                      </button>
                    </div>
                  )}
                </div>
              </WidgetCard>
            </div>
          </div>
        )}

        {step === "email" && (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            {/* Email Templates */}
            <div>
              <WidgetCard title="Email Templates">
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose an email template or compose a custom message to notify the client.
                  </p>

                  {emailTemplates.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-dark dark:text-white">Available Email Templates</h3>
                      {emailTemplates.map((template) => (
                        <div 
                          key={template.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-dark dark:text-white">{template.name}</h4>
                            <button 
                              onClick={() => handleUseEmailTemplate(template.id)}
                              className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-hover"
                            >
                              Use Template
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.subject}</p>
                          <p className="text-xs text-gray-500">{template.preview}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No email templates available</p>
                    </div>
                  )}
                </div>
              </WidgetCard>
            </div>

            {/* Email Composition */}
            <div>
              <WidgetCard title="Compose Email">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">To</label>
                    <input
                      type="email"
                      value={customEmailData.to}
                      onChange={(e) => setCustomEmailData({...customEmailData, to: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      value={customEmailData.subject}
                      onChange={(e) => setCustomEmailData({...customEmailData, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={customEmailData.body}
                      onChange={(e) => setCustomEmailData({...customEmailData, body: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={8}
                      placeholder="Dear Client,

We are pleased to confirm that your audit has been scheduled for October 21-23, 2025.

Your assigned audit team:
- Lead Auditor: Sarah Mitchell
- Supporting Auditor: David Kimani

Please prepare the following documents:
- Quality manual
- Procedure documents
- Internal audit reports
- Management review records

We look forward to working with you.

Best regards,
CentraQu Audit Team"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setStep("template")}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                    >
                      Back
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
                      Save as Draft
                    </button>
                    <button 
                      onClick={handleSendEmail}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                    >
                      Send Email & Complete
                    </button>
                  </div>
                </div>
              </WidgetCard>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}