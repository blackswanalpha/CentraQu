import { cn } from "@/lib/utils";
import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, error, hint, icon, required, className, value, ...props },
    ref
  ) => {
    // Convert null to empty string to avoid React warning
    const safeValue = value === null ? "" : value;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-dark dark:text-white">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              icon ? "pl-10" : "",
              error
                ? "border-error focus:ring-error"
                : "border-stroke focus:border-primary",
              className
            )}
            value={safeValue}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-error">{error}</p>
        )}

        {hint && !error && (
          <p className="text-xs text-gray-600 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

