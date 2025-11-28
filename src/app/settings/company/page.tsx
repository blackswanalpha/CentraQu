"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { FormInput } from "@/components/Dashboard/form-input";
import { useForm } from "@/hooks/useForm";
import { 
  CompanyProfile, 
  CompanyProfileFormData,
  INDUSTRIES,
  COMPANY_SIZES,
  COMPANY_TYPES,
  COUNTRIES,
  Industry,
  CompanySize,
  CompanyType,
  Country,
} from "@/types/company";
import { GetCompanyProfileResponse, UpdateCompanyProfileResponse } from "@/types/company";

export default function CompanySettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<CompanyProfileFormData>({
    initialValues: {
      companyName: "",
      legalName: "",
      registrationNumber: "",
      taxId: "",
      companyType: "both" as CompanyType,
      industry: "Professional Services" as Industry,
      companySize: "11-50" as CompanySize,
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Kenya" as Country,
      description: "",
      established: "",
      certifications: [],
      accreditationBodies: [],
      linkedIn: "",
      twitter: "",
      facebook: "",
    },
    validate: (values) => {
      const errors: Partial<Record<keyof CompanyProfileFormData, string>> = {};
      
      if (!values.companyName || values.companyName.trim().length === 0) {
        errors.companyName = "Company name is required";
      }
      
      if (!values.email || values.email.trim().length === 0) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Invalid email address";
      }
      
      if (!values.phone || values.phone.trim().length === 0) {
        errors.phone = "Phone number is required";
      }
      
      if (!values.address || values.address.trim().length === 0) {
        errors.address = "Address is required";
      }
      
      if (!values.city || values.city.trim().length === 0) {
        errors.city = "City is required";
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      setIsSaving(true);
      setSuccessMessage("");
      setErrorMessage("");
      
      try {
        const response = await fetch("/api/company/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        
        const data: UpdateCompanyProfileResponse = await response.json();
        
        if (data.success) {
          setSuccessMessage("Company profile updated successfully!");
          setTimeout(() => setSuccessMessage(""), 5000);
        } else {
          setErrorMessage(data.error || "Failed to update company profile");
        }
      } catch (error) {
        console.error("Error updating company profile:", error);
        setErrorMessage("An error occurred while updating the profile");
      } finally {
        setIsSaving(false);
      }
    },
  });

  // Load company profile on mount
  useEffect(() => {
    async function loadCompanyProfile() {
      try {
        const response = await fetch("/api/company/profile");
        const data: GetCompanyProfileResponse = await response.json();
        
        if (data.success && data.data) {
          const profile = data.data;
          
          // Update form values
          form.setValues({
            companyName: profile.companyName,
            legalName: profile.legalName || "",
            registrationNumber: profile.registrationNumber || "",
            taxId: profile.taxId || "",
            companyType: profile.companyType,
            industry: profile.industry,
            companySize: profile.companySize,
            email: profile.email,
            phone: profile.phone,
            website: profile.website || "",
            address: profile.address,
            city: profile.city,
            state: profile.state || "",
            postalCode: profile.postalCode || "",
            country: profile.country,
            description: profile.description || "",
            established: profile.established ? new Date(profile.established).toISOString().split('T')[0] : "",
            certifications: profile.certifications || [],
            accreditationBodies: profile.accreditationBodies || [],
            linkedIn: profile.linkedIn || "",
            twitter: profile.twitter || "",
            facebook: profile.facebook || "",
          });
        }
      } catch (error) {
        console.error("Error loading company profile:", error);
        setErrorMessage("Failed to load company profile");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCompanyProfile();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading company profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Settings &gt; Company Profile
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Manage your company information and settings
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-300">✓ {successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-300">✗ {errorMessage}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <WidgetCard title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormInput
                  label="Company Name"
                  placeholder="Enter company name"
                  value={form.values.companyName}
                  onChange={(e) => form.handleChange("companyName", e.target.value)}
                  onBlur={() => form.handleBlur("companyName")}
                  error={form.touched.companyName ? form.errors.companyName : undefined}
                  required
                />
              </div>

              <FormInput
                label="Legal Name"
                placeholder="Enter legal name (if different)"
                value={form.values.legalName}
                onChange={(e) => form.handleChange("legalName", e.target.value)}
              />

              <FormInput
                label="Registration Number"
                placeholder="Enter registration number"
                value={form.values.registrationNumber}
                onChange={(e) => form.handleChange("registrationNumber", e.target.value)}
              />

              <FormInput
                label="Tax ID"
                placeholder="Enter tax identification number"
                value={form.values.taxId}
                onChange={(e) => form.handleChange("taxId", e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Company Type <span className="text-error">*</span>
                </label>
                <select
                  value={form.values.companyType}
                  onChange={(e) => form.handleChange("companyType", e.target.value as CompanyType)}
                  className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  {COMPANY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Industry <span className="text-error">*</span>
                </label>
                <select
                  value={form.values.industry}
                  onChange={(e) => form.handleChange("industry", e.target.value as Industry)}
                  className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Company Size <span className="text-error">*</span>
                </label>
                <select
                  value={form.values.companySize}
                  onChange={(e) => form.handleChange("companySize", e.target.value as CompanySize)}
                  className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} employees
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Established Date"
                type="date"
                value={form.values.established}
                onChange={(e) => form.handleChange("established", e.target.value)}
              />
            </div>
          </WidgetCard>

          {/* Contact Information */}
          <WidgetCard title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Email"
                type="email"
                placeholder="company@example.com"
                value={form.values.email}
                onChange={(e) => form.handleChange("email", e.target.value)}
                onBlur={() => form.handleBlur("email")}
                error={form.touched.email ? form.errors.email : undefined}
                required
              />

              <FormInput
                label="Phone"
                placeholder="+254 712 345 678"
                value={form.values.phone}
                onChange={(e) => form.handleChange("phone", e.target.value)}
                onBlur={() => form.handleBlur("phone")}
                error={form.touched.phone ? form.errors.phone : undefined}
                required
              />

              <div className="md:col-span-2">
                <FormInput
                  label="Website"
                  placeholder="https://www.example.com"
                  value={form.values.website}
                  onChange={(e) => form.handleChange("website", e.target.value)}
                />
              </div>
            </div>
          </WidgetCard>

          {/* Address Information */}
          <WidgetCard title="Address Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormInput
                  label="Street Address"
                  placeholder="Enter street address"
                  value={form.values.address}
                  onChange={(e) => form.handleChange("address", e.target.value)}
                  onBlur={() => form.handleBlur("address")}
                  error={form.touched.address ? form.errors.address : undefined}
                  required
                />
              </div>

              <FormInput
                label="City"
                placeholder="Enter city"
                value={form.values.city}
                onChange={(e) => form.handleChange("city", e.target.value)}
                onBlur={() => form.handleBlur("city")}
                error={form.touched.city ? form.errors.city : undefined}
                required
              />

              <FormInput
                label="State/County"
                placeholder="Enter state or county"
                value={form.values.state}
                onChange={(e) => form.handleChange("state", e.target.value)}
              />

              <FormInput
                label="Postal Code"
                placeholder="Enter postal code"
                value={form.values.postalCode}
                onChange={(e) => form.handleChange("postalCode", e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Country <span className="text-error">*</span>
                </label>
                <select
                  value={form.values.country}
                  onChange={(e) => form.handleChange("country", e.target.value as Country)}
                  className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </WidgetCard>

          {/* Additional Information */}
          <WidgetCard title="Additional Information">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Company Description
                </label>
                <textarea
                  placeholder="Brief description of your company..."
                  value={form.values.description}
                  onChange={(e) => form.handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
          </WidgetCard>

          {/* Social Media */}
          <WidgetCard title="Social Media">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="LinkedIn"
                placeholder="https://linkedin.com/company/..."
                value={form.values.linkedIn}
                onChange={(e) => form.handleChange("linkedIn", e.target.value)}
              />

              <FormInput
                label="Twitter"
                placeholder="https://twitter.com/..."
                value={form.values.twitter}
                onChange={(e) => form.handleChange("twitter", e.target.value)}
              />

              <div className="md:col-span-2">
                <FormInput
                  label="Facebook"
                  placeholder="https://facebook.com/..."
                  value={form.values.facebook}
                  onChange={(e) => form.handleChange("facebook", e.target.value)}
                />
              </div>
            </div>
          </WidgetCard>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

