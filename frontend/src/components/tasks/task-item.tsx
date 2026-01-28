import React, { useState } from 'react';
import apiClient from '../../services/api-client';

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

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate?: (updatedTask: Task) => void; // Optional callback to update task in parent component
}

const TaskItem = ({ task, onToggle, onDelete, onUpdate }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!editedTitle.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedTask = await apiClient.updateTask(task.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim() || '',
        priority: editedPriority,
        due_date: task.due_date // Keep original due date unless we want to allow editing it
      });

      // Update the task in the parent component
      if (onUpdate) {
        onUpdate(updatedTask);
      }

      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800 border border-accent-300';
      case 'medium':
        return 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 border border-secondary-300';
      case 'low':
        return 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  return (
    <li className="py-4 transition-all duration-300 hover:bg-primary-50/70 p-3 rounded-xl border border-primary-100/50 slide-in">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, task.completed)}
          className="h-6 w-6 text-primary-600 rounded-full focus:ring-primary-500 cursor-pointer transition-transform duration-200 hover:scale-110 pulse-glow"
        />

        <div className="ml-4 flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3 bounce-in bg-white/50 p-4 rounded-xl border border-primary-100 pulse-element">
              {error && (
                <div className="bg-red-50 border-l-4 border-error text-error px-4 py-3 rounded-lg mb-4 animate-pulse shadow-sm">
                  {error}
                </div>
              )}
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="block w-full rounded-lg border-primary-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-2 border-primary-300 p-3 bg-white pulse-element"
                placeholder="Task title"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="block w-full rounded-lg border-primary-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-2 border-primary-300 p-3 bg-white pulse-element"
                placeholder="Task description"
              />
              <select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value)}
                className="block w-full rounded-lg border-primary-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-2 border-primary-300 p-3 bg-white pulse-element"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-300 hover:scale-105 ${
                    loading
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 pulse-glow'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span>
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-2">💾</span>
                      Update
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-lg shadow-sm text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 hover:scale-105 pulse-glow"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="transition-all duration-300 hover:scale-[1.01] pulse-element">
              <p className={`text-base font-semibold transition-all duration-300 ${task.completed ? 'line-through text-primary-400' : 'text-primary-800'}`}>
                {task.title}
              </p>
              {task.description && (
                <p className={`text-sm mt-1 transition-all duration-300 ${task.completed ? 'line-through text-primary-400' : 'text-primary-600'}`}>
                  {task.description}
                </p>
              )}
              <div className="flex items-center mt-2 flex-wrap gap-2">
                {task.due_date && (
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full pulse-element">
                    📅 Due: {formatDate(task.due_date)}
                  </span>
                )}
                <span className={`text-xs px-3 py-1 rounded-full ${getPriorityClass(task.priority)} font-medium transition-all duration-300 pulse-element`}>
                  ⭐ {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 hover:scale-110 pulse-glow"
            >
              ✏️ Edit
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-error bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover:scale-110 pulse-glow"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;