# Auditor Scheduler Component

## Overview
The AuditorScheduler component provides a comprehensive time-based task management view specifically designed for auditors in the AssureHub platform. It integrates seamlessly with the existing dashboard and task management system.

## Features

### Time-Based Views
- **Today's Tasks**: Shows all tasks due today with time-specific scheduling
- **Weekly View**: Displays tasks for the current week organized by day
- **Monthly View**: Shows all tasks due within the current month

### Interactive Elements
- **Task Switching**: Easy toggle between Today, Week, and Month views
- **Task Completion**: Mark tasks as complete directly from the scheduler
- **Task Actions**: Snooze, reassign, and view detailed task information
- **Quick Statistics**: View counts for each time period and overdue alerts

### Task Organization
- **Priority Sorting**: Tasks are sorted by priority (Critical > High > Medium > Low) then by due date
- **Date Grouping**: Tasks are grouped by due date for better organization
- **Visual Indicators**: Color-coded priority indicators and status badges
- **Empty States**: Friendly messages when no tasks are due

### Responsive Design
- **Mobile-Friendly**: Responsive layout that works on all screen sizes
- **Dark Mode Support**: Full support for light and dark themes
- **Accessibility**: Proper semantic HTML and keyboard navigation

## Integration

### Dashboard Integration
The scheduler is automatically integrated below the main dashboard content in:
- `/dashboard` - Main dashboard page
- `/dashboard/auditors` - Auditor performance dashboard

### Data Source
Currently uses mock data (MOCK_SCHEDULER_TASKS) but is designed to easily integrate with:
- Task Management API
- Real-time task updates
- User-specific task filtering

## Usage

```typescript
import { AuditorScheduler } from '@/components/Scheduler/auditor-scheduler';

// Basic usage
<AuditorScheduler />

// With custom handlers
<AuditorScheduler
  tasks={customTasks}
  onTaskComplete={handleTaskComplete}
  onTaskSnooze={handleTaskSnooze}
  onTaskAction={handleTaskAction}
/>
```

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `tasks` | `Task[]` | Array of tasks to display | `MOCK_SCHEDULER_TASKS` |
| `onTaskComplete` | `(taskId: string) => void` | Handler for task completion | `undefined` |
| `onTaskSnooze` | `(taskId: string) => void` | Handler for task snoozing | `undefined` |
| `onTaskAction` | `(taskId: string, action: string) => void` | Handler for other task actions | `undefined` |

## Future Enhancements

### Planned Features
- **Drag & Drop**: Reschedule tasks by dragging between dates
- **Calendar Integration**: Sync with external calendar systems
- **Task Templates**: Quick task creation from templates
- **Bulk Operations**: Select multiple tasks for batch operations
- **Task Dependencies**: Visual representation of task relationships
- **Time Tracking**: Integration with time tracking for audit tasks

### Performance Optimizations
- **Virtual Scrolling**: For large task lists
- **Real-time Updates**: WebSocket integration for live task updates
- **Caching**: Smart caching of task data
- **Lazy Loading**: Load tasks on-demand as views change

## Technical Details

### Component Architecture
- Built with React functional components and hooks
- Uses TypeScript for type safety
- Follows existing AssureHub design patterns
- Integrates with existing task management types

### Dependencies
- Reuses existing UI components (WidgetCard, PriorityTaskItem, etc.)
- Compatible with existing task management system
- Uses the same Task type definitions from `@/types/audit`

### Styling
- Uses Tailwind CSS following AssureHub's design system
- Consistent with existing component styling
- Supports both light and dark themes
- Responsive design with mobile-first approach