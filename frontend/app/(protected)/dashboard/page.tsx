'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/navbar';
import TaskList from '@/components/tasks/task-list';
import TaskForm from '@/components/tasks/task-form';
import NavbarLayout from '@/components/dashboard/navbar-layout';
import BackButton from '@/components/common/BackButton';

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Don't redirect if not authenticated - allow guest access
  // The individual components will handle authentication as needed

  const handleLogout = () => {
    logout('/');
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  // Header component for the dashboard
  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <BackButton href="/" className="mr-4" />
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700">Welcome, {user?.name || user?.email?.split('@')[0] || 'User'}</span>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );

  return (
    <NavbarLayout
      navbar={<Navbar />}
      header={header}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Your Tasks</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your tasks efficiently</p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {showTaskForm ? 'Hide Form' : 'Add Task'}
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          {showTaskForm && isAuthenticated && (
            <div className="mb-6">
              <TaskForm onClose={() => setShowTaskForm(false)} />
            </div>
          )}
          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">Sign in to create and manage your tasks.</p>
            </div>
          )}
          <TaskList />
        </div>
      </div>
    </NavbarLayout>
  );
};

export default DashboardPage;