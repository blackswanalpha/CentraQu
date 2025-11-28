"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { auditService, type AuditChecklist, type ChecklistItem, type ISOStandard } from "@/services/audit.service";
import Link from "next/link";

interface EditableChecklistItem extends ChecklistItem {
  actions_required?: string;
  allow_comments?: boolean;
  allow_notes?: boolean;
  allow_evidence_upload?: boolean;
  section_name?: string;
  subsection?: string;
  is_mandatory?: boolean;
  iso_clause?: string;
}

interface TemplateSection {
  id: string;
  name: string;
  description?: string;
  order: number;
  items: EditableChecklistItem[];
}

export default function TemplateEditPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  
  const [template, setTemplate] = useState<AuditChecklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isoStandards, setIsoStandards] = useState<ISOStandard[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iso_standard: '',
    company_name: '',
    header_content: '',
    footer_content: '',
    primary_color: '#2563eb',
    include_compliance_checkboxes: true,
    enable_comments: true,
    enable_notes: true,
    enable_actions: true
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    loadTemplate();
    loadISOStandards();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);
      const data = await auditService.getChecklist(parseInt(templateId));
      setTemplate(data);
      
      // Populate form data
      setFormData({
        title: data.title || '',
        description: data.description || '',
        iso_standard: data.iso_standard?.toString() || '',
        company_name: data.company_name || '',
        header_content: data.header_content || '',
        footer_content: data.footer_content || '',
        primary_color: data.primary_color || '#2563eb',
        include_compliance_checkboxes: data.include_compliance_checkboxes ?? true,
        enable_comments: data.enable_comments ?? true,
        enable_notes: data.enable_notes ?? true,
        enable_actions: data.enable_actions ?? true
      });

      // Set logo preview if exists
      if (data.logo_url) {
        setLogoPreview(data.logo_url);
      }
      
      // Group items into sections
      if (data.items) {
        const groupedSections = groupItemsIntoSections(data.items as EditableChecklistItem[]);
        setSections(groupedSections);
        
        // Set first section as active
        if (groupedSections.length > 0) {
          setActiveSection(groupedSections[0].id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load template");
    } finally {
      setIsLoading(false);
    }
  };

  const loadISOStandards = async () => {
    try {
      const response = await auditService.getISOStandards({ ordering: 'code' });
      setIsoStandards(response.results || []);
    } catch (err) {
      console.error('Failed to load ISO standards:', err);
    }
  };

  const groupItemsIntoSections = (items: EditableChecklistItem[]): TemplateSection[] => {
    const sectionMap = new Map<string, EditableChecklistItem[]>();
    
    items.forEach(item => {
      const sectionName = item.section_name || "General";
      if (!sectionMap.has(sectionName)) {
        sectionMap.set(sectionName, []);
      }
      sectionMap.get(sectionName)!.push(item);
    });

    return Array.from(sectionMap.entries()).map(([name, items], index) => ({
      id: `section-${index}`,
      name,
      description: '',
      order: index,
      items: items.sort((a, b) => (a.order || 0) - (b.order || 0))
    }));
  };

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

  const addSection = () => {
    const newSection: TemplateSection = {
      id: `section-${Date.now()}`,
      name: `New Section ${sections.length + 1}`,
      description: '',
      order: sections.length,
      items: []
    };
    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<TemplateSection>) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section and all its items?')) {
      setSections(sections.filter(section => section.id !== sectionId));
      if (activeSection === sectionId) {
        setActiveSection(sections[0]?.id || null);
      }
    }
  };

  const addItem = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newItem: EditableChecklistItem = {
      id: Date.now(), // Temporary ID for new items
      checklist: parseInt(templateId),
      clause_reference: '',
      iso_clause: '',
      item_type: 'REQUIREMENT',
      question: 'New checklist item',
      guidance: '',
      actions_required: '',
      allow_comments: true,
      allow_notes: true,
      allow_evidence_upload: true,
      section_name: section.name,
      subsection: '',
      is_mandatory: true,
      order: section.items.length
    };

    updateSection(sectionId, {
      items: [...section.items, newItem]
    });

    setActiveItem(newItem.id.toString());
  };

  const updateItem = (sectionId: string, itemId: number, updates: Partial<EditableChecklistItem>) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedItems = section.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    updateSection(sectionId, { items: updatedItems });
  };

  const deleteItem = (sectionId: string, itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const section = sections.find(s => s.id === sectionId);
      if (!section) return;

      const updatedItems = section.items.filter(item => item.id !== itemId);
      updateSection(sectionId, { items: updatedItems });

      if (activeItem === itemId.toString()) {
        setActiveItem(null);
      }
    }
  };

  const moveItem = (sectionId: string, itemId: number, direction: 'up' | 'down') => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const items = [...section.items];
    const index = items.findIndex(item => item.id === itemId);
    
    if (index === -1) return;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
    
    // Update order values
    items.forEach((item, idx) => {
      item.order = idx;
    });

    updateSection(sectionId, { items });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate form data
      if (!formData.title.trim()) {
        setError('Template title is required');
        return;
      }
      if (!formData.iso_standard) {
        setError('ISO standard is required');
        return;
      }

      // Prepare the data payload
      const payload = new FormData();
      
      // Add basic template data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value.toString());
        }
      });

      // Add logo if uploaded
      if (logoFile) {
        payload.append('logo', logoFile);
      }

      // Flatten all items from sections
      const allItems = sections.flatMap((section, sectionIndex) => 
        section.items.map((item, itemIndex) => ({
          ...item,
          section_name: section.name,
          order: sectionIndex * 1000 + itemIndex, // Ensure proper ordering across sections
        }))
      );

      // Add items data
      payload.append('items', JSON.stringify(allItems));

      // Update the template
      await auditService.updateChecklist(parseInt(templateId), payload);

      // Redirect back to template detail
      router.push(`/dashboard/audits/templates/${templateId}`);
    } catch (err) {
      console.error('Error saving template:', err);
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const activeItemData = activeItem && activeSection ? 
    sections.find(s => s.id === activeSection)?.items.find(i => i.id.toString() === activeItem) : null;

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
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/dashboard/audits/templates/${templateId}`} className="text-sm text-primary hover:underline mb-2 inline-block">
              ← Back to Template
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Edit Template
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Customize your audit template with sections, questions, and branding
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/audits/templates/${templateId}`}>
              <Button variant="secondary" disabled={isSaving}>
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Settings Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Template Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., ISO 9001 Stage 2 Checklist"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Describe the template purpose..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ISO Standard *
                  </label>
                  <select
                    value={formData.iso_standard}
                    onChange={(e) => setFormData({ ...formData, iso_standard: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
            </div>

            {/* Branding Settings */}
            <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Branding</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Logo
                  </label>
                  {logoPreview && (
                    <div className="mb-2">
                      <img src={logoPreview} alt="Logo preview" className="h-16 object-contain" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Template Features */}
            <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Features</h3>
              <div className="space-y-3">
                {[
                  { key: 'include_compliance_checkboxes', label: 'Compliance Checkboxes' },
                  { key: 'enable_comments', label: 'Enable Comments' },
                  { key: 'enable_notes', label: 'Enable Notes' },
                  { key: 'enable_actions', label: 'Enable Actions' }
                ].map((feature) => (
                  <label key={feature.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData[feature.key as keyof typeof formData] as boolean}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [feature.key]: e.target.checked 
                      })}
                      className="rounded text-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section Builder */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-dark dark:text-white">Sections</h3>
                  <Button onClick={addSection} size="sm">
                    + Add Section
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {sections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No sections yet. Add your first section.</p>
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
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => addItem(section.id)}
                              >
                                + Add Item
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => deleteSection(section.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Section Items */}
                        <div className="p-4">
                          {section.items.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                              No items in this section
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {section.items.map((item, index) => (
                                <div
                                  key={item.id}
                                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    activeItem === item.id.toString()
                                      ? 'border-primary bg-primary/5'
                                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                  }`}
                                  onClick={() => setActiveItem(item.id.toString())}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-mono text-gray-500">
                                          {item.clause_reference || 'No ref'}
                                        </span>
                                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                          {item.item_type}
                                        </span>
                                      </div>
                                      <p className="text-sm text-dark dark:text-white truncate">
                                        {item.question}
                                      </p>
                                    </div>
                                    <div className="flex gap-1 ml-4">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveItem(section.id, item.id, 'up');
                                        }}
                                        disabled={index === 0}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                      >
                                        ↑
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveItem(section.id, item.id, 'down');
                                        }}
                                        disabled={index === section.items.length - 1}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                      >
                                        ↓
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteItem(section.id, item.id);
                                        }}
                                        className="p-1 text-red-400 hover:text-red-600"
                                      >
                                        ×
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
            </div>
          </div>

          {/* Item Editor */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Item Editor</h3>
              
              {activeItemData && activeSection ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Clause Reference
                    </label>
                    <input
                      type="text"
                      value={activeItemData.clause_reference}
                      onChange={(e) => updateItem(activeSection, activeItemData.id, { clause_reference: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 4.1, 5.2.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ISO Clause
                    </label>
                    <input
                      type="text"
                      value={activeItemData.iso_clause || ''}
                      onChange={(e) => updateItem(activeSection, activeItemData.id, { iso_clause: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 4.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Item Type
                    </label>
                    <select
                      value={activeItemData.item_type}
                      onChange={(e) => updateItem(activeSection, activeItemData.id, { item_type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Question
                    </label>
                    <textarea
                      value={activeItemData.question}
                      onChange={(e) => updateItem(activeSection, activeItemData.id, { question: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Guidance
                    </label>
                    <textarea
                      value={activeItemData.guidance}
                      onChange={(e) => updateItem(activeSection, activeItemData.id, { guidance: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Provide guidance for auditors..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Actions Required
                    </label>
                    <textarea
                      value={activeItemData.actions_required || ''}
                      onChange={(e) => updateItem(activeSection, activeItemData.id, { actions_required: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Actions required for this item..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Item Settings
                    </label>
                    {[
                      { key: 'is_mandatory', label: 'Mandatory Item' },
                      { key: 'allow_comments', label: 'Allow Comments' },
                      { key: 'allow_notes', label: 'Allow Notes' },
                      { key: 'allow_evidence_upload', label: 'Allow Evidence Upload' }
                    ].map((setting) => (
                      <label key={setting.key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={activeItemData[setting.key as keyof EditableChecklistItem] as boolean ?? true}
                          onChange={(e) => updateItem(activeSection, activeItemData.id, { 
                            [setting.key]: e.target.checked 
                          })}
                          className="rounded text-primary"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Select an item to edit its properties
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}