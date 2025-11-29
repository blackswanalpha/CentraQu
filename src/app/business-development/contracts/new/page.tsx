"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { contractService } from "@/services/contract.service";
import { opportunityService, type Opportunity } from "@/services/opportunity.service";
import { auditService, type ISOStandard } from "@/services/audit.service";
import { templateService, type Template } from "@/services/template.service";

type ServiceType = "SERVICE" | "CONSULTING" | "CERTIFICATION" | "TRAINING" | "MAINTENANCE";

interface ContractFormData {
  serviceType: ServiceType;
  opportunityId: string;
  selectedTemplateId: string;

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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedStandardId, setSelectedStandardId] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  const [formData, setFormData] = useState<ContractFormData>({
    serviceType: "CERTIFICATION",
    opportunityId: searchParams.get('opportunityId') || "",
    selectedTemplateId: "",

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

        // Fetch contract templates
        try {
          const templatesData = await templateService.listTemplates();
          const contractTemplates = templatesData.filter(t => t.type === 'contract');
          setTemplates(contractTemplates);
        } catch (error) {
          console.error('Error fetching templates:', error);
        }

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

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  const handleSubmitAndNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      nextStep();
    } else {
      await handleSubmit(e);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
          <p className="text-[#0d141b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            Create New Contract
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/business-development/contracts")}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Cancel</span>
            </button>
            <button
              onClick={handleSubmitAndNext}
              disabled={isLoading}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">
                {currentStep < 4 ? "Next Step" : isLoading ? "Creating..." : "Create Contract"}
              </span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Wizard Content */}
          <div className="lg:col-span-2">
            <div className="w-full rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              {/* Tabs/Stepper */}
              <div className="pb-6">
                <div className="flex border-b border-[#cfdbe7] dark:border-slate-700 gap-8">
                  {[1, 2, 3, 4].map((step) => (
                    <a
                      key={step}
                      onClick={() => setCurrentStep(step)}
                      className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 cursor-pointer ${currentStep === step
                        ? "border-b-primary text-primary"
                        : "border-b-transparent text-[#4c739a] dark:text-slate-400"
                        }`}
                    >
                      <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                        {
                          ["1. Client & Details", "2. Terms & Scope", "3. Billing", "4. Preview"][
                          step - 1
                          ]
                        }
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmitAndNext} className="flex flex-col gap-6 pt-4">
                {currentStep === 1 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white">
                      Select Client & Basic Information
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#0d141b] dark:text-slate-200 text-base font-medium leading-normal pb-2">
                          Select Client
                        </p>
                        <select
                          name="opportunityId"
                          value={formData.opportunityId}
                          onChange={handleInputChange}
                          required
                          className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#4c739a] p-[15px] text-base font-normal leading-normal"
                        >
                          <option value="">Search for a client...</option>
                          {opportunities.map((opportunity) => (
                            <option key={opportunity.id} value={opportunity.id}>
                              {opportunity.title} - {opportunity.client_name || opportunity.client?.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#0d141b] dark:text-slate-200 text-base font-medium leading-normal pb-2">
                          Contract Title
                        </p>
                        <input
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#4c739a] p-[15px] text-base font-normal leading-normal"
                          placeholder="e.g. Q4 Financial Audit"
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#0d141b] dark:text-slate-200 text-base font-medium leading-normal pb-2">
                          Start Date
                        </p>
                        <input
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#4c739a] p-[15px] text-base font-normal leading-normal"
                        />
                      </label>
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#0d141b] dark:text-slate-200 text-base font-medium leading-normal pb-2">
                          End Date
                        </p>
                        <input
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#4c739a] p-[15px] text-base font-normal leading-normal"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="flex flex-col">
                        <p className="text-[#0d141b] dark:text-slate-200 text-base font-medium leading-normal pb-2">
                          Contract Description
                        </p>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="form-textarea w-full resize-y rounded-lg text-[#0d141b] dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary placeholder:text-[#4c739a] p-[15px] text-base font-normal leading-normal"
                          placeholder="Add a brief description of the contract's purpose..."
                          rows={4}
                        ></textarea>
                      </label>
                    </div>

                    {/* Template Selection - NEW */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Contract Template
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Select a template that will be used to generate the contract document. The template includes pre-configured sections for policies, legal terms, and timeline conditions.
                      </p>
                      <label className="flex flex-col">
                        <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                          Select Template
                        </p>
                        <select
                          name="selectedTemplateId"
                          value={formData.selectedTemplateId}
                          onChange={handleInputChange}
                          className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                        >
                          <option value="">No template (manual configuration)</option>
                          {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      {formData.selectedTemplateId && templates.find(t => t.id === formData.selectedTemplateId) && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {templates.find(t => t.id === formData.selectedTemplateId)?.title}
                          </p>
                          {templates.find(t => t.id === formData.selectedTemplateId)?.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {templates.find(t => t.id === formData.selectedTemplateId)?.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white">
                      Terms & Scope
                    </h2>
                    {/* ISO Standards */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ISO Standards
                      </label>
                      <div className="flex gap-2 mb-3">
                        <select
                          value={selectedStandardId}
                          onChange={(e) => setSelectedStandardId(e.target.value)}
                          className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#4c739a] p-[15px] text-base font-normal leading-normal"
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
                          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
                        >
                          Add
                        </button>
                      </div>

                      {/* Selected Standards */}
                      {formData.isoStandards.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Selected Standards:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {formData.isoStandards.map((standardCode, index) => {
                              const standardInfo = isoStandards.find(
                                (s) => s.code === standardCode
                              );
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
                    </div>

                    {/* Scope of Work */}
                    <div>
                      <label className="flex flex-col">
                        <p className="text-[#0d141b] dark:text-slate-200 text-base font-medium leading-normal pb-2">
                          Scope of Work
                        </p>
                        <textarea
                          name="scopeOfWork"
                          value={formData.scopeOfWork}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Describe the detailed scope of certification work..."
                          className="form-textarea w-full resize-y rounded-lg text-[#0d141b] dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary placeholder:text-[#4c739a] p-[15px] text-base font-normal leading-normal"
                        ></textarea>
                      </label>
                    </div>

                    {/* Audit Process */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                      {/* ... (content of Audit Process) ... */}
                    </div>

                    {/* Timeline & Certification Conditions */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Timeline & Certification Conditions
                      </h2>
                      {/* ... content of timeline ... */}
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
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white">
                      Billing
                    </h2>
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
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white">
                      Preview
                    </h2>
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Contract Summary
                      </h3>
                      <div className="space-y-4">
                        <p><strong>Client:</strong> {formData.clientOrganization}</p>
                        <p><strong>Title:</strong> {formData.title}</p>
                        <p><strong>Dates:</strong> {formData.startDate} to {formData.endDate}</p>
                        <p><strong>Scope:</strong> {formData.scopeOfWork}</p>
                        <p><strong>Value:</strong> {formData.contractValue} {formData.currency}</p>
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
                  </div>
                )}
              </form>
            </div>
          </div>
          {/* Summary Panel */}
          <aside className="w-full">
            <div className="sticky top-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-[#0d141b] dark:text-white pb-4 border-b border-slate-200 dark:border-slate-700">
                Contract Summary
              </h3>
              <div className="space-y-5 py-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Client
                    </p>
                    <p className="text-base font-medium text-[#0d141b] dark:text-white">
                      {formData.clientOrganization || "Not Selected"}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-primary text-sm font-bold"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Title
                    </p>
                    <p className="text-base font-medium text-[#0d141b] dark:text-white">
                      {formData.title || "Not Set"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    .                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 -                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Dates
                    </p>
                    <p className="text-base font-medium text-[#0d141b] dark:text-white">
                      {formData.startDate} - {formData.endDate || "(Not Set)"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Terms
                    </p>
                    <p className="text-base font-medium text-slate-400 dark:text-slate-500">
                      Pending
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Billing
                    </p>
                    <p className="text-base font-medium text-slate-400 dark:text-slate-500">
                      Pending
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary/10 text-primary dark:bg-primary/20 text-base font-bold leading-normal tracking-[0.015em] gap-2"
                >
                  <span className="material-symbols-outlined text-2xl">
                    visibility
                  </span>
                  <span className="truncate">Preview Contract</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
