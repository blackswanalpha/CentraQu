'use client';

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { FilterPanel } from "@/components/BusinessDevelopment/filter-panel";
import { ContractOverviewCards } from "@/components/BusinessDevelopment/contract-overview-cards";
import { ContractRow } from "@/components/BusinessDevelopment/contract-row";
import { TemplateManagement } from "@/components/BusinessDevelopment/template-management";
import { useState, useEffect } from "react";
import { contractService, Contract, ContractStats } from "@/services/contract.service";

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates'>('contracts');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<ContractStats>({
    active: 0,
    pending: 0,
    expiring: 0,
    expired: 0,
    total_value: 0,
    total_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch contracts and stats
  useEffect(() => {
    fetchData();
  }, [filters, searchQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch stats
      const statsResponse = await contractService.getStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch contracts with filters
      const params: any = {};
      if (filters.status) params.status = mapStatusToBackend(filters.status);
      if (filters.type) params.contract_type = mapTypeToBackend(filters.type);
      if (searchQuery) params.search = searchQuery;

      const contractsResponse = await contractService.getContracts(params);
      setContracts(contractsResponse.results || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map frontend status values to backend values
  const mapStatusToBackend = (status: string): string => {
    const statusMap: Record<string, string> = {
      'active': 'ACTIVE',
      'pending': 'PENDING_SIGNATURE',
      'expiring': 'ACTIVE', // Will be filtered by date on backend
      'expired': 'COMPLETED',
    };
    return statusMap[status] || status;
  };

  // Map frontend type values to backend values
  const mapTypeToBackend = (type: string): string => {
    const typeMap: Record<string, string> = {
      'service': 'SERVICE',
      'maintenance': 'MAINTENANCE',
      'support': 'SERVICE',
      'consulting': 'CONSULTING',
      'license': 'SERVICE',
    };
    return typeMap[type] || type;
  };

  // Map backend status to frontend status
  const mapStatusToFrontend = (contract: Contract): "active" | "pending" | "expiring" | "expired" => {
    if (contract.status === 'PENDING_SIGNATURE') return 'pending';
    if (contract.status === 'COMPLETED') return 'expired';

    // Check if expiring (within 30 days)
    const endDate = new Date(contract.end_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) return 'expiring';
    if (daysUntilExpiry < 0) return 'expired';

    return 'active';
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters({});
    setSearchQuery("");
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contracts
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage and track all contracts
            </p>
          </div>
          <button
            onClick={() => window.location.href = "/business-development/contracts/new"}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            + New Contract
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'contracts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Contracts
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'templates'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Templates
            </button>
          </nav>
        </div>

        {activeTab === 'contracts' && (
          <>
            {/* Overview Cards */}
            <ContractOverviewCards
              active={stats.active}
              pending={stats.pending}
              expiring={stats.expiring}
              expired={stats.expired}
            />

            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              onSearch={handleSearch}
              filterOptions={[
                {
                  label: "Status", key: "status", options: [
                    { label: "Active", value: "active" },
                    { label: "Pending", value: "pending" },
                    { label: "Expiring", value: "expiring" },
                    { label: "Expired", value: "expired" },
                  ]
                },
                {
                  label: "Type", key: "type", options: [
                    { label: "Service Agreement", value: "service" },
                    { label: "Maintenance", value: "maintenance" },
                    { label: "Support", value: "support" },
                    { label: "Consulting", value: "consulting" },
                    { label: "License", value: "license" },
                  ]
                },
              ]}
            />

            {/* Contracts Table */}
            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          Loading contracts...
                        </td>
                      </tr>
                    ) : contracts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No contracts found. Create your first contract to get started.
                        </td>
                      </tr>
                    ) : (
                      contracts.map((contract) => (
                        <ContractRow
                          key={contract.id}
                          id={contract.contract_number}
                          client={contract.client_name}
                          type={contract.contract_type}
                          value={Number(contract.contract_value)}
                          startDate={contract.start_date}
                          endDate={contract.end_date}
                          status={mapStatusToFrontend(contract)}
                          onView={() => window.location.href = `/business-development/contracts/${contract.id}`}
                          onEdit={() => window.location.href = `/business-development/contracts/${contract.id}/edit`}
                          onDelete={async () => {
                            if (confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
                              try {
                                await contractService.deleteContract(contract.id);
                                alert('Contract deleted successfully');
                                fetchData(); // Refresh the list
                              } catch (error) {
                                console.error('Error deleting contract:', error);
                                alert('Failed to delete contract. Please try again.');
                              }
                            }
                          }}
                          onDownload={async () => {
                            try {
                              const blob = await contractService.downloadContractPdf(contract.id);
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              // Use contract ID in filename to match backend
                              link.download = `contract_${contract.id}_${contract.contract_number}.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error('Error downloading PDF:', error);
                              alert('Failed to download contract PDF. Please try again.');
                            }
                          }}
                          onEmail={async () => {
                            const recipientEmail = prompt(
                              'Enter recipient email address:',
                              contract.client_email || ''
                            );

                            if (recipientEmail) {
                              try {
                                const response = await contractService.sendContractEmail(contract.id, {
                                  recipient_email: recipientEmail,
                                });

                                if (response.success) {
                                  alert(`Contract sent successfully to ${recipientEmail}`);
                                }
                              } catch (error) {
                                console.error('Error sending email:', error);
                                alert('Failed to send contract email. Please try again.');
                              }
                            }
                          }}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing 1-5 of 58 contracts
              </p>
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                Load More
              </button>
            </div>
          </>
        )}

        {activeTab === 'templates' && (
          <TemplateManagement />
        )}
      </div>
    </DashboardLayout>
  );
}

