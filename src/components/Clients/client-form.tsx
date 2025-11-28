"use client";

import { Client, ClientStatus, CertificationStandard } from "@/types/audit";
import { FormInput } from "@/components/Dashboard/form-input";
import { Button } from "@/components/Dashboard/button";
import { useForm } from "@/hooks/useForm";
import { validateEmail } from "@/lib/utils";

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: Client) => Promise<void>;
  isLoading?: boolean;
}

const CERTIFICATION_STANDARDS: CertificationStandard[] = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001:2018",
  "ISO 27001:2013",
  "ISO 22000:2018",
];

const CLIENT_STATUSES: ClientStatus[] = ["active", "inactive", "at-risk", "churned"];

export function ClientForm({ client, onSubmit, isLoading = false }: ClientFormProps) {
  // Convert null values to empty strings to avoid React warnings
  const initialValues: Client = client ? {
    ...client,
    name: client.name ?? "",
    contact: client.contact ?? "",
    email: client.email ?? "",
    phone: client.phone ?? "",
    address: client.address ?? "",
    siteContact: client.siteContact ?? "",
    sitePhone: client.sitePhone ?? "",
    industry: client.industry ?? "",
    certifications: client.certifications ?? [],
    healthScore: client.healthScore ?? 100,
  } : {
    id: "",
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    siteContact: "",
    sitePhone: "",
    status: "active",
    industry: "",
    certifications: [],
    healthScore: 100,
  };

  const validate = (values: Client) => {
    const errors: Partial<Record<keyof Client, string>> = {};

    if (!values.name?.trim()) errors.name = "Client name is required";
    if (!values.contact?.trim()) errors.contact = "Contact person is required";
    if (!values.email?.trim()) errors.email = "Email is required";
    else if (!validateEmail(values.email)) errors.email = "Invalid email format";
    if (!values.phone?.trim()) errors.phone = "Phone is required";
    if (!values.address?.trim()) errors.address = "Address is required";

    return errors;
  };

  const form = useForm({
    initialValues,
    onSubmit,
    validate,
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Client Name"
            placeholder="Enter client name"
            value={form.values.name}
            onChange={(e) => form.handleChange("name", e.target.value)}
            onBlur={() => form.handleBlur("name")}
            error={form.touched.name ? form.errors.name : undefined}
            required
          />

          <FormInput
            label="Industry"
            placeholder="e.g., Manufacturing, Healthcare"
            value={form.values.industry}
            onChange={(e) => form.handleChange("industry", e.target.value)}
          />

          <FormInput
            label="Contact Person"
            placeholder="Enter contact person name"
            value={form.values.contact}
            onChange={(e) => form.handleChange("contact", e.target.value)}
            onBlur={() => form.handleBlur("contact")}
            error={form.touched.contact ? form.errors.contact : undefined}
            required
          />

          <FormInput
            label="Email"
            type="email"
            placeholder="Enter email address"
            value={form.values.email}
            onChange={(e) => form.handleChange("email", e.target.value)}
            onBlur={() => form.handleBlur("email")}
            error={form.touched.email ? form.errors.email : undefined}
            required
          />

          <FormInput
            label="Phone"
            type="tel"
            placeholder="Enter phone number"
            value={form.values.phone}
            onChange={(e) => form.handleChange("phone", e.target.value)}
            onBlur={() => form.handleBlur("phone")}
            error={form.touched.phone ? form.errors.phone : undefined}
            required
          />

          <FormInput
            label="Address"
            placeholder="Enter address"
            value={form.values.address}
            onChange={(e) => form.handleChange("address", e.target.value)}
            onBlur={() => form.handleBlur("address")}
            error={form.touched.address ? form.errors.address : undefined}
            required
          />
        </div>
      </div>

      {/* Site Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
          Site Information (Optional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Site Contact"
            placeholder="Enter site contact person"
            value={form.values.siteContact}
            onChange={(e) => form.handleChange("siteContact", e.target.value)}
          />

          <FormInput
            label="Site Phone"
            type="tel"
            placeholder="Enter site phone number"
            value={form.values.sitePhone}
            onChange={(e) => form.handleChange("sitePhone", e.target.value)}
          />
        </div>
      </div>

      {/* Status & Certifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
          Status & Certifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Status
            </label>
            <select
              value={form.values.status || "active"}
              onChange={(e) => form.handleChange("status", e.target.value as ClientStatus)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CLIENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Health Score
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.values.healthScore || 100}
              onChange={(e) => form.handleChange("healthScore", parseInt(e.target.value))}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-dark dark:text-white">
            Certifications
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CERTIFICATION_STANDARDS.map((cert) => (
              <label key={cert} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.values.certifications?.includes(cert) || false}
                  onChange={(e) => {
                    const certs = form.values.certifications || [];
                    if (e.target.checked) {
                      form.handleChange("certifications", [...certs, cert]);
                    } else {
                      form.handleChange(
                        "certifications",
                        certs.filter((c) => c !== cert)
                      );
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{cert}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isLoading}>
          {client ? "Update Client" : "Add Client"}
        </Button>
      </div>
    </form>
  );
}

