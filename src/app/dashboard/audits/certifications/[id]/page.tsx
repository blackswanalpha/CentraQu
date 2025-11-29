"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auditService } from "@/services/audit.service";
import { CertificatePreview } from "@/components/Certifications/certificate-preview";

export default function CertificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch certificate data from API (using audit data for certificate)
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch audit data to create certificate
        const auditData = await auditService.getAudit(resolvedParams.id);

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
          certificationBody: "AssureHub Certification Body",
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
      setIsEditing(false);

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

  const handlePreviewPDF = async () => {
    // Show the preview modal
    setShowPreview(true);
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
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                {!certificateData.isIssued ? (
                  <>
                    <button
                      onClick={() => router.push(`/dashboard/audits/certifications/${resolvedParams.id}/edit`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                    >
                      Edit Template
                    </button>
                    <button
                      onClick={handlePreviewPDF}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                    >
                      Preview PDF
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

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Certificate Template Editor */}
          <WidgetCard title="Certificate Template">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 min-h-[800px] shadow-inner">
              {/* Header Image */}
              <div className="mb-8">
                <img
                  src="/img/5.png"
                  alt="Certification Header"
                  className="w-full h-auto max-h-24 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Certificate Header */}
              <div className="text-center mb-8">
                <div className="text-primary font-bold text-2xl mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={certificateData.certificationBody || "AssureHub Certification Body"}
                      onChange={(e) => setCertificateData({ ...certificateData, certificationBody: e.target.value })}
                      className="w-full text-center border-b border-gray-300 bg-transparent"
                    />
                  ) : (
                    certificateData.certificationBody || "AssureHub Certification Body"
                  )}
                </div>
                <div className="text-gray-600 text-sm">Accredited Certification Body</div>
                <div className="border-t-2 border-primary w-32 mx-auto mt-4"></div>
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
                  <div className="border-b-2 border-gray-300 pb-2 mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={certificateData.clientName}
                        onChange={(e) => setCertificateData({ ...certificateData, clientName: e.target.value })}
                        className="w-full text-center text-xl font-bold border-none bg-transparent"
                      />
                    ) : (
                      <p className="text-xl font-bold text-gray-800">{certificateData.clientName}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 text-sm">
                  <div>
                    <span className="font-semibold">Location:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={certificateData.location || certificateData.clientData?.address || "Client Location"}
                        onChange={(e) => setCertificateData({ ...certificateData, location: e.target.value })}
                        className="ml-2 border-b border-gray-300 bg-transparent flex-1"
                      />
                    ) : (
                      <span className="ml-2">{certificateData.location || certificateData.clientData?.address || "Client Location"}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Registration No:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={certificateData.registrationNumber || `REG-${certificateData.auditNumber}`}
                        onChange={(e) => setCertificateData({ ...certificateData, registrationNumber: e.target.value })}
                        className="ml-2 border-b border-gray-300 bg-transparent flex-1"
                      />
                    ) : (
                      <span className="ml-2">{certificateData.registrationNumber || `REG-${certificateData.auditNumber}`}</span>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-700 mb-2">has been assessed and found to conform to the requirements of:</p>
                  <div className="font-semibold text-lg text-primary mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={certificateData.standard}
                        onChange={(e) => setCertificateData({ ...certificateData, standard: e.target.value })}
                        className="w-full text-center border-b border-gray-300 bg-transparent"
                      />
                    ) : (
                      certificateData.standard
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold">Scope:</span>
                  {isEditing ? (
                    <textarea
                      value={certificateData.scope}
                      onChange={(e) => setCertificateData({ ...certificateData, scope: e.target.value })}
                      className="w-full mt-2 p-2 border border-gray-300 rounded bg-transparent"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2 text-gray-700">{certificateData.scope}</p>
                  )}
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 text-sm">
                  <div>
                    <span className="font-semibold">Certificate Number:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={certificateData.certificateNumber}
                        onChange={(e) => setCertificateData({ ...certificateData, certificateNumber: e.target.value })}
                        className="ml-2 border-b border-gray-300 bg-transparent"
                      />
                    ) : (
                      <span className="ml-2">{certificateData.certificateNumber}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Date of original registration:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={certificateData.originalRegistrationDate}
                        onChange={(e) => setCertificateData({ ...certificateData, originalRegistrationDate: e.target.value })}
                        className="ml-2 border-b border-gray-300 bg-transparent"
                      />
                    ) : (
                      <span className="ml-2">{certificateData.originalRegistrationDate}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Date of certificate (Issue):</span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={certificateData.issueDate}
                        onChange={(e) => setCertificateData({ ...certificateData, issueDate: e.target.value })}
                        className="ml-2 border-b border-gray-300 bg-transparent"
                      />
                    ) : (
                      <span className="ml-2">{certificateData.issueDate}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Date of certificate expiry:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={certificateData.expiryDate}
                        onChange={(e) => setCertificateData({ ...certificateData, expiryDate: e.target.value })}
                        className="ml-2 border-b border-gray-300 bg-transparent"
                      />
                    ) : (
                      <span className="ml-2">{certificateData.expiryDate}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Certificate Footer */}
              <div className="mt-12 grid gap-8 grid-cols-2 text-center text-sm">
                <div>
                  <div className="border-t border-gray-400 w-32 mx-auto mb-2"></div>
                  <p className="font-semibold">Lead Auditor</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={certificateData.leadAuditor}
                      onChange={(e) => setCertificateData({ ...certificateData, leadAuditor: e.target.value })}
                      className="text-center border-b border-gray-300 bg-transparent"
                    />
                  ) : (
                    <p>{certificateData.leadAuditor}</p>
                  )}
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
          </WidgetCard>

          {/* Certificate Information */}
          <div className="space-y-6">
            <WidgetCard title="Audit Information">
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
                    type="date"
                    value={certificateData.originalRegistrationDate}
                    onChange={(e) => setCertificateData({ ...certificateData, originalRegistrationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
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
                    type="date"
                    value={certificateData.issueDate}
                    onChange={(e) => setCertificateData({ ...certificateData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
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
                    type="date"
                    value={certificateData.expiryDate}
                    onChange={(e) => setCertificateData({ ...certificateData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
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

      {/* Certificate Preview Modal */}
      {showPreview && (
        <CertificatePreview
          certificateData={certificateData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </DashboardLayout>
  );
}