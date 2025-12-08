"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Client } from "@/types/audit";
import { clientService } from "@/services/client.service";
import { auditService, Audit } from "@/services/audit.service";
import { financeService, Invoice } from "@/services/finance.service";
import { documentService, Document } from "@/services/document.service";
import { taskService, Task } from "@/services/task.service";
import {
  Shield,
  Edit,
  Plus,
  Mail,
  Phone,
  MapPin,
  Globe,
  PhoneCall,
  Video,
  FileText,
  ExternalLink,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  FolderOpen,
  File
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch client data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch client details first
        const clientData = await clientService.getClient(clientId);
        setClient(clientData);

        // Fetch related data in parallel
        const [auditsData, invoicesData, documentsData, tasksData] = await Promise.all([
          auditService.getAudits({ client: Number(clientId), ordering: '-planned_end_date' }),
          financeService.getInvoices({ client: clientId, status: 'SENT', ordering: 'due_date' }), // Fetch open/sent invoices
          documentService.getRecentDocuments(5), // TODO: Filter by client when backend supports it
          taskService.getTasks({ client: Number(clientId), ordering: '-created_at' })
        ]);

        setAudits(auditsData?.results || []);
        setInvoices(invoicesData?.results || []);
        // Filter documents for this client if the API doesn't support filtering yet
        const clientDocs = Array.isArray(documentsData) ? documentsData.filter(d => d.client === Number(clientId)) : [];
        setDocuments(clientDocs);
        setTasks(tasksData?.results || []);

      } catch (err) {
        console.error('Error fetching client data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch client data');
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !client) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error ? 'Error Loading Client' : 'Client Not Found'}
          </h2>
          <button
            onClick={() => router.push('/clients')}
            className="text-primary hover:underline"
          >
            Back to Clients
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Client 360 Profile
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/clients/${client.id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Communication */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Profile Card */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-3xl font-bold text-primary">
                  {client.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{client.industry || 'Industry N/A'}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {client.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      client.status === 'inactive' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              <hr className="my-6 border-gray-200 dark:border-gray-700" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{client.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{client.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-900 dark:text-white">{client.address}</span>
                </div>
                {client.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                      {client.website}
                    </a>
                  </div>
                )}
                {client.currency && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{client.currency} (Primary Currency)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Communication Log */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="p-6 pb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Communication Log</h3>
              </div>
              <div className="space-y-4 p-6 pt-0">
                {tasks.length > 0 ? tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${task.task_type === 'AUDIT' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                      task.task_type === 'FOLLOW_UP' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                      {task.task_type === 'AUDIT' ? <Shield className="h-5 w-5" /> :
                        task.task_type === 'FOLLOW_UP' ? <PhoneCall className="h-5 w-5" /> :
                          <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent communication.</p>
                )}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 text-center">
                <button className="text-sm font-semibold text-primary hover:underline">View All</button>
              </div>
            </div>
          </div>

          {/* Right Column - Projects, Financials, Documents */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            {/* Recent Projects & Audits */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="p-6 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Projects & Audits</h3>
                <button className="text-sm text-primary hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="p-4 font-semibold text-gray-500 dark:text-gray-400">Project Name</th>
                      <th className="p-4 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                      <th className="p-4 font-semibold text-gray-500 dark:text-gray-400">Planned End Date</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {audits.length > 0 ? audits.slice(0, 5).map((audit) => (
                      <tr key={audit.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-4 font-medium text-gray-900 dark:text-white">{audit.audit_type} - {audit.iso_standard_name}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${audit.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            audit.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                            {audit.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">{new Date(audit.planned_end_date).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <button className="text-primary hover:underline">View</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">No active projects found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Financials Preview */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
                <div className="p-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Open Invoices</h3>
                  <Link href={`/clients/${client.id}/financials`} className="text-primary hover:underline text-sm flex items-center gap-1">
                    View All <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 px-6 pb-6 flex-1">
                  {invoices.length > 0 ? invoices.slice(0, 3).map((invoice) => (
                    <li key={invoice.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</p>
                        <p className="text-xs text-gray-500">Due: {invoice.due_date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(Number(invoice.total_amount))}
                        </p>
                        {new Date(invoice.due_date) < new Date() && (
                          <p className="text-xs text-red-500">Overdue</p>
                        )}
                      </div>
                    </li>
                  )) : (
                    <li className="py-3 text-center text-sm text-gray-500">No open invoices.</li>
                  )}
                </ul>
              </div>

              {/* Documents Preview */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
                <div className="p-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Documents</h3>
                  <Link href={`/clients/${client.id}/documents`} className="text-primary hover:underline text-sm flex items-center gap-1">
                    View All <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 px-6 pb-6 flex-1">
                  {documents.length > 0 ? documents.slice(0, 3).map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        {doc.file_name.endsWith('.pdf') ? <FileText className="h-5 w-5 text-red-500" /> :
                          doc.file_name.endsWith('.zip') ? <FolderOpen className="h-5 w-5 text-blue-500" /> :
                            <File className="h-5 w-5 text-gray-400" />}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-[180px]">{doc.title || doc.file_name}</p>
                          <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</p>
                        </div>
                      </div>
                    </li>
                  )) : (
                    <li className="py-3 text-center text-sm text-gray-500">No recent documents.</li>
                  )}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

