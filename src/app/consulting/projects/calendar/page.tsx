"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ConsultingProject, ProjectHealth } from "@/types/consulting";

interface ProjectsResponse {
  success: boolean;
  data: ConsultingProject[];
  stats: any;
  meta: any;
}


const statusColors = {
  "on-track": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "at-risk": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "behind": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusBadges = {
  "on-track": "🟢 On Track",
  "at-risk": "🟡 At Risk",
  "behind": "🔴 Behind",
};

export default function ProjectCalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "timeline" | "gantt">("timeline");
  const [selectedMonth, setSelectedMonth] = useState(new Date(2025, 9)); // October 2025
  const [projects, setProjects] = useState<ConsultingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consulting/projects');
      const data: ProjectsResponse = await response.json();
      
      if (data.success) {
        setProjects(data.data);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthDays = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getDayOfWeek = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const isDateInRange = (date: Date, startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    return date >= start && date <= end;
  };

  const getProjectsForDate = (date: Date) => {
    return projects.filter((p) => isDateInRange(date, p.startDate, p.endDate));
  };

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              PROJECT CALENDAR
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Visual timeline of all consulting projects
            </p>
          </div>
          <Link
            href="/consulting/projects"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            ← Back to Projects
          </Link>
        </div>

        {/* View Controls */}
        <div className="card bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "timeline"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Timeline View
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "month"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setViewMode("gantt")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "gantt"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Gantt Chart
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                ◄
              </button>
              <span className="text-sm font-medium text-dark dark:text-white min-w-[150px] text-center">
                {getMonthName(selectedMonth)}
              </span>
              <button className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                ►
              </button>
            </div>
          </div>

          {/* Timeline View */}
          {viewMode === "timeline" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-dark dark:text-white mb-4">
                Project Timeline - All Active Projects
              </h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading projects...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <button 
                    onClick={fetchProjects}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">No projects found</p>
                </div>
              ) : (
                projects.map((project) => {
                  const startDate = new Date(project.startDate).toLocaleDateString();
                  const endDate = new Date(project.endDate).toLocaleDateString();
                  
                  return (
                    <Link
                      key={project.id}
                      href={`/consulting/projects/${project.id}`}
                      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-dark dark:text-white">{project.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{project.client}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[project.health]}`}>
                          {statusBadges[project.health]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {startDate} → {endDate}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">PM: {project.projectManager}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.completionPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Progress: {project.completionPercentage}% | Budget: ${project.contractValue.toLocaleString()}
                      </p>
                    </Link>
                  );
                })
              )}
            </div>
          )}

          {/* Month View */}
          {viewMode === "month" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-dark dark:text-white mb-4">
                {getMonthName(selectedMonth)}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: getMonthDays(selectedMonth) }).map((_, i) => {
                  const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i + 1);
                  const projects = getProjectsForDate(date);
                  return (
                    <div
                      key={i}
                      className="min-h-24 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{i + 1}</p>
                      <div className="space-y-1">
                        {projects.slice(0, 2).map((p) => (
                          <Link
                            key={p.id}
                            href={`/consulting/projects/${p.id}`}
                            className="text-xs px-1 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 block truncate hover:underline"
                          >
                            {p.name.split(" - ")[0]}
                          </Link>
                        ))}
                        {projects.length > 2 && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">+{projects.length - 2} more</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gantt Chart View */}
          {viewMode === "gantt" && (
            <div className="space-y-4 overflow-x-auto">
              <h3 className="text-sm font-semibold text-dark dark:text-white mb-4">
                Project Gantt Chart
              </h3>
              <div className="min-w-full">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading projects...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button 
                      onClick={fetchProjects}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">No projects found</p>
                  </div>
                ) : (
                  projects.map((project) => {
                    const startDate = new Date(project.startDate).toLocaleDateString();
                    const endDate = new Date(project.endDate).toLocaleDateString();
                    
                    return (
                      <div key={project.id} className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-48 flex-shrink-0">
                          <Link
                            href={`/consulting/projects/${project.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {project.name}
                          </Link>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{project.projectManager}</p>
                        </div>
                        <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded relative">
                          <div
                            className={`h-full rounded flex items-center justify-center text-xs font-medium text-white ${
                              project.health === "on-track"
                                ? "bg-green-500"
                                : project.health === "at-risk"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${project.completionPercentage}%` }}
                          >
                            {project.completionPercentage > 20 && `${project.completionPercentage}%`}
                          </div>
                        </div>
                        <div className="w-32 text-right">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {startDate} to {endDate}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="card bg-white dark:bg-gray-900 p-6">
          <h3 className="text-sm font-semibold text-dark dark:text-white mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-500"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">On Track</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-yellow-500"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">At Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-500"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Behind Schedule</span>
            </div>
          </div>
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

