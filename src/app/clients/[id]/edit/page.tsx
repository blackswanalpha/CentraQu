"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { ClientForm } from "@/components/Clients/client-form";
import { Client } from "@/types/audit";
import { clientService } from "@/services/client.service";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsFetching(true);
        const data = await clientService.getClient(clientId);
        setClient(data);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch client');
      } finally {
        setIsFetching(false);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const handleSubmit = async (data: Client) => {
    setIsLoading(true);
    setError(null);

    try {
      // Update client via backend API
      const updatedClient = await clientService.updateClient(clientId, data);
      console.log("Client updated successfully:", updatedClient);

      // Redirect to clients page
      router.push("/clients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client");
      console.error("Error updating client:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading client...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Client not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Edit Client
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Update client information and settings
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
        <ClientForm client={client} onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}

