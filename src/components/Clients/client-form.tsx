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

const CERTIFICATION_DISPLAY: Record<string, string> = {
  "ISO 9001:2015": "Quality Management System (ISO 9001)",
  "ISO 14001:2015": "Environmental Management (ISO 14001)",
  "ISO 45001:2018": "Occupational Health & Safety (ISO 45001)",
  "ISO 27001:2013": "Information Security (ISO 27001)",
  "ISO 22000:2018": "Food Safety Management (ISO 22000)",
};

const CLIENT_STATUSES: ClientStatus[] = ["active", "inactive", "at-risk", "churned"];

const CURRENCY_CHOICES = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'KES', label: 'Kenyan Shilling (KES)' },
  { value: 'TZS', label: 'Tanzanian Shilling (TZS)' },
  { value: 'UGX', label: 'Ugandan Shilling (UGX)' },
];

export function ClientForm({ client, onSubmit, isLoading = false }: ClientFormProps) {
  // Convert null values to empty strings to avoid React warnings
  const initialValues: Client = client ? {
    ...client,
    name: client.name ?? "",
    contact: client.contact ?? "",
    email: client.email ?? "",
    phone: client.phone ?? "",
    address: client.address ?? "",
    website: client.website ?? "",
    currency: client.currency ?? "USD",
    sites: client.sites ?? [],
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
    website: "",
    currency: "USD",
    sites: [],
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

  const addSite = () => {
    const currentSites = form.values.sites || [];
    form.handleChange("sites", [...currentSites, { name: "", contact: "", phone: "", address: "" }]);
  };

  const removeSite = (index: number) => {
    const currentSites = form.values.sites || [];
    form.handleChange("sites", currentSites.filter((_, i) => i !== index));
  };

  const updateSite = (index: number, field: keyof import("@/types/audit").ClientSite, value: string) => {
    const currentSites = form.values.sites || [];
    const newSites = [...currentSites];
    newSites[index] = { ...newSites[index], [field]: value };
    form.handleChange("sites", newSites);
  };

  return (
    <form onSubmit={form.handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">domain</span>
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Organization Name"
            placeholder="Enter organization name"
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
            label="Primary Contact"
            placeholder="Enter contact person name"
            value={form.values.contact}
            onChange={(e) => form.handleChange("contact", e.target.value)}
            onBlur={() => form.handleBlur("contact")}
            error={form.touched.contact ? form.errors.contact : undefined}
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={form.values.email}
            onChange={(e) => form.handleChange("email", e.target.value)}
            onBlur={() => form.handleBlur("email")}
            error={form.touched.email ? form.errors.email : undefined}
            required
          />

          <FormInput
            label="Phone Number"
            type="tel"
            placeholder="Enter phone number"
            value={form.values.phone}
            onChange={(e) => form.handleChange("phone", e.target.value)}
            onBlur={() => form.handleBlur("phone")}
            error={form.touched.phone ? form.errors.phone : undefined}
            required
          />

          <FormInput
            label="Website"
            type="url"
            placeholder="https://example.com"
            value={form.values.website}
            onChange={(e) => form.handleChange("website", e.target.value)}
          />

          <div className="md:col-span-2">
            <FormInput
              label="Headquarters Address"
              placeholder="Enter full address"
              value={form.values.address}
              onChange={(e) => form.handleChange("address", e.target.value)}
              onBlur={() => form.handleBlur("address")}
              error={form.touched.address ? form.errors.address : undefined}
              required
            />
          </div>
        </div>
      </div>

      {/* Site Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-dark dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">location_on</span>
            Site Information
          </h3>
          <Button type="button" variant="secondary" onClick={addSite} size="sm">
            <span className="material-symbols-outlined text-sm mr-1">add</span>
            Add Site
          </Button>
        </div>

        <div className="space-y-6">
          {form.values.sites?.map((site, index) => (
            <div key={index} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 relative group">
              <button
                type="button"
                onClick={() => removeSite(index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>

              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Site #{index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Site Name"
                  placeholder="e.g. West Coast Branch"
                  value={site.name}
                  onChange={(e) => updateSite(index, "name", e.target.value)}
                />
                <FormInput
                  label="Site Contact"
                  placeholder="Site manager name"
                  value={site.contact}
                  onChange={(e) => updateSite(index, "contact", e.target.value)}
                />
                <FormInput
                  label="Site Phone"
                  placeholder="Site phone number"
                  value={site.phone}
                  onChange={(e) => updateSite(index, "phone", e.target.value)}
                />
                <FormInput
                  label="Site Address"
                  placeholder="Site address"
                  value={site.address}
                  onChange={(e) => updateSite(index, "address", e.target.value)}
                />
              </div>
            </div>
          ))}

          {(!form.values.sites || form.values.sites.length === 0) && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <p>No additional sites added.</p>
              <button type="button" onClick={addSite} className="text-primary hover:underline mt-2 text-sm font-medium">
                Add a site location
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status & Certifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">verified</span>
          Status & Certifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Client Status
            </label>
            <div className="relative">
              <select
                value={form.values.status || "active"}
                onChange={(e) => form.handleChange("status", e.target.value as ClientStatus)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="at-risk">At Risk</option>
                <option value="churned">Churned</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Primary Currency
            </label>
            <div className="relative">
              <select
                value={form.values.currency || "USD"}
                onChange={(e) => form.handleChange("currency", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
              >
                {CURRENCY_CHOICES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Initial Health Score
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.values.healthScore || 100}
              onChange={(e) => form.handleChange("healthScore", parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-dark dark:text-white">
            Active Certifications
          </label>
          <div className="grid grid-cols-1 gap-4">
            {CERTIFICATION_STANDARDS.map((cert) => (
              <label key={cert} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.values.certifications?.includes(cert)
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${form.values.certifications?.includes(cert)
                    ? "bg-primary border-primary"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  }`}>
                  {form.values.certifications?.includes(cert) && (
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
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
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {CERTIFICATION_DISPLAY[cert] || cert}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary" type="button" className="min-w-[100px]">
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isLoading} className="min-w-[140px]">
          {client ? "Update Client" : "Create Client"}
          <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
        </Button>
      </div>
    </form>
  );
}

