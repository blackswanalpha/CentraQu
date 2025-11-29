"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { StatusBadge } from "@/components/BusinessDevelopment/status-badge";
import { useState, useEffect, use } from "react";
import { contractService, Contract } from "@/services/contract.service";

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContract();
  }, [id]);

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

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2">
          <a className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary" href="#">Home</a>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
          <a className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary" href="/business-development/contracts">Contracts</a>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
          <span className="text-gray-900 dark:text-white text-sm font-medium leading-normal">Contract #{contract.contract_number}</span>
        </div>

        <div className="space-y-6">
          {/* PageHeading */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Contract #{contract.contract_number} - {contract.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Active with {contract.client_organization || contract.client_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = `/business-development/contracts/${id}/edit`}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200/80 dark:bg-gray-700/80 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <span className="truncate">Edit</span>
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
                    alert('Failed to download contract PDF. Please try again.');
                  }
                }}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80">
                <span className="material-symbols-outlined">download</span>
              </button>
              <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80">
                <span className="material-symbols-outlined">share</span>
              </button>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-primary/90">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>signature</span>
                <span className="truncate">Request E-Sign</span>
              </button>
            </div>
          </div>

          {/* Chips */}
          <div className="flex gap-3 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-green-100 dark:bg-green-900/40 px-3">
              <div className="size-2 rounded-full bg-green-500"></div>
              <p className="text-green-800 dark:text-green-300 text-sm font-medium leading-normal">Active</p>
            </div>
            {(contract.client_signed_date || contract.signed_by_client_name) && (
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-blue-100 dark:bg-blue-900/40 px-3">
                <span className="material-symbols-outlined text-blue-800 dark:text-blue-300 text-base">check_circle</span>
                <p className="text-blue-800 dark:text-blue-300 text-sm font-medium leading-normal">E-Signed</p>
              </div>
            )}
            {contract.auto_renewal && (
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-amber-100 dark:bg-amber-900/40 px-3">
                <span className="material-symbols-outlined text-amber-800 dark:text-amber-300 text-base">autorenew</span>
                <p className="text-amber-800 dark:text-amber-300 text-sm font-medium leading-normal">Auto-Renews</p>
              </div>
            )}
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column: Metadata */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Client</span>
                    <a className="font-medium text-primary hover:underline" href="#">{contract.client_organization || contract.client_name}</a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Contract Value</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{contract.currency} {Number(contract.contract_value).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Billing Model</span>
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
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Timeline</h3>
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="absolute h-2 bg-primary rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>{new Date(contract.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span>{daysRemaining} days remaining</span>
                  <span>{new Date(contract.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reminders</h3>
                <ul className="space-y-3">
                  {contract.renewal_notice_days && (
                    <li className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">notifications</span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Renewal reminder set for {contract.renewal_notice_days} days before end.</span>
                    </li>
                  )}
                  {/* Placeholder for next invoice, could be implemented with actual invoice data */}
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">calendar_month</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Next invoice on Aug 1, 2024. (Placeholder)</span>
                  </li>
                </ul>
              </div>
            </div>
            {/* Right Column: Document and Related Info */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 h-[600px] flex flex-col">
                <div className="border-b border-gray-200 dark:border-gray-800 px-4">
                  <div className="flex items-center">
                    <button className="px-4 py-3 border-b-2 border-primary text-primary font-semibold text-sm">Contract.pdf</button>
                    <button className="px-4 py-3 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium text-sm">Addendum_A.pdf</button>
                  </div>
                </div>
                <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center rounded-b-xl">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-5xl">picture_as_pdf</span>
                    <p className="mt-2 text-sm font-medium">Document viewer placeholder</p>
                  </div>
                </div>
              </div> {/* This is the missing closing div for the document viewer card */}
              <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white p-6 border-b border-gray-200 dark:border-gray-800">Related Invoices</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-3" scope="col">Invoice #</th>
                        <th className="px-6 py-3" scope="col">Amount</th>
                        <th className="px-6 py-3" scope="col">Status</th>
                        <th className="px-6 py-3" scope="col">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-medium text-primary hover:underline"><a href="#">INV-2024-001</a></td>
                        <td className="px-6 py-4">$15,000.00</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">Paid</span>
                        </td>
                        <td className="px-6 py-4">Jul 1, 2024</td>
                      </tr>
                      <tr className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-medium text-primary hover:underline"><a href="#">INV-2024-002</a></td>
                        <td className="px-6 py-4">$15,000.00</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">Due Soon</span>
                        </td>
                        <td className="px-6 py-4">Aug 1, 2024</td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-medium text-primary hover:underline"><a href="#">INV-2024-003</a></td>
                        <td className="px-6 py-4">$15,000.00</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">Upcoming</span>
                        </td>
                        <td className="px-6 py-4">Sep 1, 2024</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
