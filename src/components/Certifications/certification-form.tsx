"use client";

import { useState } from "react";
import { Certification, CertificationStandard, AuditType } from "@/types/audit";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";

interface CertificationFormProps {
  certification?: Certification;
  onSubmit: (data: Partial<Certification>) => Promise<void>;
  isLoading?: boolean;
}

const CERTIFICATION_STANDARDS: CertificationStandard[] = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001:2018",
  "ISO 27001:2013",
  "ISO 22000:2018",
];

const AUDIT_TYPES: AuditType[] = [
  "stage-1",
  "stage-2",
  "surveillance",
  "recertification",
  "gap-analysis",
  "follow-up",
];

export function CertificationForm({
  certification,
  onSubmit,
  isLoading = false,
}: CertificationFormProps) {
  const [formData, setFormData] = useState<Partial<Certification>>(
    certification || {
      clientId: "",
      clientName: "",
      standard: "ISO 9001:2015",
      certificateNumber: "",
      issueDate: new Date(),
      expiryDate: new Date(),
      status: "pending",
      scope: "",
      auditType: "stage-2",
      leadAuditor: "",
      auditorEmail: "",
      auditorPhone: "",
      certificationBody: "",
      accreditationNumber: "",
      documentUrl: "",
      notes: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName?.trim()) {
      newErrors.clientName = "Client name is required";
    }
    if (!formData.certificateNumber?.trim()) {
      newErrors.certificateNumber = "Certificate number is required";
    }
    if (!formData.leadAuditor?.trim()) {
      newErrors.leadAuditor = "Lead auditor is required";
    }
    if (!formData.scope?.trim()) {
      newErrors.scope = "Scope is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Client Name"
            name="clientName"
            value={formData.clientName || ""}
            onChange={handleInputChange}
            error={errors.clientName}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Certification Standard
            </label>
            <select
              name="standard"
              value={formData.standard || "ISO 9001:2015"}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
            >
              {CERTIFICATION_STANDARDS.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="Certificate Number"
            name="certificateNumber"
            value={formData.certificateNumber || ""}
            onChange={handleInputChange}
            error={errors.certificateNumber}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Audit Type
            </label>
            <select
              name="auditType"
              value={formData.auditType || "stage-2"}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
            >
              {AUDIT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace("-", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="Issue Date"
            name="issueDate"
            type="date"
            value={
              formData.issueDate
                ? new Date(formData.issueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={
              formData.expiryDate
                ? new Date(formData.expiryDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Auditor Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Auditor Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Lead Auditor"
            name="leadAuditor"
            value={formData.leadAuditor || ""}
            onChange={handleInputChange}
            error={errors.leadAuditor}
            required
          />

          <FormInput
            label="Auditor Email"
            name="auditorEmail"
            type="email"
            value={formData.auditorEmail || ""}
            onChange={handleInputChange}
          />

          <FormInput
            label="Auditor Phone"
            name="auditorPhone"
            value={formData.auditorPhone || ""}
            onChange={handleInputChange}
          />

          <FormInput
            label="Certification Body"
            name="certificationBody"
            value={formData.certificationBody || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Scope & Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Scope & Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scope
            </label>
            <textarea
              name="scope"
              value={formData.scope || ""}
              onChange={handleInputChange}
              placeholder="Enter certification scope"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
            />
            {errors.scope && (
              <p className="text-sm text-error mt-1">{errors.scope}</p>
            )}
          </div>

          <FormInput
            label="Accreditation Number"
            name="accreditationNumber"
            value={formData.accreditationNumber || ""}
            onChange={handleInputChange}
          />

          <FormInput
            label="Document URL"
            name="documentUrl"
            value={formData.documentUrl || ""}
            onChange={handleInputChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleInputChange}
              placeholder="Additional notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button variant="primary" type="submit" loading={isLoading}>
          {certification ? "Update Certification" : "Create Certification"}
        </Button>
      </div>
    </form>
  );
}

