"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Badge } from "@/components/Dashboard/badge";
import { Button } from "@/components/Dashboard/button";
import { Certification, CertificationStatus } from "@/types/audit";
import { getCertification, generateCertificate } from "@/lib/api/certifications";

const statusLabels: Record<CertificationStatus, string> = {
  active: "Active",
  "expiring-soon": "Expiring Soon",
  expired: "Expired",
  suspended: "Suspended",
  revoked: "Revoked",
  pending: "Pending",
};

export default function CertificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [certification, setCertification] = useState<Certification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCertification(id);
        setCertification(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load certification");
        console.error("Error loading certification:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCertification();
    }
  }, [id]);

  const handleGenerateCertificate = async () => {
    if (!certification) return;

    setIsGenerating(true);
    try {
      await generateCertificate(certification.id);
      // Refresh certification data to get updated document URL
      const updated = await getCertification(id);
      setCertification(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate certificate");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !certification) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-error mb-4">{error || "Certification not found"}</p>
          <Button variant="primary" onClick={() => router.push("/certifications")}>
            Back to Certifications
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Extract data from API response format
  const clientName = certification.client?.name || certification.clientName || 'Unknown Client';
  const standard = certification.iso_standard?.code || certification.standard || 'Unknown Standard';
  const certificateNumber = certification.certificate_number || certification.certificateNumber || 'N/A';
  const issueDate = certification.issue_date || certification.issueDate;
  const expiryDate = certification.expiry_date || certification.expiryDate;
  const scope = certification.scope || 'No scope defined';
  const certificationBody = certification.certification_body || certification.certificationBody || 'N/A';
  const accreditationNumber = certification.accreditation_number || certification.accreditationNumber || 'N/A';
  const documentUrl = certification.document_url || certification.documentUrl;
  const notes = certification.notes;
  const createdAt = certification.created_at || certification.createdAt;
  const updatedAt = certification.updated_at || certification.updatedAt;

  // Lead auditor information
  const leadAuditorName = certification.lead_auditor
    ? `${certification.lead_auditor.first_name} ${certification.lead_auditor.last_name}`.trim() || certification.lead_auditor.username
    : certification.leadAuditor || 'N/A';
  const leadAuditorEmail = certification.lead_auditor?.email || certification.auditorEmail;
  const leadAuditorPhone = certification.auditorPhone; // Not in API response, only in legacy

  // Calculate days until expiry
  const daysUntilExpiry = certification.days_until_expiry ?? Math.ceil(
    (new Date(expiryDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="text-primary hover:text-primary-hover mb-2 text-sm font-medium"
            >
              ← Back
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-heading-1 font-bold text-dark dark:text-white">
                {standard}
              </h1>
              <Badge
                label={statusLabels[certification.status]}
                variant="neutral"
              />
            </div>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              {clientName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleGenerateCertificate}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Certificate"}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/certifications/${certification.id}/edit`)
              }
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/certifications")}
            >
              Back
            </Button>
          </div>
        </div>

        {/* Certificate Information */}
        <WidgetCard title="Certificate Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Certificate Number
              </p>
              <p className="font-medium text-dark dark:text-white">
                {certificateNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Certification Standard
              </p>
              <p className="font-medium text-dark dark:text-white">
                {standard}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Issue Date
              </p>
              <p className="font-medium text-dark dark:text-white">
                {new Date(issueDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Expiry Date
              </p>
              <p
                className={`font-medium ${
                  daysUntilExpiry <= 90 && daysUntilExpiry > 0
                    ? "text-accent"
                    : certification.status === "expired"
                      ? "text-error"
                      : "text-dark dark:text-white"
                }`}
              >
                {new Date(expiryDate).toLocaleDateString()}
                {daysUntilExpiry > 0 && (
                  <span className="text-xs ml-2">({daysUntilExpiry} days)</span>
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Certification Body
              </p>
              <p className="font-medium text-dark dark:text-white">
                {certificationBody}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Accreditation Number
              </p>
              <p className="font-medium text-dark dark:text-white">
                {accreditationNumber}
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Auditor Information */}
        <WidgetCard title="Auditor Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Lead Auditor
              </p>
              <p className="font-medium text-dark dark:text-white">
                {leadAuditorName}
              </p>
            </div>

            {leadAuditorEmail && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${leadAuditorEmail}`}
                  className="text-primary hover:underline"
                >
                  {leadAuditorEmail}
                </a>
              </div>
            )}

            {leadAuditorPhone && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${leadAuditorPhone}`}
                  className="text-primary hover:underline"
                >
                  {leadAuditorPhone}
                </a>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Scope */}
        <WidgetCard title="Scope">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {scope}
          </p>
        </WidgetCard>

        {/* Additional Information */}
        <WidgetCard title="Additional Information">
          <div className="space-y-4">
            {documentUrl && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Certificate Document
                </p>
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Download Certificate
                </a>
              </div>
            )}

            {notes && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Notes
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {notes}
                </p>
              </div>
            )}

            {createdAt && updatedAt && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created: {new Date(createdAt).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last Updated: {new Date(updatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

