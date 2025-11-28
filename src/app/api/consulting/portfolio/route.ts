/**
 * API Route: Consulting Portfolio Analytics
 * GET /api/consulting/portfolio - Get portfolio overview and analytics
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  PortfolioStats, 
  PhaseDistribution, 
  CompletionDistribution, 
  FinancialSummary,
  ResourceDemand,
  ProjectHealthMatrixItem,
  ConsultingProject
} from "@/types/consulting";

// This would normally fetch from the projects API or database
// For now, we'll simulate the data based on the projects we have
const mockProjects: ConsultingProject[] = [
  // Same projects from projects API - in real implementation, this would be a shared data source
  {
    id: "PRJ-2025-042",
    name: "DEF Inc - Process Optimization",
    client: "DEF Inc",
    clientId: "client-def-inc",
    description: "Process optimization initiative",
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
    tags: ["process-optimization"],
    createdAt: "2025-05-15T10:00:00Z",
    updatedAt: "2025-10-25T15:30:00Z",
  },
  {
    id: "PRJ-2025-041",
    name: "ABC Corp - Strategic Planning",
    client: "ABC Corporation",
    clientId: "client-abc-corp",
    description: "Strategic planning engagement",
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
    tags: ["strategic-planning"],
    createdAt: "2025-04-15T09:00:00Z",
    updatedAt: "2025-10-24T11:15:00Z",
  },
  {
    id: "PRJ-2025-045",
    name: "PQR Corp - Digital Transformation",
    client: "PQR Corp",
    clientId: "client-pqr-corp",
    description: "Digital transformation initiative",
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
    tags: ["digital-transformation"],
    createdAt: "2025-07-10T14:00:00Z",
    updatedAt: "2025-10-20T16:45:00Z",
  },
  // Add more projects...
];

export async function GET(request: NextRequest) {
  try {
    // Calculate portfolio stats
    const totalProjects = mockProjects.length;
    const onTrackCount = mockProjects.filter(p => p.health === "on-track").length;
    const atRiskCount = mockProjects.filter(p => p.health === "at-risk").length;
    const behindCount = mockProjects.filter(p => p.health === "behind").length;
    const totalValue = mockProjects.reduce((sum, p) => sum + p.contractValue, 0);

    const portfolioStats: PortfolioStats = {
      totalProjects,
      totalValue,
      averageValue: totalValue / totalProjects,
      onTrack: onTrackCount,
      atRisk: atRiskCount,
      behind: behindCount,
      onTrackPercentage: Math.round((onTrackCount / totalProjects) * 100),
      atRiskPercentage: Math.round((atRiskCount / totalProjects) * 100),
      behindPercentage: Math.round((behindCount / totalProjects) * 100),
    };

    // Calculate phase distribution
    const phaseDistribution: PhaseDistribution[] = [
      {
        phase: "discovery",
        count: mockProjects.filter(p => p.phase === "discovery").length,
        percentage: 13
      },
      {
        phase: "planning",
        count: mockProjects.filter(p => p.phase === "planning").length,
        percentage: 20
      },
      {
        phase: "execution",
        count: mockProjects.filter(p => p.phase === "execution").length,
        percentage: 47
      },
      {
        phase: "closeout",
        count: mockProjects.filter(p => p.phase === "closeout").length,
        percentage: 20
      }
    ];

    // Calculate completion distribution
    const completionDistribution: CompletionDistribution[] = [
      { range: "0-25% complete", count: mockProjects.filter(p => p.completionPercentage <= 25).length },
      { range: "25-50% complete", count: mockProjects.filter(p => p.completionPercentage > 25 && p.completionPercentage <= 50).length },
      { range: "50-75% complete", count: mockProjects.filter(p => p.completionPercentage > 50 && p.completionPercentage <= 75).length },
      { range: "75-100% complete", count: mockProjects.filter(p => p.completionPercentage > 75).length },
    ];

    // Calculate financial summary
    const totalRecognized = mockProjects.reduce((sum, p) => sum + p.recognizedRevenue, 0);
    const totalRemaining = mockProjects.reduce((sum, p) => sum + p.remainingRevenue, 0);
    const atRiskRevenue = mockProjects.filter(p => p.health === "at-risk" || p.health === "behind")
      .reduce((sum, p) => sum + p.remainingRevenue, 0);

    const financialSummary: FinancialSummary = {
      totalContractValue: totalValue,
      recognizedToDate: totalRecognized,
      recognizedPercentage: Math.round((totalRecognized / totalValue) * 100),
      remainingRevenue: totalRemaining,
      remainingPercentage: Math.round((totalRemaining / totalValue) * 100),
      atRiskRevenue,
      atRiskPercentage: Math.round((atRiskRevenue / totalValue) * 100),
    };

    // Calculate resource demand forecast (mock data)
    const resourceDemand: ResourceDemand[] = [
      { month: "Nov", consultantsNeeded: 8, currentTeam: 6, gap: 2 },
      { month: "Dec", consultantsNeeded: 10, currentTeam: 6, gap: 4 },
      { month: "Jan", consultantsNeeded: 7, currentTeam: 6, gap: 1 },
    ];

    // Create health matrix data
    const healthMatrix: ProjectHealthMatrixItem[] = mockProjects.map(project => ({
      projectId: project.id,
      projectName: project.name.split(" - ")[0], // Company name only
      client: project.client,
      health: project.health,
      value: project.contractValue,
      impact: project.impact,
      risk: project.risk,
      position: {
        x: project.risk === "low" ? 25 : project.risk === "medium" ? 50 : 75,
        y: project.impact === "low" ? 25 : project.impact === "medium" ? 50 : 75,
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        portfolioStats,
        phaseDistribution,
        completionDistribution,
        financialSummary,
        resourceDemand,
        healthMatrix,
      },
    });
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch portfolio data",
      },
      { status: 500 }
    );
  }
}