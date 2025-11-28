'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Printer,
  Share2,
  RefreshCw,
  CheckSquare,
  Calendar,
  Hash,
  Type,
  FileText,
  List,
  Table,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ContractTemplate {
  id?: number;
  name: string;
  description: string;
  type: 'service' | 'maintenance' | 'consulting' | 'license';
  category: string;
  sections: any[];
  metadata?: {
    version: string;
    author: string;
    tags: string[];
  };
}

export function PreviewView({ template }: { template: ContractTemplate }) {
  const [showValidation, setShowValidation] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Sample data for preview
  const sampleData = {
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

  const renderField = (field: any, sectionId: string) => {
    const fieldId = `${sectionId}-${field.id}`;
    const value = formData[fieldId] || sampleData[field.label.toLowerCase().replace(/\s+/g, '-')] || '';

    const getFieldWidth = (width: string) => {
      switch (width) {
        case 'half': return 'w-1/2';
        case 'third': return 'w-1/3';
        case 'quarter': return 'w-1/4';
        default: return 'w-full';
      }
    };

    const fieldClasses = `${getFieldWidth(field.width || 'full')} pr-4 mb-4`;

    return (
      <div key={field.id} className={fieldClasses}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {field.label}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.type === 'text' || field.type === 'email' || field.type === 'phone' ? (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required={field.isRequired}
          />
        ) : field.type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required={field.isRequired}
          />
        ) : field.type === 'number' ? (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required={field.isRequired}
          />
        ) : field.type === 'date' ? (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required={field.isRequired}
          />
        ) : field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required={field.isRequired}
          >
            <option value="">Choose an option</option>
            {field.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => handleFieldChange(fieldId, e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {field.placeholder || 'Check this option'}
            </span>
          </label>
        ) : null}

        {field.helpText && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {field.helpText}
          </p>
        )}
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
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                showValidation
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
                {template.name || 'Contract Template'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {template.description || 'Professional Service Agreement'}
              </p>
              <div className="mt-4 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span>Type: {template.type}</span>
                <span>•</span>
                <span>Category: {template.category}</span>
                <span>•</span>
                <span>Version: {template.metadata?.version}</span>
              </div>
            </div>
          </div>

          {/* Template Sections */}
          <div className="space-y-8">
            {template.sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${
                  section.styling?.background ? 'bg-gray-50 dark:bg-gray-800 p-6 rounded-lg' : ''
                } ${section.styling?.border ? 'border border-gray-200 dark:border-gray-600 p-6 rounded-lg' : ''}`}
              >
                {/* Section Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-gray-400 text-lg">{index + 1}.</span>
                    {section.title}
                    {section.isRequired && <span className="text-red-500 text-sm">*</span>}
                  </h2>
                  {section.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {section.description}
                    </p>
                  )}
                </div>

                {/* Section Content */}
                {section.type === 'form' && (
                  <div className="flex flex-wrap -mr-4">
                    {section.fields?.map((field: any) => renderField(field, section.id))}
                  </div>
                )}

                {section.type === 'text' && (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {section.content || 'This is a text section. You can add any content here including terms, conditions, or other textual information.'}
                    </div>
                  </div>
                )}

                {section.type === 'table' && (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {section.tableColumns?.map((column: string, index: number) => (
                            <th key={index} className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((rowIndex) => (
                          <tr key={rowIndex} className="border-t border-gray-200 dark:border-gray-600">
                            {section.tableColumns?.map((_: string, colIndex: number) => (
                              <td key={colIndex} className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                                Sample data {rowIndex}-{colIndex + 1}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.type === 'list' && (
                  <ul className="space-y-2">
                    {section.listItems?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {template.sections.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No sections to preview
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Add some sections to your template to see the preview
              </p>
            </div>
          )}

          {/* Validation Summary */}
          {showValidation && template.sections.length > 0 && (
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
                      <li>• Total Sections: {template.sections.length}</li>
                      <li>• Required Sections: {template.sections.filter(s => s.isRequired).length}</li>
                      <li>• Form Fields: {template.sections.reduce((acc, s) => acc + (s.fields?.length || 0), 0)}</li>
                      <li>• Required Fields: {template.sections.reduce((acc, s) => acc + (s.fields?.filter((f: any) => f.isRequired).length || 0), 0)}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      Potential Issues
                    </h4>
                    <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                      {!template.name && <li>• Template name is missing</li>}
                      {!template.description && <li>• Template description is missing</li>}
                      {template.sections.length === 0 && <li>• No sections defined</li>}
                      {template.sections.some((s: any) => !s.title) && <li>• Some sections are missing titles</li>}
                      {template.sections.some((s: any) => s.type === 'form' && (!s.fields || s.fields.length === 0)) && <li>• Some form sections have no fields</li>}
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
  template: ContractTemplate; 
  onUpdateTemplate: (template: ContractTemplate) => void;
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

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !template.metadata?.tags?.includes(tag.trim())) {
      handleMetadataUpdate('tags', [...(template.metadata?.tags || []), tag.trim()]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    handleMetadataUpdate('tags', template.metadata?.tags?.filter(tag => tag !== tagToRemove) || []);
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
                value={template.name}
                onChange={(e) => onUpdateTemplate({ ...template, name: e.target.value })}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Type
                </label>
                <select
                  value={template.type}
                  onChange={(e) => onUpdateTemplate({ ...template, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="service">Service Agreement</option>
                  <option value="maintenance">Maintenance Contract</option>
                  <option value="consulting">Consulting Agreement</option>
                  <option value="license">License Agreement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={template.category}
                  onChange={(e) => onUpdateTemplate({ ...template, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Professional Services"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Metadata
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={template.metadata?.version || '1.0.0'}
                  onChange={(e) => handleMetadataUpdate('version', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="1.0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={template.metadata?.author || 'System'}
                  onChange={(e) => handleMetadataUpdate('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {template.metadata?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="text-primary/60 hover:text-primary"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Type a tag and press Enter"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Press Enter to add tags. Use tags to categorize and find templates easily.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Import/Export */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Import/Export
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Download className="h-4 w-4" />
                Export Template
              </button>

              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <RefreshCw className="h-4 w-4" />
                Import Template
              </button>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Template JSON Structure
              </h4>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Templates can be exported as JSON files and imported into other instances. 
                This allows for easy sharing and backup of template configurations.
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Advanced Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Enable Auto-Save
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically save changes as you work
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                defaultChecked
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Strict Validation
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enforce all validation rules when generating contracts
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                defaultChecked
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Allow Public Access
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Make this template available to all users
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}