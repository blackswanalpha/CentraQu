"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { contractService } from "@/services/contract.service";
import { opportunityService, type Opportunity } from "@/services/opportunity.service";
import { auditService, type ISOStandard } from "@/services/audit.service";

type ServiceType = "SERVICE" | "CONSULTING" | "CERTIFICATION" | "TRAINING" | "MAINTENANCE";

interface ContractFormData {
  serviceType: ServiceType;
  opportunityId: string;

  // Basic Info
  title: string;
  description: string;
  agreementDate: string;

  // Client Info
  clientOrganization: string;
  clientAddress: string;
  clientContactPerson: string;
  clientTelephone: string;
  clientEmail: string;
  clientSecondaryEmail: string;
  clientWebsite: string;
  siteCovered: string;

  // ISO Standards & Scope
  isoStandards: string[];
  scopeOfWork: string;

  // Audit Process
  stage1AuditDays: string;
  stage1AuditDescription: string;
  stage1RemoteAllowed: boolean;
  stage2AuditDays: string;
  stage2AuditDescription: string;
  surveillanceAuditFrequency: string;
  surveillanceAuditDescription: string;
  recertificationAuditTiming: string;
  recertificationAuditDescription: string;

  // Timeline
  startDate: string;
  endDate: string;
  certificationCycleYears: string;
  stage1Stage2MaxGapDays: string;
  ncClosureMaxDays: string;
  certificateIssueDays: string;
  certificateValidityYears: string;
  certificateValidityExtensionAllowed: boolean;

  // Fees
  feePerStandardYear1: string;
  feePerStandardYear2: string;
  feePerStandardYear3: string;
  recertificationFeeTbd: boolean;
  recertificationFee: string;
  additionalFeesDescription: string;
  contractValue: string;
  currency: string;
  paymentSchedule: string;

  // Policies
  cancellationNoticeDays: string;
  cancellationFeeApplies: boolean;
  confidentialityClause: string;
  dataProtectionCompliance: string;
  clientResponsibilities: string[];

  // Termination & Renewal
  terminationNoticeDays: string;
  terminationFeeWaiver: boolean;
  autoRenewal: boolean;
  renewalNoticeDays: string;
  entireAgreementClause: string;

  // Signatures
  signedByClientName: string;
  signedByClientPosition: string;
  signedByCompanyName: string;
  signedByCompanyPosition: string;
}

