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
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <main className="flex flex-1 flex-col items-center justify-start p-4 sm:p-6 md:p-10">
          <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            
            {/* Header with Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="size-10 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_535)">
                    <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_6_535">
                      <rect fill="white" height="48" width="48"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">CentraQu</h2>
            </div>
            
            {/* Organization Profile Card */}
            <div className="w-full flex flex-col items-center p-6 sm:p-8 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-24 bg-slate-100 dark:bg-slate-800 p-2 mb-4 flex items-center justify-center">
                <div className="h-16 w-16 text-primary flex items-center justify-center">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                    <g clipPath="url(#clip0_6_535)">
                      <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"/>
                    </g>
                  </svg>
                </div>
              </div>
              
              <div className="flex flex-col mb-6 text-center">
                <p className="text-slate-900 dark:text-white text-[28px] font-bold leading-tight tracking-[-0.015em]">
                  {form.values.companyName || "Your Organization"}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                  {form.values.industry} • {form.values.companySize} employees
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-6">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <span className="truncate">View Public Profile</span>
                </button>
                <button 
                  type="submit" 
                  form="company-form"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-hover transition-colors"
                  disabled={isSaving}
                >
                  <span className="truncate">{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
      
        <div className="w-full space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Organization Details
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage your organization information and settings
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

        <form id="company-form" onSubmit={form.handleSubmit} className="space-y-6">
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

          {/* Action Buttons - Moved to top card, keeping this for mobile fallback */}
          <div className="flex justify-end gap-4 sm:hidden">
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
        </div>
        </main>
      </div>
    </DashboardLayout>
  );
}

