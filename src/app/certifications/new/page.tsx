"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { CertificationForm } from "@/components/Certifications/certification-form";
import { Certification } from "@/types/audit";
import { createCertification } from "@/lib/api/certifications";

export default function NewCertificationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Partial<Certification>) => {
    setIsLoading(true);
    setError(null);

    try {
      const created = await createCertification(data);
      console.log("Created certification:", created);

      // Redirect to certification detail page
      router.push(`/certifications/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create certification"
      );
      console.error("Error creating certification:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-primary-hover mb-4 text-sm font-medium"
          >
            ← Back
          </button>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Add New Certification
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Create a new certification record for a client
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Form */}
        <CertificationForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}

