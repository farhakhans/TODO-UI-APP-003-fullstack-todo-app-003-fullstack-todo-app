'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

const ProtectedContent = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Don't redirect automatically anymore since individual components handle auth
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push('/signin');
  //   }
  // }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Allow everyone to see the content - individual components will handle auth
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 fade-in">
      {/* Main content */}
      <main className="fade-in p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ProtectedContent;