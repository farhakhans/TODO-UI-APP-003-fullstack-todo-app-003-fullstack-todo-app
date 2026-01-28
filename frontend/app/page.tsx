'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import SkillsSection from '@/components/landing/skills-section';
import AgentsSection from '@/components/landing/agents-section';

const LandingPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-primary-700 flex items-center">
                <span className="mr-2 text-lg">📚</span>
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">TODO APP</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              ) : !isAuthenticated ? (
                <>
                  <Link
                    href="/signin"
                    className="text-primary-600 hover:text-primary-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-100 bg-white/70 shadow-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="text-primary-600 hover:text-primary-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-100 bg-white/70 shadow-sm"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block xl:inline">Manage your tasks with</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Todo App</span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  A secure, multi-user task management application with authentication, responsive design, and real-time updates.
                </motion.p>
                <motion.div
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="rounded-md shadow">
                    <Link
                      href={isAuthenticated ? "/dashboard" : "/signup"}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      {isAuthenticated ? "Go to Dashboard" : "Get started"}
                    </Link>
                  </div>
                  {!isAuthenticated && (
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        href="/signin"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                      >
                        Sign in
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-indigo-200 sm:h-72 md:h-96 lg:w-full lg:h-full">
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <div className="text-lg font-medium text-indigo-800">Task Management Dashboard</div>
                <div className="mt-2 text-sm text-indigo-600">Secure • Responsive • Collaborative</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection />

      {/* Agents Section */}
      <AgentsSection />

      {/* Call to Action */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
              Join thousands of users who trust our secure and responsive task management platform.
            </p>
            <div className="mt-10">
              <Link
                href={isAuthenticated ? "/dashboard" : "/signup"}
                className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100"
              >
                {isAuthenticated ? "Go to Dashboard" : "Create Account"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;