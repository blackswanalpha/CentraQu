"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TemplatePage, TemplateSettings, VisualSection, TemplateItem, FormElement } from '@/services/template.service';
import { GripVertical, Copy, Trash2, Plus, Move, RotateCcw } from 'lucide-react';
import { WritableSection } from './WritableSection';

interface InteractiveVisualCanvasProps {
    page: TemplatePage;
    settings: TemplateSettings;
    onUpdateSettings: (settings: Partial<TemplateSettings>) => void;
    onUpdatePage: (updates: Partial<TemplatePage>) => void;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    templateTitle: string;
    onUpdateSection: (sectionId: string, updates: Partial<VisualSection>) => void;
    onDeleteSection: (sectionId: string) => void;
    onDuplicateSection: (sectionId: string) => void;
    templateVariables?: string[];
}

interface DragState {
    isDragging: boolean;
    dragType: 'move' | 'resize';
    startPos: { x: number; y: number };
    startSectionPos: { x: number; y: number };
    startSectionSize: { width: number; height: number };
    resizeHandle?: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
}

export const InteractiveVisualCanvas: React.FC<InteractiveVisualCanvasProps> = ({
    page,
    settings,
    onUpdateSettings,
    onUpdatePage,
    selectedId,
    onSelect,
    templateTitle,
    onUpdateSection,
    onDeleteSection,
    onDuplicateSection,
    templateVariables = []
}) => {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        dragType: 'move',
        startPos: { x: 0, y: 0 },
        startSectionPos: { x: 0, y: 0 },
        startSectionSize: { width: 0, height: 0 }
    });

    const canvasRef = useRef<HTMLDivElement>(null);
    const [draggedSection, setDraggedSection] = useState<string | null>(null);

    // Handle mouse events for dragging and resizing
    const handleMouseDown = useCallback((e: React.MouseEvent, sectionId: string, type: 'move' | 'resize', resizeHandle?: string) => {
        e.stopPropagation();

        const section = page.sections.find(s => s.id === sectionId);
        if (!section) return;

        const startPos = { x: e.clientX, y: e.clientY };

        setDragState({
            isDragging: true,
            dragType: type,
            startPos,
            startSectionPos: { x: section.position.x, y: section.position.y },
            startSectionSize: { width: section.size.width, height: section.size.height },
            resizeHandle: resizeHandle as any
        });

        setDraggedSection(sectionId);
        onSelect(sectionId);

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';

        e.preventDefault();
    }, [page.sections, onSelect]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState.isDragging || !draggedSection) return;

        const deltaX = e.clientX - dragState.startPos.x;
        const deltaY = e.clientY - dragState.startPos.y;

        if (dragState.dragType === 'move') {
            const newX = Math.max(0, dragState.startSectionPos.x + deltaX);
            const newY = Math.max(0, dragState.startSectionPos.y + deltaY);

            // Snap to grid if enabled
            const finalX = settings.snapToGrid
                ? Math.round(newX / settings.gridSize) * settings.gridSize
                : newX;
            const finalY = settings.snapToGrid
                ? Math.round(newY / settings.gridSize) * settings.gridSize
                : newY;

            onUpdateSection(draggedSection, {
                position: { x: finalX, y: finalY }
            });
        } else if (dragState.dragType === 'resize') {
            let newWidth = dragState.startSectionSize.width;
            let newHeight = dragState.startSectionSize.height;
            let newX = dragState.startSectionPos.x;
            let newY = dragState.startSectionPos.y;

            // Calculate new dimensions based on resize handle
            switch (dragState.resizeHandle) {
                case 'e': // East
                    newWidth = Math.max(200, dragState.startSectionSize.width + deltaX);
                    break;
                case 's': // South
                    newHeight = Math.max(100, dragState.startSectionSize.height + deltaY);
                    break;
                case 'se': // Southeast
                    newWidth = Math.max(200, dragState.startSectionSize.width + deltaX);
                    newHeight = Math.max(100, dragState.startSectionSize.height + deltaY);
                    break;
                case 'w': // West
                    newWidth = Math.max(200, dragState.startSectionSize.width - deltaX);
                    newX = dragState.startSectionPos.x + deltaX;
                    break;
                case 'n': // North
                    newHeight = Math.max(100, dragState.startSectionSize.height - deltaY);
                    newY = dragState.startSectionPos.y + deltaY;
                    break;
                case 'nw': // Northwest
                    newWidth = Math.max(200, dragState.startSectionSize.width - deltaX);
                    newHeight = Math.max(100, dragState.startSectionSize.height - deltaY);
                    newX = dragState.startSectionPos.x + deltaX;
                    newY = dragState.startSectionPos.y + deltaY;
                    break;
                case 'ne': // Northeast
                    newWidth = Math.max(200, dragState.startSectionSize.width + deltaX);
                    newHeight = Math.max(100, dragState.startSectionSize.height - deltaY);
                    newY = dragState.startSectionPos.y + deltaY;
                    break;
                case 'sw': // Southwest
                    newWidth = Math.max(200, dragState.startSectionSize.width - deltaX);
                    newHeight = Math.max(100, dragState.startSectionSize.height + deltaY);
                    newX = dragState.startSectionPos.x + deltaX;
                    break;
            }

            // Apply snap to grid for size if enabled
            if (settings.snapToGrid) {
                newWidth = Math.round(newWidth / settings.gridSize) * settings.gridSize;
                newHeight = Math.round(newHeight / settings.gridSize) * settings.gridSize;
                newX = Math.round(newX / settings.gridSize) * settings.gridSize;
                newY = Math.round(newY / settings.gridSize) * settings.gridSize;
            }

            onUpdateSection(draggedSection, {
                position: { x: newX, y: newY },
                size: { width: newWidth, height: newHeight }
            });
        }
    }, [dragState, draggedSection, onUpdateSection, settings.snapToGrid, settings.gridSize]);

    const handleMouseUp = useCallback(() => {
        if (dragState.isDragging) {
            setDragState({
                isDragging: false,
                dragType: 'move',
                startPos: { x: 0, y: 0 },
                startSectionPos: { x: 0, y: 0 },
                startSectionSize: { width: 0, height: 0 }
            });
            setDraggedSection(null);
            document.body.style.userSelect = '';
        }
    }, [dragState.isDragging]);

    useEffect(() => {
        if (dragState.isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedId) return;

            const section = page.sections.find(s => s.id === selectedId);
            if (!section) return;

            // Delete section with Delete key
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                if (confirm('Are you sure you want to delete this section?')) {
                    onDeleteSection(selectedId);
                }
                return;
            }

            // Duplicate section with Ctrl+D
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                onDuplicateSection(selectedId);
                return;
            }

            // Move section with arrow keys
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                const moveStep = e.shiftKey ? 10 : 1;
                const gridStep = settings.snapToGrid ? settings.gridSize : moveStep;

                let deltaX = 0, deltaY = 0;

                switch (e.key) {
                    case 'ArrowLeft':
                        deltaX = -gridStep;
                        break;
                    case 'ArrowRight':
                        deltaX = gridStep;
                        break;
                    case 'ArrowUp':
                        deltaY = -gridStep;
                        break;
                    case 'ArrowDown':
                        deltaY = gridStep;
                        break;
                }

                const newX = Math.max(0, section.position.x + deltaX);
                const newY = Math.max(0, section.position.y + deltaY);

                onUpdateSection(selectedId, {
                    position: { x: newX, y: newY }
                });
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedId, page.sections, settings.snapToGrid, settings.gridSize, onUpdateSection, onDeleteSection, onDuplicateSection]);

    // Render resize handles for selected section
    const renderResizeHandles = (section: VisualSection) => {
        if (selectedId !== section.id || section.locked) return null;

        const handles = [
            { position: 'nw', style: { top: -4, left: -4 } },
            { position: 'n', style: { top: -4, left: '50%', transform: 'translateX(-50%)' } },
            { position: 'ne', style: { top: -4, right: -4 } },
            { position: 'e', style: { top: '50%', right: -4, transform: 'translateY(-50%)' } },
            { position: 'se', style: { bottom: -4, right: -4 } },
            { position: 's', style: { bottom: -4, left: '50%', transform: 'translateX(-50%)' } },
            { position: 'sw', style: { bottom: -4, left: -4 } },
            { position: 'w', style: { top: '50%', left: -4, transform: 'translateY(-50%)' } }
        ];

        return (
            <>
                {handles.map(handle => (
                    <div
                        key={handle.position}
                        className="absolute w-2 h-2 bg-primary border border-white rounded-sm cursor-pointer z-10 hover:bg-primary/80"
                        style={{
                            ...handle.style,
                            cursor: `${handle.position}-resize`
                        }}
                        onMouseDown={(e) => handleMouseDown(e, section.id, 'resize', handle.position)}
                    />
                ))}
            </>
        );
    };

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
                case 'image':
                    return (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {templateItem.label}
                                {templateItem.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {templateItem.image_url ? (
                                <div className="relative group">
                                    <img
                                        src={templateItem.image_url}
                                        alt={templateItem.label}
                                        className="w-full h-auto max-h-64 object-contain rounded-lg border-2 border-gray-300 dark:border-gray-600"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                                        <button
                                            className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white dark:bg-gray-800 text-sm rounded shadow-lg transition-opacity"
                                            disabled
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary dark:hover:border-primary transition-colors cursor-pointer">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        < path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </div>
                            )}
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
        const isDragged = draggedSection === section.id;

        return (
            <WritableSection
                key={section.id}
                section={section}
                isSelected={isSelected}
                isDragged={isDragged}
                onSelect={(e) => {
                    e.stopPropagation();
                    onSelect(section.id);
                }}
                onUpdateSection={(updates) => onUpdateSection(section.id, updates)}
                onDeleteSection={() => onDeleteSection(section.id)}
                onDuplicateSection={() => onDuplicateSection(section.id)}
                onMouseDown={(e, type, resizeHandle) => handleMouseDown(e, section.id, type, resizeHandle)}
                renderResizeHandles={() => renderResizeHandles(section)}
                renderTemplateItem={renderTemplateItem}
                templateVariables={templateVariables}
            />
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
                            className="p-8 prose max-w-none"
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

                    {/* Selection Indicator */}
                    {selectedId && dragState.isDragging && (
                        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-md text-sm font-medium shadow-lg z-50">
                            {dragState.dragType === 'move' ? 'Moving section...' : 'Resizing section...'}
                        </div>
                    )}

                    {/* Section Count Indicator */}
                    {page.sections.length > 0 && (
                        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-md text-sm text-gray-600 dark:text-gray-400 shadow-sm">
                            {page.sections.length} section{page.sections.length !== 1 ? 's' : ''}
                            {selectedId && (
                                <span className="text-primary ml-2">• 1 selected</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Canvas Controls */}
                <div className="flex justify-between items-center mt-4 px-2">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Grid:</label>
                            <button
                                onClick={() => onUpdateSettings({ gridEnabled: !settings.gridEnabled })}
                                className={`px-3 py-1 rounded text-sm transition-colors ${settings.gridEnabled
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                title="Toggle grid visibility"
                            >
                                {settings.gridEnabled ? 'On' : 'Off'}
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Snap:</label>
                            <button
                                onClick={() => onUpdateSettings({ snapToGrid: !settings.snapToGrid })}
                                className={`px-3 py-1 rounded text-sm transition-colors ${settings.snapToGrid
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                title="Toggle snap to grid"
                            >
                                {settings.snapToGrid ? 'On' : 'Off'}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Keyboard shortcuts help */}
                        <div className="hidden md:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Arrow keys: Move</span>
                            <span>Del: Delete</span>
                            <span>Ctrl+D: Duplicate</span>
                            <span>Shift+Arrow: Fast move</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>Zoom: {settings.zoom}%</span>
                            <button
                                onClick={() => onUpdateSettings({ zoom: 100 })}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                title="Reset zoom to 100%"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};