"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { certificateService, CertificateTemplate, UpdateTemplateData } from "@/services/certificate.service";
import { auditService } from "@/services/audit.service";

export default function EditCertificationTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [templateContent, setTemplateContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templateDetails, setTemplateDetails] = useState<CertificateTemplate | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const originalId = await resolvedParams.id;
        let targetTemplateId = originalId;

        // Always try to resolve as Certification ID first since we are in the certifications route
        try {
          console.log(`Attempting to resolve ID ${originalId} as Certification...`);
          const certification = await certificateService.getCertification(originalId);
          console.log("Found Certification:", certification);

          if (certification.template) {
            // Handle both object (populated) and primitive (ID only) template references
            if (typeof certification.template === 'object' && 'id' in certification.template) {
              targetTemplateId = certification.template.id;
              console.log(`Resolved Template ID from Certification (Object): ${targetTemplateId}`);
            } else {
              targetTemplateId = String(certification.template);
              console.log(`Resolved Template ID from Certification (ID): ${targetTemplateId}`);
            }
          } else if (certification.iso_standard) {
            // If no template assigned, try to find default template for ISO Standard
            const isoStandardId = typeof certification.iso_standard === 'object' ? certification.iso_standard.id : certification.iso_standard;

            const templatesResponse = await certificateService.getTemplates({
              iso_standard: isoStandardId,
              is_default: true
            });

            if (templatesResponse.results && templatesResponse.results.length > 0) {
              targetTemplateId = templatesResponse.results[0].id;
              console.log(`Resolved Default Template ID for ISO ${isoStandardId}: ${targetTemplateId}`);
            } else {
              // Fallback: Try to find ANY template for this ISO standard
              const anyTemplateResponse = await certificateService.getTemplates({
                iso_standard: isoStandardId
              });
              if (anyTemplateResponse.results && anyTemplateResponse.results.length > 0) {
                targetTemplateId = anyTemplateResponse.results[0].id;
                console.log(`Resolved (Fallback) Template ID for ISO ${isoStandardId}: ${targetTemplateId}`);
              } else {
                throw new Error(`No templates found for ISO Standard ${isoStandardId}`);
              }
            }
          } else {
            throw new Error("Certification has no template and no ISO Standard assigned");
          }
        } catch (certErr) {
          console.warn("Failed to resolve as Certification:", certErr);

          // Fallback: Try Audit logic just in case the ID passed is an Audit ID
          try {
            console.log(`Attempting fallback to resolve ID ${originalId} as Audit ID...`);
            const audit = await auditService.getAudit(originalId);
            console.log("Found Audit:", audit);

            // Try to find Certification for this Audit
            if (audit.certificate_number) {
              const certsResponse = await certificateService.getCertifications({
                search: audit.certificate_number
              });

              if (certsResponse.results && certsResponse.results.length > 0) {
                const certification = certsResponse.results[0];
                console.log("Found Certification via Audit:", certification);

                if (certification.template) {
                  if (typeof certification.template === 'object' && 'id' in certification.template) {
                    targetTemplateId = certification.template.id;
                  } else {
                    targetTemplateId = String(certification.template);
                  }
                  console.log(`Resolved Template ID from Certification (via Audit): ${targetTemplateId}`);
                } else if (certification.iso_standard) {
                  // Default template logic
                  const isoStandardId = typeof certification.iso_standard === 'object' ? certification.iso_standard.id : certification.iso_standard;
                  const templatesResponse = await certificateService.getTemplates({
                    iso_standard: isoStandardId,
                    is_default: true
                  });
                  if (templatesResponse.results && templatesResponse.results.length > 0) {
                    targetTemplateId = templatesResponse.results[0].id;
                  } else {
                    // Any template fallback
                    const anyTemplateResponse = await certificateService.getTemplates({ iso_standard: isoStandardId });
                    if (anyTemplateResponse.results && anyTemplateResponse.results.length > 0) {
                      targetTemplateId = anyTemplateResponse.results[0].id;
                    }
                  }
                }
              }
            }

            // If we still don't have a template ID but found an audit, maybe we can use the audit's ISO standard directly
            if (targetTemplateId === originalId && audit.iso_standard) {
              const templatesResponse = await certificateService.getTemplates({
                iso_standard: audit.iso_standard,
                is_default: true
              });
              if (templatesResponse.results && templatesResponse.results.length > 0) {
                targetTemplateId = templatesResponse.results[0].id;
              }
            }

          } catch (auditErr) {
            console.warn("Audit fallback also failed:", auditErr);
            // Final fallback: Assume it's a template ID
            console.log(`Assuming ID ${originalId} is directly a Template ID`);
            targetTemplateId = originalId;
          }
        }

        setTemplateId(targetTemplateId);
        const data = await certificateService.getTemplate(targetTemplateId);
        setTemplateDetails(data);

        if (data.template_type === 'html' && data.template_file) {
          // Assuming data.template_file provides a URL to the template content
          // We need to fetch the content from that URL
          // Construct full URL if data.template_file is relative
          const templateFileUrl = data.template_file.startsWith('http')
            ? data.template_file
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}${data.template_file}`;

          const response = await fetch(templateFileUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch template content: ${response.statusText}`);
          }
          const htmlContent = await response.text();
          setTemplateContent(htmlContent);
        } else if (data.template_type === 'html') {
          // If it's an HTML template type but no file is attached, start with empty content
          setTemplateContent('');
        } else {
          setTemplateContent(`<!-- Template type ${data.template_type} is not directly editable as HTML. Please choose an HTML template. -->`);
        }
      } catch (err) {
        console.error("Failed to fetch template:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes("Not found")) {
          setError(`Template not found. Please check if the ID '${resolvedParams.id}' is correct. If using an Audit ID, ensure the audit exists.`);
        } else {
          setError(`Failed to load template: ${errorMessage}`);
        }
        setTemplateContent(`<!-- Error loading template. Please check console for details. -->`);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [resolvedParams.id]);

  const [completionStatus, setCompletionStatus] = useState({
    header: true,
    body: true,
    footer: true,
    formatting: false,
    variables: true,
  });

  const [activeFormat, setActiveFormat] = useState<string[]>([]);

  const applyFormat = (format: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      document.execCommand(format, false, '');
      if (activeFormat.includes(format)) {
        setActiveFormat(activeFormat.filter(f => f !== format));
      } else {
        setActiveFormat([...activeFormat, format]);
      }
    }
  };

  const insertVariable = (variable: string) => {
    const editor = document.getElementById('template-editor');
    if (editor) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(`[${variable}]`));
        selection.removeAllRanges();
      }
    }
  };

  const handleSave = async () => {
    if (!templateDetails) {
      setError("No template loaded to save.");
      return;
    }

    try {
      setLoading(true);

      if (!templateId) {
        throw new Error("No template ID available for saving");
      }

      // Validate required fields before making API call
      if (!templateDetails.name || !templateDetails.name.trim()) {
        throw new Error("Template name is required and cannot be empty");
      }

      if (!templateContent || !templateContent.trim()) {
        throw new Error("Template content is required and cannot be empty");
      }

      // Convert HTML string to a File-like Blob
      const htmlBlob = new Blob([templateContent], { type: 'text/html' });
      const htmlFile = new File([htmlBlob], `${templateDetails.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`, { type: 'text/html' });

      // Double-check that we have valid data before API call
      const updateData: UpdateTemplateData = {
        name: templateDetails.name,
        description: templateDetails.description || '',
        iso_standard: templateDetails.iso_standard?.id,
        template_type: 'html', // Assuming we are only editing HTML templates here
        template_file: htmlFile,
        variables: templateDetails.variables || {},
        is_active: templateDetails.is_active ?? true,
        is_default: templateDetails.is_default ?? false,
      };

      console.log("Saving template with data:", {
        name: updateData.name,
        description: updateData.description,
        iso_standard: updateData.iso_standard,
        template_type: updateData.template_type,
        has_template_file: !!updateData.template_file,
        template_file_size: updateData.template_file?.size || 0
      });

      await certificateService.updateTemplate(templateId, updateData);
      console.log("Template saved successfully!");
      
      // Show success message
      alert("Template saved successfully!");
      
      const originalId = await resolvedParams.id;
      router.push(`/dashboard/audits/certifications/${originalId}`);
    } catch (err) {
      console.error("Failed to save template:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to save template: ${errorMessage}`);
      
      // Show user-friendly error
      if (errorMessage.includes("name") && errorMessage.includes("required")) {
        alert("Please provide a template name before saving.");
      } else if (errorMessage.includes("template_file") && errorMessage.includes("required")) {
        alert("Template content is required. Please add some content to the template.");
      } else {
        alert(`Failed to save template: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const completed = Object.values(completionStatus).filter(Boolean).length;
    return Math.round((completed / Object.keys(completionStatus).length) * 100);
  };

  const formatButtons = [
    { id: 'bold', label: 'B', command: 'bold', title: 'Bold' },
    { id: 'italic', label: 'I', command: 'italic', title: 'Italic' },
    { id: 'underline', label: 'U', command: 'underline', title: 'Underline' },
    { id: 'justifyLeft', label: '⬅', command: 'justifyLeft', title: 'Align Left' },
    { id: 'justifyCenter', label: '⬌', command: 'justifyCenter', title: 'Align Center' },
    { id: 'justifyRight', label: '➡', command: 'justifyRight', title: 'Align Right' },
  ];

  const templateVariables = [
    'CLIENT_NAME',
    'CLIENT_LOCATION',
    'REGISTRATION_NUMBER',
    'CERTIFICATION_STANDARD',
    'AUDIT_SCOPE',
    'ORIGINAL_REGISTRATION_DATE',
    'ISSUE_DATE',
    'EXPIRY_DATE',
    'CERTIFICATE_NUMBER',
    'LEAD_AUDITOR',
    'CERTIFICATION_MANAGER'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="text-primary hover:text-primary-hover mb-2"
            >
              ← Back to Certificate Details
            </button>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Edit Certificate Template
            </h1>
            <p className="mt-1 text-body-base text-gray-600 dark:text-gray-400">
              Customize the certificate template with rich text editing
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
            >
              Cancel
            </button>
            <button 
              onClick={() => router.push(`/dashboard/audits/certifications/${resolvedParams.id}`)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
            >
              Use New Editor
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Preview
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Save Template
            </button>
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-4">
          {error && (
            <div className="lg:col-span-4 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              {error}
            </div>
          )}
          {loading ? (
            <div className="lg:col-span-4 p-4 text-center text-lg text-gray-600 dark:text-gray-400">
              Loading template...
            </div>
          ) : (
            <>
              {/* Rich Text Editor */}
              <div className="lg:col-span-3">
                <WidgetCard title="Template Editor">
                  <div className="space-y-4">
                    {/* Formatting Toolbar */}
                    <div className="flex gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="flex gap-1">
                        {formatButtons.map((button) => (
                          <button
                            key={button.id}
                            onClick={() => applyFormat(button.command)}
                            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${activeFormat.includes(button.command)
                              ? 'bg-primary text-white'
                              : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            title={button.title}
                          >
                            {button.label}
                          </button>
                        ))}
                      </div>

                      <div className="border-l border-gray-300 dark:border-gray-600 mx-2"></div>

                      <select
                        className="px-3 py-2 border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600"
                        onChange={(e) => document.execCommand('fontSize', false, e.target.value)}
                        defaultValue="3"
                      >
                        <option value="1">8pt</option>
                        <option value="2">10pt</option>
                        <option value="3">12pt</option>
                        <option value="4">14pt</option>
                        <option value="5">18pt</option>
                        <option value="6">24pt</option>
                        <option value="7">36pt</option>
                      </select>

                      <input
                        type="color"
                        className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                        onChange={(e) => document.execCommand('foreColor', false, e.target.value)}
                        title="Text Color"
                      />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div
                        id="template-editor"
                        ref={(el) => {
                          if (el && !el.innerHTML) {
                            el.innerHTML = templateContent;
                          }
                        }}
                        contentEditable={true}
                        className="min-h-[600px] p-6 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        onBlur={(e) => setTemplateContent(e.currentTarget.innerHTML)}
                        onInput={(e) => setTemplateContent(e.currentTarget.innerHTML)}
                        suppressContentEditableWarning={true}
                      />
                    </div>
                  </div>
                </WidgetCard>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Template Completion */}
                <WidgetCard title="Template Completion">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Progress</span>
                      <span className="text-lg font-bold text-primary">{calculateProgress()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress()}%` }}
                      />
                    </div>

                    <div className="space-y-3 mt-4">
                      {Object.entries(completionStatus).map(([key, completed]) => (
                        <div key={key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={completed}
                            onChange={(e) => setCompletionStatus({
                              ...completionStatus,
                              [key]: e.target.checked
                            })}
                            className="rounded"
                          />
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          {completed && <span className="text-green-500 text-sm">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </WidgetCard>

                {/* Template Variables */}
                <WidgetCard title="Template Variables">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Click to insert variables into your template:
                    </p>
                    {templateVariables.map((variable) => (
                      <button
                        key={variable}
                        onClick={() => insertVariable(variable)}
                        className="w-full text-left px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        [{variable}]
                      </button>
                    ))}
                  </div>
                </WidgetCard>

                {/* Template Actions */}
                <WidgetCard title="Template Actions">
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                      🔄 Reset to Default
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                      📥 Import Template
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                      💾 Export Template
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                      📧 Send for Review
                    </button>
                  </div>
                </WidgetCard>

                {/* Template History */}
                <WidgetCard title="Edit History">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Template created</span>
                      <span className="text-gray-500">Oct 24, 09:15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Header modified</span>
                      <span className="text-gray-500">Oct 24, 10:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Variables added</span>
                      <span className="text-gray-500">Oct 24, 11:45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current edit</span>
                      <span className="text-green-600">Now</span>
                    </div>
                  </div>
                </WidgetCard>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}