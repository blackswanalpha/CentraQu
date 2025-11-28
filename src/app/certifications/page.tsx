"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { CertificationCard } from "@/components/Certifications/certification-card";
import { DeleteCertificationModal } from "@/components/Certifications/delete-certification-modal";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { Certification, CertificationStatus } from "@/types/audit";
import Link from "next/link";
import {
  fetchCertifications,
  deleteCertification,
  getCertificationStats,
} from "@/lib/api/certifications";

export default function CertificationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CertificationStatus | "all">(
    "all"
  );
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    certification: Certification | null;
  }>({ isOpen: false, certification: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch certifications on mount
  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCertifications();
      setCertifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load certifications");
      console.error("Error loading certifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search
  const filteredCertifications = useMemo(() => {
    return certifications.filter((cert) => {
      // Safely access nested properties
      const clientName = cert.client?.name || cert.clientName || '';
      const standard = cert.iso_standard?.code || cert.standard || '';
      const certNumber = cert.certificate_number || cert.certificateNumber || '';

      const matchesSearch =
        clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.toLowerCase().includes(searchTerm.toLowerCase()) ||
        certNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || cert.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [certifications, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: certifications.length,
      active: certifications.filter((c) => c.status === "active").length,
      expiringSoon: certifications.filter(
        (c) => c.status === "expiring-soon"
      ).length,
      expired: certifications.filter((c) => c.status === "expired").length,
    };
  }, [certifications]);

  const handleDelete = async () => {
    if (!deleteModal.certification) return;

    setIsDeleting(true);
    try {
      await deleteCertification(deleteModal.certification.id);
      setCertifications((prev) =>
        prev.filter((c) => c.id !== deleteModal.certification?.id)
      );
      setDeleteModal({ isOpen: false, certification: null });
    } catch (error) {
      console.error("Failed to delete certification:", error);
      setError(error instanceof Error ? error.message : "Failed to delete certification");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Certifications
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage and monitor all client certifications
            </p>
          </div>
          <Link href="/certifications/new">
            <Button variant="primary">+ Add Certification</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-success mt-1">
              {stats.active}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expiring Soon
            </p>
            <p className="text-2xl font-bold text-accent mt-1">
              {stats.expiringSoon}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Expired</p>
            <p className="text-2xl font-bold text-error mt-1">
              {stats.expired}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <FormInput
            placeholder="Search by client, standard, or certificate number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as CertificationStatus | "all")
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expiring-soon">Expiring Soon</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
            <option value="revoked">Revoked</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Certifications Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Loading certifications...
            </p>
          </div>
        ) : filteredCertifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertifications.map((cert) => (
              <CertificationCard
                key={cert.id}
                certification={cert}
                onEdit={() =>
                  router.push(`/certifications/${cert.id}/edit`)
                }
                onDelete={() =>
                  setDeleteModal({ isOpen: true, certification: cert })
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No certifications found
            </p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteCertificationModal
        isOpen={deleteModal.isOpen}
        certification={deleteModal.certification}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, certification: null })}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}

