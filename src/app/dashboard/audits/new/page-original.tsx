"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clientService } from "@/services/client.service";
import { auditService } from "@/services/audit.service";
import { apiClient } from "@/lib/api-client";
import type { Client } from "@/types/audit";

interface Employee {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  full_name?: string;
}

export default function ScheduleNewAuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [auditors, setAuditors] = useState<Employee[]>([]);
  const [isoStandards, setIsoStandards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    client: "",
    standards: [] as string[], // Changed to array for multiple standards
    standard: "", // Keep for backward compatibility
    auditType: "INITIAL",
    stage: 1,
    scope: "",
    title: "",
    description: "",
    startDate: "",
    duration: 3,
    leadAuditor: "",
    cost: 0,
    certificationStandards: [{ standard: "", cost: 0 }],
    selectedAuditors: [] as string[],
    auditee: {
      name: "",
      title: "",
      contact: "",
      email: "",
    },
  });

  const steps = [
    { number: 1, title: "Client & Certification" },
    { number: 2, title: "Dates & Duration" },
    { number: 3, title: "Audit Team & Resources" },
    { number: 4, title: "Review & Confirm" },
  ];

  const progressPercentage = (step / 4) * 100;

  // Fetch clients, auditors, and ISO standards on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientsResponse, auditorsResponse, standardsResponse] = await Promise.all([
          clientService.getClients({ status: 'active' }),
          apiClient.get<{ results: Employee[] }>('/employees/?role=auditor'),
          auditService.getISOStandards(),
        ]);

        setClients(clientsResponse.results || []);
        setAuditors(auditorsResponse.results || []);
        setIsoStandards(standardsResponse.results || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle client selection
  const handleClientChange = (clientId: string) => {
    setFormData({ ...formData, client: clientId });
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleScheduleAudit = async () => {
    try {
      // Validate required fields
      if (!formData.client) {
        alert('Please select a client');
        return;
      }
      if (formData.standards.length === 0) {
        alert('Please select at least one ISO standard');
        return;
      }
      if (!formData.title || formData.title.trim() === '') {
        alert('Please enter an audit title');
        return;
      }
      if (!formData.scope || formData.scope.trim() === '') {
        alert('Please enter the audit scope');
        return;
      }
      if (!formData.startDate) {
        alert('Please select a start date');
        return;
      }
      if (!formData.leadAuditor) {
        alert('Please select a lead auditor');
        return;
      }

      // Prepare audit data for API
      const auditData = {
        client: parseInt(formData.client),
        iso_standard: parseInt(formData.standard),
        iso_standards: formData.standards.map(id => parseInt(id)), // Add support for multiple standards
        audit_type: formData.auditType,
        title: formData.title.trim(),
        description: formData.description.trim(),
        scope: formData.scope.trim(),
        planned_start_date: formData.startDate,
        planned_end_date: new Date(new Date(formData.startDate).getTime() + formData.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lead_auditor: parseInt(formData.leadAuditor),
        auditors: formData.selectedAuditors.map(id => parseInt(id)),
        cost: formData.cost, // Add the cost field
        status: 'PLANNED',
      };

      const newAudit = await auditService.createAudit(auditData as any);
      // Navigate to workflow page with audit ID for template selection
      router.push(`/dashboard/audits/new/workflow?auditId=${newAudit.id}`);
    } catch (err) {
      console.error('Error creating audit:', err);
      alert('Failed to create audit. Please try again.');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button className="text-primary hover:text-primary-hover">
            ← Cancel
          </button>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Schedule New Audit
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Progress Indicator */}
        <div>
          <div className="flex justify-between mb-4">
            {steps.map((s) => (
              <div
                key={s.number}
                className={`flex-1 text-center ${
                  s.number <= step ? "text-primary" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    s.number <= step
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {s.number}
                </div>
                <p className="text-xs font-medium">{s.title}</p>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <WidgetCard title="Schedule New Audit">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-dark dark:text-white">
                Select Client & Certification
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Client *
                </label>
                {loading ? (
                  <div className="text-sm text-gray-500">Loading clients...</div>
                ) : (
                  <select
                    value={formData.client}
                    onChange={(e) => handleClientChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Search clients...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedClient && (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2 text-dark dark:text-white">Client Details:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contact: {selectedClient.contact}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phone: {selectedClient.phone}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email: {selectedClient.email}
                  </p>
                  {selectedClient.industry && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Industry: {selectedClient.industry}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  ISO Standards * (Select one or more)
                </label>
                <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                  {isoStandards.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No ISO standards available</p>
                  ) : (
                    isoStandards.map((standard) => (
                      <label key={standard.id} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.standards.includes(standard.id.toString())}
                          onChange={(e) => {
                            const standardId = standard.id.toString();
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                standards: [...formData.standards, standardId],
                                standard: formData.standards.length === 0 ? standardId : formData.standard // Set first one for backward compatibility
                              });
                            } else {
                              setFormData({
                                ...formData,
                                standards: formData.standards.filter(s => s !== standardId),
                                standard: formData.standards.filter(s => s !== standardId)[0] || "" // Update backward compatibility field
                              });
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-600 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-dark dark:text-white">
                            {standard.code}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {standard.name}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {formData.standards.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.standards.map(standardId => {
                      const standard = isoStandards.find(s => s.id.toString() === standardId);
                      return standard ? (
                        <span 
                          key={standardId}
                          className="px-2 py-1 bg-primary text-white rounded-full text-xs font-medium"
                        >
                          {standard.code}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Audit Type *
                </label>
                <select
                  value={formData.auditType}
                  onChange={(e) => setFormData({ ...formData, auditType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="INITIAL">Initial Certification</option>
                  <option value="SURVEILLANCE">Surveillance</option>
                  <option value="RECERTIFICATION">Recertification</option>
                  <option value="SPECIAL">Special Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Audit Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter audit title (e.g., ISO 9001:2015 Initial Audit)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                  placeholder="Enter audit description (optional)..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Scope *
                </label>
                <textarea
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                  placeholder="Enter audit scope..."
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-dark dark:text-white">
                Scheduling & Duration
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Estimated Duration *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value={1}>1 day</option>
                  <option value={2}>2 days</option>
                  <option value={3}>3 days</option>
                  <option value={4}>4 days</option>
                  <option value={5}>5 days</option>
                </select>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Recommended: 3-4 days for this scope
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Preferred Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Total Audit Cost (KES)
                </label>
                <input
                  type="number"
                  value={formData.cost || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value ? parseInt(e.target.value) : 0 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="0"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Base audit cost excluding certification standards
                </p>
              </div>

            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-dark dark:text-white">
                Audit Team & Resources
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Lead Auditor *
                </label>
                <select
                  value={formData.leadAuditor}
                  onChange={(e) =>
                    setFormData({ ...formData, leadAuditor: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select Lead Auditor...</option>
                  {auditors.map((auditor) => (
                    <option key={auditor.id} value={auditor.id}>
                      {auditor.first_name} {auditor.last_name} ({auditor.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Additional Audit Team Members
                </label>
                {!formData.leadAuditor ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Please select a Lead Auditor first
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {auditors.filter(a => a.id.toString() !== formData.leadAuditor).length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No other auditors available
                        </p>
                      ) : (
                        auditors.filter(a => a.id.toString() !== formData.leadAuditor).map((auditor) => (
                          <label key={auditor.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedAuditors.includes(auditor.id.toString())}
                              onChange={(e) => {
                                const auditorId = auditor.id.toString();
                                if (e.target.checked) {
                                  if (formData.selectedAuditors.length < 2) {
                                    setFormData({
                                      ...formData,
                                      selectedAuditors: [...formData.selectedAuditors, auditorId]
                                    });
                                  }
                                } else {
                                  setFormData({
                                    ...formData,
                                    selectedAuditors: formData.selectedAuditors.filter(a => a !== auditorId)
                                  });
                                }
                              }}
                              disabled={!formData.selectedAuditors.includes(auditor.id.toString()) && formData.selectedAuditors.length >= 2}
                              className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-dark dark:text-white">{auditor.first_name} {auditor.last_name}</span>
                            {!formData.selectedAuditors.includes(auditor.id.toString()) && formData.selectedAuditors.length >= 2 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">(Max reached)</span>
                            )}
                          </label>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Selected: {formData.selectedAuditors.length}/2 additional members
                    </p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark dark:text-white">
                  Auditee Information
                </label>
                <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-dark dark:text-white">Name *</label>
                      <input
                        type="text"
                        value={formData.auditee.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            auditee: { ...formData.auditee, name: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-dark dark:text-white">Job Title</label>
                      <input
                        type="text"
                        value={formData.auditee.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            auditee: { ...formData.auditee, title: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g., Quality Manager"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-dark dark:text-white">Contact Number</label>
                      <input
                        type="tel"
                        value={formData.auditee.contact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            auditee: { ...formData.auditee, contact: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="+254 700 123 456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-dark dark:text-white">Email</label>
                      <input
                        type="email"
                        value={formData.auditee.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            auditee: { ...formData.auditee, email: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="auditee@company.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 dark:border-gray-600" />
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Include auditor in training
                  </span>
                </label>
              </div>

            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-dark dark:text-white">
                Review & Confirm
              </h2>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Client
                  </p>
                  <p className="font-medium">{formData.client}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Standard
                  </p>
                  <p className="font-medium">{formData.standard}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="font-medium">{formData.startDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Lead Auditor
                  </p>
                  <p className="font-medium">{formData.leadAuditor}</p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                  Automated Actions Upon Confirmation:
                </p>
                <ul className="text-sm text-green-800 dark:text-green-200 mt-2 space-y-1">
                  <li>✓ Create audit record</li>
                  <li>✓ Block auditor calendar dates</li>
                  <li>✓ Send confirmation email to client</li>
                  <li>✓ Generate audit checklist</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 disabled:opacity-50"
            >
              Back
            </button>
            <div className="flex gap-2">
              {step === 4 && (
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
                  Save as Draft
                </button>
              )}
              <button
                onClick={step === 4 ? handleScheduleAudit : handleNext}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
              >
                {step === 4 ? "Schedule Audit" : "Next Step"}
              </button>
            </div>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

