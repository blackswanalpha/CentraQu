"use client";

import { useState } from "react";
import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { IntakeLinkConfig, CreateIntakeLinkResponse } from "@/types/client-intake";
import { copyToClipboard } from "@/lib/intake-utils";
import Link from "next/link";

export default function ConsultingNewIntakeLinkPage() {
  const [config, setConfig] = useState<IntakeLinkConfig>({
    expiresInHours: 168, // 7 days
    maxUses: 1,
    notes: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<any>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/clients/intake-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });

      const data: CreateIntakeLinkResponse = await response.json();

      if (data.success && data.data) {
        setGeneratedLink(data.data);
      } else {
        alert(data.error || "Failed to generate link");
      }
    } catch (error) {
      console.error("Error generating link:", error);
      alert("An error occurred while generating the link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, item: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  const handleCopyBoth = async () => {
    if (!generatedLink) return;
    const linkUrl = `${window.location.origin}/intake/${generatedLink.linkToken}`;
    const text = `Client Intake Form\n\nLink: ${linkUrl}\nAccess Code: ${generatedLink.accessCode}\n\nPlease use this link and access code to submit your company information.`;
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItem("both");
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  if (generatedLink) {
    const linkUrl = `${window.location.origin}/intake/${generatedLink.linkToken}`;

    return (
      <ConsultingDashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Link Generated Successfully!
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Share this link and access code with your client
            </p>
          </div>

          {/* Link Details */}
          <WidgetCard>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Link URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={linkUrl}
                    readOnly
                    className="flex-1 rounded-lg border-2 border-stroke px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(linkUrl, "url")}
                  >
                    {copiedItem === "url" ? "✓ Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Access Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedLink.accessCode}
                    readOnly
                    className="flex-1 rounded-lg border-2 border-stroke px-4 py-3 text-2xl font-mono text-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(generatedLink.accessCode, "code")}
                  >
                    {copiedItem === "code" ? "✓ Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="primary"
                  onClick={handleCopyBoth}
                  className="w-full"
                >
                  {copiedItem === "both" ? "✓ Copied to Clipboard" : "Copy Link & Code Together"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Expires</p>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {new Date(generatedLink.expiresAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Max Uses</p>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {generatedLink.maxUses}
                  </p>
                </div>
              </div>

              {generatedLink.notes && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Notes</p>
                  <p className="text-sm text-dark dark:text-white mt-1">
                    {generatedLink.notes}
                  </p>
                </div>
              )}
            </div>
          </WidgetCard>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/consulting/clients/intake-links" className="flex-1">
              <Button variant="secondary" className="w-full">
                View All Links
              </Button>
            </Link>
            <Button
              variant="primary"
              onClick={() => setGeneratedLink(null)}
              className="flex-1"
            >
              Generate Another Link
            </Button>
          </div>
        </div>
      </ConsultingDashboardLayout>
    );
  }

  return (
    <ConsultingDashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Link href="/consulting/clients/intake-links" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Back to Intake Links
          </Link>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Generate New Intake Link
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Create a secure link for clients to submit their information
          </p>
        </div>

        {/* Configuration Form */}
        <WidgetCard>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Link Expiration
              </label>
              <select
                value={config.expiresInHours}
                onChange={(e) => setConfig({ ...config, expiresInHours: Number(e.target.value) })}
                className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
              >
                <option value={24}>24 hours (1 day)</option>
                <option value={72}>72 hours (3 days)</option>
                <option value={168}>168 hours (7 days)</option>
                <option value={336}>336 hours (14 days)</option>
                <option value={720}>720 hours (30 days)</option>
              </select>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                The link will automatically expire after this period
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Maximum Uses
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={config.maxUses}
                onChange={(e) => setConfig({ ...config, maxUses: Number(e.target.value) })}
                className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
              />
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                How many times this link can be used (typically 1 for single client)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Internal Notes (Optional)
              </label>
              <textarea
                value={config.notes}
                onChange={(e) => setConfig({ ...config, notes: e.target.value })}
                rows={3}
                placeholder="e.g., For ABC Manufacturing - ISO 9001 inquiry"
                className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
              />
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Add notes to help identify this link later (not visible to client)
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Generate Button */}
        <div className="flex gap-4">
          <Link href="/consulting/clients/intake-links" className="flex-1">
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? "Generating..." : "Generate Link"}
          </Button>
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}

