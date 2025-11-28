/**
 * Audit Management Types
 * Defines all TypeScript interfaces for audit-related data structures
 */

// Audit Status Types
export type AuditStatus = 
  | "scheduled" 
  | "in-progress" 
  | "completed" 
  | "overdue" 
  | "cancelled";

// Audit Type
export type AuditType = 
  | "stage-1" 
  | "stage-2" 
  | "certification"
  | "1st surveillance"
  | "2nd surveillance"
  | "surveillance" 
  | "recertification" 
  | "gap-analysis" 
  | "follow-up";

// Certification Standards
export type CertificationStandard = 
  | "ISO 9001:2015" 
  | "ISO 14001:2015" 
  | "ISO 45001:2018" 
  | "ISO 27001:2013" 
  | "ISO 22000:2018";

// Finding Severity
export type FindingSeverity = "major" | "minor" | "observation";

// Finding Status
export type FindingStatus = 
  | "open" 
  | "corrective-action-requested" 
  | "verification-pending" 
  | "closed";

// Auditor
export interface Auditor {
  id: string;
  name: string;
  email: string;
  phone: string;
  certifications: string[];
  experience: number; // years
  languages: string[];
  utilization: number; // percentage
  satisfaction: number; // 0-5
  status: "available" | "limited" | "fully-booked";
}

// Client Status
export type ClientStatus = "active" | "inactive" | "at-risk" | "churned";

// Client
export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  siteContact?: string;
  sitePhone?: string;
  status?: ClientStatus;
  industry?: string;
  certifications?: CertificationStandard[];
  healthScore?: number; // 0-100
  lastAuditDate?: Date;
  nextAuditDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Client with extended information
export interface ClientDetail extends Client {
  totalAudits: number;
  completedAudits: number;
  pendingAudits: number;
  findings: number;
  nonConformances: number;
  satisfactionScore: number; // 0-5
  contractValue: number;
  paymentStatus: "current" | "overdue" | "pending";
  notes?: string;
}

// Audit Team Member
export interface AuditTeamMember {
  auditorId: string;
  role: "lead" | "supporting" | "technical-expert" | "trainee";
  auditor: Auditor;
}

// Auditee Information
export interface Auditee {
  name: string;
  title?: string;
  contact?: string;
  email?: string;
}

// Audit Finding
export interface AuditFinding {
  id: string;
  auditId: string;
  severity: FindingSeverity;
  clause: string;
  description: string;
  evidence: string;
  loggedBy: string;
  loggedAt: Date;
  status: FindingStatus;
  correctiveAction?: string;
  dueDate?: Date;
}

// Audit Schedule Item
export interface AuditScheduleItem {
  day: number;
  date: Date;
  activity: string;
  startTime: string;
  endTime: string;
  status: "completed" | "in-progress" | "pending";
  notes?: string;
}

// Audit
export interface Audit {
  id: string;
  clientId: string;
  client: Client;
  auditType: AuditType;
  standard: CertificationStandard;
  scope: string;
  objectives?: string[];
  deliverables?: string[];
  contractId?: string;
  status: AuditStatus;
  startDate: Date;
  endDate: Date;
  locations: string[];
  team: AuditTeamMember[];
  auditee?: Auditee;
  findings: AuditFinding[];
  schedule: AuditScheduleItem[];
  progress: number; // percentage
  documents: AuditDocument[];
  notes: AuditNote[];
  createdAt: Date;
  updatedAt: Date;
}

// Audit Document
export interface AuditDocument {
  id: string;
  auditId: string;
  name: string;
  type: "plan" | "checklist" | "evidence" | "report" | "other";
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Audit Note
export interface AuditNote {
  id: string;
  auditId: string;
  content: string;
  author: string;
  createdAt: Date;
}

// Question Validation Rules
export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// Audit Question
export interface AuditQuestion {
  id: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "rating" | "file";
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  actions?: string;
  comments?: string;
  notes?: string;
  validation?: QuestionValidation;
}

// Audit Template
export interface AuditTemplate {
  id: string;
  name: string;
  description?: string;
  standard: CertificationStandard;
  type: "checklist" | "questionnaire" | "report" | "plan";
  category: string;
  questions: AuditQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

// Audit Overview Stats
export interface AuditOverviewStats {
  scheduled: number;
  inProgress: number;
  completedThisMonth: number;
  overdue: number;
  completionTrend: number; // percentage change
}

// Auditor Availability
export interface AuditorAvailability {
  auditorId: string;
  auditor: Auditor;
  thisWeek: number;
  nextWeek: number;
  utilization: number;
}

// Audit Filter Options
export interface AuditFilters {
  status?: AuditStatus[];
  auditType?: AuditType[];
  standard?: CertificationStandard[];
  auditorId?: string;
  clientId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Audit Performance Metrics
export interface AuditPerformanceMetrics {
  avgCompletionTime: number; // days
  onTimeRate: number; // percentage
  clientSatisfaction: number; // 0-5
  reportSubmissionRate: number; // percentage
  completedThisMonth: number;
  nonConformances: number;
  revenueGenerated: number;
}

// Certification Status
export type CertificationStatus =
  | "active"
  | "expired"
  | "expiring-soon"
  | "suspended"
  | "revoked"
  | "pending";

// Certification (API Response format)
export interface Certification {
  id: string;
  certificate_number: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    industry?: string;
  };
  iso_standard: {
    id: number;
    code: string;
    name: string;
    description: string;
  };
  status: CertificationStatus;
  status_display: string;
  issue_date: string;
  expiry_date: string;
  scope?: string;
  certification_body?: string;
  accreditation_number?: string;
  lead_auditor?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  document_url?: string;
  days_until_expiry?: number;
  is_expired?: boolean;
  is_expiring_soon?: boolean;
  created_at: string;
  updated_at: string;

