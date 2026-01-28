'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import BackButton from '@/components/common/BackButton';

const SigninPage = () => {
  const router = useRouter();
  const { signin, isAuthenticated, isLoading: authLoading } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  // Don't render the form if user is already authenticated
  if (!authLoading && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Call auth-context signin
      await signin(email, password);

      // Allow state to settle before redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
    } catch (err: unknown) {
      // 🔑 IMPORTANT FIX: no double prefix
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signin failed. Unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <BackButton href="/" />

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading || authLoading}
            className={`w-full py-2 px-4 text-white rounded-md transition ${
              isLoading || authLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {(isLoading || authLoading) ? 'Signing in…' : 'Sign in'}
          </button>

          {/* Add Task Button - redirects to guest tasks page */}
          <div className="mt-4">
            <Link
              href="/tasks"
              className="w-full py-2 px-4 text-white rounded-md transition bg-gray-600 hover:bg-gray-700 text-center block"
            >
              Add Task (Guest Access)
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninPage;