/**
 * Company Profile Types
 * Defines TypeScript interfaces for company information and settings
 */

// Company Size Options
export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";

// Company Type
export type CompanyType = "audit" | "consulting" | "both";

// Industry Options
export type Industry =
  | "Manufacturing"
  | "Healthcare"
  | "Technology"
  | "Finance"
  | "Education"
  | "Construction"
  | "Retail"
  | "Hospitality"
  | "Transportation"
  | "Energy"
  | "Agriculture"
  | "Real Estate"
  | "Professional Services"
  | "Government"
  | "Non-Profit"
  | "Other";

// Country/Region
export type Country = "Kenya" | "Uganda" | "Tanzania" | "Rwanda" | "Other";

// Company Profile
export interface CompanyProfile {
  id: string;
  
  // Basic Information
  companyName: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  companyType: CompanyType;
  industry: Industry;
  companySize: CompanySize;
  
  // Contact Information
  email: string;
  phone: string;
  website?: string;
  
  // Address Information
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: Country;
  
  // Additional Details
  description?: string;
  logo?: string;
  established?: Date | string;
  
  // Certifications & Accreditations
  certifications?: string[];
  accreditationBodies?: string[];
  
  // Social Media
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  
  // System Fields
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy?: string;
}

// Company Settings
export interface CompanySettings {
  id: string;
  companyId: string;
  
  // General Settings
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  
  // Business Settings
  fiscalYearStart: string; // MM-DD format
  workingDays: string[]; // ["Monday", "Tuesday", ...]
  workingHours: {
    start: string; // HH:mm format
    end: string;
  };
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Feature Flags
  enableClientPortal: boolean;
  enableAutomatedReminders: boolean;
  enableIntegrations: boolean;
  
  // Branding
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  
  // System Fields
  updatedAt: Date | string;
  updatedBy?: string;
}

// Company Autofill Data (subset of CompanyProfile for forms)
export interface CompanyAutofillData {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: Country;
  website?: string;
  industry?: Industry;
  registrationNumber?: string;
  taxId?: string;
}

// API Response Types
export interface GetCompanyProfileResponse {
  success: boolean;
  data?: CompanyProfile;
  error?: string;
}

export interface UpdateCompanyProfileResponse {
  success: boolean;
  data?: CompanyProfile;
  error?: string;
  message?: string;
}

export interface GetCompanyAutofillResponse {
  success: boolean;
  data?: CompanyAutofillData;
  error?: string;
}

// Form Data Types
export interface CompanyProfileFormData extends Omit<CompanyProfile, "id" | "createdAt" | "updatedAt" | "createdBy"> {
  // All fields from CompanyProfile except system fields
}

export interface CompanySettingsFormData extends Omit<CompanySettings, "id" | "companyId" | "updatedAt" | "updatedBy"> {
  // All fields from CompanySettings except system fields
}

// Constants
export const COMPANY_SIZES: CompanySize[] = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export const INDUSTRIES: Industry[] = [
  "Manufacturing",
  "Healthcare",
  "Technology",
  "Finance",
  "Education",
  "Construction",
  "Retail",
  "Hospitality",
  "Transportation",
  "Energy",
  "Agriculture",
  "Real Estate",
  "Professional Services",
  "Government",
  "Non-Profit",
  "Other",
];

export const COUNTRIES: Country[] = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Other"];

export const COMPANY_TYPES: { value: CompanyType; label: string }[] = [
  { value: "audit", label: "Audit & Certification" },
  { value: "consulting", label: "Consulting Services" },
  { value: "both", label: "Both Audit & Consulting" },
];

export const TIMEZONES = [
  { value: "Africa/Nairobi", label: "East Africa Time (EAT)" },
  { value: "Africa/Lagos", label: "West Africa Time (WAT)" },
  { value: "Africa/Cairo", label: "Eastern European Time (EET)" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
];

export const CURRENCIES = [
  { value: "KES", label: "Kenyan Shilling (KES)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "UGX", label: "Ugandan Shilling (UGX)" },
  { value: "TZS", label: "Tanzanian Shilling (TZS)" },
];

export const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export const WORKING_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

