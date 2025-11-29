"use client";

import React, { useState } from 'react';
import {
    Wrench,
    GitBranch,
    Layout,
    Image,
    Type,
    CircleDot,
    ChevronDown,
    Star,
    Calendar,
    Upload,
    Edit3,
    Code2,
    Square,
    FileText,
    CheckSquare,
    MousePointer,
    PlusCircle,
    GripVertical
} from 'lucide-react';
import { TemplatePage } from '@/services/template.service';

interface LeftPanelProps {
    onAddSection: () => void;
    onAddPage: () => void;
    onAddQuestionToLastSection: (questionType: string) => void;
    pages: TemplatePage[];
    currentPageIndex: number;
    onPageSelect: (index: number) => void;
    onAddPoliciesSection?: () => void;
    onAddTimelineSection?: () => void;
}

type PanelMode = 'components' | 'structure';

export const LeftPanel: React.FC<LeftPanelProps> = ({
    onAddSection,
    onAddPage,
    onAddQuestionToLastSection,
    pages,
    currentPageIndex,
    onPageSelect,
    onAddPoliciesSection,
    onAddTimelineSection
}) => {
    const [activePanel, setActivePanel] = useState<PanelMode>('components');

    const ComponentCard: React.FC<{
        icon: React.ReactNode;
        title: string;
        onClick: () => void;
    }> = ({ icon, title, onClick }) => (
        <div
            onClick={onClick}
            className="component-card flex flex-col items-center justify-center gap-2 p-3 border border-border-light dark:border-border-dark rounded-lg cursor-pointer bg-background-light dark:bg-subtle-dark hover:bg-subtle-light dark:hover:bg-opacity-50 transition-all duration-200 hover:shadow-md"
        >
            <span className="text-xl text-gray-600 dark:text-gray-400">{icon}</span>
            <p className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">{title}</p>
        </div>
    );

    const StructureItem: React.FC<{
        icon: React.ReactNode;
        title: string;
        onClick?: () => void;
        indent?: number;
        isActive?: boolean;
    }> = ({ icon, title, onClick, indent = 0, isActive = false }) => (
        <div
            onClick={onClick}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${isActive
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
            style={{ paddingLeft: `${8 + indent * 16}px` }}
        >
            <span className="text-sm">{icon}</span>
            <span className="text-sm font-medium">{title}</span>
        </div>
    );

    return (
        <aside className="w-80 shrink-0 border-r border-border-light dark:border-border-dark bg-white dark:bg-background-dark flex flex-col">
            {/* Panel Navigation */}
            <div className="p-4 border-b border-border-light dark:border-border-dark">
                <div className="grid grid-cols-2 gap-1 bg-background-light dark:bg-subtle-dark rounded-lg p-1">
                    <button
                        onClick={() => setActivePanel('components')}
                        className={`flex items-center justify-center gap-2 h-9 px-3 rounded-md text-sm font-medium transition-colors ${activePanel === 'components'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <Wrench className="text-base" />
                        <span>Components</span>
                    </button>
                    <button
                        onClick={() => setActivePanel('structure')}
                        className={`flex items-center justify-center gap-2 h-9 px-3 rounded-md text-sm font-medium transition-colors ${activePanel === 'structure'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <GitBranch className="text-base" />
                        <span>Structure</span>
                    </button>
                </div>
            </div>

            {/* Components Panel */}
            {activePanel === 'components' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Sections */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-3">
                            Sections
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <ComponentCard
                                icon={<Layout />}
                                title="Section"
                                onClick={onAddSection}
                            />
                            <ComponentCard
                                icon={<Image />}
                                title="Image"
                                onClick={() => onAddQuestionToLastSection('image')}
                            />
                        </div>
                    </div>

                    {/* Contract Sections - NEW */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-3">
                            Contract Sections
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {onAddPoliciesSection && (
                                <ComponentCard
                                    icon={<FileText />}
                                    title="Policies & Legal"
                                    onClick={onAddPoliciesSection}
                                />
                            )}
                            {onAddTimelineSection && (
                                <ComponentCard
                                    icon={<Calendar />}
                                    title="Timeline & Certification"
                                    onClick={onAddTimelineSection}
                                />
                            )}
                        </div>
                    </div>

                    {/* Template Editor */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-3">
                            Template Editor
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <ComponentCard
                                icon={<Edit3 />}
                                title="Text Editor"
                                onClick={() => onAddQuestionToLastSection('rich_text')}
                            />
                            <ComponentCard
                                icon={<Code2 />}
                                title="Variable"
                                onClick={() => onAddQuestionToLastSection('instruction')}
                            />
                        </div>
                    </div>

                    {/* Question Types */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-3">
                            Question Types
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <ComponentCard
                                icon={<Type />}
                                title="Text"
                                onClick={() => onAddQuestionToLastSection('text')}
                            />
                            <ComponentCard
                                icon={<CircleDot />}
                                title="Multiple Choice"
                                onClick={() => onAddQuestionToLastSection('multiple_choice')}
                            />
                            <ComponentCard
                                icon={<ChevronDown />}
                                title="Dropdown"
                                onClick={() => onAddQuestionToLastSection('dropdown')}
                            />
                            <ComponentCard
                                icon={<Star />}
                                title="Rating"
                                onClick={() => onAddQuestionToLastSection('rating')}
                            />
                            <ComponentCard
                                icon={<Calendar />}
                                title="Date"
                                onClick={() => onAddQuestionToLastSection('date')}
                            />
                            <ComponentCard
                                icon={<Upload />}
                                title="File Upload"
                                onClick={() => onAddQuestionToLastSection('file')}
                            />
                        </div>
                    </div>

                    {/* Form Builder */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-3">
                            Form Builder
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <ComponentCard
                                icon={<Square />}
                                title="Input Field"
                                onClick={() => onAddQuestionToLastSection('text')}
                            />
                            <ComponentCard
                                icon={<FileText />}
                                title="Text Area"
                                onClick={() => onAddQuestionToLastSection('text')}
                            />
                            <ComponentCard
                                icon={<CheckSquare />}
                                title="Checkbox"
                                onClick={() => onAddQuestionToLastSection('multiple_choice')}
                            />
                            <ComponentCard
                                icon={<MousePointer />}
                                title="Button"
                                onClick={() => onAddQuestionToLastSection('instruction')}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Structure Panel */}
            {activePanel === 'structure' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Document Structure
                    </h3>
                    <div className="space-y-2">
                        {/* Pages */}
                        {pages.map((page, index) => (
                            <div key={page.id}>
                                <StructureItem
                                    icon={<Layout />}
                                    title={page.title}
                                    onClick={() => onPageSelect(index)}
                                    isActive={index === currentPageIndex}
                                />
                                {/* Sections within page */}
                                {page.sections.map((section) => (
                                    <StructureItem
                                        key={section.id}
                                        icon={<GripVertical />}
                                        title={section.title}
                                        indent={1}
                                    />
                                ))}
                            </div>
                        ))}
                        {pages.length === 0 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 italic px-2">
                                No pages created yet
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border-light dark:border-border-dark">
                <button
                    onClick={onAddPage}
                    className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium leading-normal tracking-[-0.01em] gap-2 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                >
                    <PlusCircle className="text-lg" />
                    <span className="truncate">Add Page</span>
                </button>
            </div>
        </aside>
    );
};