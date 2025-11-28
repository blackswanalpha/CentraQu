/**
 * Client Intake Form Types
 * Defines all TypeScript interfaces for client intake link and submission management
 *
 * Note: Date fields are defined as Date | string to handle both:
 * - Server-side: Date objects
 * - Client-side: ISO string from API responses (JSON serialization)
 */

import { Client } from "./audit";

// Link Status
export type IntakeLinkStatus = "active" | "expired" | "exhausted" | "revoked";

// Submission Status
export type SubmissionStatus = "pending" | "approved" | "rejected";

// Client Intake Link
export interface ClientIntakeLink {
  id: string;
  linkToken: string;
  accessCode: string;
  createdBy: string;
  createdByName?: string;
  createdAt: Date | string;
  expiresAt: Date | string;
  isActive: boolean;
  maxUses: number;
  currentUses: number;
  status: IntakeLinkStatus;
  metadata?: Record<string, any>;

  // Optional: Link to specific project/audit
  relatedAuditId?: string;
  relatedProjectId?: string;
  relatedAuditName?: string;
  relatedProjectName?: string;

  // Tracking
  lastAccessedAt?: Date | string;
  updatedAt?: Date | string;

  // Internal notes
  notes?: string;
}

// Client Intake Submission
export interface ClientIntakeSubmission {
  id: string;
  linkId: string;
  link?: ClientIntakeLink;
  clientId?: string;
  submissionData: Client;
  submittedAt: Date | string;
  ipAddress?: string;
  userAgent?: string;
  status: SubmissionStatus;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: Date | string;
  notes?: string;
  rejectionReason?: string;
}

// Configuration for creating intake links
export interface IntakeLinkConfig {
  expiresInHours?: number; // Default: 168 (7 days)
  maxUses?: number; // Default: 1
  relatedAuditId?: string;
  relatedProjectId?: string;
  metadata?: Record<string, any>;
  notes?: string;
}

// Request/Response types for API

// Create Link Request
export interface CreateIntakeLinkRequest {
  config: IntakeLinkConfig;
}

// Create Link Response
export interface CreateIntakeLinkResponse {
  success: boolean;
  data?: {
    link: ClientIntakeLink;
    fullUrl: string;
  };
  error?: string;
}

// Validate Link Request
export interface ValidateIntakeLinkRequest {
  linkToken: string;
  accessCode: string;
}

// Validate Link Response
export interface ValidateIntakeLinkResponse {
  success: boolean;
  data?: {
    isValid: boolean;
    link?: Partial<ClientIntakeLink>;
    message?: string;
  };
  error?: string;
}

// Submit Intake Form Request
export interface SubmitIntakeFormRequest {
  linkToken: string;
  accessCode: string;
  clientData: Omit<Client, "id" | "createdAt" | "updatedAt">;
}

// Submit Intake Form Response
export interface SubmitIntakeFormResponse {
  success: boolean;
  data?: {
    submissionId: string;
    message: string;
  };
  error?: string;
}

// Review Submission Request
export interface ReviewSubmissionRequest {
  submissionId: string;
  action: "approve" | "reject";
  notes?: string;
  rejectionReason?: string;
}

// Review Submission Response
export interface ReviewSubmissionResponse {
  success: boolean;
  data?: {
    submission: ClientIntakeSubmission;
    clientId?: string;
    message: string;
  };
  error?: string;
}

// List Links Filter
export interface IntakeLinksFilter {
  status?: IntakeLinkStatus[];
  createdBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// List Submissions Filter
export interface SubmissionsFilter {
  status?: SubmissionStatus[];
  linkId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Statistics
export interface IntakeStats {
  totalLinks: number;
  activeLinks: number;
  expiredLinks: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  conversionRate: number; // percentage of links that resulted in submissions
}

// Link with submission count
export interface IntakeLinkWithStats extends ClientIntakeLink {
  submissionCount: number;
  pendingSubmissionCount: number;
  approvedSubmissionCount: number;
}

