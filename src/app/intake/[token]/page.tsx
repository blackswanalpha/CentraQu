"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Dashboard/button";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { ValidateIntakeLinkResponse, SubmitIntakeFormResponse } from "@/types/client-intake";
import { Client, CertificationStandard } from "@/types/audit";
import { formatAccessCode, getTimeRemaining } from "@/lib/intake-utils";
import { useCompanyAutofill } from "@/hooks/useCompanyAutofill";

const CERTIFICATION_OPTIONS: CertificationStandard[] = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001:2018",
  "ISO 27001:2013",
  "ISO 22000:2018",
];

export default function IntakeFormPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string>("");
  const [step, setStep] = useState<"access" | "form" | "success" | "error">("access");
  const [accessCode, setAccessCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [linkInfo, setLinkInfo] = useState<any>(null);

  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    siteContact: "",
    sitePhone: "",
    industry: "",
    certifications: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Company autofill hook
  const { fetchAutofillData, applyAutofill, isLoading: isAutofillLoading } = useCompanyAutofill({
    onSuccess: () => {
      // Autofill data loaded successfully
    },
    onError: (error) => {
      console.error("Autofill error:", error);
    },
  });

  useEffect(() => {
    params.then(p => setToken(p.token));
  }, [params]);

  const handleAccessCodeChange = (value: string) => {
    const formatted = formatAccessCode(value);
    setAccessCode(formatted);
  };

  const handleValidateAccess = async () => {
    setIsValidating(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/intake/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkToken: token, accessCode }),
      });

      const data: ValidateIntakeLinkResponse = await response.json();

      if (data.success && data.data?.isValid) {
        setLinkInfo(data.data.link);
        setStep("form");
      } else {
        setErrorMessage(data.data?.message || "Invalid access code");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  // Handle autofill button click
  const handleAutofill = async () => {
    await fetchAutofillData();
    applyAutofill({
      companyName: (value) => setFormData(prev => ({ ...prev, name: value })),
      email: (value) => setFormData(prev => ({ ...prev, email: value })),
      phone: (value) => setFormData(prev => ({ ...prev, phone: value })),
      address: (value) => setFormData(prev => ({ ...prev, address: value })),
      industry: (value) => setFormData(prev => ({ ...prev, industry: value })),
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Company name is required";
    if (!formData.contact?.trim()) newErrors.contact = "Contact person is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/intake/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessCode,
          clientData: formData,
        }),
      });

      const data: SubmitIntakeFormResponse = await response.json();

      if (data.success) {
        setStep("success");
      } else {
        setErrorMessage(data.error || "Failed to submit form");
      }
    } catch (error) {
      setErrorMessage("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCertificationToggle = (cert: CertificationStandard) => {
    const current = formData.certifications || [];
    const updated = current.includes(cert)
      ? current.filter(c => c !== cert)
      : [...current, cert];
    setFormData({ ...formData, certifications: updated });
  };

  // Access Code Step
  if (step === "access") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-dark dark:text-white">
              Client Intake Form
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please enter your access code to continue
            </p>
          </div>

          <WidgetCard>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Access Code
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => handleAccessCodeChange(e.target.value)}
                  placeholder="XXXX-XXXX"
                  maxLength={9}
                  className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-lg font-mono text-center uppercase focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                />
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                )}
              </div>

              <Button
                variant="primary"
                onClick={handleValidateAccess}
                disabled={isValidating || accessCode.length < 9}
                className="w-full"
              >
                {isValidating ? "Validating..." : "Continue"}
              </Button>
            </div>
          </WidgetCard>
        </div>
      </div>
    );
  }

  // Success Step
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-dark dark:text-white">
              Thank You!
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Your information has been submitted successfully.
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Our team will review your submission and contact you soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Form Step
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Client Information Form
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please provide your company information below
          </p>
          {linkInfo?.expiresAt && (
            <p className="mt-1 text-sm text-gray-500">
              This form expires in {getTimeRemaining(new Date(linkInfo.expiresAt))}
            </p>
          )}
        </div>

        <WidgetCard>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-dark dark:text-white">
                  Basic Information
                </h2>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAutofill}
                  disabled={isAutofillLoading}
                  className="text-sm"
                >
                  {isAutofillLoading ? "Loading..." : "🔄 Autofill Company Details"}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-lg border-2 ${errors.name ? 'border-red-500' : 'border-stroke'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className={`w-full rounded-lg border-2 ${errors.contact ? 'border-red-500' : 'border-stroke'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded-lg border-2 ${errors.email ? 'border-red-500' : 'border-stroke'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full rounded-lg border-2 ${errors.phone ? 'border-red-500' : 'border-stroke'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className={`w-full rounded-lg border-2 ${errors.address ? 'border-red-500' : 'border-stroke'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Site Information */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">
                Site Information (Optional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Site Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.siteContact}
                    onChange={(e) => setFormData({ ...formData, siteContact: e.target.value })}
                    className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Site Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.sitePhone}
                    onChange={(e) => setFormData({ ...formData, sitePhone: e.target.value })}
                    className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">
                Additional Information (Optional)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., Manufacturing, Technology, Healthcare"
                    className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Certifications of Interest
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {CERTIFICATION_OPTIONS.map((cert) => (
                      <label key={cert} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.certifications?.includes(cert)}
                          onChange={() => handleCertificationToggle(cert)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-dark dark:text-white">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Information"}
              </Button>
              <p className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400">
                * Required fields
              </p>
            </div>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}

