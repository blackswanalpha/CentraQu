"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { IntakeLinkConfig, CreateIntakeLinkResponse } from "@/types/client-intake";
import { copyToClipboard } from "@/lib/intake-utils";

export default function NewIntakeLinkPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<CreateIntakeLinkResponse["data"] | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const [config, setConfig] = useState<IntakeLinkConfig>({
    expiresInHours: 168,
    maxUses: 1,
    notes: "",
  });

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
    const linkUrl = `${window.location.origin}/intake/${generatedLink.link.linkToken}`;
    const text = `Client Intake Form

Link: ${linkUrl}
Access Code: ${generatedLink.link.accessCode}

Please use this link and access code to submit your company information.`;

    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItem("both");
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  if (generatedLink) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8">
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

          <WidgetCard>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                  Link URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedLink.fullUrl}
                    readOnly
                    className="flex-1 rounded-lg border-2 border-stroke px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(generatedLink.fullUrl, "url")}
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
                    value={generatedLink.link.accessCode}
                    readOnly
                    className="w-48 rounded-lg border-2 border-stroke px-4 py-3 text-lg font-mono font-bold text-center bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(generatedLink.link.accessCode, "code")}
                  >
                    {copiedItem === "code" ? "✓ Copied" : "Copy"}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  The client will need this code to access the form
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="primary"
                  onClick={handleCopyBoth}
                  className="w-full"
                >
                  {copiedItem === "both" ? "✓ Copied to Clipboard" : "Copy Link & Code (Ready to Share)"}
                </Button>
                <p className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400">
                  Copies both the link and access code in a ready-to-send format
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-dark dark:text-white mb-3">Link Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Expires</p>
                    <p className="font-medium text-dark dark:text-white">
                      {new Date(generatedLink.link.expiresAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Max Uses</p>
                    <p className="font-medium text-dark dark:text-white">
                      {generatedLink.link.maxUses}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </WidgetCard>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/clients/intake-links")}
              className="flex-1"
            >
              View All Links
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setGeneratedLink(null);
                setConfig({
                  expiresInHours: 168,
                  maxUses: 1,
                  notes: "",
                });
              }}
              className="flex-1"
            >
              Generate Another Link
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Generate Client Intake Link
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Create a secure link for clients to submit their information
          </p>
        </div>

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
                The link will expire after this time period
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
                Notes (Optional)
              </label>
              <textarea
                value={config.notes}
                onChange={(e) => setConfig({ ...config, notes: e.target.value })}
                rows={3}
                placeholder="e.g., For ABC Manufacturing - ISO 9001 certification inquiry"
                className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
              />
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Internal notes to help you identify this link later
              </p>
            </div>
          </div>
        </WidgetCard>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push("/clients/intake-links")}
            className="flex-1"
          >
            Cancel
          </Button>
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
    </DashboardLayout>
  );
}
