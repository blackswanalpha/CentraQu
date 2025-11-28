interface WidgetCardProps {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export function WidgetCard({
  title,
  children,
  action,
  footer,
}: WidgetCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            {title}
          </h3>
          {action && <div>{action}</div>}
        </div>
      )}

      <div className={title ? "mb-4" : ""}>{children}</div>

      {footer && (
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}

