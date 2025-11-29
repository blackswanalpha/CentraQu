"use client";

import React, { useState, useRef } from 'react';
import { TemplatePage, TemplateSettings, VisualSection, TemplateItem, FormElement } from '@/services/template.service';
import { GripVertical, Copy, Trash2, Plus } from 'lucide-react';

interface VisualCanvasProps {
    page: TemplatePage;
    settings: TemplateSettings;
    onUpdateSettings: (settings: Partial<TemplateSettings>) => void;
    onUpdatePage: (updates: Partial<TemplatePage>) => void;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    templateTitle: string;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
    page,
    settings,
    onUpdateSettings,
    onUpdatePage,
    selectedId,
    onSelect,
    templateTitle
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const renderTemplateItem = (item: TemplateItem | FormElement, index: number) => {
        const isTemplateItem = 'type' in item && ['text', 'multiple_choice', 'dropdown', 'rating', 'date', 'file', 'image', 'instruction', 'rich_text'].includes(item.type);
        
        if (isTemplateItem) {
            const templateItem = item as TemplateItem;
            switch (templateItem.type) {
                case 'text':
                    return (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {templateItem.label}
                                {templateItem.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <input
                                type="text"
                                placeholder={templateItem.placeholder || "Enter text..."}
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-3 focus:ring-2 focus:ring-primary focus:border-primary"
                                disabled
                            />
                        </div>
                    );
                case 'multiple_choice':
                    return (
                        <div className="space-y-3">
                            <p className="font-medium text-gray-900 dark:text-gray-100">{templateItem.label}</p>
                            <div className="space-y-2">
                                {templateItem.options?.map((option, optIndex) => (
                                    <label key={optIndex} className="flex items-center gap-2">
                                        <input type="radio" name={`question-${index}`} className="form-radio text-primary" disabled />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                case 'dropdown':
                    return (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {templateItem.label}
                            </label>
                            <select className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-3" disabled>
                                <option>Select an option...</option>
                                {templateItem.options?.map((option, optIndex) => (
                                    <option key={optIndex}>{option}</option>
                                ))}
                            </select>
                        </div>
                    );
                case 'rating':
                    return (
                        <div className="space-y-3">
                            <p className="font-medium text-gray-900 dark:text-gray-100">{templateItem.label}</p>
                            <div className="flex gap-2">
                                {Array.from({ length: templateItem.rating_scale || 5 }, (_, i) => (
                                    <button
                                        key={i}
                                        className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-primary hover:bg-primary hover:text-white transition-colors"
                                        disabled
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                case 'date':
                    return (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {templateItem.label}
                            </label>
                            <input
                                type="date"
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-3"
                                disabled
                            />
                        </div>
                    );
                case 'file':
                    return (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {templateItem.label}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                            </div>
                        </div>
                    );
                case 'rich_text':
                    return (
                        <div className="space-y-2">
                            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2 flex gap-2">
                                    <button className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">B</button>
                                    <button className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">I</button>
                                    <button className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">U</button>
                                </div>
                                <div 
                                    className="p-4 min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    dangerouslySetInnerHTML={{ __html: templateItem.rich_content || templateItem.label }}
                                />
                            </div>
                        </div>
                    );
                case 'instruction':
                    return (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm text-blue-800 dark:text-blue-200">{templateItem.label}</p>
                        </div>
                    );
                default:
                    return (
                        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Component type: {templateItem.type}
                            </p>
                        </div>
                    );
            }
        } else {
            // Handle FormElement
            const formElement = item as FormElement;
            return (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formElement.label}
                        {formElement.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                        type={formElement.type.replace('input_', '')}
                        placeholder={formElement.placeholder}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-3"
                        disabled
                    />
                    {formElement.helpText && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formElement.helpText}</p>
                    )}
                </div>
            );
        }
    };

    const renderSection = (section: VisualSection, sectionIndex: number) => {
        const isSelected = selectedId === section.id;
        
        return (
            <div
                key={section.id}
                className={`absolute border rounded-xl transition-all duration-200 group cursor-pointer ${
                    isSelected 
                        ? 'border-primary border-2 shadow-lg bg-primary/5' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 bg-white dark:bg-gray-800'
                }`}
                style={{
                    left: section.position.x,
                    top: section.position.y,
                    width: section.size.width,
                    minHeight: section.size.height,
                    zIndex: section.zIndex,
                    backgroundColor: section.style.backgroundColor,
                    borderColor: isSelected ? '#3b82f6' : section.style.borderColor,
                    borderWidth: section.style.borderWidth,
                    borderRadius: section.style.borderRadius,
                    padding: section.style.padding,
                    boxShadow: section.style.shadow,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(section.id);
                }}
            >
                {/* Section Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {section.title}
                        </h3>
                        {section.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {section.description}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Drag to move"
                        >
                            <GripVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button 
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Duplicate section"
                        >
                            <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button 
                            className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20"
                            title="Delete section"
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </div>

                {/* Section Content */}
                <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                        <div key={item.id || itemIndex} className="group/item">
                            {renderTemplateItem(item, itemIndex)}
                        </div>
                    ))}
                </div>

                {/* Add Item Button */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Trigger add item dialog or action
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Add item to section
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex justify-center overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-7xl p-8">
                {/* Template Header */}
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
                        {templateTitle}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {page.title} • {page.sections.length} sections
                    </p>
                </div>

                {/* Visual Canvas */}
                <div
                    ref={canvasRef}
                    className="relative min-h-[800px] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                    style={{
                        backgroundColor: settings.backgroundColor,
                        backgroundImage: settings.gridEnabled ? 
                            `radial-gradient(circle, #e5e7eb 1px, transparent 1px)` : 'none',
                        backgroundSize: settings.gridEnabled ? `${settings.gridSize}px ${settings.gridSize}px` : 'auto',
                    }}
                    onClick={() => onSelect(null)}
                >
                    {/* Page Content */}
                    {page.content && (
                        <div 
                            className="p-8"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    )}

                    {/* Render Sections */}
                    {page.sections.map((section, index) => renderSection(section, index))}

                    {/* Empty State */}
                    {page.sections.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <Plus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Start Building Your Template
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
                                    Drag components from the left panel to create sections and add content to your template.
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Trigger add section action
                                    }}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Add Your First Section
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};