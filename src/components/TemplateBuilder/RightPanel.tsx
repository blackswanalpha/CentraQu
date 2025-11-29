"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Settings as SettingsIcon, Code2 } from 'lucide-react';
import { Template, TemplateItem, FormElement, FormElementType, TemplateSettings } from '@/services/template.service';

interface RightPanelProps {
    selectedItem: { pageIndex: number; sectionIndex: number; itemIndex: number } | null;
    template: Template;
    onUpdateItem: (pageIndex: number, sectionIndex: number, itemIndex: number, updates: Partial<TemplateItem>) => void;
    onUpdateTemplate: (updates: Partial<Template>) => void;
    onClose: () => void;
    onAddFormElement: (type: FormElementType) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
    selectedItem,
    template,
    onUpdateItem,
    onUpdateTemplate,
    onClose,
    onAddFormElement
}) => {
    const [activeTab, setActiveTab] = useState<'properties' | 'settings' | 'variables' | 'contract_details'>('settings');
    const [templateVariables, setTemplateVariables] = useState<string[]>(
        template.metadata?.variables?.map(v => v.name) || ['client_name', 'contract_date', 'company_name', 'amount']
    );

    useEffect(() => {
        if (selectedItem) {
            setActiveTab('properties');
        } else if (template.type === 'contract') {
            setActiveTab('contract_details');
        } else {
            setActiveTab('settings');
        }
    }, [selectedItem, template.type]);

    const getSelectedItemData = () => {
        if (!selectedItem) return null;
        const { pageIndex, sectionIndex, itemIndex } = selectedItem;
        const page = template.pages[pageIndex];
        if (!page || !page.sections[sectionIndex]) return null;
        
        const section = page.sections[sectionIndex];
        if (itemIndex === -1) {
            return { type: 'section', data: section };
        }
        
        const item = section.items[itemIndex];
        return item ? { type: 'item', data: item } : null;
    };

    const selectedData = getSelectedItemData();
    const isItem = selectedData?.type === 'item';
    const isSection = selectedData?.type === 'section';

    const addVariable = () => {
        const name = prompt('Enter variable name (letters, numbers, underscore only):');
        if (name && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name) && !templateVariables.includes(name)) {
            const newVariables = [...templateVariables, name];
            setTemplateVariables(newVariables);
            
            const updatedMetadata = {
                ...template.metadata,
                variables: newVariables.map(v => ({ name: v, description: '', type: 'text' }))
            };
            
            onUpdateTemplate({ metadata: updatedMetadata });
        } else if (name) {
            alert('Invalid variable name or variable already exists. Use letters, numbers, and underscores only.');
        }
    };

    const removeVariable = (variableName: string) => {
        const newVariables = templateVariables.filter(v => v !== variableName);
        setTemplateVariables(newVariables);
        
        const updatedMetadata = {
            ...template.metadata,
            variables: newVariables.map(v => ({ name: v, description: '', type: 'text' }))
        };
        
        onUpdateTemplate({ metadata: updatedMetadata });
    };

    const insertVariableIntoEditor = (variableName: string) => {
        // This would integrate with a rich text editor
        const variableText = `{${variableName}}`;
        // For now, just copy to clipboard
        navigator.clipboard.writeText(variableText).then(() => {
            alert(`Variable ${variableText} copied to clipboard!`);
        });
    };

    const renderItemProperties = () => {
        if (!isItem || !selectedData?.data || !selectedItem) return null;
        
        const item = selectedData.data as TemplateItem;
        const { pageIndex, sectionIndex, itemIndex } = selectedItem;

        const updateCurrentItem = (updates: Partial<TemplateItem>) => {
            onUpdateItem(pageIndex, sectionIndex, itemIndex, updates);
        };

        return (
            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Question Text
                    </label>
                    <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm"
                        rows={3}
                        value={item.label}
                        onChange={(e) => updateCurrentItem({ label: e.target.value })}
                    />
                </div>

                {item.type === 'text' && (
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Placeholder Text
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                            value={item.placeholder || ''}
                            onChange={(e) => updateCurrentItem({ placeholder: e.target.value })}
                        />
                    </div>
                )}

                {(item.type === 'multiple_choice' || item.type === 'dropdown') && (
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Answer Options
                        </label>
                        <div className="mt-2 space-y-2">
                            {item.options?.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                                        value={option}
                                        onChange={(e) => {
                                            const newOptions = [...(item.options || [])];
                                            newOptions[index] = e.target.value;
                                            updateCurrentItem({ options: newOptions });
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const newOptions = item.options?.filter((_, i) => i !== index);
                                            updateCurrentItem({ options: newOptions });
                                        }}
                                        className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newOptions = [...(item.options || []), `Option ${(item.options?.length || 0) + 1}`];
                                    updateCurrentItem({ options: newOptions });
                                }}
                                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            >
                                <Plus className="w-4 h-4" />
                                Add Option
                            </button>
                        </div>
                    </div>
                )}

                {item.type === 'rating' && (
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Rating Scale (1 to ?)
                        </label>
                        <input
                            type="number"
                            min="2"
                            max="10"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                            value={item.rating_scale || 5}
                            onChange={(e) => updateCurrentItem({ rating_scale: parseInt(e.target.value) })}
                        />
                    </div>
                )}

                {item.type === 'rich_text' && (
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Available Variables
                        </label>
                        <div className="mt-2 space-y-2">
                            {templateVariables.map((variable) => (
                                <div key={variable} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                    <span className="font-mono text-sm text-blue-800 dark:text-blue-200">
                                        {`{${variable}}`}
                                    </span>
                                    <button
                                        onClick={() => insertVariableIntoEditor(variable)}
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                    >
                                        Insert
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Required Field
                        </label>
                        <div
                            role="switch"
                            aria-checked={item.required}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                item.required ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                            onClick={() => updateCurrentItem({ required: !item.required })}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    item.required ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTemplateSettings = () => {
        return (
            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Template Name
                    </label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                        value={template.title}
                        onChange={(e) => onUpdateTemplate({ title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Description
                    </label>
                    <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                        rows={3}
                        value={template.description || ''}
                        onChange={(e) => onUpdateTemplate({ description: e.target.value })}
                        placeholder="Describe your template..."
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Template Type
                    </label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                        value={template.type}
                        onChange={(e) => onUpdateTemplate({ type: e.target.value as any })}
                    >
                        <option value="audit">Audit</option>
                        <option value="contract">Contract</option>
                        <option value="report">Report</option>
                        <option value="certification">Certification</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Page Settings
                    </label>
                    <div className="mt-2 space-y-3">
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400">Page Size</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                                value={template.settings.pageSize}
                                onChange={(e) => onUpdateTemplate({
                                    settings: { ...template.settings, pageSize: e.target.value as any }
                                })}
                            >
                                <option value="A4">A4</option>
                                <option value="Letter">Letter</option>
                                <option value="Legal">Legal</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400">Orientation</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                                value={template.settings.orientation}
                                onChange={(e) => onUpdateTemplate({
                                    settings: { ...template.settings, orientation: e.target.value as any }
                                })}
                            >
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderVariablesTab = () => {
        return (
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Template Variables
                    </h4>
                    <div className="space-y-2">
                        {templateVariables.map((variable) => (
                            <div key={variable} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="font-mono text-sm">
                                    {`{${variable}}`}
                                </span>
                                <button
                                    onClick={() => removeVariable(variable)}
                                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                    title="Remove variable"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addVariable}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline pt-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Variable
                    </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Variable Usage
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Variables can be used in rich text sections and will be replaced with actual values when the template is used. 
                        Use the format <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{`{variable_name}`}</code> in your content.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <aside className="w-80 shrink-0 border-l border-border-light dark:border-border-dark bg-white dark:bg-background-dark flex flex-col">
            <div className="p-4 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {selectedItem ? 'Item Properties' : 'Template Settings'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex gap-1 mt-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`flex-1 text-xs font-medium py-1.5 px-2 rounded transition-colors ${
                            activeTab === 'properties'
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                        disabled={!selectedItem}
                    >
                        Properties
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 text-xs font-medium py-1.5 px-2 rounded transition-colors ${
                            activeTab === 'settings'
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('variables')}
                        className={`flex-1 text-xs font-medium py-1.5 px-2 rounded transition-colors ${
                            activeTab === 'variables'
                                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        Variables
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'properties' && (selectedItem ? renderItemProperties() : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <SettingsIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No Item Selected
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Select a section or item to view its properties
                        </p>
                    </div>
                ))}
                
                {activeTab === 'settings' && renderTemplateSettings()}
                {activeTab === 'variables' && renderVariablesTab()}
            </div>
        </aside>
    );
};
