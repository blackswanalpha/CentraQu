import { Badge } from "@/components/Dashboard/badge";

interface StakeholderCardProps {
  name: string;
  title: string;
  email: string;
  phone?: string;
  role: "Champion" | "Supporter" | "Neutral" | "Blocker" | "Decision Maker";
  engagement: "High" | "Medium" | "Low";
  sentiment: "Positive" | "Neutral" | "Negative";
  lastContact?: string;
  notes?: string;
}

export function StakeholderCard({
  name,
  title,
  email,
  phone,
  role,
  engagement,
  sentiment,
  lastContact,
  notes,
}: StakeholderCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Champion":
        return "success";
      case "Supporter":
        return "primary";
      case "Neutral":
        return "warning";
      case "Blocker":
        return "danger";
      case "Decision Maker":
        return "info";
      default:
        return "default";
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "High":
        return "success";
      case "Medium":
        return "warning";
      case "Low":
        return "danger";
      default:
        return "default";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "success";
      case "Neutral":
        return "warning";
      case "Negative":
        return "danger";
      default:
        return "default";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "😊";
      case "Neutral":
        return "😐";
      case "Negative":
        return "😟";
      default:
        return "😐";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-dark dark:text-white">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getSentimentIcon(sentiment)}</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-1 mb-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📧</span>
          <a
            href={`mailto:${email}`}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {email}
          </a>
        </div>
        {phone && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📱</span>
            <a
              href={`tel:${phone}`}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {phone}
            </a>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge label={role} variant={getRoleColor(role) as any} size="sm" />
        <Badge
          label={`${engagement} Engagement`}
          variant={getEngagementColor(engagement) as any}
          size="sm"
        />
        <Badge
          label={`${sentiment} Sentiment`}
          variant={getSentimentColor(sentiment) as any}
          size="sm"
        />
      </div>

      {/* Last Contact */}
      {lastContact && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Last contact: {lastContact}
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3 text-sm text-gray-700 dark:text-gray-300">
          {notes}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button className="flex-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          Contact
        </button>
        <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
          Edit
        </button>
      </div>
    </div>
  );
}

