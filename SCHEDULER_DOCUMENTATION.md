# Comprehensive Scheduler System - AssureHub

## Overview

The AssureHub Scheduler is a comprehensive task and activity management system specifically designed for auditors and audit teams. It provides multiple view modes, robust filtering, and supports various types of work items including tasks, audit activities, checklists, and workflows.

## Features

### 🎯 Multiple Item Types
- **Tasks**: General tasks with categories like invoicing, reporting, sales, compliance
- **Audit Activities**: Site visits, preparations, documentation, report writing
- **Checklists**: Pre-audit checklists, compliance verification, template-based items
- **Workflows**: Multi-step processes like certification workflows, client onboarding

### 📊 Three View Modes
1. **List View**: Detailed list with expandable items showing full information
2. **Kanban Board**: Drag-and-drop interface with status-based columns
3. **Calendar View**: Monthly calendar with day-specific event details

### 🕒 Time-Based Filtering
- **Today**: Items due today
- **This Week**: Items due within the current week
- **This Month**: Items due within the current month

### 🔍 Advanced Filtering
- Filter by item type (tasks, audit activities, checklists, workflows)
- Filter by status (not started, in progress, review, blocked, completed, overdue)
- Filter by priority (critical, high, medium, low)
- Filter by assigned person
- Text search across titles, descriptions, and tags

### 📈 Real-time Statistics
- Completion rates and progress tracking
- Breakdown by type, status, and priority
- Overdue and upcoming item alerts
- Visual progress indicators

## Navigation

The Scheduler is accessible via:
- **Main Navigation**: "Scheduler" link below Dashboard in the sidebar
- **Direct URL**: `/scheduler`

## Components Architecture

### Main Page (`/app/scheduler/page.tsx`)
The main scheduler page that orchestrates all views and manages state.

### View Components
- **SchedulerList** (`scheduler-list.tsx`): Detailed list view with expandable items
- **SchedulerKanban** (`scheduler-kanban.tsx`): Drag-and-drop kanban board
- **SchedulerCalendar** (`scheduler-calendar.tsx`): Monthly calendar with event details

### Supporting Components
- **SchedulerFilters** (`scheduler-filters.tsx`): Advanced filtering interface
- **SchedulerStats** (`scheduler-stats.tsx`): Real-time statistics and progress tracking

## Data Types

### Core Interfaces
```typescript
// Base scheduler item
interface BaseSchedulerItem {
  id: string;
  title: string;
  description?: string;
  type: SchedulerItemType;
  status: SchedulerItemStatus;
  priority: Priority;
  assignedTo?: string;
  dueDate: Date;
  dueTime?: string;
  // ... additional fields
}

// Specific item types
interface TaskItem extends BaseSchedulerItem {
  type: "task";
  category: string;
  subtasks?: Subtask[];
  // ... task-specific fields
}

interface AuditActivityItem extends BaseSchedulerItem {
  type: "audit-activity";
  auditId: string;
  clientName: string;
  standard: string;
  activityType: string;
  // ... audit-specific fields
}
```

### Enums and Types
```typescript
type SchedulerItemType = "task" | "audit-activity" | "checklist" | "workflow";
type SchedulerViewMode = "kanban" | "calendar" | "list";
type TimePeriod = "today" | "week" | "month";
type SchedulerItemStatus = "not-started" | "in-progress" | "review" | "completed" | "blocked" | "overdue";
type Priority = "critical" | "high" | "medium" | "low";
```

## Usage Examples

### Basic Implementation
```typescript
import { SchedulerList, SchedulerKanban, SchedulerCalendar } from '@/components/Scheduler';

// List view
<SchedulerList
  data={schedulerItems}
  onItemUpdate={handleItemUpdate}
  onItemComplete={handleItemComplete}
/>

// Kanban view
<SchedulerKanban
  data={schedulerItems}
  onStatusChange={handleStatusChange}
  onItemUpdate={handleItemUpdate}
/>

// Calendar view
<SchedulerCalendar
  data={schedulerItems}
  onItemUpdate={handleItemUpdate}
  onItemComplete={handleItemComplete}
/>
```

