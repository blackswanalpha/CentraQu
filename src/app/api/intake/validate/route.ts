/**
 * API Route: Validate Intake Link
 * POST /api/intake/validate
 * Validates link token and access code
 *
 * This route now proxies to the Django backend with PostgreSQL database.
 */

import { NextRequest, NextResponse } from "next/server";
import { ValidateIntakeLinkRequest, ValidateIntakeLinkResponse } from "@/types/client-intake";
import { validateAccessCode } from "@/lib/django-api";

export async function POST(request: NextRequest) {
  try {
    const body: ValidateIntakeLinkRequest = await request.json();
    const { linkToken, accessCode } = body;

    // Validate input
    if (!linkToken || !accessCode) {
      const response: ValidateIntakeLinkResponse = {
        success: false,
        error: "Link token and access code are required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate with Django backend
    const result = await validateAccessCode(linkToken, accessCode);

    if (!result.valid) {
      let message = result.error || "This link is no longer available.";

      if (result.error?.includes('expired')) {
        message = "This link has expired. Please contact us for a new link.";
      } else if (result.error?.includes('maximum number of uses')) {
        message = "This link has already been used. Please contact us if you need assistance.";
      } else if (result.error?.includes('deactivated')) {
        message = "This link has been deactivated. Please contact us for assistance.";
      } else if (result.error?.includes('Invalid access code')) {
        message = "Incorrect access code. Please check and try again.";
      } else if (result.error?.includes('Invalid link')) {
        message = "Invalid link. This link may have been deleted or never existed.";
      }

      const response: ValidateIntakeLinkResponse = {
        success: true,
        data: {
          isValid: false,
          message,
        },
      };
      return NextResponse.json(response);
    }

    // Link is valid and usable
    const response: ValidateIntakeLinkResponse = {
      success: true,
      data: {
        isValid: true,
        link: {
          id: result.linkData?.id.toString() || '',
          expiresAt: result.linkData?.expiresAt ? new Date(result.linkData.expiresAt) : new Date(),
          relatedAuditName: undefined,
          relatedProjectName: undefined,
        },
        message: "Access code verified successfully.",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error validating intake link:", error);
    const response: ValidateIntakeLinkResponse = {
      success: false,
      error: "An error occurred while validating the link. Please try again.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

