"use client";

import { StatusBadge } from "./status-badge";
import { ProbabilityIndicator } from "./probability-indicator";

interface OpportunityRowProps {
  id: string;
  company: string;
  contact: string;
  stage: "lead" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost";
  value: number;
  probability: number;
  nextAction: string;
  certType: string;
  owner: string;
  createdDate: string;
  lastActivity: string;
  isStarred?: boolean;
  isStalled?: boolean;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onEmail: (id: string) => void;
  onCall: (id: string) => void;
  onSchedule: (id: string) => void;
}

export function OpportunityRow({
  id,
  company,
  contact,
  stage,
  value,
  probability,
  nextAction,
  isStarred,
  isStalled,
  onOpen,
  onEdit,
}: OpportunityRowProps) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{isStarred ? "⭐" : isStalled ? "⚠" : ""}</span>
          <span className="font-medium text-dark dark:text-white">{company}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">{contact}</span>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={stage} size="sm" />
      </td>
      <td className="px-6 py-4">
        <span className="font-medium text-dark dark:text-white">${(value / 1000).toFixed(0)}K</span>
      </td>
      <td className="px-6 py-4">
        <ProbabilityIndicator percentage={probability} showLabel={true} />
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">{nextAction}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1 justify-end">
          <button
            onClick={() => onOpen(id)}
            className="px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition"
          >
            OPEN
          </button>
          <button
            onClick={() => onEdit(id)}
            className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
          >
            EDIT
          </button>
        </div>
      </td>
    </tr>
  );
}

