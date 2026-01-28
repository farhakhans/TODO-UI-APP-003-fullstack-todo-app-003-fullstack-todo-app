'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/api-client';

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  logout: (redirectPath?: string) => void;
  checkAuthStatus: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Define the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define all functions first to avoid hoisting issues
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // Update the user in localStorage
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  };

  const logout = async (redirectPath: string = '/signin') => {
    try {
      await apiClient.logout();
    } catch (error) {
      // If logout fails on the server, still remove local token
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }

    // Redirect to the specified path after logout
    if (typeof window !== 'undefined') {
      window.location.href = redirectPath;
    }
  };

  const checkAuthStatus = () => {
    if (typeof window === 'undefined') {
      // Not in browser, can't access localStorage
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real implementation, you might decode the JWT or make a request to verify the token
      // For now, we'll just check if token exists and get user info
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Auth status check error:', error);
        // Remove invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setUser(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Signup can only be performed in the browser');
    }

    setIsLoading(true);
    try {
      console.log('Starting signup process with email:', email);
      const response = await apiClient.signup(email, password);
      console.log('Signup API response:', response);

      if (!response.user || !response.token) {
        throw new Error('Invalid response format from signup API');
      }

      // Store user info and token
      setUser(response.user);
      localStorage.setItem('authUser', JSON.stringify(response.user));
      localStorage.setItem('authToken', response.token);
      console.log('Signup successful, user set and stored');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      // Ensure loading is set to false after signup attempt
      setIsLoading(false);
    }
  };

  const signin = async (email: string, password: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Signin can only be performed in the browser');
    }

    setIsLoading(true);
    try {
      console.log('Starting signin process with email:', email);
      const response = await apiClient.signin(email, password);
      console.log('Signin API response:', response);

      if (!response.user || !response.token) {
        throw new Error('Invalid response format from signin API');
      }

      setUser(response.user);
      localStorage.setItem('authUser', JSON.stringify(response.user));
      localStorage.setItem('authToken', response.token);
      console.log('Signin successful, user set and stored');
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    } finally {
      // Ensure loading is set to false after signin attempt
      setIsLoading(false);
    }
  };

  // Initialize auth status when component mounts
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const checkAuthOnInit = async () => {
        setIsLoading(true);
        try {
          // Check if token exists in localStorage
          const token = localStorage.getItem('authToken');
          if (token) {
            // Verify token by making a simple request to the API
            // For now, we'll just check if the token exists and decode it locally
            // In a real implementation, you might want to make an API call to verify the token
            try {
              // Decode JWT token to check if it's valid (without making API call)
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));

              const tokenPayload = JSON.parse(jsonPayload);
              const exp = tokenPayload.exp;

              // Check if token is expired
              if (exp && Date.now() >= exp * 1000) {
                // Token is expired, remove it
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                setUser(null);
              } else {
                // Token is valid, get user info
                const storedUser = localStorage.getItem('authUser');
                if (storedUser) {
                  setUser(JSON.parse(storedUser));
                }
              }
            } catch (decodeError) {
              console.error('Token decode error:', decodeError);
              // If token is malformed, remove it
              localStorage.removeItem('authToken');
              localStorage.removeItem('authUser');
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Clear any invalid auth data
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuthOnInit();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user && !isLoading,
    isLoading,
    signup,
    signin,
    logout,
    checkAuthStatus,
    updateUser
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};