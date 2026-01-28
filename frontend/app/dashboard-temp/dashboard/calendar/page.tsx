'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/navbar';
import NavbarLayout from '@/components/dashboard/navbar-layout';
import BackButton from '@/components/common/BackButton';
import { Task } from '@/types/task';
import apiClient from '@/services/api-client';

const CalendarPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('authToken')) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiClient.getTasks();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Redirect will happen via useEffect
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentViewDate(new Date());
  };

  // Header component for the calendar page
  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <BackButton href="/dashboard" className="mr-4" />
        <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
      </div>
    </div>
  );

  // Helper function to get current month's days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Calculate current month/year
  const today = new Date();
  const currentYear = currentViewDate.getFullYear();
  const currentMonth = currentViewDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Array of day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days array
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(currentYear, currentMonth, day);
    const dayOfWeek = dayNames[dateObj.getDay()];
    const dateToCheck = new Date(currentYear, currentMonth, day);
    const isTodayDate = dateToCheck.toDateString() === today.toDateString();

    // Find tasks for this specific day
    const dayTasks = tasks.filter(task => {
      if (!task.due_date) return false;

      // Parse the due date string to a Date object
      const taskDate = new Date(task.due_date);

      // Compare year, month, and date
      return taskDate.getFullYear() === currentYear &&
             taskDate.getMonth() === currentMonth &&
             taskDate.getDate() === day;
    });

    calendarDays.push({ day, dayOfWeek, isToday: isTodayDate, tasks: dayTasks });
  }

  if (loading) {
    return (
      <NavbarLayout
        navbar={<Navbar />}
        header={header}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </NavbarLayout>
    );
  }

  return (
    <NavbarLayout
      navbar={<Navbar />}
      header={header}
    >
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="Previous month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentViewDate.toLocaleString('default', { month: 'long' })} {currentYear}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="Next month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={goToCurrentMonth}
                  className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors"
                >
                  Current Month
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">View and manage your tasks on the calendar</p>
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-100 border border-gray-300 rounded mr-2"></div>
                <span className="text-xs text-gray-600">Today</span>
              </div>
              <div className="flex items-center ml-4">
                <div className="w-3 h-3 bg-indigo-100 rounded mr-2"></div>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
              <div className="flex items-center ml-4">
                <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-700 py-2 bg-gray-50 rounded"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayData, index) => {
              if (dayData === null) {
                // Empty cell for days before the first day of the month
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-32 p-2 border border-gray-200 bg-gray-50 rounded"
                  ></div>
                );
              } else {
                const { day, dayOfWeek, isToday, tasks: dayTasks } = dayData;
                return (
                  <div
                    key={`day-${day}`}
                    className={`min-h-32 p-2 border rounded-lg flex flex-col ${
                      isToday
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                        : 'border-gray-200 bg-white hover:bg-gray-50 transition-colors'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className={`text-xs font-medium ${
                        isToday ? 'text-indigo-700' : 'text-gray-500'
                      }`}>
                        {dayOfWeek}
                      </div>
                      <div className={`text-lg font-bold flex items-center justify-center w-8 h-8 mx-auto mt-1 rounded-full ${
                        isToday
                          ? 'bg-indigo-500 text-white'
                          : 'text-gray-700'
                      }`}>
                        {day}
                      </div>
                    </div>

                    <div className="flex-grow mt-2 overflow-y-auto max-h-20">
                      {dayTasks.length > 0 ? (
                        dayTasks.map((task, idx) => (
                          <div
                            key={idx}
                            className={`text-xs p-1 mb-1 rounded truncate ${
                              task.completed
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            }`}
                          >
                            <span className="truncate block">{task.title}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400 italic text-center">No tasks</div>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </NavbarLayout>
  );
};

export default CalendarPage;
