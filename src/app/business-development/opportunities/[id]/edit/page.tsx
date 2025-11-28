'use client';

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Client, Employee } from "@/types/audit";
import { clientService } from "@/services/client.service";
import { employeeService } from "@/services/employee.service";
import { opportunityService } from "@/services/opportunity.service";

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
];

const SERVICE_TYPES = [
  { value: 'ISO_CERTIFICATION', label: 'ISO Certification' },
  { value: 'CONSULTING', label: 'Consulting' },
  { value: 'TRAINING', label: 'Training' },
  { value: 'AUDIT', label: 'Internal Audit' },
  { value: 'COMPLIANCE', label: 'Compliance Review' },
  { value: 'RISK_ASSESSMENT', label: 'Risk Assessment' },
];

const STAGES = [
  { value: 'PROSPECTING', label: 'Lead' },
  { value: 'QUALIFICATION', label: 'Qualified' },
  { value: 'PROPOSAL', label: 'Proposal' },
  { value: 'NEGOTIATION', label: 'Negotiation' },
  { value: 'CLOSED_WON', label: 'Closed Won' },
  { value: 'CLOSED_LOST', label: 'Closed Lost' },
];

export default function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState("");

  const [formData, setFormData] = useState({
    clientId: "",
    opportunityName: "",
    serviceType: "",
    stage: "PROSPECTING",
    value: "",
    currency: "USD",
    probability: "50",
    owner: "",
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch opportunity details and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [opportunityData, clientsResponse, employeesData] = await Promise.all([
          opportunityService.getOpportunity(id),
          clientService.getClients({ status: 'active' }),
          employeeService.getEmployees({ status: 'active' })
        ]);

        setClients(clientsResponse.results || []);
        setEmployees(employeesData || []);

        // Populate form with opportunity data
        if (opportunityData) {
          setFormData({
            clientId: opportunityData.client?.id?.toString() || "",
            opportunityName: opportunityData.title || "",
            serviceType: opportunityData.service_type || "",
            stage: opportunityData.status || "PROSPECTING",
            value: opportunityData.estimated_value?.toString() || "",
            currency: opportunityData.currency || "USD",
            probability: opportunityData.probability?.toString() || "50",
            owner: opportunityData.owner?.id?.toString() || "",
            description: opportunityData.description || "",
          });

          // Set client search to show selected client name
          if (opportunityData.client) {
            setClientSearch(opportunityData.client.name || "");
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.clientId) errors.clientId = "Client is required";
    if (!formData.opportunityName) errors.opportunityName = "Opportunity name is required";
    if (!formData.serviceType) errors.serviceType = "Service type is required";
    if (!formData.stage) errors.stage = "Stage is required";
    if (!formData.value || parseFloat(formData.value) <= 0) errors.value = "Valid opportunity value is required";
    if (!formData.probability || parseInt(formData.probability) < 0 || parseInt(formData.probability) > 100) {
      errors.probability = "Probability must be between 0 and 100";
    }
    if (!formData.owner) errors.owner = "Owner is required";
    if (!formData.description) errors.description = "Description is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Calculate expected close date (30 days from now as default)
      const expectedCloseDate = new Date();
      expectedCloseDate.setDate(expectedCloseDate.getDate() + 30);

      // Prepare opportunity data
      const opportunityData = {
        client_id: parseInt(formData.clientId),
        title: formData.opportunityName,
        description: formData.description,
        service_type: formData.serviceType,
        estimated_value: parseFloat(formData.value),
        currency: formData.currency,
        probability: parseInt(formData.probability),
        status: formData.stage,
        expected_close_date: expectedCloseDate.toISOString().split('T')[0],
        owner_id: parseInt(formData.owner),
      };

      // Update opportunity
      await opportunityService.updateOpportunity(id, opportunityData);

      // Redirect to opportunity details page
      router.push(`/business-development/opportunities/${id}`);
    } catch (err) {
      console.error('Error updating opportunity:', err);
      setError(err instanceof Error ? err.message : 'Failed to update opportunity');
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      try {
        setSubmitting(true);
        await opportunityService.deleteOpportunity(id);
        router.push('/business-development/opportunities');
      } catch (err) {
        console.error('Error deleting opportunity:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete opportunity');
        setSubmitting(false);
      }
    }
  };

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Get selected currency symbol
  const selectedCurrency = CURRENCIES.find(c => c.code === formData.currency);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-gray-900 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading opportunity...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Opportunity
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Update the opportunity details
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/business-development/opportunities")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="space-y-6">
              {/* Client Name - Searchable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search clients..."
                    className="w-full rounded-t-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <div className="max-h-48 overflow-y-auto border border-t-0 border-gray-300 rounded-b-lg dark:border-gray-600">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <div
                          key={client.id}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, clientId: client.id.toString() }));
                            setClientSearch(client.name);
                            if (validationErrors.clientId) {
                              setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.clientId;
                                return newErrors;
                              });
                            }
                          }}
                          className={`cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${formData.clientId === client.id.toString()
                              ? 'bg-primary/10 dark:bg-primary/20'
                              : 'bg-white dark:bg-gray-800'
                            }`}
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.name}
                          </p>
                          {client.email && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {client.email}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No clients found
                      </div>
                    )}
                  </div>
                </div>
                {validationErrors.clientId && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {validationErrors.clientId}
                  </p>
                )}
              </div>

              {/* Opportunity Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opportunity Name *
                </label>
                <input
                  type="text"
                  name="opportunityName"
                  value={formData.opportunityName}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC Corp - ISO 9001 Certification"
                  className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white ${validationErrors.opportunityName
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                />
                {validationErrors.opportunityName && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {validationErrors.opportunityName}
                  </p>
                )}
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white ${validationErrors.serviceType
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                >
                  <option value="">Select service type</option>
                  {SERVICE_TYPES.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
                {validationErrors.serviceType && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {validationErrors.serviceType}
                  </p>
                )}
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stage *
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white ${validationErrors.stage
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                >
                  {STAGES.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
                {validationErrors.stage && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {validationErrors.stage}
                  </p>
                )}
              </div>

              {/* Opportunity Value with Currency Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opportunity Value *
                </label>
                <div className="flex gap-2">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
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
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full rounded-lg border px-3 py-2 pl-8 dark:bg-gray-800 dark:text-white ${validationErrors.value
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                        }`}
                      required
                    />
                  </div>
                </div>
                {validationErrors.value && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {validationErrors.value}
                  </p>
                )}
              </div>

              {/* Probability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Probability (%) *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="probability"
                    value={formData.probability}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="5"
                    className="flex-1"
                  />
                  <input
                    type="number"
                    name="probability"
                    value={formData.probability}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className={`w-20 rounded-lg border px-3 py-2 text-center dark:bg-gray-800 dark:text-white ${validationErrors.probability
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                      }`}
                    required
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
                </div>
                {validationErrors.probability && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {validationErrors.probability}
                  </p>
                )}

                {/* Weighted Value Display */}
                {formData.value && formData.probability && (
                  <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-700">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                      Weighted Forecast Value
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {selectedCurrency?.symbol}{((parseFloat(formData.value) || 0) * (parseFloat(formData.probability) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Based on {formData.probability}% probability
                    </p>
                  </div>
                )}
              </div>

              {/* Owner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Owner *
                </label>
                <select
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white ${validationErrors.owner
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                >
                  <option value="">Select owner</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName} - {employee.role || employee.department}
                    </option>
                  ))}
                </select>
                {validationErrors.owner ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {validationErrors.owner}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This person will be responsible for managing this opportunity
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter opportunity description..."
                  rows={4}
                  className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white ${validationErrors.description
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                />
                {validationErrors.description && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {validationErrors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/business-development/opportunities")}
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}