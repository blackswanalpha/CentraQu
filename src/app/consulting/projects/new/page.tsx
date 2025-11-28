"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { ScopeObjectivesForm } from "@/components/Consulting/scope-objectives-form";
import Link from "next/link";
import { useState } from "react";

interface ProjectFormData {
  // Step 1: Basic Information
  projectName: string;
  clientId: string;
  clientName: string;
  description: string;
  scope: string;
  objectives: string[];
  deliverables: string[];
  serviceType: string;
  
  // Step 2: Timeline & Budget
  startDate: string;
  endDate: string;
  duration: number;
  budget: string;
  
  // Step 3: Team & Resources
  projectManager: string;
  teamMembers: string[];
  
  // Step 4: Additional Details
  priority: string;
  impact: string;
  risk: string;
  tags: string;
}

const serviceTypes = [
  "Strategic Planning",
  "Process Optimization",
  "Digital Transformation",
  "Change Management",
  "Organizational Design",
  "Technology Implementation",
  "Training & Development",
  "Other",
];

const consultants = [
  { id: "1", name: "Sarah Mitchell" },
  { id: "2", name: "Linda Peterson" },
  { id: "3", name: "Michael Roberts" },
  { id: "4", name: "Emma Thompson" },
  { id: "5", name: "James Kennedy" },
];

const clients = [
  { id: "1", name: "ABC Corporation" },
  { id: "2", name: "DEF Inc" },
  { id: "3", name: "GHI Ltd" },
  { id: "4", name: "JKL Corporation" },
  { id: "5", name: "MNO Inc" },
];

export default function NewProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: "",
    clientId: "",
    clientName: "",
    description: "",
    scope: "",
    objectives: [],
    deliverables: [],
    serviceType: "",
    startDate: "",
    endDate: "",
    duration: 3,
    budget: "",
    projectManager: "",
    teamMembers: [],
    priority: "Medium",
    impact: "Medium",
    risk: "Medium",
    tags: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedClient = clients.find((c) => c.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      clientId: selectedId,
      clientName: selectedClient?.name || "",
    }));
  };

  const handleTeamMemberToggle = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter((id) => id !== memberId)
        : [...prev.teamMembers, memberId],
    }));
  };

  const handleScopeObjectivesChange = (data: { scope: string; objectives: string[]; deliverables: string[]; }) => {
    setFormData((prev) => ({
      ...prev,
      scope: data.scope,
      objectives: data.objectives,
      deliverables: data.deliverables,
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Prepare project data for API
    const projectData = {
      name: formData.projectName,
      client: formData.clientName,
      clientId: formData.clientId,
      description: formData.description,
      scope: formData.scope,
      objectives: formData.objectives,
      deliverables: formData.deliverables,
      status: "planning" as const,
      health: "on-track" as const,
      phase: "planning" as const,
      startDate: formData.startDate,
      endDate: formData.endDate,
      completionPercentage: 0,
      contractValue: parseInt(formData.budget) || 0,
      recognizedRevenue: 0,
      remainingRevenue: parseInt(formData.budget) || 0,
      projectManager: consultants.find(c => c.id === formData.projectManager)?.name || "",
      projectManagerId: formData.projectManager,
      teamMembers: formData.teamMembers.map(id => consultants.find(c => c.id === id)?.name || ""),
      teamMemberIds: formData.teamMembers,
      impact: formData.impact.toLowerCase() as "high" | "medium" | "low",
      risk: formData.risk.toLowerCase() as "high" | "medium" | "low",
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
    };

    try {
      // Call API to create project
      const response = await fetch("/api/consulting/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        // Redirect to projects page or show success message
        window.location.href = "/consulting/projects";
      } else {
        const error = await response.json();
        console.error("Failed to create project:", error);
        // Handle error (show toast, etc.)
      }
    } catch (error) {
      console.error("Error creating project:", error);
      // Handle error
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.projectName && formData.clientId && formData.serviceType && formData.scope;
      case 2:
        return formData.startDate && formData.endDate && formData.budget;
      case 3:
        return formData.projectManager;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/consulting/projects"
              className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
            >
              ← Back to Projects
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              CREATE NEW PROJECT
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Set up a new consulting project with all required details
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="card bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      step < currentStep
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Basic Info</span>
            <span>Timeline & Budget</span>
            <span>Team & Resources</span>
            <span>Additional Details</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="card bg-white dark:bg-gray-900 p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-dark dark:text-white">
                Basic Project Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC Corp - Strategic Planning"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Client *
                </label>
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleClientChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a service type...</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief high-level description of the project..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Scope & Objectives Form */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-dark dark:text-white mb-4">
                  Project Scope & Objectives
                </h3>
                <ScopeObjectivesForm
                  initialScope={formData.scope}
                  initialObjectives={formData.objectives}
                  initialDeliverables={formData.deliverables}
                  onChange={handleScopeObjectivesChange}
                />
              </div>
            </div>
          )}

          {/* Step 2: Timeline & Budget */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-dark dark:text-white">
                Timeline & Budget
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Duration (months)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Project Budget *
                </label>
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-400 mr-2">$</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Team & Resources */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-dark dark:text-white">
                Team & Resources
              </h2>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Project Manager *
                </label>
                <select
                  name="projectManager"
                  value={formData.projectManager}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select project manager...</option>
                  {consultants.map((consultant) => (
                    <option key={consultant.id} value={consultant.id}>
                      {consultant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-3">
                  Team Members
                </label>
                <div className="space-y-2">
                  {consultants.map((consultant) => (
                    <label key={consultant.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.teamMembers.includes(consultant.id)}
                        onChange={() => handleTeamMemberToggle(consultant.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-dark dark:text-white">
                        {consultant.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-dark dark:text-white">
                Additional Details
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Impact
                  </label>
                  <select
                    name="impact"
                    value={formData.impact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Risk
                  </label>
                  <select
                    name="risk"
                    value={formData.risk}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., strategic, urgent, client-priority"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Summary */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-dark dark:text-white mb-3">Project Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Project Name</p>
                    <p className="font-medium text-dark dark:text-white">{formData.projectName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Client</p>
                    <p className="font-medium text-dark dark:text-white">{formData.clientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Budget</p>
                    <p className="font-medium text-dark dark:text-white">${formData.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-dark dark:text-white">{formData.duration} months</p>
                  </div>
                </div>
                {formData.scope && (
                  <div className="border-t border-blue-200 dark:border-blue-700 pt-3">
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Project Scope</p>
                    <p className="text-sm text-dark dark:text-white">{formData.scope}</p>
                  </div>
                )}
                {formData.objectives.length > 0 && (
                  <div className="mt-3">
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Objectives ({formData.objectives.length})</p>
                    <ul className="text-sm text-dark dark:text-white space-y-1">
                      {formData.objectives.slice(0, 3).map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 dark:text-blue-400 mr-1">•</span>
                          <span className="truncate">{objective}</span>
                        </li>
                      ))}
                      {formData.objectives.length > 3 && (
                        <li className="text-gray-500 dark:text-gray-400 text-xs">
                          +{formData.objectives.length - 3} more objectives
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                Create Project
              </button>
            )}
          </div>
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