export default function NewContractPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isoStandards, setIsoStandards] = useState<ISOStandard[]>([]);
  const [selectedStandardId, setSelectedStandardId] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  const [formData, setFormData] = useState<ContractFormData>({
    serviceType: "CERTIFICATION",
    opportunityId: searchParams.get('opportunityId') || "",

    title: "",
    description: "",
    agreementDate: new Date().toISOString().split('T')[0],

    clientOrganization: "",
    clientAddress: "",
    clientContactPerson: "",
    clientTelephone: "",
    clientEmail: "",
    clientSecondaryEmail: "",
    clientWebsite: "",
    siteCovered: "",

    isoStandards: [],
    scopeOfWork: "",

    stage1AuditDays: "1",
    stage1AuditDescription: "Reviews documentation, readiness, and preparedness.",
    stage1RemoteAllowed: true,
    stage2AuditDays: "3",
    stage2AuditDescription: "Full assessment of implementation and conformity to standards. Subject to change based on growth.",
    surveillanceAuditFrequency: "Annual",
    surveillanceAuditDescription: "Year 2 and Year 3 - Annual audits to verify ongoing conformity.",
    recertificationAuditTiming: "3 months before certificate expiry",
    recertificationAuditDescription: "Man-days similar to Stage II unless changes occur.",

    startDate: "",
    endDate: "",
    certificationCycleYears: "3",
    stage1Stage2MaxGapDays: "90",
    ncClosureMaxDays: "60",
    certificateIssueDays: "14",
    certificateValidityYears: "3",
    certificateValidityExtensionAllowed: false,

    feePerStandardYear1: "1000",
    feePerStandardYear2: "1000",
    feePerStandardYear3: "1000",
    recertificationFeeTbd: true,
    recertificationFee: "",
    additionalFeesDescription: "Follow-up audits (closing NCs), Scope extensions, Major operational changes",
    contractValue: "",
    currency: "USD",
    paymentSchedule: "",

    cancellationNoticeDays: "15",
    cancellationFeeApplies: true,
    confidentialityClause: "AceQu will keep all client information confidential except when required by law or accreditation rules.",
    dataProtectionCompliance: "AceQu must store and process data securely following GDPR and other applicable regulations.",
    clientResponsibilities: [
      "Provide access to personnel, facilities, records during audits",
      "Maintain and improve management systems",
      "Notify AceQu of major changes (processes, locations, ownership)",
      "Support auditor safety requirements"
    ],

    terminationNoticeDays: "30",
    terminationFeeWaiver: false,
    autoRenewal: false,
    renewalNoticeDays: "30",
    entireAgreementClause: "This is the entire agreement. Amendments must be in writing and signed by both parties.",

    signedByClientName: "",
    signedByClientPosition: "",
    signedByCompanyName: "Kuldip Degon, PCQI",
    signedByCompanyPosition: "Lead Auditor, AceQu International Ltd",
  });

  // Fetch opportunities and ISO standards from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch opportunities
        const oppsResponse = await opportunityService.getOpportunities({
          status: 'CLOSED_WON'
        });
        setOpportunities(oppsResponse.results || []);

        // Fetch ISO standards
        const standardsResponse = await auditService.getISOStandards();
        setIsoStandards(standardsResponse.results || []);

        // If opportunityId is in URL, auto-select it
        const oppId = searchParams.get('opportunityId');
        if (oppId && oppsResponse.results) {
          const selectedOpp = oppsResponse.results.find(o => o.id.toString() === oppId);
          if (selectedOpp) {
            handleOpportunitySelect(oppId, selectedOpp);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpportunitySelect = (value: string, opportunity?: Opportunity) => {
    const selectedOpportunity = opportunity || opportunities.find(o => o.id.toString() === value);
    if (selectedOpportunity) {
      const serviceTypeLabel = formData.serviceType === 'CERTIFICATION' ? 'Certification Agreement' :
        formData.serviceType === 'CONSULTING' ? 'Consulting Agreement' :
          formData.serviceType === 'SERVICE' ? 'Service Agreement' :
            formData.serviceType === 'TRAINING' ? 'Training Agreement' :
              formData.serviceType === 'MAINTENANCE' ? 'Maintenance Agreement' : 'Agreement';

      const suggestedTitle = `${selectedOpportunity.client_name || selectedOpportunity.client?.name} - ${serviceTypeLabel}`;

      setFormData((prev) => ({
        ...prev,
        opportunityId: value,
        clientOrganization: selectedOpportunity.client_name || selectedOpportunity.client?.name || "",
        clientContactPerson: selectedOpportunity.client_name || selectedOpportunity.client?.name || "",
        clientEmail: selectedOpportunity.client?.email || "",
        clientAddress: selectedOpportunity.client?.address || "",
        description: selectedOpportunity.description || "",
        contractValue: selectedOpportunity.estimated_value?.toString() || "",
        title: prev.title || suggestedTitle
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "opportunityId") {
      handleOpportunitySelect(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddStandard = () => {
    if (selectedStandardId) {
      const selectedStandard = isoStandards.find(s => s.id.toString() === selectedStandardId);
      if (selectedStandard) {
        // Check if standard is already added
        if (!formData.isoStandards.includes(selectedStandard.code)) {
          setFormData((prev) => ({
            ...prev,
            isoStandards: [...prev.isoStandards, selectedStandard.code]
          }));
        }
        setSelectedStandardId("");
      }
    }
  };

  const handleRemoveStandard = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      isoStandards: prev.isoStandards.filter((_, i) => i !== index)
    }));
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        clientResponsibilities: [...prev.clientResponsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility("");
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      clientResponsibilities: prev.clientResponsibilities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.opportunityId) {
        alert("Please select an opportunity");
        setIsLoading(false);
        return;
      }

      if (!formData.title || !formData.startDate || !formData.endDate || !formData.contractValue) {
        alert("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Calculate duration in months
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const durationMonths = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

      // Prepare contract data for API
      const contractData = {
        opportunity_id: parseInt(formData.opportunityId),
        title: formData.title,
        description: formData.description,
        contract_type: formData.serviceType,
        agreement_date: formData.agreementDate,

        // Client info
        client_organization: formData.clientOrganization,
        client_address: formData.clientAddress,
        client_contact_person: formData.clientContactPerson,
        client_telephone: formData.clientTelephone,
        client_email: formData.clientEmail,
        client_secondary_email: formData.clientSecondaryEmail,
        client_website: formData.clientWebsite,
        site_covered: formData.siteCovered,

        // ISO Standards & Scope
        iso_standards: formData.isoStandards,
        scope_of_work: formData.scopeOfWork,

        // Audit Process
        stage_1_audit_days: parseInt(formData.stage1AuditDays),
        stage_1_audit_description: formData.stage1AuditDescription,
        stage_1_remote_allowed: formData.stage1RemoteAllowed,
        stage_2_audit_days: parseInt(formData.stage2AuditDays),
        stage_2_audit_description: formData.stage2AuditDescription,
        surveillance_audit_frequency: formData.surveillanceAuditFrequency,
        surveillance_audit_description: formData.surveillanceAuditDescription,
        recertification_audit_timing: formData.recertificationAuditTiming,
        recertification_audit_description: formData.recertificationAuditDescription,

        // Timeline
        start_date: formData.startDate,
        end_date: formData.endDate,
        duration_months: durationMonths,
        certification_cycle_years: parseInt(formData.certificationCycleYears),
        stage_1_stage_2_max_gap_days: parseInt(formData.stage1Stage2MaxGapDays),
        nc_closure_max_days: parseInt(formData.ncClosureMaxDays),
        certificate_issue_days: parseInt(formData.certificateIssueDays),
        certificate_validity_years: parseInt(formData.certificateValidityYears),
        certificate_validity_extension_allowed: formData.certificateValidityExtensionAllowed,

        // Fees
        fee_per_standard_year_1: parseFloat(formData.feePerStandardYear1),
        fee_per_standard_year_2: parseFloat(formData.feePerStandardYear2),
        fee_per_standard_year_3: parseFloat(formData.feePerStandardYear3),
        recertification_fee_tbd: formData.recertificationFeeTbd,
        recertification_fee: formData.recertificationFee ? parseFloat(formData.recertificationFee) : null,
        additional_fees_description: formData.additionalFeesDescription,

        // Financial
        contract_value: parseFloat(formData.contractValue),
        currency: formData.currency,
        payment_schedule: formData.paymentSchedule,

        // Policies
        cancellation_notice_days: parseInt(formData.cancellationNoticeDays),
        cancellation_fee_applies: formData.cancellationFeeApplies,
        confidentiality_clause: formData.confidentialityClause,
        data_protection_compliance: formData.dataProtectionCompliance,
        client_responsibilities: formData.clientResponsibilities,

        // Termination & Renewal
        termination_notice_days: parseInt(formData.terminationNoticeDays),
        termination_fee_waiver: formData.terminationFeeWaiver,
        auto_renewal: formData.autoRenewal,
        renewal_notice_days: parseInt(formData.renewalNoticeDays),
        entire_agreement_clause: formData.entireAgreementClause,

        // Signatures
        signed_by_client_name: formData.signedByClientName,
        signed_by_client_position: formData.signedByClientPosition,
        signed_by_company_name: formData.signedByCompanyName,
        signed_by_company_position: formData.signedByCompanyPosition,

        status: 'DRAFT',
      };

      console.log("Creating contract:", contractData);

      const createdContract = await contractService.createContract(contractData);
      console.log("Contract created successfully:", createdContract);

      router.push("/business-development/contracts");
    } catch (error: any) {
      console.error("Error creating contract:", error);
      alert(error.message || "Failed to create contract. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Contract
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Create a comprehensive certification agreement from an opportunity
            </p>
          </div>
          <button
            onClick={() => router.push("/business-development/contracts")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              {/* Opportunity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opportunity *
                </label>
                <select
                  name="opportunityId"
                  value={formData.opportunityId}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select an opportunity</option>
                  {opportunities.map((opportunity) => (
                    <option key={opportunity.id} value={opportunity.id}>
                      {opportunity.title} - {opportunity.client_name || opportunity.client?.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Only showing won opportunities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Type *
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="CERTIFICATION">Certification Agreement</option>
                    <option value="CONSULTING">Consulting Agreement</option>
                    <option value="SERVICE">Service Agreement</option>
                    <option value="TRAINING">Training Agreement</option>
                    <option value="MAINTENANCE">Maintenance Agreement</option>
                  </select>
                </div>

                {/* Agreement Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Agreement Date
                  </label>
                  <input
                    type="date"
                    name="agreementDate"
                    value={formData.agreementDate}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Contract Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contract Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Annual ISO Certification Agreement"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe the scope and terms of this contract..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="clientOrganization"
                  value={formData.clientOrganization}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="clientContactPerson"
                  value={formData.clientContactPerson}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telephone
                </label>
                <input
                  type="tel"
                  name="clientTelephone"
                  value={formData.clientTelephone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Email
                </label>
                <input
                  type="email"
                  name="clientSecondaryEmail"
                  value={formData.clientSecondaryEmail}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="clientWebsite"
                  value={formData.clientWebsite}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Covered
                </label>
                <input
                  type="text"
                  name="siteCovered"
                  value={formData.siteCovered}
                  onChange={handleInputChange}
                  placeholder="Physical location/site covered by this contract"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Certification Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Certification Details
            </h2>
            <div className="space-y-4">
              {/* ISO Standards */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ISO Standards
                </label>
                <div className="flex gap-2 mb-3">
                  <select
                    value={selectedStandardId}
                    onChange={(e) => setSelectedStandardId(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select an ISO standard</option>
                    {isoStandards.map((standard) => (
                      <option 
                        key={standard.id} 
                        value={standard.id}
                        disabled={formData.isoStandards.includes(standard.code)}
                      >
                        {standard.code} - {standard.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddStandard}
                    disabled={!selectedStandardId}
                    className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                
                {/* Selected Standards */}
                {formData.isoStandards.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected Standards:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.isoStandards.map((standardCode, index) => {
                        const standardInfo = isoStandards.find(s => s.code === standardCode);
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-800 dark:text-blue-200"
                            title={standardInfo?.name || standardCode}
                          >
                            {standardCode}
                            <button
                              type="button"
                              onClick={() => handleRemoveStandard(index)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Standards Summary */}
                {isoStandards.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                    <p className="font-medium mb-1">Available Standards in System ({isoStandards.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {isoStandards.slice(0, 8).map((std) => (
                        <span key={std.id} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          {std.code}
                        </span>
                      ))}
                      {isoStandards.length > 8 && (
                        <span className="text-gray-500">+{isoStandards.length - 8} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Scope of Work */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scope of Work
                </label>
                <textarea
                  name="scopeOfWork"
                  value={formData.scopeOfWork}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe the detailed scope of certification work..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Audit Process */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Audit Process
            </h2>

            {/* Stage I Audit */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Stage I Audit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audit Days
                  </label>
                  <input
                    type="number"
                    name="stage1AuditDays"
                    value={formData.stage1AuditDays}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="stage1RemoteAllowed"
                    checked={formData.stage1RemoteAllowed}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Remote audit allowed
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="stage1AuditDescription"
                    value={formData.stage1AuditDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Stage II Audit */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Stage II Audit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audit Days
                  </label>
                  <input
                    type="number"
                    name="stage2AuditDays"
                    value={formData.stage2AuditDays}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="stage2AuditDescription"
                    value={formData.stage2AuditDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Surveillance Audits */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Surveillance Audits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequency
                  </label>
                  <input
                    type="text"
                    name="surveillanceAuditFrequency"
                    value={formData.surveillanceAuditFrequency}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="surveillanceAuditDescription"
                    value={formData.surveillanceAuditDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Recertification Audit */}
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Recertification Audit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timing
                  </label>
                  <input
                    type="text"
                    name="recertificationAuditTiming"
                    value={formData.recertificationAuditTiming}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="recertificationAuditDescription"
                    value={formData.recertificationAuditDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Certification Conditions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timeline & Certification Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certification Cycle (Years)
                </label>
                <input
                  type="number"
                  name="certificationCycleYears"
                  value={formData.certificationCycleYears}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stage I & II Max Gap (Days)
                </label>
                <input
                  type="number"
                  name="stage1Stage2MaxGapDays"
                  value={formData.stage1Stage2MaxGapDays}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500">Default: 90 days (3 months)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  NC Closure Max (Days)
                </label>
                <input
                  type="number"
                  name="ncClosureMaxDays"
                  value={formData.ncClosureMaxDays}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500">Default: 60 days</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate Issue (Working Days)
                </label>
                <input
                  type="number"
                  name="certificateIssueDays"
                  value={formData.certificateIssueDays}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500">Default: 14 working days after NC closure</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate Validity (Years)
                </label>
                <input
                  type="number"
                  name="certificateValidityYears"
                  value={formData.certificateValidityYears}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="certificateValidityExtensionAllowed"
                  checked={formData.certificateValidityExtensionAllowed}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Allow validity extension (default: No, only through recertification)
                </label>
              </div>
            </div>
          </div>

          {/* Fee Structure */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Fee Structure (Per Standard)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year 1 (Certification)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                    {formData.currency}
                  </span>
                  <input
                    type="number"
                    name="feePerStandardYear1"
                    value={formData.feePerStandardYear1}
                    onChange={handleInputChange}
                    step="0.01"
                    className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year 2 (Surveillance)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                    {formData.currency}
                  </span>
                  <input
                    type="number"
                    name="feePerStandardYear2"
                    value={formData.feePerStandardYear2}
                    onChange={handleInputChange}
                    step="0.01"
                    className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year 3 (Surveillance)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                    {formData.currency}
                  </span>
                  <input
                    type="number"
                    name="feePerStandardYear3"
                    value={formData.feePerStandardYear3}
                    onChange={handleInputChange}
                    step="0.01"
                    className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="recertificationFeeTbd"
                    checked={formData.recertificationFeeTbd}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recertification Fee TBD
                  </label>
                </div>
                {!formData.recertificationFeeTbd && (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                      {formData.currency}
                    </span>
                    <input
                      type="number"
                      name="recertificationFee"
                      value={formData.recertificationFee}
                      onChange={handleInputChange}
                      step="0.01"
                      placeholder="Recertification fee"
                      className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Contract Value *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                    {formData.currency}
                  </span>
                  <input
                    type="number"
                    name="contractValue"
                    value={formData.contractValue}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Fees Description
              </label>
              <textarea
                name="additionalFeesDescription"
                value={formData.additionalFeesDescription}
                onChange={handleInputChange}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Schedule
              </label>
              <textarea
                name="paymentSchedule"
                value={formData.paymentSchedule}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe the payment schedule..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Policies & Legal */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Policies & Legal
            </h2>

            <div className="space-y-4">
              {/* Cancellation Policy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cancellation Notice (Working Days)
                  </label>
                  <input
                    type="number"
                    name="cancellationNoticeDays"
                    value={formData.cancellationNoticeDays}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="cancellationFeeApplies"
                    checked={formData.cancellationFeeApplies}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Full audit fee applies for late cancellations
                  </label>
                </div>
              </div>

              {/* Confidentiality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confidentiality Clause
                </label>
                <textarea
                  name="confidentialityClause"
                  value={formData.confidentialityClause}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Data Protection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Protection Compliance
                </label>
                <textarea
                  name="dataProtectionCompliance"
                  value={formData.dataProtectionCompliance}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Client Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Responsibilities
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResponsibility())}
                    placeholder="Add a responsibility..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddResponsibility}
                    className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-1">
                  {formData.clientResponsibilities.map((resp, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="flex-1">• {resp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Termination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Termination Notice (Days)
                  </label>
                  <input
                    type="number"
                    name="terminationNoticeDays"
                    value={formData.terminationNoticeDays}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="terminationFeeWaiver"
                    checked={formData.terminationFeeWaiver}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Termination waives fees for completed audits
                  </label>
                </div>
              </div>

              {/* Entire Agreement Clause */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entire Agreement Clause
                </label>
                <textarea
                  name="entireAgreementClause"
                  value={formData.entireAgreementClause}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Renewal Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Renewal Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="autoRenewal"
                  checked={formData.autoRenewal}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable automatic renewal
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Renewal Notification (days before expiry)
                </label>
                <input
                  type="number"
                  name="renewalNoticeDays"
                  value={formData.renewalNoticeDays}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Signatures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Signature */}
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Client</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="signedByClientName"
                      value={formData.signedByClientName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      name="signedByClientPosition"
                      value={formData.signedByClientPosition}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Company Signature */}
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Certification Body</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="signedByCompanyName"
                      value={formData.signedByCompanyName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      name="signedByCompanyPosition"
                      value={formData.signedByCompanyPosition}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/business-development/contracts")}
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Contract"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
