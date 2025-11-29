// PDF Preview Component for Certificate
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
}

export function CertificatePreview({ certificateData, onClose }: CertificatePreviewProps) {
    const printRef = useRef<HTMLDivElement>(null);

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
          }
          .certificate-container {
            max-width: 800px;
            margin: 0 auto;
            border: 3px solid #1e40af;
            padding: 40px;
          }
          .header-img { 
            width: 100%; 
            max-height: 100px; 
            object-fit: contain; 
            margin-bottom: 30px; 
          }
          .text-center { text-align: center; }
          .primary-color { color: #1e40af; }
          .font-bold { font-weight: bold; }
          .text-2xl { font-size: 24px; }
          .text-3xl { font-size: 30px; }
          .text-lg { font-size: 18px; }
          .text-sm { font-size: 14px; }
          .text-xs { font-size: 12px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-4 { margin-bottom: 16px; }
          .mb-8 { margin-bottom: 32px; }
          .mt-2 { margin-top: 8px; }
          .mt-4 { margin-top: 16px; }
          .border-b-2 { border-bottom: 2px solid #d1d5db; padding-bottom: 10px; }
          .border-primary { border-color: #1e40af; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: 1fr 1fr; }
          .gap-4 { gap: 16px; }
          .bg-gray-50 { background-color: #f9fafb; }
          .p-2 { padding: 8px; }
          @media print {
            body { padding: 0; }
            .certificate-container { border: none; }
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

                {/* Certificate Content */}
                <div className="p-8">
                    <div ref={printRef}>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 certificate-container">
                            {/* Header Image */}
                            <div className="mb-8">
                                <img
                                    src="/img/5.png"
                                    alt="Certification Header"
                                    className="w-full h-auto max-h-24 object-contain header-img"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>

                            {/* Certification Body */}
                            <div className="text-center mb-8">
                                <div className="text-primary-color font-bold text-2xl mb-2">
                                    {certificateData.certificationBody || "AssureHub Certification Body"}
                                </div>
                                <div className="text-gray-600 text-sm">Accredited Certification Body</div>
                                <div className="border-t-2 border-primary-color w-32 mx-auto mt-4"></div>
                            </div>

                            {/* Certificate Title */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">CERTIFICATE</h1>
                                <p className="text-lg text-gray-600">of Conformity to Management System Standard</p>
                            </div>

                            {/* Certificate Body */}
                            <div className="space-y-6">
                                <div className="text-center">
                                    <p className="text-gray-700 mb-4">This is to certify that the management system of:</p>
                                    <div className="border-b-2 border-primary-color pb-2 mb-4 inline-block min-w-[400px]">
                                        <p className="text-xl font-bold text-gray-800">{certificateData.clientName}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{certificateData.location}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-gray-50 p-2">
                                        <span className="font-semibold">Location:</span>
                                        <span className="ml-2">{certificateData.location}</span>
                                    </div>
                                    <div className="bg-gray-50 p-2">
                                        <span className="font-semibold">Registration No:</span>
                                        <span className="ml-2">{certificateData.registrationNumber}</span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-gray-700 mb-2">has been assessed and found to conform to the requirements of:</p>
                                    <div className="font-semibold text-lg text-primary-color mb-4">
                                        {certificateData.standard}
                                    </div>
                                </div>

                                <div>
                                    <span className="font-semibold">Scope:</span>
                                    <p className="mt-2 text-gray-700">{certificateData.scope}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-gray-50 p-2">
                                        <strong className="block">Certificate Number:</strong>
                                        <p className="mt-1">{certificateData.certificateNumber}</p>
                                    </div>
                                    <div className="bg-gray-50 p-2">
                                        <strong className="block">Date of original registration:</strong>
                                        <p className="mt-1">{new Date(certificateData.originalRegistrationDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-gray-50 p-2">
                                        <strong className="block">Date of certificate (Issue):</strong>
                                        <p className="mt-1">{new Date(certificateData.issueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-gray-50 p-2">
                                        <strong className="block">Date of certificate expiry:</strong>
                                        <p className="mt-1">{new Date(certificateData.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Certificate Footer */}
                            <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
                                <div>
                                    <div className="border-t border-gray-400 w-32 mx-auto mb-2"></div>
                                    <p className="font-semibold">Lead Auditor</p>
                                    <p>{certificateData.leadAuditor || 'N/A'}</p>
                                </div>
                                <div>
                                    <div className="border-t border-gray-400 w-32 mx-auto mb-2"></div>
                                    <p className="font-semibold">Certification Manager</p>
                                    <p>John Roberts</p>
                                </div>
                            </div>

                            <div className="mt-8 text-center text-xs text-gray-500">
                                <p>This certificate is valid only when accompanied by a valid surveillance audit report.</p>
                                <p>The validity of this certificate is subject to satisfactory surveillance audits.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
