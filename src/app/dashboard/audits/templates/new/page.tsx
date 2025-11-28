"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auditService, type ISOStandard } from "@/services/audit.service";

interface TemplateSection {
  id: string;
  name: string;
  description?: string;
  order: number;
  items: Question[];
}

interface Question {
  id: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "rating" | "file" | "compliance";
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  actions?: string;
  comments?: string;
  notes?: string;
  clauseReference?: string;
  isoClause?: string;
  itemType?: "REQUIREMENT" | "PROCESS" | "DOCUMENT" | "RECORD" | "OBSERVATION" | "CONTROL";
  allowComments?: boolean;
  allowNotes?: boolean;
  allowEvidenceUpload?: boolean;
  isMandatory?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// Predefined section templates
const predefinedSections = [
  {
    name: "Guidance Notes for Auditors",
    description: "Instructions and guidelines for conducting the audit",
    items: []
  },
  {
    name: "Title Page",
    description: "Cover page information and audit details",
    items: []
  },
  {
    name: "Audit Scope",
    description: "Scope definition and boundaries of the audit",
    items: []
  },
  {
    name: "Audit Objectives",
    description: "Objectives and criteria for the audit",
    items: []
  },
  {
    name: "Context of the Organization",
    description: "Understanding organizational context and interested parties",
    items: []
  },
  {
    name: "Leadership",
    description: "Leadership and commitment requirements",
    items: []
  },
  {
    name: "Planning",
    description: "Planning requirements and risk management",
    items: []
  },
  {
    name: "Support",
    description: "Support processes including resources and competence",
    items: []
  },
  {
    name: "Operation",
    description: "Operational planning and control",
    items: []
  },
  {
    name: "Performance Evaluation",
    description: "Monitoring, measurement, analysis and evaluation",
    items: []
  },
  {
    name: "Improvement",
    description: "Nonconformity, corrective action and continual improvement",
    items: []
  },
  {
    name: "Recommendations",
    description: "Audit recommendations and follow-up actions",
    items: []
  },
  {
    name: "Sign-off",
    description: "Signature section for audit completion",
    items: []
  }
];

export default function NewTemplatePage() {
  const router = useRouter();
  const [templateData, setTemplateData] = useState({
    name: "",
    description: "",
    standard: "",
    company_name: "",
    header_content: "",
    footer_content: "",
    primary_color: "#2563eb",
    include_compliance_checkboxes: true,
    enable_comments: true,
    enable_notes: true,
    enable_actions: true
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  
  const [isoStandards, setIsoStandards] = useState<ISOStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSectionTemplates, setShowSectionTemplates] = useState(false);

  useEffect(() => {
    const fetchISOStandards = async () => {
      try {
        setLoading(true);
        const response = await auditService.getISOStandards({ ordering: 'code' });
        setIsoStandards(response.results || []);
        
        if (response.results && response.results.length > 0) {
          setTemplateData(prev => ({ ...prev, standard: response.results[0].id.toString() }));
        }
      } catch (err) {
        console.error('Error fetching ISO standards:', err);
        setError('Failed to load ISO standards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchISOStandards();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSection = (template?: any) => {
    const newSection: TemplateSection = {
      id: Date.now().toString(),
      name: template?.name || `New Section ${sections.length + 1}`,
      description: template?.description || '',
      order: sections.length,
      items: template?.items || []
    };
    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
    setShowSectionTemplates(false);
  };

  const updateSection = (sectionId: string, updates: Partial<TemplateSection>) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setSections(sections.filter(section => section.id !== sectionId));
      if (activeSection === sectionId) {
        setActiveSection(sections[0]?.id || null);
      }
    }
  };

  const addQuestion = (sectionId: string, type: Question["type"]) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: `New ${type} question`,
      required: false,
      clauseReference: "",
      isoClause: "",
      itemType: "REQUIREMENT",
      allowComments: true,
      allowNotes: true,
      allowEvidenceUpload: true,
      isMandatory: false,
      ...(type === "select" || type === "radio" || type === "checkbox" ? { options: ["Option 1", "Option 2"] } : {}),
    };

    updateSection(sectionId, {
      items: [...section.items, newQuestion]
    });
    
    setActiveQuestion(newQuestion.id);
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedItems = section.items.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );

    updateSection(sectionId, { items: updatedItems });
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const section = sections.find(s => s.id === sectionId);
      if (!section) return;

      const updatedItems = section.items.filter(q => q.id !== questionId);
      updateSection(sectionId, { items: updatedItems });

      if (activeQuestion === questionId) {
        setActiveQuestion(null);
      }
    }
  };