  // Legacy fields for backward compatibility
  clientId?: string;
  clientName?: string;
  standard?: CertificationStandard;
  certificateNumber?: string;
  issueDate?: Date;
  expiryDate?: Date;
  auditType?: AuditType;
  leadAuditor?: string;
  auditorEmail?: string;
  auditorPhone?: string;
  certificationBody?: string;
  accreditationNumber?: string;
  documentUrl?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Certification Filter Options
export interface CertificationFilters {
  status?: CertificationStatus[];
  standard?: CertificationStandard[];
  clientId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Employee Status - matches backend EMPLOYMENT_STATUS
export type EmployeeStatus = "active" | "inactive" | "on-leave" | "terminated" | "resigned";

// Employee Role
export type EmployeeRole =
  | "lead-auditor"
  | "auditor"
  | "technical-expert"
  | "trainee"
  | "manager"
  | "admin";

// Employee
export interface Employee {
  id: string | number;
  employeeId?: string; // Auto-generated unique ID (e.g., EMP00001)
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName?: string; // Computed field from backend
  email: string;
  phone: string;
  role?: EmployeeRole | string;
  department: string;
  status: EmployeeStatus;
  hireDate: Date | string;

  // Additional personal info
  dateOfBirth?: Date | string;
  gender?: string;
  nationalId?: string;
  passportNumber?: string;

  // Contact
  emergencyContact?: string;
  emergencyPhone?: string;

  // Address
  address?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  state?: string;
  zipCode?: string;

  // Professional
  certifications?: CertificationStandard[] | string[];
  experience?: number; // years
  languages?: string[];
  utilization?: number; // percentage
  satisfaction?: number; // 0-5

  // Employment details
  employmentType?: string;
  positionId?: number;
  positionTitle?: string;
  terminationDate?: Date | string;

  // Compensation
  baseSalary?: number;
  currency?: string;
  work_hours_per_week?: number;

  // Commission settings for auditors
  commissionEnabled?: boolean;
  commissionRate?: number; // rate per audit
  auditCount?: number; // total audits completed

