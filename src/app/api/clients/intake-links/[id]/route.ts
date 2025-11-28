/**
 * API Route: Individual Intake Link Management
 * GET /api/clients/intake-links/[id] - Get link details
 * PATCH /api/clients/intake-links/[id] - Update link (deactivate, etc.)
 * DELETE /api/clients/intake-links/[id] - Delete link
 */

import { NextRequest, NextResponse } from "next/server";
import { calculateLinkStatus } from "@/lib/intake-utils";
import { ClientIntakeLink } from "@/types/client-intake";

// This should be replaced with database operations
// For now, we'll use the same array reference as the main route
// In a real app, this would be database queries
let intakeLinks: ClientIntakeLink[] = [];

// Helper function to get links (would be replaced with DB query)
const getIntakeLinks = (): ClientIntakeLink[] => {
  return intakeLinks;
};

// Helper function to update links (would be replaced with DB update)
const updateIntakeLinks = (links: ClientIntakeLink[]): void => {
  intakeLinks = links;
};

// GET - Get link details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find link
    const links = getIntakeLinks();
    const link = links.find(l => l.id === id);

    if (!link) {
      return NextResponse.json(
        {
          success: false,
          error: "Link not found",
        },
        { status: 404 }
      );
    }

    // Update status
    const linkWithStatus = {
      ...link,
      status: calculateLinkStatus(link),
    };

    return NextResponse.json({
      success: true,
      data: linkWithStatus,
    });
  } catch (error) {
    console.error("Error fetching intake link:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch intake link",
      },
      { status: 500 }
    );
  }
}

// PATCH - Update link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Find link
    const links = getIntakeLinks();
    const linkIndex = links.findIndex(l => l.id === id);

    if (linkIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Link not found",
        },
        { status: 404 }
      );
    }

    // Update link
    const link = links[linkIndex];
    
    if (body.isActive !== undefined) {
      link.isActive = body.isActive;
    }
    
    if (body.notes !== undefined) {
      link.notes = body.notes;
    }

    link.updatedAt = new Date();

    // Update status
    const updatedLink = {
      ...link,
      status: calculateLinkStatus(link),
    };

    return NextResponse.json({
      success: true,
      data: updatedLink,
      message: "Link updated successfully",
    });
  } catch (error) {
    console.error("Error updating intake link:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update intake link",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete link
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find link
    const links = getIntakeLinks();
    const linkIndex = links.findIndex(l => l.id === id);

    if (linkIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Link not found",
        },
        { status: 404 }
      );
    }

    // In production, you might want to soft delete or check for associated submissions
    links.splice(linkIndex, 1);
    updateIntakeLinks(links);

    return NextResponse.json({
      success: true,
      message: "Link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting intake link:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete intake link",
      },
      { status: 500 }
    );
  }
}

