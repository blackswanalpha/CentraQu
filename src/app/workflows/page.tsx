"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { WorkflowItem } from "@/types/scheduler";
import { workflowService, Workflow } from "@/services/workflow.service";
import Link from "next/link";

// Helper function to convert API workflow to WorkflowItem
const convertToWorkflowItem = (workflow: Workflow): WorkflowItem => {
  return {
    id: `workflow-${workflow.id}`,
    title: workflow.title,
    description: workflow.description,
    type: "workflow",
    status: workflow.status.toLowerCase().replace('_', '-') as any,
    priority: workflow.priority.toLowerCase() as any,
    assignedTo: workflow.assigned_to?.toString(),
    assignedToName: workflow.assigned_to_name,
    dueDate: workflow.due_date ? new Date(workflow.due_date) : undefined,
    estimatedDuration: workflow.estimated_duration,
    workflowType: workflow.workflow_type.toLowerCase().replace('_', '-') as any,
    currentStep: workflow.current_step,
    steps: workflow.steps?.map(step => ({
      id: `step-${step.id}`,
      title: step.title,
      description: step.description,
      assignedTo: step.assigned_to?.toString(),
      status: step.status.toLowerCase().replace('_', '-') as any,
      dueDate: step.due_date ? new Date(step.due_date) : undefined,
      completedAt: step.completed_at ? new Date(step.completed_at) : undefined,
    })) || [],
    completionRate: workflow.completion_rate,
    approvalRequired: workflow.approval_required,
    tags: workflow.tags ? workflow.tags.split(',').map(t => t.trim()) : [],
    createdAt: new Date(workflow.created_at),
    updatedAt: new Date(workflow.updated_at),
  };
};

