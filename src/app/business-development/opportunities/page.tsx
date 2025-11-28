'use client';

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { FilterPanel } from "@/components/BusinessDevelopment/filter-panel";
import { OpportunityRow } from "@/components/BusinessDevelopment/opportunity-row";
import { QuickStats } from "@/components/BusinessDevelopment/quick-stats";
import { MyOpportunities } from "@/components/BusinessDevelopment/my-opportunities";
import { useState, useEffect } from "react";
import { opportunityService, type Opportunity, type OpportunityStats, type TeamMember } from "@/services/opportunity.service";
import Link from "next/link";

type OpportunityStage = "lead" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost";

// Map backend status to frontend stage
const mapStatusToStage = (status: string): OpportunityStage => {
  const statusMap: Record<string, OpportunityStage> = {
    'PROSPECTING': 'lead',
    'QUALIFICATION': 'qualified',
    'PROPOSAL': 'proposal',
    'NEGOTIATION': 'negotiation',
    'CLOSED_WON': 'closed-won',
    'CLOSED_LOST': 'closed-lost',
  };
  return statusMap[status] || 'lead';
};

// Map frontend stage to backend status
const mapStageToStatus = (stage: string): string => {
  const stageMap: Record<string, string> = {
    'lead': 'PROSPECTING',
    'qualified': 'QUALIFICATION',
    'proposal': 'PROPOSAL',
    'negotiation': 'NEGOTIATION',
    'closed-won': 'CLOSED_WON',
    'closed-lost': 'CLOSED_LOST',
  };
  return stageMap[stage] || '';
};

export default function OpportunitiesPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<OpportunityStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build filter params
        const params: any = {};
        if (filters.stage) {
          params.status = mapStageToStatus(filters.stage);
        }
        if (filters.owner) {
          params.owner = filters.owner;
        }

        // Fetch opportunities
        const oppsResponse = await opportunityService.getOpportunities(params);
        setOpportunities(oppsResponse.results || []);

        // Fetch statistics
        const statsResponse = await opportunityService.getStats();
        setStats(statsResponse.data);

        // Fetch team data
        const teamResponse = await opportunityService.getByOwner();
        setTeamMembers(teamResponse.data || []);

      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters({});
  };

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading opportunities...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Opportunities
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track and manage sales opportunities
            </p>
          </div>
          <Link
            href="/business-development/opportunities/new"
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 inline-block"
          >
            + New Opportunity
          </Link>
        </div>

        {/* Quick Stats and My Opportunities */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <QuickStats
            totalPipeline={stats?.total_pipeline || 0}
            weightedPipeline={stats?.weighted_forecast || 0}
            wonThisMonth={stats?.won_this_month || 0}
            conversionRate={stats?.conversion_rate || 0}
          />
          <MyOpportunities
            teamMembers={teamMembers.map(member => ({
              name: member.owner.name,
              count: member.opportunity_count,
              value: member.total_value
            }))}
            onViewPipeline={() => console.log("View pipeline")}
          />
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          filterOptions={[
            { label: "Stage", key: "stage", options: [
              { label: "Lead", value: "lead" },
              { label: "Qualified", value: "qualified" },
              { label: "Proposal", value: "proposal" },
              { label: "Negotiation", value: "negotiation" },
              { label: "Closed Won", value: "closed-won" },
              { label: "Closed Lost", value: "closed-lost" },
            ]},
            { label: "Owner", key: "owner", options: [
              { label: "John Smith", value: "john" },
              { label: "Sarah Johnson", value: "sarah" },
              { label: "Mike Davis", value: "mike" },
              { label: "Emily Brown", value: "emily" },
            ]},
          ]}
        />

        {/* Opportunities Table */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Probability
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Next Action
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {opportunities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        No opportunities found. Create your first opportunity to get started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  opportunities.map((opportunity) => (
                    <OpportunityRow
                      key={opportunity.id}
                      id={opportunity.id.toString()}
                      company={opportunity.client_name || opportunity.client?.name || 'Unknown Client'}
                      contact={opportunity.owner_name || opportunity.owner?.full_name || 'Unassigned'}
                      stage={mapStatusToStage(opportunity.status)}
                      value={typeof opportunity.estimated_value === 'string'
                        ? parseFloat(opportunity.estimated_value)
                        : opportunity.estimated_value}
                      probability={opportunity.probability}
                      nextAction={opportunity.last_activity?.description || 'Follow up'}
                      certType={opportunity.service_type}
                      owner={opportunity.owner_name || opportunity.owner?.full_name || 'Unassigned'}
                      createdDate={new Date(opportunity.created_at).toISOString().split('T')[0]}
                      lastActivity={opportunity.last_activity?.date || opportunity.updated_at}
                      onOpen={() => window.location.href = `/business-development/opportunities/${opportunity.id}`}
                      onEdit={() => window.location.href = `/business-development/opportunities/${opportunity.id}/edit`}
                      onEmail={() => console.log("Email:", opportunity.id)}
                      onCall={() => console.log("Call:", opportunity.id)}
                      onSchedule={() => console.log("Schedule:", opportunity.id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {opportunities.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {opportunities.length} of {stats?.opportunity_count || opportunities.length} opportunities
            </p>
            {stats && stats.opportunity_count > opportunities.length && (
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

