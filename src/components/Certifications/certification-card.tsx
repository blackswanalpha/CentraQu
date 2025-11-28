"use client";

import { useRouter } from "next/navigation";
import { Certification, CertificationStatus } from "@/types/audit";
import { Badge } from "@/components/Dashboard/badge";

interface CertificationCardProps {
  certification: Certification;
  onEdit?: (certification: Certification) => void;
  onDelete?: (certificationId: string) => void;
}


const statusLabels: Record<CertificationStatus, string> = {
  active: "Active",
  "expiring-soon": "Expiring Soon",
  expired: "Expired",
  suspended: "Suspended",
  revoked: "Revoked",
  pending: "Pending",
};

export function CertificationCard({
  certification,
  onEdit,
  onDelete,
}: CertificationCardProps) {
  const router = useRouter();
  const status = certification.status;

  // Handle both API format and legacy format
  const clientName = certification.client?.name || certification.clientName || 'Unknown Client';
  const standard = certification.iso_standard?.code || certification.standard || 'Unknown Standard';
  const certificateNumber = certification.certificate_number || certification.certificateNumber || 'N/A';
  const issueDate = certification.issue_date || certification.issueDate;
  const expiryDate = certification.expiry_date || certification.expiryDate;
  const leadAuditorName = certification.lead_auditor
    ? `${certification.lead_auditor.first_name} ${certification.lead_auditor.last_name}`.trim() || certification.lead_auditor.username
    : certification.leadAuditor || 'N/A';
  const scope = certification.scope || 'No scope defined';

  // Calculate days until expiry
  const daysUntilExpiry = certification.days_until_expiry ?? Math.ceil(
    (new Date(expiryDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const isExpiringSoon = certification.is_expiring_soon ?? (daysUntilExpiry <= 90 && daysUntilExpiry > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            onClick={() => router.push(`/certifications/${certification.id}`)}
            className="text-lg font-bold text-dark dark:text-white hover:text-primary transition-colors cursor-pointer"
          >
            {standard}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {clientName}
          </p>
        </div>
        <Badge label={statusLabels[status]} variant="neutral" />
      </div>

      {/* Certificate Number */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Certificate Number
        </p>
        <p className="text-sm font-medium text-dark dark:text-white">
          {certificateNumber}
        </p>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Issue Date</p>
          <p className="text-sm font-medium text-dark dark:text-white">
            {new Date(issueDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Expiry Date</p>
          <p
            className={`text-sm font-medium ${
              isExpiringSoon
                ? "text-accent"
                : status === "expired"
                  ? "text-error"
                  : "text-dark dark:text-white"
            }`}
          >
            {new Date(expiryDate).toLocaleDateString()}
            {isExpiringSoon && (
              <span className="text-xs ml-2">({daysUntilExpiry} days)</span>
            )}
          </p>
        </div>
      </div>

      {/* Lead Auditor */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Lead Auditor</p>
        <p className="text-sm font-medium text-dark dark:text-white">
          {leadAuditorName}
        </p>
      </div>

      {/* Scope */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Scope</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
          {scope}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/certifications/${certification.id}`)}
          className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors text-center"
        >
          View Details
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(certification)}
            className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(certification.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

