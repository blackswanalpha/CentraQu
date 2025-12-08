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
  scopeOfCertification: string;
  objectives: string;
  templateCategory: 'CONTRACT_AGREEMENT_DEFAULT' | 'RENEWAL_CONTRACT_AGREEMENT_DEFAULT' | 'CUSTOM';

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
  standardFees: Record<string, { year1: string; year2: string; year3: string }>;
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
  const [selectedStandardForFees, setSelectedStandardForFees] = useState("");
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
    scopeOfCertification: "",
    objectives: "",
    templateCategory: "CONTRACT_AGREEMENT_DEFAULT",

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
    standardFees: {},
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
      // Map opportunity service_type to valid contract_type
      // Opportunity uses: ISO_CERTIFICATION, CONSULTING, TRAINING, AUDIT, COMPLIANCE, RISK_ASSESSMENT
      // Contract uses: SERVICE, CONSULTING, CERTIFICATION, TRAINING, MAINTENANCE
      const mapServiceType = (oppServiceType: string | undefined): ContractFormData['serviceType'] => {
        const mapping: Record<string, ContractFormData['serviceType']> = {
          'ISO_CERTIFICATION': 'CERTIFICATION',
          'CONSULTING': 'CONSULTING',
          'TRAINING': 'TRAINING',
          'AUDIT': 'SERVICE',
          'COMPLIANCE': 'SERVICE',
          'RISK_ASSESSMENT': 'CONSULTING',
        };
        return mapping[oppServiceType || ''] || 'CERTIFICATION';
      };

      const mappedServiceType = mapServiceType(selectedOpportunity.service_type);

      const serviceTypeLabel = mappedServiceType === 'CERTIFICATION' ? 'Certification Agreement' :
        mappedServiceType === 'CONSULTING' ? 'Consulting Agreement' :
          mappedServiceType === 'SERVICE' ? 'Service Agreement' :
            mappedServiceType === 'TRAINING' ? 'Training Agreement' :
              mappedServiceType === 'MAINTENANCE' ? 'Maintenance Agreement' : 'Agreement';

      const suggestedTitle = `${selectedOpportunity.client_name || selectedOpportunity.client?.name} - ${serviceTypeLabel}`;

      // Get client data from opportunity - auto-fill required fields
      const client = selectedOpportunity.client;
      const clientName = selectedOpportunity.client_name || client?.name || '';
      const clientEmail = client?.email || `contact@example.com`;
      const clientAddress = client?.address || `${clientName} - Address to be provided`;
      const siteCovered = client?.address || clientName || 'Site to be confirmed';

      setFormData((prev) => ({
        ...prev,
        opportunityId: value,
        clientOrganization: clientName,
        clientContactPerson: client?.contact_person || clientName,
        clientEmail: clientEmail,
        clientAddress: clientAddress,
        clientTelephone: client?.phone || '',
        clientWebsite: client?.website || '',
        siteCovered: siteCovered,
        description: selectedOpportunity.description || '',
        contractValue: selectedOpportunity.estimated_value?.toString() || '',
        title: prev.title || suggestedTitle,
        currency: selectedOpportunity.currency || prev.currency,
        serviceType: mappedServiceType,
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

  // Initialize standard fees when standards change
  useEffect(() => {
    if (formData.isoStandards.length > 0) {
      setFormData(prev => {
        const newFees = { ...prev.standardFees };
        let hasChanges = false;

        // Add missing standards
        formData.isoStandards.forEach(std => {
          if (!newFees[std]) {
            newFees[std] = {
              year1: prev.feePerStandardYear1 || '1000',
              year2: prev.feePerStandardYear2 || '1000',
              year3: prev.feePerStandardYear3 || '1000'
            };
            hasChanges = true;
          }
        });

        return hasChanges ? { ...prev, standardFees: newFees } : prev;
      });

      if (!selectedStandardForFees && formData.isoStandards.length > 0) {
        setSelectedStandardForFees(formData.isoStandards[0]);
      }
    }
  }, [formData.isoStandards, selectedStandardForFees]);

  const handleStandardFeeChange = (standard: string, year: 'year1' | 'year2' | 'year3', value: string) => {
    setFormData(prev => ({
      ...prev,
      standardFees: {
        ...prev.standardFees,
        [standard]: {
          ...prev.standardFees[standard] || { year1: '0', year2: '0', year3: '0' },
          [year]: value
        }
      }
    }));
  };

  const calculateTotalContractValue = () => {
    let total = 0;

    // Sum up fees for all standards
    formData.isoStandards.forEach(std => {
      const fees = formData.standardFees[std];
      const year1 = fees ? parseFloat(fees.year1 || '0') : parseFloat(formData.feePerStandardYear1 || '0');
      const year2 = fees ? parseFloat(fees.year2 || '0') : parseFloat(formData.feePerStandardYear2 || '0');
      const year3 = fees ? parseFloat(fees.year3 || '0') : parseFloat(formData.feePerStandardYear3 || '0');

      total += (isNaN(year1) ? 0 : year1);
      total += (isNaN(year2) ? 0 : year2);
      total += (isNaN(year3) ? 0 : year3);
    });

    if (!formData.recertificationFeeTbd && formData.recertificationFee) {
      const recert = parseFloat(formData.recertificationFee);
      total += (isNaN(recert) ? 0 : recert);
    }

    return total.toFixed(2);
  };

  // Update contract value when fees change
  useEffect(() => {
    const total = calculateTotalContractValue();
    setFormData(prev => ({ ...prev, contractValue: total }));
  }, [formData.standardFees, formData.isoStandards, formData.recertificationFee, formData.recertificationFeeTbd]);

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
        contract_template_id: formData.selectedTemplateId ? parseInt(formData.selectedTemplateId) : undefined,
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
        scope_of_certification: formData.scopeOfCertification,
        objectives: formData.objectives,

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
        standard_fees: formData.standardFees,
        recertification_fee_tbd: formData.recertificationFeeTbd,
        recertification_fee: formData.recertificationFee ? parseFloat(formData.recertificationFee) : undefined,
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

                    {/* Sites Covered Section */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Sites Covered
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Enter the physical locations/sites covered by this contract. This will appear in the contract document.
                      </p>
                      <label className="flex flex-col">
                        <p className="text-gray-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
                          Site Locations
                        </p>
                        <textarea
                          name="siteCovered"
                          value={formData.siteCovered}
                          onChange={handleInputChange}
                          placeholder="e.g., Head Office: 123 Main St, Nairobi&#10;Branch: 456 Industrial Area, Mombasa"
                          rows={3}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                        />
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        List all sites that will be audited under this contract. Each site should include address details.
                      </p>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white">
                      Terms & Scope
                    </h2>

                    {/* Template Category Selection */}
                    <div className="rounded-lg border border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10 p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contract Template Category
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Select a template category to generate a pre-configured agreement document.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, templateCategory: 'CONTRACT_AGREEMENT_DEFAULT' }))}
                          className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all ${formData.templateCategory === 'CONTRACT_AGREEMENT_DEFAULT'
                            ? 'border-primary bg-primary/10 dark:bg-primary/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                            }`}
                        >
                          <span className="font-medium text-gray-900 dark:text-white">Contract Agreement - Default</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Standard certification agreement for new clients
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, templateCategory: 'RENEWAL_CONTRACT_AGREEMENT_DEFAULT' }))}
                          className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all ${formData.templateCategory === 'RENEWAL_CONTRACT_AGREEMENT_DEFAULT'
                            ? 'border-primary bg-primary/10 dark:bg-primary/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                            }`}
                        >
                          <span className="font-medium text-gray-900 dark:text-white">Renewal Contract - Default</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Recertification agreement for existing clients
                          </span>
                        </button>
                      </div>
                    </div>

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

                    {/* Scope of Certification */}
                    <div>
                      <label className="flex flex-col">
                        <p className="text-[#0d141b] dark:text-slate-200 text-base font-medium leading-normal pb-2">
                          Scope of Certification
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 pb-2">
                          Define the boundaries, inclusions, and exclusions of the certification scope.
                        </p>
                        <textarea
                          name="scopeOfCertification"
                          value={formData.scopeOfCertification}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="e.g., Design, development, and manufacturing of electronic components at the main facility. Excluding: Warehouse operations and distribution services."
                          className="form-textarea w-full resize-y rounded-lg text-[#0d141b] dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary placeholder:text-[#4c739a] p-[15px] text-base font-normal leading-normal"
                        ></textarea>
                      </label>
                    </div>

                    {/* Objectives */}
                    <div>
                      <label className="flex flex-col">
                        <p className="text-[#0d141b] dark:text-slate-200 text-base font-medium leading-normal pb-2">
                          Contract Objectives
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 pb-2">
                          Define the key objectives and expected outcomes of this certification agreement.
                        </p>
                        <textarea
                          name="objectives"
                          value={formData.objectives}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="e.g., Achieve ISO 9001:2015 certification within 6 months of contract commencement. Improve quality management system maturity and customer satisfaction."
                          className="form-textarea w-full resize-y rounded-lg text-[#0d141b] dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary placeholder:text-[#4c739a] p-[15px] text-base font-normal leading-normal"
                        ></textarea>
                      </label>
                    </div>

                    {/* Audit Process */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                      {/* ... (content of Audit Process) ... */}
                    </div>



                    {/* Policies & Legal */}


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
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Fee Structure (Per Standard)
                      </h2>

                      {formData.isoStandards.length > 0 ? (
                        <div className="space-y-6">
                          {/* Fee Cards - One per Standard */}
                          {formData.isoStandards.map((standard, index) => (
                            <div
                              key={standard}
                              className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                              {/* Standard Header */}
                              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                    <span className="text-lg font-bold text-primary">{index + 1}</span>
                                  </div>
                                  <div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                      {standard}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      3-Year Certification Cycle
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Total for Standard</p>
                                  <p className="text-lg font-bold text-primary">
                                    {formData.currency} {(
                                      (parseFloat(formData.standardFees[standard]?.year1 || '0') +
                                        parseFloat(formData.standardFees[standard]?.year2 || '0') +
                                        parseFloat(formData.standardFees[standard]?.year3 || '0'))
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              {/* Year Fee Inputs */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Year 1 */}
                                <div className="space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Year 1 - Certification
                                  </label>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                                      {formData.currency}
                                    </span>
                                    <input
                                      type="number"
                                      value={formData.standardFees[standard]?.year1 || ''}
                                      onChange={(e) => handleStandardFeeChange(standard, 'year1', e.target.value)}
                                      className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2.5 text-sm font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>

                                {/* Year 2 */}
                                <div className="space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Year 2 - Surveillance
                                  </label>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                                      {formData.currency}
                                    </span>
                                    <input
                                      type="number"
                                      value={formData.standardFees[standard]?.year2 || ''}
                                      onChange={(e) => handleStandardFeeChange(standard, 'year2', e.target.value)}
                                      className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2.5 text-sm font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>

                                {/* Year 3 */}
                                <div className="space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Year 3 - Surveillance
                                  </label>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                                      {formData.currency}
                                    </span>
                                    <input
                                      type="number"
                                      value={formData.standardFees[standard]?.year3 || ''}
                                      onChange={(e) => handleStandardFeeChange(standard, 'year3', e.target.value)}
                                      className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2.5 text-sm font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Grand Total */}
                          <div className="mt-6 p-6 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl border-2 border-primary/30">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                  Three-Year Cycle Total
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  All {formData.isoStandards.length} standard{formData.isoStandards.length !== 1 ? 's' : ''} included
                                </p>
                              </div>
                              <p className="text-2xl font-black text-primary">
                                {formData.currency} {calculateTotalContractValue()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                          <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="mt-4 text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            No ISO standards selected
                          </p>
                          <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                            Please select ISO standards in Step 2 to configure fees.
                          </p>
                        </div>
                      )}
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

              {/* Bottom Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${currentStep === 1
                    ? "text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                    }`}
                >
                  Previous Step
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAndNext}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {currentStep < 4 ? "Next Step" : isLoading ? "Creating..." : "Create Contract"}
                </button>
              </div>
            </div>
            {/* Summary Panel */}
          </div>
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
      </div >
    </DashboardLayout >
  );
}