### Filtering and Statistics
```typescript
<SchedulerFilters
  filters={filters}
  timePeriod={timePeriod}
  onFiltersChange={handleFiltersChange}
  onTimePeriodChange={handleTimePeriodChange}
/>

<SchedulerStats 
  data={filteredData}
  timePeriod={timePeriod}
/>
```

## View-Specific Features

### List View
- **Expandable Details**: Click "More" to see type-specific information
- **Quick Actions**: Complete, snooze, reassign buttons
- **Priority Indicators**: Color-coded left borders
- **Tag Display**: Visual tag representation
- **Time Information**: Due dates with relative formatting

### Kanban View
- **Drag & Drop**: Move items between status columns
- **Visual Priority**: Color-coded priority borders
- **Progress Bars**: For checklists and workflows
- **Compact Cards**: Essential information in minimal space
- **Overdue Alerts**: Red ring indicators for overdue items

### Calendar View
- **Monthly Grid**: Traditional calendar layout
- **Event Indicators**: Color-coded events by status
- **Day Detail Panel**: Click dates to see detailed event information
- **Navigation**: Month navigation with "Today" button
- **Time Display**: Shows specific times for scheduled items

## Mock Data Structure

The system includes comprehensive mock data demonstrating:
- Task with subtasks and client relations
- Audit activity with team assignments
- Checklist with completion tracking
- Workflow with multi-step process

## Responsive Design

- **Mobile-First**: Responsive grid layouts
- **Touch-Friendly**: Appropriate touch targets
- **Dark Mode**: Full dark mode compatibility
- **Accessibility**: Semantic HTML and keyboard navigation

## Integration Points

### Dashboard Integration
- Sidebar navigation link positioned below Dashboard
- Consistent with existing AssureHub design patterns
- Uses existing component library (WidgetCard, TaskOverviewCard)

### Type System Integration
- Extends existing audit types from `@/types/audit`
- New comprehensive type system in `@/types/scheduler`
- Compatible with existing task management

### Component Reuse
- Leverages existing UI components
- Maintains design consistency
- Uses established patterns for forms and interactions

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live collaboration
- **Drag & Drop Calendar**: Move events between dates
- **Bulk Operations**: Multi-select for batch actions
- **Advanced Notifications**: Email and push notifications
- **Integration APIs**: External calendar sync
- **Mobile App**: Dedicated mobile application
- **Offline Support**: Local storage and sync
- **Advanced Analytics**: Detailed reporting and insights

### Performance Optimizations
- **Virtual Scrolling**: For large datasets
- **Memoization**: Optimized re-renders
- **Lazy Loading**: On-demand data loading
- **Caching**: Smart data caching strategies

## Best Practices

### Data Management
- Use proper TypeScript types for all scheduler items
- Implement proper error handling for async operations
- Maintain data consistency across view modes
- Use optimistic updates for better UX

### Performance
- Memoize expensive calculations
- Use React.memo for pure components
- Implement proper dependency arrays in useEffect
- Avoid unnecessary re-renders

### Accessibility
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Maintain proper color contrast
- Use semantic HTML elements

## Testing Strategy

### Unit Tests
- Component rendering tests
- Data filtering logic tests
- Date calculation tests
- State management tests

### Integration Tests
- View mode switching
- Filter application
- Drag & drop functionality
- Calendar navigation

### E2E Tests
- Complete user workflows
- Cross-browser compatibility
- Mobile responsiveness
- Performance benchmarks

## Deployment Considerations

### Environment Variables
- API endpoints for data fetching
- Feature flags for gradual rollout
- Analytics configuration

### Performance Monitoring
- Bundle size optimization
- Runtime performance tracking
- User interaction analytics
- Error monitoring

This comprehensive scheduler system provides a robust foundation for auditor task management while maintaining flexibility for future enhancements and integrations.