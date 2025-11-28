/**
 * API Route: Company Autofill Data
 * GET /api/company/autofill - Get company autofill data for forms
 */

import { NextResponse } from "next/server";
import { GetCompanyAutofillResponse, CompanyProfile } from "@/types/company";

// Reference to the same company profile storage as profile route
// In a real app, this would be a database query
let companyProfile: CompanyProfile | null = null;

// GET - Get company autofill data
export async function GET() {
  try {
    // In production, this would:
    // 1. Verify user authentication
    // 2. Get user's organization ID
    // 3. Query database for company profile
    // 4. Return subset of data for autofill

    if (!companyProfile) {
      const response: GetCompanyAutofillResponse = {
        success: false,
        error: "Company profile not found. Please complete the initial setup first.",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const autofillData = {
      companyName: companyProfile.companyName,
      email: companyProfile.email,
      phone: companyProfile.phone,
      address: companyProfile.address,
      city: companyProfile.city,
      country: companyProfile.country,
      website: companyProfile.website,
      industry: companyProfile.industry,
      registrationNumber: companyProfile.registrationNumber,
      taxId: companyProfile.taxId,
    };

    const response: GetCompanyAutofillResponse = {
      success: true,
      data: autofillData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching company autofill data:", error);
    const response: GetCompanyAutofillResponse = {
      success: false,
      error: "Failed to fetch company autofill data",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

