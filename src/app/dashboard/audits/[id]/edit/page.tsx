"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auditService, Audit } from "@/services/audit.service";
import { Save, ArrowLeft, Calendar, Users, FileText, AlertTriangle } from "lucide-react";

interface EditFormData {
  title: string;
  description: string;
  scope: string;
  objectives: string[];
  deliverables: string[];
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date: string;
  actual_end_date: string;
  status: string;
  lead_auditor: number | null;
  client: number;
  iso_standard: number;
  audit_type: string;
}

export default function EditAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EditFormData>({
    title: "",
    description: "",
    scope: "",
    objectives: [],
    deliverables: [],
    planned_start_date: "",
    planned_end_date: "",
    actual_start_date: "",
    actual_end_date: "",
    status: "scheduled",
    lead_auditor: null,
    client: 0,
    iso_standard: 0,
    audit_type: "stage-1"
  });

  const [clients, setClients] = useState<any[]>([]);
  const [isoStandards, setIsoStandards] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch audit data
        const auditData = await auditService.getAudit(resolvedParams.id);
        setAudit(auditData);
        
        // Set form data with audit data
        setFormData({
          title: auditData.title || "",
          description: auditData.description || "",
          scope: auditData.scope || "",
          objectives: auditData.objectives || [],
          deliverables: auditData.deliverables || [],
          planned_start_date: auditData.planned_start_date?.split('T')[0] || "",
          planned_end_date: auditData.planned_end_date?.split('T')[0] || "",
          actual_start_date: auditData.actual_start_date?.split('T')[0] || "",
          actual_end_date: auditData.actual_end_date?.split('T')[0] || "",
          status: auditData.status || "scheduled",
          lead_auditor: auditData.lead_auditor || null,
          client: auditData.client || 0,
          iso_standard: auditData.iso_standard || 0,
          audit_type: auditData.audit_type || "stage-1"
        });

        // Fetch supporting data
        const [clientsRes, isoRes, employeesRes] = await Promise.all([
          fetch('/api/clients').then(res => res.ok ? res.json() : []),
          auditService.getISOStandards(),
          fetch('/api/employees').then(res => res.ok ? res.json() : [])
        ]);

        setClients(clientsRes.results || []);
        setIsoStandards(isoRes.results || []);
        setEmployees(employeesRes.results || []);

      } catch (error) {
        console.error('Error fetching audit:', error);
        setError('Failed to load audit data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleInputChange = (field: keyof EditFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field: 'objectives' | 'deliverables', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field: 'objectives' | 'deliverables', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const updateData = {
        ...formData,
        objectives: formData.objectives.length > 0 ? formData.objectives : undefined,
        deliverables: formData.deliverables.length > 0 ? formData.deliverables : undefined,
        planned_start_date: formData.planned_start_date || undefined,
        planned_end_date: formData.planned_end_date || undefined,
        actual_start_date: formData.actual_start_date || undefined,
        actual_end_date: formData.actual_end_date || undefined
      };

      await auditService.updateAudit(resolvedParams.id, updateData);
      
      // Redirect back to audit details
      router.push(`/dashboard/audits/${resolvedParams.id}`);
      
    } catch (error) {
      console.error('Error saving audit:', error);
      setError('Failed to save audit changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading audit data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button
              onClick={() => router.back()}
              variant="secondary"
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="secondary"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Audit
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {audit?.audit_number} - {audit?.client_name}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => router.back()}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="min-w-[120px]"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <WidgetCard title="Basic Information" icon={<FileText className="h-5 w-5" />}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audit Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter audit title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter audit description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scope
                  </label>
                  <textarea
                    value={formData.scope}
                    onChange={(e) => handleInputChange('scope', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter audit scope"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Audit Type
                    </label>
                    <select
                      value={formData.audit_type}
                      onChange={(e) => handleInputChange('audit_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="stage-1">Stage 1</option>
                      <option value="stage-2">Stage 2</option>
                      <option value="certification">Certification</option>
                      <option value="surveillance">Surveillance</option>
                      <option value="1st surveillance">1st Surveillance</option>
                      <option value="2nd surveillance">2nd Surveillance</option>
                      <option value="recertification">Recertification</option>
                      <option value="gap-analysis">Gap Analysis</option>
                      <option value="follow-up">Follow-up</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </WidgetCard>

            {/* Objectives & Deliverables */}
            <WidgetCard title="Objectives & Deliverables">
              <div className="space-y-6">
                {/* Objectives */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audit Objectives
                  </label>
                  <div className="space-y-2">
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => {
                            const newObjectives = [...formData.objectives];
                            newObjectives[index] = e.target.value;
                            handleInputChange('objectives', newObjectives);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <Button
                          onClick={() => handleArrayRemove('objectives', index)}
                          variant="secondary"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => handleArrayAdd('objectives', 'New objective')}
                      variant="secondary"
                      size="sm"
                    >
                      Add Objective
                    </Button>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deliverables
                  </label>
                  <div className="space-y-2">
                    {formData.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={deliverable}
                          onChange={(e) => {
                            const newDeliverables = [...formData.deliverables];
                            newDeliverables[index] = e.target.value;
                            handleInputChange('deliverables', newDeliverables);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <Button
                          onClick={() => handleArrayRemove('deliverables', index)}
                          variant="secondary"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => handleArrayAdd('deliverables', 'New deliverable')}
                      variant="secondary"
                      size="sm"
                    >
                      Add Deliverable
                    </Button>
                  </div>
                </div>
              </div>
            </WidgetCard>

            {/* Schedule */}
            <WidgetCard title="Schedule" icon={<Calendar className="h-5 w-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Planned Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.planned_start_date}
                    onChange={(e) => handleInputChange('planned_start_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Planned End Date
                  </label>
                  <input
                    type="date"
                    value={formData.planned_end_date}
                    onChange={(e) => handleInputChange('planned_end_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Actual Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.actual_start_date}
                    onChange={(e) => handleInputChange('actual_start_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Actual End Date
                  </label>
                  <input
                    type="date"
                    value={formData.actual_end_date}
                    onChange={(e) => handleInputChange('actual_end_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </WidgetCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment */}
            <WidgetCard title="Assignment" icon={<Users className="h-5 w-5" />}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client
                  </label>
                  <select
                    value={formData.client}
                    onChange={(e) => handleInputChange('client', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.company_name || client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ISO Standard
                  </label>
                  <select
                    value={formData.iso_standard}
                    onChange={(e) => handleInputChange('iso_standard', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select ISO Standard</option>
                    {isoStandards.map((standard) => (
                      <option key={standard.id} value={standard.id}>
                        {standard.code} - {standard.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lead Auditor
                  </label>
                  <select
                    value={formData.lead_auditor || ''}
                    onChange={(e) => handleInputChange('lead_auditor', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Lead Auditor</option>
                    {employees.filter(emp => emp.role?.includes('auditor')).map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </WidgetCard>

            {/* Quick Actions */}
            <WidgetCard title="Quick Actions">
              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/dashboard/audits/${resolvedParams.id}`)}
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Audit Details
                </Button>
                <Button
                  onClick={() => router.push(`/dashboard/audits/${resolvedParams.id}/checklist`)}
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Checklist
                </Button>
                <Button
                  onClick={() => router.push(`/dashboard/audits/${resolvedParams.id}/report`)}
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </WidgetCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}