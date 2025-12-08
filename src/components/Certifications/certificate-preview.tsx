// PDF Preview Component for Certificate - Matches Certificate Editor Template
"use client";

import React, { useRef } from 'react';
import { WidgetCard } from "@/components/Dashboard/widget-card";

interface CertificatePreviewProps {
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
    };
    onClose: () => void;
    elements?: any[];
}

export function CertificatePreview({ certificateData, onClose, elements: propElements }: CertificatePreviewProps) {
    const printRef = useRef<HTMLDivElement>(null);

    // Define the exact same elements structure as the Certificate Editor
    // Use propElements if available, otherwise use default
    const elements = propElements || [
        {
            id: 'header-image',
            type: 'image',
            content: '/img/5.png',
            x: 50,
            y: 50,
            width: 492,
            height: 60,
            style: { objectFit: 'contain' }
        },
        {
            id: 'title',
            type: 'text',
            content: 'Certificate of Registration',
            x: 50,
            y: 130,
            width: 492,
            height: 40,
            style: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }
        },
        {
            id: 'certification-body',
            type: 'text',
            content: 'AceQu International Ltd – UK Certifies that the Management System of the above organisation has been audited and found to be in accordance with the requirements of the management system standards detailed below:',
            x: 50,
            y: 190,
            width: 492,
            height: 60,
            style: { fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }
        },
        {
            id: 'issued-to',
            type: 'text',
            content: 'This certificate is issued to',
            x: 50,
            y: 270,
            width: 492,
            height: 20,
            style: { fontSize: '14px', textAlign: 'center' }
        },
        {
            id: 'client-name',
            type: 'text',
            content: certificateData.clientName,
            x: 50,
            y: 300,
            width: 492,
            height: 30,
            style: { fontSize: '20px', fontWeight: 'bold', textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px' }
        },
        {
            id: 'scope-label',
            type: 'text',
            content: 'Scope of certification',
            x: 50,
            y: 350,
            width: 240,
            height: 20,
            style: { fontSize: '12px', fontWeight: 'bold' }
        },
        {
            id: 'scope-content',
            type: 'text',
            content: certificateData.scope,
            x: 50,
            y: 375,
            width: 240,
            height: 60,
            style: { fontSize: '12px', lineHeight: '1.4' }
        },
        {
            id: 'scope-work-label',
            type: 'text',
            content: 'Scope of work',
            x: 300,
            y: 350,
            width: 240,
            height: 20,
            style: { fontSize: '12px', fontWeight: 'bold' }
        },
        {
            id: 'scope-work-content',
            type: 'text',
            content: certificateData.scope,
            x: 300,
            y: 375,
            width: 240,
            height: 60,
            style: { fontSize: '12px', lineHeight: '1.4' }
        },
        {
            id: 'cert-number',
            type: 'text',
            content: `Certification Number: ${certificateData.certificateNumber}`,
            x: 50,
            y: 460,
            width: 240,
            height: 20,
            style: { fontSize: '11px' }
        },
        {
            id: 'orig-reg-date',
            type: 'text',
            content: `Date of original registration: ${certificateData.originalRegistrationDate}`,
            x: 300,
            y: 460,
            width: 240,
            height: 20,
            style: { fontSize: '11px' }
        },
        {
            id: 'issue-date',
            type: 'text',
            content: `Date of certificate: ${certificateData.issueDate}`,
            x: 50,
            y: 485,
            width: 240,
            height: 20,
            style: { fontSize: '11px' }
        },
        {
            id: 'expiry-date',
            type: 'text',
            content: `Date of certificate expiry: ${certificateData.expiryDate}`,
            x: 300,
            y: 485,
            width: 240,
            height: 20,
            style: { fontSize: '11px' }
        },
        {
            id: 'footer-company',
            type: 'text',
            content: 'AceQu International Ltd, 168 City Road, Cardiff, Wales, CF24 3JE, United Kingdom',
            x: 50,
            y: 550,
            width: 492,
            height: 20,
            style: { fontSize: '10px', textAlign: 'center' }
        },
        {
            id: 'footer-disclaimer',
            type: 'text',
            content: 'This certificate is the property of AceQu International Limited and should be returned back upon request.\nThe certificate cannot be transferred and is valid for the client, address and scope stated above.',
            x: 50,
            y: 575,
            width: 492,
            height: 40,
            style: { fontSize: '9px', textAlign: 'center', lineHeight: '1.3' }
        }
    ];

    const handlePrint = () => {
        if (printRef.current) {
            const printWindow = window.open('', '', 'height=800,width=1000');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Certificate Preview</title>');
                printWindow.document.write('<style>');
                printWindow.document.write(`
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: white;
            color: #000;
          }
          .certificate-container {
            width: 595px;
            height: 842px;
            margin: 0 auto;
            position: relative;
            background: white;
            border: 1px solid #ccc;
            box-sizing: border-box;
          }
          .element {
            position: absolute;
            overflow: hidden;
            word-wrap: break-word;
          }
          .element img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          @media print {
            body { padding: 0; margin: 0; }
            .certificate-container { 
              width: 210mm; 
              height: 297mm; 
              border: none; 
              margin: 0;
              padding: 0;
            }
          }
        `);
                printWindow.document.write('</style></head><body>');
                printWindow.document.write(printRef.current.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            }
        }
    };

    const handleDownloadPDF = () => {
        // For now, trigger print dialog which allows save as PDF
        // In future, integrate with a PDF generation library
        handlePrint();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900">Certificate Preview</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            🖨️ Print
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            📥 Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            ✕ Close
                        </button>
                    </div>
                </div>

                {/* Certificate Content - Matches Certificate Editor exactly */}
                <div className="p-8">
                    <div ref={printRef}>
                        <div className="border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden">
                            <div
                                className="relative bg-white certificate-container"
                                style={{ width: '595px', height: '842px', margin: '0 auto' }}
                            >
                                {elements.map((element) => (
                                    <div
                                        key={element.id}
                                        className="absolute element"
                                        style={{
                                            left: element.x,
                                            top: element.y,
                                            width: element.width,
                                            height: element.height,
                                            ...element.style
                                        }}
                                    >
                                        {element.type === 'image' ? (
                                            <img
                                                src={element.content}
                                                alt="Certificate element"
                                                className="w-full h-full object-contain"
                                                draggable={false}
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full overflow-hidden"
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
        </div>
    );
}
