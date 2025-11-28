"use client";

import { Modal } from "@/components/Dashboard/modal";
import { Button } from "@/components/Dashboard/button";
import { Certification } from "@/types/audit";

interface DeleteCertificationModalProps {
  isOpen: boolean;
  certification: Certification | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteCertificationModal({
  isOpen,
  certification,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteCertificationModalProps) {
  if (!certification) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Delete Certification"
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
            Delete Certification
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <p className="text-sm font-medium text-error">
            ⚠️ This action cannot be undone
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Are you sure you want to delete this certification?
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Standard:
              </span>
              <span className="text-sm font-medium text-dark dark:text-white">
                {certification.standard}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Certificate Number:
              </span>
              <span className="text-sm font-medium text-dark dark:text-white">
                {certification.certificateNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Client:
              </span>
              <span className="text-sm font-medium text-dark dark:text-white">
                {certification.clientName}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          This certification record will be permanently deleted from the system.
        </p>
      </div>
    </Modal>
  );
}

