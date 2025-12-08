"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { clientService } from "@/services/client.service";
import { documentService, Document } from "@/services/document.service";
import { Client } from "@/types/audit";
import { formatDistanceToNow } from 'date-fns';
import {
    Folder,
    FolderOpen,
    Settings,
    LogOut,
    Search,
    Upload,
    FolderPlus,
    Share2,
    Lock,
    FileText,
    MoreHorizontal,
    ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function ClientDocumentsPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;
    const [client, setClient] = useState<Client | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch client details
                const clientData = await clientService.getClient(clientId);
                setClient(clientData);

                // Fetch documents
                const docsData = await documentService.getDocuments({ client: clientId, ordering: '-updated_at' });
                setDocuments(docsData?.results || []);

                // Filter for recent documents (e.g., last 7 days or just top 4 most recent)
                setRecentDocuments((docsData?.results || []).slice(0, 4));

            } catch (err) {
                console.error('Error fetching data:', err);
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

    if (!client) return null;

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-100px)] -m-6 bg-gray-50 dark:bg-gray-900">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex gap-3 items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {client.name.charAt(0)}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <h1 className="text-gray-900 dark:text-white text-sm font-bold truncate">{client.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Client Portal</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                        <Link href={`/clients/${clientId}`} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-sm font-medium">Back to Profile</span>
                        </Link>

                        <div className="mt-4">
                            <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Folders</div>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                                <FolderOpen className="h-4 w-4 fill-current" />
                                <span className="text-sm font-semibold">All Documents</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                <Folder className="h-4 w-4" />
                                <span className="text-sm font-medium">2024 Audit</span>
                            </a>
                            <div className="pl-9 space-y-1">
                                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    <span className="text-sm font-medium">Financials</span>
                                </a>
                                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    <span className="text-sm font-medium">Contracts</span>
                                </a>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {/* Header */}
                    <header className="mb-6">
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Link href="/clients" className="text-gray-500 hover:text-primary text-sm">Clients</Link>
                            <span className="text-gray-400 text-sm">/</span>
                            <Link href={`/clients/${clientId}`} className="text-gray-500 hover:text-primary text-sm">{client.name}</Link>
                            <span className="text-gray-400 text-sm">/</span>
                            <span className="text-gray-900 dark:text-white text-sm font-medium">Documents</span>
                        </div>

                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h2>
                            <div className="w-full md:w-auto md:max-w-xs flex-grow relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Search documents..."
                                />
                            </div>
                        </div>
                    </header>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90">
                                <Upload className="h-4 w-4" />
                                Upload
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600">
                                <FolderPlus className="h-4 w-4" />
                                New Folder
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Share2 className="h-4 w-4" />
                                Share
                            </button>
                        </div>
                    </div>

                    {/* Recent Documents */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Documents</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recentDocuments.length > 0 ? recentDocuments.map((doc) => (
                                <div key={doc.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        {doc.file_name.endsWith('.pdf') ? <FileText className="h-6 w-6 text-red-500" /> :
                                            doc.file_name.endsWith('.zip') ? <FolderOpen className="h-6 w-6 text-blue-500" /> :
                                                <FileText className="h-6 w-6 text-primary" />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate text-sm" title={doc.title || doc.file_name}>{doc.title || doc.file_name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Modified {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-4 text-center text-gray-500 py-4">No recent documents found.</div>
                            )}
                        </div>
                    </div>

                    {/* Document Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                                    <th className="py-3 px-6 font-semibold">Name</th>
                                    <th className="py-3 px-6 font-semibold">Date Modified</th>
                                    <th className="py-3 px-6 font-semibold">Size</th>
                                    <th className="py-3 px-6 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {documents.length > 0 ? documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {doc.document_type === 'FOLDER' ? (
                                                    <Folder className="h-5 w-5 text-yellow-500 fill-current" />
                                                ) : (
                                                    <FileText className="h-5 w-5 text-blue-400" />
                                                )}
                                                <span className="font-medium text-gray-900 dark:text-white">{doc.title || doc.file_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500">{new Date(doc.updated_at).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 text-gray-500">{doc.file_size ? `${(doc.file_size / 1024).toFixed(2)} KB` : '--'}</td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">No documents found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
