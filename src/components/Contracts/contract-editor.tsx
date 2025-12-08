"use client";

import React, { useState, useRef, useEffect } from 'react';
import { contractService } from '@/services/contract.service';

interface DraggableElement {
    id: string;
    type: 'text' | 'image' | 'table' | 'section';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    style?: Record<string, any>;
    section?: string;
}

interface ContractEditorProps {
    contractId: number;
    contractNumber: string;
    clientName: string;
    contractData: {
        client_organization?: string;
        client_address?: string;
        client_contact_person?: string;
        client_email?: string;
        cb_name?: string;
        cb_address?: string;
        iso_standards?: string[];
        scope_of_certification?: string;
        scope_of_work?: string;
        objectives?: string;
        stage_1_audit_days?: number;
        stage_2_audit_days?: number;
        fee_per_standard_year_1?: number;
        fee_per_standard_year_2?: number;
        fee_per_standard_year_3?: number;
        contract_value?: number;
        currency?: string;
        start_date?: string;
        end_date?: string;
        signed_by_client_name?: string;
        signed_by_client_position?: string;
        signed_by_company_name?: string;
        signed_by_company_position?: string;
    };
    templateCategory?: string;
    onSave?: () => void;
}

export function ContractEditor({
    contractId,
    contractNumber,
    clientName,
    contractData,
    templateCategory: initialCategory = 'CONTRACT_AGREEMENT_DEFAULT',
    onSave
}: ContractEditorProps) {
    const [elements, setElements] = useState<DraggableElement[]>([]);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [templateCategory, setTemplateCategory] = useState(initialCategory);
    const [isSaving, setIsSaving] = useState(false);
    const [dragState, setDragState] = useState<{ isDragging: boolean; offset: { x: number; y: number } }>({
        isDragging: false,
        offset: { x: 0, y: 0 }
    });
    const [manuallyEdited, setManuallyEdited] = useState<Set<string>>(new Set());
    const [previewKey, setPreviewKey] = useState(0);

    const canvasRef = useRef<HTMLDivElement>(null);

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB');
        } catch {
            return dateString;
        }
    };

    // Load template on mount
    useEffect(() => {
        loadTemplate();
    }, [contractId, templateCategory]);

    const loadTemplate = async () => {
        setIsLoadingTemplate(true);
        try {
            const config = await contractService.getContractTemplateConfig(contractId);
            if (config.success && config.has_custom_template && config.template_data?.elements) {
                setElements(config.template_data.elements as DraggableElement[]);
                setTemplateCategory(config.template_category);
            } else {
                loadDefaultTemplate();
            }
        } catch (error) {
            console.error('Error loading template:', error);
            loadDefaultTemplate();
        } finally {
            setIsLoadingTemplate(false);
        }
    };

    const loadDefaultTemplate = () => {
        const isRenewal = templateCategory === 'RENEWAL_CONTRACT_AGREEMENT_DEFAULT';
        const cbName = contractData.cb_name || 'AceQu International Ltd';
        const cbAddress = contractData.cb_address || '168 City Road, Cardiff, Wales, CF24 3JE, United Kingdom';

        const defaultElements: DraggableElement[] = [
            // ===== HEADER =====
            {
                id: 'title',
                type: 'text',
                section: 'header',
                content: isRenewal ? 'RENEWAL CERTIFICATION AGREEMENT' : 'CERTIFICATION AGREEMENT',
                x: 20,
                y: 15,
                width: 555,
                height: 28,
                style: { fontSize: '20px', fontWeight: 'bold', textAlign: 'center', color: '#1a1a1a' }
            },
            {
                id: 'agreement-date',
                type: 'text',
                section: 'header',
                content: `Date: ${formatDate(contractData.start_date) || new Date().toLocaleDateString('en-GB')}`,
                x: 20,
                y: 43,
                width: 555,
                height: 14,
                style: { fontSize: '10px', textAlign: 'center', color: '#4b5563' }
            },
            // Parties
            {
                id: 'parties-info',
                type: 'text',
                section: 'parties',
                content: `Between: ${cbName}\nAnd: ${contractData.client_organization || clientName}`,
                x: 20,
                y: 60,
                width: 555,
                height: 28,
                style: { fontSize: '9px', lineHeight: '1.3' }
            },

            // ===== SECTION 1: INTRODUCTION =====
            {
                id: 'sec1-heading',
                type: 'text',
                section: 'introduction',
                content: '1. Introduction',
                x: 20,
                y: 95,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec1-content',
                type: 'text',
                section: 'introduction',
                content: `${cbName} is an accredited Certification Body providing audit, assessment, and certification services for ISO standards.`,
                x: 20,
                y: 111,
                width: 555,
                height: 24,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 2: CLIENT DETAILS =====
            {
                id: 'sec2-heading',
                type: 'text',
                section: 'client-details',
                content: '2. Client Details',
                x: 20,
                y: 140,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec2-content',
                type: 'text',
                section: 'client-details',
                content: `Organisation: ${contractData.client_organization || clientName}\nContact: ${contractData.client_contact_person || '-'} | Tel: ${(contractData as any).client_telephone || '-'}\nEmail: ${contractData.client_email || '-'}`,
                x: 20,
                y: 156,
                width: 555,
                height: 32,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 3: SCOPE OF WORK =====
            {
                id: 'sec3-heading',
                type: 'text',
                section: 'scope',
                content: '3. Scope of Work',
                x: 20,
                y: 195,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec3-content',
                type: 'text',
                section: 'scope',
                content: `Standards: ${(contractData.iso_standards || []).join(', ') || 'ISO Standards TBD'}\nScope: ${contractData.scope_of_certification || 'Scope to be defined'}`,
                x: 20,
                y: 211,
                width: 555,
                height: 28,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 4: CERTIFICATION PROCESS =====
            {
                id: 'sec4-heading',
                type: 'text',
                section: 'process',
                content: '4. Certification Process',
                x: 20,
                y: 245,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec4-content',
                type: 'text',
                section: 'process',
                content: `4.1 Stage I Audit: ${contractData.stage_1_audit_days || 1} day(s) - Documentation review\n4.2 Stage II Audit: ${contractData.stage_2_audit_days || 2} day(s) - Implementation assessment\n4.3 Surveillance Audits: Annual (Year 2 & 3)\n4.4 Recertification: Year 4`,
                x: 20,
                y: 261,
                width: 555,
                height: 42,
                style: { fontSize: '8px', lineHeight: '1.4' }
            },

            // ===== SECTION 5: CERTIFICATION CONDITIONS =====
            {
                id: 'sec5-heading',
                type: 'text',
                section: 'conditions',
                content: '5. Certification Conditions',
                x: 20,
                y: 310,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec5-content',
                type: 'text',
                section: 'conditions',
                content: '• Stage I & II within 3 months • NCs closed within 60 days • Certificates issued within 14 days • Certificate valid for 3 years',
                x: 20,
                y: 326,
                width: 555,
                height: 18,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 6: CANCELLATION & RESCHEDULING =====
            {
                id: 'sec6-heading',
                type: 'text',
                section: 'cancellation',
                content: '6. Cancellation & Rescheduling Policy',
                x: 20,
                y: 350,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec6-content',
                type: 'text',
                section: 'cancellation',
                content: 'If the Client cancels or reschedules with less than 15 working days\' notice, full audit fee may be charged.',
                x: 20,
                y: 366,
                width: 555,
                height: 16,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 7: FEE STRUCTURE =====
            {
                id: 'sec7-heading',
                type: 'text',
                section: 'fees',
                content: '7. Fee Structure',
                x: 20,
                y: 390,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec7-content',
                type: 'text',
                section: 'fees',
                content: `Year 1: ${contractData.currency || 'USD'} ${(contractData.fee_per_standard_year_1 || 0).toLocaleString()} | Year 2: ${contractData.currency || 'USD'} ${(contractData.fee_per_standard_year_2 || 0).toLocaleString()} | Year 3: ${contractData.currency || 'USD'} ${(contractData.fee_per_standard_year_3 || 0).toLocaleString()}\nTOTAL: ${contractData.currency || 'USD'} ${(contractData.contract_value || 0).toLocaleString()}`,
                x: 20,
                y: 406,
                width: 555,
                height: 26,
                style: { fontSize: '8px', lineHeight: '1.4' }
            },

            // ===== SECTION 8: CONFIDENTIALITY =====
            {
                id: 'sec8-heading',
                type: 'text',
                section: 'confidentiality',
                content: '8. Confidentiality',
                x: 20,
                y: 440,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec8-content',
                type: 'text',
                section: 'confidentiality',
                content: `${cbName} shall treat all information as strictly confidential and not disclose to third parties except as required by law.`,
                x: 20,
                y: 456,
                width: 555,
                height: 18,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 9: DATA PROTECTION =====
            {
                id: 'sec9-heading',
                type: 'text',
                section: 'data-protection',
                content: '9. Data Protection Clause',
                x: 20,
                y: 480,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec9-content',
                type: 'text',
                section: 'data-protection',
                content: 'Client information shall be processed and stored securely in compliance with applicable data protection regulations including GDPR.',
                x: 20,
                y: 496,
                width: 555,
                height: 18,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 10: CLIENT RESPONSIBILITIES =====
            {
                id: 'sec10-heading',
                type: 'text',
                section: 'responsibilities',
                content: '10. Responsibilities of the Client',
                x: 20,
                y: 520,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec10-content',
                type: 'text',
                section: 'responsibilities',
                content: '• Provide access to personnel, records, facilities • Maintain management systems • Notify CB of major changes • Support audit teams',
                x: 20,
                y: 536,
                width: 555,
                height: 18,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 11: TERM & TERMINATION =====
            {
                id: 'sec11-heading',
                type: 'text',
                section: 'term',
                content: '11. Term & Termination',
                x: 20,
                y: 560,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec11-content',
                type: 'text',
                section: 'term',
                content: `Valid for 3-year certification cycle. May be terminated with 30 days written notice. Start: ${formatDate(contractData.start_date) || 'TBD'} End: ${formatDate(contractData.end_date) || 'TBD'}`,
                x: 20,
                y: 576,
                width: 555,
                height: 22,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 12: ENTIRE AGREEMENT =====
            {
                id: 'sec12-heading',
                type: 'text',
                section: 'entire',
                content: '12. Entire Agreement',
                x: 20,
                y: 605,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec12-content',
                type: 'text',
                section: 'entire',
                content: 'This Agreement constitutes the entire understanding between parties. Amendments only in writing signed by both parties.',
                x: 20,
                y: 621,
                width: 555,
                height: 16,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 13: JURISDICTION =====
            {
                id: 'sec13-heading',
                type: 'text',
                section: 'jurisdiction',
                content: '13. Jurisdiction',
                x: 20,
                y: 643,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'sec13-content',
                type: 'text',
                section: 'jurisdiction',
                content: 'Governed by laws of the jurisdiction where the Certification Body is registered.',
                x: 20,
                y: 659,
                width: 555,
                height: 16,
                style: { fontSize: '8px', lineHeight: '1.3' }
            },

            // ===== SECTION 14: SIGNATURES =====
            {
                id: 'sec14-heading',
                type: 'text',
                section: 'signatures',
                content: '14. Signatures',
                x: 20,
                y: 680,
                width: 555,
                height: 16,
                style: { fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }
            },
            {
                id: 'client-signature',
                type: 'text',
                section: 'signatures',
                content: `Client:\nName: ${contractData.signed_by_client_name || '____________'}\nPosition: ${contractData.signed_by_client_position || '____________'}\nSignature: _____________ Date: _______`,
                x: 20,
                y: 696,
                width: 265,
                height: 55,
                style: { fontSize: '8px', lineHeight: '1.4' }
            },
            {
                id: 'cb-signature',
                type: 'text',
                section: 'signatures',
                content: `Certification Body:\nName: ${contractData.signed_by_company_name || 'Authorized Signatory'}\nPosition: ${contractData.signed_by_company_position || 'Lead Auditor'}\nSignature: _____________ Date: _______`,
                x: 300,
                y: 696,
                width: 275,
                height: 55,
                style: { fontSize: '8px', lineHeight: '1.4' }
            },

            // Footer
            {
                id: 'footer',
                type: 'text',
                section: 'footer',
                content: `Contract Ref: ${contractNumber} | Generated by CentraQu`,
                x: 20,
                y: 760,
                width: 555,
                height: 12,
                style: { fontSize: '7px', textAlign: 'center', color: '#9ca3af' }
            }
        ];

        setElements(defaultElements);
    };

    // Handle element interactions
    const handleElementClick = (elementId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedElement(elementId);
    };

    const handleMouseDown = (elementId: string, event: React.MouseEvent) => {
        const element = elements.find(el => el.id === elementId);
        if (!element) return;

        setDragState({
            isDragging: true,
            offset: {
                x: event.clientX - element.x,
                y: event.clientY - element.y
            }
        });
        setSelectedElement(elementId);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!dragState.isDragging || !selectedElement || !canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const newX = event.clientX - canvasRect.left - dragState.offset.x;
        const newY = event.clientY - canvasRect.top - dragState.offset.y;

        setElements(prev => prev.map(el =>
            el.id === selectedElement
                ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
                : el
        ));
    };

    const handleMouseUp = () => {
        setDragState({ isDragging: false, offset: { x: 0, y: 0 } });
    };

    const handleContentChange = (elementId: string, newContent: string) => {
        setElements(prev => prev.map(el =>
            el.id === elementId ? { ...el, content: newContent } : el
        ));
        setManuallyEdited(prev => {
            const newSet = new Set(prev);
            newSet.add(elementId);
            return newSet;
        });
    };

    const handleStyleChange = (elementId: string, styleKey: string, value: string) => {
        setElements(prev => prev.map(el =>
            el.id === elementId
                ? { ...el, style: { ...el.style, [styleKey]: value } }
                : el
        ));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await contractService.saveContractTemplate(contractId, { elements }, templateCategory);
            onSave?.();
            alert('Template saved successfully!');
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCategoryChange = (newCategory: string) => {
        setTemplateCategory(newCategory);
        setManuallyEdited(new Set());
        loadDefaultTemplate();
        setPreviewKey(prev => prev + 1);
    };

    const handlePreview = () => {
        const url = contractService.getPreviewPdfUrl(contractId, templateCategory);
        window.open(url, '_blank');
    };

    const selectedElementData = elements.find(el => el.id === selectedElement);

    if (isLoadingTemplate) {
        return (
            <div className="flex items-center justify-center h-[800px] bg-white rounded-lg border border-gray-200">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading template...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex h-[850px]">
            {/* Left Panel - Properties */}
            <div className="w-80 border-r border-gray-200 overflow-y-auto bg-gray-50">
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Contract Template Editor</h3>

                    {/* Template Type Selection */}
                    <div className="mb-6 p-3 bg-white rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Template Type</label>
                        <select
                            value={templateCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="CONTRACT_AGREEMENT_DEFAULT">New Contract Agreement</option>
                            <option value="RENEWAL_CONTRACT_AGREEMENT_DEFAULT">Renewal Agreement</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                            {templateCategory === 'RENEWAL_CONTRACT_AGREEMENT_DEFAULT'
                                ? 'Uses RenewalAgreementGenerator'
                                : 'Uses AgreementGenerator'}
                        </p>
                    </div>

                    {selectedElementData ? (
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-700 text-sm">
                                Editing: <span className="text-primary">{selectedElementData.id.replace(/-/g, ' ')}</span>
                            </h4>

                            {/* Content Editor */}
                            {selectedElementData.type === 'text' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Content</label>
                                    <textarea
                                        value={selectedElementData.content}
                                        onChange={(e) => handleContentChange(selectedElementData.id, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm"
                                        rows={4}
                                    />
                                </div>
                            )}

                            {/* Style Editors */}
                            <div className="space-y-3">
                                <h5 className="font-medium text-sm text-gray-600">Styling</h5>

                                <div>
                                    <label className="block text-xs font-medium mb-1">Font Size</label>
                                    <input
                                        type="text"
                                        value={selectedElementData.style?.fontSize || '12px'}
                                        onChange={(e) => handleStyleChange(selectedElementData.id, 'fontSize', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1">Font Weight</label>
                                    <select
                                        value={selectedElementData.style?.fontWeight || 'normal'}
                                        onChange={(e) => handleStyleChange(selectedElementData.id, 'fontWeight', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="bold">Bold</option>
                                        <option value="lighter">Lighter</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1">Text Align</label>
                                    <select
                                        value={selectedElementData.style?.textAlign || 'left'}
                                        onChange={(e) => handleStyleChange(selectedElementData.id, 'textAlign', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1">Color</label>
                                    <input
                                        type="color"
                                        value={selectedElementData.style?.color || '#000000'}
                                        onChange={(e) => handleStyleChange(selectedElementData.id, 'color', e.target.value)}
                                        className="w-full h-8 rounded border border-gray-300"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Width</label>
                                        <input
                                            type="number"
                                            value={selectedElementData.width}
                                            onChange={(e) => setElements(prev => prev.map(el =>
                                                el.id === selectedElementData.id
                                                    ? { ...el, width: parseInt(e.target.value) || 0 }
                                                    : el
                                            ))}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Height</label>
                                        <input
                                            type="number"
                                            value={selectedElementData.height}
                                            onChange={(e) => setElements(prev => prev.map(el =>
                                                el.id === selectedElementData.id
                                                    ? { ...el, height: parseInt(e.target.value) || 0 }
                                                    : el
                                            ))}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <span className="material-symbols-outlined text-4xl text-gray-300">touch_app</span>
                            <p className="text-gray-500 text-sm mt-2">Click on an element to edit its properties</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Center Panel - Canvas */}
            <div className="flex-1 overflow-auto bg-gray-100">
                <div className="p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {templateCategory === 'RENEWAL_CONTRACT_AGREEMENT_DEFAULT'
                                    ? 'Renewal Agreement Template'
                                    : 'Contract Agreement Template'}
                            </h2>
                            <p className="text-sm text-gray-500">{clientName} • #{contractNumber}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePreview}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base">visibility</span>
                                Preview PDF
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${isSaving
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-base">save</span>
                                {isSaving ? 'Saving...' : 'Save Template'}
                            </button>
                        </div>
                    </div>

                    {/* Canvas */}
                    <div className="border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden mx-auto">
                        <div
                            ref={canvasRef}
                            className="relative bg-white"
                            style={{ width: '595px', height: '842px', margin: '0 auto' }}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onClick={() => setSelectedElement(null)}
                        >
                            {elements.map((element) => (
                                <div
                                    key={element.id}
                                    className={`absolute border border-transparent hover:border-blue-400 cursor-move ${selectedElement === element.id ? 'border-blue-600 border-2 bg-blue-50/50' : ''
                                        }`}
                                    style={{
                                        left: element.x,
                                        top: element.y,
                                        width: element.width,
                                        height: element.height,
                                        ...element.style
                                    }}
                                    onClick={(e) => handleElementClick(element.id, e)}
                                    onMouseDown={(e) => handleMouseDown(element.id, e)}
                                >
                                    {element.type === 'image' ? (
                                        <img
                                            src={element.content}
                                            alt="Contract element"
                                            className="w-full h-full object-contain pointer-events-none"
                                            draggable={false}
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full overflow-hidden pointer-events-none"
                                            style={{ whiteSpace: 'pre-wrap' }}
                                        >
                                            {element.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
