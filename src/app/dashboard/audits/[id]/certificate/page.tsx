"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use } from "react";

export default function CertificationIssuancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] = useState<any>(null);

  // TODO: Fetch certificate data from API
  // useEffect(() => {
  //   const fetchCertificateData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await getCertificateDataForAudit(resolvedParams.id);
  //       setCertificateData(data);
  //     } catch (error) {
  //       console.error("Failed to load certificate data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchCertificateData();
  // }, [resolvedParams.id]);

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000);
    setCertificateData({
      ...certificateData,
      certificateNumber: `CERT-${year}-${String(random).padStart(4, "0")}`,
    });
  };

  const calculateExpiryDate = () => {
    if (!certificateData) return;
    const issueDate = new Date(certificateData.issueDate);
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);
    setCertificateData({
      ...certificateData,
      expiryDate: expiryDate.toISOString().split("T")[0],
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600 dark:text-gray-400">Loading certificate data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!certificateData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-error mb-4">Certificate data not found</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            Back to Audit
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:text-primary-hover mb-2"
          >
            ← Back to Audit
          </button>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Issue Certification
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Generate and issue certification for audit {resolvedParams.id}
          </p>
        </div>

        {/* Certificate Template Selection */}
        <WidgetCard title="Certificate Template">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Template
              </label>
              <select
                value={certificateData.template}
                onChange={(e) =>
                  setCertificateData({
                    ...certificateData,
                    template: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="standard">Standard Certificate Template</option>
                <option value="premium">Premium Certificate Template</option>
                <option value="minimal">Minimal Certificate Template</option>
                <option value="custom">Custom Template</option>
              </select>
            </div>

            {/* Template Preview */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-900 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Certificate Preview
              </p>
              <div className="bg-white dark:bg-gray-800 p-8 rounded border-2 border-gold-400">
                <p className="text-2xl font-bold text-dark dark:text-white mb-4">
                  CERTIFICATE OF CONFORMITY
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  This is to certify that
                </p>
                <p className="text-lg font-semibold text-dark dark:text-white mb-6">
                  {certificateData.clientName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  has been audited and found to conform to
                </p>
                <p className="text-lg font-semibold text-dark dark:text-white mb-6">
                  {certificateData.standard}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Certificate No: {certificateData.certificateNumber}
                </p>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Certificate Details */}
        <WidgetCard title="Certificate Details">
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={certificateData.clientName}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      clientName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Certification Standard
                </label>
                <input
                  type="text"
                  value={certificateData.standard}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      standard: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Certificate Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={certificateData.certificateNumber}
                    onChange={(e) =>
                      setCertificateData({
                        ...certificateData,
                        certificateNumber: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={generateCertificateNumber}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Audit Type
                </label>
                <input
                  type="text"
                  value={certificateData.auditType}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-100 dark:bg-gray-800"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={certificateData.issueDate}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      issueDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={certificateData.expiryDate}
                    onChange={(e) =>
                      setCertificateData({
                        ...certificateData,
                        expiryDate: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={calculateExpiryDate}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                  >
                    Auto (3yr)
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Scope of Certification
              </label>
              <textarea
                value={certificateData.scope}
                onChange={(e) =>
                  setCertificateData({
                    ...certificateData,
                    scope: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
              ></textarea>
            </div>
          </div>
        </WidgetCard>

        {/* Digital Signature */}
        <WidgetCard title="Digital Signature">
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={certificateData.includeSignature}
                onChange={(e) =>
                  setCertificateData({
                    ...certificateData,
                    includeSignature: e.target.checked,
                  })
                }
              />
              <span className="font-medium">Include Digital Signature</span>
            </label>

            {certificateData.includeSignature && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Signature Type
                </label>
                <select
                  value={certificateData.signatureType}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      signatureType: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="digital">Digital Signature (PKI)</option>
                  <option value="scanned">Scanned Signature</option>
                  <option value="electronic">Electronic Signature</option>
                </select>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <p className="text-xs text-blue-900 dark:text-blue-300">
                Lead Auditor: {certificateData.leadAuditor}
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
            Preview
          </button>
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
            Generate PDF
          </button>
          <button className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10">
            Email to Client
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
            Save as Draft
          </button>
        </div>

        {/* Certificate Register */}
        <WidgetCard title="Certificate Register">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This certificate will be automatically added to the certificate register upon issuance.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Certificate Number:</span>
              <span className="font-medium">{certificateData.certificateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Client:</span>
              <span className="font-medium">{certificateData.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span>Standard:</span>
              <span className="font-medium">{certificateData.standard}</span>
            </div>
            <div className="flex justify-between">
              <span>Valid From:</span>
              <span className="font-medium">{certificateData.issueDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Valid Until:</span>
              <span className="font-medium">{certificateData.expiryDate}</span>
            </div>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

