/**
 * React Hook for Task Agent
 * Provides a way to interact with the TaskAgent in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { TaskAgent } from './task-agent';
import type { Task, TaskFilterOptions } from './task-agent';

export const useTaskAgent = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    overdue: 0
  });

  // Initialize the agent
  const agent = TaskAgent.getInstance();

  // Refresh tasks from agent
  const refreshTasks = useCallback(() => {
    const allTasks = agent.getTasks();
    setTasks(allTasks);

    const taskStats = agent.getTaskStats();
    setStats(taskStats);
  }, [agent]);

  // Initialize and refresh tasks
  useEffect(() => {
    refreshTasks();
    setLoading(false);
  }, [refreshTasks]);

  // Create a new task
  const createTask = useCallback((title: string, description?: string, dueDate?: Date, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newTask = agent.createTask(title, description, dueDate, priority);
    setTasks(prev => [...prev, newTask]);
    setStats(agent.getTaskStats());
    return newTask;
  }, [agent]);

  // Update a task
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const updatedTask = agent.updateTask(id, updates);
    if (updatedTask) {
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      setStats(agent.getTaskStats());
    }
    return updatedTask;
  }, [agent]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((id: string) => {
    const updatedTask = agent.toggleTaskCompletion(id);
    if (updatedTask) {
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      setStats(agent.getTaskStats());
    }
    return updatedTask;
  }, [agent]);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    const success = agent.deleteTask(id);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id));
      setStats(agent.getTaskStats());
    }
    return success;
  }, [agent]);

  // Get tasks with filters
  const getFilteredTasks = useCallback((options: TaskFilterOptions = {}) => {
    return agent.getTasks(options);
  }, [agent]);

  // Clear completed tasks
  const clearCompletedTasks = useCallback(() => {
    const removedCount = agent.clearCompletedTasks();
    if (removedCount > 0) {
      refreshTasks(); // Refresh the state to match the agent's state
    }
    return removedCount;
  }, [agent, refreshTasks]);

  // Set a reminder for a task
  const setReminder = useCallback((taskId: string, reminderTime: Date) => {
    return agent.setReminder(taskId, reminderTime);
  }, [agent]);

  return {
    tasks,
    loading,
    stats,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    getFilteredTasks,
    clearCompletedTasks,
    setReminder,
    refreshTasks
  };
};