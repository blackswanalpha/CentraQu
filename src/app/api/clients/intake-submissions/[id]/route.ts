/**
 * API Route: Individual Submission Management
 * GET /api/clients/intake-submissions/[id] - Get submission details
 * PATCH /api/clients/intake-submissions/[id] - Review submission (approve/reject)
 *
 * This route proxies to the Django backend with PostgreSQL database.
 */

import { NextRequest, NextResponse } from "next/server";
import { ReviewSubmissionRequest, ReviewSubmissionResponse } from "@/types/client-intake";

const DJANGO_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// GET - Get submission details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch from Django backend
    const response = await fetch(`${DJANGO_API_URL}/intake-submissions/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Submission not found",
        },
        { status: response.status }
      );
    }

    const submission = await response.json();

    return NextResponse.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch submission",
      },
      { status: 500 }
    );
  }
}

// PATCH - Review submission (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Omit<ReviewSubmissionRequest, "submissionId"> = await request.json();
    const { action, notes, rejectionReason } = body;

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      const response: ReviewSubmissionResponse = {
        success: false,
        error: "Invalid action. Must be 'approve' or 'reject'",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Call Django backend approve or reject endpoint
    const endpoint = action === "approve" ? "approve" : "reject";
    const djangoResponse = await fetch(`${DJANGO_API_URL}/intake-submissions/${id}/${endpoint}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notes: notes || '',
        rejectionReason: rejectionReason || '',
      }),
    });

    if (!djangoResponse.ok) {
      const errorData = await djangoResponse.json();
      const response: ReviewSubmissionResponse = {
        success: false,
        error: errorData.error || `Failed to ${action} submission`,
      };
      return NextResponse.json(response, { status: djangoResponse.status });
    }

    const data = await djangoResponse.json();

    const response: ReviewSubmissionResponse = {
      success: true,
      data: {
        submission: data.submission,
        clientId: data.client_id?.toString(),
        message: data.message,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error reviewing submission:", error);
    const response: ReviewSubmissionResponse = {
      success: false,
      error: "Failed to review submission",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

