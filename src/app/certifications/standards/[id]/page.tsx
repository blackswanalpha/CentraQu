"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { auditService, type AuditChecklist } from "@/services/audit.service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SearchableSelect } from "@/components/Dashboard/searchable-select";

export default function EditStandardPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [templates, setTemplates] = useState<AuditChecklist[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        default_template: "",
        is_active: true
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [standard, templatesResponse] = await Promise.all([
                auditService.getISOStandard(resolvedParams.id),
                auditService.getChecklists({ is_template: true })
            ]);

            setTemplates(templatesResponse.results || []);
            setFormData({
                name: standard.name,
                code: standard.code,
                description: standard.description,
                default_template: standard.default_template ? standard.default_template.toString() : "",
                is_active: standard.is_active
            });
        } catch (err) {
            console.error("Error loading data:", err);
            alert("Failed to load standard details");
            router.push("/certifications/standards");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await auditService.updateISOStandard(resolvedParams.id, {
                ...formData,
                default_template: formData.default_template ? parseInt(formData.default_template) : undefined
            });
            router.push("/certifications/standards");
        } catch (err) {
            console.error("Error updating standard:", err);
            alert("Failed to update standard");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading standard...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/certifications/standards">
                        <Button variant="secondary" size="sm">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-heading-1 font-bold text-dark dark:text-white">
                            Edit Standard
                        </h1>
                        <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
                            Update ISO standard details
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-8 space-y-6">
                    <FormInput
                        label="Standard Name"
                        type="text"
                        placeholder="e.g. Quality Management System"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <FormInput
                        label="ISO Number (Code)"
                        type="text"
                        placeholder="e.g. ISO 9001:2015"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                            Description
                        </label>
                        <textarea
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <SearchableSelect
                            label="Default Template"
                            options={templates.map(t => ({ value: t.id, label: t.title }))}
                            value={formData.default_template}
                            onChange={(value) => setFormData({ ...formData, default_template: value.toString() })}
                            placeholder="Select a template..."
                            hint="Select a default audit checklist template for this standard."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="is_active" className="text-sm text-dark dark:text-white">
                            Active
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/certifications/standards">
                            <Button variant="secondary" type="button">Cancel</Button>
                        </Link>
                        <Button variant="primary" type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
