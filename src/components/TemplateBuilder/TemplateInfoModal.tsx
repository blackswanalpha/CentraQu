"use client";

import React, { useState } from 'react';
import { Template } from '@/services/template.service';

interface TemplateInfoModalProps {
    template: Template;
    onSave: (info: { title: string; description: string; type: string }) => void;
    onClose: () => void;
    onLoadExample?: () => void;
}

export const TemplateInfoModal: React.FC<TemplateInfoModalProps> = ({
    template,
    onSave,
    onClose,
    onLoadExample
}) => {
    const [title, setTitle] = useState(template.title);
    const [description, setDescription] = useState(template.description || '');
    const [type, setType] = useState(template.type);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSave({ title: title.trim(), description, type });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Template Information
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Template Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary"
                            placeholder="Enter template name..."
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary resize-none"
                            placeholder="Describe your template..."
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Template Type
                        </label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary"
                        >
                            <option value="audit">Audit</option>
                            <option value="contract">Contract</option>
                            <option value="report">Report</option>
                            <option value="certification">Certification</option>
                        </select>
                    </div>

                    <div className="space-y-3 pt-4">
                        {onLoadExample && (
                            <button
                                type="button"
                                onClick={onLoadExample}
                                className="w-full px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                            >
                                Load Example Contract Template
                            </button>
                        )}
                        
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};