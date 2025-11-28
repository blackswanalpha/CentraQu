"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { ClientsTable } from "@/components/Clients/clients-table";
import { DeleteClientModal } from "@/components/Clients/delete-client-modal";
import { Pagination } from "@/components/Dashboard/pagination";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { Client, ClientStatus } from "@/types/audit";
import { clientService } from "@/services/client.service";
import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    client: Client | null;
  }>({ isOpen: false, client: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch clients from backend API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all pages of clients
        let allClients: Client[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await clientService.getClients({
            status: statusFilter !== 'all' ? statusFilter : undefined,
            search: searchTerm || undefined,
            page,
          });

          allClients = [...allClients, ...(response.results || [])];

          // Check if there's a next page
          hasMore = !!response.next;
          page++;
        }

        setClients(allClients);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch clients');
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [statusFilter, searchTerm]);

  // Filter, search, and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contact.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort clients
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Client];
      let bValue: any = b[sortBy as keyof Client];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      // Convert to string for comparison
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [clients, searchTerm, statusFilter, sortBy, sortOrder]);

  // Paginate clients
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedClients.slice(startIndex, endIndex);
  }, [filteredAndSortedClients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);

  // Handle delete
  const handleDeleteClick = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setDeleteModal({ isOpen: true, client });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.client) return;

    setIsDeleting(true);
    try {
      await clientService.deleteClient(deleteModal.client.id);

      setClients((prev) =>
        prev.filter((c) => c.id !== deleteModal.client?.id)
      );
      setDeleteModal({ isOpen: false, client: null });
    } catch (error) {
      console.error("Error deleting client:", error);
      setError(error instanceof Error ? error.message : 'Failed to delete client');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    atRisk: clients.filter((c) => c.status === "at-risk").length,
    inactive: clients.filter((c) => c.status === "inactive").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Clients
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage and monitor all client accounts
            </p>
          </div>
          <Link href="/clients/new">
            <Button variant="primary">+ Add Client</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-success mt-1">{stats.active}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
            <p className="text-2xl font-bold text-accent mt-1">{stats.atRisk}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
            <p className="text-2xl font-bold text-error mt-1">{stats.inactive}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              placeholder="Search by name, email, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClientStatus | "all")}
              className="rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="at-risk">At Risk</option>
              <option value="inactive">Inactive</option>
              <option value="churned">Churned</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-red-200 dark:border-red-700 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : filteredAndSortedClients.length > 0 ? (
          <div className="space-y-4">
            <ClientsTable
              clients={paginatedClients}
              onDelete={handleDeleteClick}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedClients.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {clients.length === 0 ? 'No clients found. Add your first client to get started.' : 'No clients found matching your criteria'}
            </p>
            {clients.length === 0 && (
              <Link href="/clients/new" className="mt-4 inline-block">
                <Button variant="primary">+ Add First Client</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteClientModal
        isOpen={deleteModal.isOpen}
        client={deleteModal.client}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, client: null })}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}

