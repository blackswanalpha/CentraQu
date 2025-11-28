'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Settings,
  Type,
  Hash,
  Calendar,
  List,
  CheckSquare,
  FileText,
  Table,
  Eye,
  EyeOff,
  Copy,
  Edit3,
  AlertCircle,
} from 'lucide-react';
import { TemplateSection, TemplateField, FIELD_TYPES } from './template-builder';

interface DesignViewProps {
  template: any;
  selectedSection: string | null;
  selectedField: string | null;
  onUpdateSection: (sectionId: string, updates: Partial<TemplateSection>) => void;
  onUpdateField: (sectionId: string, fieldId: string, updates: Partial<TemplateField>) => void;
  onSelectSection: (sectionId: string) => void;
  onSelectField: (fieldId: string) => void;
  onAddField: (sectionId: string, fieldType: TemplateField['type']) => void;
  onDeleteField: (sectionId: string, fieldId: string) => void;
}

export function DesignView({
  template,
  selectedSection,
  selectedField,
  onUpdateSection,
  onUpdateField,
  onSelectSection,
  onSelectField,
  onAddField,
  onDeleteField,
}: DesignViewProps) {
  const [showFieldLibrary, setShowFieldLibrary] = useState(false);

  const selectedSectionData = template.sections.find((s: TemplateSection) => s.id === selectedSection);
  const selectedFieldData = selectedSectionData?.fields?.find((f: TemplateField) => f.id === selectedField);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Canvas Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {template.name || 'Untitled Template'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {template.description || 'No description provided'}
            </p>
          </div>

          {/* Template Sections */}
          <div className="space-y-6">
            {template.sections.map((section: TemplateSection, index: number) => (
              <SectionCanvas
                key={section.id}
                section={section}
                index={index}
                isSelected={selectedSection === section.id}
                selectedFieldId={selectedField}
                onSelectSection={() => onSelectSection(section.id)}
                onSelectField={onSelectField}
                onAddField={(fieldType) => onAddField(section.id, fieldType)}
                onDeleteField={(fieldId) => onDeleteField(section.id, fieldId)}
                showFieldLibrary={showFieldLibrary}
                setShowFieldLibrary={setShowFieldLibrary}
              />
            ))}
          </div>

          {/* Empty State */}
          {template.sections.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                No sections yet
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by adding your first section from the sidebar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4">
          {selectedFieldData ? (
            <FieldProperties
              field={selectedFieldData}
              onUpdate={(updates) => onUpdateField(selectedSection!, selectedField!, updates)}
            />
          ) : selectedSectionData ? (
            <SectionProperties
              section={selectedSectionData}
              onUpdate={(updates) => onUpdateSection(selectedSection!, updates)}
            />
          ) : (
            <div className="text-center py-8">
              <Settings className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No selection
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a section or field to edit its properties
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCanvas({
  section,
  index,
  isSelected,
  selectedFieldId,
  onSelectSection,
  onSelectField,
  onAddField,
  onDeleteField,
  showFieldLibrary,
  setShowFieldLibrary,
}: {
  section: TemplateSection;
  index: number;
  isSelected: boolean;
  selectedFieldId: string | null;
  onSelectSection: () => void;
  onSelectField: (fieldId: string) => void;
  onAddField: (fieldType: TemplateField['type']) => void;
  onDeleteField: (fieldId: string) => void;
  showFieldLibrary: boolean;
  setShowFieldLibrary: (show: boolean) => void;
}) {
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
    <motion.div
      layout
      className={`border-2 rounded-lg transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
      onClick={onSelectSection}
    >
      {/* Section Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <SectionIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {section.type} Section
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Section {index + 1}
          </div>
        </div>
        {section.description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {section.description}
          </p>
        )}
      </div>

      {/* Section Content */}
      <div className="p-4">
        {section.type === 'form' && (
          <div className="space-y-4">
            {section.fields?.map((field) => (
              <FieldPreview
                key={field.id}
                field={field}
                isSelected={selectedFieldId === field.id}
                onSelect={() => onSelectField(field.id)}
                onDelete={() => onDeleteField(field.id)}
              />
            ))}
            
            {/* Add Field Button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFieldLibrary(!showFieldLibrary);
                }}
                className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4 mx-auto mb-1" />
                <span className="text-sm">Add Field</span>
              </button>

              {/* Field Library */}
              <AnimatePresence>
                {showFieldLibrary && isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 z-10 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Choose Field Type
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {FIELD_TYPES.map((fieldType) => (
                        <button
                          key={fieldType.type}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddField(fieldType.type);
                            setShowFieldLibrary(false);
                          }}
                          className="flex items-center gap-2 p-2 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <fieldType.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {fieldType.label}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {section.type === 'text' && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400">
              {section.content || 'Enter your text content here...'}
            </p>
          </div>
        )}

        {section.type === 'table' && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {section.tableColumns?.map((column, index) => (
                    <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {section.tableColumns?.map((_, index) => (
                    <td key={index} className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Sample data
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {section.type === 'list' && (
          <ul className="space-y-2">
            {section.listItems?.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

function FieldPreview({
  field,
  isSelected,
  onSelect,
  onDelete,
}: {
  field: TemplateField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text': case 'email': case 'phone': return Type;
      case 'textarea': return FileText;
      case 'number': return Hash;
      case 'date': return Calendar;
      case 'select': return List;
      case 'checkbox': return CheckSquare;
      default: return Type;
    }
  };

  const FieldIcon = getFieldIcon(field.type);

  return (
    <motion.div
      layout
      className={`group p-3 border rounded-lg transition-all cursor-pointer ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FieldIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {field.label}
          </span>
          {field.isRequired && (
            <span className="text-red-500 text-xs">*</span>
          )}
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

      {/* Field Preview */}
      <div className="text-sm">
        {field.type === 'text' || field.type === 'email' || field.type === 'phone' ? (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            readOnly
          />
        ) : field.type === 'textarea' ? (
          <textarea
            placeholder={field.placeholder}
            rows={2}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            readOnly
          />
        ) : field.type === 'number' ? (
          <input
            type="number"
            placeholder={field.placeholder}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            readOnly
          />
        ) : field.type === 'date' ? (
          <input
            type="date"
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            readOnly
          />
        ) : field.type === 'select' ? (
          <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <option>Choose an option</option>
            {field.options?.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <label className="flex items-center gap-2">
            <input type="checkbox" className="text-xs" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Checkbox option</span>
          </label>
        ) : null}
      </div>

      {field.helpText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {field.helpText}
        </p>
      )}
    </motion.div>
  );
}

function SectionProperties({
  section,
  onUpdate,
}: {
  section: TemplateSection;
  onUpdate: (updates: Partial<TemplateSection>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Section Properties
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={section.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Optional section description"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="required"
            checked={section.isRequired}
            onChange={(e) => onUpdate({ isRequired: e.target.checked })}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="required" className="text-sm text-gray-700 dark:text-gray-300">
            Required section
          </label>
        </div>

        {section.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              value={section.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your text content..."
            />
          </div>
        )}

        {section.type === 'table' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Table Columns
            </label>
            <div className="space-y-2">
              {section.tableColumns?.map((column, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={column}
                    onChange={(e) => {
                      const newColumns = [...(section.tableColumns || [])];
                      newColumns[index] = e.target.value;
                      onUpdate({ tableColumns: newColumns });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      const newColumns = section.tableColumns?.filter((_, i) => i !== index);
                      onUpdate({ tableColumns: newColumns });
                    }}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newColumns = [...(section.tableColumns || []), `Column ${(section.tableColumns?.length || 0) + 1}`];
                  onUpdate({ tableColumns: newColumns });
                }}
                className="w-full p-2 text-sm text-primary border border-dashed border-primary rounded-lg hover:bg-primary/10"
              >
                + Add Column
              </button>
            </div>
          </div>
        )}

        {section.type === 'list' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              List Items
            </label>
            <div className="space-y-2">
              {section.listItems?.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(section.listItems || [])];
                      newItems[index] = e.target.value;
                      onUpdate({ listItems: newItems });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      const newItems = section.listItems?.filter((_, i) => i !== index);
                      onUpdate({ listItems: newItems });
                    }}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newItems = [...(section.listItems || []), `Item ${(section.listItems?.length || 0) + 1}`];
                  onUpdate({ listItems: newItems });
                }}
                className="w-full p-2 text-sm text-primary border border-dashed border-primary rounded-lg hover:bg-primary/10"
              >
                + Add Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldProperties({
  field,
  onUpdate,
}: {
  field: TemplateField;
  onUpdate: (updates: Partial<TemplateField>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Field Properties
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Field Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Field Type
          </label>
          <select
            value={field.type}
            onChange={(e) => onUpdate({ type: e.target.value as TemplateField['type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {FIELD_TYPES.map((type) => (
              <option key={type.type} value={type.type}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Placeholder Text
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Enter placeholder text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Help Text
          </label>
          <input
            type="text"
            value={field.helpText || ''}
            onChange={(e) => onUpdate({ helpText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Optional help text"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="required-field"
            checked={field.isRequired}
            onChange={(e) => onUpdate({ isRequired: e.target.checked })}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="required-field" className="text-sm text-gray-700 dark:text-gray-300">
            Required field
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Field Width
          </label>
          <select
            value={field.width || 'full'}
            onChange={(e) => onUpdate({ width: e.target.value as TemplateField['width'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="full">Full Width</option>
            <option value="half">Half Width</option>
            <option value="third">Third Width</option>
            <option value="quarter">Quarter Width</option>
          </select>
        </div>

        {field.type === 'select' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = e.target.value;
                      onUpdate({ options: newOptions });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      const newOptions = field.options?.filter((_, i) => i !== index);
                      onUpdate({ options: newOptions });
                    }}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                  onUpdate({ options: newOptions });
                }}
                className="w-full p-2 text-sm text-primary border border-dashed border-primary rounded-lg hover:bg-primary/10"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Validation Rules
          </h4>
          <div className="space-y-3">
            {(field.type === 'text' || field.type === 'textarea') && (
              <>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Minimum Length
                  </label>
                  <input
                    type="number"
                    value={field.validation?.minLength || ''}
                    onChange={(e) => onUpdate({
                      validation: { ...field.validation, minLength: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Min length"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Maximum Length
                  </label>
                  <input
                    type="number"
                    value={field.validation?.maxLength || ''}
                    onChange={(e) => onUpdate({
                      validation: { ...field.validation, maxLength: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Max length"
                  />
                </div>
              </>
            )}

            {field.type === 'number' && (
              <>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={field.validation?.min || ''}
                    onChange={(e) => onUpdate({
                      validation: { ...field.validation, min: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Min value"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={field.validation?.max || ''}
                    onChange={(e) => onUpdate({
                      validation: { ...field.validation, max: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Max value"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Custom Error Message
              </label>
              <input
                type="text"
                value={field.validation?.customMessage || ''}
                onChange={(e) => onUpdate({
                  validation: { ...field.validation, customMessage: e.target.value }
                })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Custom validation message"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}