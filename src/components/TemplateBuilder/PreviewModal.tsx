"use client";

import React from 'react';
import { X, Download, Upload } from 'lucide-react';
import { Template, TemplateItem, FormElement } from '@/services/template.service';

interface PreviewModalProps {
    template: Template;
    onClose: () => void;
    onDownloadPDF: () => void;
}

// Helper function to substitute variables with sample values
const substituteVariables = (content: string, template: Template): string => {
    const sampleVariables: Record<string, string> = {
        client_name: 'John Doe',
        contract_date: new Date().toLocaleDateString(),
        company_name: 'ABC Corporation',
        contract_amount: '$10,000',
        amount: '$10,000',
        service_description: 'Professional consulting services',
        payment_schedule: 'Monthly payments',
        start_date: new Date().toLocaleDateString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        signature_date: new Date().toLocaleDateString(),
        audit_date: new Date().toLocaleDateString(),
        inspector_name: 'Jane Smith',
        site_location: '123 Business Street'
    };
    
    // Add template-specific variables if they exist
    if (template.metadata?.variables) {
        template.metadata.variables.forEach(variable => {
            if (!sampleVariables[variable.name]) {
                switch (variable.type) {
                    case 'date':
                        sampleVariables[variable.name] = new Date().toLocaleDateString();
                        break;
                    case 'currency':
                        sampleVariables[variable.name] = '$1,000';
                        break;
                    case 'number':
                        sampleVariables[variable.name] = '100';
                        break;
                    default:
                        sampleVariables[variable.name] = `Sample ${variable.name.replace('_', ' ')}`;
                }
            }
        });
    }
    
    let result = content;
    Object.entries(sampleVariables).forEach(([key, value]) => {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    
    return result;
};

export const PreviewModal: React.FC<PreviewModalProps> = ({
    template,
    onClose,
    onDownloadPDF
}) => {
    const renderPreviewItem = (item: TemplateItem | FormElement) => {
        const isTemplateItem = 'type' in item && ['text', 'multiple_choice', 'dropdown', 'rating', 'date', 'file', 'image', 'instruction', 'rich_text'].includes(item.type);
        
        if (isTemplateItem) {
            const templateItem = item as TemplateItem;
            switch (templateItem.type) {
                case 'text':
                    return (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {templateItem.label}
                                {templateItem.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <input
                                type="text"
                                placeholder={templateItem.placeholder || "Sample text input"}
                                className="w-full rounded-md border-gray-300 bg-gray-50 text-sm p-3"
                                value="Sample response"
                                readOnly
                            />
                        </div>
                    );
                case 'multiple_choice':
                    return (
                        <div className="mb-6">
                            <p className="font-medium text-gray-900 mb-3">{templateItem.label}</p>
                            <div className="space-y-2">
                                {templateItem.options?.map((option, optIndex) => (
                                    <label key={optIndex} className="flex items-center gap-2">
                                        <input 
                                            type="radio" 
                                            name={`preview-${templateItem.id}`} 
                                            className="form-radio text-blue-600"
                                            defaultChecked={optIndex === 0}
                                            disabled
                                        />
                                        <span className="text-sm text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                case 'dropdown':
                    return (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {templateItem.label}
                            </label>
                            <select className="w-full rounded-md border-gray-300 bg-gray-50 text-sm p-3" disabled>
                                <option>{templateItem.options?.[0] || "Sample option"}</option>
                            </select>
                        </div>
                    );
                case 'rating':
                    return (
                        <div className="mb-6">
                            <p className="font-medium text-gray-900 mb-3">{templateItem.label}</p>
                            <div className="flex gap-2">
                                {Array.from({ length: templateItem.rating_scale || 5 }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                                            i < 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'
                                        }`}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                case 'date':
                    return (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {templateItem.label}
                            </label>
                            <input
                                type="date"
                                className="w-full rounded-md border-gray-300 bg-gray-50 text-sm p-3"
                                value={new Date().toISOString().split('T')[0]}
                                readOnly
                            />
                        </div>
                    );
                case 'file':
                    return (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {templateItem.label}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">sample-document.pdf uploaded</p>
                            </div>
                        </div>
                    );
                case 'rich_text':
                    let content = templateItem.rich_content || templateItem.label;
                    content = substituteVariables(content, template);
                    
                    return (
                        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        </div>
                    );
                case 'instruction':
                    return (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">{templateItem.label}</p>
                        </div>
                    );
                default:
                    return (
                        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                            <p className="text-sm text-gray-600">
                                {templateItem.type}: {templateItem.label}
                            </p>
                        </div>
                    );
            }
        }
        
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Template Preview</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-3xl mx-auto bg-white">
                        {/* Template Title */}
                        <div className="mb-8 text-center border-b border-gray-200 pb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{template.title}</h1>
                            {template.description && (
                                <p className="text-gray-600">{template.description}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                Generated on {new Date().toLocaleDateString()}
                            </p>
                        </div>

                        {/* Pages Content */}
                        {template.pages.map((page, pageIndex) => (
                            <div key={page.id} className="mb-12">
                                {template.pages.length > 1 && (
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                                        {page.title}
                                    </h2>
                                )}
                                
                                {/* Page content */}
                                {page.content && (
                                    <div className="mb-6 prose max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: substituteVariables(page.content, template) }} />
                                    </div>
                                )}

                                {/* Sections */}
                                {page.sections.map((section, sectionIndex) => (
                                    <div key={section.id} className="mb-8">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                                            {section.description && (
                                                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                                            )}
                                        </div>
                                        
                                        {/* Section template content */}
                                        {section.template_content && (
                                            <div className="mb-4 prose max-w-none">
                                                <div dangerouslySetInnerHTML={{ __html: substituteVariables(section.template_content, template) }} />
                                            </div>
                                        )}

                                        {/* Section items */}
                                        <div className="space-y-4">
                                            {section.items.map((item, itemIndex) => (
                                                <div key={item.id || itemIndex}>
                                                    {renderPreviewItem(item)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {template.pages.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No content to preview yet. Add some sections and components to see a preview.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};