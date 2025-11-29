'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Printer,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Template, TemplatePage, VisualSection, TemplateItem, FormElement } from '@/services/template.service';

export function PreviewView({ template }: { template: Template }) {
  const [showValidation, setShowValidation] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Sample data for preview
  const sampleData: Record<string, string> = {
    'client-name': 'Acme Corporation',
    'contract-date': '2024-12-01',
    'contract-value': '50000',
    'service-description': 'ISO 9001:2015 Certification Audit Services',
    'project-manager': 'John Smith',
    'audit-location': '123 Business St, Corporate City, CC 12345',
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const renderItem = (item: TemplateItem | FormElement, sectionId: string) => {
    // Simple rendering for preview
    const isFormElement = 'name' in item; // FormElement has name, TemplateItem doesn't necessarily
    const label = item.label;
    const id = item.id;
    const fieldId = `${sectionId}-${id}`;
    const value = formData[fieldId] || '';
    const placeholder = (item as any).placeholder || '';
    const required = item.required;

    return (
      <div key={id} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(fieldId, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
    );
  };

  const renderSection = (section: VisualSection, index: number) => {
    return (
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6"
        style={{
          ...section.style,
          position: 'relative', // Override absolute positioning for preview flow
          left: 'auto',
          top: 'auto',
          width: '100%',
          height: 'auto'
        }}
      >
        <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
        {section.description && <p className="text-gray-600 dark:text-gray-400 mb-4">{section.description}</p>}

        {section.items.map(item => renderItem(item, section.id))}
      </motion.div>
    );
  };

  const renderPage = (page: TemplatePage, index: number) => {
    return (
      <div key={page.id} className="mb-12">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          {page.title}
        </h2>
        <div dangerouslySetInnerHTML={{ __html: page.content }} className="prose dark:prose-invert max-w-none mb-6" />

        {page.sections.map((section, sIndex) => renderSection(section, sIndex))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Preview Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Template Preview
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              See how your template will look to users
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowValidation(!showValidation)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${showValidation
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {showValidation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showValidation ? 'Hide' : 'Show'} Validation
            </button>

            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Printer className="h-4 w-4" />
              Print
            </button>

            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Contract Header */}
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {template.title || 'Contract Template'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {template.description || 'Professional Service Agreement'}
              </p>
              <div className="mt-4 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span>Type: {template.type}</span>
                <span>•</span>
                <span>Version: {template.metadata?.version || '1.0.0'}</span>
              </div>
            </div>
          </div>

          {/* Template Pages */}
          <div className="space-y-8">
            {template.pages.map((page, index) => renderPage(page, index))}
          </div>

          {/* Empty State */}
          {template.pages.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No pages to preview
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Add some pages and sections to your template to see the preview
              </p>
            </div>
          )}

          {/* Validation Summary */}
          {showValidation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Validation Summary
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      Template Statistics
                    </h4>
                    <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                      <li>• Total Pages: {template.pages.length}</li>
                      <li>• Total Sections: {template.pages.reduce((acc, p) => acc + p.sections.length, 0)}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SettingsView({
  template,
  onUpdateTemplate
}: {
  template: Template;
  onUpdateTemplate: (template: Template) => void;
}) {
  const handleMetadataUpdate = (key: string, value: any) => {
    onUpdateTemplate({
      ...template,
      metadata: {
        ...template.metadata,
        [key]: value,
      },
    });
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Template Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure template metadata and advanced settings
          </p>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={template.title}
                onChange={(e) => onUpdateTemplate({ ...template, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Enter template name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={template.description}
                onChange={(e) => onUpdateTemplate({ ...template, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Describe what this template is used for"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}