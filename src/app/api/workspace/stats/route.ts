import { NextResponse } from 'next/server';

/**
 * GET /api/workspace/stats
 * Returns statistics for both Audit and Consulting organizations
 */
export async function GET() {
    try {
        // Mock data - in production, this would fetch from your database
        const stats = {
            audit: {
                active_audits: 12,
                pending_reviews: 5,
                team_members_online: 8,
            },
            consulting: {
                active_projects: 7,
                upcoming_deadlines: 3,
                client_engagements: 15,
            },
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching workspace stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workspace statistics' },
            { status: 500 }
        );
    }
}