// Mock data removed - now using real API data from workflowService

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workflows from API
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await workflowService.getWorkflows({
          ordering: '-created_at',
        });
        const workflowItems = response.results.map(convertToWorkflowItem);
        setWorkflows(workflowItems);
      } catch (err) {
        console.error('Error fetching workflows:', err);
        setError('Failed to load workflows. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  // Filter workflows based on selected filters
  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      const matchesStatus = selectedStatus === "all" || workflow.status === selectedStatus;
      const matchesType = selectedType === "all" || workflow.workflowType === selectedType;
      const matchesSearch = searchTerm === "" || 
        workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.workflowType.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [workflows, selectedStatus, selectedType, searchTerm]);

  // Get unique workflow types for filter dropdown
  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(workflows.map(workflow => workflow.workflowType)));
  }, [workflows]);

  const getStatusColor = (status: WorkflowItem['status']) => {
    switch (status) {
      case "not-started": return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      case "in-progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "review": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "completed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "blocked": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "overdue": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityIcon = (priority: WorkflowItem['priority']) => {
    switch (priority) {
      case "critical": return "🔴";
      case "high": return "🟠";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  const getWorkflowTypeIcon = (type: WorkflowItem['workflowType']) => {
    switch (type) {
      case "certification": return "🏆";
      case "client-onboarding": return "👋";
      case "compliance-check": return "✅";
      case "audit-process": return "🔍";
      case "review-process": return "📋";
      default: return "🔄";
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500 text-white";
      case "in-progress": return "bg-blue-500 text-white";
      case "pending": return "bg-gray-300 text-gray-600";
      case "skipped": return "bg-yellow-500 text-white";
      default: return "bg-gray-300 text-gray-600";
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  const handleStepStatusUpdate = (workflowId: string, stepId: string, newStatus: string) => {
    setWorkflows(prev => 
      prev.map(workflow => {
        if (workflow.id === workflowId) {
          const updatedSteps = workflow.steps.map(step => {
            if (step.id === stepId) {
              return {
                ...step,
                status: newStatus as any,
                completedAt: newStatus === "completed" ? new Date() : undefined,
              };
            }
            return step;
          });
          
          const completedSteps = updatedSteps.filter(step => step.status === "completed").length;
          const completionRate = Math.round((completedSteps / updatedSteps.length) * 100);
          
          return {
            ...workflow,
            steps: updatedSteps,
            completionRate,
            currentStep: completedSteps + 1,
            updatedAt: new Date(),
            status: completionRate === 100 ? "completed" : workflow.status,
            ...(completionRate === 100 ? { completedAt: new Date() } : {}),
          };
        }
        return workflow;
      })
    );
  };

  const handleStatusUpdate = (workflowId: string, newStatus: WorkflowItem['status']) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowId 
          ? { 
              ...workflow, 
              status: newStatus, 
              updatedAt: new Date(),
              ...(newStatus === "completed" ? { completedAt: new Date() } : {})
            }
          : workflow
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Workflows
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage multi-step business processes and track progress
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/workflows/templates">
              <Button variant="secondary">🔄 Templates</Button>
            </Link>
            <Link href="/workflows/new">
              <Button variant="primary">+ New Workflow</Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading workflows...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && !error && (
          <>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-dark dark:text-white">
              {workflows.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Workflows</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">
              {workflows.filter(w => w.status === "in-progress").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">
              {workflows.filter(w => w.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600">
              {workflows.filter(w => w.approvalRequired && w.status === "in-progress").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending Approval</div>
          </div>
        </div>

        {/* Filters */}
        <WidgetCard title="Filters">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Workflow Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type.replace("-", " ")}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search workflows, descriptions, types..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
            </div>
          </div>
        </WidgetCard>

        {/* Workflows List */}
        <WidgetCard title={`Workflows (${filteredWorkflows.length})`}>
          {filteredWorkflows.length > 0 ? (
            <div className="space-y-6">
              {filteredWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">{getWorkflowTypeIcon(workflow.workflowType)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-dark dark:text-white">
                            {workflow.title}
                          </h3>
                          <span className="text-lg">{getPriorityIcon(workflow.priority)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                            {workflow.status.replace("-", " ")}
                          </span>
                          {workflow.approvalRequired && (
                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                              ⚠ Approval Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {workflow.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-dark dark:text-white">
                        Progress: Step {workflow.currentStep}/{workflow.steps.length}
                      </span>
                      <span className="font-medium text-primary">
                        {workflow.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${workflow.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Workflow Steps */}
                  <div className="mb-4">
                    <div className="font-medium text-dark dark:text-white mb-3">Workflow Steps</div>
                    <div className="space-y-3">
                      {workflow.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepStatusColor(step.status)}`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${step.status === "completed" ? "line-through text-gray-500" : "text-dark dark:text-white"}`}>
                                {step.title}
                              </span>
                              {step.approvalRequired && (
                                <span className="text-orange-500 text-xs">⚠ Approval</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {step.description}
                              {step.dueDate && (
                                <span className="ml-2">• Due: {formatDate(step.dueDate)}</span>
                              )}
                            </div>
                          </div>
                          {step.status !== "completed" && step.status !== "skipped" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleStepStatusUpdate(workflow.id, step.id, "completed")}
                                className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => handleStepStatusUpdate(workflow.id, step.id, "skipped")}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                Skip
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Type & Priority</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div className="capitalize">{workflow.workflowType.replace("-", " ")}</div>
                        <div className="capitalize">{workflow.priority} priority</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Timeline</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>Due: {formatDate(workflow.dueDate)}</div>
                        <div>Est: {Math.round((workflow.estimatedDuration || 0) / 60)}h total</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Assignment</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>Owner: {workflow.assignedToName}</div>
                        <div>Created: {workflow.createdAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {workflow.tags && workflow.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {workflow.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Updated: {workflow.updatedAt.toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/workflows/${workflow.id}`}
                        className="px-3 py-1 text-xs font-medium text-primary hover:text-primary-hover"
                      >
                        View Details
                      </Link>
                      {workflow.status !== "completed" && workflow.completionRate < 100 && (
                        <button
                          onClick={() => handleStatusUpdate(workflow.id, "completed")}
                          className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                        >
                          ✓ Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
                No workflows found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or create a new workflow.
              </p>
            </div>
          )}
        </WidgetCard>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}