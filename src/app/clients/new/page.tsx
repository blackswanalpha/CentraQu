"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { ClientForm } from "@/components/Clients/client-form";
import { Client } from "@/types/audit";
import { clientService } from "@/services/client.service";
import toast from "react-hot-toast";

export default function AddClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Client) => {
    setIsLoading(true);

    try {
      // Create client via backend API
      const newClient = await clientService.createClient(data);
      console.log("Client created successfully:", newClient);

      toast.success("Client created successfully!");

      // Redirect to clients page
      router.push("/clients");
    } catch (err: any) {
      console.error("Error adding client:", err);

      // Extract error message from backend response if available
      const errorMessage = err.response?.data?.error || err.message || "Failed to add client";

      // If there are field-specific errors, show them
      if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.error) {
        Object.entries(err.response.data).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : messages;
          toast.error(`${field}: ${msg}`);
        });
      } else {
        toast.error(errorMessage);
      }
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

        {/* Form */}
        <ClientForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}

