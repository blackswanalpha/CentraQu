/**
 * API Route: Company Profile
 * GET /api/company/profile - Get company profile
 * PUT /api/company/profile - Update company profile
 */

import { NextRequest, NextResponse } from "next/server";
import { GetCompanyProfileResponse, UpdateCompanyProfileResponse, CompanyProfile } from "@/types/company";

// Temporary in-memory storage (replace with database)
let companyProfile: CompanyProfile | null = null;

// GET - Get company profile
export async function GET() {
  try {
    // In production, this would:
    // 1. Verify user authentication
    // 2. Get user's organization ID
    // 3. Query database for company profile
    // 4. Return profile data

    if (!companyProfile) {
      const response: GetCompanyProfileResponse = {
        success: false,
        error: "Company profile not found. Please complete the initial setup.",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: GetCompanyProfileResponse = {
      success: true,
      data: companyProfile,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching company profile:", error);
    const response: GetCompanyProfileResponse = {
      success: false,
      error: "Failed to fetch company profile",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update company profile
export async function PUT(request: NextRequest) {
  try {
    const updates: Partial<CompanyProfile> = await request.json();

    // In production, this would:
    // 1. Verify user authentication and permissions
    // 2. Validate input data
    // 3. Update database record
    // 4. Return updated profile

    // Validate required fields
    if (updates.companyName && updates.companyName.trim().length === 0) {
      const response: UpdateCompanyProfileResponse = {
        success: false,
        error: "Company name is required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (updates.email && !isValidEmail(updates.email)) {
      const response: UpdateCompanyProfileResponse = {
        success: false,
        error: "Invalid email address",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Update or create profile
    if (!companyProfile) {
      // Create new profile if none exists
      companyProfile = {
        id: `company-${Date.now()}`,
        companyName: updates.companyName || '',
        legalName: updates.legalName || '',
        registrationNumber: updates.registrationNumber || '',
        taxId: updates.taxId || '',
        companyType: updates.companyType || 'both',
        industry: updates.industry || '',
        companySize: updates.companySize || '1-10',
        email: updates.email || '',
        phone: updates.phone || '',
        website: updates.website || '',
        address: updates.address || '',
        city: updates.city || '',
        state: updates.state || '',
        postalCode: updates.postalCode || '',
        country: updates.country || 'Kenya',
        description: updates.description || '',
        established: updates.established || '',
        certifications: updates.certifications || [],
        accreditationBodies: updates.accreditationBodies || [],
        linkedIn: updates.linkedIn || '',
        twitter: updates.twitter || '',
        facebook: updates.facebook || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        ...updates,
      };
    } else {
      // Update existing profile
      companyProfile = {
        ...companyProfile,
        ...updates,
        updatedAt: new Date(),
      };
    }

    const response: UpdateCompanyProfileResponse = {
      success: true,
      data: companyProfile,
      message: "Company profile updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating company profile:", error);
    const response: UpdateCompanyProfileResponse = {
      success: false,
      error: "Failed to update company profile",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Helper function for email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

