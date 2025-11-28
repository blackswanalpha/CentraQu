"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { ChecklistItem, SchedulerComment } from "@/types/scheduler";
import Link from "next/link";

// Mock data for checklists (same as main page)
const MOCK_CHECKLISTS: ChecklistItem[] = [
  {
    id: "checklist-1",
    title: "ISO 9001 Pre-Audit Documentation Review",
    description: "Comprehensive checklist for reviewing client documentation before on-site audit",
    type: "checklist",
    status: "in-progress",
    priority: "high",
    assignedTo: "sarah-mitchell",
    assignedToName: "Sarah Mitchell",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    estimatedDuration: 180,
    templateId: "template-001",
    templateName: "ISO 9001 Pre-Audit Standard Template",
    auditId: "A-2025-001",
    clientId: "ABC-Corp",
    standard: "ISO 9001:2015",
    items: [
      {
        id: "item-1",
        title: "Quality Manual Review",
        description: "Review current quality manual for compliance with ISO 9001:2015",
        required: true,
        completed: true,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        evidence: ["quality-manual-v2.pdf"],
        notes: "Manual updated in 2024, compliant with current standard"
      },
      {
        id: "item-2",
        title: "Process Documentation Verification",
        description: "Verify all key processes are documented and current",
        required: true,
        completed: true,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        evidence: ["process-map.pdf", "procedures-list.xlsx"],
        notes: "All 15 core processes documented"
      },
      {
        id: "item-3",
        title: "Internal Audit Records",
        description: "Review last 12 months of internal audit records",
        required: true,
        completed: false,
        notes: "Requested from client, pending delivery"
      },
      {
        id: "item-4",
        title: "Management Review Minutes",
        description: "Review management review meeting minutes for past year",
        required: true,
        completed: false,
      },
      {
        id: "item-5",
        title: "Customer Complaint Records",
        description: "Review customer complaint handling and resolution",
        required: false,
        completed: false,
      },
      {
        id: "item-6",
        title: "Corrective Action Log",
        description: "Review corrective actions from previous audits",
        required: true,
        completed: false,
      }
    ],
    completionRate: 33,
    mustCompleteBy: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    tags: ["iso9001", "pre-audit", "documentation"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    comments: [
      {
        id: "comment-1",
        authorId: "sarah-mitchell",
        authorName: "Sarah Mitchell",
        content: "Quality manual and process documentation reviews completed. Both are comprehensive and up-to-date.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "comment-2",
        authorId: "client-contact",
        authorName: "Client Contact",
        content: "Internal audit records will be provided by end of week. Management review minutes are being compiled.",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ],
  },
];

export default function ChecklistDetailPage() {
  const params = useParams();
  const checklistId = params.id as string;
  const [newComment, setNewComment] = useState("");
  const [newItemNote, setNewItemNote] = useState<{[key: string]: string}>({});
  
  const [checklist, setChecklist] = useState<ChecklistItem | undefined>(() => {
    return MOCK_CHECKLISTS.find(c => c.id === checklistId);
  });

  if (!checklist) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white mb-2">
            Checklist Not Found
          </h1>
          <p className="text-body-base text-gray-600 dark:text-gray-400 mb-4">
            The checklist you're looking for doesn't exist.
          </p>
          <Link href="/checklists">
            <Button variant="primary">Back to Checklists</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: ChecklistItem['status']) => {
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

  const getPriorityIcon = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case "critical": return "🔴";
      case "high": return "🟠";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
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

  const handleItemToggle = (itemId: string) => {
    if (!checklist) return;
    
    setChecklist(prev => {
      if (!prev) return prev;
      
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          const completed = !item.completed;
          return {
            ...item,
            completed,
            completedAt: completed ? new Date() : undefined,
          };
        }
        return item;
      });
      
      const completedCount = updatedItems.filter(item => item.completed).length;
      const completionRate = Math.round((completedCount / updatedItems.length) * 100);
      
      return {
        ...prev,
        items: updatedItems,
        completionRate,
        updatedAt: new Date(),
        status: completionRate === 100 ? "completed" : prev.status,
        ...(completionRate === 100 ? { completedAt: new Date() } : {}),
      };
    });
  };

  const handleAddItemNote = (itemId: string) => {
    const note = newItemNote[itemId]?.trim();
    if (!note || !checklist) return;
    
    setChecklist(prev => {
      if (!prev) return prev;
      
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            notes: note,
          };
        }
        return item;
      });
      
      return {
        ...prev,
        items: updatedItems,
        updatedAt: new Date(),
      };
    });
    
    setNewItemNote(prev => ({
      ...prev,
      [itemId]: ""
    }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // Mock adding comment
    setNewComment("");
    // In real app, this would make an API call
  };

  const completedItems = checklist.items.filter(item => item.completed).length;
  const requiredItems = checklist.items.filter(item => item.required).length;
  const completedRequiredItems = checklist.items.filter(item => item.required && item.completed).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/checklists"
                className="text-primary hover:text-primary-hover"
              >
                ← Back to Checklists
              </Link>
            </div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              {checklist.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl">✅</span>
              <span className="text-lg">{getPriorityIcon(checklist.priority)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(checklist.status)}`}>
                {checklist.status.replace("-", " ")}
              </span>
              {checklist.templateId && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  Template: {checklist.templateId}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Edit Checklist</Button>
            <Button variant="primary">Export</Button>
          </div>
        </div>

        {/* Checklist Overview */}
        <WidgetCard title="Checklist Overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{completedItems}/{checklist.items.length} items</span>
                  <span className="font-medium text-primary">{checklist.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${checklist.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Required Items</h4>
              <div className="space-y-1 text-sm">
                <div>Total Required: {requiredItems}</div>
                <div>Completed: {completedRequiredItems}</div>
                <div className={`font-medium ${completedRequiredItems === requiredItems ? "text-green-600" : "text-orange-600"}`}>
                  {requiredItems - completedRequiredItems} remaining
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Timeline</h4>
              <div className="space-y-1 text-sm">
                <div>Due: {formatDate(checklist.dueDate)}</div>
                {checklist.mustCompleteBy && (
                  <div>Must Complete: {formatDate(checklist.mustCompleteBy)}</div>
                )}
                <div>Est: {Math.round((checklist.estimatedDuration || 0) / 60)}h</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Details</h4>
              <div className="space-y-1 text-sm">
                <div>Assigned: {checklist.assignedToName}</div>
                {checklist.standard && <div>Standard: {checklist.standard}</div>}
                {checklist.auditId && <div>Audit: {checklist.auditId}</div>}
              </div>
            </div>
          </div>

          {checklist.description && (
            <div className="mt-6">
              <h4 className="font-semibold text-dark dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400">{checklist.description}</p>
            </div>
          )}
        </WidgetCard>

        {/* Checklist Items */}
        <WidgetCard title="Checklist Items">
          <div className="space-y-4">
            {checklist.items.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 ${
                  item.completed 
                    ? "border-green-300 bg-green-50 dark:bg-green-900/20" 
                    : item.required
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleItemToggle(item.id)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-semibold ${item.completed ? "line-through text-gray-500" : "text-dark dark:text-white"}`}>
                        {item.title}
                      </h3>
                      {item.required && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                          Required
                        </span>
                      )}
                      {item.completed && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {item.description}
                      </p>
                    )}

                    {item.evidence && item.evidence.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-dark dark:text-white mb-1">Evidence:</div>
                        <div className="flex flex-wrap gap-2">
                          {item.evidence.map((evidence, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                            >
                              📎 {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.notes && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-dark dark:text-white mb-1">Notes:</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                          {item.notes}
                        </div>
                      </div>
                    )}

                    {item.completedAt && (
                      <div className="text-xs text-gray-500 mb-3">
                        Completed: {formatDate(item.completedAt)} at {formatTime(item.completedAt)}
                      </div>
                    )}

                    {/* Add Note Section */}
                    {!item.completed && (
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newItemNote[item.id] || ""}
                            onChange={(e) => setNewItemNote(prev => ({...prev, [item.id]: e.target.value}))}
                            placeholder="Add a note for this item..."
                            className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-dark dark:text-white"
                          />
                          <Button
                            variant="secondary"
                            onClick={() => handleAddItemNote(item.id)}
                            disabled={!newItemNote[item.id]?.trim()}
                          >
                            Add Note
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Tags */}
        {checklist.tags && checklist.tags.length > 0 && (
          <WidgetCard title="Tags">
            <div className="flex flex-wrap gap-2">
              {checklist.tags.map(tag => (
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
            {checklist.comments && checklist.comments.length > 0 ? (
              <div className="space-y-4">
                {checklist.comments.map((comment) => (
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

        {/* Checklist Timeline */}
        <WidgetCard title="Checklist Timeline">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
              <div>
                <div className="font-medium text-dark dark:text-white">Checklist Created</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(checklist.createdAt)} at {formatTime(checklist.createdAt)}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
              <div>
                <div className="font-medium text-dark dark:text-white">Last Updated</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(checklist.updatedAt)} at {formatTime(checklist.updatedAt)}
                </div>
              </div>
            </div>

            {checklist.completedAt && (
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                <div>
                  <div className="font-medium text-dark dark:text-white">Completed</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(checklist.completedAt)} at {formatTime(checklist.completedAt)}
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