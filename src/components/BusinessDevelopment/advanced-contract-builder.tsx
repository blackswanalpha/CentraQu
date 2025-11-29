import React, { useState, useEffect } from 'react';
import {
    TemplateHeader,
    LeftPanel,
    InteractiveVisualCanvas,
    RightPanel,
    generatePDF
} from '../TemplateBuilder';
import {
    Template,
    TemplatePage,
    TemplateItem,
    FormElement,
    FormElementType,
    defaultTemplateSettings,
    VisualSection
} from '@/services/template.service';
import { createTemplate, updateTemplate } from '@/services/template-api.service';

interface AdvancedContractBuilderProps {
    template?: Template;
    onSave: (template: Template) => Promise<void>;
    onBack: () => void;
    backendTemplateId?: string; // Backend template ID if editing existing
}

export function AdvancedContractBuilder({ template: initialTemplate, onSave, onBack, backendTemplateId }: AdvancedContractBuilderProps) {
    const [template, setTemplate] = useState<Template>(initialTemplate || {
        title: 'Untitled Contract',
        description: '',
        type: 'contract',
        pages: [],
        is_published: false,
        settings: defaultTemplateSettings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
            variables: [],
            require_all: false,
            show_progress: true,
            auto_save: true
        }
    });

    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState<{ pageIndex: number; sectionIndex: number; itemIndex: number } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [savedBackendId, setSavedBackendId] = useState<string | undefined>(backendTemplateId);

    // Ensure at least one page exists
    useEffect(() => {
        if (template.pages.length === 0) {
            handleAddPage();
        }
    }, []);

    const handleUpdateTemplate = (updates: Partial<Template>) => {
        setTemplate(prev => ({ ...prev, ...updates, updated_at: new Date().toISOString() }));
    };

    const handleAddPage = () => {
        // Generate unique ID with timestamp and random component to prevent duplicates
        const uniqueId = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newPage: TemplatePage = {
            id: uniqueId,
            title: `Page ${template.pages.length + 1}`,
            order: template.pages.length,
            content: '',
            sections: [],
            images: [],
            layers: []
        };
        setTemplate(prev => ({
            ...prev,
            pages: [...prev.pages, newPage]
        }));
        setCurrentPageIndex(template.pages.length);
    };

    const handleAddSection = () => {
        const uniqueId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newSection: VisualSection = {
            id: uniqueId,
            title: 'New Section',
            description: 'Section description',
            order: template.pages[currentPageIndex].sections.length,
            position: { x: 50, y: 50 },
            size: { width: 800, height: 200 },
            zIndex: 1,
            locked: false,
            style: {
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 8,
                padding: 20,
                shadow: '0 2px 4px rgba(0,0,0,0.05)'
            },
            items: []
        };

        const updatedPages = [...template.pages];
        updatedPages[currentPageIndex] = {
            ...updatedPages[currentPageIndex],
            sections: [...updatedPages[currentPageIndex].sections, newSection]
        };

        setTemplate(prev => ({ ...prev, pages: updatedPages }));
    };

    const handleUpdateSection = (sectionId: string, updates: Partial<VisualSection>) => {
        const updatedPages = [...template.pages];
        const page = updatedPages[currentPageIndex];
        const sectionIndex = page.sections.findIndex(s => s.id === sectionId);

        if (sectionIndex !== -1) {
            page.sections[sectionIndex] = { ...page.sections[sectionIndex], ...updates };
            setTemplate(prev => ({ ...prev, pages: updatedPages }));
        }
    };

    const handleAddQuestionToLastSection = (type: string) => {
        const page = template.pages[currentPageIndex];
        if (page.sections.length === 0) {
            handleAddSection();
            return;
        }

        const lastSectionIndex = page.sections.length - 1;
        const lastSection = page.sections[lastSectionIndex];

        const uniqueId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newItem: TemplateItem = {
            id: uniqueId,
            type: type as any,
            label: `New ${type} item`,
            order: lastSection.items.length,
            required: false,
            options: type === 'multiple_choice' || type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined
        };

        const updatedPages = [...template.pages];
        updatedPages[currentPageIndex].sections[lastSectionIndex].items.push(newItem);

        setTemplate(prev => ({ ...prev, pages: updatedPages }));
    };

    const handleAddFormElement = (type: FormElementType) => {
        // Similar to add question, but for form elements
    };

    const handleUpdateItem = (pageIndex: number, sectionIndex: number, itemIndex: number, updates: Partial<TemplateItem>) => {
        const updatedPages = [...template.pages];
        const section = updatedPages[pageIndex].sections[sectionIndex];

        if (itemIndex === -1) {
            return;
        }

        const item = section.items[itemIndex];
        section.items[itemIndex] = { ...item, ...updates } as any;

        setTemplate(prev => ({ ...prev, pages: updatedPages }));
    };

    // Map frontend template type to backend template type
    const getBackendTemplateType = (type: string): string => {
        switch (type) {
            case 'contract':
                return 'CERTIFICATION_CONTRACT';
            case 'audit':
                return 'AUDIT_CHECKLIST';
            case 'certification':
                return 'CERTIFICATION_CONTRACT';
            default:
                return 'OTHER';
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            console.log('💾 Attempting to save template...', {
                savedBackendId,
                templateTitle: template.title,
                templateType: template.type,
                pagesCount: template.pages.length
            });

            // Save to backend
            if (savedBackendId) {
                // Update existing template
                console.log('📝 Updating existing template:', savedBackendId);
                const result = await updateTemplate(savedBackendId, template);
                console.log('✅ Template updated successfully:', result);
            } else {
                // Create new template
                console.log('🆕 Creating new template');
                const backendTemplate = await createTemplate(template);
                console.log('✅ Template created successfully:', backendTemplate);
                setSavedBackendId(backendTemplate.template_id);
            }

            console.log('📤 Calling parent onSave...');
            // Call parent onSave
            await onSave(template);
            console.log('✅ Save complete!');
        } catch (error: any) {
            console.error('❌ Failed to save template:', error);
            const errorMessage = error?.message || String(error);
            alert(`Failed to save template.\n\nError: ${errorMessage}\n\nPlease check the browser console for more details.`);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        const updatedTemplate = { ...template, is_published: !template.is_published };
        setTemplate(updatedTemplate);

        // Save the published state to backend
        setIsSaving(true);
        try {
            console.log('📢 Publishing template...', {
                templateTitle: updatedTemplate.title,
                isPublished: updatedTemplate.is_published
            });

            if (savedBackendId) {
                console.log('📝 Updating published status for:', savedBackendId);
                await updateTemplate(savedBackendId, updatedTemplate);
            } else {
                console.log('🆕 Creating new template with published status');
                const backendTemplate = await createTemplate(updatedTemplate);
                setSavedBackendId(backendTemplate.template_id);
            }

            console.log('📤 Calling parent onSave...');
            await onSave(updatedTemplate);
            console.log('✅ Publish complete!');
        } catch (error: any) {
            console.error('❌ Failed to publish template:', error);
            const errorMessage = error?.message || String(error);
            alert(`Failed to publish template.\n\nError: ${errorMessage}\n\nPlease check the browser console for more details.`);
            // Revert the published state on error
            setTemplate(template);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreview = () => {
        // Implement preview logic or modal
        console.log('Preview requested');
    };

    const handleDownloadPDF = async () => {
        await generatePDF(template);
    };

    const handleUpdateSettings = (settings: any) => {
        setTemplate(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
    };

    const handleUpdatePage = (updates: Partial<TemplatePage>) => {
        const updatedPages = [...template.pages];
        updatedPages[currentPageIndex] = { ...updatedPages[currentPageIndex], ...updates };
        setTemplate(prev => ({ ...prev, pages: updatedPages }));
    };

    const handleDeleteSection = (sectionId: string) => {
        const updatedPages = [...template.pages];
        updatedPages[currentPageIndex].sections = updatedPages[currentPageIndex].sections.filter(s => s.id !== sectionId);
        setTemplate(prev => ({ ...prev, pages: updatedPages }));
        setSelectedItem(null);
    };

    const handleDuplicateSection = (sectionId: string) => {
        const page = template.pages[currentPageIndex];
        const sectionToDuplicate = page.sections.find(s => s.id === sectionId);
        if (sectionToDuplicate) {
            const uniqueId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newSection = {
                ...sectionToDuplicate,
                id: uniqueId,
                position: { x: sectionToDuplicate.position.x + 20, y: sectionToDuplicate.position.y + 20 }
            };
            const updatedPages = [...template.pages];
            updatedPages[currentPageIndex].sections.push(newSection);
            setTemplate(prev => ({ ...prev, pages: updatedPages }));
        }
    };

    const handleSelect = (sectionId: string | null) => {
        if (!sectionId) {
            setSelectedItem(null);
            return;
        }
        const sectionIndex = template.pages[currentPageIndex].sections.findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) {
            setSelectedItem({ pageIndex: currentPageIndex, sectionIndex, itemIndex: -1 });
        } else {
            setSelectedItem(null);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            <TemplateHeader
                template={template}
                onSave={handleSave}
                onPublish={handlePublish}
                isSaving={isSaving}
                onPreview={handlePreview}
                onDownloadPDF={handleDownloadPDF}
            />

            <div className="flex flex-1 overflow-hidden">
                <LeftPanel
                    onAddSection={handleAddSection}
                    onAddPage={handleAddPage}
                    onAddQuestionToLastSection={handleAddQuestionToLastSection}
                    pages={template.pages}
                    currentPageIndex={currentPageIndex}
                    onPageSelect={setCurrentPageIndex}
                />

                <div className="flex-1 relative overflow-hidden flex flex-col">
                    {/* Toolbar or Breadcrumbs could go here */}

                    {template.pages[currentPageIndex] && (
                        <InteractiveVisualCanvas
                            page={template.pages[currentPageIndex]}
                            settings={template.settings}
                            onUpdateSettings={handleUpdateSettings}
                            onUpdatePage={handleUpdatePage}
                            onUpdateSection={handleUpdateSection}
                            onDeleteSection={handleDeleteSection}
                            onDuplicateSection={handleDuplicateSection}
                            onSelect={handleSelect}
                            selectedId={selectedItem?.sectionIndex !== undefined && selectedItem.itemIndex === -1
                                ? template.pages[currentPageIndex].sections[selectedItem.sectionIndex]?.id
                                : null}
                            templateTitle={template.title}
                            templateVariables={template.metadata?.variables?.map(v => v.name)}
                        />
                    )}
                </div>

                <RightPanel
                    selectedItem={selectedItem}
                    template={template}
                    onUpdateItem={handleUpdateItem}
                    onUpdateTemplate={handleUpdateTemplate}
                    onClose={() => setSelectedItem(null)}
                    onAddFormElement={handleAddFormElement}
                />
            </div>
        </div>
    );
}
