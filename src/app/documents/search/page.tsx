"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { FormSelect } from "@/components/Dashboard/form-select";
import Link from "next/link";

interface SearchResult {
  id: string;
  fileName: string;
  folderPath: string;
  modifiedDate: Date;
  modifiedBy: string;
  size: number;
  snippet: string;
}

const MOCK_RESULTS: SearchResult[] = [];

function SearchComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "iso 9001 audit report";
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedFilters, setSelectedFilters] = useState({
    documentType: new Set<string>(),
    dateRange: "any-time",
    folder: new Set<string>(),
    client: new Set<string>(),
    tags: new Set<string>(),
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const toggleFilter = (
    category: keyof typeof selectedFilters,
    value: string
  ) => {
    if (typeof selectedFilters[category] === "object" && "has" in selectedFilters[category]) {
      const newSet = new Set(selectedFilters[category] as Set<string>);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      setSelectedFilters({
        ...selectedFilters,
        [category]: newSet,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Document Search Results
          </h1>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <FormInput
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="primary">SEARCH</Button>
          </div>
        </div>

        {/* Results Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found {MOCK_RESULTS.length} documents matching "{query}"
          </p>
          <div className="flex gap-4 mt-3">
            <FormSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "relevance", label: "Relevance" },
                { value: "date-modified", label: "Date Modified" },
                { value: "date-created", label: "Date Created" },
                { value: "name", label: "Name" },
              ]}
            />
            <FormSelect
              options={[
                { value: "all-types", label: "All Types" },
                { value: "pdf", label: "PDF" },
                { value: "word", label: "Word" },
              ]}
            />
            <FormSelect
              options={[
                { value: "any-time", label: "Any Time" },
                { value: "this-month", label: "This Month" },
                { value: "last-3-months", label: "Last 3 Months" },
              ]}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">
                  Document Type
                </h4>
                <div className="space-y-2">
                  {[
                    { value: "pdf", label: "PDF (32)" },
                    { value: "word", label: "Word Doc (8)" },
                    { value: "excel", label: "Excel (5)" },
                    { value: "images", label: "Images (2)" },
                  ].map((type) => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.documentType.has(type.value)}
                        onChange={() => toggleFilter("documentType", type.value)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">
                  Date Range
                </h4>
                <div className="space-y-2">
                  {[
                    { value: "any-time", label: "Any time" },
                    { value: "this-month", label: "This month" },
                    { value: "last-3-months", label: "Last 3 months" },
                    { value: "this-year", label: "This year" },
                  ].map((range) => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="dateRange"
                        value={range.value}
                        checked={selectedFilters.dateRange === range.value}
                        onChange={(e) =>
                          setSelectedFilters({
                            ...selectedFilters,
                            dateRange: e.target.value,
                          })
                        }
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">
                  Folder
                </h4>
                <div className="space-y-2">
                  {[
                    { value: "finance", label: "Finance (12)" },
                    { value: "auditors", label: "Auditors (28)" },
                    { value: "marketing", label: "Marketing (3)" },
                    { value: "hr", label: "HR (4)" },
                  ].map((folder) => (
                    <label key={folder.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.folder.has(folder.value)}
                        onChange={() => toggleFilter("folder", folder.value)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {folder.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">
                  Client
                </h4>
                <div className="space-y-2">
                  {[
                    { value: "abc-corp", label: "ABC Corp (8)" },
                    { value: "xyz-ind", label: "XYZ Industries (6)" },
                    { value: "def-ltd", label: "DEF Limited (4)" },
                  ].map((client) => (
                    <label key={client.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.client.has(client.value)}
                        onChange={() => toggleFilter("client", client.value)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {client.label}
                      </span>
                    </label>
                  ))}
                </div>
                <button className="text-primary text-sm mt-2 hover:text-primary/80">
                  Show all (15)
                </button>
              </div>

              <div>
                <h4 className="font-semibold text-dark dark:text-white mb-3">
                  Tags
                </h4>
                <div className="space-y-2">
                  {[
                    { value: "iso-9001", label: "iso-9001 (24)" },
                    { value: "audit-report", label: "audit-report (18)" },
                    { value: "completed", label: "completed (15)" },
                    { value: "stage-2", label: "stage-2 (12)" },
                  ].map((tag) => (
                    <label key={tag.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.tags.has(tag.value)}
                        onChange={() => toggleFilter("tags", tag.value)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {tag.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="secondary" fullWidth>
                CLEAR FILTERS
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {MOCK_RESULTS.map((result) => (
              <Link key={result.id} href={`/documents/${result.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">📄</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark dark:text-white hover:text-primary">
                        {result.fileName}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {result.folderPath}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <span>Modified: {result.modifiedDate.toLocaleDateString()}</span>
                    <span>by {result.modifiedBy}</span>
                    <span>{formatFileSize(result.size)}</span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {result.snippet}
                  </p>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      OPEN
                    </Button>
                    <Button variant="ghost" size="sm">
                      DOWNLOAD
                    </Button>
                    <Button variant="ghost" size="sm">
                      PREVIEW
                    </Button>
                  </div>
                </div>
              </Link>
            ))}

            <div className="text-center py-6">
              <Button variant="secondary">LOAD MORE RESULTS</Button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Showing {MOCK_RESULTS.length} of 47 documents
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function DocumentSearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchComponent />
    </Suspense>
  );
}

