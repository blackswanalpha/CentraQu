import { cn } from "@/lib/utils";
import { useState } from "react";

interface AlertProps {
  title?: string;
  message: string;
  variant?: "info" | "success" | "warning" | "error";
  dismissible?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const variantClasses = {
  info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
  success:
    "bg-success/10 dark:bg-success/20 border-success/30 dark:border-success/40 text-success dark:text-success/90",
  warning:
    "bg-accent/10 dark:bg-accent/20 border-accent/30 dark:border-accent/40 text-accent dark:text-accent/90",
  error:
    "bg-error/10 dark:bg-error/20 border-error/30 dark:border-error/40 text-error dark:text-error/90",
};

const defaultIcons = {
  info: "ℹ️",
  success: "✓",
  warning: "⚠",
  error: "✕",
};

export function Alert({
  title,
  message,
  variant = "info",
  dismissible = true,
  icon,
  action,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "rounded-lg border p-4 flex items-start gap-3",
        variantClasses[variant]
      )}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0 text-lg">
        {icon || defaultIcons[variant]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-sm">{message}</p>

        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      {dismissible && (
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}

