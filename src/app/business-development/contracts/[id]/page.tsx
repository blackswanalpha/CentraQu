"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { StatusBadge } from "@/components/BusinessDevelopment/status-badge";
import { ContractEditor } from "@/components/Contracts/contract-editor";
import { useState, useEffect, use } from "react";
import {
  contractService,
  Contract,
  ContractCost,
  ContractIncome,
  ContractFinancialSummary,
  COST_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS
} from "@/services/contract.service";

type TabType = "overview" | "agreement" | "financial";

// Cost Modal Component
function AddCostModal({
  isOpen,
  onClose,
  onSave,
  contractId,
  currency
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cost: Partial<ContractCost>) => void;
  contractId: number;
  currency: string;
}) {
  const [formData, setFormData] = useState({
    cost_type: 'FLIGHT' as ContractCost['cost_type'],
    description: '',
    tentative_amount: '',
    actual_amount: '',
    date_incurred: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      contract: contractId,
      cost_type: formData.cost_type,
      description: formData.description,
      tentative_amount: parseFloat(formData.tentative_amount) || 0,
      actual_amount: formData.actual_amount ? parseFloat(formData.actual_amount) : null,
      currency: currency,
      date_incurred: formData.date_incurred || undefined,
      notes: formData.notes
    });
    setFormData({
      cost_type: 'FLIGHT',
      description: '',
      tentative_amount: '',
      actual_amount: '',
      date_incurred: '',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Cost</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost Type</label>
            <select
              value={formData.cost_type}
              onChange={(e) => setFormData({ ...formData, cost_type: e.target.value as ContractCost['cost_type'] })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              required
            >
              {COST_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tentative Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.tentative_amount}
                onChange={(e) => setFormData({ ...formData, tentative_amount: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Actual Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.actual_amount}
                onChange={(e) => setFormData({ ...formData, actual_amount: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Incurred</label>
            <input
              type="date"
              value={formData.date_incurred}
              onChange={(e) => setFormData({ ...formData, date_incurred: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              rows={2}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              Add Cost
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Income Modal Component
function AddIncomeModal({
  isOpen,
  onClose,
  onSave,
  contractId,
  currency
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (income: Partial<ContractIncome>) => void;
  contractId: number;
  currency: string;
}) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date_received: '',
    payment_method: '' as ContractIncome['payment_method'],
    reference: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      contract: contractId,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      currency: currency,
      date_received: formData.date_received,
      payment_method: formData.payment_method || undefined,
      reference: formData.reference,
      notes: formData.notes
    });
    setFormData({
      description: '',
      amount: '',
      date_received: '',
      payment_method: '',
      reference: '',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Income</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Received</label>
              <input
                type="date"
                value={formData.date_received}
                onChange={(e) => setFormData({ ...formData, date_received: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as ContractIncome['payment_method'] })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
            >
              <option value="">Select method...</option>
              {PAYMENT_METHOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              placeholder="Invoice/Payment reference"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              rows={2}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({
  title,
  value,
  icon,
  trend = null,
  bgColor = "bg-primary/10"
}: {
  title: string;
  value: string;
  icon: string;
  trend?: { value: string; positive: boolean } | null;
  bgColor?: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <span className="material-symbols-outlined text-2xl text-primary">{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Financial data
  const [costs, setCosts] = useState<ContractCost[]>([]);
  const [incomes, setIncomes] = useState<ContractIncome[]>([]);
  const [financialSummary, setFinancialSummary] = useState<ContractFinancialSummary | null>(null);

  // Modals
  const [showCostModal, setShowCostModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [id]);

  useEffect(() => {
    if (contract && activeTab === 'financial') {
      fetchFinancialData();
    }
  }, [contract, activeTab]);

  const fetchContract = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contractService.getContract(id);
      setContract(data);
    } catch (err) {
      console.error('Error fetching contract:', err);
      setError('Failed to load contract details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFinancialData = async () => {
    try {
      const [costsData, incomesData, summaryData] = await Promise.all([
        contractService.getContractCosts(id),
        contractService.getContractIncomes(id),
        contractService.getContractFinancialSummary(id)
      ]);
      setCosts(costsData);
      setIncomes(incomesData);
      setFinancialSummary(summaryData);
    } catch (err) {
      console.error('Error fetching financial data:', err);
    }
  };

  const handleAddCost = async (costData: Partial<ContractCost>) => {
    try {
      await contractService.createContractCost(costData);
      setShowCostModal(false);
      fetchFinancialData();
    } catch (err) {
      console.error('Error adding cost:', err);
      alert('Failed to add cost');
    }
  };

  const handleDeleteCost = async (costId: number) => {
    if (!confirm('Delete this cost?')) return;
    try {
      await contractService.deleteContractCost(costId);
      fetchFinancialData();
    } catch (err) {
      console.error('Error deleting cost:', err);
    }
  };

  const handleAddIncome = async (incomeData: Partial<ContractIncome>) => {
    try {
      await contractService.createContractIncome(incomeData);
      setShowIncomeModal(false);
      fetchFinancialData();
    } catch (err) {
      console.error('Error adding income:', err);
      alert('Failed to add income');
    }
  };

  const handleDeleteIncome = async (incomeId: number) => {
    if (!confirm('Delete this income record?')) return;
    try {
      await contractService.deleteContractIncome(incomeId);
      fetchFinancialData();
    } catch (err) {
      console.error('Error deleting income:', err);
    }
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading contract...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contract) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-red-500">error</span>
            <p className="mt-4 text-gray-900 dark:text-white font-semibold">{error || 'Contract not found'}</p>
            <button
              onClick={() => window.location.href = '/business-development/contracts'}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Back to Contracts
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate days remaining and progress percentage for Contract Timeline
  const startDate = new Date(contract.start_date);
  const endDate = new Date(contract.end_date);
  const today = new Date();

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = today.getTime() - startDate.getTime();

  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));

  const formatCurrency = (value: string | number | undefined) => {
    const num = typeof value === 'string' ? parseFloat(value) : (value || 0);
    return `${contract.currency} ${num.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <a className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary" href="/">Home</a>
          <span className="text-gray-500 dark:text-gray-400 text-sm">/</span>
          <a className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary" href="/business-development/contracts">Contracts</a>
          <span className="text-gray-500 dark:text-gray-400 text-sm">/</span>
          <span className="text-gray-900 dark:text-white text-sm font-medium">#{contract.contract_number}</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contract #{contract.contract_number}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {contract.title} • {contract.client_organization || contract.client_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.href = `/business-development/contracts/${id}/edit`}
              className="px-4 py-2 rounded-lg bg-gray-200/80 dark:bg-gray-700/80 text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <span className="material-symbols-outlined text-base mr-1 align-middle">edit</span>
              Edit
            </button>
            <button
              onClick={async () => {
                try {
                  const blob = await contractService.downloadContractPdf(contract.id);
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `contract_${contract.contract_number}.pdf`;
                  link.click();
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  alert('Failed to download PDF');
                }
              }}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-base mr-1 align-middle">download</span>
              Download PDF
            </button>
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex gap-3 mb-6">
          <StatusBadge status={mapStatusToFrontend(contract)} />
          {contract.auto_renewal && (
            <div className="flex h-8 items-center gap-x-2 rounded-full bg-amber-100 dark:bg-amber-900/40 px-3">
              <span className="material-symbols-outlined text-amber-800 dark:text-amber-300 text-base">autorenew</span>
              <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">Auto-Renews</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <div className="flex gap-6">
            {(['overview', 'agreement', 'financial'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'agreement' && 'Agreement Details'}
                {tab === 'financial' && 'Financial Overview'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contract Details Card */}
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Client</span>
                    <span className="font-medium text-primary">{contract.client_organization || contract.client_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Contract Value</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(contract.contract_value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Contract Type</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{contract.contract_type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Start Date</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(contract.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">End Date</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(contract.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Timeline</h3>
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="absolute h-2 bg-primary rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>{new Date(contract.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}</span>
                  <span>{new Date(contract.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              {/* ISO Standards */}
              {contract.iso_standards && contract.iso_standards.length > 0 && (
                <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ISO Standards</h3>
                  <div className="flex flex-wrap gap-2">
                    {contract.iso_standards.map((std, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm">
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Scope & Objectives */}
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scope & Objectives</h3>
                {contract.scope_of_work && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scope of Work</p>
                    <p className="text-gray-600 dark:text-gray-400">{contract.scope_of_work}</p>
                  </div>
                )}
                {contract.scope_of_certification && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scope of Certification</p>
                    <p className="text-gray-600 dark:text-gray-400">{contract.scope_of_certification}</p>
                  </div>
                )}
                {contract.objectives && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objectives</p>
                    <p className="text-gray-600 dark:text-gray-400">{contract.objectives}</p>
                  </div>
                )}
              </div>

              {/* Document Viewer Placeholder */}
              <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 h-[400px] flex flex-col">
                <div className="border-b border-gray-200 dark:border-gray-800 px-4">
                  <div className="flex items-center">
                    <button className="px-4 py-3 border-b-2 border-primary text-primary font-semibold text-sm">Contract.pdf</button>
                  </div>
                </div>
                <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center rounded-b-xl">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-5xl">picture_as_pdf</span>
                    <p className="mt-2 text-sm font-medium">Contract document preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agreement' && (
          <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <ContractEditor
              contractId={contract.id}
              contractNumber={contract.contract_number}
              clientName={contract.client_organization || contract.client_name || 'Client'}
              contractData={{
                client_organization: contract.client_organization,
                client_address: contract.client_address,
                client_contact_person: contract.client_contact_person,
                client_email: contract.client_email,
                cb_name: contract.cb_name,
                cb_address: contract.cb_address,
                iso_standards: contract.iso_standards,
                scope_of_certification: contract.scope_of_certification,
                scope_of_work: contract.scope_of_work,
                objectives: contract.objectives,
                stage_1_audit_days: contract.stage_1_audit_days,
                stage_2_audit_days: contract.stage_2_audit_days,
                fee_per_standard_year_1: contract.fee_per_standard_year_1,
                fee_per_standard_year_2: contract.fee_per_standard_year_2,
                fee_per_standard_year_3: contract.fee_per_standard_year_3,
                contract_value: contract.contract_value,
                currency: contract.currency,
                start_date: contract.start_date,
                end_date: contract.end_date,
                signed_by_client_name: contract.signed_by_client_name,
                signed_by_client_position: contract.signed_by_client_position,
                signed_by_company_name: contract.signed_by_company_name,
                signed_by_company_position: contract.signed_by_company_position,
              }}
              templateCategory={contract.template_category}
              onSave={() => fetchContract()}
            />
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Income"
                value={formatCurrency(financialSummary?.total_income || '0')}
                icon="payments"
                bgColor="bg-green-100 dark:bg-green-900/30"
              />
              <StatCard
                title="Total Cost"
                value={formatCurrency(financialSummary?.effective_cost || '0')}
                icon="receipt_long"
                bgColor="bg-red-100 dark:bg-red-900/30"
              />
              <StatCard
                title="Net Profit"
                value={formatCurrency(financialSummary?.net_profit || '0')}
                icon="trending_up"
                bgColor="bg-blue-100 dark:bg-blue-900/30"
              />
              <StatCard
                title="Margin"
                value={`${financialSummary?.margin_percentage || '0'}%`}
                icon="percent"
                bgColor="bg-purple-100 dark:bg-purple-900/30"
              />
            </div>

            {/* Costs Table */}
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Costs</h3>
                <button
                  onClick={() => setShowCostModal(true)}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-base mr-1 align-middle">add</span>
                  Add Cost
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-right">Tentative</th>
                      <th className="px-4 py-3 text-right">Actual</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No costs recorded
                        </td>
                      </tr>
                    ) : (
                      costs.map((cost) => (
                        <tr key={cost.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {cost.cost_type_display || cost.cost_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{cost.description}</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{formatCurrency(cost.tentative_amount)}</td>
                          <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{cost.actual_amount ? formatCurrency(cost.actual_amount) : '-'}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{cost.date_incurred ? new Date(cost.date_incurred).toLocaleDateString() : '-'}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteCost(cost.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Income Table */}
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Income</h3>
                <button
                  onClick={() => setShowIncomeModal(true)}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                >
                  <span className="material-symbols-outlined text-base mr-1 align-middle">add</span>
                  Add Income
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-left">Payment Method</th>
                      <th className="px-4 py-3 text-left">Reference</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No income recorded
                        </td>
                      </tr>
                    ) : (
                      incomes.map((income) => (
                        <tr key={income.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{income.description}</td>
                          <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">{formatCurrency(income.amount)}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{income.payment_method_display || income.payment_method || '-'}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{income.reference || '-'}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(income.date_received).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteIncome(income.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCostModal
        isOpen={showCostModal}
        onClose={() => setShowCostModal(false)}
        onSave={handleAddCost}
        contractId={contract.id}
        currency={contract.currency}
      />
      <AddIncomeModal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        onSave={handleAddIncome}
        contractId={contract.id}
        currency={contract.currency}
      />
    </DashboardLayout>
  );
}
