import React from 'react';
import { useAuth } from '../../contexts/auth-context';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className = '' }: LogoutButtonProps) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to sign in page after logout
      window.location.href = '/signin';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
    >
      Sign out
    </button>
  );
};

export default LogoutButton;