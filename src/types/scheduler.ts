/**
 * Scheduler Types
 * Defines all TypeScript interfaces for scheduler-related data structures
 */

// Scheduler Item Type
export type SchedulerItemType = "task" | "audit-activity" | "checklist" | "workflow";

// Scheduler View Mode
export type SchedulerViewMode = "kanban" | "calendar" | "list";

// Time Period Filter
export type TimePeriod = "today" | "week" | "month";

// Priority Level
export type Priority = "critical" | "high" | "medium" | "low";

// Status
export type SchedulerItemStatus = 
  | "not-started" 
  | "in-progress" 
  | "review" 
  | "completed" 
  | "blocked" 
  | "overdue";

// Base Scheduler Item
export interface BaseSchedulerItem {
  id: string;
  title: string;
  description?: string;
  type: SchedulerItemType;
  status: SchedulerItemStatus;
  priority: Priority;
  assignedTo?: string;
  assignedToName?: string;
  createdBy?: string;
  createdByName?: string;
  dueDate: Date;
  dueTime?: string;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  tags?: string[];
  attachments?: string[];
  comments?: SchedulerComment[];
  dependencies?: string[]; // IDs of dependent items
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Task Item
export interface TaskItem extends BaseSchedulerItem {
  type: "task";
  category: "invoicing" | "reporting" | "sales" | "compliance" | "approvals" | "follow-ups" | "other";
  relatedAuditId?: string;
  relatedClientId?: string;
  relatedContractId?: string;
  subtasks?: Subtask[];
  recurrence?: {
    type: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: Date;
  };
}

// Audit Activity Item
export interface AuditActivityItem extends BaseSchedulerItem {
  type: "audit-activity";
  auditId: string;
  clientId: string;
  clientName: string;
  standard: string;
  location?: string;
  activityType: "preparation" | "site-visit" | "documentation" | "report-writing" | "follow-up";
  stage?: "stage-1" | "stage-2" | "surveillance" | "recertification";
  leadAuditor?: string;
  teamMembers?: string[];
  equipment?: string[];
  documents?: string[];
}

// Checklist Item
export interface ChecklistItem extends BaseSchedulerItem {
  type: "checklist";
  templateId?: string;
  templateName?: string;
  auditId?: string;
  clientId?: string;
  standard?: string;
  items: ChecklistSubItem[];
  completionRate: number; // percentage
  mustCompleteBy?: Date;
}

// Workflow Item
export interface WorkflowItem extends BaseSchedulerItem {
  type: "workflow";
  workflowType: "audit-process" | "certification" | "client-onboarding" | "compliance-check" | "review-process";
  steps: WorkflowStep[];
  currentStep: number;
  completionRate: number; // percentage
  approvalRequired?: boolean;
  approver?: string;
  approvedAt?: Date;
}

// Supporting Interfaces
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  assignedTo?: string;
}

export interface ChecklistSubItem {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  completed: boolean;
  completedAt?: Date;
  evidence?: string[];
  notes?: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: "pending" | "in-progress" | "completed" | "skipped";
  dueDate?: Date;
  completedAt?: Date;
  approvalRequired?: boolean;
  dependencies?: string[];
}

export interface SchedulerComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  mentions?: string[];
}

// Union Type for All Scheduler Items
export type SchedulerItem = TaskItem | AuditActivityItem | ChecklistItem | WorkflowItem;

// Scheduler Filter Options
export interface SchedulerFilters {
  type?: SchedulerItemType[];
  status?: SchedulerItemStatus[];
  priority?: Priority[];
  assignedTo?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  tags?: string[];
}

// Scheduler Statistics
export interface SchedulerStats {
  total: number;
  byStatus: Record<SchedulerItemStatus, number>;
  byType: Record<SchedulerItemType, number>;
  byPriority: Record<Priority, number>;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  completionRate: number; // percentage
}

// Kanban Column
export interface KanbanColumn {
  id: string;
  title: string;
  status: SchedulerItemStatus;
  items: SchedulerItem[];
  color?: string;
  limit?: number;
}

// Calendar Event
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: SchedulerItemType;
  status: SchedulerItemStatus;
  priority: Priority;
  description?: string;
  assignedTo?: string;
  item: SchedulerItem;
}

// Drag and Drop Context
export interface DragDropContext {
  sourceColumn: string;
  destinationColumn: string;
  itemId: string;
  newStatus: SchedulerItemStatus;
}