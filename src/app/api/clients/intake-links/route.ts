/**
 * API Route: Client Intake Links Management
 * GET /api/clients/intake-links - List all intake links
 * POST /api/clients/intake-links - Create new intake link
 *
 * This route now proxies to the Django backend with PostgreSQL database.
 */

import { NextRequest, NextResponse } from "next/server";
import { CreateIntakeLinkRequest, CreateIntakeLinkResponse, ClientIntakeLink } from "@/types/client-intake";
import { generateIntakeUrl } from "@/lib/intake-utils";
import { fetchIntakeLinks, createIntakeLink, DjangoIntakeLink } from "@/lib/django-api";

/**
 * Convert Django intake link to frontend format
 */
function convertDjangoLinkToFrontend(djangoLink: DjangoIntakeLink): ClientIntakeLink {
  // Map Django status to frontend status
  // Django: 'active' | 'expired' | 'exhausted' | 'inactive'
  // Frontend: 'active' | 'expired' | 'exhausted' | 'revoked'
  const statusMap: Record<string, 'active' | 'expired' | 'exhausted' | 'revoked'> = {
    'active': 'active',
    'expired': 'expired',
    'exhausted': 'exhausted',
    'inactive': 'revoked',
  };

  return {
    id: djangoLink.id.toString(),
    linkToken: djangoLink.token,
    accessCode: djangoLink.access_code,
    createdBy: djangoLink.created_by?.toString() || '',
    createdByName: djangoLink.created_by_name || 'System',
    createdAt: djangoLink.created_at,
    expiresAt: djangoLink.expires_at,
    isActive: djangoLink.is_active,
    maxUses: djangoLink.max_uses,
    currentUses: djangoLink.current_uses,
    status: statusMap[djangoLink.status] || 'revoked',
    metadata: djangoLink.metadata,
    relatedAuditId: djangoLink.related_audit_id || undefined,
    relatedProjectId: djangoLink.related_project_id || undefined,
    relatedAuditName: undefined,
    relatedProjectName: undefined,
    lastAccessedAt: djangoLink.last_accessed_at || undefined,
    updatedAt: djangoLink.updated_at,
    notes: djangoLink.notes,
    submissionsCount: djangoLink.submissions_count,
  };
}

// GET - List all intake links
export async function GET(request: NextRequest) {
  try {
    // Fetch links from Django backend
    const djangoLinks = await fetchIntakeLinks();

    // Convert to frontend format
    const links = djangoLinks.map(convertDjangoLinkToFrontend);

    // Get query parameters for filtering (optional client-side filtering)
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status");
    const search = searchParams.get("search");

    let filteredLinks = links;

    if (statusFilter && statusFilter !== "all") {
      filteredLinks = filteredLinks.filter(link => link.status === statusFilter);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredLinks = filteredLinks.filter(link =>
        link.notes?.toLowerCase().includes(searchLower) ||
        link.accessCode.toLowerCase().includes(searchLower) ||
        link.createdByName?.toLowerCase().includes(searchLower)
      );
    }
    return NextResponse.json({
      success: true,
      data: filteredLinks,
      meta: {
        total: filteredLinks.length,
        page: 1,
        limit: 50,
      },
    });
  } catch (error) {
    console.error("Error fetching intake links:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch intake links",
      },
      { status: 500 }
    );
  }
}

// POST - Create new intake link
export async function POST(request: NextRequest) {
  try {
    const body: CreateIntakeLinkRequest = await request.json();
    const { config } = body;

    // Calculate expiration date
    const expiresInHours = config.expiresInHours || 168; // Default: 7 days
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    // Create link in Django backend
    const djangoLink = await createIntakeLink({
      title: config.notes || '',
      description: config.notes || '',
      expires_at: expiresAt.toISOString(),
      max_uses: config.maxUses || 1,
      related_audit_id: config.relatedAuditId,
      related_project_id: config.relatedProjectId,
      notes: config.notes || '',
      metadata: config.metadata || {},
    });

    // Convert to frontend format
    const newLink = convertDjangoLinkToFrontend(djangoLink);

    // Generate full URL
    const fullUrl = generateIntakeUrl(newLink.linkToken, request.nextUrl.origin);

    const response: CreateIntakeLinkResponse = {
      success: true,
      data: {
        link: newLink,
        fullUrl,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating intake link:", error);
    const response: CreateIntakeLinkResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create intake link",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
