"use client";

import { useState, useEffect } from 'react';

// Types
interface ISOCertification {
  id: string;
  companyName: string;
  certifications: {
    type: string;
    standard: string;
    status: 'active' | 'expired' | 'pending';
    certificationDate: string;
    expiryDate: string;
    certificateNumber: string;
  }[];
  industry: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  contactInfo: {
    website?: string;
    email?: string;
    phone?: string;
  };
  description: string;
  employees: string;
  yearEstablished: number;
}

// Constants
const ISO_STANDARDS = [
  "ISO 9001 - Quality Management Systems",
  "ISO 14001 - Environmental Management Systems",
  "ISO 45001 - Occupational Health and Safety Management",
  "ISO 27001 - Information Security Management",
  "ISO 13485 - Medical Devices Quality Management",
  "ISO 22000 - Food Safety Management Systems",
  "ISO 50001 - Energy Management Systems",
  "ISO 20000-1 - IT Service Management",
  "ISO 22301 - Business Continuity Management",
  "ISO 39001 - Road Traffic Safety Management",
  "ISO 21001 - Educational Organizations Management",
  "AS9100 - Aerospace Quality Management",
  "ISO 24510 - Water Services Quality Management",
  "ISO 55001 - Asset Management",
  "ISO 21101 - Adventure Tourism Safety Management"
];

const INDUSTRIES = [
  "Information Technology",
  "Manufacturing",
  "Healthcare",
  "Financial Services",
  "Energy & Utilities",
  "Construction",
  "Food & Beverage",
  "Pharmaceutical",
  "Transportation & Logistics",
  "Education",
  "Textile & Apparel",
  "Aerospace",
  "Water Treatment",
  "Retail",
  "Design & Creative Services",
  "Mining",
  "Tourism & Hospitality",
  "Agriculture Technology",
  "Renewable Energy"
];

const COUNTRIES = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda"
];

