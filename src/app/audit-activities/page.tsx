"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { AuditActivityItem } from "@/types/scheduler";
import Link from "next/link";

const MOCK_AUDIT_ACTIVITIES: AuditActivityItem[] = [];

export default function AuditActivitiesPage() {
  const [activities, setActivities] = useState<AuditActivityItem[]>(MOCK_AUDIT_ACTIVITIES);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedStandard, setSelectedStandard] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter activities based on selected filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesStatus = selectedStatus === "all" || activity.status === selectedStatus;
      const matchesStandard = selectedStandard === "all" || activity.standard === selectedStandard;
      const matchesSearch = searchTerm === "" || 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesStatus && matchesStandard && matchesSearch;
    });
  }, [activities, selectedStatus, selectedStandard, searchTerm]);

  // Get unique standards for filter dropdown
  const uniqueStandards = useMemo(() => {
    return Array.from(new Set(activities.map(activity => activity.standard)));
  }, [activities]);

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

  const handleStatusUpdate = (activityId: string, newStatus: AuditActivityItem['status']) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { 
              ...activity, 
              status: newStatus, 
              updatedAt: new Date(),
              ...(newStatus === "completed" ? { completedAt: new Date() } : {})
            }
          : activity
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
              Audit Activities
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage and track all audit-related activities
            </p>
          </div>
          <Link href="/audit-activities/new">
            <Button variant="primary">+ New Activity</Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-dark dark:text-white">
              {activities.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Activities</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">
              {activities.filter(a => a.status === "in-progress").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600">
              {activities.filter(a => a.dueDate < new Date() && a.status !== "completed").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
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
              <label className="block text-sm font-medium mb-2">Standard</label>
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                <option value="all">All Standards</option>
                {uniqueStandards.map(standard => (
                  <option key={standard} value={standard}>{standard}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search activities, clients, descriptions..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
            </div>
          </div>
        </WidgetCard>

        {/* Activities List */}
        <WidgetCard title={`Activities (${filteredActivities.length})`}>
          {filteredActivities.length > 0 ? (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">{getActivityTypeIcon(activity.activityType)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-dark dark:text-white">
                            {activity.title}
                          </h3>
                          <span className="text-lg">{getPriorityIcon(activity.priority)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status.replace("-", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Client & Standard</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>{activity.clientName}</div>
                        <div>{activity.standard}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Schedule</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>{formatDate(activity.dueDate)} at {activity.dueTime}</div>
                        <div>{activity.estimatedDuration ? Math.round(activity.estimatedDuration / 60) : 0}h duration</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Team</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>Lead: {activity.assignedToName}</div>
                        {activity.teamMembers && activity.teamMembers.length > 0 && (
                          <div>Team: {activity.teamMembers.length} members</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {activity.location && (
                    <div className="mt-3 text-sm">
                      <span className="font-medium text-dark dark:text-white">Location: </span>
                      <span className="text-gray-600 dark:text-gray-400">{activity.location}</span>
                    </div>
                  )}

                  {activity.tags && activity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {activity.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Audit ID: {activity.auditId}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/audit-activities/${activity.id}`}
                        className="px-3 py-1 text-xs font-medium text-primary hover:text-primary-hover"
                      >
                        View Details
                      </Link>
                      {activity.status !== "completed" && (
                        <button
                          onClick={() => handleStatusUpdate(activity.id, "completed")}
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
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
                No activities found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or create a new activity.
              </p>
            </div>
          )}
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}