"use client";

import { useEffect, useState } from "react";
import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { ProgressBar } from "@/components/Dashboard/progress-bar";
import Link from "next/link";
import { consultingService, DeliveryExcellenceData } from "@/services/consulting.service";

export default function DeliveryExcellencePage() {
  const [data, setData] = useState<DeliveryExcellenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await consultingService.getDeliveryExcellence();
        setData(response);
      } catch (error) {
        console.error("Error fetching delivery excellence data:", error);
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
          <p className="text-red-500">Failed to load delivery excellence data.</p>
        </div>
      </ConsultingDashboardLayout>
    );
  }

  const projectStatus = data.projects.map((p: any) => ({
    name: p.project_code,
    timeline: p.timeline_status === 'on_track' ? 'good' : 'behind',
    budget: p.budget_status === 'on_budget' ? 'good' : 'over',
    quality: "high", // Mocked
    satisfaction: "4.8/5", // Mocked
    color: p.health_status === 'ON_TRACK' ? 'green' : 'red'
  }));

  const qualityScores = data.quality_scores;

  const clientSatisfaction = data.client_satisfaction;

  const topRisks = data.risks.map((r: any) => ({
    title: `${r.project_name}: ${r.title}`,
    impact: r.impact,
    probability: r.probability,
    owner: r.owner_name || "Unassigned",
    mitigation: r.mitigation_plan,
    status: r.status,
  }));

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Delivery Excellence
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Monitor project delivery quality and performance
            </p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <option>This Year</option>
              <option>This Quarter</option>
              <option>This Month</option>
              <option>Last Year</option>
            </select>
          </div>
        </div>

        {/* Delivery Performance Overview */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="ON-TIME DELIVERY"
            value={`${data.kpis.on_time_delivery}%`}
            trend={{ value: 5, isPositive: true }}
          />
          <KPICard
            title="ON BUDGET"
            value={`${data.kpis.on_budget}%`}
            trend={{ value: 3, isPositive: false }}
            status="warning"
          />
          <KPICard
            title="CLIENT SATISF."
            value={`${data.kpis.client_satisfaction}/5.0`}
            trend={{ value: 0.2, isPositive: true }}
          />
          <KPICard
            title="QUALITY SCORE"
            value={`${data.kpis.quality_score}%`}
            trend={{ value: 4, isPositive: true }}
          />
        </div>

        {/* Project Delivery Status */}
        <WidgetCard
          title="Project Delivery Status"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Export Report
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Drill Down
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Recovery Actions
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-semibold text-dark dark:text-white">Project</th>
                    <th className="text-center py-3 px-2 font-semibold text-dark dark:text-white">Timeline</th>
                    <th className="text-center py-3 px-2 font-semibold text-dark dark:text-white">Budget</th>
                    <th className="text-center py-3 px-2 font-semibold text-dark dark:text-white">Quality</th>
                    <th className="text-center py-3 px-2 font-semibold text-dark dark:text-white">Client Sat</th>
                  </tr>
                </thead>
                <tbody>
                  {projectStatus.map((project: any, index: number) => (
                    <tr
                      key={project.name}
                      className={index < projectStatus.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}
                    >
                      <td className="py-3 px-2 font-medium text-dark dark:text-white">{project.name}</td>
                      <td className="text-center py-3 px-2">
                        <span className={`inline-flex items-center gap-1 ${project.timeline === "good" || project.timeline === "ahead" ? "text-green-600" :
                            project.timeline === "watch" ? "text-yellow-600" :
                              "text-red-600"
                          }`}>
                          {project.timeline === "good" || project.timeline === "ahead" ? "🟢" :
                            project.timeline === "watch" ? "🟡" : "🔴"}
                          {project.timeline === "good" ? "Good" :
                            project.timeline === "ahead" ? "Ahead" :
                              project.timeline === "watch" ? "Watch" : "Behind"}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={`inline-flex items-center gap-1 ${project.budget === "good" || project.budget === "under" ? "text-green-600" :
                            project.budget === "watch" ? "text-yellow-600" :
                              "text-red-600"
                          }`}>
                          {project.budget === "good" || project.budget === "under" ? "🟢" :
                            project.budget === "watch" ? "🟡" : "🔴"}
                          {project.budget === "good" ? "Good" :
                            project.budget === "under" ? "Under" :
                              project.budget === "watch" ? "Watch" : "Over"}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={`inline-flex items-center gap-1 ${project.quality === "high" ? "text-green-600" :
                            project.quality === "medium" ? "text-yellow-600" :
                              "text-red-600"
                          }`}>
                          {project.quality === "high" ? "🟢" :
                            project.quality === "medium" ? "🟡" : "🔴"}
                          {project.quality === "high" ? "High" : "Medium"}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={`inline-flex items-center gap-1 ${parseFloat(project.satisfaction) >= 4.5 ? "text-green-600" :
                            parseFloat(project.satisfaction) >= 3.5 ? "text-yellow-600" :
                              "text-red-600"
                          }`}>
                          {parseFloat(project.satisfaction) >= 4.5 ? "🟢" :
                            parseFloat(project.satisfaction) >= 3.5 ? "🟡" : "🔴"}
                          {project.satisfaction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overall Health: <span className="font-semibold text-green-600">71% projects green</span>,
                <span className="font-semibold text-yellow-600 ml-1">14% yellow</span>,
                <span className="font-semibold text-red-600 ml-1">15% red</span>
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* On-Time Delivery & Milestone Completion */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard
            title="On-Time Delivery Trend"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Action Plans
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-dark dark:text-white">{data.kpis.on_time_delivery}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-dark dark:text-white">90%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Target</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Best:</span>
                  <span className="text-dark dark:text-white">94% (April)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Worst:</span>
                  <span className="text-dark dark:text-white">78% (August)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Trend:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Improving ↑</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gap to Target:</span>
                  <span className="text-yellow-600 dark:text-yellow-400">{(data.kpis.on_time_delivery - 90).toFixed(1)}%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-dark dark:text-white mb-2">Root Causes of Delays:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Resource constraints: 45%</li>
                  <li>• Scope changes: 30%</li>
                  <li>• Client delays: 15%</li>
                  <li>• Technical issues: 10%</li>
                </ul>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Milestone Completion"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Milestone Details
              </Link>
            }
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">This Month:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Planned:</div>
                    <div className="text-2xl font-bold text-dark dark:text-white">28</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">milestones</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Completed:</div>
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">(86%)</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">On Track:</div>
                    <div className="text-2xl font-bold text-blue-600">3</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Delayed:</div>
                    <div className="text-2xl font-bold text-red-600">1</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Delay:</span>
                  <span className="text-dark dark:text-white">3.2 days (when delayed)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-dark dark:text-white mb-2">Critical Path Items:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 2 milestones at risk</li>
                  <li>• 0 critical overdue</li>
                </ul>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Quality Metrics */}
        <WidgetCard
          title="Quality Metrics"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Defect Analysis
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Quality Improvements
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Lessons Learned
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-4xl font-bold text-dark dark:text-white">{data.kpis.quality_score}/100</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Overall Quality Score</div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">Component Scores:</h4>
              <div className="space-y-3">
                {qualityScores.map((item: any) => (
                  <div key={item.component}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-dark dark:text-white">
                        {item.component}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.score}/100
                      </span>
                    </div>
                    <ProgressBar value={item.score} variant="success" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">QA Activities:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Peer reviews: 47 this month</li>
                  <li>• QA checkpoints: 96% passed</li>
                  <li>• Rework required: 8 (4% rate)</li>
                  <li>• Client acceptance: 91% first-pass</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Defect Metrics:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Critical defects: 0 (target: 0) ✓</li>
                  <li>• Major defects: 2 (target: &lt;5) ✓</li>
                  <li>• Minor defects: 12 (target: &lt;20) ✓</li>
                  <li>• Defect density: 0.8 per deliverable</li>
                </ul>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Client Satisfaction & Scope Management */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard
            title="Client Satisfaction Analysis"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detailed Feedback
              </Link>
            }
          >
            <div className="space-y-4">
              {clientSatisfaction.length > 0 ? (
                clientSatisfaction.map((client: any) => (
                  <div key={client.client} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-dark dark:text-white">{client.client}</div>
                      <div className="text-yellow-500 text-sm">
                        {"⭐".repeat(client.stars)}
                        {client.score < 3 && <span className="ml-2 text-red-600">⚠</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${client.score >= 4.5 ? "text-green-600" :
                          client.score >= 3.5 ? "text-blue-600" :
                            "text-red-600"
                        }`}>
                        {client.score}/5
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No client feedback available.</p>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Satisfaction Drivers:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✓ Consultant expertise: 96%</li>
                  <li>✓ Communication: 94%</li>
                  <li>✓ Responsiveness: 93%</li>
                  <li>⚠ Meeting deadlines: 78%</li>
                  <li>⚠ Budget management: 82%</li>
                </ul>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Scope Management"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Change Log
              </Link>
            }
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">
                  Scope Changes This Year:
                </h4>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg mb-4">
                  <div className="text-3xl font-bold text-dark dark:text-white">47</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total change requests</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Approved:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">32 (68%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rejected:</span>
                    <span className="text-red-600 dark:text-red-400">8 (17%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                    <span className="text-yellow-600 dark:text-yellow-400">7 (15%)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Impact Analysis:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Timeline impact: +18 days</li>
                  <li>• Budget impact: +$42K</li>
                  <li>• Revenue opportunity: +$65K from approved</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Approval Time:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">4.2d (Target: 5 days) ✓</span>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Risk & Issue Management */}
        <WidgetCard
          title="Risk & Issue Management"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                All Risks ({topRisks.length})
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                All Issues (5)
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Risk Heat Map
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-dark dark:text-white">{topRisks.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Risks</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-dark dark:text-white">5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Issues</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-dark dark:text-white">5.8d</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Resolution</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">Risk Severity Distribution:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <span className="text-red-700 dark:text-red-400">🔴 High: {topRisks.filter((r: any) => r.impact === 'HIGH').length} risks</span>
                  <span className="text-gray-600 dark:text-gray-400">Requires immediate attention</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span className="text-yellow-700 dark:text-yellow-400">🟡 Medium: {topRisks.filter((r: any) => r.impact === 'MEDIUM').length} risks</span>
                  <span className="text-gray-600 dark:text-gray-400">Monitor closely</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-green-700 dark:text-green-400">🟢 Low: {topRisks.filter((r: any) => r.impact === 'LOW').length} risks</span>
                  <span className="text-gray-600 dark:text-gray-400">Routine monitoring</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">Top High-Priority Risks:</h4>
              <div className="space-y-4">
                {topRisks.filter((r: any) => r.impact === 'HIGH').slice(0, 3).map((risk: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-dark dark:text-white">
                        {index + 1}. 🔴 {risk.title}
                      </h5>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Impact: </span>
                        <span className="text-dark dark:text-white">{risk.impact}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Probability: </span>
                        <span className="text-dark dark:text-white">{risk.probability}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Owner: </span>
                        <span className="text-dark dark:text-white">{risk.owner}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Status: </span>
                        <span className="text-dark dark:text-white">{risk.status}</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Mitigation: </span>
                      <span className="text-dark dark:text-white">{risk.mitigation}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                        View
                      </button>
                      <button className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                        Update
                      </button>
                    </div>
                  </div>
                ))}
                {topRisks.filter((r: any) => r.impact === 'HIGH').length === 0 && (
                  <p className="text-sm text-gray-500">No high priority risks.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Issue Resolution Metrics:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Avg time to resolve: 5.8 days (Target: 7 days) ✓</li>
                <li>• First-time resolution: 72%</li>
                <li>• Escalation rate: 18%</li>
              </ul>
            </div>
          </div>
        </WidgetCard>

        {/* Delivery Excellence Insights */}
        <WidgetCard
          title="Delivery Excellence Insights"
          action={
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                Generate Exec Summary
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                Improvement Plan
              </button>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Export
              </button>
            </div>
          }
        >
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Strong Overall Performance: {data.kpis.on_time_delivery}% on-time, {data.kpis.quality_score}% quality
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Maintain best practices, share success patterns
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-2xl">⚠</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Budget Performance: {data.kpis.on_budget}% vs 85% target
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Strengthen change control, client expectation mgmt
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Client Satisfaction High: {data.kpis.client_satisfaction}/5 average
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Capture testimonials, use in marketing
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Quality Improvement Opportunity: Documentation (91%)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Implement documentation templates and reviews
                </p>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}
