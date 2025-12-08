"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@/hooks/useForm";

interface SetupFormValues {
  companyName: string;
  industry: string;
  teamSize: string;
  country: string;
}

export default function SetupWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useForm<SetupFormValues>({
      initialValues: {
        companyName: "",
        industry: "",
        teamSize: "",
        country: "",
      },
      validate: (values) => {
        const newErrors: Partial<Record<keyof SetupFormValues, string>> = {};

        if (!values.companyName) {
          newErrors.companyName = "Company name is required";
        }

        if (!values.industry) {
          newErrors.industry = "Industry is required";
        }

        if (!values.teamSize) {
          newErrors.teamSize = "Team size is required";
        }

        if (!values.country) {
          newErrors.country = "Country is required";
        }

        return newErrors;
      },
      onSubmit: async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Redirect to completion page
          router.push("/auth/complete");
        } catch (error) {
          console.error("Setup error:", error);
        }
      },
    });

  return (
    <div className="animate-fade-in">
      <div className="card">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-dark">Quick Setup Wizard</h1>
          <p className="mb-4 text-sm text-gray-6">
            Step {step} of 4
          </p>

          {/* Progress Bar */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-stroke"
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div className="form-field">
                <label htmlFor="companyName" className="input-label">
                  Company Name <span className="text-error">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="Your company name"
                  value={values.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  onBlur={() => handleBlur("companyName")}
                  className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    touched.companyName && errors.companyName ? "border-error" : "border-stroke"
                  }`}
                  disabled={isSubmitting}
                />
                {touched.companyName && errors.companyName && (
                  <span className="input-error">{errors.companyName}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="industry" className="input-label">
                  Industry/Sector <span className="text-error">*</span>
                </label>
                <select
                  id="industry"
                  value={values.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  onBlur={() => handleBlur("industry")}
                  className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    touched.industry && errors.industry ? "border-error" : "border-stroke"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select an industry</option>
                  <option value="audit">Audit & Compliance</option>
                  <option value="consulting">Consulting</option>
                  <option value="finance">Finance</option>
                  <option value="tech">Technology</option>
                  <option value="other">Other</option>
                </select>
                {touched.industry && errors.industry && (
                  <span className="input-error">{errors.industry}</span>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-field">
                <label htmlFor="teamSize" className="input-label">
                  Company Size <span className="text-error">*</span>
                </label>
                <select
                  id="teamSize"
                  value={values.teamSize}
                  onChange={(e) => handleChange("teamSize", e.target.value)}
                  onBlur={() => handleBlur("teamSize")}
                  className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    touched.teamSize && errors.teamSize ? "border-error" : "border-stroke"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select team size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-100">51-200 employees</option>
                  <option value="100+">200+ employees</option>
                </select>
                {touched.teamSize && errors.teamSize && (
                  <span className="input-error">{errors.teamSize}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="country" className="input-label">
                  Country <span className="text-error">*</span>
                </label>
                <select
                  id="country"
                  value={values.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  onBlur={() => handleBlur("country")}
                  className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    touched.country && errors.country ? "border-error" : "border-stroke"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select a country</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                  <option value="other">Other</option>
                </select>
                {touched.country && errors.country && (
                  <span className="input-error">{errors.country}</span>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="rounded-lg border border-primary bg-blue-50 p-6">
              <h3 className="mb-4 font-semibold text-primary text-lg">Setup Summary</h3>
              <ul className="space-y-3 text-sm text-dark">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Company: <strong>{values.companyName}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Industry: <strong>{values.industry}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Team Size: <strong>{values.teamSize}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>Country: <strong>{values.country}</strong></span>
                </li>
              </ul>
            </div>
          )}

          {step === 4 && (
            <div className="rounded-lg border border-success bg-success-light p-6 text-center">
              <div className="mb-4 text-5xl text-success">✓</div>
              <h3 className="mb-2 font-semibold text-success text-lg">Setup Complete!</h3>
              <p className="text-sm text-gray-6">
                Your CentraQu management platform is ready. Here's what we've set up:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-dark text-left">
                <li>✓ Company profile configured</li>
                <li>✓ Zoho Books integration connected</li>
                <li>✓ Team members invited (5 users)</li>
                <li>✓ Document folders created</li>
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border-2 border-success px-6 py-3 font-semibold text-success transition-all hover:bg-success hover:text-white active:scale-95 disabled:opacity-50"
              >
                BACK
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50"
              >
                NEXT STEP
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Completing..." : "GO TO DASHBOARD"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

