/**
 * Priority Management Agent
 * Helps manage and optimize task priorities
 */

import { Task } from './task-agent-api';

interface PriorityAdjustment {
  taskId: string;
  oldPriority: string;
  newPriority: string;
  reason: string;
}

interface PriorityAnalysis {
  taskCounts: { [priority: string]: number };
  suggestedAdjustments: PriorityAdjustment[];
  priorityBalanceScore: number; // 0-100 score
}

class PriorityManagementAgent {
  private static instance: PriorityManagementAgent;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): PriorityManagementAgent {
    if (!PriorityManagementAgent.instance) {
      PriorityManagementAgent.instance = new PriorityManagementAgent();
    }
    return PriorityManagementAgent.instance;
  }

  /**
   * Analyze task priorities and suggest adjustments
   */
  public async analyzePriorities(tasks: Task[]): Promise<PriorityAnalysis> {
    const taskCounts: { [priority: string]: number } = {
      high: 0,
      medium: 0,
      low: 0
    };

    const suggestedAdjustments: PriorityAdjustment[] = [];

    // Count tasks by priority
    for (const task of tasks) {
      if (taskCounts.hasOwnProperty(task.priority)) {
        taskCounts[task.priority]++;
      }
    }

    // Analyze each task for potential priority adjustments
    for (const task of tasks) {
      const adjustment = this.evaluatePriorityAdjustment(task, tasks);
      if (adjustment) {
        suggestedAdjustments.push(adjustment);
      }
    }

    // Calculate priority balance score (0-100)
    // A balanced distribution is preferred
    const totalTasks = tasks.length;
    if (totalTasks > 0) {
      // Adjust score based on distribution - too many high priority tasks reduces score
      let balanceScore = 100;

      if (taskCounts.high > totalTasks * 0.5) {
        // Too many high priority tasks
        balanceScore -= (taskCounts.high - (totalTasks * 0.5)) * 20;
      }

      if (balanceScore < 0) balanceScore = 0;

      return {
        taskCounts,
        suggestedAdjustments,
        priorityBalanceScore: Math.round(balanceScore)
      };
    } else {
      return {
        taskCounts,
        suggestedAdjustments,
        priorityBalanceScore: 100
      };
    }
  }

  /**
   * Evaluate if a task's priority should be adjusted
   */
  private evaluatePriorityAdjustment(task: Task, allTasks: Task[]): PriorityAdjustment | null {
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const now = new Date();

    // Check if task is overdue
    if (dueDate && dueDate < now && !task.completed && task.priority !== 'high') {
      return {
        taskId: task.id,
        oldPriority: task.priority,
        newPriority: 'high',
        reason: 'Task is overdue and should be prioritized'
      };
    }

    // Check if task is due soon (within 24 hours) but not high priority
    if (dueDate && dueDate > now &&
        dueDate < new Date(now.getTime() + 24 * 60 * 60 * 1000) &&
        task.priority !== 'high') {
      return {
        taskId: task.id,
        oldPriority: task.priority,
        newPriority: 'high',
        reason: 'Task is due within 24 hours'
      };
    }

    // Check if high priority task is completed
    if (task.completed && task.priority === 'high') {
      return {
        taskId: task.id,
        oldPriority: task.priority,
        newPriority: 'low',
        reason: 'Task is completed, lowering priority for historical purposes'
      };
    }

    // Check if there are too many high priority tasks
    const highPriorityCount = allTasks.filter(t => t.priority === 'high' && !t.completed).length;
    const totalIncomplete = allTasks.filter(t => !t.completed).length;

    if (task.priority === 'high' && !task.completed &&
        highPriorityCount > totalIncomplete * 0.4) { // More than 40% are high priority
      // If this task is not due soon, consider lowering priority
      if (!dueDate || dueDate > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) { // Not due in next week
        return {
          taskId: task.id,
          oldPriority: task.priority,
          newPriority: 'medium',
          reason: 'Too many high priority tasks, this one not urgent'
        };
      }
    }

    // Check if low priority task has no due date and is old
    if (task.priority === 'low' && !task.due_date &&
        new Date(task.created_at) < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) { // Older than 30 days
      return {
        taskId: task.id,
        oldPriority: task.priority,
        newPriority: 'medium',
        reason: 'Old low priority task, deserves review'
      };
    }

    return null;
  }

  /**
   * Automatically adjust priorities based on analysis
   */
  public async autoAdjustPriorities(tasks: Task[]): Promise<PriorityAdjustment[]> {
    const analysis = await this.analyzePriorities(tasks);
    return analysis.suggestedAdjustments;
  }

  /**
   * Get priority distribution statistics
   */
  public getPriorityDistribution(tasks: Task[]): { [priority: string]: { count: number; percentage: number } } {
    const total = tasks.length;
    const distribution: { [priority: string]: { count: number; percentage: number } } = {
      high: { count: 0, percentage: 0 },
      medium: { count: 0, percentage: 0 },
      low: { count: 0, percentage: 0 }
    };

    for (const task of tasks) {
      if (distribution.hasOwnProperty(task.priority)) {
        distribution[task.priority].count++;
      }
    }

    for (const priority in distribution) {
      distribution[priority].percentage = total > 0
        ? Math.round((distribution[priority].count / total) * 100)
        : 0;
    }

    return distribution;
  }

  /**
   * Suggest optimal priority for a new task based on its properties
   */
  public suggestPriorityForNewTask(title: string, description: string, dueDate?: string): string {
    // Analyze title and description for priority indicators
    const lowerTitle = title.toLowerCase();
    const lowerDesc = description.toLowerCase();

    // High priority indicators
    const highIndicators = [
      'urgent', 'asap', 'immediate', 'critical', 'crucial', 'emergency',
      'deadline', 'important', 'high importance', 'top priority', 'rush'
    ];

    // Count high priority indicators
    let highCount = 0;
    for (const indicator of highIndicators) {
      if (lowerTitle.includes(indicator) || lowerDesc.includes(indicator)) {
        highCount++;
      }
    }

    // Check due date urgency
    if (dueDate) {
      const due = new Date(dueDate);
      const now = new Date();
      const daysUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (daysUntilDue <= 1) { // Due today or yesterday
        return highCount > 0 ? 'high' : 'high';
      } else if (daysUntilDue <= 3) { // Due in next 3 days
        return highCount > 0 ? 'high' : 'medium';
      } else if (daysUntilDue <= 7) { // Due in next week
        return highCount > 0 ? 'high' : 'medium';
      }
    }

    // Determine priority based on indicators
    if (highCount >= 2) {
      return 'high';
    } else if (highCount === 1) {
      return 'medium';
    } else {
      // Default to medium unless it seems low priority
      if (lowerTitle.includes('later') || lowerTitle.includes('someday') ||
          lowerTitle.includes('whenever') || lowerDesc.includes('whenever')) {
        return 'low';
      }
      return 'medium';
    }
  }
}

export type { PriorityAdjustment, PriorityAnalysis };
export { PriorityManagementAgent };