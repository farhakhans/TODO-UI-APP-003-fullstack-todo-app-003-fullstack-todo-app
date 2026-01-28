'use client';

import React, { useState, useEffect } from 'react';
import { useTaskAgent } from '@/agents/task-agent-api-hook';
import { useTaskAgents } from '@/agents/task-agents-manager-hook';
import { useAuth } from '@/contexts/auth-context';
import BackButton from '@/components/common/BackButton';
import Navbar from '@/components/dashboard/navbar';
import NavbarLayout from '@/components/dashboard/navbar-layout';
import AIChat from '@/components/ai-chat';

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

const TaskAgentPage = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const {
    tasks,
    loading,
    stats,
    createTask,
    toggleTaskCompletion,
    deleteTask,
    clearCompletedTasks,
    setReminder
  } = useTaskAgent();

  // Debug authentication status
  useEffect(() => {
    console.log('Task Agent Page - Auth Status:', {
      isAuthenticated,
      authLoading,
      user: user,
      authToken: localStorage.getItem('authToken')
    });
  }, [isAuthenticated, authLoading, user]);

  const {
    recommendations,
    getAgentRecommendations,
    getDailySchedule,
    getPriorityDistribution,
    getWeeklySchedule,
    suggestPriorityForNewTask,
    autoAdjustPriorities,
    loading: agentsLoading
  } = useTaskAgents();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<string>('medium');
  const [reminderTime, setReminderTime] = useState<string>('');
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [showPriorityAnalysis, setShowPriorityAnalysis] = useState(false);
  const [showTimeManagement, setShowTimeManagement] = useState(false);
  const [dailySchedule, setDailySchedule] = useState<string[]>([]);

  // Update recommendations when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      getAgentRecommendations(tasks);

      // Generate daily schedule
      const schedule = getDailySchedule(tasks);
      setDailySchedule(schedule);
    }
  }, [tasks, getAgentRecommendations, getDailySchedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      // Use the AI agent to suggest a priority if none is set
      let finalPriority = priority;
      if (priority === 'medium') { // If using default priority, get AI suggestion
        finalPriority = suggestPriorityForNewTask(title, description, dueDate);
      }

      // Convert date string to proper format if provided
      let formattedDueDate: string | undefined = undefined;
      if (dueDate) {
        // The date input returns YYYY-MM-DD format, convert to ISO string
        formattedDueDate = new Date(dueDate).toISOString();
      }

      console.log('Creating task with data:', {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: formattedDueDate,
        priority: finalPriority
      });

      await createTask(
        title.trim(),
        description.trim() || undefined,
        formattedDueDate,
        finalPriority
      );

      console.log('Task created successfully');

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    } catch (error) {
      console.error('Failed to create task:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);

      // More specific error message
      if (error instanceof Error) {
        alert(`Failed to create task: ${error.message}`);
      } else {
        alert('Failed to create task. Please try again.');
      }
    }
  };

  // Function to test voice notifications
  const testVoiceNotification = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Testing voice notification. This is a reminder from your task agent.');

      utterance.volume = 1; // 0 to 1
      utterance.rate = 1; // 0.1 to 10
      utterance.pitch = 1; // 0 to 2

      // Try to select a good voice
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(voice =>
        voice.lang.includes('en') || voice.lang.includes('en-US')
      ) || voices[0]; // Fallback to first voice

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      speechSynthesis.speak(utterance);
      alert('Voice notification test played successfully!');
    } else {
      alert('Web Speech API is not supported in your browser');
    }
  };

  const handleSetReminder = (task: Task) => {
    if (!reminderTime) {
      alert('Please select a reminder time');
      return;
    }

    // Ensure the reminder time is converted to Date object properly
    const reminderDateTime = new Date(reminderTime);

    // Check if the date is valid
    if (isNaN(reminderDateTime.getTime())) {
      alert('Invalid date/time format');
      return;
    }

    // Check if the reminder time is in the past
    if (reminderDateTime <= new Date()) {
      alert('Reminder time must be in the future');
      return;
    }

    console.log('Setting reminder with data:', {
      taskId: task.id,
      reminderTime: reminderDateTime,
      taskTitle: task.title,
      taskDescription: task.description
    });

    try {
      const success = setReminder(task.id, reminderDateTime, task.title, task.description);

      if (success) {
        // Play a confirmation sound
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`Reminder set for task: ${task.title}`);

          utterance.volume = 0.8;
          utterance.rate = 1.2;

          const voices = speechSynthesis.getVoices();
          const englishVoice = voices.find(voice =>
            voice.lang.includes('en') || voice.lang.includes('en-US')
          ) || voices[0];

          if (englishVoice) {
            utterance.voice = englishVoice;
          }

          speechSynthesis.speak(utterance);
        }

        alert(`Reminder set successfully for ${reminderDateTime.toLocaleString()}! Voice notification will play when the reminder triggers.`);
      } else {
        alert('Failed to set reminder. Please check the time.');
      }
    } catch (error) {
      console.error('Failed to set reminder:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);

      if (error instanceof Error) {
        alert(`Failed to set reminder: ${error.message}`);
      } else {
        alert('Failed to set reminder. Please try again.');
      }
    }
  };

  // Function to auto-adjust priorities based on AI analysis
  const handleAutoAdjustPriorities = async () => {
    try {
      const adjustments = await autoAdjustPriorities(tasks);

      if (adjustments.length > 0) {
        alert(`Priority adjustments suggested for ${adjustments.length} tasks. Implementing these would require backend changes.`);

        // Log the adjustments for review
        console.log('Priority adjustments:', adjustments);
      } else {
        alert('No priority adjustments needed at this time.');
      }
    } catch (error) {
      console.error('Error adjusting priorities:', error);
      alert('Failed to adjust priorities. Please try again.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>You are not signed in.</strong> Please{' '}
                <a href="/signin" className="underline font-medium text-red-700 hover:text-red-600">
                  sign in
                </a>{' '}
                to create and manage tasks.
              </p>
            </div>
          </div>
        </div>

        {/* Show tasks in read-only mode if any exist */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <h2 className="text-xl font-semibold p-6 pb-4">Task List ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No tasks found. Sign in to create tasks.
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
                        disabled={true} // Disabled since user is not authenticated
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded opacity-50"
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
                          {task.due_date && (
                            <span
                              className={`text-xs ${
                                new Date(task.due_date) < new Date() && !task.completed
                                  ? 'text-red-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {task.description && (
                        <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                      )}
                      <div className="mt-2 text-sm text-gray-400">
                        Sign in to edit this task
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
  }

  // Header component for the task agent page
  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <BackButton href="/dashboard" className="mr-4" />
        <h1 className="text-3xl font-bold text-gray-900">Task Agent Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Welcome, {user?.name || user?.email?.split('@')[0] || 'User'}</span>
        <button
          onClick={() => logout('/')}
          className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <NavbarLayout
      navbar={<Navbar />}
      header={header}
    >
      <div className="max-w-6xl mx-auto p-6">

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

      {/* Agent Recommendations Summary */}
      {recommendations && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-indigo-800">AI Recommendations</h3>
            <p className="text-xl font-bold">{recommendations.aiRecommendations.length}</p>
            <button
              onClick={() => setShowAIRecommendations(!showAIRecommendations)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showAIRecommendations ? 'Hide' : 'Show'} Details
            </button>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800">Priority Score</h3>
            <p className="text-xl font-bold">{recommendations.priorityAdjustments.priorityBalanceScore}%</p>
            <button
              onClick={() => setShowPriorityAnalysis(!showPriorityAnalysis)}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800"
            >
              {showPriorityAnalysis ? 'Hide' : 'Show'} Details
            </button>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-teal-800">Time Efficiency</h3>
            <p className="text-xl font-bold">{recommendations.timeManagement.timeEfficiencyScore}%</p>
            <button
              onClick={() => setShowTimeManagement(!showTimeManagement)}
              className="mt-2 text-sm text-teal-600 hover:text-teal-800"
            >
              {showTimeManagement ? 'Hide' : 'Show'} Details
            </button>
          </div>
        </div>
      )}

      {/* AI Recommendations Section */}
      {showAIRecommendations && recommendations && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
          <div className="space-y-3">
            {recommendations.aiRecommendations.slice(0, 5).map((rec, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded border border-blue-100">
                <p className="text-sm font-medium text-blue-800">{rec.recommendation}</p>
                {rec.priorityAdjustment && (
                  <p className="text-xs text-blue-600 mt-1">Suggested priority: {rec.priorityAdjustment}</p>
                )}
              </div>
            ))}
            {recommendations.aiRecommendations.length === 0 && (
              <p className="text-gray-500 italic">No specific recommendations at this time. Your tasks look well-managed!</p>
            )}
          </div>
        </div>
      )}

      {/* Priority Analysis Section */}
      {showPriorityAnalysis && recommendations && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Priority Analysis</h2>
            <button
              onClick={handleAutoAdjustPriorities}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Auto-Adjust Priorities
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {Object.entries(recommendations.priorityAdjustments.taskCounts).map(([priority, count]) => (
              <div key={priority} className="text-center p-3 bg-gray-50 rounded">
                <p className="text-lg font-bold">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{priority}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Priority Balance Score: {recommendations.priorityAdjustments.priorityBalanceScore}/100</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${recommendations.priorityAdjustments.priorityBalanceScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Time Management Section */}
      {showTimeManagement && recommendations && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Time Management Insights</h2>

          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Daily Schedule Suggestions</h3>
            {dailySchedule.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {dailySchedule.slice(0, 5).map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Complete some tasks to get personalized scheduling suggestions</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Time Efficiency Score: {recommendations.timeManagement.timeEfficiencyScore}/100</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-teal-600 h-2.5 rounded-full"
                style={{ width: `${recommendations.timeManagement.timeEfficiencyScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Task Creation Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button
            onClick={testVoiceNotification}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            🔊 Test Voice
          </button>
        </div>
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
                onChange={(e) => setPriority(e.target.value)}
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

      {/* AI Chat Component */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🤖 AI Task Assistant</h2>
        <AIChat
          tasks={tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || '',
            completed: task.completed,
            priority: task.priority as 'low' | 'medium' | 'high',
            due_date: task.due_date,
            created_at: task.created_at,
            updated_at: task.updated_at,
            user_id: task.user_id
          }))}
          onTaskAction={(action, taskId, params) => {
            switch(action) {
              case 'createTask':
                if (params?.title) {
                  setTitle(params.title);
                  setPriority(params.priority || 'medium');
                  // Submit the form programmatically
                  const formEvent = { preventDefault: () => {} } as React.FormEvent;
                  handleSubmit(formEvent);
                }
                break;
              case 'toggleTask':
                if (taskId) {
                  const task = tasks.find(t => t.id === taskId);
                  if (task) {
                    toggleTaskCompletion(taskId, task.completed);
                  }
                }
                break;
              case 'deleteTask':
                if (taskId) {
                  deleteTask(taskId);
                }
                break;
            }
          }}
        />
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
                      onChange={() => toggleTaskCompletion(task.id, task.completed)}
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
                        {task.due_date && (
                          <span
                            className={`text-xs ${
                              new Date(task.due_date) < new Date() && !task.completed
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {new Date(task.due_date).toLocaleDateString()}
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
                      {task.due_date && !task.completed && (
                        <button
                          onClick={() => handleSetReminder(task)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          ⏰ Set Reminder
                        </button>
                      )}
                      {!task.completed && (
                        <button
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              const utterance = new SpeechSynthesisUtterance(`Task: ${task.title}. ${task.description || ''}`);
                              utterance.volume = 0.8;
                              utterance.rate = 1.0;
                              utterance.pitch = 1.0;

                              const voices = speechSynthesis.getVoices();
                              const englishVoice = voices.find(voice =>
                                voice.lang.includes('en') || voice.lang.includes('en-US')
                              ) || voices[0];

                              if (englishVoice) {
                                utterance.voice = englishVoice;
                              }

                              speechSynthesis.speak(utterance);
                            } else {
                              alert('Web Speech API is not supported in your browser');
                            }
                          }}
                          className="text-sm font-medium text-purple-600 hover:text-purple-900 flex items-center"
                        >
                          🗣️ Read Aloud
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
    </NavbarLayout>
  );
};

export default TaskAgentPage;