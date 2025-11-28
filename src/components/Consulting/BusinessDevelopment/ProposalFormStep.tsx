import { ReactNode } from "react";

interface ProposalFormStepProps {
  stepNumber: number;
  title: string;
  description?: string;
  children: ReactNode;
  isActive: boolean;
}

export function ProposalFormStep({
  stepNumber,
  title,
  description,
  children,
  isActive,
}: ProposalFormStepProps) {
  if (!isActive) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      {/* Step Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          {stepNumber}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-dark dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">{children}</div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  helpText?: string;
  children: ReactNode;
}

export function FormField({ label, required, helpText, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-dark dark:text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helpText && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{helpText}</p>}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-dark dark:text-white">{title}</h4>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