  // Metadata
  manager?: string; // manager ID
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Related data
  skills?: any[];
}

// Employee Filter Options
export interface EmployeeFilters {
  status?: EmployeeStatus[];
  role?: EmployeeRole[];
  department?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Payroll Status
export type PayrollStatus = "draft" | "pending" | "approved" | "paid" | "cancelled";

// Pay Period Type
export type PayPeriodType = "daily" | "weekly" | "bi-weekly" | "monthly" | "dynamic";

// Payment Method
export type PaymentMethod = "bank-transfer" | "check" | "cash" | "direct-deposit";

// Earning Type
export type EarningType = "base-salary" | "overtime" | "bonus" | "allowance" | "commission" | "audit-commission";

// Deduction Type
export type DeductionType = "tax" | "insurance" | "retirement" | "loan" | "other";

// Earning Entry
export interface Earning {
  type: EarningType;
  description: string;
  amount: number;
}

// Deduction Entry
export interface Deduction {
  type: DeductionType;
  description: string;
  amount: number;
}

// Payroll Record
export interface Payroll {
  id: string;
  employeeId: string;
  employeeName?: string;
  department?: string;
  payPeriod: PayPeriodType;
  startDate: Date;
  endDate: Date;
  baseSalary: number;
  earnings: Earning[];
  deductions: Deduction[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: PayrollStatus;
  paymentMethod: PaymentMethod;
  paymentDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
  processedDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Payroll Filter Options
export interface PayrollFilters {
  status?: PayrollStatus[];
  payPeriod?: PayPeriodType[];
  employeeId?: string;
  department?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Payroll Statistics
export interface PayrollStats {
  totalPayroll: number;
  pendingPayments: number;
  completedPayments: number;
  averageSalary: number;
  totalEmployees: number;
}

// Pay Cycle Status
export type PayCycleStatus = "draft" | "active" | "closed" | "archived";

// Pay Cycle
export interface PayCycle {
  id: string;
  name: string;
  description?: string;
  payPeriodType: PayPeriodType;
  startDate: Date;
  endDate: Date;
  paymentDate: Date;
  status: PayCycleStatus;
  employeeCount?: number;
  totalPayroll?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  closedAt?: Date;
  notes?: string;
}

// Pay Cycle Filter Options
export interface PayCycleFilters {
  status?: PayCycleStatus[];
  payPeriodType?: PayPeriodType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Pay Cycle Statistics
export interface PayCycleStats {
  totalCycles: number;
  activeCycles: number;
  closedCycles: number;
  totalPayrollAmount: number;
}

// ============================================
// TASK MANAGEMENT TYPES
// ============================================

// Task Status
export type TaskStatus = "pending" | "in-progress" | "completed" | "cancelled" | "on-hold";

// Task Priority
export type TaskPriority = "low" | "medium" | "high" | "critical";

// Task Category
export type TaskCategory =
  | "invoicing"
  | "sales"
  | "audit-scheduling"
  | "compliance"
  | "hr"
  | "reporting"
  | "vendor-payments"
  | "approvals"
  | "follow-ups"
  | "other";

// Task Progress
export type TaskProgress = "not-started" | "in-progress" | "blocked" | "completed";

// Reminder Channel
export type ReminderChannel = "email" | "mobile" | "sms" | "in-app" | "phone-call";

// Recurrence Type
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

// Subtask
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  assignedTo?: string;
}

// Task Reminder
export interface TaskReminder {
  id: string;
  type: "email" | "mobile" | "sms" | "in-app";
  triggerTime: number; // minutes before due date
  enabled: boolean;
  sent?: boolean;
  sentAt?: Date;
}

// Task Activity Log Entry
export interface TaskActivityLog {
  id: string;
  taskId: string;
  action: string;
  changedBy: string;
  changedAt: Date;
  oldValue?: string;
  newValue?: string;
  details?: string;
}

// Task Comment
export interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  mentions?: string[]; // user IDs
}

// Task
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  progress: TaskProgress;

  // Assignment
  assignedTo?: string; // user ID or team ID
  assignedToName?: string;
  createdBy?: string;
  createdByName?: string;

  // Dates
  dueDate: Date;
  dueTime?: string; // HH:mm format
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;

  // Relations
  relatedAuditId?: string;
  relatedClientId?: string;
  relatedContractId?: string;
  relatedOpportunityId?: string;

  // Details
  subtasks?: Subtask[];
  reminders?: TaskReminder[];
  activityLog?: TaskActivityLog[];
  comments?: TaskComment[];

  // Recurrence
  recurrence?: RecurrenceType;
  recurrenceEndDate?: Date;
  recurrencePattern?: string;
  recurrenceInterval?: number; // e.g., every 2 weeks
  recurrenceDays?: number[]; // for weekly: 0=Monday, 1=Tuesday, etc.
  monthlyPattern?: "day-of-month" | "day-of-week"; // for monthly recurrence

  // Additional
  tags?: string[];
  attachments?: string[]; // file URLs
  notes?: string;
}

// Task Overview Stats
export interface TaskOverviewStats {
  myTasks: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  completed: number;
  inProgress: number;
}

// Task Filter Options
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: TaskCategory[];
  assignedTo?: string;
  dueDate?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  relatedAuditId?: string;
  relatedClientId?: string;
}

// Task Template
export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  category: TaskCategory;
  tasks: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy">[];
  typicalDuration?: number; // days
  usageCount?: number;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Task Analytics
export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  onTimeCompletion: number; // percentage
  overdueCount: number;
  averageCompletionTime: number; // days
  completionTrend: number; // percentage change
  tasksByCategory: Record<TaskCategory, number>;
  tasksByAssignee: Record<string, number>;
  tasksByPriority: Record<TaskPriority, number>;
}

// Reminder Rule
export interface ReminderRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: string; // e.g., "2 days before", "1 hour before"
  recipients: string[]; // user IDs
  channels: ReminderChannel[];
  emailTemplate?: string;
  escalation?: {
    enabled: boolean;
    escalateAfter: number; // hours
    escalateTo: string[]; // user IDs
  };
  createdAt: Date;
  updatedAt: Date;
}

