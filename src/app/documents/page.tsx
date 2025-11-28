"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { QuickStats } from "@/components/Documents/quick-stats";
import { FolderTree } from "@/components/Documents/folder-tree";
import { DocumentCard } from "@/components/Documents/document-card";
import Link from "next/link";
import documentService, {
  Document,
  Folder,
  DocumentLibraryStats,
} from "@/services/document.service";

// Color mapping for folders (for UI consistency)
const FOLDER_COLORS = [
  "blue",
  "purple",
  "red",
  "green",
  "orange",
  "gray",
  "pink",
  "indigo",
  "yellow",
  "teal",
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();

  // State for API data
  const [stats, setStats] = useState<DocumentLibraryStats | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [expiringDocuments, setExpiringDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [statsData, foldersData, recentData, expiringData] =
        await Promise.all([
          documentService.getStats(),
          documentService.getFolders({ page_size: 100 }),
          documentService.getRecentDocuments(10),
          documentService.getExpiringDocuments(30),
        ]);

      setStats(statsData);

      // Add colors to folders for UI
      const foldersWithColors = foldersData?.results?.map((folder, index) => ({
        ...folder,
        color: FOLDER_COLORS[index % FOLDER_COLORS.length],
      })) || [];
      setFolders(foldersWithColors);

      setRecentDocuments(recentData);
      setExpiringDocuments(expiringData);
    } catch (err) {
      console.error("Error fetching documents data:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    return recentDocuments?.filter((doc) => {
      const matchesSearch = doc.file_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "my-docs" && doc.uploaded_by !== null) ||
        (selectedFilter === "recent" && true) ||
        (selectedFilter === "starred" && false) ||
        (selectedFilter === "shared" && false);
      return matchesSearch && matchesFilter;
    }) || [];
  }, [searchTerm, selectedFilter, recentDocuments]);

  // Calculate days left for expiring documents
  const expiringWithDaysLeft = useMemo(() => {
    return expiringDocuments?.map((doc) => {
      const expiryDate = new Date(doc.expiry_date!);
      const today = new Date();
      const daysLeft = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        name: doc.file_name,
        daysLeft,
        id: doc.id,
      };
    }) || [];
  }, [expiringDocuments]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading documents...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Document Management
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Central repository for all documents
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/documents/upload">
              <Button variant="primary">⬆ Upload</Button>
            </Link>
            <Button variant="secondary">+ Folder</Button>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && <QuickStats stats={stats} />}

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex gap-4 mb-4">
            <FormInput
              placeholder="Search documents, clients, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="secondary">Filter</Button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {["all", "my-docs", "recent", "starred", "shared"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {filter === "all" && "All Documents"}
                {filter === "my-docs" && "My Documents"}
                {filter === "recent" && "Recent"}
                {filter === "starred" && "Starred"}
                {filter === "shared" && "Shared"}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Folder Tree */}
          <div className="lg:col-span-1">
            <FolderTree
              folders={folders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
            />
          </div>

          {/* Recent Documents */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark dark:text-white">
                  Recent Documents
                </h3>
                <button
                  onClick={fetchData}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                  title="Refresh"
                >
                  🔄 Refresh
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocuments.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
              {filteredDocuments.length === 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No documents found
                </p>
              )}
              {filteredDocuments.length > 0 && recentDocuments.length > 10 && (
                <button className="w-full mt-4 text-primary hover:text-primary/80 font-medium text-sm">
                  [VIEW ALL RECENT ({recentDocuments.length}+)]
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expiring Documents */}
        {expiringWithDaysLeft.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-dark dark:text-white">
                Expiring Soon
              </h3>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {expiringWithDaysLeft.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="font-medium text-dark dark:text-white">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Expires in {doc.daysLeft} days
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Set Reminder
                  </Button>
                </div>
              ))}
            </div>

            {expiringWithDaysLeft.length > 3 && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                +{expiringWithDaysLeft.length - 3} more expiring documents
              </p>
            )}

            <Button variant="secondary" fullWidth className="mt-4">
              SET RENEWAL REMINDERS
            </Button>
          </div>
        )}

        {/* No Expiring Documents Message */}
        {expiringWithDaysLeft.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center py-8">
              <span className="text-4xl">✅</span>
              <h3 className="mt-4 font-semibold text-dark dark:text-white">
                No Expiring Documents
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                All documents are up to date!
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
