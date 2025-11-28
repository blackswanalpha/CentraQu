/**
 * API Route: Consulting Projects Management
 * GET /api/consulting/projects - List all consulting projects with filtering
 * POST /api/consulting/projects - Create new consulting project
 */

import { NextRequest, NextResponse } from "next/server";
import { ConsultingProject, ProjectStatus, ProjectHealth, ProjectPhase } from "@/types/consulting";

// Temporary in-memory storage (replace with database)
let projects: ConsultingProject[] = [
  {
    id: "PRJ-2025-042",
    name: "DEF Inc - Process Optimization",
    client: "DEF Inc",
    clientId: "client-def-inc",
    description: "Comprehensive process optimization initiative focusing on efficiency improvements and cost reduction across key business operations.",
    scope: "Review and optimize current business processes across manufacturing, supply chain, and customer service departments. Analyze workflow inefficiencies, identify bottlenecks, and implement automation solutions where applicable.",
    objectives: [
      "Reduce operational costs by 15-20% within 6 months",
      "Improve process efficiency by 25% across targeted departments", 
      "Implement automated workflows for routine tasks",
      "Establish KPIs and monitoring systems for continuous improvement",
      "Train staff on new processes and systems"
    ],
    deliverables: [
      "Current state process analysis report",
      "Future state process design documents", 
      "Cost-benefit analysis and ROI projections",
      "Implementation roadmap and timeline",
      "Staff training materials and sessions",
      "Performance monitoring dashboard"
    ],
    status: "execution",
    health: "behind",
    phase: "execution",
    startDate: "2025-06-01",
    endDate: "2025-10-31",
    completionPercentage: 65,
    contractValue: 58000,
    recognizedRevenue: 37700,
    remainingRevenue: 20300,
    projectManager: "Linda Peterson",
    projectManagerId: "pm-linda-peterson",
    teamMembers: ["Linda Peterson", "John Smith", "Emma Wilson"],
    teamMemberIds: ["pm-linda-peterson", "consultant-john-smith", "consultant-emma-wilson"],
    impact: "medium",
    risk: "high",
    tags: ["process-optimization", "efficiency", "cost-reduction"],
    createdAt: "2025-05-15T10:00:00Z",
    updatedAt: "2025-10-25T15:30:00Z",
  },
  {
    id: "PRJ-2025-041",
    name: "ABC Corp - Strategic Planning",
    client: "ABC Corporation",
    clientId: "client-abc-corp",
    description: "6-month strategic planning engagement including market analysis, competitive assessment, and strategic roadmap development.",
    scope: "Conduct comprehensive strategic planning review covering market positioning, competitive landscape, growth opportunities, and organizational capabilities. Develop 3-year strategic roadmap with actionable initiatives and measurable goals.",
    objectives: [
      "Define clear strategic vision and mission statements",
      "Identify key growth opportunities in target markets",
      "Develop competitive positioning strategy",
      "Create 3-year financial projections and targets",
      "Establish performance metrics and monitoring systems",
      "Align organizational structure with strategic goals"
    ],
    deliverables: [
      "Market analysis and competitive landscape report",
      "SWOT analysis and strategic positioning framework", 
      "3-year strategic roadmap and implementation plan",
      "Financial forecasts and budget recommendations",
      "Organizational restructuring recommendations",
      "Strategic KPI dashboard and monitoring tools"
    ],
    status: "execution",
    health: "on-track",
    phase: "execution",
    startDate: "2025-05-01",
    endDate: "2025-10-31",
    completionPercentage: 78,
    contractValue: 85000,
    recognizedRevenue: 66300,
    remainingRevenue: 18700,
    projectManager: "Sarah Mitchell",
    projectManagerId: "pm-sarah-mitchell",
    teamMembers: ["Sarah Mitchell", "Michael Roberts", "Lisa Anderson"],
    teamMemberIds: ["pm-sarah-mitchell", "consultant-michael-roberts", "consultant-lisa-anderson"],
    impact: "high",
    risk: "low",
    tags: ["strategic-planning", "market-analysis", "roadmap"],
    createdAt: "2025-04-15T09:00:00Z",
    updatedAt: "2025-10-24T11:15:00Z",
  },
  {
    id: "PRJ-2025-045",
    name: "PQR Corp - Digital Transformation",
    client: "PQR Corp",
    clientId: "client-pqr-corp",
    description: "Large-scale digital transformation initiative including technology assessment, system modernization, and change management.",
    scope: "Assess current technology infrastructure, implement modern digital solutions, and manage organizational change to support digital adoption. Focus on customer experience, operational efficiency, and data-driven decision making.",
    objectives: [
      "Modernize legacy systems and infrastructure",
      "Improve customer digital experience and engagement",
      "Implement data analytics and business intelligence capabilities",
      "Enhance operational efficiency through automation",
      "Build digital capabilities and skills across the organization"
    ],
    deliverables: [
      "Technology assessment and gap analysis",
      "Digital transformation strategy and roadmap",
      "System implementation and integration plan",
      "Change management and training programs",
      "Data governance and analytics framework",
      "Digital maturity measurement tools"
    ],
    status: "execution",
    health: "at-risk",
    phase: "execution",
    startDate: "2025-08-01",
    endDate: "2026-01-31",
    completionPercentage: 40,
    contractValue: 72000,
    recognizedRevenue: 28800,
    remainingRevenue: 43200,
    projectManager: "James Kennedy",
    projectManagerId: "pm-james-kennedy",
    teamMembers: ["James Kennedy", "David Brown", "Rachel Green", "Alex Turner"],
    teamMemberIds: ["pm-james-kennedy", "consultant-david-brown", "consultant-rachel-green", "consultant-alex-turner"],
    impact: "high",
    risk: "medium",
    tags: ["digital-transformation", "technology", "change-management"],
    createdAt: "2025-07-10T14:00:00Z",
    updatedAt: "2025-10-20T16:45:00Z",
  },
  {
    id: "PRJ-2025-043",
    name: "GHI Ltd - ERP Implementation",
    client: "GHI Ltd",
    clientId: "client-ghi-ltd",
    description: "Enterprise resource planning system implementation with process optimization and user training components.",
    scope: "Implement comprehensive ERP solution to integrate finance, operations, supply chain, and human resources. Optimize business processes, ensure data migration, and provide extensive user training for successful adoption.",
    objectives: [
      "Integrate all business functions into unified ERP system",
      "Streamline and optimize core business processes",
      "Ensure accurate data migration from legacy systems",
      "Train users across all departments for system proficiency",
      "Establish governance and maintenance procedures"
    ],
    deliverables: [
      "ERP system configuration and customization",
      "Business process optimization documentation",
      "Data migration and validation reports",
      "User training materials and sessions",
      "System integration and testing documentation",
      "Go-live support and post-implementation review"
    ],
    status: "planning",
    health: "on-track",
    phase: "planning",
    startDate: "2025-11-01",
    endDate: "2026-04-30",
    completionPercentage: 15,
    contractValue: 95000,
    recognizedRevenue: 14250,
    remainingRevenue: 80750,
    projectManager: "Michael Roberts",
    projectManagerId: "consultant-michael-roberts",
    teamMembers: ["Michael Roberts", "Sophie Wilson", "Mark Davis"],
    teamMemberIds: ["consultant-michael-roberts", "consultant-sophie-wilson", "consultant-mark-davis"],
    impact: "high",
    risk: "low",
    tags: ["erp", "implementation", "training"],
    createdAt: "2025-10-01T08:30:00Z",
    updatedAt: "2025-10-25T13:20:00Z",
  },
  {
    id: "PRJ-2025-044",
    name: "JKL Corp - Change Management",
    client: "JKL Corporation",
    clientId: "client-jkl-corp",
    description: "Organizational change management program supporting merger integration and culture transformation.",
    scope: "Support organizational transformation during merger integration process. Focus on cultural alignment, communication strategies, employee engagement, and leadership development to ensure smooth transition and maintain productivity.",
    objectives: [
      "Facilitate smooth merger integration and cultural alignment",
      "Maintain employee engagement and morale during transition",
      "Establish effective communication channels and protocols",
      "Develop leadership capabilities for managing change",
      "Minimize productivity disruption during transformation"
    ],
    deliverables: [
      "Change impact assessment and readiness evaluation",
      "Cultural integration strategy and action plan",
      "Communication plan and stakeholder engagement strategy",
      "Leadership development and coaching programs",
      "Employee training and support materials",
      "Change success metrics and monitoring dashboard"
    ],
    status: "execution",
    health: "at-risk",
    phase: "execution",
    startDate: "2025-08-01",
    endDate: "2025-11-30",
    completionPercentage: 35,
    contractValue: 62000,
    recognizedRevenue: 21700,
    remainingRevenue: 40300,
    projectManager: "Emma Thompson",
    projectManagerId: "pm-emma-thompson",
    teamMembers: ["Emma Thompson", "Robert Kim", "Jennifer Lee"],
    teamMemberIds: ["pm-emma-thompson", "consultant-robert-kim", "consultant-jennifer-lee"],
    impact: "medium",
    risk: "high",
    tags: ["change-management", "merger", "culture"],
    createdAt: "2025-07-15T11:00:00Z",
    updatedAt: "2025-10-22T09:45:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status") as ProjectStatus | "all" | null;
    const health = searchParams.get("health") as ProjectHealth | "all" | null;
    const phase = searchParams.get("phase") as ProjectPhase | "all" | null;
    const client = searchParams.get("client");
    const pm = searchParams.get("pm");

    let filteredProjects = [...projects];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchLower) ||
          project.client.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.projectManager.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== "all") {
      filteredProjects = filteredProjects.filter((project) => project.status === status);
    }

    if (health && health !== "all") {
      filteredProjects = filteredProjects.filter((project) => project.health === health);
    }

    if (phase && phase !== "all") {
      filteredProjects = filteredProjects.filter((project) => project.phase === phase);
    }

    if (client && client !== "all") {
      filteredProjects = filteredProjects.filter((project) => project.client === client);
    }

    if (pm && pm !== "all") {
      filteredProjects = filteredProjects.filter((project) => project.projectManager === pm);
    }

    // Sort by updated date (most recent first)
    filteredProjects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Calculate summary stats
    const stats = {
      total: filteredProjects.length,
      active: filteredProjects.filter(p => p.status !== "completed").length,
      onTrack: filteredProjects.filter(p => p.health === "on-track").length,
      atRisk: filteredProjects.filter(p => p.health === "at-risk").length,
      behind: filteredProjects.filter(p => p.health === "behind").length,
      totalValue: filteredProjects.reduce((sum, p) => sum + p.contractValue, 0),
      recognizedRevenue: filteredProjects.reduce((sum, p) => sum + p.recognizedRevenue, 0),
      remainingRevenue: filteredProjects.reduce((sum, p) => sum + p.remainingRevenue, 0),
    };

    return NextResponse.json({
      success: true,
      data: filteredProjects,
      stats,
      meta: {
        total: filteredProjects.length,
        filters: {
          search,
          status,
          health,
          phase,
          client,
          pm,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching consulting projects:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData: Omit<ConsultingProject, "id" | "createdAt" | "updatedAt"> = await request.json();

    // Validate required fields
    if (!projectData.name || !projectData.client || !projectData.projectManager) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, client, and project manager are required fields",
        },
        { status: 400 }
      );
    }

    // Create new project
    const newProject: ConsultingProject = {
      id: `PRJ-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to storage
    projects.push(newProject);

    return NextResponse.json(
      {
        success: true,
        data: newProject,
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating consulting project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      { status: 500 }
    );
  }
}