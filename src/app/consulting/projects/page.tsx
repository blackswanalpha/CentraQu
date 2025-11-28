"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ConsultingProject, ProjectStatus, ProjectHealth } from "@/types/consulting";

interface ProjectsResponse {
  success: boolean;
  data: ConsultingProject[];
  stats: {
    total: number;
    active: number;
    onTrack: number;
    atRisk: number;
    behind: number;
    totalValue: number;
    recognizedRevenue: number;
    remainingRevenue: number;
  };
  meta: {
    total: number;
    filters: any;
  };
}


const statusColors = {
  "on-track": { bg: "bg-green-50 dark:bg-green-950/20", border: "border-green-200 dark:border-green-800", icon: "🟢" },
  "at-risk": { bg: "bg-yellow-50 dark:bg-yellow-950/20", border: "border-yellow-200 dark:border-yellow-800", icon: "🟡" },
  "behind": { bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-200 dark:border-red-800", icon: "🔴" },
};

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban" | "gantt" | "grid">("list");
  const [statusFilter, setStatusFilter] = useState<"all" | "on-track" | "at-risk" | "behind">("all");
  const [projects, setProjects] = useState<ConsultingProject[]>([]);
  const [stats, setStats] = useState({
    active: 0,
    onTrack: 0,
    atRisk: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("health", statusFilter);
      }
      
      const response = await fetch(`/api/consulting/projects?${params.toString()}`);
      const data: ProjectsResponse = await response.json();
      
      if (data.success) {
        setProjects(data.data);
        setStats({
          active: data.stats.active,
          onTrack: data.stats.onTrack,
          atRisk: data.stats.atRisk,
          totalValue: data.stats.totalValue,
        });
      } else {
        setError(data.error || "Failed to fetch projects");
      }
    } catch (err) {
      setError("Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Project Management
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Overview of all active and completed consulting projects
            </p>
          </div>
          <Link
            href="/consulting/projects/new"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            + New Project
          </Link>
        </div>

        {/* Portfolio Summary */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ACTIVE PROJECTS</p>
            <p className="mt-2 text-3xl font-bold text-dark dark:text-white">{stats.active}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Running</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ON TRACK</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats.onTrack}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">({stats.active > 0 ? Math.round((stats.onTrack / stats.active) * 100) : 0}%)</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AT RISK</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.atRisk}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">({stats.active > 0 ? Math.round((stats.atRisk / stats.active) * 100) : 0}%)</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TOTAL VALUE</p>
            <p className="mt-2 text-3xl font-bold text-dark dark:text-white">${(stats.totalValue / 1000).toFixed(0)}K</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Active</p>
          </div>
        </div>

        {/* Filters & Views */}
        <WidgetCard title="FILTERS & VIEWS">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <select 
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "on-track" | "at-risk" | "behind")}
              >
                <option value="all">Status: All</option>
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="behind">Behind</option>
              </select>
              <select className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900">
                <option>PM: All</option>
              </select>
              <select className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900">
                <option>Client: All</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                My Projects
              </button>
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                Critical
              </button>
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                Completing
              </button>
              <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                Planned
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search projects..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900"
              />
              <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                Export
              </button>
            </div>
          </div>
        </WidgetCard>

        {/* View Mode & Sort */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(["list", "kanban", "gantt", "grid"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === mode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {mode === "list" ? "● List" : mode === "kanban" ? "○ Kanban" : mode === "gantt" ? "○ Gantt" : "○ Grid"}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {projects.length} projects
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
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
              const colors = statusColors[project.health];
              const startDate = new Date(project.startDate).toLocaleDateString();
              const endDate = new Date(project.endDate).toLocaleDateString();
              const daysRemaining = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <Link key={project.id} href={`/consulting/projects/${project.id}`}>
                  <div className={`rounded-lg border ${colors.border} ${colors.bg} p-6 cursor-pointer hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{colors.icon}</span>
                          <h3 className="font-semibold text-dark dark:text-white">{project.id} | {project.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          PM: {project.projectManager} | Budget: ${(project.contractValue / 1000).toFixed(0)}K | Client: {project.client}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progress: {project.completionPercentage}%</span>
                        <span className="text-gray-600 dark:text-gray-400">Phase: {project.phase}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                        <div
                          className={`h-full ${
                            project.health === "on-track"
                              ? "bg-green-500"
                              : project.health === "at-risk"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${project.completionPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Start: {startDate} | End: {endDate}</span>
                        <span>Days Remaining: {daysRemaining}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-medium">Revenue: ${(project.recognizedRevenue / 1000).toFixed(0)}K / ${(project.contractValue / 1000).toFixed(0)}K</span>
                        <button className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700">
                          Open Project
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

