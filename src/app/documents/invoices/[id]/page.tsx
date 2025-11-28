"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use } from "react";
import { useRouter } from "next/navigation";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<"details" | "payments" | "audit">("details");

  // Mock invoice data - in real app, fetch by ID
  const invoiceData = {
    id: "INV-2025-001",
    number: "INV-2025-001",
    client: {
      name: "ABC Corporation",
      contact: "John Smith",
      email: "john.smith@abccorp.com",
      phone: "+254 700 123 456",
      address: "123 Industrial Avenue, Nairobi Industrial Area, Kenya"
    },
    auditId: "A-2025-142",
    auditType: "Initial Certification",
    amount: 160000,
    issueDate: "2025-10-21",
    dueDate: "2025-11-21",
    status: "pending",
    certifications: [
      { standard: "ISO 9001:2015", cost: 85000 },
      { standard: "ISO 14001:2015", cost: 75000 }
    ],
    paymentTerms: "Net 30",
    description: "Initial certification audit for multiple standards",
    lineItems: [
      { description: "ISO 9001:2015 Initial Certification Audit", quantity: 1, rate: 85000, amount: 85000 },
      { description: "ISO 14001:2015 Initial Certification Audit", quantity: 1, rate: 75000, amount: 75000 },
      { description: "Document Review and Analysis", quantity: 8, rate: 0, amount: 0 }
    ],
    subtotal: 160000,
    tax: 0,
    total: 160000,
    notes: "Payment due within 30 days of invoice date. Late payments may incur additional charges.",
    bankDetails: {
      bankName: "KCB Bank Kenya",
      accountNumber: "1234567890",
      accountName: "AssureHub Certification Services Ltd",
      swiftCode: "KCBLKENX"
    },
    paymentHistory: [],
    createdBy: "Sarah Mitchell",
    createdDate: "2025-10-21T10:30:00",
    sentDate: "2025-10-21T14:15:00"
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => router.back()}
              className="text-primary hover:text-primary-hover mb-2"
            >
              ← Back to Invoices
            </button>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Invoice {invoiceData.number}
            </h1>
            <p className="mt-1 text-body-base text-gray-600 dark:text-gray-400">
              {invoiceData.client.name} • {formatDate(invoiceData.issueDate)}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoiceData.status)}`}>
              {invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}
            </span>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Edit
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
              Download PDF
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
              Send Invoice
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(invoiceData.total)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
              <p className="text-lg font-semibold text-dark dark:text-white">{formatDate(invoiceData.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Payment Terms</p>
              <p className="text-lg font-semibold text-dark dark:text-white">{invoiceData.paymentTerms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Audit ID</p>
              <p className="text-lg font-semibold text-dark dark:text-white">{invoiceData.auditId}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8">
            {[
              { id: "details", label: "Invoice Details" },
              { id: "payments", label: "Payment History" },
              { id: "audit", label: "Related Audit" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="space-y-8">
            {/* Invoice Preview */}
            <WidgetCard title="Invoice Preview">
              <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-[800px]">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-primary font-bold text-2xl mb-2">
                      AssureHub Certification Services
                    </div>
                    <div className="text-gray-600 text-sm">
                      <p>Accredited Certification Body</p>
                      <p>Registration No: CB-001-2024</p>
                      <p>P.O. Box 12345-00100, Nairobi, Kenya</p>
                      <p>Email: invoices@assurehub.co.ke</p>
                      <p>Phone: +254 700 000 000</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
                    <div className="text-sm text-gray-600">
                      <p><strong>Invoice #:</strong> {invoiceData.number}</p>
                      <p><strong>Date:</strong> {formatDate(invoiceData.issueDate)}</p>
                      <p><strong>Due Date:</strong> {formatDate(invoiceData.dueDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-2">Bill To:</h3>
                  <div className="text-gray-700">
                    <p className="font-semibold">{invoiceData.client.name}</p>
                    <p>{invoiceData.client.contact}</p>
                    <p>{invoiceData.client.address}</p>
                    <p>Email: {invoiceData.client.email}</p>
                    <p>Phone: {invoiceData.client.phone}</p>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="mb-8">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 text-sm bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="font-semibold">Audit Type:</span>
                      <span className="ml-2">{invoiceData.auditType}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Audit ID:</span>
                      <span className="ml-2">{invoiceData.auditId}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Payment Terms:</span>
                      <span className="ml-2">{invoiceData.paymentTerms}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Standards:</span>
                      <span className="ml-2">{invoiceData.certifications.map(c => c.standard).join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="mb-8">
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left border-b">Description</th>
                        <th className="px-4 py-3 text-center border-b">Qty</th>
                        <th className="px-4 py-3 text-right border-b">Rate</th>
                        <th className="px-4 py-3 text-right border-b">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.lineItems.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3">{item.description}</td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{item.rate > 0 ? formatCurrency(item.rate) : "Included"}</td>
                          <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{formatCurrency(invoiceData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Tax (0%):</span>
                      <span className="font-semibold">{formatCurrency(invoiceData.tax)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(invoiceData.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Payment Information:</h3>
                    <div className="text-sm text-gray-700">
                      <p><strong>Bank:</strong> {invoiceData.bankDetails.bankName}</p>
                      <p><strong>Account Name:</strong> {invoiceData.bankDetails.accountName}</p>
                      <p><strong>Account Number:</strong> {invoiceData.bankDetails.accountNumber}</p>
                      <p><strong>SWIFT Code:</strong> {invoiceData.bankDetails.swiftCode}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Notes:</h3>
                    <p className="text-sm text-gray-700">{invoiceData.notes}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
                  <p>Thank you for choosing AssureHub Certification Services.</p>
                  <p>This invoice was generated on {formatDate(invoiceData.createdDate)} by {invoiceData.createdBy}</p>
                </div>
              </div>
            </WidgetCard>

            {/* Invoice Actions */}
            <WidgetCard title="Invoice Actions">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  <div className="text-2xl mb-2">📧</div>
                  <p className="font-medium text-dark dark:text-white">Send Email</p>
                  <p className="text-xs text-gray-500">Email invoice to client</p>
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="font-medium text-dark dark:text-white">Record Payment</p>
                  <p className="text-xs text-gray-500">Mark as paid</p>
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  <div className="text-2xl mb-2">📄</div>
                  <p className="font-medium text-dark dark:text-white">Duplicate</p>
                  <p className="text-xs text-gray-500">Create similar invoice</p>
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 text-left">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="font-medium text-dark dark:text-white">Generate Report</p>
                  <p className="text-xs text-gray-500">Invoice analytics</p>
                </button>
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Invoice Amount</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(invoiceData.total)}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">Amount Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(0)}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-300">Balance Due</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(invoiceData.total)}</p>
              </div>
            </div>

            {/* Payment History */}
            <WidgetCard title="Payment History">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-lg font-medium text-dark dark:text-white mb-2">No Payments Recorded</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No payments have been recorded for this invoice yet.
                </p>
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                  Record Payment
                </button>
              </div>
            </WidgetCard>

            {/* Record Payment Form */}
            <WidgetCard title="Record New Payment">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Select method</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reference Number</label>
                  <input
                    type="text"
                    placeholder="Payment reference"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <textarea
                    placeholder="Payment notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                    Record Payment
                  </button>
                </div>
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-6">
            {/* Audit Information */}
            <WidgetCard title="Related Audit Information">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Audit ID</span>
                    <span className="font-medium">{invoiceData.auditId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Audit Type</span>
                    <span className="font-medium">{invoiceData.auditType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Standards</span>
                    <span className="font-medium">{invoiceData.certifications.map(c => c.standard).join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">Completed</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Lead Auditor</span>
                    <span className="font-medium">Sarah Mitchell</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Audit Dates</span>
                    <span className="font-medium">Oct 21-23, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium">3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium">Client Site</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                  View Full Audit Details
                </button>
              </div>
            </WidgetCard>

            {/* Audit Findings Summary */}
            <WidgetCard title="Audit Findings Summary">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-green-800 dark:text-green-300">Major Non-Conformances</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">Minor Non-Conformances</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">Observations</p>
                </div>
              </div>
            </WidgetCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}