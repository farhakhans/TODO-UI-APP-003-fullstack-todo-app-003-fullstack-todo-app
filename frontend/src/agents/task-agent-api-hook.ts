/**
 * React Hook for API-Compatible Task Agent
 * Provides a way to interact with the TaskAgent in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { TaskAgent, Task, TaskFilterOptions } from './task-agent-api';

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
  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      const allTasks = await agent.getTasks('all');
      setTasks(allTasks);

      const taskStats = await agent.getTaskStats();
      setStats(taskStats);
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [agent]);

  // Initialize and refresh tasks
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  // Create a new task
  const createTask = useCallback(async (title: string, description?: string, dueDate?: string, priority: string = 'medium') => {
    try {
      const newTask = await agent.createTask(title, description, dueDate, priority);
      setTasks(prev => [...prev, newTask]);
      setStats(await agent.getTaskStats());
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }, [agent]);

  // Update a task
  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await agent.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      setStats(await agent.getTaskStats());
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }, [agent]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback(async (id: string, completed: boolean) => {
    try {
      const updatedTask = await agent.toggleTaskCompletion(id, completed);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      setStats(await agent.getTaskStats());
      return updatedTask;
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      throw error;
    }
  }, [agent]);

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    try {
      const success = await agent.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
        setStats(await agent.getTaskStats());
      }
      return success;
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }, [agent]);

  // Get tasks with filters
  const getFilteredTasks = useCallback((options: TaskFilterOptions = {}) => {
    return agent.filterTasks(tasks, options);
  }, [agent, tasks]);

  // Clear completed tasks
  const clearCompletedTasks = useCallback(async () => {
    try {
      const removedCount = await agent.clearCompletedTasks();
      if (removedCount > 0) {
        await refreshTasks(); // Refresh the state to match the server
      }
      return removedCount;
    } catch (error) {
      console.error('Failed to clear completed tasks:', error);
      throw error;
    }
  }, [agent, refreshTasks]);

  // Set a reminder for a task
  const setReminder = useCallback((taskId: string, reminderTime: Date, taskTitle: string, taskDescription?: string) => {
    return agent.setReminder(taskId, reminderTime, taskTitle, taskDescription);
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