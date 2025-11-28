"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { auditService, SurveillanceCertification, SurveillanceStats } from "@/services/audit.service";

export default function AuditTrackerPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "scheduled" | "overdue" | "completed">("all");
  const [filterStandard, setFilterStandard] = useState<string>("all");
  const [filterComprehensive, setFilterComprehensive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [certifications, setCertifications] = useState<SurveillanceCertification[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [stats, setStats] = useState<SurveillanceStats>({
    active: 0,
    scheduled_surveillance: 0,
    overdue_surveillance: 0,
    completed_this_year: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState<boolean>(false);

  useEffect(() => {
    const fetchSurveillanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: currentPage,
          page_size: pageSize,
          ...(searchQuery && { search: searchQuery }),
          ...(filterStatus !== 'all' && { status: filterStatus }),
          ...(filterStandard !== 'all' && { standard: filterStandard }),
        };
        
        console.log("Fetching surveillance data with params:", params);
        
        let response;
        let usedFallback = false;
        
        try {
          // Try backend surveillance API first
          response = await auditService.getSurveillanceAudits(params);
          console.log("Backend surveillance API response:", response);
        } catch (apiError) {
          console.warn("Backend surveillance API failed, using certificate fallback:", apiError);
          // Fallback: get surveillance data from issued certificates
          response = await auditService.getSurveillanceFromCertificates();
          console.log("Fallback certificate data:", response);
          usedFallback = true;
        }

        setUsedFallback(usedFallback);

        if (response.success && response.data) {
          setCertifications(response.data.certifications);
          setStats(response.data.stats);
          setPagination(response.data.pagination || null);
          console.log("Loaded certifications:", response.data.certifications);
          
          if (usedFallback) {
            console.info("Using fallback method - surveillance data generated from issued certificates");
          }
        } else {
          console.error("Both surveillance methods failed:", response);
          setError("Failed to load surveillance data. Please contact support or issue certificates first.");
        }
      } catch (err) {
        console.error("Error fetching surveillance data:", err);
        setError(err instanceof Error ? err.message : "Failed to load surveillance data");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveillanceData();
  }, [currentPage, pageSize, searchQuery, filterStatus, filterStandard]);

  const handleSyncCertificates = async () => {
    try {
      setLoading(true);
      console.log("Manually refreshing surveillance data...");
      
      let response;
      try {
        // Try backend API first
        response = await auditService.getSurveillanceAudits({
          page: currentPage,
          page_size: pageSize,
          ...(searchQuery && { search: searchQuery }),
          ...(filterStatus !== 'all' && { status: filterStatus }),
          ...(filterStandard !== 'all' && { standard: filterStandard }),
        });
        console.log("Manual refresh - backend API response:", response);
      } catch (apiError) {
        console.warn("Manual refresh - backend API failed, using fallback:", apiError);
        // Fallback to certificate sync
        response = await auditService.getSurveillanceFromCertificates();
        console.log("Manual refresh - fallback response:", response);
      }
      
      if (response.success && response.data) {
        setCertifications(response.data.certifications);
        setStats(response.data.stats);
        setPagination(response.data.pagination || null);
        console.log("Manual refresh completed:", response.data.certifications);
        alert(`Successfully refreshed surveillance tracking! Found ${response.data.certifications.length} certifications.`);
      } else {
        alert("No surveillance data found. Issue certificates first to see surveillance tracking.");
      }
    } catch (error) {
      console.error("Manual refresh failed:", error);
      alert("Failed to refresh surveillance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get ISO standards for display
  const getISOStandards = (cert: SurveillanceCertification) => {
    // Support both new multiple standards and backward compatibility
    if (cert.iso_standards && cert.iso_standards.length > 0) {
      return cert.iso_standards;
    } else if (cert.iso_standard) {
      return [cert.iso_standard];
    }
    return [];
  };

  // Check if certification has all 3 main standards (9001, 14001, 45001)
  const hasAllMainStandards = (cert: SurveillanceCertification) => {
    const standards = getISOStandards(cert);
    const mainStandardCodes = ['ISO 9001', 'ISO 14001', 'ISO 45001'];
    return mainStandardCodes.every(code => 
      standards.some(std => std.code === code)
    );
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      completed: "✓",
      scheduled: "📅",
      overdue: "⚠",
      pending: "⏳",
    };
    return badges[status] || "•";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Audit Tracker
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Track and schedule surveillance audits for active certifications
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSyncCertificates}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Fallback Information */}
        {usedFallback && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 dark:text-blue-400 text-xl">ℹ️</span>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Using Certificate Sync Mode
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  The backend surveillance API is not available. Showing surveillance tracking data generated from issued certificates. 
                  All issued certificates will appear here automatically with calculated surveillance schedules.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <KPICard
            title="Active Certifications"
            value={stats.active}
            status="normal"
            iconColor="primary"
          />
          <KPICard
            title="Comprehensive (All 3)"
            value={certifications.filter(cert => hasAllMainStandards(cert)).length}
            status="normal"
            iconColor="success"
          />
          <KPICard
            title="Scheduled Surveillance"
            value={stats.scheduled_surveillance}
            status="normal"
            iconColor="accent"
          />
          <KPICard
            title="Overdue Surveillance"
            value={stats.overdue_surveillance}
            status={stats.overdue_surveillance > 0 ? "critical" : "normal"}
            iconColor="error"
          />
          <KPICard
            title="Completed This Year"
            value={stats.completed_this_year}
            status="normal"
            iconColor="info"
          />
        </div>

        {/* Filters */}
        <WidgetCard title="Filters">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any);
                setCurrentPage(1); // Reset to first page when filtering
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Status: All</option>
              <option value="scheduled">Scheduled</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
            <select 
              value={filterStandard}
              onChange={(e) => {
                setFilterStandard(e.target.value);
                setCurrentPage(1); // Reset to first page when filtering
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Standard: All</option>
              <option value="ISO 9001">ISO 9001</option>
              <option value="ISO 14001">ISO 14001</option>
              <option value="ISO 45001">ISO 45001</option>
              <option value="ISO 27001">ISO 27001</option>
              <option value="ISO 22301">ISO 22301</option>
            </select>
            <select
              value={filterComprehensive ? "comprehensive" : "all"}
              onChange={(e) => {
                setFilterComprehensive(e.target.value === "comprehensive");
                setCurrentPage(1); // Reset to first page when filtering
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Type: All</option>
              <option value="comprehensive">Comprehensive Only</option>
            </select>
            <input
              type="text"
              placeholder="Search client..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </WidgetCard>

        {/* Certifications List */}
        <WidgetCard title="Active Certifications & Surveillance Schedule">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Loading surveillance data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No active certifications found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {certifications
                .filter(cert => !filterComprehensive || hasAllMainStandards(cert))
                .map((cert) => (
                <div
                  key={cert.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-dark dark:text-white">
                          {cert.client.name}
                        </p>
                        {hasAllMainStandards(cert) && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-bold">
                            🏆 Comprehensive
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex flex-wrap gap-2 mb-1">
                          {getISOStandards(cert).map((standard) => (
                            <span 
                              key={standard.id}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ['ISO 9001', 'ISO 14001', 'ISO 45001'].includes(standard.code)
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                  : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {standard.code}
                            </span>
                          ))}
                        </div>
                        <p>Cert: {cert.certificate_number}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Issued: {new Date(cert.issue_date).toLocaleDateString()} | Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-hover">
                      Schedule Audit
                    </button>
                  </div>

                  {/* Surveillance Schedule */}
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Year 1 Surveillance
                      </p>
                      <p className="text-sm font-medium mb-2">
                        {new Date(cert.year1_surveillance.date).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          cert.year1_surveillance.status
                        )}`}
                      >
                        {getStatusBadge(cert.year1_surveillance.status)}{" "}
                        {cert.year1_surveillance.status}
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Year 2 Surveillance
                      </p>
                      <p className="text-sm font-medium mb-2">
                        {new Date(cert.year2_surveillance.date).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          cert.year2_surveillance.status
                        )}`}
                      >
                        {getStatusBadge(cert.year2_surveillance.status)}{" "}
                        {cert.year2_surveillance.status}
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Re-certification
                      </p>
                      <p className="text-sm font-medium mb-2">
                        {new Date(cert.recertification.date).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          cert.recertification.status
                        )}`}
                      >
                        {getStatusBadge(cert.recertification.status)}{" "}
                        {cert.recertification.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.page_size) + 1} to {Math.min(pagination.page * pagination.page_size, pagination.total_items)} of {pagination.total_items} certifications
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.has_previous}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded text-sm ${
                          page === currentPage
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  {pagination.total_pages > 5 && (
                    <>
                      {pagination.total_pages > 6 && <span className="px-2 text-gray-400">...</span>}
                      <button
                        onClick={() => setCurrentPage(pagination.total_pages)}
                        className={`px-3 py-1 rounded text-sm ${
                          pagination.total_pages === currentPage
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {pagination.total_pages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </WidgetCard>

        {/* Upcoming Surveillance Schedule */}
        <WidgetCard title="Upcoming Surveillance Audits (Next 90 Days)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left font-medium">Client</th>
                  <th className="px-4 py-3 text-left font-medium">Standard</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Scheduled Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-red-600 dark:text-red-400">
                      Error loading data
                    </td>
                  </tr>
                ) : (
                  certifications
                    .filter(cert => !filterComprehensive || hasAllMainStandards(cert))
                    .flatMap((cert) => [
                      {
                        cert,
                        schedule: cert.year1_surveillance,
                        type: "Year 1 Surveillance",
                      },
                      {
                        cert,
                        schedule: cert.year2_surveillance,
                        type: "Year 2 Surveillance",
                      },
                      {
                        cert,
                        schedule: cert.recertification,
                        type: "Re-certification",
                      },
                    ])
                    .filter((item) => item.schedule.status !== "pending")
                    .sort(
                      (a, b) =>
                        new Date(a.schedule.date).getTime() -
                        new Date(b.schedule.date).getTime()
                    )
                    .map((item, index) => (
                      <tr
                        key={`${item.cert.id}-${index}`}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-4 py-3">{item.cert.client.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {getISOStandards(item.cert).map((standard, stdIndex) => (
                              <span 
                                key={`${standard.id}-${stdIndex}`}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs"
                              >
                                {standard.code}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {new Date(item.schedule.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-xs">{item.type}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              item.schedule.status
                            )}`}
                          >
                            {getStatusBadge(item.schedule.status)}{" "}
                            {item.schedule.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-primary hover:text-primary-hover text-sm font-medium">
                            {item.schedule.status === "overdue"
                              ? "Schedule Now"
                              : "View"}
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </WidgetCard>
      </div>
    </DashboardLayout>
  );
}

