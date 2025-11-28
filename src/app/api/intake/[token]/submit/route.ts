/**
 * API Route: Submit Intake Form
 * POST /api/intake/[token]/submit
 * Handles client intake form submission
 *
 * This route now proxies to the Django backend with PostgreSQL database.
 */

import { NextRequest, NextResponse } from "next/server";
import { SubmitIntakeFormRequest, SubmitIntakeFormResponse } from "@/types/client-intake";
import { submitIntakeForm } from "@/lib/django-api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body: Omit<SubmitIntakeFormRequest, "linkToken"> = await request.json();
    const { accessCode, clientData } = body;

    // Validate input
    if (!accessCode || !clientData) {
      const response: SubmitIntakeFormResponse = {
        success: false,
        error: "Access code and client data are required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Submit to Django backend
    const result = await submitIntakeForm(token, accessCode, clientData);

    if (!result.success) {
      const response: SubmitIntakeFormResponse = {
        success: false,
        error: result.error || "Failed to submit form",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: SubmitIntakeFormResponse = {
      success: true,
      data: {
        submissionId: result.submission?.id.toString() || '',
        message: "Thank you! Your information has been submitted successfully. Our team will review it and contact you soon.",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error submitting intake form:", error);
    const response: SubmitIntakeFormResponse = {
      success: false,
      error: "An error occurred while submitting your information. Please try again.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

