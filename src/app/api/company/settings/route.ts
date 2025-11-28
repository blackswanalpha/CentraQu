/**
 * API Route: Company Settings
 * GET /api/company/settings - Get company settings
 * PUT /api/company/settings - Update company settings
 */

import { NextRequest, NextResponse } from "next/server";
import { CompanySettings } from "@/types/company";

// Temporary in-memory storage (replace with database)
let companySettings: CompanySettings | null = null;

interface GetCompanySettingsResponse {
  success: boolean;
  data?: CompanySettings;
  error?: string;
}

interface UpdateCompanySettingsResponse {
  success: boolean;
  data?: CompanySettings;
  error?: string;
  message?: string;
}

// GET - Get company settings
export async function GET() {
  try {
    if (!companySettings) {
      // Return default settings if none exist
      const defaultSettings: CompanySettings = {
        id: 'settings-default',
        companyId: 'company-default',
        timezone: 'Africa/Nairobi',
        currency: 'KES',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        fiscalYearStart: '01-01',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '08:00',
          end: '17:00',
        },
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        enableClientPortal: true,
        enableAutomatedReminders: true,
        enableIntegrations: true,
        primaryColor: '#1565C0',
        secondaryColor: '#FB8C00',
        updatedAt: new Date(),
        updatedBy: 'system',
      };
      companySettings = defaultSettings;
    }

    const response: GetCompanySettingsResponse = {
      success: true,
      data: companySettings,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching company settings:", error);
    const response: GetCompanySettingsResponse = {
      success: false,
      error: "Failed to fetch company settings",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update company settings
export async function PUT(request: NextRequest) {
  try {
    const updates: Partial<CompanySettings> = await request.json();

    // Initialize settings if they don't exist
    if (!companySettings) {
      const defaultSettings: CompanySettings = {
        id: 'settings-default',
        companyId: 'company-default',
        timezone: 'Africa/Nairobi',
        currency: 'KES',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        fiscalYearStart: '01-01',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '08:00',
          end: '17:00',
        },
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        enableClientPortal: true,
        enableAutomatedReminders: true,
        enableIntegrations: true,
        primaryColor: '#1565C0',
        secondaryColor: '#FB8C00',
        updatedAt: new Date(),
        updatedBy: 'system',
      };
      companySettings = defaultSettings;
    }

    // Update settings
    companySettings = {
      ...companySettings,
      ...updates,
      updatedAt: new Date(),
    };

    const response: UpdateCompanySettingsResponse = {
      success: true,
      data: companySettings,
      message: "Company settings updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating company settings:", error);
    const response: UpdateCompanySettingsResponse = {
      success: false,
      error: "Failed to update company settings",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

