import React, { useState } from 'react';

export interface AuditorAvailability {
    auditor: {
        id: number;
        firstName?: string;
        lastName?: string;
        first_name?: string;
        last_name?: string;
        name?: string;
        role?: string;
    };
    availability: 'available' | 'busy' | 'partially_available';
    conflicting_audits?: Array<{
        title?: string;
        task?: string;
        start_date: string;
        end_date: string;
        type?: 'audit' | 'timesheet';
    }>;
}

interface AuditorCalendarProps {
    auditorsAvailability: AuditorAvailability[];
    currentDate: Date;
    onMonthChange: (date: Date) => void;
}

export const AuditorCalendar: React.FC<AuditorCalendarProps> = ({
    auditorsAvailability,
    currentDate,
    onMonthChange,
}) => {
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePrevMonth = () => {
        onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        onMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isDateBusy = (auditorData: AuditorAvailability, day: number) => {
        if (!auditorData.conflicting_audits) return false;

        const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        const dateStr = `${currentMonthStr}-${String(day).padStart(2, '0')}`;
        const checkDate = new Date(dateStr);

        return auditorData.conflicting_audits.some(conflict => {
            const start = new Date(conflict.start_date);
            const end = new Date(conflict.end_date);
            // Reset times for accurate date comparison
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            checkDate.setHours(0, 0, 0, 0);

            return checkDate >= start && checkDate <= end;
        });
    };

    const getAuditorName = (auditor: AuditorAvailability['auditor']) => {
        if (auditor.name) return auditor.name;
        if (auditor.firstName && auditor.lastName) return `${auditor.firstName} ${auditor.lastName}`;
        if (auditor.first_name && auditor.last_name) return `${auditor.first_name} ${auditor.last_name}`;
        return 'Unknown Auditor';
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Auditor Schedule - {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        &larr; Prev
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Next &rarr;
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left min-w-[150px]">
                                Auditor
                            </th>
                            {days.map(day => (
                                <th
                                    key={day}
                                    className="p-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center min-w-[30px]"
                                >
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {auditorsAvailability.map((item) => (
                            <tr key={item.auditor.id}>
                                <td className="p-2 border border-gray-200 dark:border-gray-700 font-medium whitespace-nowrap">
                                    {getAuditorName(item.auditor)}
                                </td>
                                {days.map(day => {
                                    const isBusy = isDateBusy(item, day);
                                    return (
                                        <td
                                            key={day}
                                            className={`p-1 border border-gray-200 dark:border-gray-700 text-center ${isBusy
                                                    ? 'bg-red-100 dark:bg-red-900/30'
                                                    : 'bg-green-50 dark:bg-green-900/10'
                                                }`}
                                        >
                                            {isBusy ? (
                                                <div className="w-full h-4 bg-red-400 rounded-sm mx-auto" title="Busy"></div>
                                            ) : (
                                                <div className="w-full h-4 bg-green-400 rounded-sm mx-auto opacity-20" title="Available"></div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded-sm opacity-20"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
                    <span>Busy (Audit/Task)</span>
                </div>
            </div>
        </div>
    );
};
