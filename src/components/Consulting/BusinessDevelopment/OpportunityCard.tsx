import { Badge } from "@/components/Dashboard/badge";
import { ProgressBar } from "@/components/Dashboard/progress-bar";
import Link from "next/link";

interface OpportunityCardProps {
  id: string;
  client: string;
  service: string;
  value: number;
  stage: string;
  probability: number;
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
  lastActivity: string;
  nextAction?: string;
  daysInStage?: number;
}

export function OpportunityCard({
  id,
  client,
  service,
  value,
  stage,
  probability,
  assignedTo,
  priority,
  lastActivity,
  nextAction,
  daysInStage,
}: OpportunityCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "danger";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Discovery":
        return "info";
      case "Qualification":
        return "primary";
      case "Proposal":
        return "warning";
      case "Negotiation":
        return "success";
      case "Closed Won":
        return "success";
      case "Closed Lost":
        return "danger";
      default:
        return "default";
    }
  };

  const weightedValue = value * (probability / 100);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/consulting/business-development/opportunities/${id}`}
              className="text-lg font-semibold text-dark dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              {client}
            </Link>
            <Badge label={priority} variant={getPriorityColor(priority) as any} size="sm" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{service}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Value</p>
          <p className="text-xl font-bold text-blue-600">${value.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Weighted: ${weightedValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stage & Probability */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Stage</p>
          <Badge label={stage} variant={getStageColor(stage) as any} size="md" />
          {daysInStage && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {daysInStage} days in stage
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Probability</p>
          <div className="flex items-center gap-2">
            <ProgressBar value={probability} max={100} variant="primary" />
            <span className="text-sm font-semibold text-dark dark:text-white">
              {probability}%
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Assigned to:</span>
          <span className="font-medium text-dark dark:text-white">{assignedTo}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Last activity:</span>
          <span className="text-dark dark:text-white">{lastActivity}</span>
        </div>
        {nextAction && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Next action:</span>
            <span className="text-dark dark:text-white">{nextAction}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`/consulting/business-development/opportunities/${id}`}
          className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium text-center hover:bg-blue-700"
        >
          View Details
        </Link>
        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
          Update
        </button>
        <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
          ⋮
        </button>
      </div>
    </div>
  );
}

