"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { ClientForm } from "@/components/Clients/client-form";
import { Client } from "@/types/audit";
import { clientService } from "@/services/client.service";

export default function AddClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Client) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create client via backend API
      const newClient = await clientService.createClient(data);
      console.log("Client created successfully:", newClient);

      // Redirect to clients page
      router.push("/clients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add client");
      console.error("Error adding client:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Add New Client
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Create a new client account and set up their audit profile
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Form */}
        <ClientForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}

