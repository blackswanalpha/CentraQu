/**
 * Scheduler Service
 * Aggregates data from tasks, workflows, audits, and checklists for the scheduler view
 */

import { taskService, Task } from './task.service';
import { workflowService, Workflow } from './workflow.service';
import { auditService, Audit } from './audit.service';

export interface SchedulerItem {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'workflow' | 'audit-activity' | 'checklist';
  status: string;
  priority: string;
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: Date;
  estimatedDuration?: number;
  tags?: string[];
  // Type-specific fields
  taskType?: string;
  workflowType?: string;
  auditId?: string;
  clientId?: string;
  clientName?: string;
  standard?: string;
  completionRate?: number;
}

export const schedulerService = {
  /**
   * Get all scheduler items (tasks, workflows, audits, checklists)
   */
  async getSchedulerItems(params?: {
    start_date?: string;
    end_date?: string;
    assigned_to?: number;
    status?: string;
    priority?: string;
    type?: string[];
  }): Promise<SchedulerItem[]> {
    const items: SchedulerItem[] = [];

    try {
      // Fetch tasks
      if (!params?.type || params.type.includes('task')) {
        const tasksResponse = await taskService.getTasks({
          start_date: params?.start_date,
          end_date: params?.end_date,
          assigned_to: params?.assigned_to,
          status: params?.status,
          priority: params?.priority,
        });

        const taskItems: SchedulerItem[] = tasksResponse.results.map((task: Task) => ({
          id: `task-${task.id}`,
          title: task.title,
          description: task.description,
          type: 'task' as const,
          status: task.status.toLowerCase(),
          priority: task.priority.toLowerCase(),
          assignedTo: task.assigned_to?.toString(),
          assignedToName: task.assigned_to_name,
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          estimatedDuration: task.estimated_hours ? task.estimated_hours * 60 : undefined,
          tags: task.tags ? task.tags.split(',').map(t => t.trim()) : [],
          taskType: task.task_type,
        }));

        items.push(...taskItems);
      }

      // Fetch workflows
      if (!params?.type || params.type.includes('workflow')) {
        const workflowsResponse = await workflowService.getWorkflows({
          start_date: params?.start_date,
          end_date: params?.end_date,
          assigned_to: params?.assigned_to,
          status: params?.status,
          priority: params?.priority,
        });

        const workflowItems: SchedulerItem[] = workflowsResponse.results.map((workflow: Workflow) => ({
          id: `workflow-${workflow.id}`,
          title: workflow.title,
          description: workflow.description,
          type: 'workflow' as const,
          status: workflow.status.toLowerCase().replace('_', '-'),
          priority: workflow.priority.toLowerCase(),
          assignedTo: workflow.assigned_to?.toString(),
          assignedToName: workflow.assigned_to_name,
          dueDate: workflow.due_date ? new Date(workflow.due_date) : undefined,
          estimatedDuration: workflow.estimated_duration,
          tags: workflow.tags ? workflow.tags.split(',').map(t => t.trim()) : [],
          workflowType: workflow.workflow_type,
          completionRate: workflow.completion_rate,
        }));

        items.push(...workflowItems);
      }

      // Fetch audits
      if (!params?.type || params.type.includes('audit-activity')) {
        const auditsResponse = await auditService.getAudits({
          ordering: '-planned_start_date',
        });

        const auditItems: SchedulerItem[] = auditsResponse.results
          .filter((audit: Audit) => {
            // Filter by date range if provided
            if (params?.start_date && audit.planned_start_date) {
              if (new Date(audit.planned_start_date) < new Date(params.start_date)) {
                return false;
              }
            }
            if (params?.end_date && audit.planned_end_date) {
              if (new Date(audit.planned_end_date) > new Date(params.end_date)) {
                return false;
              }
            }
            return true;
          })
          .map((audit: Audit) => ({
            id: `audit-${audit.id}`,
            title: `${audit.title} - ${audit.client_name}`,
            description: audit.description,
            type: 'audit-activity' as const,
            status: audit.status.toLowerCase(),
            priority: 'medium', // Audits don't have priority, default to medium
            assignedTo: audit.lead_auditor?.toString(),
            assignedToName: audit.lead_auditor_name,
            dueDate: audit.planned_end_date ? new Date(audit.planned_end_date) : undefined,
            auditId: audit.id.toString(),
            clientId: audit.client.toString(),
            clientName: audit.client_name,
            standard: audit.iso_standard_name,
          }));

        items.push(...auditItems);
      }

      // Sort by due date
      items.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });

      return items;
    } catch (error) {
      console.error('Error fetching scheduler items:', error);
      throw error;
    }
  },
};