export default function ISOSearchPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    standard: '',
    industry: '',
    country: '',
    employeeRange: '',
    status: ''
  });
  const [filteredResults, setFilteredResults] = useState<ISOCertification[]>([]);
  const [allCertifications, setAllCertifications] = useState<ISOCertification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchQuery, filters, allCertifications]);

  const fetchCertifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/iso-certifications');

      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        // Don't throw error, just set empty data
        setAllCertifications([]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Received certification data:', data);

      if (data.success) {
        setAllCertifications(data.data || []);

        // Show warning if backend is unavailable but we got empty data
        if (data.meta?.warning) {
          console.warn('Backend warning:', data.meta.warning);
        }
      } else {
        console.error('API returned error:', data.error);
        setAllCertifications([]);
      }
    } catch (err) {
      console.error('Error fetching certifications:', err);
      // Don't set error state, just show empty results
      // This provides better UX when backend is unavailable
      setAllCertifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResults = () => {
    let results = allCertifications;

      if (searchQuery) {
        results = results.filter(company =>
          company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.certifications.some(cert => 
            cert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.standard.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }

      if (filters.standard) {
        results = results.filter(company =>
          company.certifications.some(cert => cert.type === filters.standard)
        );
      }

      if (filters.industry) {
        results = results.filter(company => company.industry === filters.industry);
      }

      if (filters.country) {
        results = results.filter(company => company.location.country === filters.country);
      }

      if (filters.employeeRange) {
        results = results.filter(company => company.employees === filters.employeeRange);
      }

      if (filters.status) {
        results = results.filter(company =>
          company.certifications.some(cert => cert.status === filters.status)
        );
      }

    setFilteredResults(results);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      standard: '',
      industry: '',
      country: '',
      employeeRange: '',
      status: ''
    });
  };

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = filteredResults.slice(startIndex, startIndex + resultsPerPage);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(to bottom, #E6F7FF, #FFFFFF)'
      }}>
        <div className="text-center space-y-8 px-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="w-24 h-24 mx-auto bg-[#008B9B] rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight animate-fade-in">
              <span className="text-[#008B9B]">Search and Verify </span>
              <span className="text-[#2F4F4F]">ISO Certification & More</span>
            </h1>
            <p className="text-base md:text-lg text-[#6c757d] max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
              The official global database for accredited certificates. Check ISO certification online or verify other international, national, and sector standard certificates with instant alerts.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="animate-bounce">
              <div className="w-2 h-2 bg-[#008B9B] rounded-full mx-1 animate-pulse"></div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }

          .animate-fade-in-delay {
            animation: fade-in 1s ease-out 0.5s both;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #E6F7FF, #FFFFFF)' }}>
      {/* Hero Section with Search */}
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Hero Content */}
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span className="text-[#008B9B]">Search and Verify </span>
              <span className="text-[#2F4F4F]">ISO Certification & More</span>
            </h1>
            <p className="text-base sm:text-lg text-[#6c757d] max-w-2xl mx-auto leading-relaxed">
              The official global database for accredited certificates. Check ISO certification online or verify other international, national, and sector standard certificates with instant alerts.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 mb-8">
            <div className="w-full sm:flex-1">
              <input
                type="text"
                placeholder="Enter company by name or certification number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 sm:h-16 px-6 rounded-full sm:rounded-r-none border border-gray-300 bg-white text-[#2F4F4F] placeholder:text-[#6c757d] placeholder:italic focus:border-[#B0C4DE] focus:outline-none focus:ring-2 focus:ring-[#B0C4DE]/50"
                aria-label="Search companies"
              />
            </div>
            <button
              onClick={() => filterResults()}
              className="w-full sm:w-auto min-w-[120px] h-14 sm:h-16 px-6 rounded-full sm:rounded-l-none bg-[#008B9B] hover:bg-[#007a8a] text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-bold text-[#2F4F4F] mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <select
                value={filters.standard}
                onChange={(e) => setFilters(prev => ({ ...prev, standard: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-full bg-white text-[#2F4F4F] focus:border-[#B0C4DE] focus:outline-none focus:ring-2 focus:ring-[#B0C4DE]/50"
              >
                <option value="">All Standards</option>
                {ISO_STANDARDS.map(standard => (
                  <option key={standard} value={standard.split(' - ')[0]}>{standard}</option>
                ))}
              </select>

              <select
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-full bg-white text-[#2F4F4F] focus:border-[#B0C4DE] focus:outline-none focus:ring-2 focus:ring-[#B0C4DE]/50"
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>

              <select
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-full bg-white text-[#2F4F4F] focus:border-[#B0C4DE] focus:outline-none focus:ring-2 focus:ring-[#B0C4DE]/50"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-full bg-white text-[#2F4F4F] focus:border-[#B0C4DE] focus:outline-none focus:ring-2 focus:ring-[#B0C4DE]/50"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={clearFilters}
                className="text-[#008B9B] hover:text-[#007a8a] font-bold transition-colors"
              >
                Clear all filters
              </button>
              <p className="text-sm text-[#6c757d] font-medium">
                {isLoading ? 'Searching...' : `${filteredResults.length} ${filteredResults.length === 1 ? 'company' : 'companies'} found`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008B9B]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCertifications}
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentResults.map((company) => (
                <div key={company.id} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#008B9B]/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#008B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-[#2F4F4F]">{company.companyName}</h3>
                      </div>
                      <span className="text-xs bg-[#008B9B]/10 text-[#008B9B] px-3 py-1 rounded-full font-semibold">
                        {company.industry}
                      </span>
                    </div>

                    <p className="text-sm text-[#6c757d] mb-4 line-clamp-2">{company.description}</p>

                    <div className="mb-4">
                      <p className="text-sm font-bold text-[#2F4F4F] mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Certifications
                      </p>
                      <div className="space-y-2">
                        {company.certifications.slice(0, 2).map((cert, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 rounded-full px-3 py-2">
                            <span className="text-sm text-[#2F4F4F] font-medium">{cert.type}</span>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              cert.status === 'active' ? 'bg-green-100 text-green-700' :
                              cert.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {cert.status}
                            </span>
                          </div>
                        ))}
                        {company.certifications.length > 2 && (
                          <p className="text-xs text-[#6c757d] italic">+{company.certifications.length - 2} more certifications</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#6c757d] mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{company.location.city}{company.location.city && company.location.country ? ', ' : ''}{company.location.country}</span>
                    </div>

                    {company.contactInfo.website && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <a
                          href={company.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#008B9B] hover:text-[#007a8a] text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                          <span>Visit Website</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 border border-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all font-semibold text-[#2F4F4F]"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 border rounded-full font-bold transition-all ${
                          currentPage === page
                            ? 'bg-[#008B9B] text-white border-[#008B9B] shadow-lg'
                            : 'border-gray-300 text-[#2F4F4F] hover:bg-white hover:shadow-md'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 border border-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all font-semibold text-[#2F4F4F]"
                >
                  Next
                </button>
              </div>
            )}

            {/* No Results */}
            {filteredResults.length === 0 && allCertifications.length > 0 && (
              <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-8">
                <div className="w-20 h-20 mx-auto bg-[#008B9B]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[#008B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#2F4F4F] mb-2">No companies found</h3>
                <p className="text-[#6c757d]">Try adjusting your search criteria or filters to find what you're looking for.</p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-3 bg-[#008B9B] hover:bg-[#007a8a] text-white rounded-full font-bold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredResults.length === 0 && allCertifications.length === 0 && (
              <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-8">
                <div className="w-20 h-20 mx-auto bg-[#008B9B]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[#008B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#2F4F4F] mb-2">No certifications available</h3>
                <p className="text-[#6c757d]">No ISO certifications have been added to the directory yet. Check back soon!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}