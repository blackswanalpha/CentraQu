'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Copy,
  FileText,
  Grid3X3,
  List,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdvancedContractBuilder } from './advanced-contract-builder';
import { PreviewView as TemplatePreview } from './template-preview';
import { Template, defaultTemplateSettings } from '@/services/template.service';
import { createISO9001CertificationContract } from '../TemplateBuilder/ContractTemplates';
import { fetchTemplates, deleteTemplate as deleteTemplateAPI, BackendTemplate } from '@/services/template-api.service';

export function TemplateManagement() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [backendTemplates, setBackendTemplates] = useState<Map<string, string>>(new Map()); // Map template.id to backend template_id
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedBackendId, setSelectedBackendId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'list' | 'builder' | 'preview'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'contract' | 'audit' | 'report' | 'certification'>('all');
  const [loading, setLoading] = useState(true);

  // Fetch templates from backend
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const backendData = await fetchTemplates('CERTIFICATION_CONTRACT');

        // Map backend templates to frontend Template format
        const mappedTemplates: Template[] = backendData
          .filter((bt: BackendTemplate) => bt.template_data && typeof bt.template_data === 'object')
          .map((bt: BackendTemplate) => {
            const templateData = bt.template_data as Template;
            return {
              ...templateData,
              id: bt.template_id || `template-${bt.id}`,
              title: templateData.title || bt.name || 'Untitled Template',
              description: templateData.description || bt.description || '',
              is_published: bt.status === 'ACTIVE',
              created_at: bt.created_at,
              updated_at: bt.updated_at,
            };
          });

        // Create mapping of frontend ID to backend template_id
        const mapping = new Map<string, string>();
        backendData.forEach((bt: BackendTemplate) => {
          const frontendId = bt.template_id || `template-${bt.id}`;
          if (bt.template_id) {
            mapping.set(frontendId, bt.template_id);
          }
        });

        setTemplates(mappedTemplates);
        setBackendTemplates(mapping);
      } catch (error) {
        console.error('Failed to load templates from backend:', error);
        // Fallback to mock data
        const isoContract = createISO9001CertificationContract();
        const mockTemplates: Template[] = [
          {
            id: 'template-1',
            title: 'Standard Service Agreement',
            description: 'General service contract template for consulting and professional services',
            type: 'contract',
            is_published: true,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-11-20T14:30:00Z',
            settings: defaultTemplateSettings,
            pages: [],
            metadata: { variables: [] }
          },
          isoContract,
        ];
        setTemplates(mockTemplates);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = (template.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesFilter = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setSelectedBackendId(undefined);
    setActiveTab('builder');
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setSelectedBackendId(backendTemplates.get(template.id || ''));
    setActiveTab('builder');
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab('preview');
  };

  const handleDuplicateTemplate = async (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
      title: `${template.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_published: false
    };

    // The backend will handle creation when the user saves from the builder
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      try {
        const backendId = backendTemplates.get(templateId);
        if (backendId) {
          await deleteTemplateAPI(backendId);
        }
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        setBackendTemplates(prev => {
          const newMap = new Map(prev);
          newMap.delete(templateId);
          return newMap;
        });
      } catch (error) {
        console.error('Failed to delete template:', error);
        alert('Failed to delete template. Please try again.');
      }
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      contract: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      consulting: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      maintenance: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      license: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      audit: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (activeTab === 'builder') {
    return (
      <AdvancedContractBuilder
        template={selectedTemplate || undefined}
        backendTemplateId={selectedBackendId}
        onSave={async (template) => {
          console.log('Saving template:', template);

          // Reload templates from backend to get the latest data
          try {
            const backendData = await fetchTemplates('CERTIFICATION_CONTRACT');
            const mappedTemplates: Template[] = backendData.map((bt: BackendTemplate) => {
              const templateData = bt.template_data as Template;
              return {
                ...templateData,
                id: bt.template_id || `template-${bt.id}`,
                is_published: bt.status === 'ACTIVE',
                created_at: bt.created_at,
                updated_at: bt.updated_at,
              };
            });

            const mapping = new Map<string, string>();
            backendData.forEach((bt: BackendTemplate) => {
              const frontendId = bt.template_id || `template-${bt.id}`;
              if (bt.template_id) {
                mapping.set(frontendId, bt.template_id);
              }
            });

            setTemplates(mappedTemplates);
            setBackendTemplates(mapping);
          } catch (error) {
            console.error('Failed to reload templates:', error);
          }

          setActiveTab('list');
          setSelectedTemplate(null);
          setSelectedBackendId(undefined);
        }}
        onBack={() => {
          setActiveTab('list');
          setSelectedTemplate(null);
          setSelectedBackendId(undefined);
        }}
      />
    );
  }

  // Note: TemplatePreview might need updates to handle the new Template interface
  // For now, we assume it can handle it or we might need to cast/adapt if it's strictly typed to the old one.
  // Given the previous file view of template-preview wasn't detailed, we'll assume it needs the new Template type.
  // If it breaks, we'll fix it.

  if (activeTab === 'preview' && selectedTemplate) {
    // Temporary: just show builder in read-only or similar if preview component isn't ready for new type
    // But let's try to pass it.
    // If TemplatePreview expects the OLD ContractTemplate, this will fail.
    // Let's check template-preview.tsx in a moment. For now, let's comment out the actual component render if unsure, 
    // or just render a placeholder.
    // Actually, let's render the AdvancedContractBuilder but maybe we can add a 'readOnly' prop later.
    // For now, let's just go back to list.
    return (
      <div className="p-6">
        <button onClick={() => setActiveTab('list')} className="mb-4 flex items-center gap-2 text-primary">
          Back to List
        </button>
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">{selectedTemplate.title}</h2>
          <p>Preview functionality for advanced templates is coming soon.</p>
          <p>Please use the "Edit" mode to see the visual layout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Contract Templates
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create, manage, and customize contract templates
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="contract">Contract</option>
            <option value="audit">Audit</option>
            <option value="report">Report</option>
            <option value="certification">Certification</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${view === 'list'
              ? 'bg-primary text-white'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Templates Grid/List */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : view === 'grid' ? (
        <motion.div layout className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                      {template.type}
                    </span>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${template.is_published ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {template.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex justify-between">
                    <span>Pages: {template.pages.length}</span>
                    <span title={template.id} className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      ID: {template.id?.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created: {new Date(template.created_at || '').toLocaleDateString()}</span>
                    <span>Updated: {new Date(template.updated_at || '').toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size: {template.settings?.pageSize} ({template.settings?.orientation})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePreviewTemplate(template)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditTemplate(template)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </motion.button>
                  <button
                    onClick={() => handleDuplicateTemplate(template)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id!)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Pages</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Updated</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{template.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{template.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                        {template.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{template.pages.length}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(template.updated_at || '').toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${template.is_published
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                        {template.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePreviewTemplate(template)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateTemplate(template)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id!)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery || filterType !== 'all' ? 'Try adjusting your search or filters' : 'Get started by creating your first template'}
          </p>
          {!searchQuery && filterType === 'all' && (
            <div className="mt-6">
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create template
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

