"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auditService } from "@/services/audit.service";
import { apiClient } from "@/lib/api-client";
import { CertificatePreview } from "@/components/Certifications/certificate-preview";
import { CertificateEditor } from "@/components/Certifications/certificate-editor";

export default function CertificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Fetch certificate data from API (using audit data for certificate)
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch audit data to create certificate
        const auditData = await auditService.getAudit(resolvedParams.id);

        // Try to find the associated certification record
        let actualCertificationId = null;
        try {
          const certificationListResponse = await apiClient.get(`/certifications/`) as any;
          const certifications = certificationListResponse.results || [];

          console.log(`Looking for audit ID: ${resolvedParams.id}`);
          console.log(`Available certifications:`, certifications.map((cert: any) => ({
            id: cert.id,
            certificate_number: cert.certificate_number,
            audit: cert.audit ? { id: cert.audit.id, audit_number: cert.audit.audit_number } : null
          })));

          const associatedCert = certifications.find((cert: any) =>
            cert.audit && cert.audit.id.toString() === resolvedParams.id
          );

          if (associatedCert) {
            actualCertificationId = associatedCert.id;
            console.log(`✅ Found certification ID ${actualCertificationId} for audit ${resolvedParams.id}`);
            console.log(`Certificate details:`, {
              id: associatedCert.id,
              certificate_number: associatedCert.certificate_number,
              audit_id: associatedCert.audit.id
            });
          } else {
            console.log(`❌ No certification record found for audit ${resolvedParams.id}`);
            console.log(`Available audit IDs:`, certifications
              .filter((cert: any) => cert.audit)
              .map((cert: any) => cert.audit.id)
            );

            // Auto-create certification record if none exists
            console.log(`🔧 Creating certification record for audit ${resolvedParams.id}`);
            console.log('📋 Audit data available for certification creation:', {
              id: auditData.id,
              client: auditData.client,
              client_name: auditData.client_name,
              iso_standard: auditData.iso_standard,
              iso_standard_name: auditData.iso_standard_name,
              audit_number: auditData.audit_number,
              scope: auditData.scope,
              lead_auditor: auditData.lead_auditor,
              lead_auditor_name: auditData.lead_auditor_name
            });

            // Correct field mapping based on audit interface
            const newCertData = {
              audit: resolvedParams.id,
              certificate_number: `CERT-${auditData.audit_number}`,
              status: 'pending', // Valid status: pending, active, expiring-soon, expired, suspended, revoked
              issue_date: new Date().toISOString().split('T')[0],
              expiry_date: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 years
              original_registration_date: new Date().toISOString().split('T')[0],
              scope: auditData.scope || 'Certification scope to be defined',
              certification_body: 'CentraQu Certification Body',
              // Correct field mapping from audit interface
              client: auditData.client, // Direct field from audit
              iso_standard: auditData.iso_standard, // Direct field from audit  
              lead_auditor: auditData.lead_auditor || null, // Optional field
              notes: `Auto-created for audit ${auditData.audit_number}`
            };

            try {

              // Validate critical required fields (backend validation will catch others)
              const criticalMissingFields = [];
              if (!newCertData.client) criticalMissingFields.push('client');
              if (!newCertData.iso_standard) criticalMissingFields.push('iso_standard');
              if (!newCertData.certificate_number) criticalMissingFields.push('certificate_number');

              if (criticalMissingFields.length > 0) {
                console.error('❌ Cannot create certification: Missing critical fields:', criticalMissingFields);
                console.error('Current certification data:', newCertData);
                console.error('Available audit fields:', Object.keys(auditData));

                // Don't return here - let the API call happen to get detailed error messages
                console.warn('⚠️ Proceeding with API call to get detailed validation errors...');
              } else {
                console.log('✅ All critical fields present, proceeding with certification creation');
              }

              console.log('Creating certification with data:', newCertData);
              const newCert = await apiClient.post('/certifications/', newCertData);
              actualCertificationId = newCert.id;
              console.log(`✅ Created certification record with ID: ${actualCertificationId}`);
            } catch (createError: any) {
              console.error('❌ Failed to create certification record:', createError);
              console.error('Create error details:', {
                status: createError.status,
                message: createError.message,
                errors: createError.errors,
                requestData: newCertData
              });

              // Show user-friendly error message
              if (createError.errors) {
                const errorFields = Object.keys(createError.errors);
                console.error(`Validation errors in fields: ${errorFields.join(', ')}`);
                console.error('Field errors:', createError.errors);
              }

              // Continue without certification ID - template editing will be disabled
            }
          }
        } catch (certError) {
          console.error('Could not fetch certification records:', certError);
        }

        // Calculate audit progress to verify it's complete
        const progress = calculateAuditProgress(auditData.checklist_responses || []);

        console.log("Audit progress for ID", resolvedParams.id, ":", progress);
        console.log("Audit data:", auditData);

        // Check if audit is ready for certification
        const isReadyForCertification = progress.percentage === 100;

        if (!isReadyForCertification) {
          console.warn(`Audit ${resolvedParams.id} is not 100% complete:`, progress);
          // Don't return early - still allow template viewing/editing
        }

        // Create certificate data from audit
        const certificate = {
          id: auditData.id,
          certificationId: actualCertificationId, // The actual certification UUID for API calls
          auditNumber: auditData.audit_number,
          clientName: auditData.client_name,
          clientData: auditData.client_data,
          standard: auditData.iso_standard_name,
          standardCode: auditData.iso_standard_name?.split(' - ')[0] || auditData.iso_standard_name,
          auditType: auditData.audit_type,
          scope: auditData.scope,
          title: auditData.title,
          description: auditData.description,
          plannedStartDate: auditData.planned_start_date,
          plannedEndDate: auditData.planned_end_date,
          actualStartDate: auditData.actual_start_date,
          actualEndDate: auditData.actual_end_date,
          leadAuditor: auditData.lead_auditor_name,
          status: auditData.status,
          progress: progress,
          certificateNumber: auditData.certificate_number || `CERT-${auditData.audit_number}`,
          certNumInt: auditData.cert_num_int || '',
          issueDate: auditData.certificate_issue_date || new Date().toISOString().split('T')[0],
          expiryDate: auditData.certificate_expiry_date || new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 years validity
          originalRegistrationDate: auditData.certificate_original_registration_date || new Date().toISOString().split('T')[0],
          isIssued: !!auditData.certificate_number,
          certificationBody: "CentraQu Certification Body",
          location: auditData.client_data?.address || "Client Location",
          registrationNumber: auditData.registration_number || `REG-${auditData.audit_number}`,
          isReadyForCertification: isReadyForCertification,
        };

        setCertificateData(certificate);
      } catch (error) {
        console.error("Failed to load certificate:", error);
        setError("Failed to load certificate data. The audit may not exist.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [resolvedParams.id]);

  // Calculate audit progress based on checklist responses
  const calculateAuditProgress = (checklistResponses: any[]) => {
    if (!checklistResponses || checklistResponses.length === 0) {
      return { percentage: 0, completed: 0, total: 0 };
    }

    const total = checklistResponses.length;
    const completed = checklistResponses.filter((r: any) => r.compliance_status !== 'pending').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { percentage, completed, total };
  };

  const handleSave = async () => {
    try {
      // Save certificate template changes without issuing the certificate
      const certificateUpdate = {
        certificate_number: certificateData.certificateNumber,
        cert_num_int: certificateData.certNumInt,
        certificate_issue_date: certificateData.issueDate,
        certificate_expiry_date: certificateData.expiryDate,
        certificate_original_registration_date: certificateData.originalRegistrationDate,
      };

      // Update the audit with certificate template information
      await auditService.updateAudit(resolvedParams.id, certificateUpdate);

      console.log("Certificate information saved:", certificateUpdate);

      // Show success message
      alert("✓ Certificate information saved successfully!");


      // Refresh the certificate data
      const updatedAudit = await auditService.getAudit(resolvedParams.id);
      const progress = calculateAuditProgress(updatedAudit.checklist_responses || []);

      const updatedCertificate = {
        ...certificateData,
        certificateNumber: updatedAudit.certificate_number || certificateData.certificateNumber,
        certNumInt: updatedAudit.cert_num_int || certificateData.certNumInt,
        issueDate: updatedAudit.certificate_issue_date || certificateData.issueDate,
        expiryDate: updatedAudit.certificate_expiry_date || certificateData.expiryDate,
        originalRegistrationDate: updatedAudit.certificate_original_registration_date || certificateData.originalRegistrationDate,
        progress: progress,
      };

      setCertificateData(updatedCertificate);
    } catch (error) {
      console.error("Failed to save certificate information:", error);
      alert("❌ Failed to save certificate information. Please try again.");
    }
  };

  const handleIssueCertificate = async () => {
    // Double-check that audit is ready for certification
    if (!certificateData.isReadyForCertification) {
      alert(`Cannot issue certificate. Audit completion: ${certificateData.progress?.percentage || 0}%. Must be 100%.`);
      return;
    }

    if (certificateData.isIssued) {
      alert("Certificate has already been issued for this audit.");
      return;
    }

    try {
      // Prepare certificate data for API update
      const certificateUpdate = {
        certificate_number: certificateData.certificateNumber,
        certificate_issue_date: certificateData.issueDate,
        certificate_expiry_date: certificateData.expiryDate,
        certificate_original_registration_date: certificateData.originalRegistrationDate,
        status: 'COMPLETED' // Ensure audit is marked as completed
      };

      console.log("Issuing certificate with data:", certificateUpdate);

      // Update the audit with certificate information
      await auditService.updateAudit(resolvedParams.id, certificateUpdate);

      console.log("Certificate issued successfully:", certificateUpdate);

      // Show success message and redirect
      // Surveillance tracking is now handled automatically via backend Certification sync
      alert("Certificate issued successfully! Check the Audit Tracker to view surveillance scheduling.");
      router.push("/dashboard/audits/certifications");
    } catch (error) {
      console.error("Failed to issue certificate:", error);
      alert("Failed to issue certificate. Please try again.");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Implementation for downloading certificate as PDF
      // This would typically call a backend API to generate and download the PDF
      console.log("Downloading certificate PDF for:", certificateData.certificateNumber);

      // For now, show a placeholder message
      alert("PDF download functionality will be implemented. Certificate: " + certificateData.certificateNumber);

      // TODO: Implement actual PDF generation and download
      // Example API call:
      // const response = await fetch(`/api/v1/certificates/${certificateData.id}/pdf`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `Certificate-${certificateData.certificateNumber}.pdf`;
      // a.click();
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const handleSendToClient = async () => {
    try {
      // Implementation for sending certificate to client via email
      console.log("Sending certificate to client:", certificateData.clientName);

      if (!certificateData.clientData?.email || certificateData.clientData?.email === 'noemail@example.com') {
        alert("Cannot send certificate: Client email address not available. Please update client information.");
        return;
      }

      // For now, show a confirmation message
      const confirmSend = confirm(`Send certificate ${certificateData.certificateNumber} to ${certificateData.clientData.email}?`);

      if (confirmSend) {
        alert("Certificate email functionality will be implemented. Would send to: " + certificateData.clientData.email);

        // TODO: Implement actual email sending
        // Example API call:
        // await fetch(`/api/v1/certificates/${certificateData.id}/send-email`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ 
        //     email: certificateData.clientData.email,
        //     message: 'Custom message if needed' 
        //   })
        // });
      }
    } catch (error) {
      console.error("Failed to send certificate:", error);
      alert("Failed to send certificate. Please try again.");
    }
  };

  const handleRevokeCertificate = async () => {
    try {
      const confirmRevoke = confirm(
        `Are you sure you want to REVOKE certificate ${certificateData.certificateNumber}?\n\n` +
        `This action will:\n` +
        `- Mark the certificate as invalid\n` +
        `- Update the audit status\n` +
        `- Cannot be undone\n\n` +
        `Type "REVOKE" to confirm this action.`
      );

      if (!confirmRevoke) return;

      const userInput = prompt("Please type 'REVOKE' to confirm certificate revocation:");

      if (userInput !== 'REVOKE') {
        alert("Certificate revocation cancelled. Please type 'REVOKE' exactly to confirm.");
        return;
      }

      // Implementation for revoking the certificate
      console.log("Revoking certificate:", certificateData.certificateNumber);

      const revokeUpdate = {
        certificate_number: '', // Clear certificate number
        certificate_issue_date: undefined, // Clear issue date
        certificate_expiry_date: undefined, // Clear expiry date
        certificate_original_registration_date: undefined, // Clear original registration date
        status: 'COMPLETED' // Keep audit status as completed but remove certificate
      };

      await auditService.updateAudit(resolvedParams.id, revokeUpdate);

      alert("Certificate has been successfully revoked.");

      // Refresh the page to show updated status
      window.location.reload();

    } catch (error) {
      console.error("Failed to revoke certificate:", error);
      alert("Failed to revoke certificate. Please try again.");
    }
  };

  const [previewElements, setPreviewElements] = useState<any[] | undefined>(undefined);

  const handlePreviewPDF = async (elements?: any[]) => {
    // Update preview elements if provided
    if (elements) {
      setPreviewElements(elements);
    }
    // Show the preview modal
    setShowPreview(true);
  };



  const handleSaveTemplate = async (elements: any[]) => {
    setIsSaving(true);
    try {
      // Check if we have a certification ID to work with
      if (!certificateData.certificationId) {
        alert(`❌ Cannot save template: No certification record found for audit ${resolvedParams.id}.\n\nThis could mean:\n• The audit is not ready for certification\n• The certification record was not created\n• There's a connectivity issue\n\nPlease refresh the page or contact support.`);
        return;
      }

      // Validate certification status before editing
      try {
        console.log('🔍 Validating certification status before saving template...');
        const certificationStatus = await apiClient.get(`/certifications/${certificateData.certificationId}/`);

        if (certificationStatus.status === 'revoked') {
          alert('❌ Cannot edit template: Certificate has been revoked.\n\nRevoked certificates cannot be modified. Please contact your administrator if you believe this is an error.');
          return;
        }

        if (certificationStatus.status === 'expired') {
          alert('❌ Cannot edit template: Certificate has expired.\n\nExpired certificates cannot be modified. You may need to create a new certification for this audit.');
          return;
        }

        if (certificationStatus.status === 'suspended') {
          alert('⚠️ Certificate is currently suspended.\n\nTemplate changes will be saved but the certificate cannot be issued until the suspension is lifted.');
        }

        console.log('✅ Certification status validation passed:', certificationStatus.status);
      } catch (statusError: any) {
        console.error('⚠️ Could not validate certification status:', statusError);
        // Continue with save - don't block if we can't check status
        if (statusError.status === 404) {
          alert('⚠️ Warning: Certification record may not exist. Continuing with template save...');
        }
      }

      // Validate elements before saving
      if (!elements || elements.length === 0) {
        alert('⚠️ Cannot save template: No template elements found. Please add some content to the template first.');
        return;
      }

      console.log(`💾 Saving template with ${elements.length} elements for certification ${certificateData.certificationId}`);

      // Call API to save template configuration
      const requestData = {
        elements: elements,
        data: {
          certificate_number: certificateData.certificateNumber,
          issue_date: certificateData.issueDate,
          expiry_date: certificateData.expiryDate,
          original_registration_date: certificateData.originalRegistrationDate,
          scope: certificateData.scope,
        }
      };

      console.log('Template save request:', {
        certificationId: certificateData.certificationId,
        elementsCount: elements.length,
        dataFields: Object.keys(requestData.data)
      });

      const response = await apiClient.post(`/certifications/${certificateData.certificationId}/update_template/`, requestData);

      console.log('✅ Template save response:', response);
      alert('✅ Template saved successfully!\n\nYour template configuration has been stored and will be used for PDF generation.');

    } catch (error: any) {
      console.error('❌ Template save error:', error);
      console.error('Error details:', {
        status: error.status,
        message: error.message,
        errors: error.errors,
        certificationId: certificateData.certificationId
      });

      let errorMessage = 'Unknown error occurred';
      let troubleshooting = '';

      if (error.status === 401) {
        errorMessage = 'Authentication failed';
        troubleshooting = '\nTroubleshooting:\n• Please log out and log back in\n• Check if your session has expired';
      } else if (error.status === 403) {
        errorMessage = 'Permission denied';
        troubleshooting = '\nTroubleshooting:\n• You may not have permission to edit this certification\n• Contact your administrator';
      } else if (error.status === 404) {
        errorMessage = 'Certification record not found';
        troubleshooting = '\nTroubleshooting:\n• The certification may have been deleted\n• Refresh the page to reload data';
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred';
        troubleshooting = '\nTroubleshooting:\n• Please try again in a few moments\n• Contact support if the problem persists';
      } else if (error.status === 0) {
        errorMessage = 'Network connection failed';
        troubleshooting = '\nTroubleshooting:\n• Check your internet connection\n• Verify the backend server is running\n• Try refreshing the page';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.detail) {
        errorMessage = error.detail;
      } else if (error.errors) {
        errorMessage = Object.values(error.errors).flat().join(', ');
      }

      alert(`❌ Failed to save template: ${errorMessage}${troubleshooting}\n\nCertification ID: ${certificateData.certificationId || 'None'}\nError Code: ${error.status || 'Unknown'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Check if we have a certification ID to work with
      if (!certificateData.certificationId) {
        alert('❌ No certification record found for this audit. Please refresh the page or contact support.');
        return;
      }

      // Validate certification status before generating PDF
      try {
        console.log('🔍 Validating certification status before PDF generation...');
        const certificationStatus = await apiClient.get(`/certifications/${certificateData.certificationId}/`);

        if (certificationStatus.status === 'revoked') {
          alert('❌ Cannot generate PDF: Certificate has been revoked.\n\nRevoked certificates cannot generate PDFs.');
          return;
        }

        console.log('✅ Certification validation passed for PDF generation:', certificationStatus.status);
      } catch (statusError: any) {
        console.error('⚠️ Could not validate certification status:', statusError);
        // Continue with PDF generation - don't block if we can't check status
      }

      // Call API to generate PDF using ReportLabs
      const requestData = {
        template_type: 'reportlabs'
      };

      console.log('📄 Generating PDF with data:', requestData);
      console.log('Using certification ID:', certificateData.certificationId);

      const result = await apiClient.post(`/certifications/${certificateData.certificationId}/generate/`, requestData) as any;

      alert('Certificate PDF generated successfully!');

      // Refresh certificate data to get the new PDF URL
      const updatedAudit = await auditService.getAudit(resolvedParams.id);
      const progress = calculateAuditProgress(updatedAudit.checklist_responses || []);

      const updatedCertificate = {
        ...certificateData,
        progress: progress,
        document_url: result.document_url
      };

      setCertificateData(updatedCertificate);

    } catch (error: any) {
      console.error('❌ Error generating PDF:', error);
      const errorMessage = error.message || error.detail || 'Failed to generate PDF';
      alert(`❌ Failed to generate PDF: ${errorMessage}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Helper to format YYYY-MM-DD to DD/MM/YYYY for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      if (!year || !month || !day) return dateString;
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Helper to parse DD/MM/YYYY to YYYY-MM-DD for storage
  const parseDateFromInput = (inputString: string) => {
    // Allow partial input while typing
    if (!inputString) return '';

    // Basic validation for DD/MM/YYYY format
    const parts = inputString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day.length === 2 && month.length === 2 && year.length === 4) {
        return `${year}-${month}-${day}`;
      }
    }
    return inputString; // Return as is if not fully formed, validation can happen on save/blur
  };

  // We need local state for the date inputs to allow typing freely
  const [dateInputs, setDateInputs] = useState({
    originalRegistrationDate: '',
    issueDate: '',
    expiryDate: ''
  });

  // Initialize local date inputs when certificateData loads
  useEffect(() => {
    if (certificateData) {
      setDateInputs({
        originalRegistrationDate: formatDateForDisplay(certificateData.originalRegistrationDate),
        issueDate: formatDateForDisplay(certificateData.issueDate),
        expiryDate: formatDateForDisplay(certificateData.expiryDate)
      });
    }
  }, [certificateData?.originalRegistrationDate, certificateData?.issueDate, certificateData?.expiryDate]);

  const handleDateInputChange = (field: string, value: string) => {
    // Update local input state immediately
    setDateInputs(prev => ({ ...prev, [field]: value }));

    // Try to parse and update main certificateData if valid
    const isoDate = parseDateFromInput(value);
    if (isoDate !== value && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setCertificateData(prev => ({ ...prev, [field]: isoDate }));
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600 dark:text-gray-400">Loading certificate...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !certificateData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Certificate not found"}
          </p>
          <button
            onClick={() => router.push("/dashboard/audits/certifications")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            Back to Certifications
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="text-primary hover:text-primary-hover mb-2"
            >
              ← Back to Certifications
            </button>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Certificate #{certificateData.certificateNumber}
            </h1>
            <p className="mt-1 text-body-base text-gray-600 dark:text-gray-400">
              {certificateData.clientName} - {certificateData.standard}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Audit: {certificateData.auditNumber} | Status: {certificateData.isIssued ? 'Issued' : 'Ready for Issue'}
            </p>
          </div>
          <div className="flex gap-2">
            {!certificateData.isIssued ? (
              <>
                <button
                  onClick={() => handlePreviewPDF()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                >
                  Preview PDF
                </button>
                <button
                  onClick={handleGeneratePDF}
                  className={`px-4 py-2 rounded-lg ${isGeneratingPDF || !certificateData.certificationId
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  disabled={isGeneratingPDF || !certificateData.certificationId}
                  title={!certificateData.certificationId ? 'No certification record found for this audit' : isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF'}
                >
                  {isGeneratingPDF ? '⏳ Generating...' : '📄 Generate PDF'}
                </button>
                <button
                  onClick={handleIssueCertificate}
                  disabled={!certificateData.isReadyForCertification}
                  className={`px-4 py-2 rounded-lg ${certificateData.isReadyForCertification
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  title={!certificateData.isReadyForCertification
                    ? `Audit must be 100% complete to issue certificate. Current: ${certificateData.progress?.percentage || 0}%`
                    : 'Issue Certificate'
                  }
                >
                  Issue Certificate
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleSendToClient}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                >
                  Send to Client
                </button>
                <button
                  onClick={handleRevokeCertificate}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Revoke Certificate
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress Warning */}
        {!certificateData.isReadyForCertification && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</span>
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Audit Not Ready for Certification
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  This audit has completed {certificateData.progress?.completed || 0} of {certificateData.progress?.total || 0} checklist items
                  ({certificateData.progress?.percentage || 0}%). All checklist items must be completed (100%) before a certificate can be issued.
                </p>
                <a
                  href={`/dashboard/audits/${resolvedParams.id}`}
                  className="inline-flex items-center gap-1 mt-2 text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 text-sm font-medium"
                >
                  → Complete audit checklist
                </a>
              </div>
            </div>
          </div>
        )}

        {/* No Certification Record Warning */}
        {!certificateData.certificationId ? (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 dark:text-amber-400 text-xl">⚠️</span>
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-1">Certification Auto-Creation Failed</h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm mb-2">
                  This audit (ID: {resolvedParams.id}) does not have an associated certification record.
                  The system attempted to create one automatically but failed.
                </p>
                <details className="text-amber-700 dark:text-amber-300 text-sm">
                  <summary className="cursor-pointer font-medium hover:text-amber-800 dark:hover:text-amber-200">
                    Possible causes (click to expand)
                  </summary>
                  <ul className="mt-2 ml-4 space-y-1 text-xs">
                    <li>• Missing required audit data (client, ISO standard, scope)</li>
                    <li>• Network connectivity issues</li>
                    <li>• Backend validation errors</li>
                    <li>• Permission restrictions</li>
                  </ul>
                </details>
                <p className="text-amber-700 dark:text-amber-300 text-sm mt-2">
                  Check the browser console for detailed error messages, or refresh the page to retry.
                  Template editing and PDF generation are disabled until this is resolved.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">Certification Record Found</h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Certification ID: {certificateData.certificationId?.substring(0, 8)}... - Template editing enabled.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8">
          {/* Certificate Template Editor */}
          <div className="w-full">
            <CertificateEditor
              certificateData={certificateData}
              onSave={handleSaveTemplate}
              onPreview={handlePreviewPDF}
              onClose={() => { }} // No-op for inline
              isInline={true}
              isSaving={isSaving}
            />
          </div>
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            {/* Certificate Information */}
            <WidgetCard title="Certificate Information">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Audit ID</span>
                  <span className="font-medium">{resolvedParams.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Audit Dates</span>
                  <span className="font-medium">
                    {certificateData.actualStartDate && certificateData.actualEndDate
                      ? `${new Date(certificateData.actualStartDate).toLocaleDateString()} - ${new Date(certificateData.actualEndDate).toLocaleDateString()}`
                      : `${new Date(certificateData.plannedStartDate).toLocaleDateString()} - ${new Date(certificateData.plannedEndDate).toLocaleDateString()}`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Lead Auditor</span>
                  <span className="font-medium">{certificateData.leadAuditor || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Audit Type</span>
                  <span className="font-medium">{certificateData.auditType}</span>
                </div>
              </div>
            </WidgetCard>

            {/* Certificate Information Form */}
            <WidgetCard title="Certificate Information">
              <div className="space-y-4">
                {/* Certificate Number (Internal) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certificate Number (Internal)
                  </label>
                  <input
                    type="text"
                    value={certificateData.certNumInt}
                    onChange={(e) => setCertificateData({ ...certificateData, certNumInt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                    placeholder="e.g., 11034"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Internal certificate number for tracking
                  </p>
                </div>

                {/* Date of Original Registration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Original Registration
                  </label>
                  <input
                    type="text"
                    value={dateInputs.originalRegistrationDate}
                    onChange={(e) => handleDateInputChange('originalRegistrationDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                    placeholder="DD/MM/YYYY"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    The date when the client was first registered/certified
                  </p>
                </div>

                {/* Date of Certificate (Issue) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Certificate (Issue)
                  </label>
                  <input
                    type="text"
                    value={dateInputs.issueDate}
                    onChange={(e) => handleDateInputChange('issueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                    placeholder="DD/MM/YYYY"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    The date when the current certificate was issued
                  </p>
                </div>

                {/* Date of Certificate Expiry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Certificate Expiry
                  </label>
                  <input
                    type="text"
                    value={dateInputs.expiryDate}
                    onChange={(e) => handleDateInputChange('expiryDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                    placeholder="DD/MM/YYYY"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    The expiration date of the certificate (typically 3 years from issue)
                  </p>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleSave}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                  >
                    💾 Save Certificate Information
                  </button>
                </div>
              </div>
            </WidgetCard>

            <WidgetCard title="Certification Status">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Audit completed successfully</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">No major non-conformances</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">2 minor non-conformances addressed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Ready for certification</span>
                </div>
              </div>
            </WidgetCard>

            <WidgetCard title="Template Actions">
              <div className="space-y-3">
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  📥 Import Template
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  💾 Save as Template
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  🔄 Reset to Default
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  📧 Send for Review
                </button>
              </div>
            </WidgetCard>

            <WidgetCard title="Certificate History">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Template created</span>
                  <span className="text-gray-500">Oct 24, 09:15</span>
                </div>
                <div className="flex justify-between">
                  <span>Certificate data populated</span>
                  <span className="text-gray-500">Oct 24, 09:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Ready for issuance</span>
                  <span className="text-gray-500">Oct 24, 10:00</span>
                </div>
              </div>
            </WidgetCard>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <CertificatePreview
          certificateData={certificateData}
          onClose={() => setShowPreview(false)}
          elements={previewElements}
        />
      )}
    </DashboardLayout>
  );
}