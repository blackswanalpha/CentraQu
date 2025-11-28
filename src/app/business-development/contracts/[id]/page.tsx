'use client';

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

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "certification", label: "Certification Details" },
    { id: "financial", label: "Financial" },
    { id: "parties", label: "Parties" },
    { id: "legal", label: "Legal & Compliance" },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading contract details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contract) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 dark:text-red-400">{error || 'Contract not found'}</p>
          <button
            onClick={() => window.location.href = '/business-development/contracts'}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Back to Contracts
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {contract.client_organization || contract.client_name}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {contract.title}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {contract.contract_number}
            </p>
          </div>
          <div className="flex gap-2">
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
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Download PDF
            </button>
            <button
              onClick={() => window.location.href = `/business-development/contracts/${id}/edit`}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Key Info Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <StatusBadge status={mapStatusToFrontend(contract)} />
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {contract.currency} {(Number(contract.contract_value) / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {contract.duration_months || contract.certification_cycle_years ?
                `${contract.certification_cycle_years || Math.floor((contract.duration_months || 0) / 12)} years` :
                'N/A'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">ISO Standards</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {contract.total_standards_count || contract.iso_standards?.length || 0}
            </p>
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
                  Contract Information
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contract Number</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {contract.contract_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contract Type</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {contract.contract_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {new Date(contract.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {new Date(contract.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  {contract.agreement_date && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Agreement Date</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {new Date(contract.agreement_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {contract.opportunity_title && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Linked Opportunity</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.opportunity_title}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Description
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {contract.description || 'No description available'}
                </p>
              </div>
            </div>
          )}

          {activeTab === "certification" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  ISO Standards
                </h3>
                {contract.iso_standards && contract.iso_standards.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {contract.iso_standards.map((standard, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-800 dark:text-blue-200"
                      >
                        {standard}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No ISO standards specified</p>
                )}
              </div>

              {contract.scope_of_work && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Scope of Work
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {contract.scope_of_work}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Audit Process
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {contract.stage_1_audit_days && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Stage I Audit Days</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.stage_1_audit_days} days
                      </p>
                    </div>
                  )}
                  {contract.stage_2_audit_days && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Stage II Audit Days</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.stage_2_audit_days} days
                      </p>
                    </div>
                  )}
                  {contract.surveillance_audit_frequency && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Surveillance Frequency</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.surveillance_audit_frequency}
                      </p>
                    </div>
                  )}
                  {contract.certification_cycle_years && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Certification Cycle</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.certification_cycle_years} years
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {contract.site_covered && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Site Covered
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {contract.site_covered}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "financial" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Fee Structure (Per Standard)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Year 1 (Certification)</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {contract.currency} {contract.fee_per_standard_year_1?.toLocaleString() || 'N/A'}
                    </p>
                    {contract.total_year_1_fee && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        Total: {contract.currency} {contract.total_year_1_fee.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Year 2 (Surveillance)</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {contract.currency} {contract.fee_per_standard_year_2?.toLocaleString() || 'N/A'}
                    </p>
                    {contract.total_year_2_fee && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        Total: {contract.currency} {contract.total_year_2_fee.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Year 3 (Surveillance)</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {contract.currency} {contract.fee_per_standard_year_3?.toLocaleString() || 'N/A'}
                    </p>
                    {contract.total_year_3_fee && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        Total: {contract.currency} {contract.total_year_3_fee.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Total Contract Value
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {contract.currency} {Number(contract.contract_value).toLocaleString()}
                </p>
              </div>

              {contract.payment_schedule && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Payment Schedule
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {contract.payment_schedule}
                  </p>
                </div>
              )}

              {contract.recertification_fee_tbd !== undefined && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Recertification Fee
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {contract.recertification_fee_tbd ?
                      'To be determined' :
                      `${contract.currency} ${contract.recertification_fee?.toLocaleString() || 'N/A'}`
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "parties" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Client Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {contract.client_organization && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Organization</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.client_organization}
                      </p>
                    </div>
                  )}
                  {contract.client_contact_person && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Contact Person</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.client_contact_person}
                      </p>
                    </div>
                  )}
                  {contract.client_email && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.client_email}
                      </p>
                    </div>
                  )}
                  {contract.client_telephone && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Telephone</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.client_telephone}
                      </p>
                    </div>
                  )}
                  {contract.client_address && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.client_address}
                      </p>
                    </div>
                  )}
                </div>

                {/* Client Signature */}
                {(contract.signed_by_client_name || contract.client_signed_date) && (
                  <div className="mt-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Signature</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {contract.signed_by_client_name && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Signed By</p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {contract.signed_by_client_name}
                          </p>
                        </div>
                      )}
                      {contract.signed_by_client_position && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {contract.signed_by_client_position}
                          </p>
                        </div>
                      )}
                      {contract.client_signed_date && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {new Date(contract.client_signed_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Certification Body
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {contract.cb_name && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.cb_name}
                      </p>
                    </div>
                  )}
                  {contract.cb_address && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.cb_address}
                      </p>
                    </div>
                  )}
                  {contract.cb_role && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {contract.cb_role}
                      </p>
                    </div>
                  )}
                </div>

                {/* Company Signature */}
                {(contract.signed_by_company_name || contract.company_signed_date) && (
                  <div className="mt-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Signature</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {contract.signed_by_company_name && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Signed By</p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {contract.signed_by_company_name}
                          </p>
                        </div>
                      )}
                      {contract.signed_by_company_position && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {contract.signed_by_company_position}
                          </p>
                        </div>
                      )}
                      {contract.company_signed_date && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {new Date(contract.company_signed_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "legal" && (
            <div className="space-y-6">
              {contract.confidentiality_clause && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Confidentiality Clause
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {contract.confidentiality_clause}
                  </p>
                </div>
              )}

              {contract.data_protection_compliance && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Data Protection Compliance
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {contract.data_protection_compliance}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Cancellation & Termination Policy
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {contract.cancellation_notice_days && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cancellation Notice</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.cancellation_notice_days} working days
                      </p>
                    </div>
                  )}
                  {contract.termination_notice_days && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Termination Notice</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.termination_notice_days} days
                      </p>
                    </div>
                  )}
                  {contract.cancellation_fee_applies !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Late Cancellation Fee</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.cancellation_fee_applies ? 'Full audit fee applies' : 'No fee'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {contract.client_responsibilities && contract.client_responsibilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Client Responsibilities
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    {contract.client_responsibilities.map((responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Renewal Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Auto Renewal</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {contract.auto_renewal ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  {contract.renewal_notice_days && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Renewal Notice</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {contract.renewal_notice_days} days before expiry
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
