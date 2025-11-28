"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { ChecklistItem } from "@/types/scheduler";
import { auditService, AuditChecklist } from "@/services/audit.service";
import Link from "next/link";

// Helper function to convert API AuditChecklist to ChecklistItem
const convertToChecklistItem = (checklist: AuditChecklist): ChecklistItem => {
  const totalItems = checklist.items?.length || 0;
  const completedItems = 0; // API doesn't track completion yet
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    id: `checklist-${checklist.id}`,
    title: checklist.title,
    description: checklist.description,
    type: "checklist",
    status: "not-started", // Default status, API doesn't have this field yet
    priority: "medium", // Default priority, API doesn't have this field yet
    assignedTo: checklist.created_by?.toString(),
    assignedToName: checklist.created_by_name,
    dueDate: new Date(checklist.created_at), // Using created_at as placeholder
    estimatedDuration: totalItems * 15, // Estimate 15 mins per item
    templateId: checklist.is_template ? `template-${checklist.id}` : undefined,
    templateName: checklist.is_template ? checklist.title : undefined,
    standard: checklist.iso_standard_data?.code || "Unknown",
    items: checklist.items?.map(item => ({
      id: `item-${item.id}`,
      title: item.question,
      description: item.guidance,
      required: true,
      completed: false,
    })) || [],
    completionRate,
    tags: [checklist.iso_standard_data?.code || "checklist"],
    createdAt: new Date(checklist.created_at),
    updatedAt: new Date(checklist.updated_at),
  };
};

// Mock data removed - now using real API data

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedStandard, setSelectedStandard] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch checklists from API
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await auditService.getChecklists({
          ordering: '-created_at',
        });

        const checklistItems = response.results.map(convertToChecklistItem);
        setChecklists(checklistItems);
      } catch (err) {
        console.error('Error fetching checklists:', err);
        setError('Failed to load checklists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChecklists();
  }, []);

  // Filter checklists based on selected filters
  const filteredChecklists = useMemo(() => {
    return checklists.filter(checklist => {
      const matchesStatus = selectedStatus === "all" || checklist.status === selectedStatus;
      const matchesStandard = selectedStandard === "all" || checklist.standard === selectedStandard;
      const matchesSearch = searchTerm === "" || 
        checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (checklist.description && checklist.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        checklist.templateName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesStandard && matchesSearch;
    });
  }, [checklists, selectedStatus, selectedStandard, searchTerm]);

  // Get unique standards for filter dropdown
  const uniqueStandards = useMemo(() => {
    return Array.from(new Set(checklists.map(checklist => checklist.standard).filter(Boolean)));
  }, [checklists]);

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

  const handleItemToggle = (checklistId: string, itemId: string) => {
    setChecklists(prev => 
      prev.map(checklist => {
        if (checklist.id === checklistId) {
          const updatedItems = checklist.items.map(item => {
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
            ...checklist,
            items: updatedItems,
            completionRate,
            updatedAt: new Date(),
            status: completionRate === 100 ? "completed" : checklist.status,
            ...(completionRate === 100 ? { completedAt: new Date() } : {}),
          };
        }
        return checklist;
      })
    );
  };

  const handleStatusUpdate = (checklistId: string, newStatus: ChecklistItem['status']) => {
    setChecklists(prev => 
      prev.map(checklist => 
        checklist.id === checklistId 
          ? { 
              ...checklist, 
              status: newStatus, 
              updatedAt: new Date(),
              ...(newStatus === "completed" ? { completedAt: new Date() } : {})
            }
          : checklist
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
              Checklists
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage audit checklists and track completion progress
            </p>
          </div>
          {!loading && (
          <div className="flex gap-2">
            <Link href="/checklists/templates">
              <Button variant="secondary">📋 Templates</Button>
            </Link>
            <Link href="/checklists/new">
              <Button variant="primary">+ New Checklist</Button>
            </Link>
          </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading checklists...</p>
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
              {checklists.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Checklists</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">
              {checklists.filter(c => c.status === "in-progress").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">
              {checklists.filter(c => c.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(checklists.reduce((sum, c) => sum + c.completionRate, 0) / checklists.length)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Completion</div>
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
                placeholder="Search checklists, templates, descriptions..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
            </div>
          </div>
        </WidgetCard>

        {/* Checklists List */}
        <WidgetCard title={`Checklists (${filteredChecklists.length})`}>
          {filteredChecklists.length > 0 ? (
            <div className="space-y-6">
              {filteredChecklists.map((checklist) => (
                <div
                  key={checklist.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">✅</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-dark dark:text-white">
                            {checklist.title}
                          </h3>
                          <span className="text-lg">{getPriorityIcon(checklist.priority)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(checklist.status)}`}>
                            {checklist.status.replace("-", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {checklist.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-dark dark:text-white">
                        Progress: {checklist.items.filter(item => item.completed).length}/{checklist.items.length} items
                      </span>
                      <span className="font-medium text-primary">
                        {checklist.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${checklist.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2 mb-4">
                    {checklist.items.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleItemToggle(checklist.id, item.id)}
                          className="mt-1 rounded"
                        />
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${item.completed ? "line-through text-gray-500" : "text-dark dark:text-white"}`}>
                            {item.title}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {item.description}
                            </div>
                          )}
                          {item.notes && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              Note: {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {checklist.items.length > 5 && (
                      <div className="text-center py-2">
                        <Link
                          href={`/checklists/${checklist.id}`}
                          className="text-sm text-primary hover:text-primary-hover"
                        >
                          Show {checklist.items.length - 5} more items
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Template & Standard</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>{checklist.templateName}</div>
                        <div>{checklist.standard}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Schedule</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>Due: {formatDate(checklist.dueDate)}</div>
                        <div>Est: {Math.round((checklist.estimatedDuration || 0) / 60)}h</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Assignment</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>Assigned: {checklist.assignedToName}</div>
                        {checklist.auditId && <div>Audit: {checklist.auditId}</div>}
                      </div>
                    </div>
                  </div>

                  {checklist.tags && checklist.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {checklist.tags.map(tag => (
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
                      Template: {checklist.templateId}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/checklists/${checklist.id}`}
                        className="px-3 py-1 text-xs font-medium text-primary hover:text-primary-hover"
                      >
                        View Full Checklist
                      </Link>
                      {checklist.status !== "completed" && checklist.completionRate < 100 && (
                        <button
                          onClick={() => handleStatusUpdate(checklist.id, "completed")}
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
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
                No checklists found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or create a new checklist.
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