"use client";

import { useEffect, useState } from "react";
import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Badge } from "@/components/Dashboard/badge";
import Link from "next/link";
import { consultingService, ClientHealthData } from "@/services/consulting.service";

export default function ClientHealthPage() {
  const [data, setData] = useState<ClientHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await consultingService.getClientHealth();
        setData(response);
      } catch (error) {
        console.error("Error fetching client health data:", error);
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
          <p className="text-red-500">Failed to load client health data.</p>
        </div>
      </ConsultingDashboardLayout>
    );
  }

  // Map API data to UI format
  const atRiskClients = data.at_risk_clients.map((c: any) => ({
    name: c.client_name,
    industry: c.industry || "N/A",
    healthScore: c.health_score,
    project: c.active_project ? c.active_project.name : "No Active Project",
    value: c.active_project ? c.active_project.value : 0,
    riskFactors: c.risk_factors ? (typeof c.risk_factors === 'string' && c.risk_factors.startsWith('[') ? JSON.parse(c.risk_factors) : [c.risk_factors]) : [],
    lastContact: new Date(c.last_contact_date).toLocaleDateString(),
    accountManager: c.account_manager_name || "Unassigned",
    actions: ["Schedule Review", "Check Deliverables"], // Placeholder
  }));

  const activityLog = data.activity_log.map((a: any) => ({
    date: new Date(a.activity_date).toLocaleString(),
    client: a.client_name || "Unknown",
    event: a.activity_type,
    details: a.description,
    outcome: "", // Not in API
  }));

  // Group clients for matrix
  const healthyClients = data.client_matrix.filter((c: any) => c.health_score >= 80);
  const warningClients = data.client_matrix.filter((c: any) => c.health_score >= 60 && c.health_score < 80);
  const criticalClients = data.client_matrix.filter((c: any) => c.health_score < 60);

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Client Health
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Monitor client relationships and account health
            </p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <option>All Clients</option>
              <option>Healthy</option>
              <option>At Risk</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        {/* Client Portfolio Overview */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="ACTIVE CLIENTS"
            value={data.kpis.active_clients.toString()}
          />
          <KPICard
            title="HEALTHY ACCOUNTS"
            value={data.kpis.healthy_accounts.toString()}
          />
          <KPICard
            title="AT RISK ACCOUNTS"
            value={data.kpis.at_risk_accounts.toString()}
            status="warning"
          />
          <KPICard
            title="LIFETIME VALUE"
            value={`$${(data.kpis.lifetime_value / 1000000).toFixed(1)}M`}
          />
        </div>

        {/* Client Health Matrix */}
        <WidgetCard
          title="Client Health Matrix"
          action={
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Export Matrix
            </button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 min-h-[400px]">
              {/* High Satisfaction Row */}
              <div className="col-span-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                High Satisfaction ↑
              </div>

              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                <div className="space-y-2">
                  {healthyClients.map((c: any) => (
                    <div key={c.id} className="inline-block px-3 py-2 bg-white dark:bg-gray-800 rounded shadow-sm m-1">
                      <div className="font-semibold text-green-700 dark:text-green-400">🟢 {c.client_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Score: {c.health_score}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Rev: ${(c.revenue / 1000).toFixed(0)}K</div>
                    </div>
                  ))}
                  {healthyClients.length === 0 && <p className="text-sm text-gray-500">No clients</p>}
                </div>
              </div>

              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="space-y-2">
                  {warningClients.map((c: any) => (
                    <div key={c.id} className="inline-block px-3 py-2 bg-white dark:bg-gray-800 rounded shadow-sm m-1">
                      <div className="font-semibold text-yellow-700 dark:text-yellow-400">🟡 {c.client_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Score: {c.health_score}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Rev: ${(c.revenue / 1000).toFixed(0)}K</div>
                    </div>
                  ))}
                  {warningClients.length === 0 && <p className="text-sm text-gray-500">No clients</p>}
                </div>
              </div>

              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <div className="space-y-2">
                  {criticalClients.map((c: any) => (
                    <div key={c.id} className="inline-block px-3 py-2 bg-white dark:bg-gray-800 rounded shadow-sm m-1">
                      <div className="font-semibold text-red-700 dark:text-red-400">🔴 {c.client_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Score: {c.health_score}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Rev: ${(c.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-red-600 dark:text-red-400 mt-1">⚠ Risk</div>
                    </div>
                  ))}
                  {criticalClients.length === 0 && <p className="text-sm text-gray-500">No clients</p>}
                </div>
              </div>

              <div className="col-span-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                Low Satisfaction ↓
              </div>
              <div className="col-span-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                Low Engagement ← ─────────────────────── → High Engagement
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Health Score Formula:</strong> Satisfaction (40%) + Engagement (30%) + Payment History (20%) + Growth (10%)
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* At-Risk Clients */}
        <WidgetCard
          title="At-Risk Clients"
          action={
            <select className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
              <option>Take Action ▼</option>
              <option>Schedule Meeting</option>
              <option>Escalate</option>
              <option>Recovery Plan</option>
            </select>
          }
        >
          <div className="space-y-6">
            {atRiskClients.length > 0 ? (
              atRiskClients.map((client: any, index: number) => (
                <div
                  key={client.name}
                  className={`border-l-4 ${client.healthScore < 50 ? "border-red-500" : "border-yellow-500"
                    } pl-6 pb-6 ${index < atRiskClients.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-dark dark:text-white flex items-center gap-2">
                        {client.healthScore < 50 ? "🔴" : "🟡"} {client.name} - {client.industry}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Current Project: {client.project} (${client.value.toLocaleString()})
                      </p>
                    </div>
                    <Badge
                      label={`Health Score: ${client.healthScore}`}
                      variant={client.healthScore < 50 ? "error" : "warning"}
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white mb-2">
                        {client.healthScore < 50 ? "Risk Factors:" : "Watch Factors:"}
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {client.riskFactors.map((factor: string, i: number) => (
                          <li key={i}>• {factor}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Last Contact: </span>
                        <span className="text-dark dark:text-white">{client.lastContact}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Account Manager: </span>
                        <span className="text-dark dark:text-white">{client.accountManager}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white mb-2">
                        Recommended Actions:
                      </p>
                      <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {client.actions.map((action: string, i: number) => (
                          <li key={i}>{i + 1}. {action}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Schedule Meeting
                      </button>
                      <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                        Escalate
                      </button>
                      <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                        View History
                      </button>
                      <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                        Recovery Plan
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No at-risk clients.</p>
            )}

            <div className="text-center">
              <Link
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All At-Risk Accounts ({atRiskClients.length})
              </Link>
            </div>
          </div>
        </WidgetCard>

        {/* Bottom Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Client Engagement Trend & Revenue Concentration */}
          <WidgetCard
            title="Client Engagement Trend"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detailed Analysis
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold text-dark dark:text-white">73/100</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Current Avg Health Score</div>
                <div className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">
                  Previous: 78/100 (↓ 5 points) ⚠
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Trend: Declining
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-dark dark:text-white mb-2">
                  Contributing Factors:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• {atRiskClients.length} new at-risk accounts</li>
                  <li>• Industry challenges</li>
                  <li>• Resource constraints</li>
                </ul>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Revenue Concentration"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Growth Strategy
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold text-dark dark:text-white">53%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Top 3 Clients</div>
              </div>

              <div>
                <p className="text-sm font-medium text-dark dark:text-white mb-2">
                  Top Clients:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {healthyClients.slice(0, 3).map((c: any) => (
                    <li key={c.id}>• {c.client_name}: ${(c.revenue / 1000).toFixed(0)}K</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  Risk: High concentration
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Recommendation: Diversify client base
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Retention & Expansion */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard
            title="Retention Metrics"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Retention Strategies
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-dark dark:text-white">89%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Retention Rate</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Target: 90%</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-dark dark:text-white">{atRiskClients.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Churn Risk</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Accounts</div>
                </div>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Expansion Opportunities"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                All Opportunities
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Total Pipeline: ${(data.kpis.pipeline_value / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Client Activity Log */}
        <WidgetCard
          title="Client Activity Log"
          action={
            <div className="flex gap-2">
              <select className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                <option>Filter ▼</option>
                <option>All Activities</option>
                <option>Meetings</option>
                <option>Calls</option>
                <option>Reviews</option>
              </select>
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5">
                View Full Activity Log
              </Link>
            </div>
          }
        >
          <div className="space-y-4">
            {activityLog.length > 0 ? (
              activityLog.map((activity: any, index: number) => (
                <div
                  key={index}
                  className={`pb-4 ${index < activityLog.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-32 text-sm text-gray-600 dark:text-gray-400">
                      {activity.date}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-dark dark:text-white">
                        {activity.client} - {activity.event}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.details}
                      </p>
                      {activity.outcome && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Outcome: {activity.outcome}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity.</p>
            )}
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

