'use client';

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { useState, useEffect } from "react";
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

export default function NewOpportunityPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [activeSection, setActiveSection] = useState("basic");

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

  // Section definitions
  const sections = [
    { 
      id: "basic", 
      label: "Basic Information", 
      icon: "📋",
      fields: ["clientId", "opportunityName", "serviceType", "stage"]
    },
    { 
      id: "financial", 
      label: "Financial Details", 
      icon: "💰",
      fields: ["value", "currency", "probability"]
    },
    { 
      id: "assignment", 
      label: "Assignment & Details", 
      icon: "👤",
      fields: ["owner", "description"]
    }
  ];

  // Check section completion
  const isSectionComplete = (sectionId: string): boolean => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return false;
    
    return section.fields.every(field => {
      const value = formData[field as keyof typeof formData];
      if (field === "description") return value.trim() !== "";
      if (field === "value") return value && parseFloat(value) > 0;
      return value !== "";
    });
  };

  // Get section completion status
  const getSectionStatus = (sectionId: string): "complete" | "incomplete" | "error" => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return "incomplete";
    
    const hasErrors = section.fields.some(field => validationErrors[field]);
    if (hasErrors) return "error";
    
    return isSectionComplete(sectionId) ? "complete" : "incomplete";
  };

  // Get section indicator color
  const getSectionIndicatorClass = (sectionId: string): string => {
    const status = getSectionStatus(sectionId);
    
    switch (status) {
      case "complete":
        return "bg-green-500 border-green-500";
      case "error":
        return "bg-red-500 border-red-500";
      default:
        return "bg-gray-300 border-gray-300 dark:bg-gray-600 dark:border-gray-600";
    }
  };

  // Fetch clients and employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [clientsResponse, employeesData] = await Promise.all([
          clientService.getClients({ status: 'active' }),
          employeeService.getEmployees({ status: 'active' })
        ]);

        setClients(clientsResponse.results || []);
        setEmployees(employeesData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      // Create opportunity
      const createdOpportunity = await opportunityService.createOpportunity(opportunityData);

      // Redirect to opportunity details page
      router.push(`/business-development/opportunities/${createdOpportunity.id}`);
    } catch (err) {
      console.error('Error creating opportunity:', err);
      setError(err instanceof Error ? err.message : 'Failed to create opportunity');
      setSubmitting(false);
    }
  };

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Get selected currency symbol
  const selectedCurrency = CURRENCIES.find(c => c.code === formData.currency);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Opportunity
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Fill in the details to create a new sales opportunity
            </p>
          </div>
          <button
            onClick={() => router.push("/business-development/opportunities")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-gray-900 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading form data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </p>
          </div>
        )}

        {/* Form */}
        {!loading && !error && (
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="col-span-3">
              <div className="sticky top-6 space-y-1 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Sections
                </h3>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${activeSection === section.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 ${getSectionIndicatorClass(section.id)}`}>
                      {getSectionStatus(section.id) === "complete" && (
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <span className="text-lg">{section.icon}</span>
                    <span className="flex-1">{section.label}</span>
                  </button>
                ))}
                
                {/* Overall Progress */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Progress
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {sections.filter(s => isSectionComplete(s.id)).length}/{sections.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(sections.filter(s => isSectionComplete(s.id)).length / sections.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="col-span-9">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  
                  {/* Basic Information Section */}
                  {activeSection === "basic" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">📋</span>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Basic Information
                        </h2>
                      </div>

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
                    </div>
                  )}

                  {/* Financial Details Section */}
                  {activeSection === "financial" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">💰</span>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Financial Details
                        </h2>
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
                    </div>
                  )}

                  {/* Assignment & Details Section */}
                  {activeSection === "assignment" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">👤</span>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Assignment & Details
                        </h2>
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
                          rows={6}
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
                  )}

                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1].id);
                      }
                    }}
                    disabled={sections.findIndex(s => s.id === activeSection) === 0}
                    className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => router.push("/business-development/opportunities")}
                      className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>

                    {sections.findIndex(s => s.id === activeSection) < sections.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const currentIndex = sections.findIndex(s => s.id === activeSection);
                          if (currentIndex < sections.length - 1) {
                            setActiveSection(sections[currentIndex + 1].id);
                          }
                        }}
                        className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting || !sections.every(s => isSectionComplete(s.id))}
                        className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                      >
                        {submitting ? "Creating..." : "Create Opportunity"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}