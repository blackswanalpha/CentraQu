/**
 * API Route: Client Intake Submissions Management
 * GET /api/clients/intake-submissions - List all submissions
 *
 * This route now proxies to the Django backend with PostgreSQL database.
 */

import { NextRequest, NextResponse } from "next/server";
import { ClientIntakeSubmission } from "@/types/client-intake";
import { fetchIntakeSubmissions, DjangoIntakeSubmission } from "@/lib/django-api";

/**
 * Convert Django intake submission to frontend format
 */
function convertDjangoSubmissionToFrontend(djangoSubmission: DjangoIntakeSubmission): ClientIntakeSubmission {
  return {
    id: djangoSubmission.id.toString(),
    linkId: djangoSubmission.intake_link.toString(),
    submissionData: {
      ...djangoSubmission.client_data,
      id: djangoSubmission.client?.toString() || '',
      createdAt: new Date(djangoSubmission.submitted_at),
      updatedAt: new Date(djangoSubmission.submitted_at),
    },
    submittedAt: new Date(djangoSubmission.submitted_at),
    ipAddress: djangoSubmission.ip_address || undefined,
    userAgent: djangoSubmission.user_agent,
    status: djangoSubmission.status,
    reviewedBy: djangoSubmission.reviewed_by?.toString(),
    reviewedByName: djangoSubmission.reviewed_by_name || undefined,
    reviewedAt: djangoSubmission.reviewed_at ? new Date(djangoSubmission.reviewed_at) : undefined,
    notes: djangoSubmission.notes || undefined,
    rejectionReason: djangoSubmission.rejection_reason || undefined,
  };
}

// GET - List all submissions
export async function GET(request: NextRequest) {
  try {
    // Fetch submissions from Django backend
    const djangoSubmissions = await fetchIntakeSubmissions();

    // Convert to frontend format
    const submissions = djangoSubmissions.map(convertDjangoSubmissionToFrontend);

    // Get query parameters for filtering (optional client-side filtering)
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status");
    const search = searchParams.get("search");

    let filteredSubmissions = submissions;

    if (statusFilter && statusFilter !== "all") {
      filteredSubmissions = filteredSubmissions.filter(sub => sub.status === statusFilter);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredSubmissions = filteredSubmissions.filter(sub =>
        sub.submissionData.name?.toLowerCase().includes(searchLower) ||
        sub.submissionData.email?.toLowerCase().includes(searchLower) ||
        sub.submissionData.contact?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredSubmissions,
      meta: {
        total: filteredSubmissions.length,
        page: 1,
        limit: 50,
      },
    });
  } catch (error) {
    console.error("Error fetching intake submissions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch intake submissions",
      },
      { status: 500 }
    );
  }
}

