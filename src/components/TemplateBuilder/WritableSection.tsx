"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VisualSection, TemplateItem, FormElement } from '@/services/template.service';
import { GripVertical, Copy, Trash2, Plus, Edit3, Save, X, Bold, Italic, Underline, Code2, Image, Upload } from 'lucide-react';

interface WritableSectionProps {
    section: VisualSection;
    isSelected: boolean;
    isDragged: boolean;
    onSelect: (e: React.MouseEvent) => void;
    onUpdateSection: (updates: Partial<VisualSection>) => void;
    onDeleteSection: () => void;
    onDuplicateSection: () => void;
    onMouseDown: (e: React.MouseEvent, type: 'move' | 'resize', resizeHandle?: string) => void;
    renderResizeHandles: () => React.ReactNode;
    renderTemplateItem: (item: TemplateItem | FormElement, index: number) => React.ReactNode;
    templateVariables: string[];
}

interface EditState {
    isEditingTitle: boolean;
    isEditingDescription: boolean;
    isEditingContent: boolean;
    titleValue: string;
    descriptionValue: string;
    contentValue: string;
    isDragOver: boolean;
}

export const WritableSection: React.FC<WritableSectionProps> = ({
    section,
    isSelected,
    isDragged,
    onSelect,
    onUpdateSection,
    onDeleteSection,
    onDuplicateSection,
    onMouseDown,
    renderResizeHandles,
    renderTemplateItem,
    templateVariables = []
}) => {
    const [editState, setEditState] = useState<EditState>({
        isEditingTitle: false,
        isEditingDescription: false,
        isEditingContent: false,
        titleValue: section.title,
        descriptionValue: section.description || '',
        contentValue: section.template_content || '',
        isDragOver: false
    });

    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
    const contentEditorRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Update local state when section changes
    useEffect(() => {
        setEditState(prev => ({
            ...prev,
            titleValue: section.title,
            descriptionValue: section.description || '',
            contentValue: section.template_content || ''
        }));
    }, [section.title, section.description, section.template_content]);

    // Auto-focus when entering edit mode
    useEffect(() => {
        if (editState.isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
            titleInputRef.current.select();
        }
    }, [editState.isEditingTitle]);

    useEffect(() => {
        if (editState.isEditingDescription && descriptionInputRef.current) {
            descriptionInputRef.current.focus();
            descriptionInputRef.current.select();
        }
    }, [editState.isEditingDescription]);

    useEffect(() => {
        if (editState.isEditingContent && contentEditorRef.current) {
            contentEditorRef.current.focus();
        }
    }, [editState.isEditingContent]);

    // Sync content with state (for external updates)
    useEffect(() => {
        if (contentEditorRef.current && contentEditorRef.current.innerHTML !== editState.contentValue) {
            contentEditorRef.current.innerHTML = editState.contentValue;
        }
    }, [editState.contentValue]);

    // Save handlers
    const saveTitle = useCallback(() => {
        if (editState.titleValue.trim() && editState.titleValue !== section.title) {
            onUpdateSection({ title: editState.titleValue.trim() });
        }
        setEditState(prev => ({ ...prev, isEditingTitle: false }));
    }, [editState.titleValue, section.title, onUpdateSection]);

    const saveDescription = useCallback(() => {
        if (editState.descriptionValue !== section.description) {
            onUpdateSection({ description: editState.descriptionValue });
        }
        setEditState(prev => ({ ...prev, isEditingDescription: false }));
    }, [editState.descriptionValue, section.description, onUpdateSection]);

    const saveContent = useCallback(() => {
        if (editState.contentValue !== section.template_content) {
            onUpdateSection({ template_content: editState.contentValue });
        }
        setEditState(prev => ({ ...prev, isEditingContent: false }));
    }, [editState.contentValue, section.template_content, onUpdateSection]);

    // Cancel handlers
    const cancelEdit = useCallback((field: 'title' | 'description' | 'content') => {
        setEditState(prev => ({
            ...prev,
            [`isEditing${field.charAt(0).toUpperCase() + field.slice(1)}`]: false,
            [`${field}Value`]: field === 'title' ? section.title
                : field === 'description' ? (section.description || '')
                    : (section.template_content || '')
        }));
    }, [section.title, section.description, section.template_content]);

    // Keyboard handlers
    const handleKeyDown = useCallback((e: React.KeyboardEvent, field: 'title' | 'description' | 'content') => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (field === 'title') saveTitle();
            else if (field === 'description') saveDescription();
            else if (field === 'content') saveContent();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit(field);
        }
    }, [saveTitle, saveDescription, saveContent, cancelEdit]);

    // Rich text formatting
    const formatText = useCallback((command: string, value?: string) => {
        if (contentEditorRef.current && editState.isEditingContent) {
            document.execCommand(command, false, value);
            contentEditorRef.current.focus();

            // Update content value
            setTimeout(() => {
                if (contentEditorRef.current) {
                    setEditState(prev => ({
                        ...prev,
                        contentValue: contentEditorRef.current!.innerHTML
                    }));
                }
            }, 0);
        }
    }, [editState.isEditingContent]);

    // Insert variable
    const insertVariable = useCallback((variableName: string) => {
        if (contentEditorRef.current && editState.isEditingContent) {
            const variableSpan = `<span class="variable-highlight bg-blue-100 text-blue-800 px-1 rounded font-medium">{${variableName}}</span>&nbsp;`;

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(range.createContextualFragment(variableSpan));
                range.collapse(false);
            } else {
                contentEditorRef.current.innerHTML += variableSpan;
            }

            setEditState(prev => ({
                ...prev,
                contentValue: contentEditorRef.current!.innerHTML
            }));
            contentEditorRef.current.focus();
        }
    }, [editState.isEditingContent]);

    // Image upload handler
    const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        processImageFile(file);

        // Clear the input
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    }, []);

    // Process image file (used by both file input and drag & drop)
    const processImageFile = useCallback(async (file: File) => {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (PNG, JPG, GIF, etc.)');
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        try {
            // Convert image to base64 data URL for storing
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                insertImage(dataUrl, file.name);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        }
    }, []);

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (editState.isEditingContent && !editState.isDragOver) {
            setEditState(prev => ({ ...prev, isDragOver: true }));
        }
    }, [editState.isEditingContent, editState.isDragOver]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if we're leaving the content editor area
        const rect = contentEditorRef.current?.getBoundingClientRect();
        if (rect && (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        )) {
            setEditState(prev => ({ ...prev, isDragOver: false }));
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setEditState(prev => ({ ...prev, isDragOver: false }));

        if (!editState.isEditingContent) return;

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith('image/'));

        if (imageFile) {
            processImageFile(imageFile);
        } else if (files.length > 0) {
            alert('Please drop an image file (PNG, JPG, GIF, etc.)');
        }
    }, [editState.isEditingContent, processImageFile]);

    // Insert image into content editor
    const insertImage = useCallback((dataUrl: string, fileName: string) => {
        if (contentEditorRef.current && editState.isEditingContent) {
            const imageHtml = `<img src="${dataUrl}" alt="${fileName}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px;" />`;

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(range.createContextualFragment(imageHtml));
                range.collapse(false);
            } else {
                contentEditorRef.current.innerHTML += imageHtml;
            }

            setEditState(prev => ({
                ...prev,
                contentValue: contentEditorRef.current!.innerHTML
            }));
            contentEditorRef.current.focus();
        }
    }, [editState.isEditingContent]);

    // Trigger image upload
    const triggerImageUpload = useCallback(() => {
        imageInputRef.current?.click();
    }, []);

    const renderEditableTitle = () => {
        if (editState.isEditingTitle) {
            return (
                <div className="flex items-center gap-2">
                    <input
                        ref={titleInputRef}
                        type="text"
                        value={editState.titleValue}
                        onChange={(e) => setEditState(prev => ({ ...prev, titleValue: e.target.value }))}
                        onKeyDown={(e) => handleKeyDown(e, 'title')}
                        onBlur={saveTitle}
                        className="text-xl font-semibold bg-white dark:bg-gray-800 border border-primary rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Section title..."
                    />
                    <button
                        onClick={saveTitle}
                        className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                        title="Save title"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => cancelEdit('title')}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        title="Cancel"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        return (
            <div className="group/title flex items-center gap-2">
                <h3
                    className="text-xl font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditState(prev => ({ ...prev, isEditingTitle: true }));
                    }}
                    title="Click to edit title"
                >
                    {section.title}
                </h3>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditState(prev => ({ ...prev, isEditingTitle: true }));
                    }}
                    className="opacity-0 group-hover/title:opacity-100 p-1 text-gray-400 hover:text-primary rounded transition-all"
                    title="Edit title"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
            </div>
        );
    };

    const renderEditableDescription = () => {
        if (editState.isEditingDescription) {
            return (
                <div className="flex items-start gap-2 mt-2">
                    <textarea
                        ref={descriptionInputRef}
                        value={editState.descriptionValue}
                        onChange={(e) => setEditState(prev => ({ ...prev, descriptionValue: e.target.value }))}
                        onKeyDown={(e) => handleKeyDown(e, 'description')}
                        onBlur={saveDescription}
                        className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-primary rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        placeholder="Section description..."
                        rows={2}
                    />
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={saveDescription}
                            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                            title="Save description"
                        >
                            <Save className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => cancelEdit('description')}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                            title="Cancel"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            );
        }

        if (section.description) {
            return (
                <div className="group/desc flex items-start gap-2 mt-2">
                    <p
                        className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditState(prev => ({ ...prev, isEditingDescription: true }));
                        }}
                        title="Click to edit description"
                    >
                        {section.description}
                    </p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditState(prev => ({ ...prev, isEditingDescription: true }));
                        }}
                        className="opacity-0 group-hover/desc:opacity-100 p-1 text-gray-400 hover:text-primary rounded transition-all"
                        title="Edit description"
                    >
                        <Edit3 className="w-3 h-3" />
                    </button>
                </div>
            );
        }

        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setEditState(prev => ({ ...prev, isEditingDescription: true }));
                }}
                className="text-xs text-gray-400 hover:text-primary mt-1 italic transition-colors"
                title="Add description"
            >
                + Add description
            </button>
        );
    };

    const renderEditableContent = () => {
        if (editState.isEditingContent) {
            return (
                <div className="mb-4 border border-primary rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    {/* Rich text toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <button
                            onClick={() => formatText('bold')}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Bold"
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => formatText('italic')}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Italic"
                        >
                            <Italic className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => formatText('underline')}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Underline"
                        >
                            <Underline className="w-4 h-4" />
                        </button>

                        {/* Image upload button */}
                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
                        <button
                            onClick={triggerImageUpload}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Insert image"
                        >
                            <Image className="w-4 h-4" />
                        </button>

                        {/* Variable insertion */}
                        {templateVariables.length > 0 && (
                            <>
                                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            insertVariable(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    className="text-xs bg-transparent border-none focus:outline-none cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="">Insert Variable</option>
                                    {templateVariables.map(variable => (
                                        <option key={variable} value={variable}>{variable}</option>
                                    ))}
                                </select>
                            </>
                        )}

                        <div className="ml-auto flex gap-1">
                            <button
                                onClick={saveContent}
                                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                title="Save content"
                            >
                                <Save className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => cancelEdit('content')}
                                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content editor */}
                    <div
                        ref={contentEditorRef}
                        contentEditable
                        suppressContentEditableWarning
                        className={`p-4 min-h-[120px] focus:outline-none prose prose-sm max-w-none dark:prose-invert transition-all ${editState.isDragOver ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-400' : ''
                            }`}
                        onInput={() => {
                            if (contentEditorRef.current) {
                                setEditState(prev => ({
                                    ...prev,
                                    contentValue: contentEditorRef.current!.innerHTML
                                }));
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                cancelEdit('content');
                            }
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{ minHeight: '120px' }}
                        data-placeholder="Start writing your content here... You can also drag and drop images."
                    />
                </div>
            );
        }

        if (section.template_content) {
            return (
                <div className="group/content mb-4 relative">
                    <div
                        className="prose prose-sm max-w-none dark:prose-invert cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded transition-colors"
                        dangerouslySetInnerHTML={{ __html: section.template_content }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditState(prev => ({ ...prev, isEditingContent: true }));
                        }}
                        title="Click to edit content"
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditState(prev => ({ ...prev, isEditingContent: true }));
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover/content:opacity-100 p-1 text-gray-400 hover:text-primary bg-white dark:bg-gray-800 rounded shadow transition-all"
                        title="Edit content"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    const initialContent = section.template_content || '<p>Start writing your content here...</p>';
                    setEditState(prev => ({ ...prev, isEditingContent: true, contentValue: initialContent }));
                }}
                className="text-sm text-gray-400 hover:text-primary mb-4 italic border border-dashed border-gray-300 dark:border-gray-600 rounded p-4 w-full text-left transition-colors hover:border-primary"
                title="Add content"
            >
                + Add rich text content
            </button>
        );
    };

    const isInEditMode = editState.isEditingTitle || editState.isEditingDescription || editState.isEditingContent;

    return (
        <div
            className={`absolute transition-all duration-200 group ${isSelected
                ? 'border-primary border-2 shadow-lg'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                } ${isDragged ? 'shadow-2xl z-50' : ''
                } ${section.locked ? 'opacity-75' : 'cursor-pointer'
                } ${isInEditMode ? 'z-40' : ''
                }`}
            style={{
                left: section.position.x,
                top: section.position.y,
                width: section.size.width,
                minHeight: section.size.height,
                zIndex: isDragged ? 1000 : (isInEditMode ? 100 : section.zIndex),
                backgroundColor: section.style.backgroundColor,
                borderColor: isSelected ? '#3b82f6' : section.style.borderColor,
                borderWidth: isSelected ? 2 : section.style.borderWidth,
                borderStyle: section.style.borderStyle,
                borderRadius: section.style.borderRadius,
                padding: section.style.padding,
                boxShadow: isSelected
                    ? '0 10px 25px rgba(59, 130, 246, 0.25)'
                    : section.style.shadow,
            }}
            onClick={isInEditMode ? undefined : onSelect}
        >
            {/* Section Header with Controls */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    {renderEditableTitle()}
                    {renderEditableDescription()}
                </div>

                {/* Action Buttons */}
                {!isInEditMode && (
                    <div className={`flex gap-1 transition-opacity ${isSelected || isDragged ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                        {!section.locked && (
                            <button
                                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title="Drag to move"
                                onMouseDown={(e) => onMouseDown(e, 'move')}
                            >
                                <GripVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </button>
                        )}
                        <button
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Duplicate section"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateSection();
                            }}
                        >
                            <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                            className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete section"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this section?')) {
                                    onDeleteSection();
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                )}
            </div>

            {/* Section Template Content */}
            {renderEditableContent()}

            {/* Section Items */}
            <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                    <div key={item.id || itemIndex} className="group/item">
                        {renderTemplateItem(item, itemIndex)}
                    </div>
                ))}
            </div>

            {/* Add Item Button */}
            {!isInEditMode && (
                <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                    <button
                        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Add item to section:', section.id);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Add item to section
                    </button>
                </div>
            )}

            {/* Resize Handles */}
            {!isInEditMode && renderResizeHandles()}

            {/* Lock Indicator */}
            {section.locked && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs">🔒</span>
                </div>
            )}

            {/* Edit Mode Overlay */}
            {isInEditMode && (
                <div className="absolute inset-0 pointer-events-none bg-primary/5 border-2 border-primary border-dashed rounded" />
            )}

            {/* Hidden image upload input */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                multiple={false}
            />
        </div>
    );
};