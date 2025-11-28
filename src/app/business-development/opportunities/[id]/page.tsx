'use client';

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { ProbabilityIndicator } from "@/components/BusinessDevelopment/probability-indicator";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { opportunityService, type Opportunity } from "@/services/opportunity.service";
import { contractService, type Contract } from "@/services/contract.service";

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractsLoading, setContractsLoading] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await opportunityService.getOpportunityById(parseInt(id));
        setOpportunity(data);
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        setError(err instanceof Error ? err.message : 'Failed to load opportunity');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  useEffect(() => {
    const fetchContracts = async () => {
      if (activeTab === 'contracts' && opportunity) {
        try {
          setContractsLoading(true);
          const response = await contractService.getContracts({
            opportunity: opportunity.id,
            ordering: '-created_at'
          });
          setContracts(response.results);
        } catch (err) {
          console.error('Error fetching contracts:', err);
        } finally {
          setContractsLoading(false);
        }
      }
    };

    fetchContracts();
  }, [activeTab, opportunity]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "contact", label: "Contact" },
    { id: "contracts", label: "Contracts" },
    { id: "activity", label: "Activity" },
    { id: "docs", label: "Docs" },
    { id: "tasks", label: "Tasks" },
    { id: "notes", label: "Notes" },
  ];

  // Map status to display stage
  const statusToStage: Record<string, string> = {
    'PROSPECTING': 'Lead',
    'QUALIFICATION': 'Qualified',
    'PROPOSAL': 'Proposal',
    'NEGOTIATION': 'Negotiation',
    'CLOSED_WON': 'Closed Won',
    'CLOSED_LOST': 'Closed Lost',
  };

  // Map service type to display name
  const serviceTypeToDisplay: Record<string, string> = {
    'ISO_CERTIFICATION': 'ISO Certification',
    'CONSULTING': 'Consulting',
    'TRAINING': 'Training',
    'AUDIT': 'Internal Audit',
    'COMPLIANCE': 'Compliance Review',
    'RISK_ASSESSMENT': 'Risk Assessment',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-gray-900 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading opportunity...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && opportunity && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {opportunity.client?.name || 'Unknown Client'}
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {opportunity.title}
                </p>
              </div>
              <div className="flex gap-2">
                {opportunity.status === 'CLOSED_WON' && (
                  <button
                    onClick={() => router.push(`/business-development/contracts/new?opportunityId=${opportunity.id}`)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Generate Contract
                  </button>
                )}
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {editMode ? "Done" : "Edit"}
                </button>
              </div>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">Stage</p>
                {editMode ? (
                  <select className="mt-1 w-full rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                    <option>{statusToStage[opportunity.status] || opportunity.status}</option>
                  </select>
                ) : (
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {statusToStage[opportunity.status] || opportunity.status}
                  </p>
                )}
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">Value</p>
                {editMode ? (
                  <input
                    type="number"
                    defaultValue={opportunity.estimated_value}
                    className="mt-1 w-full rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {opportunity.currency} {(parseFloat(opportunity.estimated_value.toString()) / 1000).toFixed(0)}K
                  </p>
                )}
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">Probability</p>
                <ProbabilityIndicator percentage={opportunity.probability} />
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">Owner</p>
                {editMode ? (
                  <select className="mt-1 w-full rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                    <option>{opportunity.owner?.full_name || 'Unassigned'}</option>
                  </select>
                ) : (
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {opportunity.owner?.full_name || 'Unassigned'}
                  </p>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Opportunity Details
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Service Type
                        </p>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {serviceTypeToDisplay[opportunity.service_type] || opportunity.service_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Description
                        </p>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {opportunity.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Expected Close Date
                        </p>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {new Date(opportunity.expected_close_date).toLocaleDateString()}
                        </p>
                      </div>
                      {opportunity.client?.industry && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Industry
                          </p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {opportunity.client?.industry}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Created
                        </p>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {new Date(opportunity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Client Information
                  </h3>
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {opportunity.client?.name || 'Unknown Client'}
                    </p>
                    {opportunity.client?.industry && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {opportunity.client?.industry}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "contracts" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Contracts
                    </h3>
                    <button
                      onClick={() => router.push(`/business-development/contracts/new?opportunityId=${opportunity.id}`)}
                      className="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      + New Contract
                    </button>
                  </div>

                  {contractsLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading contracts...</p>
                    </div>
                  ) : contracts.length > 0 ? (
                    <div className="grid gap-4">
                      {contracts.map((contract) => (
                        <div
                          key={contract.id}
                          onClick={() => router.push(`/business-development/contracts/${contract.id}`)}
                          className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {contract.contract_number} - {contract.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {contract.contract_type} • {contract.currency} {contract.contract_value.toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${contract.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              contract.status === 'DRAFT' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' :
                                contract.status === 'PENDING_SIGNATURE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                              {contract.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Created: {new Date(contract.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Start: {new Date(contract.start_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">No contracts found for this opportunity</p>
                      <button
                        onClick={() => router.push(`/business-development/contracts/new?opportunityId=${opportunity.id}`)}
                        className="mt-2 text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Create one now
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "activity" && (
                <div>
                  {opportunity.last_activity ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Activity
                      </h3>
                      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {opportunity.last_activity.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {opportunity.last_activity.description}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                          {new Date(opportunity.last_activity.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      No activity yet
                    </p>
                  )}
                </div>
              )}

              {activeTab === "docs" && (
                <p className="text-gray-600 dark:text-gray-400">
                  No documents yet
                </p>
              )}

              {activeTab === "tasks" && (
                <p className="text-gray-600 dark:text-gray-400">
                  No tasks yet
                </p>
              )}

              {activeTab === "notes" && (
                <p className="text-gray-600 dark:text-gray-400">
                  No notes yet
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

