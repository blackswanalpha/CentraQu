"use client";

import { useRouter } from "next/navigation";
import { Client, ClientStatus } from "@/types/audit";
import { Badge } from "@/components/Dashboard/badge";
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface ClientsTableProps {
  clients: Client[];
  onDelete?: (clientId: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (column: string) => void;
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

export function ClientsTable({ 
  clients, 
  onDelete, 
  sortBy, 
  sortOrder, 
  onSort 
}: ClientsTableProps) {
  const router = useRouter();

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    );
  };

  const handleSort = (column: string) => {
    if (onSort) {
      onSort(column);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Client Name
                  <SortIcon column="name" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Industry
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon column="status" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSort("healthScore")}
              >
                <div className="flex items-center gap-2">
                  Health Score
                  <SortIcon column="healthScore" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Certifications
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {clients.map((client) => {
              const status = (client.status || "active") as ClientStatus;
              return (
                <tr 
                  key={client.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div 
                          className="text-sm font-semibold text-dark dark:text-white hover:text-primary cursor-pointer transition-colors"
                          onClick={() => router.push(`/clients/${client.id}`)}
                        >
                          {client.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {client.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {client.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={`mailto:${client.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {client.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {client.industry || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      label={statusLabels[status]}
                      variant={statusVariants[status]}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {client.healthScore || "—"}
                      </div>
                      {client.healthScore && (
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              client.healthScore >= 80
                                ? "bg-success"
                                : client.healthScore >= 60
                                ? "bg-accent"
                                : "bg-error"
                            }`}
                            style={{ width: `${client.healthScore}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {client.certifications && client.certifications.length > 0 ? (
                        client.certifications.slice(0, 2).map((cert, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {cert.replace(":2015", "").replace(":2018", "").replace(":2013", "")}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                      {client.certifications && client.certifications.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{client.certifications.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/clients/${client.id}`)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => router.push(`/clients/${client.id}/edit`)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit Client"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(client.id)}
                          className="p-2 text-gray-600 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                          title="Delete Client"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


