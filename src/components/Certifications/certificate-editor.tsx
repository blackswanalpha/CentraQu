"use client";

import React, { useState, useRef, useEffect } from 'react';
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { apiClient } from "@/lib/api-client";

interface DraggableElement {
  id: string;
  type: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Record<string, any>;
}

interface CertificateEditorProps {
  certificateData: {
    certificationBody?: string;
    clientName: string;
    location: string;
    registrationNumber: string;
    standard: string;
    scope: string;
    certificateNumber: string;
    originalRegistrationDate: string;
    issueDate: string;
    expiryDate: string;
    leadAuditor?: string;
    certNumInt?: string;
  };
  onSave: (elements: DraggableElement[]) => void;
  onPreview: (elements?: DraggableElement[]) => void;
  onClose: () => void;
  isInline?: boolean;
  isSaving?: boolean;
}

export function CertificateEditor({ certificateData, onSave, onPreview, onClose, isInline = false, isSaving = false }: CertificateEditorProps) {
  const [elements, setElements] = useState<DraggableElement[]>([]);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ isDragging: boolean; offset: { x: number; y: number } }>({
    isDragging: false,
    offset: { x: 0, y: 0 }
  });

  const [manuallyEdited, setManuallyEdited] = useState<Set<string>>(new Set());

  const canvasRef = useRef<HTMLDivElement>(null);

  // Helper to format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Sync template elements with certificateData changes
  useEffect(() => {
    if (elements.length === 0) return;

    setElements(prevElements => prevElements.map(el => {
      // Skip if manually edited
      if (manuallyEdited.has(el.id)) return el;

      switch (el.id) {
        case 'client-name':
          return { ...el, content: certificateData.clientName };
        case 'standard':
          return { ...el, content: `Standard: ${certificateData.standard}` };
        case 'scope-content':
        case 'scope-work-content':
          return { ...el, content: certificateData.scope };
        case 'cert-number':
          return { ...el, content: `Certification Number: ${certificateData.certNumInt || '0000'}` };
        case 'orig-reg-date':
          return { ...el, content: `Date of original registration: ${formatDate(certificateData.originalRegistrationDate)}` };
        case 'issue-date':
          return { ...el, content: `Date of certificate: ${formatDate(certificateData.issueDate)}` };
        case 'expiry-date':
          return { ...el, content: `Date of certificate expiry: ${formatDate(certificateData.expiryDate)}` };
        default:
          return el;
      }
    }));
  }, [
    certificateData.clientName,
    certificateData.standard,
    certificateData.scope,
    certificateData.certificateNumber,
    certificateData.certNumInt,
    certificateData.originalRegistrationDate,
    certificateData.issueDate,
    certificateData.expiryDate,
    manuallyEdited // Re-run if manual edit status changes (though mostly for correctness)
  ]);

  // Load template data on component mount
  useEffect(() => {
    const loadTemplateData = () => {
      // Check if we have certificationId in the certificateData
      const certificationId = (certificateData as any).certificationId;

      if (certificationId) {
        // Try to load saved template from API
        loadSavedTemplate(certificationId);
      } else {
        // Use default template
        loadDefaultTemplate();
      }
    };

    const loadSavedTemplate = async (certificationId: string) => {
      try {
        console.log('Loading saved template for certification ID:', certificationId);
        const data = await apiClient.get(`/certifications/${certificationId}/template_data/`);

        if (data.template_data?.elements && data.template_data.is_saved_template) {
          console.log('✅ Loading saved template elements:', data.template_data.elements.length, 'elements');
          setElements(data.template_data.elements);
          setIsLoadingTemplate(false);
          return;
        }

        console.log('No saved template found, using defaults');
        // Fallback to default if no saved template
        loadDefaultTemplate();
      } catch (error: any) {
        console.error('❌ Error loading saved template:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          errors: error.errors
        });

        // If it's a 404 (template not found), that's normal for first-time use
        if (error.status === 404) {
          console.log('Template not found (first time use), loading defaults');
        } else {
          console.error('Unexpected error loading template, falling back to defaults');
        }

        loadDefaultTemplate();
      }
    };

    const loadDefaultTemplate = () => {
      console.log('Loading default template elements');
      const defaultElements: DraggableElement[] = [
        // 1. Title
        {
          id: 'title',
          type: 'text',
          content: 'Certificate of Registration',
          x: 20,
          y: 50,
          width: 492,
          height: 40,
          style: { fontSize: '28px', fontWeight: 'bold', textAlign: 'left' }
        },
        // 2. Issued To
        {
          id: 'issued-to',
          type: 'text',
          content: 'This certificate is issued to',
          x: 20,
          y: 100,
          width: 492,
          height: 20,
          style: { fontSize: '14px', textAlign: 'left' }
        },
        // 3. Client Name
        {
          id: 'client-name',
          type: 'text',
          content: certificateData.clientName,
          x: 20,
          y: 130,
          width: 492,
          height: 30,
          style: { fontSize: '20px', fontWeight: 'bold', textAlign: 'left', paddingBottom: '10px' }
        },
        // 4. Certification Body
        {
          id: 'certification-body',
          type: 'text',
          content: 'AceQu International Ltd – UK Certifies that the Management System of the above organisation has been audited and found to be in accordance with the requirements of the management system standards detailed below:',
          x: 20,
          y: 180,
          width: 492,
          height: 60,
          style: { fontSize: '14px', textAlign: 'left', lineHeight: '1.5' }
        },
        // 5. Standards (New)
        {
          id: 'standard',
          type: 'text',
          content: `Standard: ${certificateData.standard}`,
          x: 20,
          y: 250,
          width: 492,
          height: 40,
          style: { fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }
        },
        // 6. Scope
        {
          id: 'scope-label',
          type: 'text',
          content: 'Scope of Certification:',
          x: 20,
          y: 300,
          width: 492,
          height: 20,
          style: { fontSize: '12px', fontWeight: 'bold', textAlign: 'left' }
        },
        {
          id: 'scope-content',
          type: 'text',
          content: certificateData.scope,
          x: 20,
          y: 325,
          width: 492,
          height: 60,
          style: { fontSize: '12px', lineHeight: '1.4', textAlign: 'left' }
        },
        {
          id: 'scope-work-label',
          type: 'text',
          content: 'Scope of work:',
          x: 20,
          y: 400,
          width: 492,
          height: 20,
          style: { fontSize: '12px', fontWeight: 'bold', textAlign: 'left' }
        },
        {
          id: 'scope-work-content',
          type: 'text',
          content: certificateData.scope,
          x: 20,
          y: 425,
          width: 492,
          height: 60,
          style: { fontSize: '12px', lineHeight: '1.4', textAlign: 'left' }
        },
        // 7. Details (Left aligned, stacked)
        {
          id: 'cert-number',
          type: 'text',
          content: `Certification Number: ${certificateData.certNumInt || '0000'}`,
          x: 20,
          y: 500,
          width: 300,
          height: 20,
          style: { fontSize: '11px', fontWeight: 'bold' }
        },
        {
          id: 'orig-reg-date',
          type: 'text',
          content: `Date of original registration: ${formatDate(certificateData.originalRegistrationDate)}`,
          x: 20,
          y: 520,
          width: 300,
          height: 20,
          style: { fontSize: '11px' }
        },
        {
          id: 'issue-date',
          type: 'text',
          content: `Date of certificate: ${formatDate(certificateData.issueDate)}`,
          x: 20,
          y: 540,
          width: 300,
          height: 20,
          style: { fontSize: '11px' }
        },
        {
          id: 'expiry-date',
          type: 'text',
          content: `Date of certificate expiry: ${formatDate(certificateData.expiryDate)}`,
          x: 20,
          y: 560,
          width: 300,
          height: 20,
          style: { fontSize: '11px' }
        },
        // 8. Header Image (Moved to bottom)
        {
          id: 'header-image',
          type: 'image',
          content: '/img/5.png',
          x: 20,
          y: 600,
          width: 492,
          height: 60,
          style: { objectFit: 'contain' }
        },
        // Footer
        {
          id: 'footer-company',
          type: 'text',
          content: 'AceQu International Ltd, 168 City Road, Cardiff, Wales, CF24 3JE, United Kingdom',
          x: 50,
          y: 760,
          width: 492,
          height: 20,
          style: { fontSize: '10px', textAlign: 'center' }
        },
        {
          id: 'footer-disclaimer',
          type: 'text',
          content: 'This certificate is the property of AceQu International Limited and should be returned back upon request.\nThe certificate cannot be transferred and is valid for the client, address and scope stated above.',
          x: 50,
          y: 785,
          width: 492,
          height: 40,
          style: { fontSize: '9px', textAlign: 'center', lineHeight: '1.3' }
        }
      ];

      setElements(defaultElements);
      setIsLoadingTemplate(false);
    };

    loadTemplateData();
  }, [certificateData]);

  const handleElementClick = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedElement(elementId);
  };

  const handleMouseDown = (elementId: string, event: React.MouseEvent) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const rect = event.currentTarget.getBoundingClientRect();
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

    // Mark as manually edited
    setManuallyEdited(prev => {
      const newSet = new Set(prev);
      newSet.add(elementId);
      return newSet;
    });
  };

  const handleStyleChange = (elementId: string, styleKey: string, value: any) => {
    setElements(prev => prev.map(el =>
      el.id === elementId
        ? { ...el, style: { ...el.style, [styleKey]: value } }
        : el
    ));
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  // Show loading state while template is being loaded
  if (isLoadingTemplate) {
    const LoadingContent = (
      <div className={`bg-white rounded-lg shadow-2xl w-full overflow-hidden flex items-center justify-center ${isInline ? 'h-[800px] border border-gray-200' : 'max-w-7xl max-h-[95vh]'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading saved template...</p>
        </div>
      </div>
    );

    if (isInline) {
      return LoadingContent;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {LoadingContent}
      </div>
    );
  }

  const EditorContent = (
    <div className={`bg-white rounded-lg shadow-2xl w-full overflow-hidden flex ${isInline ? 'h-[800px] border border-gray-200' : 'max-w-7xl max-h-[95vh]'}`}>
      {/* Left Panel - Properties */}
      <div className="w-80 border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Certificate Editor</h3>

          {selectedElementData ? (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">
                Editing: {selectedElementData.id.replace('-', ' ')}
              </h4>

              {/* Content Editor */}
              {selectedElementData.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={selectedElementData.content}
                    onChange={(e) => handleContentChange(selectedElementData.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Style Editors */}
              <div className="space-y-3">
                <h5 className="font-medium text-sm text-gray-600">Styling</h5>

                {selectedElementData.type === 'text' && (
                  <>
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
                        <option value="justify">Justify</option>
                      </select>
                    </div>
                  </>
                )}

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
            <p className="text-gray-500 text-sm">Click on an element to edit its properties</p>
          )}
        </div>
      </div>

      {/* Center Panel - Canvas */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Certificate Template Editor</h2>
            <div className="flex gap-2">
              <button
                onClick={() => onPreview(elements)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Preview
              </button>
              <button
                onClick={() => onSave(elements)}
                className={`px-4 py-2 rounded-lg transition-colors ${isSaving
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                disabled={isSaving}
                title={isSaving ? 'Saving template...' : 'Save Template'}
              >
                {isSaving ? '⏳ Saving...' : '💾 Save Template'}
              </button>
              {!isInline && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              )}
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
            >
              {elements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute border border-transparent hover:border-blue-400 cursor-move ${selectedElement === element.id ? 'border-blue-600 border-2' : ''
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
                      alt="Certificate element"
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

  if (isInline) {
    return EditorContent;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {EditorContent}
    </div>
  );
}