/**
 * API Route: Individual Project Template Management
 * GET /api/consulting/templates/[id] - Get specific template
 * PUT /api/consulting/templates/[id] - Update template
 * DELETE /api/consulting/templates/[id] - Delete template
 * POST /api/consulting/templates/[id]/use - Use template (increment usage count)
 */

import { NextRequest, NextResponse } from "next/server";
import { ProjectTemplate } from "@/types/consulting";

// This would normally be shared with the main templates route
// In real implementation, this would come from a database
let templates: ProjectTemplate[] = [
  // Same data as in templates/route.ts - this would be centralized in real implementation
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = templates.find(t => t.id === params.id);
    
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch template",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates: Partial<ProjectTemplate> = await request.json();
    const templateIndex = templates.findIndex(t => t.id === params.id);
    
    if (templateIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    // Update template
    templates[templateIndex] = {
      ...templates[templateIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: templates[templateIndex],
      message: "Template updated successfully",
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update template",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateIndex = templates.findIndex(t => t.id === params.id);
    
    if (templateIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    // Remove template
    templates.splice(templateIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete template",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    
    if (action !== "use") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Only 'use' action is supported.",
        },
        { status: 400 }
      );
    }

    const templateIndex = templates.findIndex(t => t.id === params.id);
    
    if (templateIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    // Update usage statistics
    templates[templateIndex] = {
      ...templates[templateIndex],
      usageCount: templates[templateIndex].usageCount + 1,
      lastUsed: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: templates[templateIndex],
      message: "Template usage recorded successfully",
    });
  } catch (error) {
    console.error("Error processing template action:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process template action",
      },
      { status: 500 }
    );
  }
}