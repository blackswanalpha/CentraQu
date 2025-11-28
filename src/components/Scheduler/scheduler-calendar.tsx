"use client";

import { useState, useMemo } from "react";
import { SchedulerItem, CalendarEvent } from "@/types/scheduler";
import { WidgetCard } from "@/components/Dashboard/widget-card";

interface SchedulerCalendarProps {
  data: SchedulerItem[];
  onItemUpdate: (itemId: string, updates: Partial<SchedulerItem>) => void;
  onItemComplete: (itemId: string) => void;
}

export function SchedulerCalendar({ data, onItemUpdate, onItemComplete }: SchedulerCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Convert scheduler items to calendar events
  const calendarEvents = useMemo(() => {
    return data.map((item): CalendarEvent => {
      const startDate = new Date(item.dueDate);
      const endDate = new Date(startDate);
      
      // Set time if available
      if (item.dueTime) {
        const [hours, minutes] = item.dueTime.split(":").map(Number);
        startDate.setHours(hours, minutes, 0, 0);
        
        // Add estimated duration if available
        if (item.estimatedDuration) {
          endDate.setTime(startDate.getTime() + item.estimatedDuration * 60 * 1000);
        } else {
          endDate.setTime(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour
        }
      } else {
        endDate.setDate(startDate.getDate() + 1);
      }

      return {
        id: item.id,
        title: item.title,
        start: startDate,
        end: endDate,
        allDay: !item.dueTime,
        type: item.type,
        status: item.status,
        priority: item.priority,
        description: item.description,
        assignedTo: item.assignedToName,
        item,
      };
    });
  }, [data]);

  // Get calendar grid data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first Sunday before or on the first day
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // End on the last Saturday after or on the last day
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const weeks = [];
    const currentWeekStart = new Date(startDate);
    
    while (currentWeekStart <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        
        // Get events for this date
        const dayEvents = calendarEvents.filter(event => 
          event.start.toDateString() === date.toDateString()
        );
        
        week.push({
          date: new Date(date),
          events: dayEvents,
          isCurrentMonth: date.getMonth() === month,
          isToday: date.toDateString() === new Date().toDateString(),
        });
      }
      weeks.push(week);
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    return weeks;
  }, [currentDate, calendarEvents]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getTypeIcon = (type: SchedulerItem['type']) => {
    switch (type) {
      case "task": return "📋";
      case "audit-activity": return "🔍";
      case "checklist": return "✅";
      case "workflow": return "🔄";
      default: return "📄";
    }
  };

  const getStatusColor = (status: SchedulerItem['status']) => {
    switch (status) {
      case "not-started": return "bg-gray-200 text-gray-700";
      case "in-progress": return "bg-blue-200 text-blue-800";
      case "review": return "bg-yellow-200 text-yellow-800";
      case "completed": return "bg-green-200 text-green-800";
      case "blocked": return "bg-red-200 text-red-800";
      case "overdue": return "bg-red-300 text-red-900";
      default: return "bg-gray-200 text-gray-700";
    }
  };

  const getPriorityDot = (priority: SchedulerItem['priority']) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return calendarEvents.filter(event => 
      event.start.toDateString() === selectedDate.toDateString()
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <WidgetCard 
            title={currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            action={
              <div className="flex gap-2">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-hover"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth("next")}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Next →
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="space-y-1">
                {calendarData.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        onClick={() => setSelectedDate(day.date)}
                        className={`min-h-24 p-1 border rounded cursor-pointer transition-colors ${
                          day.isCurrentMonth 
                            ? "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" 
                            : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                        } ${
                          day.isToday 
                            ? "ring-2 ring-primary bg-primary/5" 
                            : ""
                        } ${
                          selectedDate?.toDateString() === day.date.toDateString()
                            ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        }`}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          day.isCurrentMonth 
                            ? "text-dark dark:text-white" 
                            : "text-gray-400 dark:text-gray-600"
                        }`}>
                          {day.date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {day.events.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${getStatusColor(event.status)}`}
                              title={event.title}
                            >
                              <div className="flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(event.priority)}`} />
                                <span className="truncate">{event.title.substring(0, 15)}</span>
                              </div>
                            </div>
                          ))}
                          {day.events.length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                              +{day.events.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Day Detail */}
        <div>
          <WidgetCard 
            title={selectedDate ? selectedDate.toLocaleDateString("en-US", { 
              weekday: "long", 
              month: "long", 
              day: "numeric" 
            }) : "Select a date"}
          >
            {selectedDate ? (
              <div className="space-y-4">
                {getSelectedDateEvents().length > 0 ? (
                  getSelectedDateEvents().map(event => (
                    <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(event.type)}</span>
                          <div className={`w-2 h-2 rounded-full ${getPriorityDot(event.priority)}`} />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                          {event.status.replace("-", " ")}
                        </span>
                      </div>

                      <h4 className="font-semibold text-sm text-dark dark:text-white mb-1">
                        {event.title}
                      </h4>

                      {event.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {event.description}
                        </p>
                      )}

                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        {!event.allDay && (
                          <div>
                            Time: {formatTime(event.start)} - {formatTime(event.end)}
                          </div>
                        )}
                        {event.assignedTo && (
                          <div>Assigned: {event.assignedTo}</div>
                        )}
                      </div>

                      {event.status !== "completed" && (
                        <button
                          onClick={() => onItemComplete(event.id)}
                          className="mt-2 w-full px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                        >
                          ✓ Mark Complete
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📅</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No events scheduled
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click on a date to view events
                </p>
              </div>
            )}
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}