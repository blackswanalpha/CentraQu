import React from 'react';

// This is a server component
export default function AllTasksPage() {
  // Placeholder for task data
  const tasks = [
    {
      id: '1',
      name: 'Implement User Login Flow',
      project: 'Project Phoenix',
      assignee: 'Marcus Holloway',
      dueDate: 'Mar 1, 2024',
      status: 'Completed',
    },
    {
      id: '2',
      name: 'Design Dashboard Widgets',
      project: 'Project Phoenix',
      assignee: 'Anya Sharma',
      dueDate: 'Mar 15, 2024',
      status: 'In Progress',
    },
    {
      id: '3',
      name: 'API Integration for Reporting',
      project: 'Project Phoenix',
      assignee: 'Javier Rodriguez',
      dueDate: 'Mar 25, 2024',
      status: 'At Risk',
    },
    {
      id: '4',
      name: 'Final QA & Testing',
      project: 'Project Apollo',
      assignee: 'QA Team',
      dueDate: 'Mar 30, 2024',
      status: 'Not Started',
    },
  ];

  // Helper function to render status badge with appropriate styling
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
      case 'Not Started':
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-700';
        textColor = 'text-gray-600 dark:text-gray-300';
        break;
    }
    return (
      <span className={`inline-flex items-center ${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 mt-8"> {/* Added margin-top for separation from tabs */}
      {/* Search and Filter bar - Placeholder for now, can be a component later */}
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <label htmlFor="table-search" className="sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-base">search</span>
          </div>
          <input
            type="text"
            id="table-search-tasks"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
            placeholder="Search for tasks"
          />
        </div>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">filter_list</span>
            <span className="truncate">Filter</span>
        </button>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary/50 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">Task Name</th>
              <th scope="col" className="px-6 py-3">Project</th>
              <th scope="col" className="px-6 py-3">Assignee</th>
              <th scope="col" className="px-6 py-3">Due Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="bg-white dark:bg-background-dark border-b dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input id={`checkbox-table-search-${task.id}`} type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary/50 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor={`checkbox-table-search-${task.id}`} className="sr-only">checkbox</label>
                  </div>
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {task.name}
                </th>
                <td className="px-6 py-4">{task.project}</td>
                <td className="px-6 py-4">{task.assignee}</td>
                <td className="px-6 py-4">{renderStatusBadge(task.status)}</td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-primary dark:text-primary/90 hover:underline">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
