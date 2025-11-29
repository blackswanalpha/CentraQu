import React from 'react';

export default function CalendarPage() {
  // Placeholder for task data (same as AllTasksPage for consistency)
  const allTasks = [
    {
      id: '1',
      name: 'Implement User Login Flow',
      project: 'Project Phoenix',
      assignee: 'Marcus Holloway',
      dueDate: '2024-03-01', // YYYY-MM-DD format for easier date parsing
      status: 'Completed',
    },
    {
      id: '2',
      name: 'Design Dashboard Widgets',
      project: 'Project Phoenix',
      assignee: 'Anya Sharma',
      dueDate: '2024-03-15',
      status: 'In Progress',
    },
    {
      id: '3',
      name: 'API Integration for Reporting',
      project: 'Project Phoenix',
      assignee: 'Javier Rodriguez',
      dueDate: '2024-03-25',
      status: 'At Risk',
    },
    {
      id: '4',
      name: 'Final QA & Testing',
      project: 'Project Apollo',
      assignee: 'QA Team',
      dueDate: '2024-03-30',
      status: 'Not Started',
    },
     {
      id: '5',
      name: 'Client Meeting',
      project: 'Project Alpha',
      assignee: 'You',
      dueDate: '2024-03-01',
      status: 'Scheduled',
    },
  ];

  // Helper function to render status badge with appropriate styling (copied from AllTasksPage)
  const renderStatusBadge = (status: string) => {
    let bgColor, textColor;
    switch (status) {
      case 'Completed':
        bgColor = 'bg-teal-100 dark:bg-teal-900/40';
        textColor = 'text-teal-600 dark:text-teal-300';
        break;
      case 'In Progress':
        bgColor = 'bg-blue-100 dark:bg-blue-900/40';
        textColor = 'text-blue-600 dark:text-blue-300';
        break;
      case 'At Risk':
        bgColor = 'bg-orange-100 dark:bg-orange-900/40';
        textColor = 'text-orange-600 dark:text-orange-300';
        break;
      case 'Scheduled':
        bgColor = 'bg-purple-100 dark:bg-purple-900/40';
        textColor = 'text-purple-600 dark:text-purple-300';
        break;
      case 'Not Started':
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-700';
        textColor = 'text-gray-600 dark:text-gray-300';
        break;
    }
    return (
      <span className={`inline-flex items-center ${bgColor} ${textColor} text-xs font-medium px-2 py-0.5 rounded-full mt-1`}>
        {status}
      </span>
    );
  };

  // --- Calendar Logic ---
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // For demonstration, let's display March 2024 as per placeholder data
  const displayMonth = 2; // March (0-indexed)
  const displayYear = 2024;

  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay(); // 0 for Sunday, 1 for Monday
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  const calendarDays = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Group tasks by date
  const tasksByDate: { [key: string]: typeof allTasks } = {};
  allTasks.forEach(task => {
    // Only consider tasks for the displayed month and year
    const taskDate = new Date(task.dueDate);
    if (taskDate.getMonth() === displayMonth && taskDate.getFullYear() === displayYear) {
      const dateKey = taskDate.getDate().toString();
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push(task);
    }
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col gap-6 mt-8"> {/* Added margin-top for separation from tabs */}
      {/* Calendar Header (Month navigation) */}
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">chevron_left</span>
            <span className="truncate">Prev Month</span>
        </button>
        <h2 className="text-gray-900 dark:text-white text-xl font-bold">
          {new Date(displayYear, displayMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="truncate">Next Month</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 dark:bg-gray-800 shadow-md overflow-hidden">
        {/* Weekday Headers */}
        {weekdays.map(day => (
          <div key={day} className="bg-gray-50 dark:bg-gray-900/50 p-2 text-center text-xs font-medium text-gray-700 dark:text-gray-400">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-32 p-2 ${day ? 'bg-white dark:bg-background-dark' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {day && (
              <>
                <p className={`text-right font-bold ${displayMonth === today.getMonth() && day === today.getDate() && displayYear === today.getFullYear() ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                  {day}
                </p>
                <div className="flex flex-col gap-1 mt-2">
                  {tasksByDate[day]?.map(task => (
                    <div key={task.id} className="text-xs">
                      <p className="font-medium text-gray-800 dark:text-gray-200 leading-tight">{task.name}</p>
                      {renderStatusBadge(task.status)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
