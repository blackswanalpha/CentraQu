import { cn } from "@/lib/utils";
import React from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, error, hint, options, placeholder, required, className, ...props },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-dark dark:text-white">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          className={cn(
            "w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            error
              ? "border-error focus:ring-error"
              : "border-stroke focus:border-primary",
            "bg-white dark:bg-gray-800 text-dark dark:text-white",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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

FormSelect.displayName = "FormSelect";

