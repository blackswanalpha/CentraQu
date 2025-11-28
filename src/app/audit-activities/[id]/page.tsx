"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { AuditActivityItem, SchedulerComment } from "@/types/scheduler";
import Link from "next/link";

// Mock data for audit activities (same as main page)
const MOCK_AUDIT_ACTIVITIES: AuditActivityItem[] = [
  {
    id: "activity-1",
    title: "ISO 9001 Stage 2 Audit - ABC Corporation",
    description: "Comprehensive on-site audit for quality management system certification",
    type: "audit-activity",
    status: "in-progress",
    priority: "high",
    assignedTo: "sarah-mitchell",
    assignedToName: "Sarah Mitchell",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    dueTime: "09:00",
    estimatedDuration: 480,
    auditId: "A-2025-001",
    clientId: "ABC-Corp",
    clientName: "ABC Corporation",
    standard: "ISO 9001:2015",
    location: "ABC Corporation Main Office, Nairobi",
    activityType: "site-visit",
    stage: "stage-2",
    leadAuditor: "sarah-mitchell",
    teamMembers: ["james-kennedy", "linda-peterson"],
    equipment: ["Laptop", "Documentation scanner", "Audio recorder"],
    documents: ["Audit plan", "Previous report", "Client documentation"],
    tags: ["iso9001", "stage2", "nairobi"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    comments: [
      {
        id: "comment-1",
        authorId: "sarah-mitchell",
        authorName: "Sarah Mitchell",
        content: "Pre-audit documentation review completed. All required documents are in place.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "comment-2",
        authorId: "james-kennedy",
        authorName: "James Kennedy",
        content: "Client has confirmed availability of key personnel for interviews during audit.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "activity-2",
    title: "ISO 14001 Surveillance Audit - XYZ Industries",
    description: "Annual surveillance audit for environmental management system",
    type: "audit-activity",
    status: "not-started",
    priority: "medium",
    assignedTo: "james-kennedy",
    assignedToName: "James Kennedy",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    dueTime: "10:00",
    estimatedDuration: 360,
    auditId: "A-2025-002",
    clientId: "XYZ-Industries",
    clientName: "XYZ Industries Ltd",
    standard: "ISO 14001:2015",
    location: "XYZ Industries Plant, Mombasa",
    activityType: "site-visit",
    stage: "surveillance",
    leadAuditor: "james-kennedy",
    teamMembers: ["emma-wilson"],
    equipment: ["Laptop", "Environmental measuring tools"],
    documents: ["Previous audit report", "Surveillance checklist"],
    tags: ["iso14001", "surveillance", "mombasa"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export default function AuditActivityDetailPage() {
  const params = useParams();
  const activityId = params.id as string;
  const [newComment, setNewComment] = useState("");
  
  const activity = useMemo(() => {
    return MOCK_AUDIT_ACTIVITIES.find(a => a.id === activityId);
  }, [activityId]);

  if (!activity) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white mb-2">
            Activity Not Found
          </h1>
          <p className="text-body-base text-gray-600 dark:text-gray-400 mb-4">
            The audit activity you're looking for doesn't exist.
          </p>
          <Link href="/audit-activities">
            <Button variant="primary">Back to Activities</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: AuditActivityItem['status']) => {
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

  const getPriorityIcon = (priority: AuditActivityItem['priority']) => {
    switch (priority) {
      case "critical": return "🔴";
      case "high": return "🟠";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  const getActivityTypeIcon = (type: AuditActivityItem['activityType']) => {
    switch (type) {
      case "site-visit": return "🏢";
      case "preparation": return "📋";
      case "documentation": return "📄";
      case "report-writing": return "✍️";
      case "follow-up": return "🔄";
      default: return "📝";
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/audit-activities"
                className="text-primary hover:text-primary-hover"
              >
                ← Back to Activities
              </Link>
            </div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              {activity.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl">{getActivityTypeIcon(activity.activityType)}</span>
              <span className="text-lg">{getPriorityIcon(activity.priority)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activity.status)}`}>
                {activity.status.replace("-", " ")}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ID: {activity.auditId}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Edit Activity</Button>
            <Button variant="primary">Update Status</Button>
          </div>
        </div>

        {/* Activity Overview */}
        <WidgetCard title="Activity Overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Client Information</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Client:</span> {activity.clientName}</div>
                <div><span className="font-medium">Standard:</span> {activity.standard}</div>
                <div><span className="font-medium">Stage:</span> {activity.stage}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Schedule</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Date:</span> {formatDate(activity.dueDate)}</div>
                <div><span className="font-medium">Time:</span> {activity.dueTime}</div>
                <div><span className="font-medium">Duration:</span> {Math.round(activity.estimatedDuration / 60)}h</div>
                <div><span className="font-medium">Location:</span> {activity.location}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-dark dark:text-white mb-2">Team</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Lead Auditor:</span> {activity.assignedToName}</div>
                {activity.teamMembers && activity.teamMembers.length > 0 && (
                  <div><span className="font-medium">Team Members:</span> {activity.teamMembers.length}</div>
                )}
              </div>
            </div>
          </div>

          {activity.description && (
            <div className="mt-6">
              <h4 className="font-semibold text-dark dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400">{activity.description}</p>
            </div>
          )}
        </WidgetCard>

        {/* Equipment & Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WidgetCard title="Required Equipment">
            {activity.equipment && activity.equipment.length > 0 ? (
              <ul className="space-y-2">
                {activity.equipment.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No equipment specified</p>
            )}
          </WidgetCard>

          <WidgetCard title="Required Documents">
            {activity.documents && activity.documents.length > 0 ? (
              <ul className="space-y-2">
                {activity.documents.map((doc, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-blue-500">📄</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No documents specified</p>
            )}
          </WidgetCard>
        </div>

        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <WidgetCard title="Tags">
            <div className="flex flex-wrap gap-2">
              {activity.tags.map(tag => (
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
            {activity.comments && activity.comments.length > 0 ? (
              <div className="space-y-4">
                {activity.comments.map((comment) => (
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

        {/* Activity Timeline */}
        <WidgetCard title="Activity Timeline">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
              <div>
                <div className="font-medium text-dark dark:text-white">Activity Created</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(activity.createdAt)} at {formatTime(activity.createdAt)}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
              <div>
                <div className="font-medium text-dark dark:text-white">Last Updated</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(activity.updatedAt)} at {formatTime(activity.updatedAt)}
                </div>
              </div>
            </div>

            {activity.completedAt && (
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                <div>
                  <div className="font-medium text-dark dark:text-white">Completed</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(activity.completedAt)} at {formatTime(activity.completedAt)}
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