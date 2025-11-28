"use client";

interface StatusBadgeProps {
  status: "lead" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost" | "active" | "pending" | "expiring" | "expired";
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  lead: { label: "Lead", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  qualified: { label: "Qualified", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  proposal: { label: "Proposal", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
  negotiation: { label: "Negotiation", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  "closed-won": { label: "Closed-Won", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  "closed-lost": { label: "Closed-Lost", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  active: { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  expiring: { label: "Expiring Soon", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  expired: { label: "Expired", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }[size];

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${config.color} ${sizeClass}`}>
      {config.label}
    </span>
  );
}

