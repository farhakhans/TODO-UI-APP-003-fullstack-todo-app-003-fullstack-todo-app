/**
 * AI Assistant Agent
 * Provides intelligent assistance for task management
 */

import { Task } from './task-agent-api';

interface AIRecommendation {
  taskId: string;
  title: string;
  recommendation: string;
  priorityAdjustment?: 'higher' | 'lower' | 'same';
  estimatedTime?: number; // in minutes
}

class AIAssistantAgent {
  private static instance: AIAssistantAgent;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): AIAssistantAgent {
    if (!AIAssistantAgent.instance) {
      AIAssistantAgent.instance = new AIAssistantAgent();
    }
    return AIAssistantAgent.instance;
  }

  /**
   * Analyze tasks and provide recommendations
   */
  public async analyzeTasks(tasks: Task[]): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    for (const task of tasks) {
      // Analyze each task and provide personalized recommendations
      const recommendation = this.generateRecommendationForTask(task);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    return recommendations;
  }

  /**
   * Generate a recommendation for a specific task
   */
  private generateRecommendationForTask(task: Task): AIRecommendation | null {
    const now = new Date();
    const dueDate = task.due_date ? new Date(task.due_date) : null;

    // Recommendation based on priority and due date
    if (dueDate && dueDate < new Date(Date.now() + 24 * 60 * 60 * 1000)) { // Due within 24 hours
      return {
        taskId: task.id,
        title: task.title,
        recommendation: `This task "${task.title}" is due soon. Consider working on it now.`,
        priorityAdjustment: 'higher',
        estimatedTime: this.estimateTimeForTask(task)
      };
    }

    // Recommendation based on priority level
    if (task.priority === 'high' && !task.completed) {
      return {
        taskId: task.id,
        title: task.title,
        recommendation: `High priority task "${task.title}" detected. Consider moving this up in your queue.`,
        priorityAdjustment: 'same',
        estimatedTime: this.estimateTimeForTask(task)
      };
    }

    // Recommendation for overdue tasks
    if (dueDate && dueDate < now && !task.completed) {
      return {
        taskId: task.id,
        title: task.title,
        recommendation: `Task "${task.title}" is overdue. Urgent attention required.`,
        priorityAdjustment: 'higher',
        estimatedTime: this.estimateTimeForTask(task)
      };
    }

    // General recommendation for medium priority tasks
    if (task.priority === 'medium' && !task.completed) {
      return {
        taskId: task.id,
        title: task.title,
        recommendation: `Consider scheduling "${task.title}" for later today or tomorrow.`,
        priorityAdjustment: 'same',
        estimatedTime: this.estimateTimeForTask(task)
      };
    }

    return null;
  }

  /**
   * Estimate time required for a task based on its properties
   */
  private estimateTimeForTask(task: Task): number {
    // Base time estimation based on title length and priority
    let timeEstimate = 15; // Base time in minutes

    // Longer titles might indicate more complex tasks
    if (task.title.length > 50) {
      timeEstimate += 15;
    }

    // Priority affects time allocation
    switch(task.priority) {
      case 'high':
        timeEstimate += 30;
        break;
      case 'medium':
        timeEstimate += 20;
        break;
      case 'low':
        timeEstimate += 10;
        break;
    }

    // Description length might indicate complexity
    if (task.description && task.description.length > 100) {
      timeEstimate += 20;
    }

    return timeEstimate;
  }

  /**
   * Generate a daily schedule based on tasks
   */
  public generateDailySchedule(tasks: Task[], availableHours: number = 8): string[] {
    const schedule: string[] = [];
    const incompleteTasks = tasks.filter(task => !task.completed);

    // Sort tasks by priority and urgency
    const sortedTasks = incompleteTasks.sort((a, b) => {
      // Prioritize urgent tasks first
      const aUrgent = this.isTaskUrgent(a) ? 1 : 0;
      const bUrgent = this.isTaskUrgent(b) ? 1 : 0;

      if (aUrgent !== bUrgent) {
        return bUrgent - aUrgent;
      }

      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] -
             priorityOrder[a.priority as keyof typeof priorityOrder];
    });

    let timeAllocated = 0;
    const hoursInMinutes = availableHours * 60;

    for (const task of sortedTasks) {
      const estTime = this.estimateTimeForTask(task);

      if (timeAllocated + estTime <= hoursInMinutes) {
        schedule.push(`${task.title} (${estTime} mins)`);
        timeAllocated += estTime;
      } else {
        break; // Not enough time left in the day
      }
    }

    return schedule;
  }

  /**
   * Check if a task is urgent
   */
  private isTaskUrgent(task: Task): boolean {
    if (task.completed) return false;

    const dueDate = task.due_date ? new Date(task.due_date) : null;
    if (!dueDate) return false;

    const timeUntilDue = dueDate.getTime() - Date.now();
    const hoursUntilDue = timeUntilDue / (1000 * 60 * 60);

    // Urgent if due within 24 hours
    return hoursUntilDue <= 24;
  }

  /**
   * Suggest task grouping based on similarity
   */
  public suggestTaskGrouping(tasks: Task[]): { [category: string]: Task[] } {
    const groupedTasks: { [category: string]: Task[] } = {
      'Work': [],
      'Personal': [],
      'Health': [],
      'Learning': [],
      'Other': []
    };

    for (const task of tasks) {
      if (task.completed) continue;

      const lowerTitle = task.title.toLowerCase();
      const lowerDesc = task.description.toLowerCase();

      if (lowerTitle.includes('work') || lowerTitle.includes('meeting') ||
          lowerTitle.includes('project') || lowerDesc.includes('work')) {
        groupedTasks.Work.push(task);
      } else if (lowerTitle.includes('personal') || lowerTitle.includes('errand') ||
                 lowerTitle.includes('appointment') || lowerDesc.includes('personal')) {
        groupedTasks.Personal.push(task);
      } else if (lowerTitle.includes('health') || lowerTitle.includes('exercise') ||
                 lowerTitle.includes('doctor') || lowerTitle.includes('meditation')) {
        groupedTasks.Health.push(task);
      } else if (lowerTitle.includes('learn') || lowerTitle.includes('study') ||
                 lowerTitle.includes('course') || lowerTitle.includes('read')) {
        groupedTasks.Learning.push(task);
      } else {
        groupedTasks.Other.push(task);
      }
    }

    return groupedTasks;
  }
}

export type { AIRecommendation };
export { AIAssistantAgent };