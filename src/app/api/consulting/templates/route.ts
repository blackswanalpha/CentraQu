/**
 * API Route: Project Templates Management
 * GET /api/consulting/templates - List all project templates with filtering
 * POST /api/consulting/templates - Create new project template
 */

import { NextRequest, NextResponse } from "next/server";
import { ProjectTemplate } from "@/types/consulting";

// Temporary in-memory storage (replace with database)
let templates: ProjectTemplate[] = [
  {
    id: "1",
    name: "Strategic Planning Engagement",
    description: "Comprehensive 6-month strategic planning project with discovery, analysis, and implementation phases",
    scope: "Conduct comprehensive strategic planning review covering market positioning, competitive landscape, growth opportunities, and organizational capabilities. Develop strategic roadmap with actionable initiatives and measurable goals.",
    objectives: [
      "Define clear strategic vision and mission statements",
      "Identify key growth opportunities in target markets",
      "Develop competitive positioning strategy",
      "Create financial projections and targets",
      "Establish performance metrics and monitoring systems"
    ],
    category: "Strategic Planning",
    duration: 6,
    budget: "$75,000 - $125,000",
    phases: ["Discovery", "Analysis", "Strategy Development", "Implementation Planning"],
    deliverables: ["Strategic Plan Document", "Executive Presentation", "Implementation Roadmap", "Risk Assessment"],
    teamSize: 4,
    usageCount: 12,
    lastUsed: "2025-10-15",
    createdBy: "Sarah Mitchell",
    createdDate: "2025-01-10",
    updatedAt: "2025-10-15T14:30:00Z",
    tags: ["strategy", "planning", "analysis"],
  },
  {
    id: "2",
    name: "Process Optimization Project",
    description: "3-month process improvement initiative focusing on efficiency and cost reduction",
    scope: "Review and optimize current business processes across key departments. Analyze workflow inefficiencies, identify bottlenecks, and implement automation solutions where applicable.",
    objectives: [
      "Reduce operational costs by 15-20%",
      "Improve process efficiency by 25% across targeted departments",
      "Implement automated workflows for routine tasks",
      "Establish KPIs and monitoring systems for continuous improvement"
    ],
    category: "Process Optimization",
    duration: 3,
    budget: "$45,000 - $75,000",
    phases: ["Current State Analysis", "Process Design", "Pilot Implementation", "Full Rollout"],
    deliverables: ["Process Maps", "Improvement Recommendations", "Training Materials", "Performance Metrics"],
    teamSize: 3,
    usageCount: 8,
    lastUsed: "2025-10-10",
    createdBy: "Michael Roberts",
    createdDate: "2025-02-15",
    updatedAt: "2025-10-10T11:20:00Z",
    tags: ["process", "optimization", "efficiency"],
  },
  {
    id: "3",
    name: "Digital Transformation Initiative",
    description: "12-month digital transformation program with technology implementation and change management",
    scope: "Assess current technology infrastructure, implement modern digital solutions, and manage organizational change to support digital adoption. Focus on customer experience, operational efficiency, and data-driven decision making.",
    objectives: [
      "Modernize legacy systems and infrastructure",
      "Improve customer digital experience and engagement",
      "Implement data analytics and business intelligence capabilities",
      "Enhance operational efficiency through automation",
      "Build digital capabilities and skills across the organization"
    ],
    category: "Digital Transformation",
    duration: 12,
    budget: "$150,000 - $300,000",
    phases: ["Assessment", "Technology Selection", "Implementation", "Change Management", "Optimization"],
    deliverables: ["Digital Strategy", "Technology Roadmap", "Implementation Plan", "Training Program", "Success Metrics"],
    teamSize: 6,
    usageCount: 5,
    lastUsed: "2025-09-20",
    createdBy: "Linda Peterson",
    createdDate: "2025-03-01",
    updatedAt: "2025-09-20T16:45:00Z",
    tags: ["digital", "transformation", "technology"],
  },
  {
    id: "4",
    name: "Change Management Program",
    description: "4-month organizational change management program with stakeholder engagement and training",
    scope: "Support organizational transformation initiatives through structured change management approach. Focus on stakeholder engagement, communication strategies, training programs, and adoption measurement.",
    objectives: [
      "Facilitate smooth organizational transformation",
      "Maintain employee engagement during change",
      "Establish effective communication channels",
      "Develop change leadership capabilities",
      "Measure and improve adoption rates"
    ],
    category: "Change Management",
    duration: 4,
    budget: "$60,000 - $100,000",
    phases: ["Change Assessment", "Stakeholder Engagement", "Training Development", "Implementation Support"],
    deliverables: ["Change Strategy", "Communication Plan", "Training Materials", "Adoption Metrics"],
    teamSize: 3,
    usageCount: 10,
    lastUsed: "2025-10-12",
    createdBy: "Emma Thompson",
    createdDate: "2025-04-05",
    updatedAt: "2025-10-12T13:15:00Z",
    tags: ["change", "management", "training"],
  },
  {
    id: "5",
    name: "Organizational Design Review",
    description: "2-month organizational structure and design assessment with recommendations",
    scope: "Review current organizational structure, analyze effectiveness, and provide recommendations for improved design. Focus on role clarity, reporting relationships, and operational efficiency.",
    objectives: [
      "Assess current organizational structure effectiveness",
      "Identify gaps and overlaps in roles and responsibilities",
      "Design optimal organizational structure",
      "Recommend clear role definitions and reporting relationships",
      "Provide implementation roadmap for restructuring"
    ],
    category: "Organizational Design",
    duration: 2,
    budget: "$30,000 - $50,000",
    phases: ["Current State Assessment", "Benchmarking", "Design Development", "Recommendations"],
    deliverables: ["Org Chart Analysis", "Design Recommendations", "Implementation Plan", "Role Descriptions"],
    teamSize: 2,
    usageCount: 6,
    lastUsed: "2025-10-08",
    createdBy: "James Kennedy",
    createdDate: "2025-05-12",
    updatedAt: "2025-10-08T09:30:00Z",
    tags: ["organizational", "design", "structure"],
  },
  {
    id: "6",
    name: "Technology Implementation",
    description: "8-month technology system implementation with integration and training",
    scope: "Implement new technology solutions with focus on system integration, data migration, and user adoption. Ensure seamless integration with existing systems and comprehensive user training.",
    objectives: [
      "Successfully implement new technology solution",
      "Integrate with existing systems and processes",
      "Ensure accurate data migration and validation",
      "Train users for effective system utilization",
      "Establish ongoing support and maintenance procedures"
    ],
    category: "Technology Implementation",
    duration: 8,
    budget: "$100,000 - $200,000",
    phases: ["Requirements", "Configuration", "Integration", "Testing", "Deployment", "Support"],
    deliverables: ["Requirements Document", "Configuration Guide", "Integration Plan", "Test Results", "User Training"],
    teamSize: 5,
    usageCount: 7,
    lastUsed: "2025-10-05",
    createdBy: "Sarah Mitchell",
    createdDate: "2025-06-20",
    updatedAt: "2025-10-05T10:45:00Z",
    tags: ["technology", "implementation", "integration"],
  },
  {
    id: "7",
    name: "ERP Implementation",
    description: "10-month enterprise resource planning system implementation with process optimization",
    scope: "Implement comprehensive ERP solution to integrate finance, operations, supply chain, and human resources. Optimize business processes, ensure data migration, and provide extensive user training for successful adoption.",
    objectives: [
      "Integrate all business functions into unified ERP system",
      "Streamline and optimize core business processes",
      "Ensure accurate data migration from legacy systems",
      "Train users across all departments for system proficiency",
      "Establish governance and maintenance procedures"
    ],
    category: "Technology Implementation",
    duration: 10,
    budget: "$200,000 - $400,000",
    phases: ["Requirements Gathering", "System Configuration", "Data Migration", "Process Optimization", "User Training", "Go-Live Support"],
    deliverables: ["Requirements Specification", "System Configuration", "Data Migration Plan", "Training Materials", "Go-Live Checklist"],
    teamSize: 6,
    usageCount: 3,
    lastUsed: "2025-09-15",
    createdBy: "Michael Roberts",
    createdDate: "2025-07-01",
    updatedAt: "2025-09-15T14:20:00Z",
    tags: ["erp", "implementation", "data-migration"],
  },
  {
    id: "8",
    name: "Compliance Assessment",
    description: "3-month regulatory compliance assessment and remediation planning",
    scope: "Conduct comprehensive regulatory compliance assessment across all business areas. Identify gaps, assess risks, and develop remediation plans to ensure full regulatory compliance.",
    objectives: [
      "Assess current compliance status against regulations",
      "Identify compliance gaps and associated risks",
      "Develop comprehensive remediation plan",
      "Implement compliance monitoring and reporting systems",
      "Train staff on compliance requirements and procedures"
    ],
    category: "Compliance",
    duration: 3,
    budget: "$40,000 - $80,000",
    phases: ["Gap Analysis", "Risk Assessment", "Remediation Planning", "Implementation Support"],
    deliverables: ["Compliance Gap Report", "Risk Register", "Remediation Plan", "Policy Recommendations"],
    teamSize: 3,
    usageCount: 9,
    lastUsed: "2025-10-01",
    createdBy: "Emma Thompson",
    createdDate: "2025-03-15",
    updatedAt: "2025-10-01T12:00:00Z",
    tags: ["compliance", "risk", "assessment"],
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "lastUsed";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let filteredTemplates = [...templates];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTemplates = filteredTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.category.toLowerCase().includes(searchLower) ||
          template.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (category && category !== "All") {
      filteredTemplates = filteredTemplates.filter((template) => template.category === category);
    }

    // Sort templates
    filteredTemplates.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "usageCount":
          aValue = a.usageCount;
          bValue = b.usageCount;
          break;
        case "createdDate":
          aValue = new Date(a.createdDate);
          bValue = new Date(b.createdDate);
          break;
        case "lastUsed":
        default:
          aValue = new Date(a.lastUsed);
          bValue = new Date(b.lastUsed);
          break;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        return sortOrder === "asc" ? 
          (aValue as Date).getTime() - (bValue as Date).getTime() :
          (bValue as Date).getTime() - (aValue as Date).getTime();
      }
    });

    // Get unique categories for filtering
    const categories = ["All", ...new Set(templates.map(t => t.category))];

    // Calculate stats
    const stats = {
      total: filteredTemplates.length,
      categories: categories.length - 1,
      totalUsages: templates.reduce((sum, t) => sum + t.usageCount, 0),
      averageTeamSize: Math.round(
        (templates.reduce((sum, t) => sum + t.teamSize, 0) / templates.length) * 10
      ) / 10,
    };

    return NextResponse.json({
      success: true,
      data: filteredTemplates,
      categories,
      stats,
      meta: {
        total: filteredTemplates.length,
        filters: {
          search,
          category,
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching project templates:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project templates",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData: Omit<ProjectTemplate, "id" | "createdDate" | "updatedAt" | "usageCount" | "lastUsed"> = await request.json();

    // Validate required fields
    if (!templateData.name || !templateData.category || !templateData.description) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, category, and description are required fields",
        },
        { status: 400 }
      );
    }

    // Create new template
    const newTemplate: ProjectTemplate = {
      id: `template-${Date.now()}`,
      ...templateData,
      usageCount: 0,
      lastUsed: "Never",
      createdDate: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
    };

    // Add to storage
    templates.push(newTemplate);

    return NextResponse.json(
      {
        success: true,
        data: newTemplate,
        message: "Template created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project template:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create template",
      },
      { status: 500 }
    );
  }
}