import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import apiClient from '../../services/api-client';

interface TaskFormProps {
  onClose?: () => void;
  onTaskCreated?: (task: any) => void;
}

const TaskForm = ({ onClose, onTaskCreated }: TaskFormProps) => {
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate || undefined,
        priority
      };

      const newTask = await apiClient.createTask(taskData);
      if (onTaskCreated) {
        onTaskCreated(newTask);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');

      if (onClose) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="bg-gradient-to-br from-white to-primary-50/50 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-primary-200 bounce-in">
      <h3 className="text-lg font-bold text-primary-800 mb-6 flex items-center pb-3 border-b border-primary-100">
        <span className="mr-3 text-xl">📝</span>
        Create New Task
      </h3>

      {error && (
        <div className="bg-red-50 border-l-4 border-error text-error px-4 py-3 rounded-lg mb-6 animate-pulse shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="fade-in">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="title" className="block text-sm font-medium text-primary-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-xl border-primary-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border-2 border-primary-200 transition-all duration-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 bg-white/80"
              placeholder="What needs to be done?"
              required
              disabled={!isAuthenticated}
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-primary-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-xl border-primary-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border-2 border-primary-200 transition-all duration-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 bg-white/80"
              placeholder="Add details..."
              disabled={!isAuthenticated}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="dueDate" className="block text-sm font-medium text-primary-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-xl border-primary-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border-2 border-primary-200 transition-all duration-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 bg-white/80"
              disabled={!isAuthenticated}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="priority" className="block text-sm font-medium text-primary-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-xl border-primary-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border-2 border-primary-200 transition-all duration-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 bg-white/80"
              disabled={!isAuthenticated}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end space-x-4 pt-4 border-t border-primary-100">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !isAuthenticated}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              loading || !isAuthenticated
                ? 'bg-primary-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 hover:scale-105 shadow-md'
            } text-white`}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Creating...
              </span>
            ) : !isAuthenticated ? (
              <span className="flex items-center">
                <span className="mr-2">🔒</span>
                Sign In Required
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">✅</span>
                Create Task
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-6">Please sign in to create tasks.</p>
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

export default TaskForm;