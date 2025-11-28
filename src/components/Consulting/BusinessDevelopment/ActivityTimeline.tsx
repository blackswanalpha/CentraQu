import { Badge } from "@/components/Dashboard/badge";

interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "note" | "task" | "proposal" | "update";
  title: string;
  description?: string;
  user: string;
  timestamp: string;
  metadata?: {
    duration?: string;
    attendees?: string[];
    outcome?: string;
    nextSteps?: string;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
  maxItems?: number;
  showAddButton?: boolean;
}

export function ActivityTimeline({
  activities,
  maxItems = 10,
  showAddButton = true,
}: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return "📞";
      case "email":
        return "📧";
      case "meeting":
        return "🤝";
      case "note":
        return "📝";
      case "task":
        return "✅";
      case "proposal":
        return "📄";
      case "update":
        return "🔄";
      default:
        return "📌";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "call":
        return "primary";
      case "email":
        return "info";
      case "meeting":
        return "success";
      case "note":
        return "warning";
      case "task":
        return "success";
      case "proposal":
        return "primary";
      case "update":
        return "info";
      default:
        return "default";
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="space-y-4">
      {/* Add Activity Button */}
      {showAddButton && (
        <button className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400">
          + Add Activity
        </button>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Activities */}
        <div className="space-y-6">
          {displayedActivities.map((activity, index) => (
            <div key={activity.id} className="relative pl-12">
              {/* Icon */}
              <div className="absolute left-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-dark dark:text-white">
                        {activity.title}
                      </h4>
                      <Badge
                        label={activity.type.toUpperCase()}
                        variant={getActivityColor(activity.type) as any}
                        size="sm"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.user} • {activity.timestamp}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {activity.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {activity.description}
                  </p>
                )}

                {/* Metadata */}
                {activity.metadata && (
                  <div className="space-y-2 text-sm">
                    {activity.metadata.duration && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                        <span className="text-dark dark:text-white">
                          {activity.metadata.duration}
                        </span>
                      </div>
                    )}
                    {activity.metadata.attendees && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Attendees:</span>
                        <span className="text-dark dark:text-white">
                          {activity.metadata.attendees.join(", ")}
                        </span>
                      </div>
                    )}
                    {activity.metadata.outcome && (
                      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-2 border border-green-200 dark:border-green-700">
                        <p className="text-sm text-green-800 dark:text-green-300">
                          <strong>Outcome:</strong> {activity.metadata.outcome}
                        </p>
                      </div>
                    )}
                    {activity.metadata.nextSteps && (
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 border border-blue-200 dark:border-blue-700">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          <strong>Next Steps:</strong> {activity.metadata.nextSteps}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show More */}
      {activities.length > maxItems && (
        <button className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
          Show {activities.length - maxItems} more activities
        </button>
      )}

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No activities yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Add your first activity to start tracking
          </p>
        </div>
      )}
    </div>
  );
}

