"use client";

import { StatusBadge } from "./status-badge";

interface ContractRowProps {
  id: string;
  client: string;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "expiring" | "expired";
  signedDate?: string;
  autoRenewal?: boolean;
  paymentTerms?: string;
  daysRemaining?: number;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onEmail: (id: string) => void;
  onRenew?: (id: string) => void;
  onAmend?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusIcon = {
  active: "🟢",
  pending: "🟠",
  expiring: "🟡",
  expired: "🔴",
};

export function ContractRow({
  id,
  client,
  type,
  value,
  startDate,
  endDate,
  status,
  onView,
  onDownload,
  onEmail,
  onRenew,
  onAmend,
  onEdit,
  onDelete,
}: ContractRowProps) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{statusIcon[status]}</span>
          <span className="font-medium text-dark dark:text-white">{id}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">{client}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">{type}</span>
      </td>
      <td className="px-6 py-4">
        <span className="font-medium text-dark dark:text-white">${(value / 1000).toFixed(0)}K</span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {startDate} - {endDate}
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={status} size="sm" />
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onView(id)}
            className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded transition"
          >
            VIEW
          </button>
          <button
            onClick={() => onDownload(id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            DOWNLOAD PDF
          </button>
          <button
            onClick={() => onEmail(id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            ✉ EMAIL
          </button>
          {onRenew && (
            <button
              onClick={() => onRenew(id)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              RENEW
            </button>
          )}
          {onAmend && (
            <button
              onClick={() => onAmend(id)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              AMEND
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(id)}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 transition"
            >
              EDIT
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/20 rounded hover:bg-red-200 dark:hover:bg-red-900/30 transition"
            >
              DELETE
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

