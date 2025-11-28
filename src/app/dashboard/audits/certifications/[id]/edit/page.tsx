"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use } from "react";
import { useRouter } from "next/navigation";

export default function EditCertificationTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [templateContent, setTemplateContent] = useState(`
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; border: 3px solid #1e40af; position: relative;">
      <!-- Header Section -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1e40af; font-size: 28px; font-weight: bold; margin-bottom: 4px; letter-spacing: 1px;">
          AceQu International
        </h1>
        <div style="border-top: 2px solid #1e40af; width: 100px; margin: 8px auto;"></div>
      </div>

      <!-- Certificate Title -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px; letter-spacing: 2px;">CERTIFICATE</h2>
        <p style="font-size: 16px; color: #374151; font-weight: 500;">of Registration</p>
      </div>

      <!-- Introduction Text -->
      <div style="margin-bottom: 25px;">
        <p style="text-align: center; color: #374151; font-size: 15px; margin-bottom: 12px;">This certificate is issued to</p>
      </div>

      <!-- Client Name -->
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 8px; display: inline-block; min-width: 400px;">
          <p style="font-size: 24px; font-weight: bold; color: #1e40af;">[CLIENT_NAME]</p>
        </div>
        <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">[CLIENT_LOCATION]</p>
      </div>

      <!-- Certification Statement -->
      <div style="margin-bottom: 25px;">
        <p style="text-align: center; color: #374151; font-size: 14px; line-height: 1.6;">
          AceQu International Ltd – UK Certifies that the Management System of the above organisation has been audited and found to be in accordance with the requirements of the management system standards detailed below:
        </p>
      </div>

      <!-- ISO Standard -->
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="background-color: #eff6ff; border: 2px solid #1e40af; padding: 15px; display: inline-block; min-width: 300px;">
          <p style="font-weight: bold; font-size: 22px; color: #1e40af; margin-bottom: 4px;">[CERTIFICATION_STANDARD]</p>
          <p style="font-size: 14px; color: #374151;">Quality Management System</p>
        </div>
      </div>

      <!-- Scope Section -->
      <div style="margin-bottom: 25px;">
        <p style="font-weight: bold; font-size: 15px; color: #1f2937; margin-bottom: 8px;">Scope of Certification</p>
        <p style="color: #374151; font-size: 14px; line-height: 1.5;">[AUDIT_SCOPE]</p>
      </div>

      <!-- Certificate Details Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 30px; font-size: 14px;">
        <div style="padding: 8px; background-color: #f9fafb;">
          <strong style="color: #1f2937;">Certification Number:</strong>
          <p style="color: #374151; margin-top: 4px;">[CERTIFICATE_NUMBER]</p>
        </div>
        <div style="padding: 8px; background-color: #f9fafb;">
          <strong style="color: #1f2937;">Date of original registration:</strong>
          <p style="color: #374151; margin-top: 4px;">[ORIGINAL_REGISTRATION_DATE]</p>
        </div>
        <div style="padding: 8px; background-color: #f9fafb;">
          <strong style="color: #1f2937;">Date of certificate:</strong>
          <p style="color: #374151; margin-top: 4px;">[ISSUE_DATE]</p>
        </div>
        <div style="padding: 8px; background-color: #f9fafb;">
          <strong style="color: #1f2937;">Date of certificate expiry:</strong>
          <p style="color: #374151; margin-top: 4px;">[EXPIRY_DATE]</p>
        </div>
      </div>

      <!-- Accreditation Logos Section -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-flex; gap: 30px; align-items: center; justify-content: center;">
          <div style="text-align: center;">
            <p style="font-weight: bold; font-size: 12px; color: #1e40af;">CQI IRCA</p>
            <p style="font-size: 10px; color: #6b7280;">LEADING QUALITY FOR 100 YEARS</p>
            <p style="font-size: 10px; color: #6b7280; font-weight: bold;">CORPORATE MEMBER</p>
          </div>
        </div>
      </div>

      <!-- Signature Section -->
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="border-top: 2px solid #1f2937; width: 200px; margin: 0 auto 8px;"></div>
        <p style="font-weight: bold; font-size: 14px; color: #1f2937;">Authorised Signatory</p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; font-size: 11px; color: #6b7280; line-height: 1.5; border-top: 1px solid #d1d5db; padding-top: 15px;">
        <p style="margin-bottom: 8px; font-weight: 500;">AceQu International Ltd, 168 City Road, Cardiff, Wales, CF24 3JE, United Kingdom</p>
        <p style="margin-bottom: 4px;">This certificate is the property of AceQu International Limited and should be returned back upon request.</p>
        <p>The certificate cannot be transferred and is valid for the client, address and scope stated above.</p>
      </div>
    </div>
  `);

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

  const handleSave = () => {
    // Save template logic
    console.log("Saving template content:", templateContent);
    router.push(`/dashboard/audits/certifications/${resolvedParams.id}`);
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
                  >
                    <option value="1">8pt</option>
                    <option value="2">10pt</option>
                    <option value="3" selected>12pt</option>
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
                    contentEditable
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
        </div>
      </div>
    </DashboardLayout>
  );
}