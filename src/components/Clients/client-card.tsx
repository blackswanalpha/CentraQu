"use client";

import { useRouter } from "next/navigation";
import { Client, ClientStatus } from "@/types/audit";
import { Badge } from "@/components/Dashboard/badge";

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
}

const statusVariants: Record<ClientStatus, "success" | "warning" | "error" | "info" | "neutral"> = {
  active: "success",
  inactive: "neutral",
  "at-risk": "warning",
  churned: "error",
};

const statusLabels: Record<ClientStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  "at-risk": "At Risk",
  churned: "Churned",
};

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const router = useRouter();
  const status = (client.status || "active") as ClientStatus;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            onClick={() => router.push(`/clients/${client.id}`)}
            className="text-lg font-bold text-dark dark:text-white hover:text-primary transition-colors cursor-pointer"
          >
            {client.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {client.industry || "Not specified"}
          </p>
        </div>
        <Badge
          label={statusLabels[status]}
          variant={statusVariants[status]}
        />
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Contact:</span> {client.contact}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Email:</span>{" "}
          <a href={`mailto:${client.email}`} className="text-primary hover:underline">
            {client.email}
          </a>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Phone:</span>{" "}
          <a href={`tel:${client.phone}`} className="text-primary hover:underline">
            {client.phone}
          </a>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Health Score</p>
          <p className="text-lg font-bold text-dark dark:text-white">
            {client.healthScore || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Last Audit</p>
          <p className="text-sm font-medium text-dark dark:text-white">
            {client.lastAuditDate
              ? new Date(client.lastAuditDate).toLocaleDateString()
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Next Audit</p>
          <p className="text-sm font-medium text-dark dark:text-white">
            {client.nextAuditDate
              ? new Date(client.nextAuditDate).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/clients/${client.id}`)}
          className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors text-center"
        >
          View Details
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(client)}
            className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(client.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

