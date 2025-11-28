"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Badge } from "@/components/Dashboard/badge";
import { Button } from "@/components/Dashboard/button";
import { DataTable, Column } from "@/components/Dashboard/data-table";
import { Client, Audit } from "@/types/audit";
import { clientService } from "@/services/client.service";

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [audits] = useState<(Audit & { revenue?: number; paymentStatus?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await clientService.getClient(clientId);
        setClient(data);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch client');
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const auditColumns: Column<Audit & { revenue?: number; paymentStatus?: string }>[] = [
    {
      key: "standard",
      label: "Standard",
      width: "20%",
    },
    {
      key: "auditType",
      label: "Type",
      width: "12%",
      render: (value) => (
        <span className="capitalize">{String(value).replace("-", " ")}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "12%",
      render: (value) => (
        <Badge label={String(value)} variant="neutral" />
      ),
    },
    {
      key: "startDate",
      label: "Start Date",
      width: "13%",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End Date",
      width: "13%",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "revenue",
      label: "Revenue",
      width: "15%",
      render: (_, row) => (
        <div className="text-right">
          <div className="font-medium text-primary">
            {row.revenue ? formatCurrency(row.revenue) : '-'}
          </div>
          {row.paymentStatus && (
            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
              row.paymentStatus === 'paid' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : row.paymentStatus === 'pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {row.paymentStatus}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "progress",
      label: "Progress",
      width: "15%",
      render: (value) => `${value}%`,
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading client details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state if there was an error or client is null
  if (error || !client) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error ? 'Error Loading Client' : 'Client Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The client you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => router.push('/clients')}>
              Back to Clients
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-heading-1 font-bold text-dark dark:text-white">
                {client.name}
              </h1>
              <Badge
                label={client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : "Active"}
                variant="neutral"
              />
            </div>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              {client.industry} • Health Score: {client.healthScore}/100
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push(`/clients/${client.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/clients")}
            >
              Back
            </Button>
          </div>
        </div>

        {/* Contact Information */}
        <WidgetCard title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Primary Contact
              </p>
              <p className="font-medium text-dark dark:text-white">
                {client.contact}
              </p>
              <a
                href={`mailto:${client.email}`}
                className="text-sm text-primary hover:underline"
              >
                {client.email}
              </a>
              <a
                href={`tel:${client.phone}`}
                className="text-sm text-primary hover:underline block"
              >
                {client.phone}
              </a>
            </div>

            {client.siteContact && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Site Contact
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {client.siteContact}
                </p>
                {client.sitePhone && (
                  <a
                    href={`tel:${client.sitePhone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {client.sitePhone}
                  </a>
                )}
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Address
              </p>
              <p className="font-medium text-dark dark:text-white">
                {client.address}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Certifications
              </p>
              <div className="flex flex-wrap gap-2">
                {client.certifications?.map((cert) => (
                  <Badge key={cert} label={cert} variant="neutral" />
                ))}
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Revenue Summary */}
        <WidgetCard title="Revenue Summary">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(audits.reduce((total, audit) => total + (audit.revenue || 0), 0))}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(audits.filter(a => a.paymentStatus === 'paid').reduce((total, audit) => total + (audit.revenue || 0), 0))}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Paid Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {formatCurrency(audits.filter(a => a.paymentStatus === 'pending').reduce((total, audit) => total + (audit.revenue || 0), 0))}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{audits.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Audits</p>
            </div>
          </div>
        </WidgetCard>

        {/* Audit Timeline */}
        <WidgetCard title="Audit History">
          <DataTable
            columns={auditColumns}
            data={audits}
            emptyMessage="No audits found for this client"
          />
        </WidgetCard>

        {/* Audit Schedule */}
        <WidgetCard title="Upcoming Audits">
          <div className="space-y-4">
            {client.nextAuditDate && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Next Scheduled Audit
                </p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {new Date(client.nextAuditDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
            <Button variant="primary" fullWidth>
              Schedule New Audit
            </Button>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

