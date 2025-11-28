/**
 * Workspace Service
 * Handles workspace-related API calls
 */

export interface WorkspaceStats {
    audit: {
        active_audits: number;
        pending_reviews: number;
        team_members_online: number;
    };
    consulting: {
        active_projects: number;
        upcoming_deadlines: number;
        client_engagements: number;
    };
}

export const workspaceService = {
    /**
     * Get statistics for all workspaces
     * Uses Next.js API route (no authentication required)
     */
    async getWorkspaceStats(): Promise<WorkspaceStats> {
        const response = await fetch('/api/workspace/stats');

        if (!response.ok) {
            throw new Error(`Failed to fetch workspace stats: ${response.statusText}`);
        }

        return response.json();
    },
};
