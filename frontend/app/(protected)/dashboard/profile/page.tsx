'use client';

import React, { useState } from 'react';
import { useAuth, User } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/navbar';
import NavbarLayout from '@/components/dashboard/navbar-layout';
import BackButton from '@/components/common/BackButton';

const ProfilePage = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    bio: user?.email ? `Hi, I'm ${user.email.split('@')[0]}!` : 'Tell us about yourself...'
  });
  const [preferences, setPreferences] = useState({
    notifications: false,
    darkMode: false
  });

  // Load preferences when component mounts
  React.useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      try {
        const parsedPrefs = JSON.parse(savedPrefs);
        setPreferences(parsedPrefs);
      } catch (error) {
        console.error('Error parsing user preferences:', error);
      }
    }
  }, []); // Only run once when component mounts
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('authToken')) {
      router.push('/signin');
    }
    // Initialize form data with user data when available
    if (user) {
      setFormData({
        name: user.email?.split('@')[0] || '',
        email: user.email || '',
        bio: user.email ? `Hi, I'm ${user.email.split('@')[0]}!` : 'Tell us about yourself...'
      });
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null; // Redirect will happen via useEffect
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (pref: 'notifications' | 'darkMode') => {
    setPreferences(prev => ({
      ...prev,
      [pref]: !prev[pref]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Simulate API call to save profile data
      // In a real application, you would make an actual API call here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      // Update user data using the auth context
      if (user) {
        // Prepare updated user data
        const updatedUserData: Partial<User> = {};

        if (formData.email !== user.email) {
          updatedUserData.email = formData.email;
        }

        if (formData.name !== user.email?.split('@')[0]) {
          updatedUserData.name = formData.name;
        }

        // Update user if there are changes
        if (Object.keys(updatedUserData).length > 0) {
          updateUser({ ...user, ...updatedUserData });
        }
      }

      // Save preferences to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));

      setMessage('Profile updated successfully!');

      setIsEditing(false);

      // Optional: Refresh the page to reflect changes in other parts of the app
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Header component for the profile page
  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <BackButton href="/dashboard" className="mr-4" />
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
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
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-800 font-medium text-xl">
                  {(user?.name || user?.email)?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                {user?.name || user?.email?.split('@')[0] || 'User Profile'}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage your personal profile information
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          {message && (
            <div className={`p-4 ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="divide-y divide-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <div className="mt-1 text-sm text-gray-900">{formData.name}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <div className="mt-1 text-sm text-gray-900">{formData.email}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <div className="mt-1 text-sm text-gray-900">{formData.bio}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Email notifications</span>
                    <button
                      type="button"
                      className={`${preferences.notifications ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      onClick={() => handlePreferenceChange('notifications')}
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          preferences.notifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Dark mode</span>
                    <button
                      type="button"
                      className={`${preferences.darkMode ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      onClick={() => handlePreferenceChange('darkMode')}
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          preferences.darkMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 flex justify-end">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      // Ensure form data is synced with current user data when entering edit mode
                      if (user) {
                        setFormData({
                          name: user.email?.split('@')[0] || '',
                          email: user.email || '',
                          bio: formData.bio // Keep the current bio value
                        });
                      }
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        // Revert form data to original values when cancelling
                        if (user) {
                          setFormData({
                            name: user.email?.split('@')[0] || '',
                            email: user.email || '',
                            bio: user.email ? `Hi, I'm ${user.email.split('@')[0]}!` : 'Tell us about yourself...'
                          });
                        }
                        setIsEditing(false);
                      }}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </NavbarLayout>
  );
};

export default ProfilePage;