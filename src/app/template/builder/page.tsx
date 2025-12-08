"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DndContext, DragEndEvent, DragOverlay, closestCenter } from "@dnd-kit/core";
import { Settings } from "lucide-react";
import { TemplateHeader } from "@/components/TemplateBuilder/TemplateHeader";
import { LeftPanel } from "@/components/TemplateBuilder/LeftPanel";
import { InteractiveVisualCanvas } from "@/components/TemplateBuilder/InteractiveVisualCanvas";
import { RightPanel } from "@/components/TemplateBuilder/RightPanel";
import { TemplateInfoModal } from "@/components/TemplateBuilder/TemplateInfoModal";
import { PreviewModal } from "@/components/TemplateBuilder/PreviewModal";
import { generatePDF } from "@/components/TemplateBuilder/pdfGenerator";
import { createServiceContractTemplate } from "@/components/TemplateBuilder/exampleTemplates";
import { createISO9001CertificationContract } from "@/components/TemplateBuilder/ContractTemplates";
import {
    Template,
    TemplatePage,
    VisualSection,
    TemplateItem,
    templateService,
    defaultTemplateSettings,
    TemplateSettings,
    FormElementType,
    FormElement
} from "@/services/template.service";

export default function TemplateBuilderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateId = searchParams.get('id');
    const contractData = searchParams.get('contract');
    const templateType = searchParams.get('type');

    const [template, setTemplate] = useState<Template>({
        title: "Untitled Template",
        description: "",
        type: "audit",
        pages: [
            {
                id: `page-${Date.now()}`,
                title: "Page 1",
                order: 0,
                content: "",
                sections: [],
                images: [],
                layers: []
            }
        ],
        is_published: false,
        settings: defaultTemplateSettings,
    });

    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState<{ pageIndex: number; sectionIndex: number; itemIndex: number } | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showInfoModal, setShowInfoModal] = useState(!templateId && !contractData);
    const [isSaving, setIsSaving] = useState(false);
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        if (templateId) {
            loadTemplate(templateId);
        } else if (templateType === 'certification-contract') {
            const contractTemplate = createISO9001CertificationContract();
            const { id, ...templateWithoutId } = contractTemplate;
            setTemplate(templateWithoutId);
            setShowInfoModal(false);
        } else if (contractData) {
            try {
                const contractTemplate = JSON.parse(decodeURIComponent(contractData));
                const { id, ...templateWithoutId } = contractTemplate;
                setTemplate(templateWithoutId);
                setShowInfoModal(false);
            } catch (error) {
                console.error("Error parsing contract data:", error);
            }
        }
    }, [templateId, contractData, templateType]);

    const loadTemplate = async (id: string) => {
        try {
            const data = await templateService.getTemplate(id);
            setTemplate(data);
        } catch (error) {
            console.error("Error loading template:", error);
        }
    };

    const saveTemplate = async (): Promise<Template | null> => {
        setIsSaving(true);
        try {
            if (template.id) {
                const updatedTemplate = await templateService.updateTemplate(template.id, template);
                setTemplate(updatedTemplate);
                return updatedTemplate;
            } else {
                const savedTemplate = await templateService.createTemplate(template);
                setTemplate(savedTemplate);
                return savedTemplate;
            }
        } catch (error) {
            console.error("Error saving template:", error);
            alert("Failed to save template. Please try again.");
            return null;
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        const saved = await saveTemplate();
        if (saved && !templateId) { // Only redirect if it's a new template being saved for the first time
            router.push(`/template/builder?id=${saved.id}`);
        }
    }

    const publishTemplate = async () => {
        if (!template.id) {
            alert("Please save the template first before publishing.");
            const savedTemplate = await saveTemplate();
            if (savedTemplate && savedTemplate.id) {
                router.push(`/template/builder?id=${savedTemplate.id}`);
            }
            return; // Stop execution to allow re-render with new template ID
        }

        try {
            await templateService.publishTemplate(template.id);
            const updatedTemplate = { ...template, is_published: true };
            await templateService.updateTemplate(template.id, updatedTemplate); // Update the template's published status in storage
            setTemplate(updatedTemplate);
            alert("Template published successfully!");
        } catch (error) {
            console.error("Error publishing template:", error);
            alert("Failed to publish template. Please try again.");
        }
    };

    const addPage = () => {
        const newPage: TemplatePage = {
            id: `page-${Date.now()}`,
            title: `Page ${template.pages.length + 1}`,
            order: template.pages.length,
            content: "",
            sections: [],
            images: [],
            layers: []
        };
        setTemplate({ ...template, pages: [...template.pages, newPage] });
        setCurrentPageIndex(template.pages.length);
    };

    const createNewSection = (order: number): VisualSection => ({
        id: `section-${Date.now()}`,
        title: `Section ${order + 1}`,
        description: "",
        order: order,
        position: { x: 50, y: 50 + (order * 100) },
        size: { width: 600, height: 200 },
        zIndex: 1,
        locked: false,
        style: {
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 8,
            padding: 16,
            shadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        items: []
    });

    const createNewItem = (type: string, order: number): TemplateItem => ({
        id: `item-${Date.now()}`,
        type: type as any,
        label: getDefaultLabel(type),
        order: order,
        required: false,
        ...(type === 'multiple_choice' || type === 'dropdown' ? { options: ['Option 1', 'Option 2'] } : {}),
        ...(type === 'rating' ? { rating_scale: 5 } : {})
    });

    const addSection = () => {
        const currentPage = template.pages[currentPageIndex];
        const newSection = createNewSection(currentPage.sections.length);

        const updatedPages = [...template.pages];
        updatedPages[currentPageIndex] = {
            ...currentPage,
            sections: [...currentPage.sections, newSection]
        };

        setTemplate({ ...template, pages: updatedPages });
    };

    const addItemToSection = (sectionIndex: number, itemType: string) => {
        const currentPage = template.pages[currentPageIndex];
        const section = currentPage.sections[sectionIndex];

        if (!section) {
            console.error("Section not found at index", sectionIndex);
            return;
        }

        const newItem = createNewItem(itemType, section.items.length);

        const updatedSections = [...currentPage.sections];
        updatedSections[sectionIndex] = {
            ...section,
            items: [...section.items, newItem]
        };

        const updatedPages = [...template.pages];
        updatedPages[currentPageIndex] = {
            ...currentPage,
            sections: updatedSections
        };

        setTemplate({ ...template, pages: updatedPages });
        setSelectedItem({ pageIndex: currentPageIndex, sectionIndex, itemIndex: section.items.length });
    };

    const addFormElementToSection = (sectionIndex: number, elementType: FormElementType) => {
        const currentPage = template.pages[currentPageIndex];
        const section = currentPage.sections[sectionIndex];

        if (!section) {
            console.error("Section not found at index", sectionIndex);
            return;
        }

        const newElement: FormElement = {
            id: `field-${Date.now()}`,
            type: elementType,
            label: 'New Field',
            name: `field_${Date.now()}`,
            required: false,
            placeholder: '',
        };

        const updatedSections = [...currentPage.sections];
        updatedSections[sectionIndex] = {
            ...section,
            items: [...section.items, newElement]
        };

        const updatedPages = [...template.pages];
        updatedPages[currentPageIndex] = {
            ...currentPage,
            sections: updatedSections
        };

        setTemplate({ ...template, pages: updatedPages });
        setSelectedItem({ pageIndex: currentPageIndex, sectionIndex, itemIndex: section.items.length });
    };

    const getDefaultLabel = (type: string): string => {
        const labels: Record<string, string> = {
            text: "Enter your text question here",
            rich_text: "Rich text content area",
            multiple_choice: "Select one option",
            dropdown: "Choose from dropdown",
            rating: "Rate from 1 to 5",
            date: "Select a date",
            file: "Upload a file",
            image: "Upload an image",
            instruction: "Add instructions here"
        };
        return labels[type] || "Question";
    };

    const updateItem = (pageIndex: number, sectionIndex: number, itemIndex: number, updates: Partial<TemplateItem>) => {
        const updatedPages = [...template.pages];
        const item = updatedPages[pageIndex].sections[sectionIndex].items[itemIndex];
        updatedPages[pageIndex].sections[sectionIndex].items[itemIndex] = { ...item, ...updates };
        setTemplate({ ...template, pages: updatedPages });
    };

    const deleteItem = (pageIndex: number, sectionIndex: number, itemIndex: number) => {
        const updatedPages = [...template.pages];
        updatedPages[pageIndex].sections[sectionIndex].items.splice(itemIndex, 1);
        setTemplate({ ...template, pages: updatedPages });
        setSelectedItem(null);
    };

    const duplicateItem = (pageIndex: number, sectionIndex: number, itemIndex: number) => {
        const updatedPages = [...template.pages];
        const originalItem = updatedPages[pageIndex].sections[sectionIndex].items[itemIndex];
        const duplicatedItem = {
            ...originalItem,
            id: `item-${Date.now()}`,
            order: originalItem.order + 1
        } as any as (TemplateItem | FormElement);
        updatedPages[pageIndex].sections[sectionIndex].items.splice(itemIndex + 1, 0, duplicatedItem);
        setTemplate({ ...template, pages: updatedPages });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            setActiveId(null);
            return;
        }
        // Handle reordering logic here
        console.log("Drag ended:", active.id, "->", over.id);
        setActiveId(null);
    };

    const addQuestionToLastSection = (questionType: string) => {
        const currentPage = template.pages[currentPageIndex];

        if (currentPage.sections.length === 0) {
            // Create section AND item together to avoid closure issues
            const newSection = createNewSection(0);
            const newItem = createNewItem(questionType, 0);
            newSection.items.push(newItem);

            const updatedPages = [...template.pages];
            updatedPages[currentPageIndex] = {
                ...currentPage,
                sections: [...currentPage.sections, newSection]
            };
            setTemplate({ ...template, pages: updatedPages });
            setSelectedItem({ pageIndex: currentPageIndex, sectionIndex: 0, itemIndex: 0 });
        } else {
            addItemToSection(currentPage.sections.length - 1, questionType);
        }
    };

    const updateTemplate = (updates: Partial<Template>) => {
        setTemplate({ ...template, ...updates });
    };

    // New handlers for VisualCanvas
    const handleUpdateSettings = (settings: Partial<TemplateSettings>) => {
        setTemplate(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
    };

    const handleUpdatePage = (updates: Partial<TemplatePage>) => {
        setTemplate(prev => {
            const newPages = [...prev.pages];
            newPages[currentPageIndex] = { ...newPages[currentPageIndex], ...updates };
            return { ...prev, pages: newPages };
        });
    };

    const getSelectedId = () => {
        if (!selectedItem) return null;
        const { sectionIndex, itemIndex } = selectedItem;
        const page = template.pages[currentPageIndex];
        if (sectionIndex >= 0 && sectionIndex < page.sections.length) {
            if (itemIndex === -1) {
                return page.sections[sectionIndex].id;
            }
        }
        return null;
    };

    const handleCanvasSelect = (id: string | null) => {
        if (!id) {
            setSelectedItem(null);
            return;
        }
        const page = template.pages[currentPageIndex];
        const sectionIndex = page.sections.findIndex(s => s.id === id);
        if (sectionIndex !== -1) {
            setSelectedItem({ pageIndex: currentPageIndex, sectionIndex, itemIndex: -1 });
            return;
        }
        setSelectedItem(null);
    };

    const showPreview = () => {
        setShowPreviewModal(true);
    };

    const hidePreview = () => {
        setShowPreviewModal(false);
    };

    const downloadPDF = async () => {
        try {
            await generatePDF(template);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const loadExampleContract = () => {
        const exampleTemplate = createServiceContractTemplate();
        setTemplate(exampleTemplate);
        setShowInfoModal(false);
    };

    // Section manipulation functions
    const updateSection = (sectionId: string, updates: Partial<VisualSection>) => {
        const updatedPages = [...template.pages];
        const currentPage = updatedPages[currentPageIndex];

        const sectionIndex = currentPage.sections.findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) {
            currentPage.sections[sectionIndex] = {
                ...currentPage.sections[sectionIndex],
                ...updates
            };
            setTemplate({ ...template, pages: updatedPages });
        }
    };

    const deleteSection = (sectionId: string) => {
        const updatedPages = [...template.pages];
        const currentPage = updatedPages[currentPageIndex];

        currentPage.sections = currentPage.sections.filter(s => s.id !== sectionId);
        setTemplate({ ...template, pages: updatedPages });

        // Clear selection if deleted section was selected
        if (selectedItem && selectedItem.sectionIndex !== -1) {
            const deletedSection = template.pages[currentPageIndex].sections.find(s => s.id === sectionId);
            if (deletedSection && selectedItem.sectionIndex < template.pages[currentPageIndex].sections.length) {
                const selectedSection = template.pages[currentPageIndex].sections[selectedItem.sectionIndex];
                if (selectedSection?.id === sectionId) {
                    setSelectedItem(null);
                }
            }
        }
    };

    const duplicateSection = (sectionId: string) => {
        const currentPage = template.pages[currentPageIndex];
        const sectionToDuplicate = currentPage.sections.find(s => s.id === sectionId);

        if (sectionToDuplicate) {
            const duplicatedSection: VisualSection = {
                ...sectionToDuplicate,
                id: `section-${Date.now()}`,
                title: `${sectionToDuplicate.title} (Copy)`,
                position: {
                    x: sectionToDuplicate.position.x + 20,
                    y: sectionToDuplicate.position.y + 20
                },
                order: currentPage.sections.length,
                // Duplicate items with new IDs
                items: sectionToDuplicate.items.map(item => ({
                    ...item,
                    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                }))
            };

            const updatedPages = [...template.pages];
            updatedPages[currentPageIndex] = {
                ...currentPage,
                sections: [...currentPage.sections, duplicatedSection]
            };
            setTemplate({ ...template, pages: updatedPages });

            // Select the duplicated section
            const newSectionIndex = updatedPages[currentPageIndex].sections.length - 1;
            setSelectedItem({ pageIndex: currentPageIndex, sectionIndex: newSectionIndex, itemIndex: -1 });
        }
    };

    // Specialized section creators for contract templates
    const addPoliciesLegalSection = () => {
        const currentPage = template.pages[currentPageIndex];
        const newSection = createNewSection(currentPage.sections.length);
        newSection.title = "Policies & Legal";
        newSection.description = "Contract policies, cancellation, confidentiality, and data protection terms";

        // Pre-configure form elements for Policies & Legal
        newSection.items = [
            {
                id: `field-${Date.now()}-1`,
                type: 'number' as FormElementType,
                label: 'Cancellation Notice Days',
                name: 'cancellation_notice_days',
                required: true,
                placeholder: 'e.g., 15',
                helpText: 'Working days notice required for cancellation/rescheduling'
            },
            {
                id: `field-${Date.now()}-2`,
                type: 'checkbox' as FormElementType,
                label: 'Cancellation Fee Applies',
                name: 'cancellation_fee_applies',
                required: false,
                helpText: 'Whether full audit fee applies for late cancellations'
            },
            {
                id: `field-${Date.now()}-3`,
                type: 'textarea' as FormElementType,
                label: 'Confidentiality Clause',
                name: 'confidentiality_clause',
                required: true,
                placeholder: 'Enter confidentiality terms...',
                helpText: 'Terms regarding confidentiality of client information'
            },
            {
                id: `field-${Date.now()}-4`,
                type: 'textarea' as FormElementType,
                label: 'Data Protection Compliance',
                name: 'data_protection_compliance',
                required: true,
                placeholder: 'Enter data protection compliance requirements...',
                helpText: 'Data protection and GDPR compliance requirements'
            }
        ];

        const updatedPages = [...template.pages];
        updatedPages[currentPageIndex] = {
            ...currentPage,
            sections: [...currentPage.sections, newSection]
        };

        setTemplate({ ...template, pages: updatedPages });
    };

    const addTimelineCertificationSection = () => {
        const currentPage = template.pages[currentPageIndex];
        const newSection = createNewSection(currentPage.sections.length);
        newSection.title = "Timeline & Certification Conditions";
        newSection.description = "Audit timeline, certification process, and validity conditions";

        // Pre-configure form elements for Timeline & Certification
        newSection.items = [
            {
                id: `field-${Date.now()}-1`,
                type: 'number' as FormElementType,
                label: 'Stage 1 Audit Days',
                name: 'stage_1_audit_days',
                required: true,
                placeholder: 'e.g., 1',
                helpText: 'Stage I audit duration in days'
            },
            {
                id: `field-${Date.now()}-2`,
                type: 'textarea' as FormElementType,
                label: 'Stage 1 Description',
                name: 'stage_1_audit_description',
                required: false,
                placeholder: 'Reviews documentation, readiness, and preparedness.',
                helpText: 'Description of Stage I audit process'
            },
            {
                id: `field-${Date.now()}-3`,
                type: 'checkbox' as FormElementType,
                label: 'Stage 1 Remote Allowed',
                name: 'stage_1_remote_allowed',
                required: false,
                helpText: 'Can be conducted on-site or remotely'
            },
            {
                id: `field-${Date.now()}-4`,
                type: 'number' as FormElementType,
                label: 'Stage 2 Audit Days',
                name: 'stage_2_audit_days',
                required: true,
                placeholder: 'e.g., 3',
                helpText: 'Stage II audit duration in days'
            },
            {
                id: `field-${Date.now()}-5`,
                type: 'textarea' as FormElementType,
                label: 'Stage 2 Description',
                name: 'stage_2_audit_description',
                required: false,
                placeholder: 'Full assessment of implementation and conformity...',
                helpText: 'Description of Stage II audit process'
            },
            {
                id: `field-${Date.now()}-6`,
                type: 'text' as FormElementType,
                label: 'Surveillance Audit Frequency',
                name: 'surveillance_audit_frequency',
                required: false,
                placeholder: 'e.g., Annual',
                helpText: 'Frequency of surveillance audits (e.g., Annual, Semi-annual)'
            },
            {
                id: `field-${Date.now()}-7`,
                type: 'number' as FormElementType,
                label: 'Certificate Validity (Years)',
                name: 'certificate_validity_years',
                required: false,
                placeholder: 'e.g., 3',
                helpText: 'Certificate validity in years'
            },
            {
                id: `field-${Date.now()}-8`,
                type: 'number' as FormElementType,
                label: 'NC Closure Max Days',
                name: 'nc_closure_max_days',
                required: false,
                placeholder: 'e.g., 60',
                helpText: 'Non-conformities must be closed within this many days max'
            }
        ];

        const updatedPages = [...template.pages];
        updatedPages[currentPageIndex] = {
            ...currentPage,
            sections: [...currentPage.sections, newSection]
        };

        setTemplate({ ...template, pages: updatedPages });
    };

    const currentPage = template.pages[currentPageIndex];

    return (
        <>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
                    <TemplateHeader
                        template={template}
                        onSave={handleSave}
                        onPublish={publishTemplate}
                        isSaving={isSaving}
                        onPreview={showPreview}
                        onDownloadPDF={downloadPDF}
                    />

                    <main className="flex flex-1 overflow-hidden">
                        <LeftPanel
                            onAddSection={addSection}
                            onAddPage={addPage}
                            onAddQuestionToLastSection={addQuestionToLastSection}
                            pages={template.pages}
                            currentPageIndex={currentPageIndex}
                            onPageSelect={setCurrentPageIndex}
                            onAddPoliciesSection={addPoliciesLegalSection}
                            onAddTimelineSection={addTimelineCertificationSection}
                        />

                        <InteractiveVisualCanvas
                            page={currentPage}
                            settings={template.settings}
                            onUpdateSettings={handleUpdateSettings}
                            onUpdatePage={handleUpdatePage}
                            selectedId={getSelectedId()}
                            onSelect={handleCanvasSelect}
                            templateTitle={template.title}
                            onUpdateSection={updateSection}
                            onDeleteSection={deleteSection}
                            onDuplicateSection={duplicateSection}
                            templateVariables={template.metadata?.variables?.map(v => v.name) || ['client_name', 'contract_date', 'company_name', 'amount']}
                        />

                        {showRightPanel && (
                            <RightPanel
                                selectedItem={selectedItem}
                                template={template}
                                onUpdateItem={updateItem}
                                onUpdateTemplate={updateTemplate}
                                onClose={() => {
                                    if (selectedItem) {
                                        setSelectedItem(null);
                                    } else {
                                        setShowRightPanel(false);
                                    }
                                }}
                                onAddFormElement={(type) => {
                                    if (selectedItem && selectedItem.sectionIndex !== -1) {
                                        addFormElementToSection(selectedItem.sectionIndex, type);
                                    }
                                }}
                            />
                        )}

                        {/* Floating toggle button for RightPanel when hidden */}
                        {!showRightPanel && (
                            <button
                                onClick={() => setShowRightPanel(true)}
                                className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
                                title="Open Settings Panel"
                            >
                                <Settings className="w-6 h-6" />
                            </button>
                        )}
                    </main>
                </div>

                <DragOverlay>
                    {activeId ? <div className="p-4 bg-white rounded-lg shadow-lg">Dragging...</div> : null}
                </DragOverlay>
            </DndContext>

            {showInfoModal && (
                <TemplateInfoModal
                    template={template}
                    onSave={(info) => {
                        setTemplate({ ...template, ...info });
                        setShowInfoModal(false);
                    }}
                    onClose={() => {
                        if (!template.id) {
                            router.push('/template/starter');
                        } else {
                            setShowInfoModal(false);
                        }
                    }}
                    onLoadExample={loadExampleContract}
                />
            )}

            {showPreviewModal && (
                <PreviewModal
                    template={template}
                    onClose={hidePreview}
                    onDownloadPDF={downloadPDF}
                />
            )}
        </>
    );
}
