/**
 * Task Agents Manager
 * Coordinates multiple specialized agents for task management
 */

import { Task } from './task-agent-api';
import { AIAssistantAgent, AIRecommendation } from './ai-assistant-agent';
import { PriorityManagementAgent, PriorityAnalysis } from './priority-management-agent';
import { TimeManagementAgent, TimeAnalysis } from './time-management-agent';

interface AgentRecommendations {
  aiRecommendations: AIRecommendation[];
  priorityAdjustments: PriorityAnalysis;
  timeManagement: TimeAnalysis;
}

class TaskAgentsManager {
  private aiAgent: AIAssistantAgent;
  private priorityAgent: PriorityManagementAgent;
  private timeAgent: TimeManagementAgent;

  constructor() {
    this.aiAgent = AIAssistantAgent.getInstance();
    this.priorityAgent = PriorityManagementAgent.getInstance();
    this.timeAgent = TimeManagementAgent.getInstance();
  }

  /**
   * Get recommendations from all agents
   */
  public async getAgentRecommendations(tasks: Task[]): Promise<AgentRecommendations> {
    // Run all agent analyses in parallel
    const [aiRecommendations, priorityAnalysis, timeAnalysis] = await Promise.all([
      this.aiAgent.analyzeTasks(tasks),
      this.priorityAgent.analyzePriorities(tasks),
      this.timeAgent.analyzeTimeManagement(tasks)
    ]);

    return {
      aiRecommendations,
      priorityAdjustments: priorityAnalysis,
      timeManagement: timeAnalysis
    };
  }

  /**
   * Get AI recommendations only
   */
  public async getAIRecommendations(tasks: Task[]): Promise<AIRecommendation[]> {
    return await this.aiAgent.analyzeTasks(tasks);
  }

  /**
   * Get priority analysis only
   */
  public async getPriorityAnalysis(tasks: Task[]): Promise<PriorityAnalysis> {
    return await this.priorityAgent.analyzePriorities(tasks);
  }

  /**
   * Get time management analysis only
   */
  public async getTimeManagementAnalysis(tasks: Task[]): Promise<TimeAnalysis> {
    return await this.timeAgent.analyzeTimeManagement(tasks);
  }

  /**
   * Get daily schedule recommendations
   */
  public getDailySchedule(tasks: Task[], availableHours: number = 8): string[] {
    return this.aiAgent.generateDailySchedule(tasks, availableHours);
  }

  /**
   * Get priority distribution
   */
  public getPriorityDistribution(tasks: Task[]) {
    return this.priorityAgent.getPriorityDistribution(tasks);
  }

  /**
   * Get weekly schedule
   */
  public getWeeklySchedule(tasks: Task[], workHours: { start: number; end: number } = { start: 9, end: 17 }) {
    return this.timeAgent.generateWeeklySchedule(tasks, workHours);
  }

  /**
   * Suggest priority for a new task
   */
  public suggestPriorityForNewTask(title: string, description: string, dueDate?: string): string {
    return this.priorityAgent.suggestPriorityForNewTask(title, description, dueDate);
  }

  /**
   * Auto-adjust priorities based on analysis
   */
  public async autoAdjustPriorities(tasks: Task[]) {
    return await this.priorityAgent.autoAdjustPriorities(tasks);
  }
}

export { TaskAgentsManager };
export type { AgentRecommendations };