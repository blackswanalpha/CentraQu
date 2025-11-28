"use client";

import { useEffect, useState } from "react";
import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { ProgressBar } from "@/components/Dashboard/progress-bar";
import Link from "next/link";
import { consultingService, ConsultantPerformanceData } from "@/services/consulting.service";

export default function ConsultantPerformancePage() {
  const [data, setData] = useState<ConsultantPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await consultingService.getConsultantPerformance();
        setData(response);
      } catch (error) {
        console.error("Error fetching consultant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ConsultingDashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ConsultingDashboardLayout>
    );
  }

  if (!data) {
    return (
      <ConsultingDashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load consultant data.</p>
        </div>
      </ConsultingDashboardLayout>
    );
  }

  // Map API data to UI format
  const consultants = data.consultants.map((c: any) => ({
    name: c.user.full_name,
    role: c.title,
    utilization: c.current_utilization,
    billableHours: c.billable_hours_ytd,
    projects: 0, // Need to add project count to serializer or calculate
    rating: parseFloat(c.rating),
    revenue: parseFloat(c.revenue_ytd),
    currentProjects: "N/A", // Placeholder
    skills: c.skills,
    availability: c.availability_status,
    status: c.current_utilization > 85 ? "top" : c.current_utilization > 70 ? "good" : "warning",
  }));

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Consultant Performance
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Track individual and team consultant performance metrics
            </p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Team Performance Overview */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="AVERAGE UTILIZ."
            value={`${data.kpis.avg_utilization}%`}
            trend={{ value: 5, isPositive: true }}
          />
          <KPICard
            title="BILLABLE HOURS"
            value={data.kpis.total_billable_hours.toLocaleString()}
          />
          <KPICard
            title="CLIENT RATING"
            value={`${data.kpis.avg_client_rating}/5.0`}
            trend={{ value: 0.2, isPositive: true }}
          />
          <KPICard
            title="REVENUE PER HEAD"
            value={`$${data.kpis.revenue_per_head.toLocaleString()}`}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Individual Consultant Performance */}
        <WidgetCard
          title="Individual Consultant Performance"
          action={
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Export Report
            </button>
          }
        >
          <div className="space-y-6">
            {consultants.length > 0 ? (
              consultants.map((consultant: any) => (
                <div
                  key={consultant.name}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                          {consultant.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <h4 className="font-semibold text-dark dark:text-white flex items-center gap-2">
                            {consultant.name}
                            {consultant.status === "top" && <span className="text-lg">🏆</span>}
                            {consultant.status === "good" && <span className="text-green-500">✓</span>}
                            {consultant.status === "warning" && <span className="text-yellow-500">⚠</span>}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {consultant.role}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-dark dark:text-white">
                        {consultant.utilization}% | {consultant.billableHours}hrs | {consultant.projects} projects
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {consultant.rating}/5 | ${consultant.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Current Projects: </span>
                      <span className="text-dark dark:text-white">{consultant.currentProjects}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Skills: </span>
                      <span className="text-dark dark:text-white">{consultant.skills}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Availability: </span>
                      <span className="text-dark dark:text-white">{consultant.availability}</span>
                    </div>
                    {consultant.status === "warning" && (
                      <div className="text-yellow-600 dark:text-yellow-500 font-medium">
                        ⚠ Below target utilization - Assign additional projects
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      View Profile
                    </button>
                    <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      Schedule
                    </button>
                    <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      Performance Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No consultant data available.</p>
            )}
          </div>
        </WidgetCard>

        {/* Charts Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Utilization Trend */}
          <WidgetCard
            title="Utilization Trend (6 Months)"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detailed Analysis
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Target: 80% <span className="ml-2">─ ─ ─ ─ ─ ─ ─ ─</span>
              </div>
              {consultants.length > 0 ? (
                consultants.map((consultant: any) => (
                  <div key={consultant.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-dark dark:text-white">
                        {consultant.name.split(" ")[0]}
                      </span>
                      <span className={`text-sm font-medium ${consultant.utilization >= 85 ? "text-green-600" :
                          consultant.utilization >= 75 ? "text-blue-600" :
                            "text-yellow-600"
                        }`}>
                        {consultant.utilization}% {
                          consultant.utilization >= 85 ? "Excellent" :
                            consultant.utilization >= 75 ? "Good" :
                              consultant.utilization >= 65 ? "Acceptable" :
                                "Below Target"
                        }
                      </span>
                    </div>
                    <ProgressBar
                      value={consultant.utilization}
                      variant={
                        consultant.utilization >= 85 ? "success" :
                          consultant.utilization >= 75 ? "primary" :
                            "warning"
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No utilization data available.</p>
              )}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Trend: Improving ↑
              </div>
            </div>
          </WidgetCard>

          {/* Skills Heat Map */}
          <WidgetCard
            title="Skills Heat Map"
            action={
              <div className="flex gap-2">
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Hiring Priorities
                </Link>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Training Plan
                </Link>
              </div>
            }
          >
            <div className="space-y-3">
              {data.skills_capacity.map((item: any) => (
                <div key={item.skill}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {item.skill}
                    </span>
                    <span className={`text-sm font-medium ${item.level === "High" ? "text-green-600" :
                        item.level === "Med" ? "text-yellow-600" :
                          "text-red-600"
                      }`}>
                      {item.level}
                    </span>
                  </div>
                  <ProgressBar
                    value={item.capacity}
                    variant={
                      item.level === "High" ? "success" :
                        item.level === "Med" ? "warning" :
                          "error"
                    }
                  />
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gap Areas: Data Analytics, IT Systems, HR/Org Design
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Billable vs Non-Billable */}
          <WidgetCard
            title="Billable vs Non-Billable Time"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Optimize Non-Billable
              </Link>
            }
          >
            <div className="space-y-4">
              {consultants.length > 0 ? (
                consultants.map((consultant: any) => (
                  <div key={consultant.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-dark dark:text-white">
                        {consultant.name.split(" ")[0]}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {consultant.utilization}% Billable
                      </span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <div
                        className="bg-blue-600"
                        style={{ width: `${consultant.utilization}%` }}
                      />
                      <div
                        className="bg-gray-400 dark:bg-gray-600"
                        style={{ width: `${100 - consultant.utilization}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No data available.</p>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-dark dark:text-white mb-2">
                  Non-billable breakdown:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Admin: 35%</li>
                  <li>• Training: 25%</li>
                  <li>• Business Dev: 20%</li>
                  <li>• Bench Time: 20%</li>
                </ul>
              </div>
            </div>
          </WidgetCard>

          {/* Client Feedback Summary */}
          <WidgetCard
            title="Client Feedback Summary"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                All Feedback
              </Link>
            }
          >
            <div className="space-y-4">
              <p className="text-sm font-medium text-dark dark:text-white mb-3">
                Recent Reviews:
              </p>
              {data.client_feedback.length > 0 ? (
                data.client_feedback.map((feedback: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">
                        {"⭐".repeat(feedback.rating)}
                      </span>
                      <span className="text-sm font-medium text-dark dark:text-white">
                        {feedback.client_name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      "{feedback.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No feedback available.</p>
              )}
            </div>
          </WidgetCard>
        </div>

        {/* Performance Insights & Actions */}
        <WidgetCard
          title="Performance Insights & Actions"
          action={
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                Generate Action Plan
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                Schedule Team Review
              </button>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Export
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Top Performer: Sarah Mitchell (92% utilization, 4.9/5)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Consider promotion to Principal Consultant
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-2xl">⚠</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Underutilized: Michael Roberts (65% utilization)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Actions: Assign to GHI project, marketing support needed
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Rising Star: Emma Thompson (strong growth trajectory)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Assign mentorship with senior consultant
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Skill Gap Identified: Data Analytics & IT Systems
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Hire 1-2 specialists or upskill existing team
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Revenue Opportunity: Team can handle 2-3 more projects
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Accelerate business development pipeline
                </p>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

