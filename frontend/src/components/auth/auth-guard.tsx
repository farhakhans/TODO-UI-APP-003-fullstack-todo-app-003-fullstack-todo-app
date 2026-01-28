import React from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, requires authentication, if false, redirects if already authenticated
  showAuthModal?: boolean; // If true, shows a modal instead of redirecting
}

const AuthGuard = ({ children, requireAuth = true, showAuthModal = false }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        if (showAuthModal) {
          setShowAuthPrompt(true);
        } else {
          router.push('/signin');
        }
      } else if (!requireAuth && isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, showAuthModal, router]);

  const handleSignInClick = () => {
    router.push('/signin');
  };

  const handleCloseModal = () => {
    setShowAuthPrompt(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If the user is not authenticated and auth is required, show modal or return null
  if (requireAuth && !isAuthenticated) {
    if (showAuthModal && showAuthPrompt) {
      return (
        <div className="flex flex-col min-h-screen">
          {/* Render the children with an auth overlay */}
          <div className="flex-grow">
            {children}
          </div>

          {/* Auth Modal */}
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
              <p className="mb-6">Please sign in to access this feature.</p>
              <div className="flex space-x-4">
                <button
                  onClick={handleSignInClick}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
                >
                  Sign In
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  // If the user is authenticated but auth is not required (e.g., on sign-in page), don't render children
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;