/**
 * Consulting Project Management Types
 * Defines all TypeScript interfaces for consulting-related data structures
 */

// Project Status Types
export type ProjectStatus = 
  | "discovery" 
  | "planning" 
  | "execution" 
  | "closeout" 
  | "on-hold" 
  | "completed";

// Project Health Status
export type ProjectHealth = "on-track" | "at-risk" | "behind";

// Project Phase
export type ProjectPhase = 
  | "discovery" 
  | "planning" 
  | "execution" 
  | "closeout";

// Resource Allocation Type
export type ResourceAllocationType = 
  | "billable" 
  | "admin" 
  | "training" 
  | "bench";

// Milestone Status
export type MilestoneStatus = 
  | "upcoming" 
  | "in-progress" 
  | "completed" 
  | "overdue";

// Consultant
export interface Consultant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  skills: string[];
  experience: number; // years
  utilization: number; // percentage
  currentProjects: number;
  avatar?: string;
}

// Project
export interface ConsultingProject {
  id: string;
  name: string;
  client: string;
  clientId: string;
  description: string;
  scope: string;
  objectives: string[];
  deliverables: string[];
  status: ProjectStatus;
  health: ProjectHealth;
  phase: ProjectPhase;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  contractValue: number;
  recognizedRevenue: number;
  remainingRevenue: number;
  projectManager: string;
  projectManagerId: string;
  teamMembers: string[];
  teamMemberIds: string[];
  impact: "high" | "medium" | "low";
  risk: "high" | "medium" | "low";
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Milestone
export interface Milestone {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
  assignee: string;
  assigneeId: string;
  deliverables: string[];
  completionPercentage: number;
}

// Resource Allocation
export interface ResourceAllocation {
  consultantId: string;
  consultantName: string;
  projectId: string;
  projectName: string;
  allocationType: ResourceAllocationType;
  hoursAllocated: number;
  startDate: string;
  endDate: string;
}

// Client
export interface ConsultingClient {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  activeProjects: number;
  totalRevenue: number;
  yearToDateRevenue: number;
  status: "active" | "inactive" | "prospect";
  since: string;
  logo?: string;
}

// Portfolio Stats
export interface PortfolioStats {
  totalProjects: number;
  totalValue: number;
  averageValue: number;
  onTrack: number;
  atRisk: number;
  behind: number;
  onTrackPercentage: number;
  atRiskPercentage: number;
  behindPercentage: number;
}

// Phase Distribution
export interface PhaseDistribution {
  phase: ProjectPhase;
  count: number;
  percentage: number;
}

// Completion Distribution
export interface CompletionDistribution {
  range: string;
  count: number;
}

// Financial Summary
export interface FinancialSummary {
  totalContractValue: number;
  recognizedToDate: number;
  recognizedPercentage: number;
  remainingRevenue: number;
  remainingPercentage: number;
  atRiskRevenue: number;
  atRiskPercentage: number;
}

// Resource Demand
export interface ResourceDemand {
  month: string;
  consultantsNeeded: number;
  currentTeam: number;
  gap: number;
}

// Revenue Trend
export interface RevenueTrend {
  month: string;
  recognized: number;
  invoiced: number;
  collected: number;
}

// Team Workload
export interface TeamWorkload {
  consultantId: string;
  consultantName: string;
  projectCount: number;
  utilization: number;
  status: "available" | "optimal" | "overallocated";
}

// Dashboard KPI
export interface ConsultingKPI {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
}

// Project Health Matrix Item
export interface ProjectHealthMatrixItem {
  projectId: string;
  projectName: string;
  client: string;
  health: ProjectHealth;
  value: number;
  impact: "high" | "medium" | "low";
  risk: "high" | "medium" | "low";
  position: {
    x: number; // risk level (0-100)
    y: number; // impact level (0-100)
  };
}

// Filters
export interface ConsultingProjectFilters {
  search: string;
  status: ProjectStatus | "all";
  health: ProjectHealth | "all";
  phase: ProjectPhase | "all";
  client: string | "all";
  projectManager: string | "all";
}

// Stats for Dashboard
export interface ConsultingDashboardStats {
  activeProjects: number;
  totalRevenue: number;
  utilization: number;
  quarterRevenue: number;
  activeProjectsChange: string;
  totalRevenueChange: string;
  utilizationChange: string;
  quarterRevenueChange: string;
}

// Project Template
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  scope: string;
  objectives: string[];
  category: string;
  duration: number; // in months
  budget: string;
  phases: string[];
  deliverables: string[];
  teamSize: number;
  usageCount: number;
  lastUsed: string;
  createdBy: string;
  createdDate: string;
  updatedAt: string;
  tags?: string[];
}