  const duplicateQuestion = (sectionId: string, questionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const questionToDuplicate = section.items.find(q => q.id === questionId);
    if (questionToDuplicate) {
      const newQuestion = {
        ...questionToDuplicate,
        id: Date.now().toString(),
        title: `Copy of ${questionToDuplicate.title}`,
      };
      updateSection(sectionId, {
        items: [...section.items, newQuestion]
      });
    }
  };

  const moveQuestion = (sectionId: string, questionId: string, direction: "up" | "down") => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const items = [...section.items];
    const index = items.findIndex(q => q.id === questionId);
    
    if (index === -1) return;
    
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
    
    updateSection(sectionId, { items });
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!templateData.name.trim()) {
        setError('Template name is required');
        return;
      }
      if (!templateData.standard) {
        setError('Please select an ISO standard');
        return;
      }

      setSaving(true);
      setError(null);

      // Prepare form data for file upload
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', templateData.name);
      formData.append('description', templateData.description);
      formData.append('iso_standard', templateData.standard);
      formData.append('company_name', templateData.company_name);
      formData.append('header_content', templateData.header_content);
      formData.append('footer_content', templateData.footer_content);
      formData.append('primary_color', templateData.primary_color);
      formData.append('include_compliance_checkboxes', templateData.include_compliance_checkboxes.toString());
      formData.append('enable_comments', templateData.enable_comments.toString());
      formData.append('enable_notes', templateData.enable_notes.toString());
      formData.append('enable_actions', templateData.enable_actions.toString());
      formData.append('is_template', 'true');

      // Add logo if selected
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Convert sections and questions to checklist items
      const allItems = sections.flatMap((section, sectionIndex) => 
        section.items.map((question, questionIndex) => ({
          clause_reference: question.clauseReference || `${section.name}-${questionIndex + 1}`,
          iso_clause: question.isoClause || '',
          item_type: question.itemType || 'REQUIREMENT',
          question: question.title,
          guidance: question.description || '',
          actions_required: question.actions || '',
          allow_comments: question.allowComments ?? true,
          allow_notes: question.allowNotes ?? true,
          allow_evidence_upload: question.allowEvidenceUpload ?? true,
          section_name: section.name,
          subsection: '',
          is_mandatory: question.isMandatory ?? false,
          order: sectionIndex * 1000 + questionIndex, // Ensure proper ordering across sections
        }))
      );

      // Add items as JSON
      formData.append('items', JSON.stringify(allItems));

      const createdChecklist = await auditService.createChecklist(formData);

      console.log("Template created successfully:", createdChecklist);

      // Redirect to templates list
      router.push("/dashboard/audits/templates");
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const questionTypes = [
    { type: "compliance" as const, label: "Compliance Check", icon: "✅", description: "Standard compliance checkbox question" },
    { type: "text" as const, label: "Short Text", icon: "📝", description: "Single line text input" },
    { type: "textarea" as const, label: "Long Text", icon: "📄", description: "Multi-line text area" },
    { type: "select" as const, label: "Dropdown", icon: "📋", description: "Dropdown selection" },
    { type: "radio" as const, label: "Multiple Choice", icon: "🔘", description: "Single selection from options" },
    { type: "checkbox" as const, label: "Checkboxes", icon: "☑️", description: "Multiple selection options" },
    { type: "rating" as const, label: "Rating Scale", icon: "⭐", description: "Star or numeric rating" },
    { type: "file" as const, label: "File Upload", icon: "📎", description: "Evidence file upload" },
  ];

  const activeQuestionData = activeQuestion && activeSection ? 
    sections.find(s => s.id === activeSection)?.items.find(q => q.id === activeQuestion) : null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Create New Template
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Build a custom audit checklist template with sections and questions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {!loading && (
          <div className="grid gap-8 grid-cols-1 xl:grid-cols-4">
            {/* Template Settings */}
            <div className="xl:col-span-1 space-y-6">
              {/* Basic Information */}
              <WidgetCard title="Template Settings">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Template Name *</label>
                    <input
                      type="text"
                      value={templateData.name}
                      onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g., ISO 9001 Stage 2 Checklist"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={templateData.description}
                      onChange={(e) => setTemplateData({...templateData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={3}
                      placeholder="Describe what this template is used for..."
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">ISO Standard *</label>
                    <select
                      value={templateData.standard}
                      onChange={(e) => setTemplateData({...templateData, standard: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      disabled={saving}
                    >
                      <option value="">Select a standard...</option>
                      {isoStandards.map((standard) => (
                        <option key={standard.id} value={standard.id}>
                          {standard.code} - {standard.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </WidgetCard>

              {/* Branding & Logo */}
              <WidgetCard title="Branding & Logo">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Logo</label>
                    {logoPreview && (
                      <div className="mb-3">
                        <img src={logoPreview} alt="Logo preview" className="h-16 object-contain rounded border" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, SVG (max 2MB)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      value={templateData.company_name}
                      onChange={(e) => setTemplateData({...templateData, company_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={templateData.primary_color}
                        onChange={(e) => setTemplateData({...templateData, primary_color: e.target.value})}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={templateData.primary_color}
                        onChange={(e) => setTemplateData({...templateData, primary_color: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="#2563eb"
                      />
                    </div>
                  </div>
                </div>
              </WidgetCard>

              {/* Template Features */}
              <WidgetCard title="Template Features">
                <div className="space-y-3">
                  {[
                    { key: 'include_compliance_checkboxes', label: 'Compliance Checkboxes', desc: 'Enable compliance status selection' },
                    { key: 'enable_comments', label: 'Enable Comments', desc: 'Allow auditor comments' },
                    { key: 'enable_notes', label: 'Enable Notes', desc: 'Allow personal notes' },
                    { key: 'enable_actions', label: 'Enable Actions', desc: 'Allow action documentation' }
                  ].map((feature) => (
                    <div key={feature.key} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={feature.key}
                        checked={templateData[feature.key as keyof typeof templateData] as boolean}
                        onChange={(e) => setTemplateData({ 
                          ...templateData, 
                          [feature.key]: e.target.checked 
                        })}
                        className="mt-1 rounded text-primary"
                      />
                      <div className="flex-1">
                        <label htmlFor={feature.key} className="text-sm font-medium cursor-pointer">
                          {feature.label}
                        </label>
                        <p className="text-xs text-gray-500">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>

            {/* Section Builder */}
            <div className="xl:col-span-2">
              <WidgetCard title="Section Builder">
                <div className="space-y-6">
                  {/* Section Management */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => addSection()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
                      >
                        + Custom Section
                      </button>
                      <button
                        onClick={() => setShowSectionTemplates(!showSectionTemplates)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        📋 Section Templates
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">{sections.length} sections</span>
                  </div>

                  {/* Section Templates */}
                  {showSectionTemplates && (
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <h4 className="font-medium mb-3">Choose a Section Template:</h4>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {predefinedSections.map((template, index) => (
                          <button
                            key={index}
                            onClick={() => addSection(template)}
                            className="text-left p-3 border border-gray-200 rounded-lg hover:bg-white hover:border-primary text-sm"
                          >
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sections List */}
                  {sections.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No sections yet</p>
                      <p className="text-sm text-gray-400">Start by adding a section or choose from templates</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sections.map((section) => (
                        <div key={section.id} className="border border-gray-200 dark:border-gray-600 rounded-lg">
                          {/* Section Header */}
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-4">
                                <input
                                  type="text"
                                  value={section.name}
                                  onChange={(e) => updateSection(section.id, { name: e.target.value })}
                                  className="text-lg font-medium bg-transparent border-none text-dark dark:text-white focus:outline-none focus:ring-0 w-full"
                                />
                                <input
                                  type="text"
                                  value={section.description}
                                  onChange={(e) => updateSection(section.id, { description: e.target.value })}
                                  placeholder="Section description..."
                                  className="text-sm bg-transparent border-none text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-0 w-full mt-1"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setActiveSection(section.id)}
                                  className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-hover"
                                >
                                  + Question
                                </button>
                                <button
                                  onClick={() => deleteSection(section.id)}
                                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Section Questions */}
                          <div className="p-4">
                            {section.items.length === 0 ? (
                              <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                                No questions in this section
                              </p>
                            ) : (
                              <div className="space-y-3">
                                {section.items.map((question, index) => (
                                  <div
                                    key={question.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                      activeQuestion === question.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setActiveQuestion(question.id)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-xs font-mono text-gray-500">
                                            {question.clauseReference || 'No ref'}
                                          </span>
                                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                            {question.type}
                                          </span>
                                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                            {question.itemType}
                                          </span>
                                          {question.required && (
                                            <span className="text-red-500 text-xs">Required</span>
                                          )}
                                        </div>
                                        <p className="text-sm text-dark dark:text-white font-medium">
                                          {question.title}
                                        </p>
                                        {question.description && (
                                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            {question.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex gap-1 ml-4">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            moveQuestion(section.id, question.id, "up");
                                          }}
                                          disabled={index === 0}
                                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                        >
                                          ↑
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            moveQuestion(section.id, question.id, "down");
                                          }}
                                          disabled={index === section.items.length - 1}
                                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                        >
                                          ↓
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            duplicateQuestion(section.id, question.id);
                                          }}
                                          className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                          📋
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteQuestion(section.id, question.id);
                                          }}
                                          className="p-1 text-red-400 hover:text-red-600"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </WidgetCard>

              {/* Question Types */}
              {activeSection && (
                <WidgetCard title="Add Questions">
                  <div className="grid grid-cols-2 gap-3">
                    {questionTypes.map((qType) => (
                      <button
                        key={qType.type}
                        onClick={() => addQuestion(activeSection, qType.type)}
                        className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-left transition-colors"
                      >
                        <span className="text-xl flex-shrink-0">{qType.icon}</span>
                        <div>
                          <div className="text-sm font-medium">{qType.label}</div>
                          <div className="text-xs text-gray-500">{qType.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </WidgetCard>
              )}
            </div>

            {/* Question Editor */}
            <div className="xl:col-span-1">
              <WidgetCard title="Question Editor">
                {activeQuestionData && activeSection ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Question Title</label>
                      <input
                        type="text"
                        value={activeQuestionData.title}
                        onChange={(e) => updateQuestion(activeSection, activeQuestionData.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Clause Reference</label>
                      <input
                        type="text"
                        value={activeQuestionData.clauseReference || ""}
                        onChange={(e) => updateQuestion(activeSection, activeQuestionData.id, { clauseReference: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g., 4.1, 5.2.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">ISO Clause</label>
                      <input
                        type="text"
                        value={activeQuestionData.isoClause || ""}
                        onChange={(e) => updateQuestion(activeSection, activeQuestionData.id, { isoClause: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g., 4.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Item Type</label>
                      <select
                        value={activeQuestionData.itemType || "REQUIREMENT"}
                        onChange={(e) => updateQuestion(activeSection, activeQuestionData.id, { itemType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="REQUIREMENT">Requirement</option>
                        <option value="PROCESS">Process</option>
                        <option value="DOCUMENT">Document</option>
                        <option value="RECORD">Record</option>
                        <option value="OBSERVATION">Observation</option>
                        <option value="CONTROL">Control</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Guidance (optional)</label>
                      <textarea
                        value={activeQuestionData.description || ""}
                        onChange={(e) => updateQuestion(activeSection, activeQuestionData.id, { description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={3}
                        placeholder="Provide guidance for auditors..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Actions Required</label>
                      <textarea
                        value={activeQuestionData.actions || ""}
                        onChange={(e) => updateQuestion(activeSection, activeQuestionData.id, { actions: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={2}
                        placeholder="What actions should be done for this question..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Question Settings</label>
                      {[
                        { key: 'required', label: 'Required question' },
                        { key: 'isMandatory', label: 'Mandatory for audit completion' },
                        { key: 'allowComments', label: 'Allow auditor comments' },
                        { key: 'allowNotes', label: 'Allow personal notes' },
                        { key: 'allowEvidenceUpload', label: 'Allow evidence upload' }
                      ].map((setting) => (
                        <label key={setting.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={activeQuestionData[setting.key as keyof Question] as boolean ?? false}
                            onChange={(e) => updateQuestion(activeSection, activeQuestionData.id, { 
                              [setting.key]: e.target.checked 
                            })}
                            className="rounded"
                          />
                          <span className="text-sm">{setting.label}</span>
                        </label>
                      ))}
                    </div>

                    {(activeQuestionData.type === "select" || activeQuestionData.type === "radio" || activeQuestionData.type === "checkbox") && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Options</label>
                        <div className="space-y-2">
                          {activeQuestionData.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(activeQuestionData.options || [])];
                                  newOptions[optIndex] = e.target.value;
                                  updateQuestion(activeSection, activeQuestionData.id, { options: newOptions });
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <button
                                onClick={() => {
                                  const newOptions = activeQuestionData.options?.filter((_, i) => i !== optIndex);
                                  updateQuestion(activeSection, activeQuestionData.id, { options: newOptions });
                                }}
                                className="px-3 py-2 text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newOptions = [...(activeQuestionData.options || []), `Option ${(activeQuestionData.options?.length || 0) + 1}`];
                              updateQuestion(activeSection, activeQuestionData.id, { options: newOptions });
                            }}
                            className="px-3 py-2 text-primary hover:text-primary-hover text-sm"
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Select a question to edit its properties</p>
                  </div>
                )}
              </WidgetCard>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}