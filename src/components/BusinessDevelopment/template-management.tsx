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
  Settings,
  Download,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TemplateBuilder } from './template-builder';
import { PreviewView as TemplatePreview } from './template-preview';

interface ContractTemplate {
  id: number;
  name: string;
  description: string;
  type: 'service' | 'maintenance' | 'consulting' | 'license';
  category: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isActive: boolean;
  sections: TemplateSection[];
}

interface TemplateSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'table' | 'list' | 'form';
  isRequired: boolean;
  order: number;
  fields?: TemplateField[];
}

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  placeholder?: string;
  options?: string[];
  isRequired: boolean;
  validation?: string;
}

export function TemplateManagement() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'builder' | 'preview'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'service' | 'maintenance' | 'consulting' | 'license'>('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockTemplates: ContractTemplate[] = [
      {
        id: 1,
        name: 'Standard Service Agreement',
        description: 'General service contract template for consulting and professional services',
        type: 'service',
        category: 'Professional Services',
        createdAt: '2024-01-15',
        updatedAt: '2024-11-20',
        usageCount: 23,
        isActive: true,
        sections: [
          {
            id: 'section-1',
            title: 'Service Description',
            content: 'This section outlines the services to be provided...',
            type: 'text',
            isRequired: true,
            order: 1,
            fields: [
              { id: 'service-name', label: 'Service Name', type: 'text', isRequired: true, placeholder: 'Enter service name' },
              { id: 'start-date', label: 'Start Date', type: 'date', isRequired: true },
              { id: 'end-date', label: 'End Date', type: 'date', isRequired: false },
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'ISO Certification Contract',
        description: 'Specialized template for ISO certification services',
        type: 'consulting',
        category: 'ISO Certification',
        createdAt: '2024-02-10',
        updatedAt: '2024-11-18',
        usageCount: 15,
        isActive: true,
        sections: []
      },
      {
        id: 3,
        name: 'Maintenance Agreement',
        description: 'Template for ongoing maintenance and support services',
        type: 'maintenance',
        category: 'Support Services',
        createdAt: '2024-03-05',
        updatedAt: '2024-11-15',
        usageCount: 8,
        isActive: false,
        sections: []
      }
    ];

    setTemplates(mockTemplates);
    setLoading(false);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    router.push('/template/starter');
  };

  const handleEditTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('builder');
  };

  const handlePreviewTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('preview');
  };

  const handleDuplicateTemplate = async (template: ContractTemplate) => {
    // In real implementation, this would call an API
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      service: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      consulting: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      maintenance: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      license: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (activeTab === 'builder') {
    return (
      <TemplateBuilder
        template={selectedTemplate}
        onSave={async (template) => {
          // In real implementation, this would save to API
          console.log('Saving template:', template);
          if (selectedTemplate) {
            // Update existing template
            setTemplates(prev => prev.map(t =>
              t.id === selectedTemplate.id
                ? { ...template, id: selectedTemplate.id, createdAt: selectedTemplate.createdAt, updatedAt: new Date().toISOString().split('T')[0] }
                : t
            ));
          } else {
            // Add new template
            const newTemplate = {
              ...template,
              id: Date.now(),
              createdAt: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString().split('T')[0],
              usageCount: 0,
              isActive: true,
            };
            setTemplates(prev => [newTemplate, ...prev]);
          }
          setActiveTab('list');
          setSelectedTemplate(null);
        }}
        onBack={() => setActiveTab('list')}
      />
    );
  }

  if (activeTab === 'preview') {
    return <TemplatePreview template={selectedTemplate!} />;
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
            <option value="service">Service</option>
            <option value="consulting">Consulting</option>
            <option value="maintenance">Maintenance</option>
            <option value="license">License</option>
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
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
                  <div className={`h-3 w-3 rounded-full ${template.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>Used {template.usageCount} times</span>
                  <span>Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
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
                    onClick={() => handleDeleteTemplate(template.id)}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Usage</th>
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
                        <div className="font-medium text-gray-900 dark:text-white">{template.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{template.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                        {template.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{template.usageCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(template.updatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${template.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                        {template.isActive ? 'Active' : 'Inactive'}
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
                          onClick={() => handleDeleteTemplate(template.id)}
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

