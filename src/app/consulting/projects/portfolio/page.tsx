"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  PortfolioStats, 
  PhaseDistribution, 
  CompletionDistribution, 
  FinancialSummary,
  ResourceDemand,
  ProjectHealthMatrixItem
} from "@/types/consulting";

interface PortfolioResponse {
  success: boolean;
  data: {
    portfolioStats: PortfolioStats;
    phaseDistribution: PhaseDistribution[];
    completionDistribution: CompletionDistribution[];
    financialSummary: FinancialSummary;
    resourceDemand: ResourceDemand[];
    healthMatrix: ProjectHealthMatrixItem[];
  };
}

export default function ProjectPortfolioPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consulting/portfolio');
      const data: PortfolioResponse = await response.json();
      
      if (data.success) {
        setPortfolioData(data.data);
      } else {
        setError('Failed to fetch portfolio data');
      }
    } catch (err) {
      setError('Failed to fetch portfolio data');
      console.error('Error fetching portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ConsultingDashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading portfolio data...</p>
          </div>
        </div>
      </ConsultingDashboardLayout>
    );
  }

  if (error || !portfolioData) {
    return (
      <ConsultingDashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchPortfolioData}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </ConsultingDashboardLayout>
    );
  }

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Project Portfolio
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Overview of all consulting projects
            </p>
          </div>
          <Link
            href="/consulting/projects/new"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            + New Project
          </Link>
        </div>

        {/* Portfolio Overview */}
        <div className="card bg-white dark:bg-gray-900 p-6">
          <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">
            Portfolio Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-dark dark:text-white">{portfolioData.portfolioStats.totalProjects}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-dark dark:text-white">${portfolioData.portfolioStats.totalValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Value</p>
              <p className="text-2xl font-bold text-dark dark:text-white">${Math.round(portfolioData.portfolioStats.averageValue).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status Distribution</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded dark:bg-green-900/30 dark:text-green-400">
                  {portfolioData.portfolioStats.onTrack} On Track ({portfolioData.portfolioStats.onTrackPercentage}%)
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">On Track</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{portfolioData.portfolioStats.onTrack} ({portfolioData.portfolioStats.onTrackPercentage}%)</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{portfolioData.portfolioStats.atRisk} ({portfolioData.portfolioStats.atRiskPercentage}%)</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Behind</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{portfolioData.portfolioStats.behind} ({portfolioData.portfolioStats.behindPercentage}%)</p>
            </div>
          </div>
        </div>

        {/* Portfolio Health Matrix */}
        <WidgetCard 
          title="Portfolio Health Matrix"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detailed Risk Analysis
              </button>
              <span className="text-gray-400">|</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Export Matrix
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Matrix Visualization */}
            <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
              {/* Axes Labels */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600 dark:text-gray-400">
                Impact →
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Risk →
              </div>

              {/* Quadrants */}
              <div className="grid grid-cols-2 grid-rows-2 h-full gap-1">
                {/* High Impact, Low Risk */}
                <div className="border border-gray-300 dark:border-gray-600 rounded p-4 flex flex-col gap-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">High Impact / Low Risk</div>
                  <div className="space-y-2">
                    {portfolioData.healthMatrix
                      .filter(p => p.impact === "high" && p.risk === "low")
                      .map(project => (
                        <div key={project.projectId} className="inline-block px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded text-xs">
                          <div className="font-semibold text-green-800 dark:text-green-300">{project.projectName}</div>
                          <div className="text-green-600 dark:text-green-400">{project.client} • ${(project.value / 1000).toFixed(0)}K</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* High Impact, High Risk */}
                <div className="border border-gray-300 dark:border-gray-600 rounded p-4 flex flex-col gap-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">High Impact / High Risk</div>
                  <div className="space-y-2">
                    {portfolioData.healthMatrix
                      .filter(p => p.impact === "high" && p.risk === "high")
                      .map(project => (
                        <div key={project.projectId} className="inline-block px-3 py-2 bg-red-100 dark:bg-red-900/30 rounded text-xs">
                          <div className="font-semibold text-red-800 dark:text-red-300">{project.projectName}</div>
                          <div className="text-red-600 dark:text-red-400">{project.client} • ${(project.value / 1000).toFixed(0)}K</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Low Impact, Low Risk */}
                <div className="border border-gray-300 dark:border-gray-600 rounded p-4 flex flex-col gap-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Low Impact / Low Risk</div>
                  <div className="space-y-2">
                    {portfolioData.healthMatrix
                      .filter(p => p.impact === "low" && p.risk === "low")
                      .map(project => (
                        <div key={project.projectId} className="inline-block px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          <div className="font-semibold text-gray-800 dark:text-gray-300">{project.projectName}</div>
                          <div className="text-gray-600 dark:text-gray-400">{project.client} • ${(project.value / 1000).toFixed(0)}K</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Low Impact, High Risk */}
                <div className="border border-gray-300 dark:border-gray-600 rounded p-4 flex flex-col gap-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Low Impact / High Risk</div>
                  <div className="space-y-2">
                    {portfolioData.healthMatrix
                      .filter(p => p.impact === "low" && p.risk === "high")
                      .map(project => (
                        <div key={project.projectId} className="inline-block px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs">
                          <div className="font-semibold text-yellow-800 dark:text-yellow-300">{project.projectName}</div>
                          <div className="text-yellow-600 dark:text-yellow-400">{project.client} • ${(project.value / 1000).toFixed(0)}K</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">On Track</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">At Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Behind Schedule</span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Projects by Phase & Financial Summary */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Projects by Phase */}
          <WidgetCard 
            title="Projects by Phase"
            action={
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Timeline View
              </button>
            }
          >
            <div className="space-y-4">
              {portfolioData.phaseDistribution.map((item) => (
                <div key={item.phase}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {item.phase.charAt(0).toUpperCase() + item.phase.slice(1)} ({item.count} projects)
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">
                  Completion Distribution:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {portfolioData.completionDistribution.map((item, index) => (
                    <li key={index}>• {item.range}: {item.count} projects</li>
                  ))}
                </ul>
              </div>
            </div>
          </WidgetCard>

          {/* Financial Summary */}
          <WidgetCard 
            title="Financial Summary"
            action={
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detailed Financials
              </button>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Contract Value
                  </p>
                  <p className="text-2xl font-bold text-dark dark:text-white">${portfolioData.financialSummary.totalContractValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Recognized to Date
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${portfolioData.financialSummary.recognizedToDate.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">({portfolioData.financialSummary.recognizedPercentage}%)</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Remaining Revenue
                  </span>
                  <span className="text-sm font-semibold text-dark dark:text-white">
                    ${portfolioData.financialSummary.remainingRevenue.toLocaleString()} ({portfolioData.financialSummary.remainingPercentage}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    At Risk
                  </span>
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                    ${portfolioData.financialSummary.atRiskRevenue.toLocaleString()} ({portfolioData.financialSummary.atRiskPercentage}%)
                  </span>
                </div>
              </div>

              <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                <div className="h-full flex">
                  <div className="bg-green-500" style={{ width: `${portfolioData.financialSummary.recognizedPercentage}%` }}></div>
                  <div className="bg-blue-500" style={{ width: `${portfolioData.financialSummary.remainingPercentage}%` }}></div>
                  <div className="bg-yellow-500" style={{ width: `${portfolioData.financialSummary.atRiskPercentage}%` }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Recognized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">At Risk</span>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Resource Demand Forecast */}
        <WidgetCard 
          title="Resource Demand Forecast"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Hiring Plan
              </button>
              <span className="text-gray-400">|</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Contractors
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Line chart showing projected resource needs over time
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              {portfolioData.resourceDemand.map((item, index) => (
                <div key={index}>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{item.month}</p>
                  <p className="font-semibold text-dark dark:text-white">{item.consultantsNeeded} consultants needed</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Team</span>
                <span className="font-semibold text-dark dark:text-white">{portfolioData.resourceDemand[0]?.currentTeam} consultants</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Gap</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {Math.min(...portfolioData.resourceDemand.map(r => r.gap))}-{Math.max(...portfolioData.resourceDemand.map(r => r.gap))} consultants
                </span>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

