import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Initialize the axios instance with base configuration
    // Use environment variable for API URL, fallback to localhost:8080
    const baseURL = typeof window !== 'undefined'
      ? window.location.hostname === 'localhost'
        ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
        : '' // Use relative URLs in production
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'; // Default for server-side rendering

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include JWT token
    this.client.interceptors.request.use(
      (config) => {
        // Don't add token to auth endpoints (signup, signin, etc.)
        // Check if the URL contains auth endpoints to avoid sending token during authentication
        const isAuthEndpoint = config.url?.includes('/api/auth/');

        if (!isAuthEndpoint) {
          const token = localStorage.getItem('authToken');
          if (token) {
            // Ensure the Authorization header is properly formatted
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token might be expired, remove token
          localStorage.removeItem('authToken');
          // Note: Actual navigation should be handled by the calling component
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async signup(email: string, password: string) {
    try {
      const response = await this.client.post('/api/auth/signup', {
        email,
        password,
      });

      // Store the token in localStorage for authentication
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Signup failed');
    }
  }

  async signin(email: string, password: string) {
    try {
      const response = await this.client.post('/api/auth/signin', {
        email,
        password,
      });

      // Store the token in localStorage for authentication
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Signin failed');
    }
  }

  async logout() {
    try {
      await this.client.post('/api/auth/logout');
      // Remove the token from localStorage
      localStorage.removeItem('authToken');
    } catch (error: any) {
      // Even if logout fails on the server, remove local token
      localStorage.removeItem('authToken');
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await this.client.post('/api/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await this.client.post('/api/auth/reset-password', {
        token,
        new_password: newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Password reset failed');
    }
  }

  // Task endpoints
  async getTasks(status?: string, limit: number = 20, offset: number = 0) {
    try {
      const params: any = {};
      if (status) params.status = status;
      params.limit = limit;
      params.offset = offset;

      const response = await this.client.get('/api/tasks', { params });
      // Since API now returns just the array, return it directly
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch tasks');
    }
  }

  async createTask(taskData: { title: string; description?: string; due_date?: string; priority?: string }) {
    try {
      const response = await this.client.post('/api/tasks', taskData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Specifically handle unauthorized errors
        throw new Error('Authentication required. Please sign in to create tasks.');
      }
      throw new Error(error.response?.data?.detail || 'Failed to create task');
    }
  }

  async getTaskById(taskId: string) {
    try {
      const response = await this.client.get(`/api/tasks/${taskId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch task');
    }
  }

  async updateTask(taskId: string, taskData: any) {
    try {
      const response = await this.client.put(`/api/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update task');
    }
  }

  async deleteTask(taskId: string) {
    try {
      await this.client.delete(`/api/tasks/${taskId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete task');
    }
  }

  async toggleTaskCompletion(taskId: string, completed: boolean) {
    try {
      const response = await this.client.patch(`/api/tasks/${taskId}/toggle-complete`, {
        completed
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update task completion status');
    }
  }
}

export default new ApiClient();