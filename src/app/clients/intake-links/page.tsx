"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { Badge } from "@/components/Dashboard/badge";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { ClientIntakeLink, IntakeLinkStatus } from "@/types/client-intake";
import {
  getStatusLabel,
  getTimeRemaining,
  formatDate,
  copyToClipboard,
  generateIntakeUrl,
} from "@/lib/intake-utils";
import Link from "next/link";

export default function IntakeLinksPage() {
  const [links, setLinks] = useState<ClientIntakeLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<IntakeLinkStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch links
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

  const handleCopy = async (text: string, id: string, type: "url" | "code") => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(`${id}-${type}`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRevoke = async (linkId: string) => {
    if (!confirm("Are you sure you want to revoke this link? It will no longer be usable.")) {
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
      }
    } catch (error) {
      console.error("Error revoking link:", error);
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
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const stats = {
    total: links.length,
    active: links.filter(l => l.status === "active").length,
    expired: links.filter(l => l.status === "expired").length,
    used: links.filter(l => l.currentUses > 0).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Client Intake Links
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Generate and manage secure links for client information collection
            </p>
          </div>
          <Link href="/clients/intake-links/new">
            <Button variant="primary">+ Generate New Link</Button>
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active</p>
            </div>
          </WidgetCard>
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">{stats.expired}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expired</p>
            </div>
          </WidgetCard>
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.used}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Used</p>
            </div>
          </WidgetCard>
        </div>

        {/* Filters */}
        <WidgetCard>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by notes, access code, or creator..."
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
                No intake links found. Generate a new link to get started.
              </p>
            </div>
          </WidgetCard>
        ) : (
          <div className="space-y-4">
            {links.map((link) => {
              const fullUrl = generateIntakeUrl(link.linkToken);
              const isCopiedUrl = copiedId === `${link.id}-url`;
              const isCopiedCode = copiedId === `${link.id}-code`;

              return (
                <WidgetCard key={link.id}>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            label={getStatusLabel(link.status)}
                            variant={link.status === "active" ? "success" : "neutral"}
                            size="sm"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Created by {link.createdByName} on {formatDate(link.createdAt)}
                          </span>
                        </div>
                        {link.notes && (
                          <p className="text-sm text-dark dark:text-white font-medium">
                            {link.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {link.status === "active" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRevoke(link.id)}
                          >
                            Revoke
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(link.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Link URL */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Link URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={fullUrl}
                          readOnly
                          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCopy(fullUrl, link.id, "url")}
                        >
                          {isCopiedUrl ? "✓ Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>

                    {/* Access Code */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Access Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={link.accessCode}
                          readOnly
                          className="w-40 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-mono bg-gray-50 dark:bg-gray-900"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCopy(link.accessCode, link.id, "code")}
                        >
                          {isCopiedCode ? "✓ Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Expires</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {link.status === "active" ? getTimeRemaining(link.expiresAt) : formatDate(link.expiresAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Usage</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {link.currentUses} / {link.maxUses}
                        </p>
                      </div>
                      {link.relatedAuditName && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Related To</p>
                          <p className="text-sm font-medium text-dark dark:text-white">
                            {link.relatedAuditName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </WidgetCard>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

