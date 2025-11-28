'use client';

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { useState, useEffect } from "react";
import { jobPipelineService, JobPipeline, PipelineDashboard } from "@/services/jobPipeline.service";
import Link from "next/link";

const STAGE_COLORS = {
  LEAD: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  OPPORTUNITY: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  CONTRACT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
  AUDIT_SCHEDULED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
  AUDIT_IN_PROGRESS: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200',
  AUDIT_COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  CERTIFICATE_ISSUED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200',
  SURVEILLANCE_DUE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
  CLOSED: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
};

const STAGE_LABELS = {
  LEAD: 'Lead',
  OPPORTUNITY: 'Opportunity',
  CONTRACT: 'Contract',
  AUDIT_SCHEDULED: 'Audit Scheduled',
  AUDIT_IN_PROGRESS: 'Audit In Progress',
  AUDIT_COMPLETED: 'Audit Completed',
  CERTIFICATE_ISSUED: 'Certificate Issued',
  SURVEILLANCE_DUE: 'Surveillance Due',
  CLOSED: 'Closed'
};

export default function JobPipelinePage() {
  const [pipelines, setPipelines] = useState<JobPipeline[]>([]);
  const [dashboardData, setDashboardData] = useState<PipelineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filters, setFilters] = useState({
    stage: '',
    status: '',
    search: ''
  });

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pipelinesResponse, dashboardResponse] = await Promise.all([
        jobPipelineService.getPipelines(filters),
        jobPipelineService.getDashboard()
      ]);

      setPipelines(pipelinesResponse.results);
      setDashboardData(dashboardResponse);
    } catch (err) {
      console.error('Error fetching pipeline data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading && !dashboardData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job pipeline...</p>
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
              Job Pipeline
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track opportunities from lead to certification
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/business-development/opportunities/new"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              New Opportunity
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </p>
          </div>
        )}

        {/* Dashboard Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Pipelines</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{dashboardData.quick_stats.active}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">On Hold</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{dashboardData.quick_stats.on_hold}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{dashboardData.quick_stats.completed}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Milestones</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{dashboardData.overdue_count}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-0 flex-1">
              <input
                type="text"
                placeholder="Search pipelines..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={filters.stage}
              onChange={(e) => handleFilterChange('stage', e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Stages</option>
              {Object.entries(STAGE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Pipeline List */}
        <div className="space-y-6">
          {/* View Toggle */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pipeline Overview</h2>
            <div className="flex h-10 w-full max-w-xs items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
              <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-800 has-[:checked]:shadow-sm has-[:checked]:text-gray-900 dark:has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">
                <span className="truncate">Kanban</span>
                <input 
                  checked={viewMode === 'kanban'} 
                  onChange={() => setViewMode('kanban')}
                  className="invisible w-0" 
                  name="view-toggle" 
                  type="radio" 
                  value="kanban"
                />
              </label>
              <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-800 has-[:checked]:shadow-sm has-[:checked]:text-gray-900 dark:has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">
                <span className="truncate">List</span>
                <input 
                  checked={viewMode === 'list'} 
                  onChange={() => setViewMode('list')}
                  className="invisible w-0" 
                  name="view-toggle" 
                  type="radio" 
                  value="list"
                />
              </label>
            </div>
          </div>

          {/* Pipeline Content */}
          {viewMode === 'kanban' ? (
            /* Kanban Board */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {/* Opportunity Column */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-baseline px-1">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Opportunities</h3>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {dashboardData ? 
                    pipelines.filter(p => p.current_stage === 'OPPORTUNITY').length : 0}
                </span>
              </div>
              <div className="flex flex-col gap-4 min-h-[400px]">
                {pipelines.filter(p => p.current_stage === 'OPPORTUNITY').map((pipeline) => (
                  <div key={pipeline.id} className="cursor-grab rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/job-pipeline/${pipeline.id}`}>
                      <p className="font-semibold text-gray-900 dark:text-white">{pipeline.service_description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pipeline.client_name}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {pipeline.currency} {pipeline.estimated_value?.toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${STAGE_COLORS[pipeline.current_stage]}`}>
                          {STAGE_LABELS[pipeline.current_stage]}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {pipeline.days_in_current_stage} days in stage
                        </span>
                        {pipeline.owner && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {pipeline.owner.first_name} {pipeline.owner.last_name}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
                {pipelines.filter(p => p.current_stage === 'OPPORTUNITY').length === 0 && (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No opportunities yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contracts Column */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-baseline px-1">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Contracts</h3>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {pipelines.filter(p => p.current_stage === 'CONTRACT').length}
                </span>
              </div>
              <div className="flex flex-col gap-4 min-h-[400px]">
                {pipelines.filter(p => p.current_stage === 'CONTRACT').map((pipeline) => (
                  <div key={pipeline.id} className="cursor-grab rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/job-pipeline/${pipeline.id}`}>
                      <p className="font-semibold text-gray-900 dark:text-white">{pipeline.service_description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pipeline.client_name}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {pipeline.currency} {pipeline.estimated_value?.toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${STAGE_COLORS[pipeline.current_stage]}`}>
                          {STAGE_LABELS[pipeline.current_stage]}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {pipeline.days_in_current_stage} days in stage
                        </span>
                        {pipeline.owner && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {pipeline.owner.first_name} {pipeline.owner.last_name}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
                {pipelines.filter(p => p.current_stage === 'CONTRACT').length === 0 && (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No contracts yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audits Column */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-baseline px-1">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Audits</h3>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {pipelines.filter(p => ['AUDIT_SCHEDULED', 'AUDIT_IN_PROGRESS', 'AUDIT_COMPLETED'].includes(p.current_stage)).length}
                </span>
              </div>
              <div className="flex flex-col gap-4 min-h-[400px]">
                {pipelines.filter(p => ['AUDIT_SCHEDULED', 'AUDIT_IN_PROGRESS', 'AUDIT_COMPLETED'].includes(p.current_stage)).map((pipeline) => (
                  <div key={pipeline.id} className="cursor-grab rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/job-pipeline/${pipeline.id}`}>
                      <p className="font-semibold text-gray-900 dark:text-white">{pipeline.service_description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pipeline.client_name}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {pipeline.currency} {pipeline.estimated_value?.toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${STAGE_COLORS[pipeline.current_stage]}`}>
                          {STAGE_LABELS[pipeline.current_stage]}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {pipeline.days_in_current_stage} days in stage
                        </span>
                        {pipeline.owner && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {pipeline.owner.first_name} {pipeline.owner.last_name}
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${pipeline.stage_progress_percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Progress: {pipeline.stage_progress_percentage}%
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
                {pipelines.filter(p => ['AUDIT_SCHEDULED', 'AUDIT_IN_PROGRESS', 'AUDIT_COMPLETED'].includes(p.current_stage)).length === 0 && (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No audits scheduled</p>
                  </div>
                )}
              </div>
            </div>

            {/* Certificate Issuance Column */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-baseline px-1">
                <h3 className="font-bold text-green-600 dark:text-green-400">Certificate Issuance</h3>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {pipelines.filter(p => ['CERTIFICATE_ISSUED', 'SURVEILLANCE_DUE', 'CLOSED'].includes(p.current_stage)).length}
                </span>
              </div>
              <div className="flex flex-col gap-4 min-h-[400px]">
                {pipelines.filter(p => ['CERTIFICATE_ISSUED', 'SURVEILLANCE_DUE', 'CLOSED'].includes(p.current_stage)).map((pipeline) => (
                  <div key={pipeline.id} className={`cursor-grab rounded-xl border p-4 shadow-sm transition-shadow ${
                    pipeline.current_stage === 'CLOSED' 
                      ? 'opacity-70 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
                  }`}>
                    <Link href={`/job-pipeline/${pipeline.id}`}>
                      <p className="font-semibold text-gray-900 dark:text-white">{pipeline.service_description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pipeline.client_name}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {pipeline.currency} {pipeline.estimated_value?.toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${STAGE_COLORS[pipeline.current_stage]}`}>
                          {STAGE_LABELS[pipeline.current_stage]}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {pipeline.days_in_current_stage} days in stage
                        </span>
                        {pipeline.owner && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {pipeline.owner.first_name} {pipeline.owner.last_name}
                          </span>
                        )}
                      </div>
                      {pipeline.certificate_issued_date && (
                        <div className="mt-2">
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Certificate issued: {new Date(pipeline.certificate_issued_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
                {pipelines.filter(p => ['CERTIFICATE_ISSUED', 'SURVEILLANCE_DUE', 'CLOSED'].includes(p.current_stage)).length === 0 && (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No certificates issued</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          ) : (
            /* List View */
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pipeline List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pipelines.map((pipeline) => (
                      <tr key={pipeline.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/job-pipeline/${pipeline.id}`} className="text-primary hover:text-primary/80 font-medium">
                            {pipeline.client_name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">{pipeline.service_description}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">ID: {pipeline.pipeline_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STAGE_COLORS[pipeline.current_stage]}`}>
                            {STAGE_LABELS[pipeline.current_stage]}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {pipeline.days_in_current_stage} days
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {pipeline.currency} {pipeline.estimated_value?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {pipeline.owner ? `${pipeline.owner.first_name} ${pipeline.owner.last_name}` : 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${pipeline.stage_progress_percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {pipeline.stage_progress_percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {pipelines.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No pipelines found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      
      </div>
    </DashboardLayout>
  );
}