import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';
import apiClient from '../../services/api-client';
import TaskItem from './task-item';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  due_date: string;
  priority: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const TaskList = () => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [filter, isAuthenticated]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // In guest mode, show empty tasks or sample tasks
      if (!isAuthenticated) {
        setTasks([]); // Show empty state for guests
      } else {
        const data = await apiClient.getTasks(filter);
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      // Show empty state on error
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    try {
      const updatedTask = await apiClient.toggleTaskCompletion(taskId, !completed);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    try {
      await apiClient.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleAuthPromptClose = () => {
    setShowAuthPrompt(false);
  };

  const handleSignIn = () => {
    // Redirect to sign in page
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-primary-100">
      <div className="flex justify-between items-center mb-6 p-4 bg-white/50 rounded-xl fade-in border border-primary-100">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              filter === 'active'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {tasks.length === 0 && isAuthenticated ? (
        <div className="text-center py-12 fade-in bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl my-4 border-2 border-dashed border-primary-200">
          <p className="text-primary-700 text-lg font-medium">No tasks found. Create your first task!</p>
          <div className="mt-4 text-primary-400 animate-bounce text-2xl">📝</div>
        </div>
      ) : !isAuthenticated ? (
        <div className="text-center py-12 fade-in bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl my-4 border-2 border-dashed border-primary-200">
          <p className="text-primary-700 text-lg font-medium">Sign in to view your tasks</p>
          <div className="mt-4 text-primary-500">Log in to access your personalized task list</div>
        </div>
      ) : (
        <ul className="divide-y divide-primary-100">
          {tasks.map((task, index) => (
            <li key={task.id} className={`fade-in p-2 rounded-lg hover:bg-primary-50/50 transition-all duration-300 floating-element`} style={{animationDelay: `${index * 0.1}s`}}>
              <TaskItem
                task={task}
                onToggle={handleTaskToggle}
                onDelete={handleTaskDelete}
                onUpdate={handleTaskUpdate}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-6">Please sign in to perform this action.</p>
            <div className="flex space-x-4">
              <button
                onClick={handleSignIn}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
              >
                Sign In
              </button>
              <button
                onClick={handleAuthPromptClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;