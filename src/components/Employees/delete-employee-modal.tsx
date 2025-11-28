"use client";

import { Modal } from "@/components/Dashboard/modal";
import { Button } from "@/components/Dashboard/button";
import { Employee } from "@/types/audit";

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteEmployeeModal({
  isOpen,
  employee,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteEmployeeModalProps) {
  if (!employee) return null;

  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Delete Employee"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={isLoading}
          >
            Delete Employee
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-900 dark:text-red-100">
            ⚠️ This action cannot be undone. All associated data will be permanently deleted.
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Are you sure you want to delete the following employee?
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="font-bold text-dark dark:text-white">{fullName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {employee.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {employee.phone}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {employee.department}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-dark dark:text-white">
            This will delete:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
            <li>• Employee profile and contact information</li>
            <li>• Employment history and records</li>
            <li>• Certification records</li>
            <li>• Audit assignments and history</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

