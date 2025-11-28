"use client";

import { useRouter } from "next/navigation";
import { Employee, EmployeeStatus } from "@/types/audit";
import { Badge } from "@/components/Dashboard/badge";

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employeeId: string) => void;
}

const statusVariants: Record<EmployeeStatus, "success" | "warning" | "error" | "info" | "neutral"> = {
  active: "success",
  inactive: "neutral",
  "on-leave": "warning",
  terminated: "error",
};

const statusLabels: Record<EmployeeStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  "on-leave": "On Leave",
  terminated: "Terminated",
};

const roleLabels: Record<string, string> = {
  "lead-auditor": "Lead Auditor",
  auditor: "Auditor",
  "technical-expert": "Technical Expert",
  trainee: "Trainee",
  manager: "Manager",
  admin: "Admin",
};

export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const router = useRouter();
  const status = employee.status as EmployeeStatus;
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            onClick={() => router.push(`/employees/${employee.id}`)}
            className="text-lg font-bold text-dark dark:text-white hover:text-primary transition-colors cursor-pointer"
          >
            {fullName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {roleLabels[employee.role] || employee.role}
          </p>
        </div>
        <Badge
          label={statusLabels[status]}
          variant={statusVariants[status]}
        />
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Department:</span> {employee.department}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Email:</span>{" "}
          <a href={`mailto:${employee.email}`} className="text-primary hover:underline">
            {employee.email}
          </a>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Phone:</span>{" "}
          <a href={`tel:${employee.phone}`} className="text-primary hover:underline">
            {employee.phone}
          </a>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Experience</p>
          <p className="text-lg font-bold text-dark dark:text-white">
            {employee.experience || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Utilization</p>
          <p className="text-sm font-medium text-dark dark:text-white">
            {employee.utilization ? `${employee.utilization}%` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Satisfaction</p>
          <p className="text-sm font-medium text-dark dark:text-white">
            {employee.satisfaction ? `${employee.satisfaction}/5` : "—"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/employees/${employee.id}`)}
          className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors text-center"
        >
          View Details
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(employee)}
            className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(employee.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

