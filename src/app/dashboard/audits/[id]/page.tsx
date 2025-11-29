"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Modal } from "@/components/Dashboard/modal";
import { Button } from "@/components/Dashboard/button";
import { ScopeObjectivesSection } from "@/components/Consulting/scope-objectives-section";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auditService } from "@/services/audit.service";

export default function AuditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "schedule" | "checklist" | "templates" | "findings" | "documents" | "reports" | "alerts" | "revenue"
  >("overview");

  const [audit, setAudit] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Template Modal State
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<number[]>([]);
  const [addingTemplate, setAddingTemplate] = useState(false);

  // Edit Schedule Modal State
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    planned_start_date: '',
    planned_end_date: '',
    actual_start_date: '',
    actual_end_date: ''
  });
  const [updatingSchedule, setUpdatingSchedule] = useState(false);

  // Findings Modal State
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [editingFinding, setEditingFinding] = useState<any>(null);
  const [findingData, setFindingData] = useState({
    finding_type: 'MINOR',
    clause_reference: '',
    description: '',
    evidence: '',
    requirement: '',
    status: 'OPEN'
  });
  const [savingFinding, setSavingFinding] = useState(false);
  const [deletingFindingId, setDeletingFindingId] = useState<number | null>(null);

  // Documents State
  const [documents, setDocuments] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    description: '',
    category: 'GENERAL'
  });
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(null);

  // Comments State
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  // Calculate audit progress based on checklist responses
  const calculateAuditProgress = (checklistResponses: any[]) => {
    if (!checklistResponses || checklistResponses.length === 0) {
      return {
        percentage: 0,
        compliant: 0,
        needsImprovement: 0,
        nonCompliant: 0,
        notApplicable: 0,
        pending: 0,
        total: 0,
        completed: 0
      };
    }

    const total = checklistResponses.length;
    const compliant = checklistResponses.filter((r: any) => r.compliance_status === 'compliant').length;
    const needsImprovement = checklistResponses.filter((r: any) => r.compliance_status === 'needs_improvement').length;
    const nonCompliant = checklistResponses.filter((r: any) => r.compliance_status === 'non_compliant').length;
    const notApplicable = checklistResponses.filter((r: any) => r.compliance_status === 'not_applicable').length;
    const pending = checklistResponses.filter((r: any) => r.compliance_status === 'pending').length;

    // Calculate completed items (everything except pending)
    const completed = compliant + needsImprovement + nonCompliant + notApplicable;

    // Calculate percentage based on completed items
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      percentage,
      compliant,
      needsImprovement,
      nonCompliant,
      notApplicable,
      pending,
      total,
      completed
    };
  };

  // Fetch audit data, findings, and checklist on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch audit details
        const auditData = await auditService.getAudit(resolvedParams.id);
        setAudit(auditData);

        // Check if audit is completed and redirect to certifications
        if (auditData.checklist_responses) {
          const progress = calculateAuditProgress(auditData.checklist_responses);
          if (progress.percentage === 100) {
            // Update audit status to completed if not already set
            if (auditData.status !== 'COMPLETED') {
              try {
                await auditService.updateAudit(resolvedParams.id, { status: 'COMPLETED' });
              } catch (err) {
                console.warn('Failed to update audit status to completed:', err);
              }
            }
            // Audit is 100% complete, redirect to certifications
            router.push(`/dashboard/audits/certifications?audit=${auditData.id}`);
            return;
          }
        }

        // Fetch findings for this audit
        const findingsData = await auditService.getFindings({ audit: parseInt(resolvedParams.id) });
        setFindings(findingsData.results || []);

        // Fetch documents for this audit
        const documentsData = await auditService.getDocuments(resolvedParams.id);
        setDocuments(documentsData || []);

        // Load comments for this audit
        loadComments();

        // Note: checklist data is now included in audit_template_data and checklist_responses
      } catch (err) {
        console.error('Error fetching audit data:', err);
        setError('Failed to load audit details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchData();
    }
  }, [resolvedParams.id]);

  // Fetch available templates when modal opens
  const handleOpenAddTemplateModal = async () => {
    try {
      const templates = await auditService.getChecklists({ is_template: true });
      setAvailableTemplates(templates.results || []);
      setShowAddTemplateModal(true);
    } catch (err) {
      console.error('Error fetching templates:', err);
      alert('Failed to load templates. Please try again.');
    }
  };

  // Handle template selection
  const handleTemplateToggle = (templateId: number) => {
    setSelectedTemplateIds(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  // Add selected templates to audit
  const handleAddTemplates = async () => {
    if (selectedTemplateIds.length === 0) {
      alert('Please select at least one template');
      return;
    }

    try {
      setAddingTemplate(true);

      // Get current template IDs
      const currentTemplateIds = audit.audit_templates || [];

      // Merge with new selections (avoid duplicates)
      const updatedTemplateIds = [...new Set([...currentTemplateIds, ...selectedTemplateIds])];

      // Update audit with new templates
      await auditService.updateAudit(audit.id, {
        audit_templates: updatedTemplateIds
      });

      // Refresh audit data
      const updatedAudit = await auditService.getAudit(resolvedParams.id);
      setAudit(updatedAudit);

      // Close modal and reset state
      setShowAddTemplateModal(false);
      setSelectedTemplateIds([]);

      alert('Templates added successfully!');
    } catch (err) {
      console.error('Error adding templates:', err);
      alert('Failed to add templates. Please try again.');
    } finally {
      setAddingTemplate(false);
    }
  };

  // Open edit schedule modal
  const handleOpenEditScheduleModal = () => {
    setScheduleData({
      planned_start_date: audit.planned_start_date || '',
      planned_end_date: audit.planned_end_date || '',
      actual_start_date: audit.actual_start_date || '',
      actual_end_date: audit.actual_end_date || ''
    });
    setShowEditScheduleModal(true);
  };

  // Update schedule
  const handleUpdateSchedule = async () => {
    try {
      setUpdatingSchedule(true);

      // Update audit schedule
      await auditService.updateAudit(audit.id, scheduleData);

      // Refresh audit data
      const updatedAudit = await auditService.getAudit(resolvedParams.id);
      setAudit(updatedAudit);

      // Close modal
      setShowEditScheduleModal(false);

      alert('Schedule updated successfully!');
    } catch (err) {
      console.error('Error updating schedule:', err);
      alert('Failed to update schedule. Please try again.');
    } finally {
      setUpdatingSchedule(false);
    }
  };

  // Open create finding modal
  const handleOpenCreateFindingModal = () => {
    setEditingFinding(null);
    setFindingData({
      finding_type: 'MINOR',
      clause_reference: '',
      description: '',
      evidence: '',
      requirement: '',
      status: 'OPEN'
    });
    setShowFindingModal(true);
  };

  // Open edit finding modal
  const handleOpenEditFindingModal = (finding: any) => {
    setEditingFinding(finding);
    setFindingData({
      finding_type: finding.finding_type,
      clause_reference: finding.clause_reference,
      description: finding.description,
      evidence: finding.evidence || '',
      requirement: finding.requirement || '',
      status: finding.status
    });
    setShowFindingModal(true);
  };

  // Save finding (create or update)
  const handleSaveFinding = async () => {
    if (!findingData.description || !findingData.clause_reference) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSavingFinding(true);

      const payload = {
        ...findingData,
        audit: audit.id
      };

      if (editingFinding) {
        // Update existing finding
        await auditService.updateFinding(editingFinding.id, payload);
      } else {
        // Generate finding number for new findings
        // Format: AUDIT_ID-FINDING_COUNT+1 (e.g., "5-001", "5-002")
        const findingNumber = `${audit.id}-${String(findings.length + 1).padStart(3, '0')}`;
        payload.finding_number = findingNumber;
        
        // Create new finding
        await auditService.createFinding(payload);
      }

      // Refresh findings
      const findingsData = await auditService.getFindings({ audit: parseInt(resolvedParams.id) });
      setFindings(findingsData.results || []);

      // Refresh audit data to update counts
      const updatedAudit = await auditService.getAudit(resolvedParams.id);
      setAudit(updatedAudit);

      // Close modal
      setShowFindingModal(false);

      alert(editingFinding ? 'Finding updated successfully!' : 'Finding created successfully!');
    } catch (err) {
      console.error('Error saving finding:', err);
      alert('Failed to save finding. Please try again.');
    } finally {
      setSavingFinding(false);
    }
  };

  // Delete finding
  const handleDeleteFinding = async (findingId: number) => {
    if (!confirm('Are you sure you want to delete this finding?')) {
      return;
    }

    try {
      setDeletingFindingId(findingId);

      await auditService.deleteFinding(findingId);

      // Refresh findings
      const findingsData = await auditService.getFindings({ audit: parseInt(resolvedParams.id) });
      setFindings(findingsData.results || []);

      // Refresh audit data to update counts
      const updatedAudit = await auditService.getAudit(resolvedParams.id);
      setAudit(updatedAudit);

      alert('Finding deleted successfully!');
    } catch (err) {
      console.error('Error deleting finding:', err);
      alert('Failed to delete finding. Please try again.');
    } finally {
      setDeletingFindingId(null);
    }
  };

  // Comments functions
  const loadComments = () => {
    // Load comments from localStorage for this audit
    const commentsKey = `audit_comments_${resolvedParams.id}`;
    const storedComments = localStorage.getItem(commentsKey);
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments));
      } catch (error) {
        console.error('Error parsing stored comments:', error);
        setComments([]);
      }
    } else {
      setComments([]);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setAddingComment(true);
      
      // Create new comment object
      const comment = {
        id: Date.now(), // Simple ID generation
        text: newComment.trim(),
        author: 'Current User', // In real app, this would come from auth context
        timestamp: new Date().toISOString(),
        avatar: 'U'
      };
      
      // Update comments list
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      
      // Save to localStorage
      const commentsKey = `audit_comments_${resolvedParams.id}`;
      localStorage.setItem(commentsKey, JSON.stringify(updatedComments));
      
      // Clear input
      setNewComment('');
      
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setAddingComment(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Open upload document modal
  const handleOpenUploadModal = () => {
    setSelectedFile(null);
    setUploadData({
      description: '',
      category: 'GENERAL'
    });
    setShowUploadModal(true);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload document
  const handleUploadDocument = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setUploadingDocument(true);

      await auditService.uploadDocument(audit.id, selectedFile, uploadData);

      // Refresh documents
      const documentsData = await auditService.getDocuments(resolvedParams.id);
      setDocuments(documentsData || []);

      // Close modal
      setShowUploadModal(false);

      alert('Document uploaded successfully!');
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingDocument(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      setDeletingDocumentId(documentId);

      await auditService.deleteDocument(documentId);

      // Refresh documents
      const documentsData = await auditService.getDocuments(resolvedParams.id);
      setDocuments(documentsData || []);

      alert('Document deleted successfully!');
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document. Please try again.');
    } finally {
      setDeletingDocumentId(null);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "schedule", label: "Schedule" },
    { id: "checklist", label: "Audit Report" },
    { id: "templates", label: "Templates" },
    { id: "findings", label: "Findings" },
    { id: "documents", label: "Documents" },
    { id: "revenue", label: "Revenue" },
    { id: "alerts", label: "Alerts" },
    { id: "reports", label: "Reports" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading audit details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !audit) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Failed to load audit details'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button className="text-primary hover:text-primary-hover mb-2">
              ← Back to Audits
            </button>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              {audit.audit_number || 'A-2025-005'}
            </h1>
            {/* Progress Badge below audit number */}
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                <span className="material-icons text-sm mr-1">trending_up</span>
                65% Complete
              </div>
              <div className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
                <span className="material-icons text-sm mr-1">schedule</span>
                On Schedule
              </div>
            </div>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              {audit.client_name} - {audit.iso_standard_name} {audit.audit_type}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push(`/dashboard/audits/${resolvedParams.id}/edit`)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
            >
              Edit
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Reschedule
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-3 ${
              audit.status === 'IN_PROGRESS' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
              audit.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
              audit.status === 'PLANNED' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
              'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                audit.status === 'IN_PROGRESS' ? 'bg-blue-600 dark:bg-blue-400' :
                audit.status === 'COMPLETED' ? 'bg-green-600 dark:bg-green-400' :
                audit.status === 'PLANNED' ? 'bg-gray-600 dark:bg-gray-400' :
                'bg-yellow-600 dark:bg-yellow-400'
              }`}></div>
              <p className="text-sm font-medium leading-normal">
                {audit.status === 'IN_PROGRESS' ? 'In Progress' :
                 audit.status === 'COMPLETED' ? 'Completed' :
                 audit.status === 'PLANNED' ? 'Planned' : audit.status}
              </p>
            </div>
            
            {/* Progress Badge */}
            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Progress: 65%
            </div>
          </div>

          {/* Scope & Objectives Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-dark dark:text-white mb-4">Scope & Objectives</h3>
            
            {/* Scope Description */}
            {audit.scope && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audit Scope</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {audit.scope}
                </p>
              </div>
            )}

            {/* Description/Objectives */}
            {audit.description && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audit Objectives</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {audit.description}
                </p>
              </div>
            )}

            {/* If no scope or description, show fallback content */}
            {!audit.scope && !audit.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This audit covers the assessment and verification of organizational processes and systems for compliance with {audit.iso_standard_name || 'applicable standards'}. The primary objectives are to evaluate effectiveness of implemented controls, ensure regulatory compliance, and identify opportunities for improvement.
              </p>
            )}
          </div>
          
          {/* Audit Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Lead Auditor</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {audit.lead_auditor_name || 'Eleanor Vance'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {audit.scope ? audit.scope.split(' ')[0] : 'Finance'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Start Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {audit.planned_start_date ? new Date(audit.planned_start_date).toLocaleDateString() : 'July 15, 2024'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">End Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {audit.planned_end_date ? new Date(audit.planned_end_date).toLocaleDateString() : 'Oct 10, 2024'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <div className="flex gap-4 md:gap-8 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as typeof activeTab)
                  }
                  className={`flex-shrink-0 px-3 md:px-4 py-3 font-medium border-b-2 transition-colors text-sm md:text-base whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* Audit Information */}
              <WidgetCard title="Audit Information">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Audit ID
                    </span>
                    <span className="font-medium">{audit.audit_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Type
                    </span>
                    <span className="font-medium">{audit.audit_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Standard
                    </span>
                    <span className="font-medium">{audit.iso_standard_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Scope
                    </span>
                    <span className="font-medium">{audit.scope ? audit.scope.substring(0, 20) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Duration
                    </span>
                    <span className="font-medium">
                      {audit.planned_start_date && audit.planned_end_date
                        ? `${Math.ceil((new Date(audit.planned_end_date).getTime() - new Date(audit.planned_start_date).getTime()) / (1000 * 60 * 60 * 24))} days`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </WidgetCard>

              {/* Client Information */}
              <WidgetCard title="Client Information">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Client
                    </p>
                    <p className="font-medium">{audit.client_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Contact
                    </p>
                    <p className="font-medium">{audit.client_data?.contact_person || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium">{audit.client_data?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-medium">{audit.client_data?.phone || 'N/A'}</p>
                  </div>
                </div>
              </WidgetCard>

              {/* Revenue Information */}
              <WidgetCard title="Revenue Information">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </span>
                    <span className="font-bold text-primary text-lg">{formatCurrency(audit.total_revenue || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Payment Status
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      audit.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : audit.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {audit.payment_status || 'N/A'}
                    </span>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Certification Breakdown:</p>
                    {audit.iso_standard_data ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{audit.iso_standard_name}</span>
                        <span className="font-medium">{formatCurrency(audit.total_revenue || 0)}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No certification data available</p>
                    )}
                  </div>
                </div>
              </WidgetCard>
            </div>

            {/* Scope & Objectives Section */}
            <div className="mt-6">
              <ScopeObjectivesSection 
                data={{
                  scope: audit.scope || '',
                  objectives: audit.objectives || [
                    'Assess compliance with ISO ' + (audit.iso_standard_name?.split(' ')[1] || 'standard') + ' requirements',
                    'Evaluate effectiveness of management system implementation',
                    'Identify opportunities for improvement',
                    'Verify corrective actions from previous audits',
                    'Ensure continuous improvement processes are in place'
                  ],
                  deliverables: audit.deliverables || [
                    'Audit report with findings and recommendations',
                    'Non-conformance reports for major and minor findings', 
                    'Certificate recommendation (if applicable)',
                    'Corrective action plan review',
                    'Management presentation summary'
                  ]
                }}
                showEdit={true}
                onEdit={() => console.log('Edit audit scope and objectives')}
              />
            </div>

            {/* Audit Team */}
            <WidgetCard title="Audit Team">
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <p className="font-medium text-dark dark:text-white">
                    👤 Lead Auditor: {audit.lead_auditor_name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {audit.iso_standard_name} Lead Auditor
                  </p>
                </div>
                {audit.auditors_data && audit.auditors_data.length > 0 ? (
                  audit.auditors_data.map((auditor: any, index: number) => (
                    <div key={index}>
                      <p className="font-medium text-dark dark:text-white">
                        👤 Auditor: {auditor.full_name || auditor.username}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Team member
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No additional auditors assigned</p>
                )}
              </div>
            </WidgetCard>

            {/* Audit Progress */}
            <WidgetCard title="Audit Progress">
              {(() => {
                const progress = calculateAuditProgress(audit.checklist_responses || []);
                return (
                  <div className="space-y-4">
                    {/* Overall Progress Bar */}
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Overall Progress</span>
                      <span className="text-lg font-bold text-primary">
                        {progress.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>

                    {/* Progress Details */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>{progress.completed} of {progress.total} items completed</p>
                    </div>

                    {/* Progress Breakdown */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-xs font-medium text-green-900 dark:text-green-300">✓ Compliant</p>
                        <p className="text-xl font-bold text-green-600">{progress.compliant}</p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-xs font-medium text-yellow-900 dark:text-yellow-300">⚠ Needs Improvement</p>
                        <p className="text-xl font-bold text-yellow-600">{progress.needsImprovement}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-xs font-medium text-red-900 dark:text-red-300">✗ Non-Compliant</p>
                        <p className="text-xl font-bold text-red-600">{progress.nonCompliant}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-300">○ Not Applicable</p>
                        <p className="text-xl font-bold text-blue-600">{progress.notApplicable}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-900 dark:text-gray-300">⏳ Pending</p>
                        <p className="text-xl font-bold text-gray-600">{progress.pending}</p>
                      </div>
                      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg border border-primary/30">
                        <p className="text-xs font-medium text-primary">📊 Total Items</p>
                        <p className="text-xl font-bold text-primary">{progress.total}</p>
                      </div>
                    </div>

                    {/* Audit Status and Dates */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                      <div>
                        <p className="font-medium mb-2">
                          Audit Status: <span className="text-primary">{audit.status}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Planned: {audit.planned_start_date ? new Date(audit.planned_start_date).toLocaleDateString() : 'N/A'} to {audit.planned_end_date ? new Date(audit.planned_end_date).toLocaleDateString() : 'N/A'}
                        </p>
                        {audit.actual_start_date && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Actual: {new Date(audit.actual_start_date).toLocaleDateString()} to {audit.actual_end_date ? new Date(audit.actual_end_date).toLocaleDateString() : 'In Progress'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </WidgetCard>

            {/* Findings */}
            <WidgetCard title="Findings & Observations">
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current Status: {findings.length} findings
                </p>
                {findings.length > 0 ? (
                  findings.slice(0, 5).map((finding: any) => {
                    const borderColor = finding.finding_type === 'MAJOR' ? 'border-red-500' :
                                       finding.finding_type === 'MINOR' ? 'border-yellow-500' : 'border-blue-500';
                    const icon = finding.finding_type === 'MAJOR' ? '🔴' :
                               finding.finding_type === 'MINOR' ? '🟡' : '🔵';

                    return (
                      <div key={finding.id} className={`border-l-4 ${borderColor} pl-4 py-2`}>
                        <p className="font-medium text-dark dark:text-white">
                          {icon} {finding.finding_type}: {finding.description}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Clause: {finding.clause_reference || 'N/A'}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No findings recorded</p>
                )}
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-6">
            {/* Audit Schedule */}
            <WidgetCard title="Audit Schedule">
              <div className="space-y-6">
                {/* Schedule Dates */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-dark dark:text-white">Schedule Information</h3>
                    <button
                      onClick={handleOpenEditScheduleModal}
                      className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover"
                    >
                      Edit Schedule
                    </button>
                  </div>

                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {/* Planned Dates */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">Planned Schedule</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                          <span className="font-medium">
                            {audit.planned_start_date ? new Date(audit.planned_start_date).toLocaleDateString() : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                          <span className="font-medium">
                            {audit.planned_end_date ? new Date(audit.planned_end_date).toLocaleDateString() : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="font-medium">
                            {audit.planned_start_date && audit.planned_end_date
                              ? `${Math.ceil((new Date(audit.planned_end_date).getTime() - new Date(audit.planned_start_date).getTime()) / (1000 * 60 * 60 * 24))} days`
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actual Dates */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">Actual Schedule</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                          <span className="font-medium">
                            {audit.actual_start_date ? new Date(audit.actual_start_date).toLocaleDateString() : 'Not started'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                          <span className="font-medium">
                            {audit.actual_end_date ? new Date(audit.actual_end_date).toLocaleDateString() : 'In progress'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="font-medium">
                            {audit.actual_start_date && audit.actual_end_date
                              ? `${Math.ceil((new Date(audit.actual_end_date).getTime() - new Date(audit.actual_start_date).getTime()) / (1000 * 60 * 60 * 24))} days`
                              : audit.actual_start_date
                              ? `${Math.ceil((new Date().getTime() - new Date(audit.actual_start_date).getTime()) / (1000 * 60 * 60 * 24))} days (ongoing)`
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Auditors */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="font-medium text-dark dark:text-white mb-4">Audit Team</h3>

                  {/* Lead Auditor */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lead Auditor</h4>
                    {audit.lead_auditor_data ? (
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                          {audit.lead_auditor_data.first_name?.[0]}{audit.lead_auditor_data.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-dark dark:text-white">
                            {audit.lead_auditor_data.full_name || audit.lead_auditor_data.username}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {audit.lead_auditor_data.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No lead auditor assigned</p>
                    )}
                  </div>

                  {/* Team Members */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Members</h4>
                    {audit.auditors_data && audit.auditors_data.length > 0 ? (
                      <div className="space-y-2">
                        {audit.auditors_data.map((auditor: any) => (
                          <div key={auditor.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                              {auditor.first_name?.[0]}{auditor.last_name?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-dark dark:text-white">
                                {auditor.full_name || auditor.username}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {auditor.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No team members assigned</p>
                    )}
                  </div>
                </div>
              </div>
            </WidgetCard>

            {/* Certification Management */}
            <WidgetCard title="Certification Management">
              <div className="space-y-6">
                {/* Certification Status */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {audit.iso_standard_data ? (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-dark dark:text-white">{audit.iso_standard_name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                          audit.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {audit.status === 'completed' ? 'Ready for Activation' : audit.status}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Audit Status:</span>
                          <span className="font-medium">{audit.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Findings:</span>
                          <span className="font-medium">{audit.major_findings || 0} Major, {audit.minor_findings || 0} Minor</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                          <span className="font-medium text-primary">{formatCurrency(audit.total_revenue || 0)}</span>
                        </div>
                      </div>
                      {audit.status === 'completed' && (
                        <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm">
                          Activate Certification
                        </button>
                      )}
                      {audit.certificate_number && (
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-sm">
                            View Certificate
                          </button>
                          <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-sm">
                            Suspend
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No certification data available</p>
                  )}
                </div>

                {/* Certification Timeline */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h4 className="font-medium text-dark dark:text-white mb-4">Certification Process Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-dark dark:text-white">Stage 1 Audit Completed</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Documentation review and initial assessment</p>
                      </div>
                      <span className="text-sm text-gray-500">Oct 10, 2025</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-dark dark:text-white">Stage 2 Audit Completed</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">On-site assessment and verification</p>
                      </div>
                      <span className="text-sm text-gray-500">Oct 21-23, 2025</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⏳</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-dark dark:text-white">Non-Conformance Resolution</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Client addressing minor findings</p>
                      </div>
                      <span className="text-sm text-gray-500">In Progress</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm">○</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-600 dark:text-gray-400">Certification Decision</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Final review and certification issuance</p>
                      </div>
                      <span className="text-sm text-gray-500">Pending</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm">○</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-600 dark:text-gray-400">Certificate Activation</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Certificate becomes valid and active</p>
                      </div>
                      <span className="text-sm text-gray-500">Pending</span>
                    </div>
                  </div>
                </div>

                {/* Activation Requirements */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-dark dark:text-white mb-4">Activation Requirements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm">All audit activities completed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm">Payment received and processed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">⏳</span>
                      </div>
                      <span className="text-sm">Non-conformances resolved (1 remaining)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs">○</span>
                      </div>
                      <span className="text-sm">Technical review completed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs">○</span>
                      </div>
                      <span className="text-sm">Management approval obtained</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                    <div className="text-2xl mb-2">📋</div>
                    <p className="font-medium text-dark dark:text-white">Review Findings</p>
                    <p className="text-xs text-gray-500">Check non-conformances</p>
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                    <div className="text-2xl mb-2">💰</div>
                    <p className="font-medium text-dark dark:text-white">Check Payment</p>
                    <p className="text-xs text-gray-500">Verify payment status</p>
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                    <div className="text-2xl mb-2">📄</div>
                    <p className="font-medium text-dark dark:text-white">Generate Certificate</p>
                    <p className="text-xs text-gray-500">Prepare certificate draft</p>
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                    <div className="text-2xl mb-2">📧</div>
                    <p className="font-medium text-dark dark:text-white">Notify Client</p>
                    <p className="text-xs text-gray-500">Send status update</p>
                  </button>
                </div>
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === "templates" && (
          <WidgetCard title="Audit Templates">
            <div className="space-y-6">
              {/* Header with Add Template button */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-dark dark:text-white">Certification Templates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage certification templates associated with this audit
                  </p>
                </div>
                <button
                  onClick={handleOpenAddTemplateModal}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium"
                >
                  Add Template
                </button>
              </div>

              {audit.audit_templates_data && audit.audit_templates_data.length > 0 ? (
                <div className="space-y-6">
                  {/* Templates List */}
                  {audit.audit_templates_data.map((template: any) => (
                    <div key={template.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        {template.logo_url && (
                          <img
                            src={template.logo_url}
                            alt="Template Logo"
                            className="w-16 h-16 object-contain rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                            {template.title}
                          </h3>
                          <p className="text-blue-700 dark:text-blue-400 mb-3">
                            {template.description}
                          </p>
                          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 text-sm">
                            <div>
                              <span className="font-medium text-blue-900 dark:text-blue-300">Standard:</span>
                              <div className="text-blue-800 dark:text-blue-400">{template.iso_standard_name}</div>
                            </div>
                            <div>
                              <span className="font-medium text-blue-900 dark:text-blue-300">Items:</span>
                              <div className="text-blue-800 dark:text-blue-400">{template.items_count}</div>
                            </div>
                            <div>
                              <span className="font-medium text-blue-900 dark:text-blue-300">Company:</span>
                              <div className="text-blue-800 dark:text-blue-400">{template.company_name || 'Not specified'}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/audits/templates/${template.id}`)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
                          >
                            View Template
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/audits/templates/${template.id}/edit`)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : audit.audit_template_data ? (
                /* Fallback to single template if audit_templates_data is empty */
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      {audit.audit_template_data.logo_url && (
                        <img
                          src={audit.audit_template_data.logo_url}
                          alt="Template Logo"
                          className="w-16 h-16 object-contain rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                          {audit.audit_template_data.title}
                        </h3>
                        <p className="text-blue-700 dark:text-blue-400 mb-3">
                          {audit.audit_template_data.description}
                        </p>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 text-sm">
                          <div>
                            <span className="font-medium text-blue-900 dark:text-blue-300">Standard:</span>
                            <div className="text-blue-800 dark:text-blue-400">{audit.audit_template_data.iso_standard_name}</div>
                          </div>
                          <div>
                            <span className="font-medium text-blue-900 dark:text-blue-300">Items:</span>
                            <div className="text-blue-800 dark:text-blue-400">{audit.audit_template_data.items_count}</div>
                          </div>
                          <div>
                            <span className="font-medium text-blue-900 dark:text-blue-300">Company:</span>
                            <div className="text-blue-800 dark:text-blue-400">{audit.audit_template_data.company_name || 'Not specified'}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/audits/templates/${audit.audit_template_data.id}`)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
                        >
                          View Template
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/audits/templates/${audit.audit_template_data.id}/edit`)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Templates Associated</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    This audit doesn't have any templates assigned yet. Associate templates to begin the audit process.
                  </p>
                  <button
                    onClick={() => router.push(`/dashboard/audits/new/workflow?auditId=${audit.id}`)}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover"
                  >
                    Select Templates
                  </button>
                </div>
              )}
            </div>
          </WidgetCard>
        )}

        {activeTab === "checklist" && (
          <WidgetCard title="Audit Checklists">
            <div className="space-y-6">
              {/* Header with navigation button */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-dark dark:text-white">Certification Standards</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Access and complete checklists for all certification standards associated with this audit
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/audits/${audit.id}/checklist`)}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium"
                >
                  View All Checklists
                </button>
              </div>

              {/* Display all templates */}
              {audit.audit_templates_data && audit.audit_templates_data.length > 0 ? (
                <div className="space-y-6">
                  {/* Templates Grid */}
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {audit.audit_templates_data.map((template: any) => (
                      <div key={template.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                              {template.iso_standard_name}
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                              {template.title}
                            </p>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-900 dark:text-blue-300">Items:</span>
                              <span className="font-medium text-blue-800 dark:text-blue-400">{template.items_count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-900 dark:text-blue-300">Completed:</span>
                              <span className="font-medium text-blue-800 dark:text-blue-400">
                                {audit.checklist_responses?.filter((r: any) => r.checklist_item?.checklist === template.id && r.compliance_status === 'compliant').length || 0}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => router.push(`/dashboard/audits/${audit.id}/checklist/${template.id}`)}
                            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
                          >
                            Complete Checklist
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Overall Progress Summary */}
                  {(() => {
                    const progress = calculateAuditProgress(audit.checklist_responses || []);
                    return (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-dark dark:text-white mb-4">Overall Audit Progress</h4>

                        {/* Progress Bar */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Rate</span>
                            <span className="text-lg font-bold text-primary">{progress.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                            <div
                              className="bg-primary h-3 rounded-full transition-all duration-300"
                              style={{ width: `${progress.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {progress.completed} of {progress.total} items completed
                          </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-xs font-medium text-green-900 dark:text-green-300">✓ Compliant</p>
                            <p className="text-2xl font-bold text-green-600">{progress.compliant}</p>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="text-xs font-medium text-yellow-900 dark:text-yellow-300">⚠ Need Attention</p>
                            <p className="text-2xl font-bold text-yellow-600">
                              {progress.needsImprovement + progress.nonCompliant}
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-300">⏳ Pending</p>
                            <p className="text-2xl font-bold text-gray-600">{progress.pending}</p>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">📋 Templates</p>
                            <p className="text-2xl font-bold text-blue-600">{audit.audit_templates_data.length}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : audit.audit_template_data ? (
                /* Fallback to single template if audit_templates_data is empty */
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                          {audit.audit_template_data.iso_standard_name}
                        </h4>
                        <p className="text-blue-700 dark:text-blue-400 mb-3">
                          {audit.audit_template_data.title}
                        </p>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 text-sm">
                          <div>
                            <span className="font-medium text-blue-900 dark:text-blue-300">Items:</span>
                            <div className="text-blue-800 dark:text-blue-400">{audit.audit_template_data.items_count}</div>
                          </div>
                          <div>
                            <span className="font-medium text-blue-900 dark:text-blue-300">Responses:</span>
                            <div className="text-blue-800 dark:text-blue-400">{audit.checklist_responses?.length || 0}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/audits/${audit.id}/checklist/${audit.audit_template_data.id}`)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
                        >
                          Complete Checklist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Templates Associated</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    This audit doesn't have any certification templates assigned yet. Associate templates to begin the audit checklist process.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => router.push(`/dashboard/audits/new/workflow?auditId=${audit.id}`)}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover"
                    >
                      Select Templates
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/audits/${audit.id}/checklist`)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
                    >
                      View Checklist Area
                    </button>
                  </div>
                </div>
              )}

              {/* Report Collection Features */}
              <div className="space-y-6">
                {/* Findings Summary */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-dark dark:text-white">Findings & Non-Conformities</h4>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm">
                      Add Finding
                    </button>
                  </div>
                  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-xs font-medium text-red-900 dark:text-red-300">🔴 Major Findings</p>
                      <p className="text-2xl font-bold text-red-600">{audit.major_findings || 0}</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs font-medium text-yellow-900 dark:text-yellow-300">🟡 Minor Findings</p>
                      <p className="text-2xl font-bold text-yellow-600">{audit.minor_findings || 0}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-300">💡 Opportunities</p>
                      <p className="text-2xl font-bold text-blue-600">{audit.opportunities || 0}</p>
                    </div>
                  </div>

                  {/* Recent Findings */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Findings</h5>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Document Control Process - Non-Conformity</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Clause 4.2.3 - Document control procedures not fully implemented</p>
                        </div>
                        <span className="text-xs text-gray-500">Today</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Training Records - Minor Finding</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Clause 6.2 - Some training records incomplete</p>
                        </div>
                        <span className="text-xs text-gray-500">Yesterday</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Collection */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-dark dark:text-white">Evidence & Documentation</h4>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Upload Evidence
                    </button>
                  </div>

                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{documents?.length || 0}</div>
                      <div className="text-xs text-blue-900 dark:text-blue-300">Documents</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-xs text-green-900 dark:text-green-300">Photos</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">8</div>
                      <div className="text-xs text-purple-900 dark:text-purple-300">Records</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">5</div>
                      <div className="text-xs text-orange-900 dark:text-orange-300">Interviews</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-sm">
                      View All Evidence
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-sm">
                      Generate Evidence Report
                    </button>
                  </div>
                </div>

                {/* Report Generation */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-dark dark:text-white mb-4">Report Generation</h4>
                  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
                      <h5 className="font-medium text-sm mb-2">Audit Summary Report</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Complete audit overview with findings and recommendations</p>
                      <button className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm">
                        Generate
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
                      <h5 className="font-medium text-sm mb-2">Non-Conformity Report</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Detailed report of all findings and corrective actions</p>
                      <button className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm">
                        Generate
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
                      <h5 className="font-medium text-sm mb-2">Evidence Log</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Complete log of all collected evidence and documentation</p>
                      <button className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm">
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WidgetCard>
        )}

        {activeTab === "findings" && (
          <WidgetCard title="Audit Findings">
            <div className="space-y-6">
              {/* Header with Create Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-dark dark:text-white">Findings & Non-Conformances</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage audit findings, non-conformances, and opportunities for improvement
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateFindingModal}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium"
                >
                  Create Finding
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-900 dark:text-red-300">Major Non-Conformances</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {findings.filter(f => f.finding_type === 'MAJOR').length}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Minor Non-Conformances</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {findings.filter(f => f.finding_type === 'MINOR').length}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Opportunities</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {findings.filter(f => f.finding_type === 'OPPORTUNITY').length}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-300">Total Findings</p>
                  <p className="text-3xl font-bold text-gray-600 mt-2">{findings.length}</p>
                </div>
              </div>

              {/* Findings List */}
              <div className="space-y-4">
                {findings.length > 0 ? (
                  findings.map((finding: any) => {
                    const isDeleting = deletingFindingId === finding.id;
                    const borderColor = finding.finding_type === 'MAJOR' ? 'border-red-500' :
                                       finding.finding_type === 'MINOR' ? 'border-yellow-500' :
                                       finding.finding_type === 'OPPORTUNITY' ? 'border-blue-500' :
                                       'border-gray-500';
                    const bgColor = finding.finding_type === 'MAJOR' ? 'bg-red-50 dark:bg-red-900/20' :
                                   finding.finding_type === 'MINOR' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                                   finding.finding_type === 'OPPORTUNITY' ? 'bg-blue-50 dark:bg-blue-900/20' :
                                   'bg-gray-50 dark:bg-gray-900/20';
                    const statusColor = finding.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                                       finding.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                       finding.status === 'CLOSED' ? 'bg-green-100 text-green-800' :
                                       'bg-blue-100 text-blue-800';

                    return (
                      <div key={finding.id} className={`border-l-4 ${borderColor} ${bgColor} p-4 rounded-r-lg`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-dark dark:text-white text-lg">
                                {finding.finding_type}
                              </h3>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                                {finding.status}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Clause: {finding.clause_reference}
                              </span>
                            </div>
                            <p className="text-dark dark:text-white mb-2">{finding.description}</p>
                            {finding.requirement && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span className="font-medium">Requirement:</span> {finding.requirement}
                              </p>
                            )}
                            {finding.evidence && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Evidence:</span> {finding.evidence}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleOpenEditFindingModal(finding)}
                              disabled={isDeleting}
                              className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFinding(finding.id)}
                              disabled={isDeleting}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex gap-4">
                          <span>Created: {new Date(finding.created_at).toLocaleDateString()}</span>
                          {finding.updated_at && (
                            <span>Updated: {new Date(finding.updated_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Findings Recorded</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      No findings have been recorded for this audit yet. Click "Create Finding" to add one.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </WidgetCard>
        )}

        {activeTab === "documents" && (
          <WidgetCard title="Audit Documents">
            <div className="space-y-6">
              {/* Header with Upload Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-dark dark:text-white">Document Library</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Upload and manage documents related to this audit
                  </p>
                </div>
                <button
                  onClick={handleOpenUploadModal}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium"
                >
                  Upload Document
                </button>
              </div>

              {/* Documents List */}
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc: any) => {
                    const isDeleting = deletingDocumentId === doc.id;
                    const categoryColor = doc.category === 'EVIDENCE' ? 'bg-blue-100 text-blue-800' :
                                         doc.category === 'REPORT' ? 'bg-green-100 text-green-800' :
                                         doc.category === 'CERTIFICATE' ? 'bg-purple-100 text-purple-800' :
                                         doc.category === 'CORRESPONDENCE' ? 'bg-yellow-100 text-yellow-800' :
                                         'bg-gray-100 text-gray-800';

                    return (
                      <div key={doc.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {/* File Icon */}
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">📄</span>
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-dark dark:text-white truncate">
                                  {doc.original_name}
                                </h4>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColor}`}>
                                  {doc.category}
                                </span>
                              </div>
                              {doc.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {doc.description}
                                </p>
                              )}
                              <div className="flex gap-4 text-xs text-gray-500">
                                <span>Size: {formatFileSize(doc.file_size)}</span>
                                <span>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                                {doc.uploaded_by_name && (
                                  <span>By: {doc.uploaded_by_name}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 ml-4">
                            <a
                              href={doc.file_url}
                              download
                              className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Download
                            </a>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              disabled={isDeleting}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Documents Uploaded</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    No documents have been uploaded for this audit yet. Click "Upload Document" to add one.
                  </p>
                </div>
              )}
            </div>
          </WidgetCard>
        )}



        {activeTab === "alerts" && (
          <WidgetCard title="Alerts & Email Management">
            <div className="space-y-6">
              <div className="flex gap-4 mb-6">
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover">
                  Compose Email
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
                  Email Settings
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">📧 Email & Alert Management</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email alerts and notifications for audit {audit.audit_number} are managed through the notification center.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Lead Auditor: <span className="font-medium">{audit.lead_auditor_name}</span>
                </p>
                <button className="mt-4 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 text-sm">
                  Go to Notification Center
                </button>
              </div>
            </div>
          </WidgetCard>
        )}

        {activeTab === "revenue" && (
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <WidgetCard title="Total Revenue">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{formatCurrency(audit.total_revenue || 0)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total audit value</p>
                </div>
              </WidgetCard>

              <WidgetCard title="Payment Status">
                <div className="text-center">
                  <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                    audit.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : audit.payment_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {audit.payment_status || 'N/A'}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Current status</p>
                </div>
              </WidgetCard>

              <WidgetCard title="Audit Standard">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{audit.iso_standard_name || 'N/A'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Certification standard</p>
                </div>
              </WidgetCard>
            </div>

            {/* Revenue Summary */}
            <WidgetCard title="Revenue Summary">
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-dark dark:text-white">{audit.iso_standard_name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Audit for {audit.client_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{formatCurrency(audit.total_revenue || 0)}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        audit.payment_status === 'paid'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : audit.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {audit.payment_status || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Audit Type:</span>
                      <span className="ml-2 font-medium">{audit.audit_type || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="ml-2 font-medium">{audit.status || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </WidgetCard>

            {/* Invoice Information */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <WidgetCard title="Invoice Details">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Audit Number</span>
                    <span className="font-medium">{audit.audit_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Client</span>
                    <span className="font-medium">{audit.client_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                    <span className="font-medium">{formatCurrency(audit.total_revenue || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
                    <span className="font-medium">{audit.payment_status || 'N/A'}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover">
                      View Invoice
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
                      Download PDF
                    </button>
                  </div>
                </div>
              </WidgetCard>

              <WidgetCard title="Payment Status">
                <div className="space-y-3">
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">💳</div>
                    <p className="text-gray-500 text-sm">{audit.payment_status === 'paid' ? 'Payment Received' : 'Awaiting Payment'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {audit.payment_status === 'paid'
                        ? 'Payment has been successfully recorded'
                        : 'Payment is pending'}
                    </p>
                  </div>
                  {audit.payment_status !== 'paid' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                        Record Payment
                      </button>
                    </div>
                  )}
                </div>
              </WidgetCard>
            </div>

            {/* Revenue Actions */}
            <WidgetCard title="Revenue Actions">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  <div className="text-2xl mb-2">📄</div>
                  <p className="font-medium text-dark dark:text-white">Generate Invoice</p>
                  <p className="text-xs text-gray-500">Create new invoice</p>
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="font-medium text-dark dark:text-white">Record Payment</p>
                  <p className="text-xs text-gray-500">Update payment status</p>
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="font-medium text-dark dark:text-white">Revenue Report</p>
                  <p className="text-xs text-gray-500">Export revenue data</p>
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  <div className="text-2xl mb-2">📧</div>
                  <p className="font-medium text-dark dark:text-white">Send Reminder</p>
                  <p className="text-xs text-gray-500">Payment follow-up</p>
                </button>
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === "reports" && (
          <WidgetCard title="Reports">
            <div className="space-y-6">
              <div className="flex gap-4 mb-4">
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Generate Report</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Export All</button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">📊 Audit Reports</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reports for audit {audit.audit_number} ({audit.iso_standard_name}) are generated and managed through the reporting system.
                </p>
                <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <p className="text-2xl font-bold text-green-600">{audit.major_findings || 0}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Major Findings</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <p className="text-2xl font-bold text-yellow-600">{audit.minor_findings || 0}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Minor Findings</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <p className="text-2xl font-bold text-blue-600">{audit.opportunities || 0}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Opportunities</p>
                  </div>
                </div>
                <button className="mt-4 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 text-sm">
                  Go to Report Manager
                </button>
              </div>
            </div>
          </WidgetCard>
        )}
        </div>

        {/* Activities Side Panel */}
        <div className="w-96 flex-shrink-0">
          <WidgetCard title="Audit Summary">
            <div className="space-y-4">
              <div className="space-y-3">
                {/* Audit Summary */}
                <div className="border-l-4 border-blue-500 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-dark dark:text-white">Audit Number</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {audit.audit_number || 'N/A'}
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-dark dark:text-white">Status</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {audit.status || 'N/A'}
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-dark dark:text-white">Lead Auditor</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {audit.lead_auditor_name || 'N/A'}
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-dark dark:text-white">Findings Summary</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Major: {audit.major_findings || 0} | Minor: {audit.minor_findings || 0} | Observations: {audit.opportunities || 0}
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-dark dark:text-white">Client</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {audit.client_name || 'N/A'}
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-dark dark:text-white">Progress</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {audit.checklist_responses ? 
                      `${calculateAuditProgress(audit.checklist_responses).percentage}% Complete` : 
                      '0% Complete'}
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-dark dark:text-white">Planned Dates</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {audit.planned_start_date ? new Date(audit.planned_start_date).toLocaleDateString() : 'N/A'} to {audit.planned_end_date ? new Date(audit.planned_end_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Quick Add Activity */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex gap-2 mb-3">
                  <select className="flex-1 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-dark dark:text-white">
                    <option>Observation</option>
                    <option>Finding</option>
                    <option>Evidence</option>
                    <option>Interview</option>
                    <option>Meeting</option>
                    <option>Other</option>
                  </select>
                  <button className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary-hover">
                    Add
                  </button>
                </div>
                <textarea
                  placeholder="Add activity note..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-dark dark:text-white resize-none"
                  rows={2}
                />
              </div>
            </div>
          </WidgetCard>

          {/* Comments Section */}
          <div className="mt-6">
            <WidgetCard title="Comments & Notes">
              <div className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {/* Comments List */}
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-dark dark:text-white">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">💬 No comments yet</p>
                      <p className="text-xs text-gray-400 mt-1">Start the conversation by adding a comment</p>
                    </div>
                  )}
                </div>

                {/* Add Comment */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      U
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Write a comment..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-dark dark:text-white resize-none"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={addingComment}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {newComment.length}/500
                          </span>
                        </div>
                        <button 
                          onClick={handleAddComment}
                          disabled={addingComment || !newComment.trim()}
                          className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingComment ? 'Posting...' : 'Post'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </WidgetCard>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <WidgetCard title="Quick Actions">
              <div className="space-y-2">
                <button className="w-full px-3 py-2 text-left text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  📝 Log Finding
                </button>
                <button className="w-full px-3 py-2 text-left text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  📷 Add Evidence
                </button>
                <button className="w-full px-3 py-2 text-left text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  👥 Schedule Interview
                </button>
                <button className="w-full px-3 py-2 text-left text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  📧 Send Update
                </button>
                <button className="w-full px-3 py-2 text-left text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  📋 Update Status
                </button>
              </div>
            </WidgetCard>
          </div>
        </div>
      </div>

      {/* Add Template Modal */}
      <Modal
        isOpen={showAddTemplateModal}
        onClose={() => {
          setShowAddTemplateModal(false);
          setSelectedTemplateIds([]);
        }}
        title="Add Certification Templates"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddTemplateModal(false);
                setSelectedTemplateIds([]);
              }}
              disabled={addingTemplate}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddTemplates}
              loading={addingTemplate}
            >
              Add Selected Templates
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select one or more certification templates to add to this audit. Templates already associated with this audit are disabled.
          </p>

          {availableTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No templates available</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableTemplates.map((template) => {
                const isAlreadyAdded = audit?.audit_templates?.includes(template.id);
                const isSelected = selectedTemplateIds.includes(template.id);

                return (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isAlreadyAdded
                        ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    onClick={() => !isAlreadyAdded && handleTemplateToggle(template.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected || isAlreadyAdded}
                        disabled={isAlreadyAdded}
                        onChange={() => {}}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-dark dark:text-white">
                          {template.title}
                          {isAlreadyAdded && (
                            <span className="ml-2 text-xs text-gray-500">(Already added)</span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {template.description}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>Standard: {template.iso_standard_name}</span>
                          <span>Items: {template.items_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal
        isOpen={showEditScheduleModal}
        onClose={() => setShowEditScheduleModal(false)}
        title="Edit Audit Schedule"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowEditScheduleModal(false)}
              disabled={updatingSchedule}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateSchedule}
              loading={updatingSchedule}
            >
              Update Schedule
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update the planned and actual dates for this audit.
          </p>

          {/* Planned Dates */}
          <div className="space-y-4">
            <h4 className="font-medium text-dark dark:text-white">Planned Schedule</h4>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Planned Start Date
                </label>
                <input
                  type="date"
                  value={scheduleData.planned_start_date}
                  onChange={(e) => setScheduleData({ ...scheduleData, planned_start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Planned End Date
                </label>
                <input
                  type="date"
                  value={scheduleData.planned_end_date}
                  onChange={(e) => setScheduleData({ ...scheduleData, planned_end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Actual Dates */}
          <div className="space-y-4">
            <h4 className="font-medium text-dark dark:text-white">Actual Schedule</h4>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Actual Start Date
                </label>
                <input
                  type="date"
                  value={scheduleData.actual_start_date}
                  onChange={(e) => setScheduleData({ ...scheduleData, actual_start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Actual End Date
                </label>
                <input
                  type="date"
                  value={scheduleData.actual_end_date}
                  onChange={(e) => setScheduleData({ ...scheduleData, actual_end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Create/Edit Finding Modal */}
      <Modal
        isOpen={showFindingModal}
        onClose={() => setShowFindingModal(false)}
        title={editingFinding ? 'Edit Finding' : 'Create New Finding'}
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowFindingModal(false)}
              disabled={savingFinding}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveFinding}
              loading={savingFinding}
            >
              {editingFinding ? 'Update Finding' : 'Create Finding'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Finding Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Finding Type <span className="text-red-500">*</span>
            </label>
            <select
              value={findingData.finding_type}
              onChange={(e) => setFindingData({ ...findingData, finding_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="MAJOR">Major Non-Conformance</option>
              <option value="MINOR">Minor Non-Conformance</option>
              <option value="OPPORTUNITY">Opportunity for Improvement</option>
              <option value="OBSERVATION">Observation</option>
            </select>
          </div>

          {/* Clause Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Clause Reference <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={findingData.clause_reference}
              onChange={(e) => setFindingData({ ...findingData, clause_reference: e.target.value })}
              placeholder="e.g., 4.1, 7.2.1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={findingData.description}
              onChange={(e) => setFindingData({ ...findingData, description: e.target.value })}
              placeholder="Describe the finding..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          {/* Requirement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Requirement
            </label>
            <textarea
              value={findingData.requirement}
              onChange={(e) => setFindingData({ ...findingData, requirement: e.target.value })}
              placeholder="What is the requirement that was not met?"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Evidence
            </label>
            <textarea
              value={findingData.evidence}
              onChange={(e) => setFindingData({ ...findingData, evidence: e.target.value })}
              placeholder="Evidence supporting this finding..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={findingData.status}
              onChange={(e) => setFindingData({ ...findingData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
              disabled={uploadingDocument}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUploadDocument}
              loading={uploadingDocument}
            >
              Upload
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls,.txt"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, XLSX, XLS, TXT
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={uploadData.category}
              onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="GENERAL">General</option>
              <option value="EVIDENCE">Evidence</option>
              <option value="REPORT">Report</option>
              <option value="CERTIFICATE">Certificate</option>
              <option value="CORRESPONDENCE">Correspondence</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Optional description of the document..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

