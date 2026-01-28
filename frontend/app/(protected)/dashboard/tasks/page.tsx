'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/navbar';
import NavbarLayout from '@/components/dashboard/navbar-layout';
import TaskList from '@/components/tasks/task-list';
import TaskForm from '@/components/tasks/task-form';

const TasksPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showTaskForm, setShowTaskForm] = React.useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('authToken')) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Redirect will happen via useEffect
  }

  // Header component for the tasks page
  const header = (
    <div className="flex items-center justify-between py-4">
      <h1 className="text-lg font-bold text-primary-800 flex items-center">
        <span className="mr-2 text-lg">📚</span>
        <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">TODO APP</span>
      </h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center"
        >
          <span className="mr-2">+</span>
          {showTaskForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>
    </div>
  );

  return (
    <NavbarLayout
      navbar={<Navbar />}
      header={header}
    >
      <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-primary-100/50 slide-up transition-all duration-300 hover:shadow-2xl">
        <div className="px-6 py-6 sm:px-8 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 border-b border-primary-100 fade-in">
          <div>
            <h2 className="text-xl leading-7 font-bold text-primary-800">Your Tasks</h2>
            <p className="mt-1 max-w-2xl text-sm text-primary-600">Manage your tasks efficiently</p>
          </div>
        </div>
        <div className="px-6 py-6 sm:p-8">
          {showTaskForm && (
            <div className="mb-6 bounce-in">
              <TaskForm onClose={() => setShowTaskForm(false)} />
            </div>
          )}
          <TaskList />
        </div>
      </div>
    </NavbarLayout>
  );
};

export default TasksPage;