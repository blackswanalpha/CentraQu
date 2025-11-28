"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { CertificationForm } from "@/components/Certifications/certification-form";
import { Button } from "@/components/Dashboard/button";
import { Certification } from "@/types/audit";
import { getCertification, updateCertification } from "@/lib/api/certifications";

export default function EditCertificationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [certification, setCertification] = useState<Certification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const data = await getCertification(id);
        setCertification(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load certification");
        console.error("Error loading certification:", err);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchCertification();
    }
  }, [id]);

  const handleSubmit = async (data: Partial<Certification>) => {
    if (!certification) return;

    setIsLoading(true);
    setError(null);

    try {
      await updateCertification(certification.id, data);
      console.log("Updated certification:", data);

      // Redirect to certification detail
      router.push(`/certifications/${certification.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update certification"
      );
      console.error("Error updating certification:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
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
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-error mb-4">{error || "Certification not found"}</p>
            <Button variant="primary" onClick={() => router.push("/certifications")}>
              Back to Certifications
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            Edit Certification
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Update certification details for {certification.clientName}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Form */}
        <CertificationForm
          certification={certification}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}

