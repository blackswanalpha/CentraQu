"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { contractService, Contract } from "@/services/contract.service";
import { auditService } from "@/services/audit.service";
import { apiClient } from "@/lib/api-client";
import { AuditorCalendar, AuditorAvailability as CalendarAuditorAvailability } from "@/components/Audits/AuditorCalendar";

interface Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName?: string;
  role?: string;
  department?: string;
  is_available?: boolean;
  scheduled_audits?: Array<{
    id: number;
    start_date: string;
    end_date: string;
    title: string;
  }>;
}

interface LocalAuditorAvailability {
  auditor: {
    id: number;
    name: string;
    role?: string;
    email?: string;
  };
  availability: 'available' | 'busy' | 'partially_available';
  conflicting_audits?: Array<{
    title: string;
    start_date: string;
    end_date: string;
  }>;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
];

const AUDIT_TYPES = [
  { value: 'INITIAL', label: 'Initial Certification' },
  { value: 'SURVEILLANCE_1', label: '1st Surveillance' },
  { value: 'SURVEILLANCE_2', label: '2nd Surveillance' },
  { value: 'RECERTIFICATION', label: 'Recertification' },
  { value: 'SPECIAL', label: 'Special Audit' },
];

export default function ScheduleNewAuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [auditors, setAuditors] = useState<Employee[]>([]);
  const [auditorsAvailability, setAuditorsAvailability] = useState<LocalAuditorAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuditorCalendar, setShowAuditorCalendar] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: string; end: string } | null>(null);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarAvailability, setCalendarAvailability] = useState<CalendarAuditorAvailability[]>([]);
  const [showCalendarInStep2, setShowCalendarInStep2] = useState(false);

  const [formData, setFormData] = useState({
    contract: "",
    standards: [] as string[], // From contract
    auditType: "INITIAL",
    scope: "", // From contract
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    duration: 3,
    leadAuditor: "",
    selectedAuditors: [] as string[],
    cost: 0, // Contract cost for this audit
    currency: "USD",
    auditee: {
      name: "", // From contract
      organization: "", // From contract
      title: "",
      contact: "", // From contract
      email: "", // From contract
      address: "", // From contract
    },
  });

  const steps = [
    { number: 1, title: "Contract & Standards" },
    { number: 2, title: "Audit Details & Cost" },
    { number: 3, title: "Audit Team & Resources" },
    { number: 4, title: "Review & Confirm" },
  ];

  const progressPercentage = (step / 4) * 100;

  // Fetch contracts and auditors on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contractsResponse, auditorsResponse] = await Promise.all([
          contractService.getContracts({ status: 'ACTIVE' }),
          apiClient.get<{ results: Employee[] }>('/employees/?role=auditor'),
        ]);

        setContracts(contractsResponse.results || []);
        setAuditors(auditorsResponse.results || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch auditor availability when date range is selected
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      fetchAuditorAvailability();
      setSelectedDateRange({ start: formData.startDate, end: formData.endDate });
    }
  }, [formData.startDate, formData.endDate]);

  // Fetch calendar availability when calendar date changes or calendar is shown
  useEffect(() => {
    if (showCalendarInStep2) {
      fetchCalendarAvailability();
    }
  }, [calendarDate, showCalendarInStep2]);

  // Handle contract selection
  const handleContractChange = (contractId: string) => {
    setFormData({ ...formData, contract: contractId });
    const contract = contracts.find(c => c.id.toString() === contractId);
    setSelectedContract(contract || null);

    // Auto-fill form data from contract
    if (contract) {
      setFormData(prev => ({
        ...prev,
        contract: contractId,
        standards: contract.iso_standards || [],
        scope: contract.scope_of_work || "",
        currency: contract.currency || "USD",
        auditee: {
          name: contract.client_contact_person || "",
          organization: contract.client_organization || "",
          title: "",
          contact: contract.client_telephone || "",
          email: contract.client_email || "",
          address: contract.client_address || "",
        },
      }));
    }
  };

  // Fetch auditor availability for selected date range
  const fetchAuditorAvailability = async () => {
    if (!formData.startDate || !formData.endDate) return;

    try {
      const response = await apiClient.get<{ data: LocalAuditorAvailability[] } | LocalAuditorAvailability[]>(
        `/auditors/availability/?start_date=${formData.startDate}&end_date=${formData.endDate}`
      );

      const data = 'data' in response ? response.data : response;
      setAuditorsAvailability(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching auditor availability:', err);
      // Fallback: mark all auditors as available
      setAuditorsAvailability(
        auditors.map(auditor => ({
          auditor: {
            id: auditor.id,
            name: auditor.fullName || `${auditor.firstName} ${auditor.lastName}`,
            role: auditor.role,
            email: auditor.email
          },
          availability: 'available' as const
        }))
      );
    }
  };

  const fetchCalendarAvailability = async () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    try {
      const response = await apiClient.get<{ data: CalendarAuditorAvailability[] } | CalendarAuditorAvailability[]>(
        `/auditors/availability/?start_date=${startDate}&end_date=${endDate}`
      );
      // Handle both response formats (direct array or wrapped in data)
      const data = 'data' in response ? response.data : response;
      setCalendarAvailability(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching calendar availability:', err);
      setCalendarAvailability([]);
    }
  };

  // Calculate end date based on start date and duration
  const calculateEndDate = (startDate: string, duration: number) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration - 1);
    return end.toISOString().split('T')[0];
  };

  // Handle duration change
  const handleDurationChange = (duration: number) => {
    const endDate = calculateEndDate(formData.startDate, duration);
    setFormData({
      ...formData,
      duration,
      endDate,
    });
  };

  // Handle start date change
  const handleStartDateChange = (startDate: string) => {
    const endDate = calculateEndDate(startDate, formData.duration);
    setFormData({
      ...formData,
      startDate,
      endDate,
    });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  // Get selected currency symbol
  const selectedCurrency = CURRENCIES.find(c => c.code === formData.currency);

  // Validate current step
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.contract && formData.standards.length > 0;
      case 2:
        return formData.title && formData.startDate && formData.duration > 0 && formData.cost > 0;
      case 3:
        return formData.leadAuditor;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleScheduleAudit = async () => {
    try {
      // Validate required fields
      if (!formData.contract) {
        alert('Please select a contract');
        return;
      }

      const auditData = {
        client: selectedContract?.client_id, // Get client from contract
        iso_standard: 1, // Use first standard for now - could be enhanced
        audit_type: formData.auditType,
        title: formData.title,
        description: formData.description,
        scope: formData.scope,
        planned_start_date: formData.startDate,
        planned_end_date: formData.endDate,
        lead_auditor: parseInt(formData.leadAuditor),
        cost: formData.cost,
        currency: formData.currency,
        contract: parseInt(formData.contract),
      };

      const response = await auditService.createAudit(auditData);

      // Add selected auditors to the audit
      if (formData.selectedAuditors.length > 0) {
        await auditService.updateAudit(response.id, { auditors: formData.selectedAuditors.map(id => parseInt(id)) });
      }

      alert('Audit scheduled successfully!');
      router.push(`/dashboard/audits/${response.id}`);
    } catch (error) {
      console.error('Error scheduling audit:', error);
      alert('Failed to schedule audit. Please try again.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading audit form...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Schedule New Audit
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Create a new audit from an active contract
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/audits')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>

        {/* Progress Bar */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {step} of 4
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          <div className="mb-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between">
            {steps.map((stepItem) => (
              <div
                key={stepItem.number}
                className={`flex flex-col items-center ${stepItem.number <= step
                  ? 'text-primary'
                  : 'text-gray-400 dark:text-gray-600'
                  }`}
              >
                <div
                  className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${stepItem.number <= step
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                >
                  {stepItem.number}
                </div>
                <span className="text-xs font-medium">{stepItem.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <WidgetCard title={steps[step - 1].title}>
          {/* Step 1: Contract & Standards */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Contract Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contract *
                </label>
                <select
                  value={formData.contract}
                  onChange={(e) => handleContractChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">Select an active contract</option>
                  {contracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.contract_number} - {contract.client_organization}
                    </option>
                  ))}
                </select>
                {contracts.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    No active contracts found. Create a contract first.
                  </p>
                )}
              </div>

              {/* Selected Contract Details */}
              {selectedContract && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-700">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Contract Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-800 dark:text-blue-200">Client:</span>
                      <p className="text-blue-700 dark:text-blue-300">{selectedContract.client_organization}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800 dark:text-blue-200">Contract Type:</span>
                      <p className="text-blue-700 dark:text-blue-300">{selectedContract.contract_type}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-blue-800 dark:text-blue-200">Standards:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedContract.iso_standards?.map((standard, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
                          >
                            {standard}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Standards Display */}
              {formData.standards.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Standards for Audit *
                  </label>
                  <div className="space-y-2">
                    {formData.standards.map((standard, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="font-medium text-gray-900 dark:text-white">{standard}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          From Contract
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Audit Details & Cost */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Audit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Audit Type *
                </label>
                <select
                  value={formData.auditType}
                  onChange={(e) => setFormData({ ...formData, auditType: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  required
                >
                  {AUDIT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Audit Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., ISO 9001:2015 Initial Certification Audit"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              {/* Scope (from contract) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scope *
                </label>
                <textarea
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Audit scope will be filled from contract..."
                />
                {selectedContract && (
                  <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    ✓ Scope auto-filled from contract
                  </p>
                )}
              </div>

              {/* Dates and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                    min="1"
                    max="30"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                {formData.endDate && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date (Calculated)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Auditor Calendar Section */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Auditor Calendar</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Check auditor availability to help schedule the audit</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCalendarInStep2(!showCalendarInStep2)}
                    className="text-sm font-medium text-primary hover:text-primary-dark underline"
                  >
                    {showCalendarInStep2 ? 'Hide Calendar' : 'Show Calendar'}
                  </button>
                </div>

                {showCalendarInStep2 && (
                  <div className="mt-4">
                    <AuditorCalendar
                      auditorsAvailability={calendarAvailability}
                      currentDate={calendarDate}
                      onMonthChange={setCalendarDate}
                    />
                  </div>
                )}
              </div>

              {/* Contract Cost with Currency Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contract Cost *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-32 rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      {selectedCurrency?.symbol}
                    </span>
                    <input
                      type="number"
                      value={formData.cost || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setFormData({
                          ...formData,
                          cost: isNaN(value) ? 0 : value
                        });
                      }}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-8 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>
                {selectedContract && (
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Contract currency: {selectedContract.currency}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      ✓ Cost should reflect the contract value for this audit
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Additional audit details..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Audit Team & Resources */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Auditors Calendar Button */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Audit Team Assignment
                </h3>
                <button
                  onClick={() => setShowAuditorCalendar(!showAuditorCalendar)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {showAuditorCalendar ? 'Hide' : 'Show'} Auditors Calendar
                </button>
              </div>

              {/* Auditors Calendar */}
              {showAuditorCalendar && selectedDateRange && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Auditor Availability ({selectedDateRange.start} to {selectedDateRange.end})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {auditorsAvailability.map((item) => (
                      <div
                        key={item.auditor.id}
                        className={`p-3 rounded-lg border ${item.availability === 'available'
                          ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                          : item.availability === 'busy'
                            ? 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                            : 'border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${item.availability === 'available'
                              ? 'bg-green-500'
                              : item.availability === 'busy'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                              }`}
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.auditor.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {item.auditor.role || 'Auditor'}
                        </p>
                        {item.conflicting_audits && item.conflicting_audits.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-red-600 dark:text-red-400">
                              Conflicts:
                            </p>
                            {item.conflicting_audits.map((audit, index) => (
                              <p key={index} className="text-xs text-red-500 dark:text-red-400">
                                {audit.title} ({audit.start_date} - {audit.end_date})
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lead Auditor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lead Auditor *
                </label>
                <select
                  value={formData.leadAuditor}
                  onChange={(e) => setFormData({ ...formData, leadAuditor: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">Select lead auditor</option>
                  {auditors.map((auditor) => {
                    const availability = auditorsAvailability.find(a => a.auditor.id === auditor.id);
                    const status = availability?.availability || 'unknown';

                    return (
                      <option key={auditor.id} value={auditor.id}>
                        {auditor.firstName} {auditor.lastName} {availability && status !== 'available' ? `(${status})` : ''}
                      </option>
                    );
                  })}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Calendar feature shows availability for selected dates
                </p>
              </div>

              {/* Additional Auditors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Auditors
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {auditors
                    .filter(auditor => auditor.id.toString() !== formData.leadAuditor)
                    .map((auditor) => {
                      const availability = auditorsAvailability.find(a => a.auditor.id === auditor.id);
                      const status = availability?.availability || 'unknown';

                      return (
                        <label key={auditor.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={formData.selectedAuditors.includes(auditor.id.toString())}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  selectedAuditors: [...formData.selectedAuditors, auditor.id.toString()],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedAuditors: formData.selectedAuditors.filter(id => id !== auditor.id.toString()),
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {auditor.firstName} {auditor.lastName}
                            {availability && status !== 'available' && (
                              <span className={`ml-2 text-xs ${status === 'busy' ? 'text-red-500' : 'text-yellow-500'
                                }`}>
                                ({status})
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Auto-filled Auditee Information */}
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-700">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                  Auditee Information (From Contract)
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-800 dark:text-green-200">Organization:</span>
                    <p className="text-green-700 dark:text-green-300">{formData.auditee.organization}</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-800 dark:text-green-200">Contact Person:</span>
                    <p className="text-green-700 dark:text-green-300">{formData.auditee.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-800 dark:text-green-200">Phone:</span>
                    <p className="text-green-700 dark:text-green-300">{formData.auditee.contact}</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-800 dark:text-green-200">Email:</span>
                    <p className="text-green-700 dark:text-green-300">{formData.auditee.email}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-green-800 dark:text-green-200">Address:</span>
                    <p className="text-green-700 dark:text-green-300">{formData.auditee.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Review Audit Details
              </h3>

              {/* Contract Info */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contract & Standards</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Contract:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedContract?.contract_number}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Client:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedContract?.client_organization}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Standards:</span>
                    <p className="text-gray-600 dark:text-gray-400">{formData.standards.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Audit Details */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Audit Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                    <p className="text-gray-600 dark:text-gray-400">{formData.auditType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>
                    <p className="text-gray-600 dark:text-gray-400">{formData.title}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Start Date:</span>
                    <p className="text-gray-600 dark:text-gray-400">{formData.startDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                    <p className="text-gray-600 dark:text-gray-400">{formData.duration} days</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Cost:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedCurrency?.symbol}{formData.cost} {formData.currency}</p>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Audit Team</h4>
                <div className="text-sm">
                  <div className="mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Lead Auditor:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {auditors.find(a => a.id.toString() === formData.leadAuditor)?.firstName} {auditors.find(a => a.id.toString() === formData.leadAuditor)?.lastName}
                    </p>
                  </div>
                  {formData.selectedAuditors.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Additional Auditors:</span>
                      <ul className="text-gray-600 dark:text-gray-400 ml-4">
                        {formData.selectedAuditors.map(auditorId => {
                          const auditor = auditors.find(a => a.id.toString() === auditorId);
                          return (
                            <li key={auditorId}>• {auditor?.firstName} {auditor?.lastName}</li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevious}
              disabled={step === 1}
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Previous
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard/audits')}
                className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleScheduleAudit}
                  className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Schedule Audit
                </button>
              )}
            </div>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}