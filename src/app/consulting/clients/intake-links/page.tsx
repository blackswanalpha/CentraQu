"use client";

import { useState, useEffect } from "react";
import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { Badge } from "@/components/Dashboard/badge";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { ClientIntakeLink, IntakeLinkStatus } from "@/types/client-intake";
import { formatDate, getStatusLabel, copyToClipboard, calculateLinkStatus } from "@/lib/intake-utils";
import Link from "next/link";

export default function ConsultingIntakeLinksPage() {
  const [links, setLinks] = useState<ClientIntakeLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<IntakeLinkStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, [statusFilter, searchTerm]);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/clients/intake-links?${params}`);
      const data = await response.json();

      if (data.success) {
        setLinks(data.data);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, itemId: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  const handleRevoke = async (linkId: string) => {
    if (!confirm("Are you sure you want to revoke this link? It will no longer be accessible.")) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/intake-links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });

      const data = await response.json();

      if (data.success) {
        fetchLinks();
      } else {
        alert(data.error || "Failed to revoke link");
      }
    } catch (error) {
      console.error("Error revoking link:", error);
      alert("An error occurred while revoking the link");
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/intake-links/${linkId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        fetchLinks();
      } else {
        alert(data.error || "Failed to delete link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      alert("An error occurred while deleting the link");
    }
  };

  const getStatusBadge = (status: IntakeLinkStatus) => {
    const variants: Record<IntakeLinkStatus, "success" | "warning" | "error" | "neutral"> = {
      active: "success",
      expired: "warning",
      exhausted: "neutral",
      revoked: "error",
    };
    return <Badge label={getStatusLabel(status)} variant={variants[status]} size="sm" />;
  };

  const stats = {
    total: links.length,
    active: links.filter(l => calculateLinkStatus(l) === "active").length,
    submissions: links.reduce((sum, l) => sum + l.currentUses, 0),
    conversionRate: links.length > 0 
      ? Math.round((links.reduce((sum, l) => sum + l.currentUses, 0) / links.length) * 100) 
      : 0,
  };

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Client Intake Links
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Generate and manage secure client intake form links
            </p>
          </div>
          <Link href="/consulting/clients/intake-links/new">
            <Button variant="primary">
              Generate New Link
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-dark dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Links</p>
            </div>
          </WidgetCard>
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Links</p>
            </div>
          </WidgetCard>
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.submissions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Submissions</p>
            </div>
          </WidgetCard>
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.conversionRate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg. Conversion</p>
            </div>
          </WidgetCard>
        </div>

        {/* Filters */}
        <WidgetCard>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by notes or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as IntakeLinkStatus | "all")}
              className="rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="exhausted">Exhausted</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </WidgetCard>

        {/* Links List */}
        {isLoading ? (
          <WidgetCard>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading links...</p>
            </div>
          </WidgetCard>
        ) : links.length === 0 ? (
          <WidgetCard>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No intake links found. Generate your first link to get started.
              </p>
            </div>
          </WidgetCard>
        ) : (
          <div className="space-y-4">
            {links.map((link) => {
              const status = calculateLinkStatus(link);
              const linkUrl = `${window.location.origin}/intake/${link.linkToken}`;

              return (
                <WidgetCard key={link.id}>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(status)}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Created {formatDate(link.createdAt)} by {link.createdByName}
                          </span>
                        </div>
                        {link.notes && (
                          <p className="text-sm text-dark dark:text-white">
                            {link.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {status === "active" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRevoke(link.id)}
                          >
                            Revoke
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(link.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Link Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Link URL</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded overflow-x-auto">
                            {linkUrl}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(linkUrl, `url-${link.id}`)}
                          >
                            {copiedItem === `url-${link.id}` ? "✓" : "Copy"}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Access Code</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-lg font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-center">
                            {link.accessCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(link.accessCode, `code-${link.id}`)}
                          >
                            {copiedItem === `code-${link.id}` ? "✓" : "Copy"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Expires</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {formatDate(link.expiresAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Usage</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {link.currentUses} / {link.maxUses}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Last Accessed</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {link.lastAccessedAt ? formatDate(link.lastAccessedAt) : "Never"}
                        </p>
                      </div>
                    </div>
                  </div>
                </WidgetCard>
              );
            })}
          </div>
        )}
      </div>
    </ConsultingDashboardLayout>
  );
}

