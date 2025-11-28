"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { auditService, type ISOStandard } from "@/services/audit.service";
import { certificateService, type CertificateTemplate } from "@/services/certificate.service";
import Link from "next/link";
import { 
  Edit, 
  Trash2, 
  Plus, 
  FileText, 
  Eye, 
  Download,
  Award,
  Shield,
  Leaf,
  Users,
  Lock,
  Utensils,
  Zap,
  Heart,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Icon mapping for ISO standards
const STANDARD_ICONS = {
  "ISO 9001": Award,
  "ISO 14001": Leaf,
  "ISO 45001": Shield,
  "ISO 27001": Lock,
  "ISO 22000": Utensils,
  "ISO 50001": Zap,
  "ISO 13485": Heart,
  "ISO 22301": RefreshCw,
} as const;

const getStandardIcon = (code: string) => {
  const key = Object.keys(STANDARD_ICONS).find(k => code.includes(k));
  return key ? STANDARD_ICONS[key as keyof typeof STANDARD_ICONS] : Settings;
};

export default function StandardsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [standards, setStandards] = useState<ISOStandard[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'grid' | 'table'>('grid');
  const [expandedStandards, setExpandedStandards] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load standards and templates in parallel
      const [standardsResponse, templatesResponse] = await Promise.all([
        auditService.getISOStandards(),
        certificateService.getTemplates().catch(() => ({ results: [] }))
      ]);
      
      setStandards(standardsResponse.results || []);
      setTemplates(templatesResponse.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
      setTemplatesLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this standard? This will also affect related templates.")) return;

    try {
      await auditService.deleteISOStandard(id);
      setStandards(standards.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete standard");
      console.error(err);
    }
  };

  const toggleExpanded = (standardId: number) => {
    const newExpanded = new Set(expandedStandards);
    if (newExpanded.has(standardId)) {
      newExpanded.delete(standardId);
    } else {
      newExpanded.add(standardId);
    }
    setExpandedStandards(newExpanded);
  };

  const getTemplatesForStandard = (standardId: number) => {
    return templates.filter(t => t.iso_standard?.id === standardId);
  };

  const getStandardsWithoutTemplates = () => {
    return standards.filter(s => !templates.some(t => t.iso_standard?.id === s.id));
  };

  const filteredStandards = standards.filter((standard) =>
    standard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StandardCard = ({ standard }: { standard: ISOStandard }) => {
    const standardTemplates = getTemplatesForStandard(standard.id);
    const IconComponent = getStandardIcon(standard.code);
    const isExpanded = expandedStandards.has(standard.id);

    return (
      <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="p-6 border-b border-stroke dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-1">
                  {standard.code}
                </h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {standard.name}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-green-600">
                    <FileText className="w-3 h-3" />
                    {standardTemplates.length} template{standardTemplates.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-gray-500">
                    Active since {new Date(standard.created_at).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/certifications/standards/${standard.id}`}>
                <Button variant="secondary" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(standard.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6">
          <button
            onClick={() => toggleExpanded(standard.id)}
            className="w-full text-left mb-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-dark dark:text-white">Description</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </button>
          
          <div className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
            {standard.description}
          </div>
        </div>

        {/* Templates Section */}
        {standardTemplates.length > 0 && (
          <div className="px-6 pb-6">
            <h4 className="text-sm font-medium text-dark dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Certificate Templates
            </h4>
            <div className="space-y-2">
              {standardTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {template.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="uppercase">{template.template_type}</span>
                        {template.is_default && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="secondary" size="sm" title="Preview Template">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="secondary" size="sm" title="Download Template">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Templates Warning */}
        {standardTemplates.length === 0 && (
          <div className="px-6 pb-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    No Certificate Template
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                    Create a template to generate certificates for this standard.
                  </p>
                </div>
              </div>
              <Link href={`/certifications/templates/new?standard=${standard.id}`} className="mt-3 inline-block">
                <Button variant="primary" size="sm">
                  <Plus className="w-3 h-3 mr-2" />
                  Create Template
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  const TableView = () => (
    <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-stroke dark:border-gray-700">
            <th className="p-4 font-semibold text-dark dark:text-white">Standard</th>
            <th className="p-4 font-semibold text-dark dark:text-white">Name</th>
            <th className="p-4 font-semibold text-dark dark:text-white">Templates</th>
            <th className="p-4 font-semibold text-dark dark:text-white">Status</th>
            <th className="p-4 font-semibold text-dark dark:text-white text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStandards.map((standard) => {
            const standardTemplates = getTemplatesForStandard(standard.id);
            const IconComponent = getStandardIcon(standard.code);
            
            return (
              <tr key={standard.id} className="border-b border-stroke dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-dark dark:text-white">{standard.code}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{standard.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-dark dark:text-white">{standardTemplates.length}</span>
                    {standardTemplates.length > 0 ? (
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                        Available
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                        Missing
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    Active
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/certifications/standards/${standard.id}`}>
                      <Button variant="secondary" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(standard.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              ISO Standards & Templates
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Comprehensive management of ISO standards and their certificate templates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/certifications/templates/new">
              <Button variant="secondary">
                <FileText className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </Link>
            <Link href="/certifications/standards/new">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                New Standard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Standards</p>
                <p className="text-2xl font-bold text-dark dark:text-white mt-1">{standards.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Templates</p>
                <p className="text-2xl font-bold text-dark dark:text-white mt-1">{templates.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Standards with Templates</p>
                <p className="text-2xl font-bold text-dark dark:text-white mt-1">
                  {standards.filter(s => getTemplatesForStandard(s.id).length > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Missing Templates</p>
                <p className="text-2xl font-bold text-dark dark:text-white mt-1">
                  {getStandardsWithoutTemplates().length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <FormInput
              type="text"
              placeholder="Search standards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedView === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedView('grid')}
            >
              Grid
            </Button>
            <Button
              variant={selectedView === 'table' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedView('table')}
            >
              Table
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading standards and templates...</p>
          </div>
        ) : filteredStandards.length > 0 ? (
          <>
            {selectedView === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredStandards.map((standard) => (
                  <StandardCard key={standard.id} standard={standard} />
                ))}
              </div>
            ) : (
              <TableView />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No standards found</p>
            <p className="text-sm text-gray-500 mb-6">
              {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first ISO standard"}
            </p>
            <Link href="/certifications/standards/new">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create First Standard
              </Button>
            </Link>
          </div>
        )}

        {/* All Templates Complete Success Message */}
        {getStandardsWithoutTemplates().length === 0 && !searchTerm && standards.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                    All Standards Have Templates! ✨
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Excellent! All {standards.length} ISO standards now have certificate templates available. 
                    You can generate certificates for any standard in the system.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/certifications/templates/new">
                  <Button variant="secondary" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Template
                  </Button>
                </Link>
                <Link href="/dashboard/certifications">
                  <Button variant="primary" size="sm">
                    <Award className="w-4 h-4 mr-2" />
                    Issue Certificates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Missing Templates Warning (if any) */}
        {getStandardsWithoutTemplates().length > 0 && !searchTerm && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  Standards Missing Templates
                </h3>
                <p className="text-sm text-amber-600 dark:text-amber-300 mb-4">
                  The following standards don't have certificate templates. Create templates to enable certificate generation:
                </p>
                <div className="flex flex-wrap gap-2">
                  {getStandardsWithoutTemplates().slice(0, 5).map((standard) => (
                    <span
                      key={standard.id}
                      className="bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm"
                    >
                      {standard.code}
                    </span>
                  ))}
                  {getStandardsWithoutTemplates().length > 5 && (
                    <span className="text-amber-600 dark:text-amber-300 text-sm">
                      +{getStandardsWithoutTemplates().length - 5} more
                    </span>
                  )}
                </div>
              </div>
              <Link href="/certifications/templates/new">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Templates
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}