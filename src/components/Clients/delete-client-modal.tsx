"use client";

import { Modal } from "@/components/Dashboard/modal";
import { Button } from "@/components/Dashboard/button";
import { Client } from "@/types/audit";

interface DeleteClientModalProps {
  isOpen: boolean;
  client: Client | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteClientModal({
  isOpen,
  client,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteClientModalProps) {
  if (!client) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Delete Client"
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
            Delete Client
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
            Are you sure you want to delete the following client?
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="font-bold text-dark dark:text-white">{client.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {client.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {client.phone}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-dark dark:text-white">
            This will delete:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
            <li>• Client profile and contact information</li>
            <li>• All associated audit records</li>
            <li>• Audit findings and reports</li>
            <li>• Client communication history</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

