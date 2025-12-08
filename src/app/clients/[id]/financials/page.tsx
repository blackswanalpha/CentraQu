"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { clientService } from "@/services/client.service";
import { financeService, Invoice } from "@/services/finance.service";
import { Client } from "@/types/audit";
import {
    Download,
    TrendingUp,
    TrendingDown,
    Search,
    Plus,
    MoreVertical,
    CreditCard,
    Receipt,
    Bell,
    ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function ClientFinancialsPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;
    const [client, setClient] = useState<Client | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch client details
                const clientData = await clientService.getClient(clientId);
                setClient(clientData);

                // Fetch invoices
                const invoicesData = await financeService.getInvoices({ client: clientId, ordering: '-issue_date' });
                setInvoices(invoicesData?.results || []);

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

    // Calculate stats from invoices
    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);
    const outstandingInvoices = invoices.filter(inv => inv.status !== 'PAID' && inv.status !== 'CANCELLED');
    const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);
    const overdueInvoices = invoices.filter(inv => inv.status === 'OVERDUE' || (inv.status !== 'PAID' && new Date(inv.due_date) < new Date()));
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);

    // Find next payment due (earliest due date of unpaid invoices)
    const nextDueInvoice = outstandingInvoices.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

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
            <div className="space-y-8">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 text-sm">
                    <Link href="/clients" className="text-gray-500 hover:text-primary">Clients</Link>
                    <span className="text-gray-400">/</span>
                    <Link href={`/clients/${clientId}`} className="text-gray-500 hover:text-primary">{client.name}</Link>
                    <span className="text-gray-400">/</span>
                    <span className="font-medium text-gray-900 dark:text-white">Financials</span>
                </div>

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Client Financials: {client.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Client ID: {String(client.id).substring(0, 8).toUpperCase()}</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: client.currency || 'USD' }).format(totalRevenue)}
                        </p>
                        <p className="text-green-500 text-sm font-medium flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3" /> +5.2%
                        </p>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Total Outstanding</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: client.currency || 'USD' }).format(totalOutstanding)}
                        </p>
                        <p className="text-green-500 text-sm font-medium flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3" /> +1.8%
                        </p>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Overdue Amount</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: client.currency || 'USD' }).format(totalOverdue)}
                        </p>
                        <p className="text-red-500 text-sm font-medium flex items-center gap-1 mt-1">
                            <TrendingDown className="h-3 w-3" /> -2.5%
                        </p>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Next Payment Due</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {nextDueInvoice ? new Date(nextDueInvoice.due_date).toLocaleDateString() : 'N/A'}
                        </p>
                        {nextDueInvoice && (
                            <p className="text-yellow-500 text-sm font-medium mt-1">
                                {new Date(nextDueInvoice.due_date) < new Date() ? 'Overdue' : `in ${Math.ceil((new Date(nextDueInvoice.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Left 2 Columns) */}
                    <div className="flex flex-col gap-8 lg:col-span-2">

                        {/* AR Aging Chart */}
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <h2 className="text-lg font-bold p-6 border-b border-gray-200 dark:border-gray-700">Accounts Receivable Aging</h2>
                            <div className="p-6">
                                <div className="grid gap-y-6 gap-x-4 grid-cols-[auto_1fr] items-center">
                                    <span className="text-xs font-bold uppercase text-gray-500 w-24">Current</span>
                                    <div className="h-6 rounded bg-primary/20 w-full"><div className="bg-primary h-6 rounded" style={{ width: '45%' }}></div></div>

                                    <span className="text-xs font-bold uppercase text-gray-500 w-24">1-30 Days</span>
                                    <div className="h-6 rounded bg-primary/20 w-full"><div className="bg-primary h-6 rounded" style={{ width: '25%' }}></div></div>

                                    <span className="text-xs font-bold uppercase text-gray-500 w-24">31-60 Days</span>
                                    <div className="h-6 rounded bg-primary/20 w-full"><div className="bg-primary h-6 rounded" style={{ width: '15%' }}></div></div>

                                    <span className="text-xs font-bold uppercase text-gray-500 w-24">61-90 Days</span>
                                    <div className="h-6 rounded bg-yellow-500/20 w-full"><div className="bg-yellow-500 h-6 rounded" style={{ width: '10%' }}></div></div>

                                    <span className="text-xs font-bold uppercase text-gray-500 w-24">90+ Days</span>
                                    <div className="h-6 rounded bg-red-500/20 w-full"><div className="bg-red-500 h-6 rounded" style={{ width: '5%' }}></div></div>
                                </div>
                            </div>
                        </div>

                        {/* Data Tables */}
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="border-b border-gray-200 dark:border-gray-700 p-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab('invoices')}
                                        className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'invoices' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        Invoices
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('payments')}
                                        className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'payments' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        Payments
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-primary focus:border-primary"
                                        placeholder="Search invoices..."
                                    />
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-gray-200 dark:border-gray-700">
                                            <tr className="text-xs uppercase text-gray-500">
                                                <th className="px-4 py-3 font-medium">Invoice #</th>
                                                <th className="px-4 py-3 font-medium">Issue Date</th>
                                                <th className="px-4 py-3 font-medium">Due Date</th>
                                                <th className="px-4 py-3 font-medium text-right">Amount</th>
                                                <th className="px-4 py-3 font-medium text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {invoices.length > 0 ? invoices.map((inv) => (
                                                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                                                    <td className="px-4 py-4 font-semibold text-primary">{inv.invoice_number}</td>
                                                    <td className="px-4 py-4 text-gray-500">{new Date(inv.issue_date).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4 text-gray-500">{new Date(inv.due_date).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4 font-semibold text-right">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: inv.currency }).format(Number(inv.total_amount))}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                                                            ${inv.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                                                                inv.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                            {inv.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-gray-500">No invoices found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right Column) */}
                    <div className="flex flex-col gap-8">
                        {/* Payment Methods */}
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold">Payment Methods</h3>
                                <button className="p-1.5 text-primary rounded-full hover:bg-primary/10">
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                    <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">Visa ending in 4242</p>
                                        <p className="text-xs text-gray-500">Expires 12/25</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <h3 className="text-lg font-bold p-6 border-b border-gray-200 dark:border-gray-700">Recent Activity</h3>
                            <div className="p-6">
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Receipt className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Invoice #INV-0012 paid</p>
                                            <p className="text-xs text-gray-500">Sep 19, 2023</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Plus className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">New invoice #INV-0015 created</p>
                                            <p className="text-xs text-gray-500">Oct 1, 2023</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <Bell className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Payment reminder sent</p>
                                            <p className="text-xs text-gray-500">Oct 5, 2023</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
