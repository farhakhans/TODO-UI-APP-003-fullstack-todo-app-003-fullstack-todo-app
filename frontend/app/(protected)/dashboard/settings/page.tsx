'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/navbar';
import NavbarLayout from '@/components/dashboard/navbar-layout';

const SettingsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: false
  });

  // Load preferences when component mounts
  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      try {
        const parsedPrefs = JSON.parse(savedPrefs);
        setPreferences({
          darkMode: parsedPrefs.darkMode || false,
          emailNotifications: parsedPrefs.notifications || false
        });
      } catch (error) {
        console.error('Error parsing user preferences:', error);
      }
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('authToken')) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Redirect will happen via useEffect
  }

  // Toggle preference function
  const togglePreference = (pref: 'darkMode' | 'emailNotifications') => {
    setPreferences(prev => ({
      ...prev,
      [pref]: !prev[pref]
    }));

    // Save to localStorage
    const updatedPrefs = {
      ...preferences,
      [pref]: !preferences[pref]
    };
    localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
  };

  // Header component for the settings page
  const header = (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
    </div>
  );

  return (
    <NavbarLayout
      navbar={<Navbar />}
      header={header}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account preferences</p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <div className="divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.name || user?.email?.split('@')[0]}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
                </div>
                <div className="pt-4">
                  <Link href="/dashboard/profile" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
              <div className="mt-4 space-y-4">
                <button
                  onClick={() => {
                    // Placeholder for change password functionality
                    alert('Change Password functionality would open a modal or navigate to a password change page in a real application.');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change Password
                </button>
                <button
                  onClick={() => {
                    // In a real app, this would trigger account deletion
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      console.log('Account deletion initiated');
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Application Settings</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Dark Mode</span>
                  <button
                    type="button"
                    className={`${preferences.darkMode ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    onClick={() => togglePreference('darkMode')}
                    role="switch"
                    aria-checked={preferences.darkMode}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        preferences.darkMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                  <button
                    type="button"
                    className={`${preferences.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    onClick={() => togglePreference('emailNotifications')}
                    role="switch"
                    aria-checked={preferences.emailNotifications}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavbarLayout>
  );
};

export default SettingsPage;