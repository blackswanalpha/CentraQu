'use client';

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { useState, useEffect, use } from "react";
import { contractService, Contract } from "@/services/contract.service";
import { auditService, type ISOStandard } from "@/services/audit.service";
import { useRouter } from "next/navigation";

export default function EditContractPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [contract, setContract] = useState<Contract | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState("basic");
    const [isoStandards, setIsoStandards] = useState<ISOStandard[]>([]);
    const [selectedStandardId, setSelectedStandardId] = useState("");

    // Form state
    const [formData, setFormData] = useState<Partial<Contract>>({});

    useEffect(() => {
        fetchContract();
    }, [id]);

    const fetchContract = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch contract and ISO standards in parallel
            const [contractData, standardsResponse] = await Promise.all([
                contractService.getContract(id),
                auditService.getISOStandards().catch(() => ({ results: [] }))
            ]);
            
            setContract(contractData);
            setFormData(contractData);
            setIsoStandards(standardsResponse.results || []);
        } catch (err) {
            console.error('Error fetching contract:', err);
            setError('Failed to load contract details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof Contract, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddStandard = () => {
        if (selectedStandardId) {
            const selectedStandard = isoStandards.find(s => s.id.toString() === selectedStandardId);
            if (selectedStandard) {
                const currentStandards = formData.iso_standards || [];
                if (!currentStandards.includes(selectedStandard.code)) {
                    handleInputChange('iso_standards', [...currentStandards, selectedStandard.code]);
                }
                setSelectedStandardId("");
            }
        }
    };

    const handleRemoveStandard = (index: number) => {
        const currentStandards = formData.iso_standards || [];
        handleInputChange('iso_standards', currentStandards.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!contract) return;

        setIsSaving(true);
        setError(null);

        try {
            // Prepare update data with required fields
            const updateData = {
                ...formData,
                // REQUIRED: opportunity_id must always be included for updates
                opportunity_id: contract.opportunity || formData.opportunity,
                // Include contract_file only if it exists (let backend handle default)
                ...(formData.contract_file && { contract_file: formData.contract_file })
            };

            // Log the data being sent for debugging
            console.log('Sending update data:', {
                ...updateData,
                contract_file: updateData.contract_file ? 'FILE_PRESENT' : 'NULL'
            });

            await contractService.updateContract(id, updateData);
            alert('Contract updated successfully!');
            router.push(`/business-development/contracts/${id}`);
        } catch (err) {
            console.error('Error updating contract:', err);
            setError('Failed to update contract. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        { id: "basic", label: "Basic Information", icon: "📄" },
        { id: "client", label: "Client Details", icon: "👤" },
        { id: "certification", label: "Certification", icon: "✓" },
        { id: "audit", label: "Audit Process", icon: "🔍" },
        { id: "financial", label: "Financial", icon: "💰" },
        { id: "legal", label: "Legal & Terms", icon: "⚖️" },
        { id: "signatures", label: "Signatures", icon: "✍️" },
    ];

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading contract...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error && !contract) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button
                        onClick={() => router.push('/business-development/contracts')}
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Edit Contract
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {contract?.contract_number} - {contract?.client_organization}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push(`/business-development/contracts/${id}`)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

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
                                    <span className="text-lg">{section.icon}</span>
                                    <span>{section.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="col-span-9">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

                            {/* Basic Information Section */}
                            {activeSection === "basic" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Basic Information
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Contract Number
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.contract_number || ''}
                                                disabled
                                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Auto-generated, cannot be edited</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Contract Type
                                            </label>
                                            <select
                                                value={formData.contract_type || ''}
                                                onChange={(e) => handleInputChange('contract_type', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            >
                                                <option value="CERTIFICATION">Certification</option>
                                                <option value="SURVEILLANCE">Surveillance</option>
                                                <option value="RECERTIFICATION">Recertification</option>
                                                <option value="TRANSFER">Transfer</option>
                                            </select>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title || ''}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter contract title"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description || ''}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter contract description"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.start_date || ''}
                                                onChange={(e) => handleInputChange('start_date', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.end_date || ''}
                                                onChange={(e) => handleInputChange('end_date', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Agreement Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.agreement_date || ''}
                                                onChange={(e) => handleInputChange('agreement_date', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={formData.status || ''}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            >
                                                <option value="DRAFT">Draft</option>
                                                <option value="UNDER_REVIEW">Under Review</option>
                                                <option value="PENDING_SIGNATURE">Pending Signature</option>
                                                <option value="ACTIVE">Active</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="TERMINATED">Terminated</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Duration (Months)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.duration_months || ''}
                                                onChange={(e) => handleInputChange('duration_months', parseInt(e.target.value))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="36"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Certification Cycle (Years)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.certification_cycle_years || ''}
                                                onChange={(e) => handleInputChange('certification_cycle_years', parseInt(e.target.value))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Client Details Section */}
                            {activeSection === "client" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Client Details
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Organization Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.client_organization || ''}
                                                onChange={(e) => handleInputChange('client_organization', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter organization name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Contact Person
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.client_contact_person || ''}
                                                onChange={(e) => handleInputChange('client_contact_person', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter contact person name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Telephone
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.client_telephone || ''}
                                                onChange={(e) => handleInputChange('client_telephone', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="+254 700 000 000"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Primary Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.client_email || ''}
                                                onChange={(e) => handleInputChange('client_email', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="client@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Secondary Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.client_secondary_email || ''}
                                                onChange={(e) => handleInputChange('client_secondary_email', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="secondary@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.client_website || ''}
                                                onChange={(e) => handleInputChange('client_website', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="https://example.com"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Address
                                            </label>
                                            <textarea
                                                value={formData.client_address || ''}
                                                onChange={(e) => handleInputChange('client_address', e.target.value)}
                                                rows={3}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter full address"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Site(s) Covered
                                            </label>
                                            <textarea
                                                value={formData.site_covered || ''}
                                                onChange={(e) => handleInputChange('site_covered', e.target.value)}
                                                rows={3}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter sites covered by this contract"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Certification Section */}
                            {activeSection === "certification" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Certification Details
                                    </h2>

                                    <div className="space-y-4">
                                        {/* ISO Standards with Dropdown */}
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
                                                    <option value="">Select an ISO standard to add</option>
                                                    {isoStandards.map((standard) => (
                                                        <option 
                                                            key={standard.id} 
                                                            value={standard.id}
                                                            disabled={formData.iso_standards?.includes(standard.code)}
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
                                            {formData.iso_standards && formData.iso_standards.length > 0 && (
                                                <div className="mb-3">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected Standards:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.iso_standards.map((standardCode, index) => {
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

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Scope of Work
                                            </label>
                                            <textarea
                                                value={formData.scope_of_work || ''}
                                                onChange={(e) => handleInputChange('scope_of_work', e.target.value)}
                                                rows={6}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Describe the scope of certification work..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Certificate Validity (Years)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.certificate_validity_years || ''}
                                                    onChange={(e) => handleInputChange('certificate_validity_years', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="3"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Certificate Issue Days
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.certificate_issue_days || ''}
                                                    onChange={(e) => handleInputChange('certificate_issue_days', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Audit Process Section */}
                            {activeSection === "audit" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Audit Process
                                    </h2>

                                    {/* Stage I Audit */}
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Stage I Audit
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Duration (Days)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.stage_1_audit_days || ''}
                                                    onChange={(e) => handleInputChange('stage_1_audit_days', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="2"
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.stage_1_remote_allowed || false}
                                                        onChange={(e) => handleInputChange('stage_1_remote_allowed', e.target.checked)}
                                                        className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Remote Allowed
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={formData.stage_1_audit_description || ''}
                                                    onChange={(e) => handleInputChange('stage_1_audit_description', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Describe Stage I audit process..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stage II Audit */}
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Stage II Audit
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Duration (Days)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.stage_2_audit_days || ''}
                                                    onChange={(e) => handleInputChange('stage_2_audit_days', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="3"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Max Gap from Stage I (Days)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.stage_1_stage_2_max_gap_days || ''}
                                                    onChange={(e) => handleInputChange('stage_1_stage_2_max_gap_days', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="90"
                                                />
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={formData.stage_2_audit_description || ''}
                                                    onChange={(e) => handleInputChange('stage_2_audit_description', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Describe Stage II audit process..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Surveillance Audits */}
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Surveillance Audits
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Frequency
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.surveillance_audit_frequency || ''}
                                                    onChange={(e) => handleInputChange('surveillance_audit_frequency', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Annually"
                                                />
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={formData.surveillance_audit_description || ''}
                                                    onChange={(e) => handleInputChange('surveillance_audit_description', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Describe surveillance audit process..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recertification */}
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Recertification Audit
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Timing
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.recertification_audit_timing || ''}
                                                    onChange={(e) => handleInputChange('recertification_audit_timing', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Before certificate expiry"
                                                />
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={formData.recertification_audit_description || ''}
                                                    onChange={(e) => handleInputChange('recertification_audit_description', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Describe recertification audit process..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            NC Closure Max Days
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.nc_closure_max_days || ''}
                                            onChange={(e) => handleInputChange('nc_closure_max_days', parseInt(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            placeholder="90"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Financial Section */}
                            {activeSection === "financial" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Financial Terms
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Currency
                                            </label>
                                            <select
                                                value={formData.currency || 'KES'}
                                                onChange={(e) => handleInputChange('currency', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            >
                                                <option value="KES">KES</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Total Contract Value
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.contract_value || ''}
                                                onChange={(e) => handleInputChange('contract_value', parseFloat(e.target.value))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Year 1 Fee (per standard)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.fee_per_standard_year_1 || ''}
                                                onChange={(e) => handleInputChange('fee_per_standard_year_1', parseFloat(e.target.value))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Year 2 Fee (per standard)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.fee_per_standard_year_2 || ''}
                                                onChange={(e) => handleInputChange('fee_per_standard_year_2', parseFloat(e.target.value))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Year 3 Fee (per standard)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.fee_per_standard_year_3 || ''}
                                                onChange={(e) => handleInputChange('fee_per_standard_year_3', parseFloat(e.target.value))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Payment Schedule
                                            </label>
                                            <textarea
                                                value={formData.payment_schedule || ''}
                                                onChange={(e) => handleInputChange('payment_schedule', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Describe payment schedule and terms..."
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Additional Fees Description
                                            </label>
                                            <textarea
                                                value={formData.additional_fees_description || ''}
                                                onChange={(e) => handleInputChange('additional_fees_description', e.target.value)}
                                                rows={3}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Describe any additional fees..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Recertification Fee
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.recertification_fee || ''}
                                                onChange={(e) => handleInputChange('recertification_fee', parseFloat(e.target.value))}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="0.00"
                                                step="0.01"
                                                disabled={formData.recertification_fee_tbd}
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.recertification_fee_tbd || false}
                                                    onChange={(e) => handleInputChange('recertification_fee_tbd', e.target.checked)}
                                                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    To Be Determined
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Legal & Terms Section */}
                            {activeSection === "legal" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Legal & Terms
                                    </h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Confidentiality Clause
                                            </label>
                                            <textarea
                                                value={formData.confidentiality_clause || ''}
                                                onChange={(e) => handleInputChange('confidentiality_clause', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter confidentiality terms..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Data Protection Compliance
                                            </label>
                                            <textarea
                                                value={formData.data_protection_compliance || ''}
                                                onChange={(e) => handleInputChange('data_protection_compliance', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter data protection terms..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Entire Agreement Clause
                                            </label>
                                            <textarea
                                                value={formData.entire_agreement_clause || ''}
                                                onChange={(e) => handleInputChange('entire_agreement_clause', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter entire agreement clause..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Cancellation Notice (Days)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.cancellation_notice_days || ''}
                                                    onChange={(e) => handleInputChange('cancellation_notice_days', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="10"
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.cancellation_fee_applies || false}
                                                        onChange={(e) => handleInputChange('cancellation_fee_applies', e.target.checked)}
                                                        className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Cancellation Fee Applies
                                                    </span>
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Termination Notice (Days)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.termination_notice_days || ''}
                                                    onChange={(e) => handleInputChange('termination_notice_days', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="30"
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.termination_fee_waiver || false}
                                                        onChange={(e) => handleInputChange('termination_fee_waiver', e.target.checked)}
                                                        className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Termination Fee Waiver
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.auto_renewal || false}
                                                        onChange={(e) => handleInputChange('auto_renewal', e.target.checked)}
                                                        className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Auto Renewal
                                                    </span>
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Renewal Notice (Days)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.renewal_notice_days || ''}
                                                    onChange={(e) => handleInputChange('renewal_notice_days', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="60"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Client Responsibilities (one per line)
                                            </label>
                                            <textarea
                                                value={formData.client_responsibilities?.join('\n') || ''}
                                                onChange={(e) => handleInputChange('client_responsibilities', e.target.value.split('\n').filter(s => s.trim()))}
                                                rows={6}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                placeholder="Enter each responsibility on a new line..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Signatures Section */}
                            {activeSection === "signatures" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Signatures
                                    </h2>

                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Client Signature
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Signed By (Name)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.signed_by_client_name || ''}
                                                    onChange={(e) => handleInputChange('signed_by_client_name', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Enter name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Position
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.signed_by_client_position || ''}
                                                    onChange={(e) => handleInputChange('signed_by_client_position', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Enter position"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Signature Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.client_signed_date || ''}
                                                    onChange={(e) => handleInputChange('client_signed_date', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Company Signature
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Signed By (Name)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.signed_by_company_name || ''}
                                                    onChange={(e) => handleInputChange('signed_by_company_name', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Enter name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Position
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.signed_by_company_position || ''}
                                                    onChange={(e) => handleInputChange('signed_by_company_position', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Enter position"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Signature Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.company_signed_date || ''}
                                                    onChange={(e) => handleInputChange('company_signed_date', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Bottom Action Buttons */}
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => router.push(`/business-development/contracts/${id}`)}
                                className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="rounded-lg bg-primary px-8 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
