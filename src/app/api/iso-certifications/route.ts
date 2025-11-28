/**
 * API Route: ISO Certifications Search
 * Proxies requests to Django backend certifications API
 * GET /api/iso-certifications - Search and list ISO certifications
 */

import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface DjangoCertification {
  id: string;
  certificate_number: string;
  client: {
    id: string;
    name: string;
    industry?: string;
    location?: string;
    website?: string;
    email?: string;
    phone?: string;
  };
  iso_standard: {
    id: number;
    code: string;
    name: string;
    description?: string;
  };
  issue_date: string;
  expiry_date: string;
  status: 'pending' | 'active' | 'expiring-soon' | 'expired' | 'suspended' | 'revoked';
  status_display: string;
  scope: string;
  lead_auditor?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  certification_body?: string;
  accreditation_number?: string;
  days_until_expiry?: number;
  is_expired?: boolean;
  is_expiring_soon?: boolean;
}

interface ISOCertification {
  id: string;
  companyName: string;
  certifications: {
    type: string;
    standard: string;
    status: 'active' | 'expired' | 'pending';
    certificationDate: string;
    expiryDate: string;
    certificateNumber: string;
  }[];
  industry: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  contactInfo: {
    website?: string;
    email?: string;
    phone?: string;
  };
  description: string;
  employees: string;
  yearEstablished: number;
}

/**
 * Transform Django certification data to frontend format
 */
function transformCertification(cert: DjangoCertification): ISOCertification {
  // Parse location from client location string (e.g., "Nairobi, Kenya")
  const locationParts = cert.client.location?.split(',').map(s => s.trim()) || ['', ''];
  const city = locationParts[0] || '';
  const country = locationParts[1] || '';

  return {
    id: cert.id,
    companyName: cert.client.name,
    certifications: [{
      type: cert.iso_standard.code,
      standard: cert.iso_standard.name,
      status: cert.status === 'active' ? 'active' :
              cert.status === 'expired' ? 'expired' : 'pending',
      certificationDate: cert.issue_date,
      expiryDate: cert.expiry_date,
      certificateNumber: cert.certificate_number,
    }],
    industry: cert.client.industry || 'Not specified',
    location: {
      country: country,
      city: city,
      region: country,
    },
    contactInfo: {
      website: cert.client.website,
      email: cert.client.email,
      phone: cert.client.phone,
    },
    description: cert.scope || `${cert.client.name} is certified for ${cert.iso_standard.name}`,
    employees: 'Not specified',
    yearEstablished: new Date().getFullYear(),
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const standard = searchParams.get("standard");
    const status = searchParams.get("status");

    // Build Django API query parameters
    const djangoParams = new URLSearchParams();

    if (search) {
      djangoParams.append('search', search);
    }

    if (standard) {
      // Map frontend standard format to backend
      djangoParams.append('iso_standard__code', standard);
    }

    if (status) {
      djangoParams.append('status', status);
    }

    // Fetch from Django backend public search endpoint (no auth required)
    const djangoUrl = `${DJANGO_API_URL}/certifications/public/search/?${djangoParams.toString()}`;
    console.log('[ISO Certifications API] Fetching from:', djangoUrl);

    const response = await fetch(djangoUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for real-time data
    });

    if (!response.ok) {
      console.error('[ISO Certifications API] Django API error:', response.status, response.statusText);

      // Return empty data instead of throwing error
      // This allows the UI to show "no certifications" instead of error state
      return NextResponse.json({
        success: true,
        data: [],
        meta: {
          total: 0,
          filters: { search, standard, status },
          warning: `Django backend unavailable (${response.status}). Showing empty results.`
        },
      });
    }

    const data = await response.json();
    console.log('[ISO Certifications API] Received data:', data);

    // Transform Django paginated response to frontend format
    const certifications: DjangoCertification[] = data.results || data;
    const transformedData = certifications.map(transformCertification);

    return NextResponse.json({
      success: true,
      data: transformedData,
      meta: {
        total: data.count || transformedData.length,
        filters: {
          search,
          standard,
          status,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching ISO certifications:", error);

    // Return empty data with success=true to prevent UI error state
    // This is better UX than showing an error when backend is unavailable
    return NextResponse.json({
      success: true,
      data: [],
      meta: {
        total: 0,
        filters: {},
        warning: error instanceof Error ? error.message : "Backend unavailable"
      },
    });
  }
}