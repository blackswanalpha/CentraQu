"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { ScopeObjectivesSection } from "@/components/Consulting/scope-objectives-section";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ProjectTemplate } from "@/types/consulting";

interface TemplatesResponse {
  success: boolean;
  data: ProjectTemplate[];
  categories: string[];
  stats: {
    total: number;
    categories: number;
    totalUsages: number;
    averageTeamSize: number;
  };
  meta: {
    total: number;
    filters: any;
  };
}


export default function ProjectTemplatesPage() {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    totalUsages: 0,
    averageTeamSize: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory, searchTerm]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (selectedCategory && selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      
      const response = await fetch(`/api/consulting/templates?${params.toString()}`);
      const data: TemplatesResponse = await response.json();
      
      if (data.success) {
        setTemplates(data.data);
        setCategories(data.categories);
        setStats(data.stats);
      } else {
        setError('Failed to fetch templates');
      }
    } catch (err) {
      setError('Failed to fetch templates');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/consulting/templates/${templateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'use' }),
      });
      
      if (response.ok) {
        // Update the template usage count in local state
        fetchTemplates();
        console.log("Template usage recorded");
        // In a real app, this would navigate to the new project page with template data pre-filled
      }
    } catch (err) {
      console.error("Error using template:", err);
    }
  };

  const handleEditTemplate = (templateId: string) => {
    console.log("Editing template:", templateId);
    // In a real app, this would open an edit modal or navigate to an edit page
  };

  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        const newTemplate = {
          ...template,
          name: `${template.name} (Copy)`,
          usageCount: 0,
        };
        
        const response = await fetch('/api/consulting/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTemplate),
        });
        
        if (response.ok) {
          fetchTemplates(); // Refresh the list
        }
      }
    } catch (err) {
      console.error("Error duplicating template:", err);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/consulting/templates/${templateId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTemplates(); // Refresh the list
      }
    } catch (err) {
      console.error("Error deleting template:", err);
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
              PROJECT TEMPLATES
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Browse and manage project templates to accelerate project creation
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            + Create Template
          </button>
        </div>

        {/* Info Box */}
        <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> Use templates to quickly create new projects with pre-configured phases, deliverables, and team structures. Templates help maintain consistency across similar project types.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="card bg-white dark:bg-gray-900 p-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search templates by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading templates...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={fetchTemplates}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : templates.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No templates found</p>
            </div>
          ) : (
            templates.map((template) => (
            <div
              key={template.id}
              className="card bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark dark:text-white mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium whitespace-nowrap ml-2">
                  {template.category}
                </span>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                  <p className="font-semibold text-dark dark:text-white">{template.duration} months</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Budget Range</p>
                  <p className="font-semibold text-dark dark:text-white text-sm">{template.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Team Size</p>
                  <p className="font-semibold text-dark dark:text-white">{template.teamSize} people</p>
                </div>
              </div>

              {/* Scope & Objectives */}
              <div className="mb-4">
                <ScopeObjectivesSection data={template} />
              </div>

              {/* Phases */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">PHASES</p>
                <div className="flex flex-wrap gap-2">
                  {template.phases.map((phase, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {phase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Used {template.usageCount} times</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Last used: {template.lastUsed}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Use Template
                </button>
                <button
                  onClick={() => handleEditTemplate(template.id)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template.id)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  title="Duplicate"
                >
                  📋
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="px-3 py-2 rounded-lg border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Template Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Templates</p>
            <p className="text-2xl font-bold text-dark dark:text-white">{stats.total}</p>
          </div>
          <div className="card bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Categories</p>
            <p className="text-2xl font-bold text-dark dark:text-white">{stats.categories}</p>
          </div>
          <div className="card bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Uses</p>
            <p className="text-2xl font-bold text-dark dark:text-white">
              {stats.totalUsages}
            </p>
          </div>
          <div className="card bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Team Size</p>
            <p className="text-2xl font-bold text-dark dark:text-white">
              {stats.averageTeamSize}
            </p>
          </div>
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

