"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { Badge } from "@/components/Dashboard/badge";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { ClientIntakeSubmission, SubmissionStatus } from "@/types/client-intake";
import { formatDate } from "@/lib/intake-utils";

export default function IntakeSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ClientIntakeSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ClientIntakeSubmission | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, searchTerm]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/clients/intake-submissions?${params}`);
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (action: "approve" | "reject") => {
    if (!selectedSubmission) return;

    if (action === "reject" && !rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setIsReviewing(true);
    try {
      const response = await fetch(`/api/clients/intake-submissions/${selectedSubmission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          notes: reviewNotes,
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedSubmission(null);
        setReviewNotes("");
        setRejectionReason("");
        fetchSubmissions();
        alert(data.data?.message || `Submission ${action}d successfully`);
      } else {
        alert(data.error || `Failed to ${action} submission`);
      }
    } catch (error) {
      console.error(`Error ${action}ing submission:`, error);
      alert(`An error occurred while ${action}ing the submission`);
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    const variants: Record<SubmissionStatus, "success" | "warning" | "error"> = {
      pending: "warning",
      approved: "success",
      rejected: "error",
    };
    return <Badge label={status.charAt(0).toUpperCase() + status.slice(1)} variant={variants[status]} size="sm" />;
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Client Intake Submissions
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Review and approve client information submissions
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-dark dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Submissions</p>
            </div>
          </WidgetCard>
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending Review</p>
            </div>
          </WidgetCard>
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Approved</p>
            </div>
          </WidgetCard>
          <WidgetCard>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rejected</p>
            </div>
          </WidgetCard>
        </div>

        {/* Filters */}
        <WidgetCard>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by company name, contact, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | "all")}
              className="rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </WidgetCard>

        {/* Submissions List */}
        {isLoading ? (
          <WidgetCard>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading submissions...</p>
            </div>
          </WidgetCard>
        ) : submissions.length === 0 ? (
          <WidgetCard>
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No submissions found.
              </p>
            </div>
          </WidgetCard>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <WidgetCard key={submission.id}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(submission.status)}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Submitted {formatDate(submission.submittedAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-dark dark:text-white">
                        {submission.submissionData.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {submission.submissionData.contact} • {submission.submissionData.email}
                      </p>
                    </div>
                    {submission.status === "pending" && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        Review
                      </Button>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {submission.submissionData.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Industry</p>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {submission.submissionData.industry || "Not specified"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Address</p>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {submission.submissionData.address}
                      </p>
                    </div>
                  </div>

                  {/* Certifications */}
                  {submission.submissionData.certifications && submission.submissionData.certifications.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Certifications of Interest</p>
                      <div className="flex flex-wrap gap-2">
                        {submission.submissionData.certifications.map((cert) => (
                          <Badge key={cert} label={cert} variant="neutral" size="sm" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review Info */}
                  {submission.status !== "pending" && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {submission.status === "approved" ? "Approved" : "Rejected"} by {submission.reviewedByName} on {formatDate(submission.reviewedAt!)}
                      </p>
                      {submission.notes && (
                        <p className="text-sm text-dark dark:text-white mt-1">
                          Notes: {submission.notes}
                        </p>
                      )}
                      {submission.rejectionReason && (
                        <p className="text-sm text-red-600 mt-1">
                          Reason: {submission.rejectionReason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </WidgetCard>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold text-dark dark:text-white">
                    Review Submission
                  </h2>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Company Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
                      Company Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Company Name</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {selectedSubmission.submissionData.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Industry</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {selectedSubmission.submissionData.industry || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Contact Person</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {selectedSubmission.submissionData.contact}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {selectedSubmission.submissionData.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {selectedSubmission.submissionData.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Address</p>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {selectedSubmission.submissionData.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {(selectedSubmission.submissionData.siteContact || selectedSubmission.submissionData.sitePhone) && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-dark dark:text-white mb-3">
                        Site Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedSubmission.submissionData.siteContact && (
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Site Contact</p>
                            <p className="text-sm font-medium text-dark dark:text-white">
                              {selectedSubmission.submissionData.siteContact}
                            </p>
                          </div>
                        )}
                        {selectedSubmission.submissionData.sitePhone && (
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Site Phone</p>
                            <p className="text-sm font-medium text-dark dark:text-white">
                              {selectedSubmission.submissionData.sitePhone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedSubmission.submissionData.certifications && selectedSubmission.submissionData.certifications.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-dark dark:text-white mb-3">
                        Certifications of Interest
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubmission.submissionData.certifications.map((cert) => (
                          <Badge key={cert} label={cert} variant="neutral" size="sm" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Review Form */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Review Notes (Optional)
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      placeholder="Add any notes about this submission..."
                      className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Rejection Reason (Required if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={2}
                      placeholder="Provide a reason for rejection..."
                      className="w-full rounded-lg border-2 border-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedSubmission(null)}
                    className="flex-1"
                    disabled={isReviewing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleReview("reject")}
                    className="flex-1"
                    disabled={isReviewing}
                  >
                    {isReviewing ? "Processing..." : "Reject"}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleReview("approve")}
                    className="flex-1"
                    disabled={isReviewing}
                  >
                    {isReviewing ? "Processing..." : "Approve & Create Client"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

