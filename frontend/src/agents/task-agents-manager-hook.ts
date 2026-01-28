/**
 * React Hook for Task Agents Manager
 * Provides access to multiple specialized agents in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { Task } from './task-agent-api';
import { TaskAgentsManager } from './task-agents-manager';
import type { AgentRecommendations } from './task-agents-manager';

export const useTaskAgents = () => {
  const [agentsManager] = useState(new TaskAgentsManager());
  const [recommendations, setRecommendations] = useState<AgentRecommendations | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get recommendations from all agents
  const getAgentRecommendations = useCallback(async (tasks: Task[]) => {
    try {
      setLoading(true);
      setError(null);

      const agentRecommendations = await agentsManager.getAgentRecommendations(tasks);
      setRecommendations(agentRecommendations);

      return agentRecommendations;
    } catch (err) {
      console.error('Error getting agent recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to get agent recommendations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [agentsManager]);

  // Get AI-specific recommendations
  const getAIRecommendations = useCallback(async (tasks: Task[]) => {
    try {
      setLoading(true);
      setError(null);

      const aiRecommendations = await agentsManager.getAIRecommendations(tasks);

      // Update the main recommendations state to include AI recommendations
      if (recommendations) {
        setRecommendations({
          ...recommendations,
          aiRecommendations
        });
      }

      return aiRecommendations;
    } catch (err) {
      console.error('Error getting AI recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to get AI recommendations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [agentsManager, recommendations]);

  // Get priority analysis
  const getPriorityAnalysis = useCallback(async (tasks: Task[]) => {
    try {
      setLoading(true);
      setError(null);

      const priorityAnalysis = await agentsManager.getPriorityAnalysis(tasks);

      // Update the main recommendations state to include priority analysis
      if (recommendations) {
        setRecommendations({
          ...recommendations,
          priorityAdjustments: priorityAnalysis
        });
      }

      return priorityAnalysis;
    } catch (err) {
      console.error('Error getting priority analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to get priority analysis');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [agentsManager, recommendations]);

  // Get time management analysis
  const getTimeManagementAnalysis = useCallback(async (tasks: Task[]) => {
    try {
      setLoading(true);
      setError(null);

      const timeAnalysis = await agentsManager.getTimeManagementAnalysis(tasks);

      // Update the main recommendations state to include time management analysis
      if (recommendations) {
        setRecommendations({
          ...recommendations,
          timeManagement: timeAnalysis
        });
      }

      return timeAnalysis;
    } catch (err) {
      console.error('Error getting time management analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to get time management analysis');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [agentsManager, recommendations]);

  // Get daily schedule
  const getDailySchedule = useCallback((tasks: Task[], availableHours: number = 8) => {
    return agentsManager.getDailySchedule(tasks, availableHours);
  }, [agentsManager]);

  // Get priority distribution
  const getPriorityDistribution = useCallback((tasks: Task[]) => {
    return agentsManager.getPriorityDistribution(tasks);
  }, [agentsManager]);

  // Get weekly schedule
  const getWeeklySchedule = useCallback((tasks: Task[], workHours: { start: number; end: number } = { start: 9, end: 17 }) => {
    return agentsManager.getWeeklySchedule(tasks, workHours);
  }, [agentsManager]);

  // Suggest priority for new task
  const suggestPriorityForNewTask = useCallback((title: string, description: string, dueDate?: string) => {
    return agentsManager.suggestPriorityForNewTask(title, description, dueDate);
  }, [agentsManager]);

  // Auto-adjust priorities
  const autoAdjustPriorities = useCallback(async (tasks: Task[]) => {
    return await agentsManager.autoAdjustPriorities(tasks);
  }, [agentsManager]);

  // Refresh all recommendations
  const refreshAllRecommendations = useCallback(async (tasks: Task[]) => {
    return await getAgentRecommendations(tasks);
  }, [getAgentRecommendations]);

  return {
    // State
    recommendations,
    loading,
    error,

    // Functions
    getAgentRecommendations,
    getAIRecommendations,
    getPriorityAnalysis,
    getTimeManagementAnalysis,
    getDailySchedule,
    getPriorityDistribution,
    getWeeklySchedule,
    suggestPriorityForNewTask,
    autoAdjustPriorities,
    refreshAllRecommendations
  };
};