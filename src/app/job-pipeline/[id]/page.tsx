'use client';

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { useState, useEffect } from "react";
import { jobPipelineService, JobPipelineDetail, PipelineTimeline } from "@/services/jobPipeline.service";
import Link from "next/link";
import { useParams } from 'next/navigation';

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

const TIMELINE_PHASES = [
  { key: 'opportunity', label: 'Opportunity', color: 'bg-blue-500', stages: ['LEAD', 'OPPORTUNITY'] },
  { key: 'contract', label: 'Contract', color: 'bg-yellow-500', stages: ['CONTRACT'] },
  { key: 'audit', label: 'Audit Process', color: 'bg-purple-500', stages: ['AUDIT_SCHEDULED', 'AUDIT_IN_PROGRESS', 'AUDIT_COMPLETED'] },
  { key: 'certification', label: 'Certification', color: 'bg-green-500', stages: ['CERTIFICATE_ISSUED', 'SURVEILLANCE_DUE', 'CLOSED'] }
];

export default function JobPipelineDetailPage() {
  const params = useParams();
  const pipelineId = params.id as string;
  
  const [pipeline, setPipeline] = useState<JobPipelineDetail | null>(null);
  const [timeline, setTimeline] = useState<PipelineTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'details'>('timeline');

  useEffect(() => {
    if (pipelineId) {
      fetchPipelineData();
    }
  }, [pipelineId]);

  const fetchPipelineData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pipelineResponse, timelineResponse] = await Promise.all([
        jobPipelineService.getPipeline(pipelineId),
        jobPipelineService.getTimeline(pipelineId)
      ]);

      setPipeline(pipelineResponse);
      setTimeline(timelineResponse);
    } catch (err) {
      console.error('Error fetching pipeline data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pipeline data');
    } finally {
      setLoading(false);
    }
  };

  const getPhaseForStage = (stage: string) => {
    return TIMELINE_PHASES.find(phase => phase.stages.includes(stage)) || TIMELINE_PHASES[0];
  };

  const getTimelineProgress = () => {
    if (!pipeline) return { completed: 0, total: 0, percentage: 0 };
    
    const currentPhase = getPhaseForStage(pipeline.current_stage);
    const currentPhaseIndex = TIMELINE_PHASES.findIndex(p => p.key === currentPhase.key);
    
    let completed = currentPhaseIndex;
    if (pipeline.current_stage === 'CLOSED' || pipeline.current_stage === 'CERTIFICATE_ISSUED') {
      completed = TIMELINE_PHASES.length;
    }
    
    return {
      completed,
      total: TIMELINE_PHASES.length,
      percentage: (completed / TIMELINE_PHASES.length) * 100
    };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pipeline details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !pipeline) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error: {error || 'Pipeline not found'}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const progress = getTimelineProgress();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-2">
            <Link href="/job-pipeline" className="text-gray-500 hover:text-primary text-sm font-medium">
              Pipeline
            </Link>
            <span className="text-gray-500 text-sm">/</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">
              {pipeline.client_name}
            </span>
          </div>

          {/* Page Heading */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {pipeline.service_description} - {pipeline.client_name}
              </h1>
              <div className="mt-2 flex items-center gap-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STAGE_COLORS[pipeline.current_stage]}`}>
                  {STAGE_LABELS[pipeline.current_stage]}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Pipeline ID: {pipeline.pipeline_id}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {pipeline.days_in_current_stage} days in current stage
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
            <div className="flex h-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700">
              <label className="flex cursor-pointer h-full items-center justify-center px-3 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-sm has-[:checked]:text-gray-900 dark:has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium rounded-md">
                <span className="truncate">Timeline</span>
                <input
                  className="invisible w-0"
                  type="radio"
                  name="view-mode"
                  value="timeline"
                  checked={viewMode === 'timeline'}
                  onChange={() => setViewMode('timeline')}
                />
              </label>
              <label className="flex cursor-pointer h-full items-center justify-center px-3 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-sm has-[:checked]:text-gray-900 dark:has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium rounded-md">
                <span className="truncate">Details</span>
                <input
                  className="invisible w-0"
                  type="radio"
                  name="view-mode"
                  value="details"
                  checked={viewMode === 'details'}
                  onChange={() => setViewMode('details')}
                />
              </label>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Progress: {Math.round(progress.percentage)}%
            </span>
            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {viewMode === 'timeline' ? (
          /* Timeline View */
          <div className="grid grid-cols-[320px_1fr] gap-6 overflow-hidden">
            {/* Left Panel: Phase List */}
            <div className="space-y-4 overflow-y-auto max-h-[600px]">
              <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  Pipeline Phases
                </h3>
              </div>

              <div className="space-y-2 p-2">
                {TIMELINE_PHASES.map((phase, index) => {
                  const isActive = phase.stages.includes(pipeline.current_stage);
                  const isCompleted = index < progress.completed;
                  
                  return (
                    <div
                      key={phase.key}
                      className={`grid grid-cols-[1fr_100px_80px] items-center gap-4 px-2 py-3 rounded-md transition-colors ${
                        isActive ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : isActive ? phase.color : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className={`text-sm font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {phase.label}
                        </span>
                      </div>
                      <div className="text-right">
                        {phase.stages.includes(pipeline.current_stage) && (
                          <span className="text-xs text-primary font-medium">Current</span>
                        )}
                        {isCompleted && !isActive && (
                          <span className="text-xs text-green-600 font-medium">Complete</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isCompleted ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                          isActive ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {isCompleted ? 'Done' : isActive ? 'Active' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Milestones Section */}
              {pipeline.milestones && pipeline.milestones.length > 0 && (
                <div className="mt-6">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                      Upcoming Milestones
                    </h3>
                  </div>
                  <div className="p-2 space-y-2">
                    {pipeline.milestones.slice(0, 5).map((milestone) => (
                      <div key={milestone.id} className="px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {milestone.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {new Date(milestone.due_date).toLocaleDateString()}
                        </p>
                        {milestone.is_overdue && (
                          <span className="text-xs text-red-600 font-medium">Overdue</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel: Timeline Chart */}
            <div className="flex flex-col overflow-hidden">
              {/* Timeline Header */}
              <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() + i - 2);
                  const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                  
                  return (
                    <div key={i} className="text-center text-sm font-semibold p-3 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                      {monthYear}
                    </div>
                  );
                })}
              </div>

              {/* Timeline Grid */}
              <div className="relative grid grid-cols-12 flex-grow overflow-auto">
                {/* Grid Lines */}
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="border-r border-gray-200 dark:border-gray-700 min-h-[300px]"></div>
                ))}

                {/* Timeline Bars */}
                <div className="absolute inset-0 p-4 space-y-6">
                  {TIMELINE_PHASES.map((phase, index) => {
                    const isActive = phase.stages.includes(pipeline.current_stage);
                    const isCompleted = index < progress.completed;
                    const startPosition = (index * 3); // 3 months per phase
                    const width = 2.5; // 2.5 months duration
                    const progressWidth = isActive ? (pipeline.stage_progress_percentage / 100) * width : isCompleted ? width : 0;
                    
                    return (
                      <div
                        key={phase.key}
                        className="relative"
                        style={{
                          marginLeft: `${(startPosition / 12) * 100}%`,
                          width: `${(width / 12) * 100}%`
                        }}
                      >
                        {/* Phase Bar Background */}
                        <div className={`h-6 w-full rounded ${phase.color}/30 border-2 border-${phase.color.split('-')[1]}-500`}>
                          {/* Progress Fill */}
                          <div
                            className={`h-full rounded ${phase.color} transition-all duration-500`}
                            style={{ width: `${(progressWidth / width) * 100}%` }}
                          ></div>
                          
                          {/* Current Position Indicator */}
                          {isActive && (
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-2 border-blue-600 rounded-full"
                              style={{ right: `${100 - (progressWidth / width) * 100}%` }}
                            ></div>
                          )}
                        </div>
                        
                        {/* Phase Label */}
                        <div className="absolute -top-6 left-0 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {phase.label}
                        </div>
                      </div>
                    );
                  })}

                  {/* Milestone Markers */}
                  {pipeline.milestones && pipeline.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="absolute flex items-center"
                      style={{
                        left: `${((index + 1) * 15) % 100}%`, // Distribute milestones across timeline
                        top: `${120 + index * 40}px`
                      }}
                    >
                      <div className={`w-4 h-4 rotate-45 flex items-center justify-center ${
                        milestone.is_completed ? 'bg-green-600' : milestone.is_overdue ? 'bg-red-600' : 'bg-purple-600'
                      }`} title={milestone.title}>
                        <svg className="w-2 h-2 text-white -rotate-45" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Details View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pipeline Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pipeline Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                    <p className="font-medium text-gray-900 dark:text-white">{pipeline.client_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                    <p className="font-medium text-gray-900 dark:text-white">{pipeline.service_description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Value</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {pipeline.currency} {pipeline.estimated_value?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {pipeline.owner ? `${pipeline.owner.first_name} ${pipeline.owner.last_name}` : 'Unassigned'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Audits */}
              {pipeline.audits && pipeline.audits.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audits</h3>
                  <div className="space-y-3">
                    {pipeline.audits.map((audit) => (
                      <div key={audit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{audit.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {audit.audit_type} • {audit.planned_start_date} - {audit.planned_end_date}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          audit.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                          audit.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {audit.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stage Transitions */}
              {pipeline.recent_transitions && pipeline.recent_transitions.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {pipeline.recent_transitions.slice(0, 5).map((transition) => (
                      <div key={transition.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {transition.from_stage} → {transition.to_stage}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(transition.transitioned_at).toLocaleDateString()}
                          </p>
                          {transition.transitioned_by && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              by {transition.transitioned_by.first_name} {transition.transitioned_by.last_name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    Advance Stage
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    Add Milestone
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    View Contract
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    Schedule Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}