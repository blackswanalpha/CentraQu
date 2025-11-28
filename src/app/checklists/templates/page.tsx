"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { auditService, AuditChecklist } from "@/services/audit.service";
import Link from "next/link";

// Mock data removed - now using real API data

export default function ChecklistTemplatesPage() {
  const [templates, setTemplates] = useState<AuditChecklist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await auditService.getChecklists({
          is_template: true,
          ordering: '-created_at',
        });

        setTemplates(response.results);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Filter templates based on selected filters
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const standardCode = template.iso_standard_data?.code || "Unknown";
      const matchesStandard = selectedStandard === "all" || standardCode === selectedStandard;
      // Category filtering disabled for now as API doesn't have category field
      const matchesCategory = selectedCategory === "all";
      const matchesSearch = searchTerm === "" ||
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStandard && matchesCategory && matchesSearch;
    });
  }, [templates, selectedStandard, selectedCategory, searchTerm]);

  // Get unique standards for filter dropdowns
  const uniqueStandards = useMemo(() => {
    return Array.from(new Set(templates.map(template => template.iso_standard_data?.code || "Unknown")));
  }, [templates]);

  // Categories not available in API yet
  const uniqueCategories = useMemo(() => {
    return [];
  }, [templates]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleUseTemplate = (templateId: string) => {
    // Navigate to new checklist page with template pre-selected
    window.location.href = `/checklists/new?template=${templateId}`;
  };

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
              Checklist Templates
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Pre-built checklist templates for common audit activities and compliance verification
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Import Template</Button>
            <Button variant="primary">+ Create Template</Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading templates...</p>
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
              {templates.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Templates</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">
              {uniqueStandards.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Standards Covered</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">
              {templates.reduce((sum, t) => sum + (t.items?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600">
              {templates.length > 0 ? Math.round(templates.reduce((sum, t) => sum + (t.items?.length || 0), 0) / templates.length) : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Items</div>
          </div>
        </div>

        {/* Filters */}
        <WidgetCard title="Filters">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates, descriptions, tags..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
            </div>
          </div>
        </WidgetCard>

        {/* Templates Grid */}
        <WidgetCard title={`Templates (${filteredTemplates.length})`}>
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">📋</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-dark dark:text-white mb-2">
                          {template.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Template Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Standard</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>{template.iso_standard_data?.code || "Unknown"}</div>
                        <div>{template.iso_standard_data?.name || ""}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-dark dark:text-white mb-1">Template Stats</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <div>{template.items?.length || 0} items</div>
                        <div>{Math.round((template.items?.length || 0) * 15 / 60)}h estimated</div>
                      </div>
                    </div>
                  </div>

                  {/* Template Items Preview */}
                  {template.items && template.items.length > 0 && (
                  <div className="mb-4">
                    <div className="font-medium text-dark dark:text-white mb-2">Template Items</div>
                    <div className="space-y-1">
                      {template.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="text-gray-400 mt-1">•</div>
                          <div className="flex-1">
                            <span className="text-dark dark:text-white">{item.question}</span>
                          </div>
                        </div>
                      ))}
                      {template.items.length > 3 && (
                        <div className="text-sm text-gray-500 ml-3">
                          +{template.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created {formatDate(new Date(template.created_at))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="px-3 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-primary-hover transition"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
                No templates found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or create a new template.
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