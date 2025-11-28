"use client";

import { ConsultingProject, ProjectTemplate } from "@/types/consulting";

interface ScopeObjectivesSectionProps {
  data: ConsultingProject | ProjectTemplate;
  className?: string;
  showEdit?: boolean;
  onEdit?: () => void;
}

export function ScopeObjectivesSection({ 
  data, 
  className = "", 
  showEdit = false, 
  onEdit 
}: ScopeObjectivesSectionProps) {
  return (
    <div className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-dark dark:text-white">
          Scope & Objectives
        </h3>
        {showEdit && onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Edit
          </button>
        )}
      </div>
      
      {/* Scope Description */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          PROJECT SCOPE
        </h4>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {data.scope || "Project scope not defined yet."}
          </p>
        </div>
      </div>

      {/* Objectives */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
          KEY OBJECTIVES
        </h4>
        {data.objectives && data.objectives.length > 0 ? (
          <div className="space-y-3">
            {data.objectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {objective}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No specific objectives defined yet.
            </p>
          </div>
        )}
      </div>

      {/* Deliverables */}
      {'deliverables' in data && data.deliverables && data.deliverables.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            KEY DELIVERABLES
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.deliverables.map((deliverable, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400">
                    ✓
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {deliverable}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional metrics for projects */}
      {'contractValue' in data && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Contract Value</p>
              <p className="font-semibold text-dark dark:text-white">
                ${data.contractValue.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
              <p className="font-semibold text-dark dark:text-white">
                {data.completionPercentage}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Phase</p>
              <p className="font-semibold text-dark dark:text-white capitalize">
                {data.phase}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Health</p>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                data.health === 'on-track' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : data.health === 'at-risk'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {data.health.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Additional metrics for templates */}
      {'usageCount' in data && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Usage Count</p>
              <p className="font-semibold text-dark dark:text-white">
                {data.usageCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Team Size</p>
              <p className="font-semibold text-dark dark:text-white">
                {data.teamSize} people
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-semibold text-dark dark:text-white">
                {data.duration} months
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
              <p className="font-semibold text-dark dark:text-white">
                {data.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}