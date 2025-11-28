import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "error" | "info" | "neutral";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantClasses = {
  primary: "bg-primary/10 text-primary dark:bg-primary/20",
  success: "bg-success/10 text-success dark:bg-success/20",
  warning: "bg-accent/10 text-accent dark:bg-accent/20",
  error: "bg-error/10 text-error dark:bg-error/20",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export function Badge({
  label,
  variant = "primary",
  size = "md",
  icon,
  dismissible = false,
  onDismiss,
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium transition-all",
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-1 flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label={`Dismiss ${label}`}
        >
          ✕
        </button>
      )}
    </div>
  );
}

