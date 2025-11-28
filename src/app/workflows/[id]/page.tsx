"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { WorkflowItem, SchedulerComment } from "@/types/scheduler";
import Link from "next/link";

// Mock data for workflows (same as main page)
const MOCK_WORKFLOWS: WorkflowItem[] = [
  {
    id: "workflow-1",
    title: "ISO 9001 Certification Process - ABC Corporation",
    description: "Complete certification workflow for new ISO 9001 client including all stages from application to certificate issuance",
    type: "workflow",
    status: "in-progress",
    priority: "high",
    assignedTo: "sarah-mitchell",
    assignedToName: "Sarah Mitchell",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    estimatedDuration: 2400, // 40 hours
    workflowType: "certification",
    currentStep: 3,
    steps: [
      {
        id: "step-1",
        title: "Application Review",
        description: "Review initial certification application and documentation",
        assignedTo: "admin-team",
        status: "completed",
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "step-2",
        title: "Stage 1 Audit",
        description: "Documentation review and readiness assessment",
        assignedTo: "sarah-mitchell",
        status: "completed",
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "step-3",
        title: "Stage 2 Audit",
        description: "On-site implementation audit",
        assignedTo: "sarah-mitchell",
        status: "in-progress",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "step-4",
        title: "Audit Report Review",
        description: "Internal review of audit findings and recommendations",
        assignedTo: "quality-manager",
        status: "pending",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        approvalRequired: true,
      },
      {
        id: "step-5",
        title: "Certification Decision",
        description: "Final certification decision and certificate preparation",
        assignedTo: "certification-committee",
        status: "pending",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        approvalRequired: true,
      },
    ],
    completionRate: 40,
    approvalRequired: true,
    tags: ["iso9001", "certification", "abc-corp"],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    comments: [
      {
        id: "comment-1",
        authorId: "sarah-mitchell",
        authorName: "Sarah Mitchell",
        content: "Stage 1 audit completed successfully. Client documentation is well-organized and comprehensive.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "comment-2",
        authorId: "admin-team",
        authorName: "Admin Team",
        content: "Stage 2 audit scheduled for next week. All logistics confirmed with the client.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

export default function WorkflowDetailPage() {
  const params = useParams();
  const workflowId = params.id as string;
  const [newComment, setNewComment] = useState("");
  
  const workflow = useMemo(() => {
    return MOCK_WORKFLOWS.find(w => w.id === workflowId);
  }, [workflowId]);

  if (!workflow) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white mb-2">
            Workflow Not Found
          </h1>
          <p className="text-body-base text-gray-600 dark:text-gray-400 mb-4">
            The workflow you're looking for doesn't exist.
          </p>
          <Link href="/workflows">
            <Button variant="primary">Back to Workflows</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

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
    return date.toLocaleDateString("en-US", { 
      weekday: "long",
      year: "numeric",
      month: "long", 
      day: "numeric" 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // Mock adding comment
    setNewComment("");
    // In real app, this would make an API call
  };

  const handleStepStatusUpdate = (stepId: string, newStatus: string) => {
    // In real app, this would make an API call
    console.log(`Updating step ${stepId} to status ${newStatus}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/workflows"
                className="text-primary hover:text-primary-hover"
              >
                ← Back to Workflows
              </Link>
            </div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              {workflow.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl">{getWorkflowTypeIcon(workflow.workflowType)}</span>
              <span className="text-lg">{getPriorityIcon(workflow.priority)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
                {workflow.status.replace("-", " ")}
              </span>
              {workflow.approvalRequired && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                  ⚠ Approval Required
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Edit Workflow</Button>
            <Button variant="primary">Update Status</Button>
          </div>
        </div>

        {/* Workflow Overview */}
        <WidgetCard title="Workflow Overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Step {workflow.currentStep}/{workflow.steps.length}</span>
                  <span className="font-medium text-primary">{workflow.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${workflow.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Timeline</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Due Date:</span> {formatDate(workflow.dueDate)}</div>
                <div><span className="font-medium">Duration:</span> {Math.round((workflow.estimatedDuration || 0) / 60)}h estimated</div>
                <div><span className="font-medium">Type:</span> {workflow.workflowType.replace("-", " ")}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Assignment</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Owner:</span> {workflow.assignedToName}</div>
                <div><span className="font-medium">Priority:</span> {workflow.priority}</div>
              </div>
            </div>
          </div>

          {workflow.description && (
            <div className="mt-6">
              <h4 className="font-semibold text-dark dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400">{workflow.description}</p>
            </div>
          )}
        </WidgetCard>

        {/* Workflow Steps */}
        <WidgetCard title="Workflow Steps">
          <div className="space-y-4">
            {workflow.steps.map((step, index) => (
              <div
                key={step.id}
                className={`border rounded-lg p-4 ${
                  step.status === "in-progress" 
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20" 
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepStatusColor(step.status)}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${step.status === "completed" ? "line-through text-gray-500" : "text-dark dark:text-white"}`}>
                          {step.title}
                        </h3>
                        {step.approvalRequired && (
                          <span className="text-orange-500 text-xs">⚠ Approval Required</span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          {step.status.replace("-", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {step.description}
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Assigned to: {step.assignedTo}</div>
                        {step.dueDate && (
                          <div>Due: {formatDate(step.dueDate)}</div>
                        )}
                        {step.completedAt && (
                          <div>Completed: {formatDate(step.completedAt)} at {formatTime(step.completedAt)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {step.status !== "completed" && step.status !== "skipped" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStepStatusUpdate(step.id, "completed")}
                        className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
                      >
                        ✓ Complete
                      </button>
                      <button
                        onClick={() => handleStepStatusUpdate(step.id, "skipped")}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Skip
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Tags */}
        {workflow.tags && workflow.tags.length > 0 && (
          <WidgetCard title="Tags">
            <div className="flex flex-wrap gap-2">
              {workflow.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </WidgetCard>
        )}

        {/* Comments Section */}
        <WidgetCard title="Comments & Updates">
          <div className="space-y-4">
            {/* Add Comment */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment or update..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="primary" 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {workflow.comments && workflow.comments.length > 0 ? (
              <div className="space-y-4">
                {workflow.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {comment.authorName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-dark dark:text-white">
                          {comment.authorName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatTime(comment.createdAt)} • {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-gray-600 dark:text-gray-400">No comments yet</p>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Workflow Timeline */}
        <WidgetCard title="Workflow Timeline">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
              <div>
                <div className="font-medium text-dark dark:text-white">Workflow Created</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(workflow.createdAt)} at {formatTime(workflow.createdAt)}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
              <div>
                <div className="font-medium text-dark dark:text-white">Last Updated</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(workflow.updatedAt)} at {formatTime(workflow.updatedAt)}
                </div>
              </div>
            </div>

            {workflow.completedAt && (
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                <div>
                  <div className="font-medium text-dark dark:text-white">Completed</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(workflow.completedAt)} at {formatTime(workflow.completedAt)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}