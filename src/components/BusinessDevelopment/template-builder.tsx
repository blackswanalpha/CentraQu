'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Settings,
  Type,
  Hash,
  Calendar,
  List,
  CheckSquare,
  FileText,
  Table,
  Save,
  ArrowLeft,
  Copy,
  Download,
  Upload,
} from 'lucide-react';
import { DesignView } from './template-builder-views';
import { PreviewView, SettingsView } from './template-preview';

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea' | 'email' | 'phone';
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  isRequired: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    customMessage?: string;
  };
  width?: 'full' | 'half' | 'third' | 'quarter';
  helpText?: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  type: 'form' | 'text' | 'table' | 'list';
  content?: string;
  isRequired: boolean;
  order: number;
  fields?: TemplateField[];
  tableColumns?: string[];
  listItems?: string[];
  styling?: {
    background?: string;
    border?: boolean;
    spacing?: 'compact' | 'normal' | 'spacious';
  };
}

interface ContractTemplate {
  id?: number;
  name: string;
  description: string;
  type: 'service' | 'maintenance' | 'consulting' | 'license';
  category: string;
  sections: TemplateSection[];
  metadata?: {
    version: string;
    author: string;
    tags: string[];
  };
}

export const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: Type, description: 'Single line text input' },
  { type: 'textarea', label: 'Text Area', icon: FileText, description: 'Multi-line text input' },
  { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input with validation' },
  { type: 'date', label: 'Date', icon: Calendar, description: 'Date picker input' },
  { type: 'select', label: 'Dropdown', icon: List, description: 'Select from options' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Boolean true/false input' },
  { type: 'email', label: 'Email', icon: Type, description: 'Email input with validation' },
  { type: 'phone', label: 'Phone', icon: Type, description: 'Phone number input' },
] as const;

const SECTION_TYPES = [
  { type: 'form', label: 'Form Section', icon: FileText, description: 'Interactive form with fields' },
  { type: 'text', label: 'Text Block', icon: Type, description: 'Rich text content section' },
  { type: 'table', label: 'Data Table', icon: Table, description: 'Structured data table' },
  { type: 'list', label: 'List Items', icon: List, description: 'Bulleted or numbered list' },
] as const;

interface TemplateBuilderProps {
  template?: ContractTemplate;
  onSave: (template: ContractTemplate) => Promise<void>;
  onBack: () => void;
}

export function TemplateBuilder({ template, onSave, onBack }: TemplateBuilderProps) {
  const [currentTemplate, setCurrentTemplate] = useState<ContractTemplate>(
    template || {
      name: '',
      description: '',
      type: 'service',
      category: '',
      sections: [],
      metadata: {
        version: '1.0.0',
        author: 'System',
        tags: [],
      },
    }
  );
  
  const [activeTab, setActiveTab] = useState<'design' | 'preview' | 'settings'>('design');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [showFieldLibrary, setShowFieldLibrary] = useState(false);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSection = (type: TemplateSection['type']) => {
    const newSection: TemplateSection = {
      id: `section-${Date.now()}`,
      title: `New ${type} Section`,
      type,
      isRequired: false,
      order: currentTemplate.sections.length,
      fields: type === 'form' ? [] : undefined,
      tableColumns: type === 'table' ? ['Column 1', 'Column 2'] : undefined,
      listItems: type === 'list' ? ['Item 1', 'Item 2'] : undefined,
      content: type === 'text' ? 'Enter your text content here...' : undefined,
    };

    setCurrentTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setSelectedSection(newSection.id);
    setShowSectionLibrary(false);
  };

  const addFieldToSection = (sectionId: string, fieldType: TemplateField['type']) => {
    const newField: TemplateField = {
      id: `field-${Date.now()}`,
      label: `New ${fieldType} Field`,
      type: fieldType,
      isRequired: false,
      width: 'full',
      placeholder: fieldType === 'select' ? undefined : `Enter ${fieldType}...`,
      options: fieldType === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };

    setCurrentTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, fields: [...(section.fields || []), newField] }
          : section
      ),
    }));
    setSelectedField(newField.id);
    setShowFieldLibrary(false);
  };

  const updateSection = (sectionId: string, updates: Partial<TemplateSection>) => {
    setCurrentTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<TemplateField>) => {
    setCurrentTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields?.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
            }
          : section
      ),
    }));
  };

  const deleteSection = (sectionId: string) => {
    setCurrentTemplate(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
    }));
    setSelectedSection(null);
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    setCurrentTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields?.filter(field => field.id !== fieldId),
            }
          : section
      ),
    }));
    setSelectedField(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggedItem(active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeIndex = currentTemplate.sections.findIndex(section => section.id === active.id);
    const overIndex = currentTemplate.sections.findIndex(section => section.id === over.id);

    if (activeIndex !== overIndex) {
      setCurrentTemplate(prev => ({
        ...prev,
        sections: arrayMove(prev.sections, activeIndex, overIndex).map((section, index) => ({
          ...section,
          order: index,
        })),
      }));
    }

    setDraggedItem(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(currentTemplate);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {template ? `Edit: ${template.name}` : 'Create New Template'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Build your contract template with drag-and-drop sections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
              {(['design', 'preview', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving || !currentTemplate.name}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Template'}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {activeTab === 'design' && (
          <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Template Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={currentTemplate.name}
                    onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={currentTemplate.description}
                    onChange={(e) => setCurrentTemplate(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Template description"
                  />
                </div>
              </div>
            </div>

            {/* Add Sections */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowSectionLibrary(!showSectionLibrary)}
                className="w-full flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </button>

              <AnimatePresence>
                {showSectionLibrary && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-2"
                  >
                    {SECTION_TYPES.map((sectionType) => (
                      <motion.button
                        key={sectionType.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addSection(sectionType.type)}
                        className="w-full flex items-start gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors dark:border-gray-600 dark:hover:border-primary"
                      >
                        <sectionType.icon className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {sectionType.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {sectionType.description}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section List */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Sections ({currentTemplate.sections.length})
              </h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={currentTemplate.sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {currentTemplate.sections.map((section) => (
                      <SortableSectionItem
                        key={section.id}
                        section={section}
                        isSelected={selectedSection === section.id}
                        onSelect={() => setSelectedSection(section.id)}
                        onDelete={() => deleteSection(section.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {draggedItem ? (
                    <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-200">
                      {draggedItem.title}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'design' && (
            <DesignView
              template={currentTemplate}
              selectedSection={selectedSection}
              selectedField={selectedField}
              onUpdateSection={updateSection}
              onUpdateField={updateField}
              onSelectSection={setSelectedSection}
              onSelectField={setSelectedField}
              onAddField={addFieldToSection}
              onDeleteField={deleteField}
            />
          )}
          
          {activeTab === 'preview' && (
            <PreviewView template={currentTemplate} />
          )}
          
          {activeTab === 'settings' && (
            <SettingsView
              template={currentTemplate}
              onUpdateTemplate={setCurrentTemplate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Sortable Section Item Component
function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onDelete,
}: {
  section: TemplateSection;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, data: section });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'form': return FileText;
      case 'text': return Type;
      case 'table': return Table;
      case 'list': return List;
      default: return FileText;
    }
  };

  const SectionIcon = getSectionIcon(section.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-3 border rounded-lg transition-all ${
        isDragging
          ? 'opacity-50 shadow-lg'
          : isSelected
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      } ${isDragging ? '' : 'cursor-pointer'}`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <SectionIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {section.title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {section.type} • {section.fields?.length || 0} fields
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

