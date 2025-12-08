'use client';

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { TemplateManagement } from "@/components/BusinessDevelopment/template-management";
import { useState, useEffect } from "react";
import { contractService, Contract, ContractStats } from "@/services/contract.service";

// Stats card component matching reference design
function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary"
}: {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: string;
  iconBgColor?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
            <span className="material-symbols-outlined text-sm">
              {trend === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  );
}

// Donut chart component for contract value by status
function DonutChart({
  data
}: {
  data: { label: string; value: number; color: string; }[]
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  // Calculate segments for the donut
  const segments = data.map(item => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    const startAngle = cumulativePercent * 3.6; // Convert to degrees
    cumulativePercent += percent;
    return { ...item, percent, startAngle };
  });

  return (
    <div className="flex items-center gap-6">
      {/* SVG Donut */}
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {segments.map((segment, idx) => {
            const strokeDasharray = `${segment.percent} ${100 - segment.percent}`;
            const strokeDashoffset = 25 - (idx > 0 ? segments.slice(0, idx).reduce((s, seg) => s + seg.percent, 0) : 0);
            return (
              <circle
                key={segment.label}
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke={segment.color}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{total}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {segments.map(segment => (
          <div key={segment.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-sm text-gray-600 dark:text-gray-300">{segment.label}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple bar chart for contracts over time
function BarChart({
  data
}: {
  data: { month: string; value: number; }[]
}) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map(item => (
        <div key={item.month} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all duration-300 min-h-[4px]"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">{item.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates'>('contracts');
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
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch contracts and stats
  useEffect(() => {
    fetchData();
  }, [statusFilter, searchQuery]);

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
      if (statusFilter) params.status = mapStatusToBackend(statusFilter);
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
      'expiring': 'ACTIVE',
      'expired': 'COMPLETED',
    };
    return statusMap[status] || status;
  };

  // Map backend status to frontend status
  const mapStatusToFrontend = (contract: Contract): "active" | "pending" | "expiring" | "expired" => {
    if (contract.status === 'PENDING_SIGNATURE' || contract.status === 'DRAFT' || contract.status === 'UNDER_REVIEW') return 'pending';
    if (contract.status === 'COMPLETED') return 'expired';

    const endDate = new Date(contract.end_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) return 'expiring';
    if (daysUntilExpiry < 0) return 'expired';

    return 'active';
  };

  // Get status badge styling
  const getStatusBadge = (status: "active" | "pending" | "expiring" | "expired") => {
    const styles = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      expiring: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      expired: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };
    const labels = {
      active: 'Active',
      pending: 'Pending',
      expiring: 'Expiring',
      expired: 'Closed',
    };
    return { style: styles[status], label: labels[status] };
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Contract ID', 'Client', 'Type', 'Value', 'Start Date', 'End Date', 'Status'];
    const rows = contracts.map(c => [
      c.contract_number,
      c.client_name || c.client_organization,
      c.contract_type,
      c.contract_value,
      c.start_date,
      c.end_date,
      mapStatusToFrontend(c)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contracts_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Chart data for donut (contract value by status)
  const donutData = [
    { label: 'Active', value: stats.active, color: '#22c55e' },
    { label: 'Pending', value: stats.pending, color: '#f59e0b' },
    { label: 'Expiring', value: stats.expiring, color: '#f97316' },
    { label: 'Closed', value: stats.expired, color: '#6b7280' },
  ];

  // Mock monthly data for bar chart (in real scenario this would come from API)
  const monthlyData = [
    { month: 'Jul', value: 8 },
    { month: 'Aug', value: 12 },
    { month: 'Sep', value: 6 },
    { month: 'Oct', value: 15 },
    { month: 'Nov', value: 10 },
    { month: 'Dec', value: 4 },
  ];

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
              Manage and track all client contracts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export CSV
            </button>
            <button
              onClick={() => window.location.href = "/business-development/contracts/new"}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              New Contract
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeTab === 'contracts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              Contracts
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeTab === 'templates'
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
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Contract Value"
                value={`$${(stats.total_value / 1000).toFixed(0)}K`}
                subtitle="All time contract value"
                trend="up"
                trendValue="+12.5%"
                icon="payments"
                iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-blue-600 dark:text-blue-400"
              />
              <StatCard
                title="Active Contracts"
                value={stats.active.toString()}
                subtitle="Currently in progress"
                trend="up"
                trendValue="+3"
                icon="task_alt"
                iconBgColor="bg-green-100 dark:bg-green-900/30"
                iconColor="text-green-600 dark:text-green-400"
              />
              <StatCard
                title="Pending Contracts"
                value={stats.pending.toString()}
                subtitle="Awaiting signatures"
                icon="pending_actions"
                iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                iconColor="text-amber-600 dark:text-amber-400"
              />
              <StatCard
                title="Contracts Closed"
                value={stats.expired.toString()}
                subtitle="Year to date"
                trend="up"
                trendValue="+8"
                icon="check_circle"
                iconBgColor="bg-gray-100 dark:bg-gray-800"
                iconColor="text-gray-600 dark:text-gray-400"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donut Chart Card */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Contracts by Status</h3>
                <DonutChart data={donutData} />
              </div>

              {/* Bar Chart Card */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Contracts Over Time</h3>
                <BarChart data={monthlyData} />
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expiring">Expiring Soon</option>
                  <option value="expired">Closed</option>
                </select>
              </div>
            </div>

            {/* Contracts Table */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contract ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-500 dark:text-gray-400">Loading contracts...</span>
                          </div>
                        </td>
                      </tr>
                    ) : contracts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-gray-400">description</span>
                            <p className="text-gray-500 dark:text-gray-400">No contracts found. Create your first contract to get started.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      contracts.map((contract) => {
                        const status = mapStatusToFrontend(contract);
                        const badge = getStatusBadge(status);
                        return (
                          <tr
                            key={contract.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                            onClick={() => window.location.href = `/business-development/contracts/${contract.id}`}
                          >
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-primary">{contract.contract_number}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-900 dark:text-white">{contract.client_name || contract.client_organization}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600 dark:text-gray-400">{contract.contract_type}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {contract.currency} {Number(contract.contract_value).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(contract.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                {' - '}
                                {new Date(contract.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.style}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => window.location.href = `/business-development/contracts/${contract.id}`}
                                  className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  title="View"
                                >
                                  <span className="material-symbols-outlined text-lg">visibility</span>
                                </button>
                                <button
                                  onClick={() => window.location.href = `/business-development/contracts/${contract.id}/edit`}
                                  className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  title="Edit"
                                >
                                  <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      const blob = await contractService.downloadContractPdf(contract.id);
                                      const url = window.URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = `contract_${contract.id}_${contract.contract_number}.pdf`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      window.URL.revokeObjectURL(url);
                                    } catch (error) {
                                      console.error('Error downloading PDF:', error);
                                      alert('Failed to download contract PDF.');
                                    }
                                  }}
                                  className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  title="Download PDF"
                                >
                                  <span className="material-symbols-outlined text-lg">download</span>
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Are you sure you want to delete this contract?')) {
                                      try {
                                        await contractService.deleteContract(contract.id);
                                        fetchData();
                                      } catch (error) {
                                        console.error('Error deleting contract:', error);
                                        alert('Failed to delete contract.');
                                      }
                                    }
                                  }}
                                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  title="Delete"
                                >
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {contracts.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {contracts.length} of {stats.total_count} contracts
                  </p>
                  <button className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Load More
                  </button>
                </div>
              )}
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
