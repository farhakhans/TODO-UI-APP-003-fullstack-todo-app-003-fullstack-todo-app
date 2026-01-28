/**
 * Task Agent Display Component
 * Demonstrates the usage of the Task Agent in a React component
 */

import React, { useState } from 'react';
import { useTaskAgent } from '@/agents/task-agent-hook';
import type { Task } from '@/agents/task-agent';

const TaskAgentDisplay: React.FC = () => {
  const {
    tasks,
    loading,
    stats,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    clearCompletedTasks,
    setReminder
  } = useTaskAgent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [reminderTime, setReminderTime] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    createTask(
      title.trim(),
      description.trim() || undefined,
      dueDate ? new Date(dueDate) : undefined,
      priority
    );

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };

  const handleSetReminder = (taskId: string, selectedTime: string) => {
    if (!selectedTime) {
      alert('Please select a reminder time');
      return;
    }

    const reminderDateTime = new Date(selectedTime);
    const success = setReminder(taskId, reminderDateTime);

    if (success) {
      alert('Reminder set successfully!');
    } else {
      alert('Failed to set reminder. Please check the time.');
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Task Agent Dashboard</h1>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Total</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Completed</h3>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800">Active</h3>
          <p className="text-2xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Overdue</h3>
          <p className="text-2xl font-bold">{stats.overdue}</p>
        </div>
      </div>

      {/* Task Creation Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Task title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Time
              </label>
              <input
                type="datetime-local"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Task description"
              rows={2}
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Clear Completed Button */}
      {stats.completed > 0 && (
        <div className="mb-6">
          <button
            onClick={clearCompletedTasks}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Clear Completed Tasks ({stats.completed})
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 pb-4">Task List ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No tasks found. Create a new task to get started.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`task-${task.id}`}
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span
                            className={`text-xs ${
                              new Date(task.dueDate) < new Date() && !task.completed
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                    )}
                    <div className="mt-2 flex items-center space-x-4">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                      {task.dueDate && !task.completed && (
                        <button
                          onClick={() => handleSetReminder(task.id, reminderTime)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-900"
                        >
                          Set Reminder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskAgentDisplay;