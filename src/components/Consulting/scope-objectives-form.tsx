"use client";

import { useState } from "react";

interface ScopeObjectivesFormProps {
  initialScope?: string;
  initialObjectives?: string[];
  initialDeliverables?: string[];
  onChange?: (data: {
    scope: string;
    objectives: string[];
    deliverables: string[];
  }) => void;
  className?: string;
}

export function ScopeObjectivesForm({ 
  initialScope = "", 
  initialObjectives = [], 
  initialDeliverables = [],
  onChange,
  className = ""
}: ScopeObjectivesFormProps) {
  const [scope, setScope] = useState(initialScope);
  const [objectives, setObjectives] = useState<string[]>(
    initialObjectives.length > 0 ? initialObjectives : [""]
  );
  const [deliverables, setDeliverables] = useState<string[]>(
    initialDeliverables.length > 0 ? initialDeliverables : [""]
  );

  const handleScopeChange = (value: string) => {
    setScope(value);
    notifyChange({ scope: value, objectives, deliverables });
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
    notifyChange({ scope, objectives: newObjectives, deliverables });
  };

  const addObjective = () => {
    const newObjectives = [...objectives, ""];
    setObjectives(newObjectives);
    notifyChange({ scope, objectives: newObjectives, deliverables });
  };

  const removeObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(newObjectives.length > 0 ? newObjectives : [""]);
    notifyChange({ scope, objectives: newObjectives.length > 0 ? newObjectives : [""], deliverables });
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = value;
    setDeliverables(newDeliverables);
    notifyChange({ scope, objectives, deliverables: newDeliverables });
  };

  const addDeliverable = () => {
    const newDeliverables = [...deliverables, ""];
    setDeliverables(newDeliverables);
    notifyChange({ scope, objectives, deliverables: newDeliverables });
  };

  const removeDeliverable = (index: number) => {
    const newDeliverables = deliverables.filter((_, i) => i !== index);
    setDeliverables(newDeliverables.length > 0 ? newDeliverables : [""]);
    notifyChange({ scope, objectives, deliverables: newDeliverables.length > 0 ? newDeliverables : [""] });
  };

  const notifyChange = (data: { scope: string; objectives: string[]; deliverables: string[] }) => {
    if (onChange) {
      // Filter out empty strings for the callback
      const cleanedData = {
        scope: data.scope,
        objectives: data.objectives.filter(obj => obj.trim() !== ""),
        deliverables: data.deliverables.filter(del => del.trim() !== "")
      };
      onChange(cleanedData);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Project Scope */}
      <div>
        <label className="block text-sm font-medium text-dark dark:text-white mb-2">
          Project Scope *
        </label>
        <textarea
          value={scope}
          onChange={(e) => handleScopeChange(e.target.value)}
          placeholder="Describe the overall scope of the project, including what work will be performed and any boundaries or limitations..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Define what work will be included in this project and any exclusions or boundaries.
        </p>
      </div>

      {/* Project Objectives */}
      <div>
        <label className="block text-sm font-medium text-dark dark:text-white mb-2">
          Project Objectives
        </label>
        <div className="space-y-3">
          {objectives.map((objective, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={objective}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  placeholder={`Define objective ${index + 1}...`}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors mt-1"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addObjective}
          className="mt-3 px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          + Add Objective
        </button>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          List the specific, measurable goals this project aims to achieve.
        </p>
      </div>

      {/* Project Deliverables */}
      <div>
        <label className="block text-sm font-medium text-dark dark:text-white mb-2">
          Key Deliverables
        </label>
        <div className="space-y-3">
          {deliverables.map((deliverable, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  ✓
                </span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={deliverable}
                  onChange={(e) => handleDeliverableChange(index, e.target.value)}
                  placeholder={`Define deliverable ${index + 1}...`}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {deliverables.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDeliverable(index)}
                  className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors mt-1"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDeliverable}
          className="mt-3 px-4 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          + Add Deliverable
        </button>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          List the concrete outputs or products that will be delivered to the client.
        </p>
      </div>
    </div>
  );
}